"""
Role-Based Access Control (RBAC) catalogue for CIS CWIE Hub.

This module is the backend source of truth for:
  - the role names stored in ``public.users.role``
  - normalization of legacy / dirty role values
  - the permission catalogue used by ``GET /auth/me``

It mirrors ``frontend/lib/rbac.ts``. The frontend uses that file for route
protection only; authorization decisions are always re-checked here on the
server using the role carried by the signed JWT.
"""

from typing import Dict, FrozenSet, Optional

# ---------------------------------------------------------------------------
# Roles (must match the values stored in public.users.role)
# ---------------------------------------------------------------------------

ROLE_STUDENT = "student"
ROLE_ADVISOR = "advisor"
ROLE_MENTOR = "mentor"
ROLE_STAFF = "staff"
ROLE_ADMIN = "admin"

ALL_ROLES = (
    ROLE_STUDENT,
    ROLE_ADVISOR,
    ROLE_MENTOR,
    ROLE_STAFF,
    ROLE_ADMIN,
)

# Legacy names kept so old rows and previously issued tokens keep working.
# "teacher" is the historical academic-profile table in this codebase;
# "adviser" is a common spelling variant.
ROLE_ALIASES: Dict[str, str] = {
    "teacher": ROLE_ADVISOR,
    "adviser": ROLE_ADVISOR,
}

# ---------------------------------------------------------------------------
# Permissions
# ---------------------------------------------------------------------------

PERM_STUDENT_DASHBOARD_ACCESS = "student.dashboard.access"
PERM_STUDENT_PROFILE_READ = "student.profile.read"
PERM_STUDENT_PROFILE_UPDATE = "student.profile.update"
PERM_STUDENT_DOCUMENTS_READ = "student.documents.read"
PERM_STUDENT_DOCUMENTS_SUBMIT = "student.documents.submit"
PERM_STUDENT_APPLICATION_SUBMIT = "student.application.submit"
PERM_STUDENT_MATCHING_READ = "student.matching.read"
PERM_STUDENT_ADVISOR_READ = "student.advisor.read"
PERM_STUDENT_EVALUATION_READ = "student.evaluation.read"
PERM_STUDENT_ANNOUNCEMENTS_READ = "student.announcements.read"
PERM_STUDENT_FEEDBACK_SUBMIT = "student.feedback.submit"

PERM_ADVISOR_DASHBOARD_ACCESS = "advisor.dashboard.access"
PERM_ADVISOR_PROFILE_READ = "advisor.profile.read"
PERM_ADVISOR_STUDENTS_READ = "advisor.students.read"
PERM_ADVISOR_DOCUMENTS_REVIEW = "advisor.documents.review"
PERM_ADVISOR_PROGRESS_READ = "advisor.progress.read"
PERM_ADVISOR_EVALUATION_REVIEW = "advisor.evaluation.review"
PERM_ADVISOR_FEEDBACK_SUBMIT = "advisor.feedback.submit"

PERM_MENTOR_DASHBOARD_ACCESS = "mentor.dashboard.access"
PERM_MENTOR_PROFILE_READ = "mentor.profile.read"
PERM_MENTOR_STUDENTS_READ = "mentor.students.read"
PERM_MENTOR_DOCUMENTS_REVIEW = "mentor.documents.review"
PERM_MENTOR_EVALUATION_SUBMIT = "mentor.evaluation.submit"

PERM_STAFF_DASHBOARD_ACCESS = "staff.dashboard.access"
PERM_STAFF_PROFILE_READ = "staff.profile.read"
PERM_STAFF_STUDENTS_MANAGE = "staff.students.manage"
PERM_STAFF_COMPANIES_MANAGE = "staff.companies.manage"
PERM_STAFF_POSITIONS_MANAGE = "staff.positions.manage"
PERM_STAFF_APPLICATIONS_MANAGE = "staff.applications.manage"
PERM_STAFF_ADVISOR_ASSIGNMENTS_MANAGE = "staff.advisor_assignments.manage"
PERM_STAFF_DOCUMENTS_READ = "staff.documents.read"
PERM_STAFF_ANNOUNCEMENTS_MANAGE = "staff.announcements.manage"
PERM_STAFF_FEEDBACK_MANAGE = "staff.feedback.manage"

