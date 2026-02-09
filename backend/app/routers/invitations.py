from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from uuid import UUID
from app.database import get_supabase_client
from supabase import Client

router = APIRouter()


@router.get("/accept/{token}")
async def get_invitation_by_token(
    token: UUID,
    supabase: Client = Depends(get_supabase_client)
):
    """Get invitation details by token (for acceptance page)"""
    
    # Find invitation by token
    result = supabase.table("organization_invitations")\
        .select("*, organizations(id, name, slug)")\
        .eq("token", str(token))\
        .eq("status", "pending")\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Invitation not found or already used")
    
    invitation = result.data[0]
    
    # Check if expired
    expires_at = datetime.fromisoformat(invitation["expires_at"].replace("Z", "+00:00"))
    if expires_at < datetime.now(expires_at.tzinfo):
        # Mark as expired
        supabase.table("organization_invitations")\
            .update({"status": "expired"})\
            .eq("id", invitation["id"])\
            .execute()
        raise HTTPException(status_code=410, detail="Invitation has expired")
    
    return invitation


@router.post("/accept/{token}")
async def accept_invitation(
    token: UUID,
    supabase: Client = Depends(get_supabase_client)
):
    """Accept an invitation and add user to organization"""
    
    # This endpoint will be called after user is authenticated
    # Get invitation
    result = supabase.table("organization_invitations")\
        .select("*")\
        .eq("token", str(token))\
        .eq("status", "pending")\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Invitation not found or already used")
    
    invitation = result.data[0]
    
    # Check if expired
    expires_at = datetime.fromisoformat(invitation["expires_at"].replace("Z", "+00:00"))
    if expires_at < datetime.now(expires_at.tzinfo):
        raise HTTPException(status_code=410, detail="Invitation has expired")
    
    # In a real implementation, we'd get the user ID from the JWT
    # For now, we'll rely on the frontend to pass it or use RLS
    
    # Mark invitation as accepted
    supabase.table("organization_invitations")\
        .update({
            "status": "accepted",
            "accepted_at": datetime.utcnow().isoformat()
        })\
        .eq("id", invitation["id"])\
        .execute()
    
    return {
        "message": "Invitation accepted",
        "organization_id": invitation["organization_id"],
        "role": invitation["role"]
    }
