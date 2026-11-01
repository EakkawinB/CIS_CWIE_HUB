from uuid import UUID, uuid4
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Query 
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.position import Position
from app.database import get_db
from app.core.dependencies import require_role
from app.models.company import Company
from app.schemas.company import (
    CompanyResponse,
    CompanyCreate,
    CompanyUpdate,
    CompanyBrowseResponse,
)


router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


# =========================================================
# GET ALL COMPANIES
# ทุก role ที่ login สามารถดูได้
# =========================================================
@router.get(
    "",
    response_model=list[CompanyResponse]
)
def get_companies(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("student", "advisor", "mentor", "staff")
    ),
):
    companies = db.query(Company).all()
    return companies


# =========================================================
# CREATE COMPANY
# Staff only
# =========================================================
@router.post(
    "",
    response_model=CompanyResponse
)
def create_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    company = Company(
        company_id=uuid4(),
        **company_data.model_dump()
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company

# =========================================================
# BROWSE COMPANIES
# Student only
# =========================================================
@router.get(
    "/browse",
    response_model=list[CompanyBrowseResponse]
)
def browse_companies(
    search: str | None = Query(default=None),
    province: str | None = Query(default=None),
    position_status: Literal["open", "closed"] | None = Query(default=None),

    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    query = db.query(Company).filter(
        Company.is_active == True
    )

    # ค้นหาจากชื่อบริษัทหรือตำแหน่งงาน
    if search:

        query = (
            query
            .outerjoin(Position, Position.company_id == Company.company_id)
            .filter(
                or_(
                    Company.company_name.ilike(f"%{search}%"),
                    Position.position_name.ilike(f"%{search}%"),
                )
            )
            .distinct()
        )
   
    # กรองจังหวัด
    if province:
        query = query.filter(
            Company.province.ilike(f"%{province}%")
        )

    companies = query.all()

    # ถ้าไม่ได้เลือก status คืนทั้ง open และ closed ตามปกติ
    if position_status is None:
        return companies

    # ถ้าเลือก status ให้กรอง positions ใน response
    result = []

    for company in companies:
        filtered_positions = [
            position
            for position in company.positions
            if position.status == position_status
        ]

        if not filtered_positions:
            continue
   

        result.append({
            "company_id": company.company_id,
            "company_name": company.company_name,
            "industry": company.industry,
            "description": company.description,
            "logo_url": company.logo_url,
            "email": company.email,
            "phone": company.phone,
            "address": company.address,
            "province": company.province,
            "website": company.website,
            "positions": filtered_positions,
        })

    return result


# =========================================================
# GET COMPANY BY ID
# ทุก role ที่ login สามารถดูได้
# =========================================================
@router.get(
    "/{company_id}",
    response_model=CompanyResponse
)
def get_company(
    company_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("student", "advisor", "mentor", "staff")
    ),
):
    company = (
        db.query(Company)
        .filter(Company.company_id == company_id)
        .first()
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    return company


# =========================================================
# UPDATE COMPANY
# Staff only
# =========================================================
@router.put(
    "/{company_id}",
    response_model=CompanyResponse
)
def update_company(
    company_id: UUID,
    company_data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    company = (
        db.query(Company)
        .filter(Company.company_id == company_id)
        .first()
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    update_data = company_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(company, field, value)

    db.commit()
    db.refresh(company)

    return company


# =========================================================
# DELETE COMPANY
# Staff only
# =========================================================
@router.delete(
    "/{company_id}"
)
def delete_company(
    company_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    company = (
        db.query(Company)
        .filter(Company.company_id == company_id)
        .first()
    )

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    db.delete(company)
    db.commit()

    return {
        "message": "Company deleted successfully"
    }