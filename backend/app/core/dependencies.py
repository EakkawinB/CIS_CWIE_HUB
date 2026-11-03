from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, HTTPBasic, HTTPBasicCredentials
from typing import Dict, Any, Optional, Callable

from app.core.rbac import normalize_role
from app.core.security import verify_token

# Make security optional - don't require auth header
security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
) -> Dict[str, Any]:
    """
    ดึงข้อมูล current user จาก JWT token (required)
    
    Returns:
        Dict: Token payload ที่มี sub, email, role, exp
    
    Raises:
        HTTPException: ถ้า token ไม่ถูกต้องหรือไม่มี token
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
) -> Optional[Dict[str, Any]]:
    """
    ดึงข้อมูล current user จาก JWT token (optional)
    
    Returns:
        Dict: Token payload หรือ None ถ้าไม่มี token
    """
    if credentials is None:
        return None
    
    token = credentials.credentials
    return verify_token(token)


def require_role(*required_roles: str) -> Callable[[Dict[str, Any]], Dict[str, Any]]:
    """
    Dependency factory that checks the JWT role independently of the client.

    The role comes from the signed token (never from request parameters) and
    is normalized first, so legacy values (``teacher`` / ``adviser``) and
    dirty values stored in the database (e.g. ``"student\\n"``) still map to
    the correct role. Unknown roles are always denied.
    """
    allowed = set()
    for role in required_roles:
        canonical_role = normalize_role(role)
        allowed.add(
            canonical_role if canonical_role is not None else str(role).strip().lower()
        )

    async def check_role(
        current_user: Dict[str, Any] = Depends(get_current_user)
    ) -> Dict[str, Any]:
        user_role = current_user.get("role")
        if normalize_role(user_role) in allowed:
            return current_user
        required = ", ".join(sorted(allowed))
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"This endpoint requires '{required}' role. "
                f"You have '{user_role}' role."
            ),
        )

    return check_role
