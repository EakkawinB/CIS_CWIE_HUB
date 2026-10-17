import sys
import types
import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
from uuid import uuid4

from sqlalchemy.orm import declarative_base


fake_database = types.ModuleType("app.database")
fake_database.Base = declarative_base()
sys.modules.setdefault("app.database", fake_database)

from app.services.application_service import _to_staff_application_response


class StaffApplicationDisplayTests(unittest.TestCase):
    def test_maps_existing_relationships_to_display_fields(self):
        now = datetime.now(timezone.utc)
        company = SimpleNamespace(company_name="Example Company")
        position = SimpleNamespace(
            position_name="Software Intern",
            company=company,
        )
        student = SimpleNamespace(
            first_name="Test",
            last_name="Student",
            student_id="65000001",
        )
        application = SimpleNamespace(
            application_id=uuid4(),
            student_id=1,
            position_id=uuid4(),
            status="applied",
            interview_at=None,
            interview_channel=None,
            interview_location=None,
            interview_details=None,
            interview_attended=None,
            interview_completed_at=None,
            rejection_reason=None,
            outcome_recorded_by=None,
            outcome_recorded_at=None,
            applied_at=now,
            created_at=now,
            updated_at=now,
            student=student,
            position=position,
        )

        response = _to_staff_application_response(application)

        self.assertEqual(response.student_name, "Test Student")
        self.assertEqual(response.student_code, "65000001")
        self.assertEqual(response.company_name, "Example Company")
        self.assertEqual(response.position_name, "Software Intern")

    def test_missing_optional_relationships_use_none(self):
        now = datetime.now(timezone.utc)
        application = SimpleNamespace(
            application_id=uuid4(),
            student_id=1,
            position_id=uuid4(),
            status="applied",
            interview_at=None,
            interview_channel=None,
            interview_location=None,
            interview_details=None,
            interview_attended=None,
            interview_completed_at=None,
            rejection_reason=None,
            outcome_recorded_by=None,
            outcome_recorded_at=None,
            applied_at=now,
            created_at=now,
            updated_at=now,
            student=None,
            position=None,
        )

        response = _to_staff_application_response(application)

        self.assertIsNone(response.student_name)
        self.assertIsNone(response.student_code)
        self.assertIsNone(response.company_name)
        self.assertIsNone(response.position_name)


if __name__ == "__main__":
    unittest.main()
