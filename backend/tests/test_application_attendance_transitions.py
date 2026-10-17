import sys
import types
import unittest
from types import SimpleNamespace
from unittest.mock import Mock, patch
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy.orm import declarative_base


# Import the service without loading the project's real database configuration.
fake_database = types.ModuleType("app.database")
fake_database.Base = declarative_base()
sys.modules.setdefault("app.database", fake_database)

from app.services import application_service


class AttendanceTransitionTests(unittest.TestCase):
    def setUp(self):
        self.current_user = {"sub": str(uuid4()), "role": "staff"}
        self.application_id = uuid4()
        self.student_id = 1
        self.position_id = uuid4()
        self.staff = SimpleNamespace(staff_id=uuid4())

    def _application(self, status, attendance=None):
        return SimpleNamespace(
            application_id=self.application_id,
            student_id=self.student_id,
            position_id=self.position_id,
            status=status,
            interview_attended=attendance,
            outcome_recorded_by=None,
            outcome_recorded_at=None,
        )

    def _database_without_internship(self):
        db = Mock()
        db.query.return_value.filter.return_value.first.return_value = None
        return db

    def test_waiting_result_allows_every_attendance_value(self):
        for attendance in (None, True, False):
            with self.subTest(attendance=attendance):
                db = Mock()
                application = self._application(
                    "interview_scheduled",
                    attendance,
                )
                with (
                    patch.object(
                        application_service,
                        "_get_staff_for_user",
                        return_value=self.staff,
                    ),
                    patch.object(
                        application_service,
                        "_get_locked_application",
                        return_value=application,
                    ),
                ):
                    result = application_service.mark_waiting_result(
                        db,
                        self.current_user,
                        self.application_id,
                    )

                self.assertIs(result, application)
                self.assertEqual(application.status, "waiting_result")
                db.commit.assert_called_once_with()
                db.refresh.assert_called_once_with(application)

    def test_accept_allows_every_attendance_value(self):
        for attendance in (None, True, False):
            with self.subTest(attendance=attendance):
                db = self._database_without_internship()
                application = self._application(
                    "interview_scheduled",
                    attendance,
                )
                with (
                    patch.object(
                        application_service,
                        "_get_staff_for_user",
                        return_value=self.staff,
                    ),
                    patch.object(
                        application_service,
                        "_get_locked_application",
                        return_value=application,
                    ),
                ):
                    internship = application_service.accept_application(
                        db,
                        self.current_user,
                        self.application_id,
                    )

                self.assertEqual(application.status, "accepted")
                self.assertEqual(internship.student_id, self.student_id)
                self.assertEqual(internship.position_id, self.position_id)
                db.add.assert_called_once_with(internship)
                db.commit.assert_called_once_with()

    def test_direct_accept_without_interview_remains_allowed(self):
        db = self._database_without_internship()
        application = self._application("applied")
        with (
            patch.object(
                application_service,
                "_get_staff_for_user",
                return_value=self.staff,
            ),
            patch.object(
                application_service,
                "_get_locked_application",
                return_value=application,
            ),
        ):
            application_service.accept_application(
                db,
                self.current_user,
                self.application_id,
            )

        self.assertEqual(application.status, "accepted")

    def test_terminal_application_cannot_be_accepted(self):
        for terminal_status in ("accepted", "rejected"):
            with self.subTest(status=terminal_status):
                db = Mock()
                application = self._application(terminal_status)
                with (
                    patch.object(
                        application_service,
                        "_get_staff_for_user",
                        return_value=self.staff,
                    ),
                    patch.object(
                        application_service,
                        "_get_locked_application",
                        return_value=application,
                    ),
                ):
                    with self.assertRaises(HTTPException) as raised:
                        application_service.accept_application(
                            db,
                            self.current_user,
                            self.application_id,
                        )

                self.assertEqual(raised.exception.status_code, 409)
                db.commit.assert_not_called()

    def test_existing_internship_still_returns_conflict(self):
        db = Mock()
        db.query.return_value.filter.return_value.first.return_value = object()
        application = self._application("waiting_result")
        with (
            patch.object(
                application_service,
                "_get_staff_for_user",
                return_value=self.staff,
            ),
            patch.object(
                application_service,
                "_get_locked_application",
                return_value=application,
            ),
        ):
            with self.assertRaises(HTTPException) as raised:
                application_service.accept_application(
                    db,
                    self.current_user,
                    self.application_id,
                )

        self.assertEqual(raised.exception.status_code, 409)
        db.rollback.assert_called_once_with()
        db.commit.assert_not_called()


if __name__ == "__main__":
    unittest.main()
