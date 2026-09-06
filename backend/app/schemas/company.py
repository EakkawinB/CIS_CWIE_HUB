from pydantic import BaseModel
from uuid import UUID


class CompanyCreate(BaseModel):
    company_name: str
    email: str | None = None
    phone: str | None = None
    address: str | None = None

class CompanyUpdate(BaseModel): 
    company_name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None

class CompanyResponse(BaseModel):
    company_id: UUID
    company_name: str
    email: str | None = None
    phone: str | None = None
    address: str | None = None

    class Config:
        from_attributes = True