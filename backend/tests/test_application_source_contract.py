import ast
import unittest
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]


class ApplicationSourceContractTests(unittest.TestCase):
    def test_changed_python_files_have_valid_syntax(self):
        paths = [
            "app/models/application.py",
            "app/models/internship.py",
            "app/schemas/application.py",
            "app/services/application_service.py",
            "app/routers/application.py",
            "app/routers/staff_application.py",
            "app/main.py",
            "alembic/versions/c1a7e4f92b30_add_application_internship_foundation.py",
        ]
        for relative_path in paths:
            path = BACKEND_ROOT / relative_path
            ast.parse(path.read_text(encoding="utf-8"), filename=str(path))

    def test_main_does_not_create_database_tables(self):
        source = (BACKEND_ROOT / "app/main.py").read_text(encoding="utf-8")
        self.assertNotIn("Base.metadata.create_all", source)

    def test_migration_is_additive_and_follows_current_head(self):
        source = (
            BACKEND_ROOT
            / "alembic/versions/c1a7e4f92b30_add_application_internship_foundation.py"
        ).read_text(encoding="utf-8")
        self.assertIn('down_revision: Union[str, Sequence[str], None] = "9f4c2d1a7b6e"', source)
        self.assertIn('op.create_table(\n        "student_applications"', source)
        self.assertIn('op.create_table(\n        "internships"', source)
        self.assertNotIn("op.alter_column", source)
        self.assertNotIn("op.drop_column", source)

    def test_required_database_guards_exist(self):
        migration = (
            BACKEND_ROOT
            / "alembic/versions/c1a7e4f92b30_add_application_internship_foundation.py"
        ).read_text(encoding="utf-8")
        self.assertIn("uq_student_applications_one_active_per_student", migration)
        self.assertIn("uq_internships_student_id", migration)
        self.assertIn("fk_internships_matching_application", migration)

    def test_no_unapproved_interview_confirmed_status(self):
        files = [
            BACKEND_ROOT / "app/models/application.py",
            BACKEND_ROOT / "app/schemas/application.py",
            BACKEND_ROOT / "app/services/application_service.py",
        ]
        combined_source = "\n".join(
            path.read_text(encoding="utf-8") for path in files
        )
        self.assertNotIn("interview_confirmed", combined_source)

    def test_approved_routes_are_declared(self):
        student_router = (
            BACKEND_ROOT / "app/routers/application.py"
        ).read_text(encoding="utf-8")
        staff_router = (
            BACKEND_ROOT / "app/routers/staff_application.py"
        ).read_text(encoding="utf-8")

        self.assertIn('"/applications"', student_router)
        self.assertIn('"/matching/me"', student_router)
        for suffix in [
            '"/applications"',
            '"/applications/{application_id}/interview"',
            '"/applications/{application_id}/attendance"',
            '"/applications/{application_id}/waiting-result"',
            '"/applications/{application_id}/reject"',
            '"/applications/{application_id}/accept"',
        ]:
            self.assertIn(suffix, staff_router)


if __name__ == "__main__":
    unittest.main()
