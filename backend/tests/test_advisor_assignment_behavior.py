import os
import sys
import types
import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import Mock, patch
from uuid import uuid4

os.environ["PYTHONDONTWRITEBYTECODE"] = "1"

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import declarative_base


# Keep these tests offline: importing project models must not create the real
# engine or load production database settings.
fake_database = types.ModuleType("app.database")
fake_database.Base = declarative_base()
sys.modules.setdefault("app.database", fake_database)

from app.models.advisor import Advisor
from app.models.advisor_assignment import AdvisorStudentAssignment
from app.models.student import Student
from app.core.dependencies import require_role
from app.services import advisor_assignment_service


class QueryStub:
    def __init__(self, *, first=None, rows=None):
        self.first_value = first
        self.rows = rows or []
        self.filter_args = []

    def filter(self, *args):
        self.filter_args.extend(args)
        return self

    def join(self, *args):
        return self

    def options(self, *args):
        return self

    def order_by(self, *args):
        return self

    def with_for_update(self):
        return self

    def first(self):
        return self.first_value

    def all(self):
        return self.rows


class UniqueViolation:
    def __init__(self, constraint_name):
        self.diag = SimpleNamespace(constraint_name=constraint_name)


class AdvisorAssignmentBehaviorTests(unittest.TestCase):
    def setUp(self):
        self.current_user = {"sub": str(uuid4()), "role": "staff"}
        self.staff = SimpleNamespace(staff_id=uuid4())
        self.student = SimpleNamespace(
            id=1,
            student_id="6500000001",
            first_name="Student",
            last_name="One",
            email="student@example.test",
        )
        self.company = SimpleNamespace(company_name="Example Company")
        self.position = SimpleNamespace(
            position_name="Software Intern",
            company=self.company,
        )
        self.application = SimpleNamespace(status="accepted")
        self.internship = SimpleNamespace(
            internship_id=uuid4(),
            student=self.student,
            student_id=self.student.id,
            application=self.application,
            position=self.position,
            status="placed",
            start_date=None,
            end_date=None,
        )
        self.advisor = SimpleNamespace(
            advisor_id=uuid4(),
            first_name="Advisor",
            last_name="One",
            user=SimpleNamespace(role="advisor", is_active=True),
        )

    def _creation_db(self, *, existing_assignment=None):
        db = Mock()
        student_query = QueryStub(first=self.student)
        assignment_query = QueryStub(first=existing_assignment)
        advisor_query = QueryStub(first=self.advisor)

        def query(*entities):
            first_entity = entities[0]
            if first_entity is Student:
                return student_query
            if first_entity is AdvisorStudentAssignment:
                return assignment_query
            if first_entity is Advisor:
                return advisor_query
            raise AssertionError(f"Unexpected query entity: {first_entity}")

        db.query.side_effect = query

        def refresh(assignment):
            assignment.assignment_id = uuid4()
            assignment.assigned_at = datetime.now(timezone.utc)

        db.refresh.side_effect = refresh
        return db

    def _create(self, db):
        with (
            patch.object(
                advisor_assignment_service,
                "_get_staff_for_user",
                return_value=self.staff,
            ),
            patch.object(
                advisor_assignment_service,
                "_internship_query",
                return_value=QueryStub(first=self.internship),
            ),
        ):
            return advisor_assignment_service.create_assignment(
                db,
                self.current_user,
                self.student.id,
                self.advisor.advisor_id,
            )

    def test_valid_assignment_is_committed_and_serialized(self):
        db = self._creation_db()
        response = self._create(db)

        db.add.assert_called_once()
        db.commit.assert_called_once_with()
        db.refresh.assert_called_once()
        db.rollback.assert_not_called()
        self.assertEqual(response.student_id, self.student.id)
        self.assertEqual(response.advisor_id, self.advisor.advisor_id)
        self.assertIsNone(response.start_date)
        self.assertIsNone(response.end_date)
        serialized = response.model_dump(mode="json")
        self.assertIsInstance(serialized["assignment_id"], str)
        self.assertIsInstance(serialized["advisor_id"], str)
        self.assertIsNone(serialized["start_date"])

    def test_eligible_student_response_uses_internship_relationships(self):
        db = Mock()
        db.query.return_value = select(AdvisorStudentAssignment.student_id)
        with (
            patch.object(
                advisor_assignment_service,
                "_get_staff_for_user",
                return_value=self.staff,
            ),
            patch.object(
                advisor_assignment_service,
                "_internship_query",
                return_value=QueryStub(rows=[self.internship]),
            ),
        ):
            responses = advisor_assignment_service.list_eligible_students(
                db,
                self.current_user,
            )

        self.assertEqual(len(responses), 1)
        self.assertEqual(responses[0].student_id, self.student.id)
        self.assertEqual(responses[0].company_name, "Example Company")
        self.assertEqual(responses[0].position_name, "Software Intern")

    def test_student_without_internship_returns_404_and_rolls_back(self):
        db = self._creation_db()
        with patch.object(
            advisor_assignment_service,
            "_get_staff_for_user",
            return_value=self.staff,
        ), patch.object(
            advisor_assignment_service,
            "_internship_query",
            return_value=QueryStub(first=None),
        ):
            with self.assertRaises(HTTPException) as raised:
                advisor_assignment_service.create_assignment(
                    db,
                    self.current_user,
                    self.student.id,
                    self.advisor.advisor_id,
                )

        self.assertEqual(raised.exception.status_code, 404)
        db.rollback.assert_called_once_with()
        db.commit.assert_not_called()

    def test_non_accepted_application_returns_409(self):
        self.application.status = "waiting_result"
        db = self._creation_db()
        with self.assertRaises(HTTPException) as raised:
            self._create(db)
        self.assertEqual(raised.exception.status_code, 409)
        db.rollback.assert_called_once_with()
        db.commit.assert_not_called()

    def test_existing_assignment_returns_409(self):
        db = self._creation_db(existing_assignment=object())
        with self.assertRaises(HTTPException) as raised:
            self._create(db)
        self.assertEqual(raised.exception.status_code, 409)
        db.rollback.assert_called_once_with()
        db.commit.assert_not_called()

    def test_inactive_or_wrong_role_advisor_returns_409(self):
        for role, is_active in (("advisor", False), ("staff", True)):
            with self.subTest(role=role, is_active=is_active):
                self.advisor.user.role = role
                self.advisor.user.is_active = is_active
                db = self._creation_db()
                with self.assertRaises(HTTPException) as raised:
                    self._create(db)
                self.assertEqual(raised.exception.status_code, 409)
                db.rollback.assert_called_once_with()
                db.commit.assert_not_called()

    def test_duplicate_unique_violation_returns_409(self):
        db = self._creation_db()
        db.commit.side_effect = IntegrityError(
            "insert",
            {},
            UniqueViolation("uq_advisor_student_assignments_student_id"),
        )
        with self.assertRaises(HTTPException) as raised:
            self._create(db)
        self.assertEqual(raised.exception.status_code, 409)
        db.rollback.assert_called_once_with()

    def test_unrelated_integrity_error_returns_500(self):
        db = self._creation_db()
        db.commit.side_effect = IntegrityError(
            "insert",
            {},
            UniqueViolation("another_constraint"),
        )
        with self.assertRaises(HTTPException) as raised:
            self._create(db)
        self.assertEqual(raised.exception.status_code, 500)
        self.assertEqual(raised.exception.detail, "Unable to create advisor assignment")
        db.rollback.assert_called_once_with()

    def test_refresh_failure_reports_saved_state_without_rollback(self):
        db = self._creation_db()
        db.refresh.side_effect = RuntimeError("offline refresh failure")
        with self.assertRaises(HTTPException) as raised:
            self._create(db)
        self.assertEqual(raised.exception.status_code, 500)
        self.assertIn("was saved", raised.exception.detail)
        db.commit.assert_called_once_with()
        db.rollback.assert_not_called()

    def test_one_advisor_can_receive_multiple_students_with_null_dates(self):
        second_student = SimpleNamespace(
            id=2,
            student_id="6500000002",
            first_name="Student",
            last_name="Two",
            email="student2@example.test",
        )
        assignments = []
        rows = []
        for student in (self.student, second_student):
            assignment = SimpleNamespace(student=student)
            internship = SimpleNamespace(
                position=self.position,
                status="placed",
                start_date=None,
                end_date=None,
            )
            assignments.append(assignment)
            rows.append((assignment, internship))

        db = Mock()
        assignment_query = QueryStub(rows=rows)
        db.query.return_value = assignment_query
        with patch.object(
            advisor_assignment_service,
            "_get_advisor_for_user",
            return_value=self.advisor,
        ):
            responses = advisor_assignment_service.list_my_advisor_students(
                db,
                {"sub": str(uuid4()), "role": "advisor"},
            )

        self.assertEqual(len(responses), 2)
        self.assertTrue(all(item.start_date is None for item in responses))
        self.assertTrue(all(item.end_date is None for item in responses))
        self.assertEqual(
            assignment_query.filter_args[0].right.value,
            self.advisor.advisor_id,
        )

    def test_student_owner_receives_only_own_assignment(self):
        assignment = SimpleNamespace(advisor=self.advisor)
        with (
            patch.object(
                advisor_assignment_service,
                "_get_student_for_user",
                return_value=self.student,
            ),
            patch.object(
                advisor_assignment_service,
                "_assignment_query",
                return_value=QueryStub(first=assignment),
            ),
        ):
            response = advisor_assignment_service.get_my_advisor(
                Mock(),
                {"sub": str(uuid4()), "role": "student"},
            )

        self.assertEqual(response.advisor_id, self.advisor.advisor_id)
        self.assertEqual(response.advisor_name, "Advisor One")

    def test_unassigned_student_receives_nullable_advisor_fields(self):
        with (
            patch.object(
                advisor_assignment_service,
                "_get_student_for_user",
                return_value=self.student,
            ),
            patch.object(
                advisor_assignment_service,
                "_assignment_query",
                return_value=QueryStub(first=None),
            ),
        ):
            response = advisor_assignment_service.get_my_advisor(
                Mock(),
                {"sub": str(uuid4()), "role": "student"},
            )

        self.assertIsNone(response.advisor_id)
        self.assertIsNone(response.advisor_name)

    def test_role_guard_rejects_wrong_role_offline(self):
        staff_guard = require_role("staff")
        with self.assertRaises(HTTPException) as raised:
            staff_guard({"sub": str(uuid4()), "role": "advisor"})
        self.assertEqual(raised.exception.status_code, 403)

    def test_role_guard_accepts_allowed_role_offline(self):
        staff_user = {"sub": str(uuid4()), "role": "staff"}
        staff_guard = require_role("staff")
        self.assertIs(staff_guard(staff_user), staff_user)

    def test_advisor_profile_lookup_uses_jwt_subject(self):
        user_id = uuid4()
        query = QueryStub(first=self.advisor)
        db = Mock()
        db.query.return_value = query
        result = advisor_assignment_service._get_advisor_for_user(
            db,
            {"sub": str(user_id), "role": "advisor"},
        )
        self.assertIs(result, self.advisor)
        self.assertEqual(query.filter_args[0].right.value, user_id)

    def test_student_profile_lookup_uses_jwt_subject(self):
        user_id = uuid4()
        query = QueryStub(first=self.student)
        db = Mock()
        db.query.return_value = query
        result = advisor_assignment_service._get_student_for_user(
            db,
            {"sub": str(user_id), "role": "student"},
        )
        self.assertIs(result, self.student)
        self.assertEqual(query.filter_args[0].right.value, user_id)


if __name__ == "__main__":
    unittest.main()
