-- ============================================
-- TEAM INVITATIONS SCHEMA
-- ============================================

-- Create invitations table
CREATE TABLE organization_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member', 'viewer'
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'revoked'
  token UUID DEFAULT gen_random_uuid(), -- Secure token for invite link
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Prevent duplicate pending invites for same email
  UNIQUE(organization_id, email, status)
);

-- Create indices for performance
CREATE INDEX idx_invitations_org ON organization_invitations(organization_id);
CREATE INDEX idx_invitations_email ON organization_invitations(email);
CREATE INDEX idx_invitations_token ON organization_invitations(token);
CREATE INDEX idx_invitations_status ON organization_invitations(status);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;

-- Admins/owners can create invitations in their organizations
CREATE POLICY "Create invitations" 
ON organization_invitations FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Anyone can view invitation by token (needed for acceptance)
CREATE POLICY "View invitation by token" 
ON organization_invitations FOR SELECT 
USING (
  token IS NOT NULL
);

-- Admins can view all invitations in their orgs
CREATE POLICY "View org invitations" 
ON organization_invitations FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Admins can update (revoke) invitations
CREATE POLICY "Update org invitations" 
ON organization_invitations FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Anyone can accept their invitation (update status)
CREATE POLICY "Accept invitation" 
ON organization_invitations FOR UPDATE 
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND status = 'pending'
);

-- ============================================
-- HELPER FUNCTION: Auto-expire invitations
-- ============================================

-- This function can be called periodically or on-demand
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
  UPDATE organization_invitations
  SET status = 'expired'
  WHERE status = 'pending' 
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