PERM_ADMIN_DASHBOARD_ACCESS = "admin.dashboard.access"
PERM_ADMIN_USERS_MANAGE = "admin.users.manage"
PERM_ADMIN_ROLES_MANAGE = "admin.roles.manage"
PERM_ADMIN_CONFIG_MANAGE = "admin.settings.manage"
PERM_ADMIN_REPORTS_READ = "admin.reports.read"
PERM_ADMIN_FEEDBACK_MANAGE = "admin.feedback.manage"

ROLE_PERMISSIONS: Dict[str, FrozenSet[str]] = {
    ROLE_STUDENT: frozenset(
        {
            PERM_STUDENT_DASHBOARD_ACCESS,
            PERM_STUDENT_PROFILE_READ,
            PERM_STUDENT_PROFILE_UPDATE,
            PERM_STUDENT_DOCUMENTS_READ,
            PERM_STUDENT_DOCUMENTS_SUBMIT,
            PERM_STUDENT_APPLICATION_SUBMIT,
            PERM_STUDENT_MATCHING_READ,
            PERM_STUDENT_ADVISOR_READ,
            PERM_STUDENT_EVALUATION_READ,
            PERM_STUDENT_ANNOUNCEMENTS_READ,
            PERM_STUDENT_FEEDBACK_SUBMIT,
        }
    ),
    ROLE_ADVISOR: frozenset(
        {
            PERM_ADVISOR_DASHBOARD_ACCESS,
            PERM_ADVISOR_PROFILE_READ,
            PERM_ADVISOR_STUDENTS_READ,
            PERM_ADVISOR_DOCUMENTS_REVIEW,
            PERM_ADVISOR_PROGRESS_READ,
            PERM_ADVISOR_EVALUATION_REVIEW,
            PERM_ADVISOR_FEEDBACK_SUBMIT,
        }
    ),
    ROLE_MENTOR: frozenset(
        {
            PERM_MENTOR_DASHBOARD_ACCESS,
            PERM_MENTOR_PROFILE_READ,
            PERM_MENTOR_STUDENTS_READ,
            PERM_MENTOR_DOCUMENTS_REVIEW,
            PERM_MENTOR_EVALUATION_SUBMIT,
        }
    ),
    ROLE_STAFF: frozenset(
        {
            PERM_STAFF_DASHBOARD_ACCESS,
            PERM_STAFF_PROFILE_READ,
            PERM_STAFF_STUDENTS_MANAGE,
            PERM_STAFF_COMPANIES_MANAGE,
            PERM_STAFF_POSITIONS_MANAGE,
            PERM_STAFF_APPLICATIONS_MANAGE,
            PERM_STAFF_ADVISOR_ASSIGNMENTS_MANAGE,
            PERM_STAFF_DOCUMENTS_READ,
            PERM_STAFF_ANNOUNCEMENTS_MANAGE,
            PERM_STAFF_FEEDBACK_MANAGE,
        }
    ),
    ROLE_ADMIN: frozenset(
        {
            PERM_ADMIN_DASHBOARD_ACCESS,
            PERM_ADMIN_USERS_MANAGE,
            PERM_ADMIN_ROLES_MANAGE,
            PERM_ADMIN_CONFIG_MANAGE,
            PERM_ADMIN_REPORTS_READ,
            PERM_ADMIN_FEEDBACK_MANAGE,
        }
    ),
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def normalize_role(role: Optional[str]) -> Optional[str]:
    """Normalize a role value coming from the database or a JWT claim.

    Handles legacy aliases (``teacher`` / ``adviser``) and dirty values such
    as ``"student\n"``. Returns ``None`` for anything that is not a known
    role so callers can deny access instead of trusting an unknown value.
    """
    if role is None:
        return None

    candidate = str(role).strip().lower()
    if not candidate:
        return None

    aliased = ROLE_ALIASES.get(candidate, candidate)
    return aliased if aliased in ROLE_PERMISSIONS else None


def is_valid_role(role: Optional[str]) -> bool:
    """Return True when ``role`` normalizes to one of ``ALL_ROLES``."""
    return normalize_role(role) is not None


def permissions_for_role(role: Optional[str]) -> FrozenSet[str]:
    """Return the permission set granted to ``role`` (empty when unknown)."""
    normalized = normalize_role(role)
    if normalized is None:
        return frozenset()
    return ROLE_PERMISSIONS[normalized]


def role_has_permission(role: Optional[str], permission: str) -> bool:
    """Return True when ``role`` is granted ``permission``."""
    return permission in permissions_for_role(role)
