from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from uuid import UUID
from app.models.invitation import (
    InvitationCreate,
    InvitationResponse,
    OrganizationMember,
    UpdateMemberRole
)
from app.database import get_supabase_client
from supabase import Client

router = APIRouter()


def get_current_user_id(authorization: str = None):
    """Extract user ID from JWT - simplified for MVP"""
    # In production, properly validate JWT from Authorization header
    # For now, we'll rely on Supabase RLS policies
    return None


@router.post("/{org_id}/invitations", response_model=InvitationResponse)
async def create_invitation(
    org_id: UUID,
    invitation: InvitationCreate,
    supabase: Client = Depends(get_supabase_client)
):
    """Create an invitation to join the organization"""
    
    # Check if email is already a member
    existing = supabase.table("organization_members")\
        .select("user_id")\
        .eq("organization_id", str(org_id))\
        .execute()
    
    # Get user emails for existing members (would need to join with auth.users)
    # For now, just check if invitation already exists
    
    # Check for existing pending invitation
    existing_invite = supabase.table("organization_invitations")\
        .select("*")\
        .eq("organization_id", str(org_id))\
        .eq("email", invitation.email)\
        .eq("status", "pending")\
        .execute()
    
    if existing_invite.data:
        raise HTTPException(
            status_code=400,
            detail="An invitation for this email already exists"
        )
    
    # Create invitation with 7-day expiration
    expires_at = datetime.utcnow() + timedelta(days=7)
    
    result = supabase.table("organization_invitations").insert({
        "organization_id": str(org_id),
        "email": invitation.email,
        "role": invitation.role,
        "expires_at": expires_at.isoformat(),
        "status": "pending"
    }).execute()
    
    if result.data:
        return result.data[0]
    else:
        raise HTTPException(status_code=500, detail="Failed to create invitation")


@router.get("/{org_id}/invitations", response_model=list[InvitationResponse])
async def list_invitations(
    org_id: UUID,
    supabase: Client = Depends(get_supabase_client)
):
    """List all pending invitations for an organization"""
    
    result = supabase.table("organization_invitations")\
        .select("*")\
        .eq("organization_id", str(org_id))\
        .eq("status", "pending")\
        .order("created_at", desc=True)\
        .execute()
    
    return result.data or []


@router.delete("/{org_id}/invitations/{invitation_id}")
async def revoke_invitation(
    org_id: UUID,
    invitation_id: UUID,
    supabase: Client = Depends(get_supabase_client)
):
    """Revoke a pending invitation"""
    
    result = supabase.table("organization_invitations")\
        .update({"status": "revoked"})\
        .eq("id", str(invitation_id))\
        .eq("organization_id", str(org_id))\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    return {"message": "Invitation revoked successfully"}


@router.get("/{org_id}/members", response_model=list[OrganizationMember])
async def list_members(
    org_id: UUID,
    supabase: Client = Depends(get_supabase_client)
):
    """List all members of an organization"""
    
    result = supabase.table("organization_members")\
        .select("*")\
        .eq("organization_id", str(org_id))\
        .order("created_at", desc=False)\
        .execute()
    
    return result.data or []


@router.patch("/{org_id}/members/{user_id}")
async def update_member_role(
    org_id: UUID,
    user_id: UUID,
    update: UpdateMemberRole,
    supabase: Client = Depends(get_supabase_client)
):
    """Update a member's role"""
    
    result = supabase.table("organization_members")\
        .update({"role": update.role})\
        .eq("organization_id", str(org_id))\
        .eq("user_id", str(user_id))\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Member not found")
    
    return result.data[0]


@router.delete("/{org_id}/members/{user_id}")
async def remove_member(
    org_id: UUID,
    user_id: UUID,
    supabase: Client = Depends(get_supabase_client)
):
    """Remove a member from the organization"""
    
    # TODO: Add check to prevent removing last owner
    # TODO: Add check to prevent removing self
    
    result = supabase.table("organization_members")\
        .delete()\
        .eq("organization_id", str(org_id))\
        .eq("user_id", str(user_id))\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Member not found")
    
    return {"message": "Member removed successfully"}
