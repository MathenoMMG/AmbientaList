from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID


class InvitationCreate(BaseModel):
    """Request to create an invitation"""
    email: EmailStr
    role: str = "member"  # owner, admin, member, viewer


class InvitationResponse(BaseModel):
    """Invitation details"""
    id: UUID
    organization_id: UUID
    email: str
    role: str
    invited_by: UUID | None
    status: str
    token: UUID
    expires_at: datetime
    created_at: datetime
    accepted_at: datetime | None
    
    class Config:
        from_attributes = True


class OrganizationMember(BaseModel):
    """Organization member details"""
    user_id: UUID
    organization_id: UUID
    role: str
    created_at: datetime
    user_email: str | None = None
    user_name: str | None = None


class UpdateMemberRole(BaseModel):
    """Request to update member role"""
    role: str  # owner, admin, member, viewer
