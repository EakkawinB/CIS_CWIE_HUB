"""Role-based access control (RBAC) tests.

These tests are fully offline: settings are stubbed so no .env, database or
network access is required, and the user table is never touched.

Run with:
    python -m unittest tests.test_rbac -v
"""

import asyncio
import contextlib
import io
import re
import sys
import types
import unittest
from pathlib import Path
from types import SimpleNamespace

from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

# Keep these tests offline: importing app.core.security must not load the real
# project settings (and therefore must not touch .env or the database).
fake_config = types.ModuleType("app.config")
fake_config.settings = SimpleNamespace(
    SECRET_KEY="test-secret-key",
    ALGORITHM="HS256",
    ACCESS_TOKEN_EXPIRE_MINUTES=30,
)
sys.modules.setdefault("app.config", fake_config)

from app.core import rbac
from app.core.dependencies import get_current_user, require_role
from app.core.rbac import (
    ALL_ROLES,
    ROLE_ADMIN,
    ROLE_ADVISOR,
    ROLE_MENTOR,
    ROLE_STAFF,
    ROLE_STUDENT,
    is_valid_role,
    normalize_role,
    permissions_for_role,
    role_has_permission,
)
from app.core.security import create_access_token


def call_guard(guard, payload):
    """Run an async role dependency with a fixed token payload."""
    return asyncio.run(guard(payload))


class RoleNormalizationTests(unittest.TestCase):
    def test_canonical_roles_round_trip(self):
        for role in ALL_ROLES:
            self.assertEqual(normalize_role(role), role)
            self.assertTrue(is_valid_role(role))

    def test_legacy_aliases_map_to_advisor(self):
        self.assertEqual(normalize_role("teacher"), ROLE_ADVISOR)
        self.assertEqual(normalize_role("Teacher"), ROLE_ADVISOR)
        self.assertEqual(normalize_role("adviser"), ROLE_ADVISOR)

    def test_dirty_and_mixed_case_values_are_normalized(self):
        self.assertEqual(normalize_role("student\n"), ROLE_STUDENT)
        self.assertEqual(normalize_role("  Student  "), ROLE_STUDENT)
        self.assertEqual(normalize_role("STAFF"), ROLE_STAFF)
        self.assertEqual(normalize_role("Mentor"), ROLE_MENTOR)

    def test_unknown_roles_are_rejected(self):
        for value in (None, "", "   ", "company", "superuser", "admin\nn"):
            self.assertIsNone(normalize_role(value))
            self.assertFalse(is_valid_role(value))


class PermissionCatalogueTests(unittest.TestCase):
    def test_every_role_has_permissions(self):
        for role in ALL_ROLES:
            self.assertTrue(permissions_for_role(role), f"{role} has no permissions")

    def test_unknown_role_has_no_permissions(self):
        self.assertEqual(permissions_for_role("ghost"), frozenset())
        self.assertEqual(permissions_for_role(None), frozenset())

    def test_role_permission_boundaries(self):
        student = permissions_for_role(ROLE_STUDENT)
        advisor = permissions_for_role(ROLE_ADVISOR)
        mentor = permissions_for_role(ROLE_MENTOR)
        staff = permissions_for_role(ROLE_STAFF)
        admin = permissions_for_role(ROLE_ADMIN)

        # Students may submit their own documents but never administer others.
        self.assertTrue(role_has_permission(ROLE_STUDENT, "student.documents.submit"))
        self.assertFalse(role_has_permission(ROLE_STUDENT, "staff.companies.manage"))
        self.assertFalse(role_has_permission(ROLE_STUDENT, "admin.users.manage"))

        # Advisers review assigned students only, never system administration.
        self.assertTrue(role_has_permission(ROLE_ADVISOR, "advisor.students.read"))
        self.assertFalse(role_has_permission(ROLE_ADVISOR, "staff.students.manage"))
        self.assertFalse(role_has_permission(ROLE_ADVISOR, "admin.users.manage"))

        # Mentors submit evaluations but have no administrative powers.
        self.assertTrue(role_has_permission(ROLE_MENTOR, "mentor.evaluation.submit"))
        self.assertFalse(role_has_permission(ROLE_MENTOR, "advisor.students.read"))
        self.assertFalse(role_has_permission(ROLE_MENTOR, "staff.applications.manage"))
        self.assertFalse(role_has_permission(ROLE_MENTOR, "admin.users.manage"))

        # Staff administer cooperative education, not system configuration.
        self.assertTrue(role_has_permission(ROLE_STAFF, "staff.applications.manage"))
        self.assertFalse(role_has_permission(ROLE_STAFF, "admin.settings.manage"))
        self.assertFalse(role_has_permission(ROLE_STAFF, "admin.roles.manage"))

        # Admin owns system-wide configuration and user/role management.
        for permission in (
            "admin.users.manage",
            "admin.roles.manage",
            "admin.settings.manage",
            "admin.reports.read",
        ):
            self.assertTrue(role_has_permission(ROLE_ADMIN, permission))

        # Role boundaries never overlap between the operational roles.
        self.assertFalse(student & staff)
        self.assertFalse(student & admin)
        self.assertFalse(advisor & mentor)
        self.assertFalse(mentor & staff)

    def test_legacy_alias_keeps_advisor_permissions(self):
        self.assertTrue(role_has_permission("teacher", "advisor.students.read"))
        self.assertEqual(
            permissions_for_role("teacher"), permissions_for_role(ROLE_ADVISOR)
        )

    def test_catalogue_covers_all_roles(self):
        self.assertEqual(set(rbac.ROLE_PERMISSIONS), set(ALL_ROLES))


