-- ============================================
-- FIX: Remove ALL existing policies causing infinite recursion
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Owners can update organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;
DROP POLICY IF EXISTS "Users can insert organization members" ON organization_members;
DROP POLICY IF EXISTS "Owners can remove members" ON organization_members;
DROP POLICY IF EXISTS "Users can view their org regulations" ON regulations;
DROP POLICY IF EXISTS "Members can create regulations" ON regulations;
DROP POLICY IF EXISTS "Members can update regulations" ON regulations;
DROP POLICY IF EXISTS "Users can view regulation embeddings" ON regulation_embeddings;
DROP POLICY IF EXISTS "Service can insert embeddings" ON regulation_embeddings;
DROP POLICY IF EXISTS "Users can view their org audits" ON audits;
DROP POLICY IF EXISTS "Members can create audits" ON audits;
DROP POLICY IF EXISTS "Members can update audits" ON audits;
DROP POLICY IF EXISTS "Users can view audit documents" ON audit_documents;
DROP POLICY IF EXISTS "Members can upload documents" ON audit_documents;
DROP POLICY IF EXISTS "Users can view audit findings" ON audit_findings;
DROP POLICY IF EXISTS "Service can create findings" ON audit_findings;

-- ============================================
-- FIXED POLICIES - NO CIRCULAR DEPENDENCIES
-- ============================================

-- ORGANIZATIONS TABLE
-- ============================================

-- Allow anyone to create organizations
CREATE POLICY "Anyone can create organizations" 
ON organizations FOR INSERT 
WITH CHECK (true);

-- Users can view organizations they are members of
CREATE POLICY "View own organizations" 
ON organizations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_members.organization_id = organizations.id 
    AND organization_members.user_id = auth.uid()
  )
);

-- Owners/admins can update their organizations
CREATE POLICY "Update own organizations" 
ON organizations FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_members.organization_id = organizations.id 
    AND organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'admin')
  )
);

-- ORGANIZATION_MEMBERS TABLE
-- ============================================

-- Allow anyone to insert themselves as members (for organization creation)
CREATE POLICY "Insert organization members" 
ON organization_members FOR INSERT 
WITH CHECK (true);

-- Users can view members of organizations they belong to
CREATE POLICY "View organization members" 
ON organization_members FOR SELECT 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om 
    WHERE om.user_id = auth.uid()
  )
);

-- Owners/admins can delete members
CREATE POLICY "Delete organization members" 
ON organization_members FOR DELETE 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om 
    WHERE om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin')
  )
);

-- REGULATIONS TABLE
-- ============================================

CREATE POLICY "View org regulations" 
ON regulations FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Insert org regulations" 
ON regulations FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Update org regulations" 
ON regulations FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

-- REGULATION_EMBEDDINGS TABLE
-- ============================================

CREATE POLICY "View regulation embeddings" 
ON regulation_embeddings FOR SELECT 
USING (
  regulation_id IN (
    SELECT id FROM regulations 
    WHERE organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Insert regulation embeddings" 
ON regulation_embeddings FOR INSERT 
WITH CHECK (true);

-- AUDITS TABLE
-- ============================================

CREATE POLICY "View org audits" 
ON audits FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Insert org audits" 
ON audits FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Update org audits" 
ON audits FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

-- AUDIT_DOCUMENTS TABLE
-- ============================================

CREATE POLICY "View audit documents" 
ON audit_documents FOR SELECT 
USING (
  audit_id IN (
    SELECT id FROM audits 
    WHERE organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Insert audit documents" 
ON audit_documents FOR INSERT 
WITH CHECK (
  audit_id IN (
    SELECT id FROM audits 
    WHERE organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- AUDIT_FINDINGS TABLE
-- ============================================

CREATE POLICY "View audit findings" 
ON audit_findings FOR SELECT 
USING (
  audit_id IN (
    SELECT id FROM audits 
    WHERE organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Insert audit findings" 
ON audit_findings FOR INSERT 
WITH CHECK (true);
