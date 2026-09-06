from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID, uuid4

from app.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyResponse, CompanyCreate, CompanyUpdate


router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


@router.get(
    "",
    response_model=list[CompanyResponse]
)
def get_companies(
    db: Session = Depends(get_db)
):
    companies = db.query(Company).all()

    return companies

@router.post(
    "",
    response_model=CompanyResponse
)
def create_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db)
):
    company = Company(
        company_id=uuid4(),
        company_name=company_data.company_name,
        email=company_data.email,
        phone=company_data.phone,
        address=company_data.address
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company

@router.get(
    "/{company_id}",
    response_model=CompanyResponse
)
def get_company(
    company_id: UUID,
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.company_id == company_id).first()
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.put(
    "/{company_id}",
    response_model=CompanyResponse
)
def update_company(
    company_id: UUID,
    company_data: CompanyUpdate,
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(
        Company.company_id == company_id
    ).first()

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    if company_data.company_name is not None:
        company.company_name = company_data.company_name

    if company_data.email is not None:
        company.email = company_data.email

    if company_data.phone is not None:
        company.phone = company_data.phone

    if company_data.address is not None:
        company.address = company_data.address

    db.commit()
    db.refresh(company)

    return company

@router.delete(
    "/{company_id}"
)
def delete_company(
    company_id: UUID,
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(
        Company.company_id == company_id
    ).first()

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