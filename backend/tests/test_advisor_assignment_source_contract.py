import ast
from pathlib import Path
import unittest


BACKEND_ROOT = Path(__file__).resolve().parents[1]


class AdvisorAssignmentSourceContractTests(unittest.TestCase):
    def test_all_new_python_files_are_valid_syntax(self):
        paths = [
            BACKEND_ROOT / "app/models/advisor_assignment.py",
            BACKEND_ROOT / "app/schemas/advisor_assignment.py",
            BACKEND_ROOT / "app/services/advisor_assignment_service.py",
            BACKEND_ROOT / "app/routers/advisor_assignment.py",
            BACKEND_ROOT / "alembic/versions/e2b7c91d4a80_add_advisor_student_assignments.py",
        ]
        for path in paths:
            ast.parse(path.read_text(encoding="utf-8"), filename=str(path))

    def test_model_and_migration_enforce_one_assignment_per_student(self):
        model_source = (
            BACKEND_ROOT / "app/models/advisor_assignment.py"
        ).read_text(encoding="utf-8")
        migration_source = (
            BACKEND_ROOT
            / "alembic/versions/e2b7c91d4a80_add_advisor_student_assignments.py"
        ).read_text(encoding="utf-8")
        constraint_name = "uq_advisor_student_assignments_student_id"
        self.assertIn(constraint_name, model_source)
        self.assertIn(constraint_name, migration_source)
        self.assertIn("advisor_student_assignments_pkey", model_source)
        self.assertIn("advisor_student_assignments_pkey", migration_source)
        self.assertNotIn('UniqueConstraint(\n            "advisor_id"', model_source)

    def test_migration_follows_foundation_revision(self):
        source = (
            BACKEND_ROOT
            / "alembic/versions/e2b7c91d4a80_add_advisor_student_assignments.py"
        ).read_text(encoding="utf-8")
        self.assertIn('down_revision: Union[str, Sequence[str], None] = "c1a7e4f92b30"', source)
        self.assertIn('"advisor_student_assignments"', source)
        self.assertNotIn('op.alter_column', source)

    def test_router_uses_role_guards_and_me_paths(self):
        source = (
            BACKEND_ROOT / "app/routers/advisor_assignment.py"
        ).read_text(encoding="utf-8")
        self.assertIn('require_role("staff")', source)
        self.assertIn('require_role("advisor")', source)
        self.assertIn('require_role("student")', source)
        self.assertIn('"/advisors/me/students"', source)
        self.assertIn('"/students/me/advisor"', source)

    def test_service_uses_actual_internship_dates(self):
        source = (
            BACKEND_ROOT / "app/services/advisor_assignment_service.py"
        ).read_text(encoding="utf-8")
        self.assertIn("start_date=internship.start_date", source)
        self.assertIn("end_date=internship.end_date", source)
        self.assertNotIn("position.start_date", source)
        self.assertNotIn("position.end_date", source)

    def test_eligibility_requires_accepted_application_and_internship(self):
        source = (
            BACKEND_ROOT / "app/services/advisor_assignment_service.py"
        ).read_text(encoding="utf-8")
        self.assertIn('StudentApplication.status == "accepted"', source)
        self.assertIn("Internship.student_id == student_id", source)
        self.assertIn("Student is not eligible for advisor assignment", source)

    def test_only_active_advisor_users_are_selectable(self):
        source = (
            BACKEND_ROOT / "app/services/advisor_assignment_service.py"
        ).read_text(encoding="utf-8")
        self.assertIn('User.role == "advisor"', source)
        self.assertIn("User.is_active.is_(True)", source)
        self.assertIn('advisor.user.role != "advisor"', source)
        self.assertIn("not advisor.user.is_active", source)

    def test_duplicate_race_is_translated_to_conflict(self):
        source = (
            BACKEND_ROOT / "app/services/advisor_assignment_service.py"
        ).read_text(encoding="utf-8")
        self.assertIn("with_for_update()", source)
        self.assertIn("except IntegrityError as error", source)
        self.assertIn("_is_student_unique_violation(error)", source)
        self.assertIn("status.HTTP_409_CONFLICT", source)
        self.assertIn("db.rollback()", source)

    def test_no_assignment_mutation_routes_exist(self):
        source = (
            BACKEND_ROOT / "app/routers/advisor_assignment.py"
        ).read_text(encoding="utf-8")
        self.assertNotIn("@router.patch", source)
        self.assertNotIn("@router.put", source)
        self.assertNotIn("@router.delete", source)

    def test_frontend_declares_all_six_api_calls(self):
        source = (
            BACKEND_ROOT.parent / "frontend/src/services/api.ts"
        ).read_text(encoding="utf-8")
        for path in [
            "/staffs/advisor-assignments/eligible-students",
            "/staffs/advisor-assignments/active-advisors",
            "/staffs/advisor-assignments",
            "/advisors/me/students",
            "/students/me/advisor",
        ]:
            self.assertIn(path, source)


if __name__ == "__main__":
    unittest.main()