def call_guard(guard, payload):
    """Run an async role dependency with a fixed token payload."""
    return asyncio.run(guard(payload))


class RequireRoleDependencyTests(unittest.TestCase):
    def test_allowed_role_returns_payload(self):
        payload = {"sub": "6500000001", "email": "s@example.test", "role": ROLE_STUDENT}
        self.assertEqual(call_guard(require_role("student"), payload), payload)

    def test_cross_role_access_is_forbidden(self):
        cases = [
            (ROLE_STUDENT, ("staff",)),
            (ROLE_STUDENT, ("advisor",)),
            (ROLE_STUDENT, ("admin",)),
            (ROLE_MENTOR, ("student",)),
            (ROLE_ADVISOR, ("admin",)),
            (ROLE_STAFF, ("admin",)),
            (ROLE_MENTOR, ("advisor", "staff", "admin")),
        ]
        for role, required in cases:
            with self.subTest(role=role, required=required):
                payload = {"sub": "x", "role": role}
                with self.assertRaises(HTTPException) as ctx:
                    call_guard(require_role(*required), payload)
                self.assertEqual(ctx.exception.status_code, 403)

    def test_admin_is_not_implicitly_granted_operational_endpoints(self):
        payload = {"sub": "x", "role": ROLE_ADMIN}
        with self.assertRaises(HTTPException) as ctx:
            call_guard(require_role("student"), payload)
        self.assertEqual(ctx.exception.status_code, 403)

    def test_multi_role_guard_allows_each_listed_role(self):
        guard = require_role("student", "advisor", "mentor", "staff")
        for role in ("student", "advisor", "mentor", "staff"):
            payload = {"sub": "x", "role": role}
            self.assertEqual(call_guard(guard, payload), payload)

    def test_legacy_and_dirty_token_roles_still_work(self):
        teacher = {"sub": "x", "role": "teacher"}
        self.assertEqual(call_guard(require_role("advisor"), teacher), teacher)

        dirty = {"sub": "6500000001", "role": "student\n"}
        self.assertEqual(call_guard(require_role("student"), dirty), dirty)

    def test_missing_or_unknown_role_is_forbidden(self):
        for payload in (
            {"sub": "x"},
            {"sub": "x", "role": None},
            {"sub": "x", "role": "root"},
        ):
            with self.subTest(payload=payload):
                with self.assertRaises(HTTPException) as ctx:
                    call_guard(require_role("student"), payload)
                self.assertEqual(ctx.exception.status_code, 403)

    def test_unauthenticated_requests_are_rejected_with_401(self):
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(credentials=None)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_invalid_token_is_rejected_with_401(self):
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer", credentials="not-a-jwt"
        )
        # verify_token logs the failure with an emoji; capture stdout so the
        # test does not depend on the console encoding of the terminal.
        with contextlib.redirect_stdout(io.StringIO()):
            with self.assertRaises(HTTPException) as ctx:
                get_current_user(credentials=credentials)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_signed_token_is_sufficient_for_matching_role_only(self):
        token = create_access_token(
            profile_id="6500000001",
            email="student@example.test",
            role=ROLE_STUDENT,
        )
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer", credentials=token
        )
        payload = get_current_user(credentials=credentials)

        self.assertEqual(payload["role"], ROLE_STUDENT)
        self.assertEqual(payload["email"], "student@example.test")
        self.assertEqual(call_guard(require_role("student"), payload), payload)

        with self.assertRaises(HTTPException) as ctx:
            call_guard(require_role("advisor"), payload)
        self.assertEqual(ctx.exception.status_code, 403)


