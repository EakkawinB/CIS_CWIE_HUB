import unittest
from datetime import datetime, timezone
from uuid import uuid4

from pydantic import ValidationError

from app.schemas.application import (
    ApplicationCreate,
    InterviewAttendanceRequest,
    InterviewScheduleRequest,
)


class ApplicationSchemaTests(unittest.TestCase):
    def test_application_rejects_extra_fields(self):
        with self.assertRaises(ValidationError):
            ApplicationCreate(position_id=uuid4(), student_id=1)

    def test_interview_requires_timezone(self):
        with self.assertRaises(ValidationError):
            InterviewScheduleRequest(
                interview_at=datetime(2027, 1, 10, 9, 0),
                interview_channel="phone",
            )

    def test_online_interview_requires_nonblank_location(self):
        with self.assertRaises(ValidationError):
            InterviewScheduleRequest(
                interview_at=datetime(2027, 1, 10, 9, 0, tzinfo=timezone.utc),
                interview_channel="online",
                interview_location="   ",
            )

    def test_onsite_interview_accepts_location(self):
        request = InterviewScheduleRequest(
            interview_at=datetime(2027, 1, 10, 9, 0, tzinfo=timezone.utc),
            interview_channel="onsite",
            interview_location="  Main office  ",
        )
        self.assertEqual(request.interview_location, "Main office")

    def test_phone_interview_does_not_require_location(self):
        request = InterviewScheduleRequest(
            interview_at=datetime(2027, 1, 10, 9, 0, tzinfo=timezone.utc),
            interview_channel="phone",
        )
        self.assertIsNone(request.interview_location)

    def test_attendance_requires_boolean(self):
        with self.assertRaises(ValidationError):
            InterviewAttendanceRequest(attended=None)


if __name__ == "__main__":
    unittest.main()
