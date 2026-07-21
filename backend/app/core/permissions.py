from fastapi import Depends, HTTPException

from app.core.dependencies import get_current_user


def require_student(user=Depends(get_current_user)):

    if user["role"] != "student":

        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    return user


def require_teacher(user=Depends(get_current_user)):

    if user["role"] != "teacher":

        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    return user


def require_staff(user=Depends(get_current_user)):

    if user["role"] != "staff":

        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    return user


def require_company(user=Depends(get_current_user)):

    if user["role"] != "company":

        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    return user