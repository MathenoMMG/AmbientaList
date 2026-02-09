# Database Schema - AmbientaList

This document outlines the database schema for AmbientaList MVP using PostgreSQL via Supabase.

## Core Tables

### 1. organizations
Stores company/organization information for multi-tenancy.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
```

### 2. organization_members
Links users to organizations with roles.

```sql
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member', 'viewer'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
```

### 3. regulations
Stores environmental laws and regulations (RAG knowledge base).

```sql
CREATE TABLE regulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  jurisdiction VARCHAR(100), -- e.g., "España", "EU", "México"
  category VARCHAR(100), -- e.g., "Waste Management", "Emissions"
  content TEXT NOT NULL, -- Full regulation text in Markdown
  file_url VARCHAR(500), -- Original PDF URL in Supabase Storage
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'processing'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_regulations_org ON regulations(organization_id);
CREATE INDEX idx_regulations_status ON regulations(status);
```

### 4. regulation_embeddings
Stores vector embeddings for RAG retrieval using pgvector.

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE regulation_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(768), -- Adjust dimension based on embedding model
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reg_embeddings_regulation ON regulation_embeddings(regulation_id);
-- Create HNSW index for fast similarity search
CREATE INDEX idx_reg_embeddings_vector ON regulation_embeddings 
  USING hnsw (embedding vector_cosine_ops);
```

### 5. audits
Stores audit/compliance check records.

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  compliance_score INTEGER, -- 0-100
  findings JSONB, -- Structured findings from AI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audits_org ON audits(organization_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_created_by ON audits(created_by);
```

### 6. audit_documents
Stores documents submitted for audit (invoices, photos, reports).

```sql
CREATE TABLE audit_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  file_name VARCHAR(300) NOT NULL,
  file_type VARCHAR(100) NOT NULL, -- 'pdf', 'image', 'document'
  file_url VARCHAR(500) NOT NULL, -- Supabase Storage URL
  file_size INTEGER, -- bytes
  classification VARCHAR(100), -- e.g., 'invoice', 'photo', 'report'
  extracted_content TEXT, -- Markdown extracted by Vision API
  analysis JSONB, -- AI analysis results
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_docs_audit ON audit_documents(audit_id);
```

### 7. audit_findings
Individual compliance findings from audits.

```sql
CREATE TABLE audit_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  regulation_id UUID REFERENCES regulations(id) ON DELETE SET NULL,
  severity VARCHAR(50) NOT NULL, -- 'critical', 'warning', 'info'
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT,
  article_reference TEXT, -- Specific law article cited
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_findings_audit ON audit_findings(audit_id);
CREATE INDEX idx_findings_severity ON audit_findings(severity);
```

## Row Level Security (RLS) Policies

Supabase RLS policies ensure users can only access data from their organizations:

```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulation_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_findings ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only see organizations they're members of
CREATE POLICY "Users can view their organizations" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Similar policies should be created for all tables
```

## Storage Buckets

In Supabase Storage:

1. **regulations** - Stores uploaded regulation PDF files
2. **audit-documents** - Stores audit evidence files (PDFs, images)

## Next Steps

1. Run these SQL commands in Supabase SQL Editor
2. Configure RLS policies for all tables
3. Set up Storage buckets with proper policies
4. Create database triggers for `updated_at` fields