BACKEND_ROOT = Path(__file__).resolve().parents[1]
ROUTERS_DIR = BACKEND_ROOT / "app" / "routers"
DEPENDENCIES_PATH = BACKEND_ROOT / "app" / "core" / "dependencies.py"


def router_sources():
    for path in sorted(ROUTERS_DIR.glob("*.py")):
        yield path, path.read_text(encoding="utf-8")


class AuthorizationSourceContractTests(unittest.TestCase):
    def test_role_constants_match_the_users_table_values(self):
        self.assertEqual(
            ALL_ROLES, ("student", "advisor", "mentor", "staff", "admin")
        )

    def test_every_operational_endpoint_declares_a_role_guard(self):
        # statistics.py is public landing-page data and auth.py contains the
        # public login endpoints plus the authenticated /auth/me endpoint.
        exempt = {"auth.py", "statistics.py"}
        for path, source in self._router_sources():
            if path.name in exempt:
                continue
            endpoints = source.count("@router.")
            guards = source.count("require_role(")
            self.assertGreater(
                endpoints, 0, f"{path.name} has no endpoints"
            )
            self.assertGreaterEqual(
                guards,
                endpoints,
                f"{path.name} has {endpoints} endpoints but only {guards} role guards",
            )

    def _router_sources(self):
        return router_sources()

    def test_auth_endpoints_stay_public_and_me_is_authenticated(self):
        source = (ROUTERS_DIR / "auth.py").read_text(encoding="utf-8")
        self.assertIn('"/request-otp"', source)
        self.assertIn('"/verify-otp"', source)
        self.assertEqual(source.count("Depends(get_current_user)"), 1)
        self.assertIn("permissions_for_role(", source)

    def test_role_comes_from_the_database_not_the_request(self):
        source = (ROUTERS_DIR / "auth.py").read_text(encoding="utf-8")
        self.assertIn("db.query(User)", source)
        self.assertIn("normalize_role(user.role)", source)

        schema = (BACKEND_ROOT / "app" / "schemas" / "auth.py").read_text(
            encoding="utf-8"
        )
        self.assertNotIn("role", schema)

    def test_no_endpoint_can_write_users_role(self):
        for path, source in self._router_sources():
            self.assertNotIn("User.role =", source, path.name)
            self.assertNotIn("User.role=", source, path.name)
            self.assertNotIn("UPDATE USERS", source.upper(), path.name)
            self.assertNotIn("User(", source, path.name)

    def test_no_endpoint_accepts_a_role_in_a_request_body(self):
        # No request schema may declare a field named ``role``: roles are only
        # ever read from public.users / the signed token on the server.
        field_pattern = re.compile(r"^\s*role\s*[:=]", re.MULTILINE)
        for schema_path in sorted((BACKEND_ROOT / "app" / "schemas").glob("*.py")):
            source = schema_path.read_text(encoding="utf-8")
            self.assertIsNone(
                field_pattern.search(source),
                f"{schema_path.name} declares a role field",
            )

    def test_role_guards_normalize_legacy_role_values(self):
        source = DEPENDENCIES_PATH.read_text(encoding="utf-8")
        self.assertIn("from app.core.rbac import normalize_role", source)
        self.assertIn("normalize_role(user_role) in allowed", source)

    def test_auth_codes_are_401_and_403(self):
        source = DEPENDENCIES_PATH.read_text(encoding="utf-8")
        self.assertIn("HTTP_401_UNAUTHORIZED", source)
        self.assertIn("HTTP_403_FORBIDDEN", source)
