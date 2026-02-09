# AmbientaList - Setup Guide

Complete setup instructions for the AmbientaList MVP development environment.

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git
- Supabase account (free tier works for MVP)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd AmbientaList

# Frontend setup
cd frontend
npm install
cp .env.example .env.local

# Backend setup
cd ../backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### 2. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for setup to complete (~2 minutes)

2. **Get Your Credentials**
   - Go to Project Settings > API
   - Copy the **Project URL** and **anon/public** key
   - Copy the **service_role** key (for backend)

3. **Configure Environment Variables**

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   **Backend** (`backend/.env`):
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-service-role-key
   DATABASE_URL=your-postgres-connection-string
   
   # AI Configuration (optional for now)
   GEMINI_API_KEY=your-gemini-key
   ANTHROPIC_API_KEY=your-claude-key
   
   ENVIRONMENT=development
   CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

4. **Set Up Database Schema**
   - Go to Supabase SQL Editor
   - Copy and run the SQL from `DATABASE_SCHEMA.md`
   - Or use the migration file (when created)

5. **Configure Authentication**
   - Go to Authentication > Providers
   - Enable **Email** provider
   - (Optional) Enable **Google** OAuth:
     - Add authorized redirect URL: `http://localhost:3000/auth/callback`

6. **Set Up Storage Buckets**
   - Go to Storage
   - Create buckets:
     - `regulations` (for regulation PDFs)
     - `audit-documents` (for audit files)
   - Set bucket policies to allow authenticated uploads

### 3. Running the Application

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on [http://localhost:3000](http://localhost:3000)

**Terminal 2 - Backend:**
```bash
cd backend
# Activate venv first
uvicorn app.main:app --reload
```
Backend will run on [http://localhost:8000](http://localhost:8000)

### 4. Verify Setup

1. **Backend Health Check:**
   - Visit [http://localhost:8000](http://localhost:8000)
   - Visit [http://localhost:8000/health](http://localhost:8000/health)

2. **Frontend:**
   - Visit [http://localhost:3000](http://localhost:3000)
   - You should see the landing page
   - Try signing up at `/signup`
   - Check email for verification link

## Development Workflow

### Frontend Development

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

### Backend Development

```bash
# Start with auto-reload
uvicorn app.main:app --reload

# Run with different port
uvicorn app.main:app --reload --port 8001

# Install new dependency
pip install <package>
pip freeze > requirements.txt
```

## Project Structure

```
AmbientaList/
├── frontend/                 # Next.js 15 frontend
│   ├── app/                 # App router pages
│   │   ├── (app)/          # Protected app routes
│   │   │   ├── dashboard/
│   │   │   ├── normativas/ (regulations)
│   │   │   └── auditoria/  (audits)
│   │   ├── auth/           # Auth callbacks
│   │   ├── login/
│   │   └── signup/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/UI components
│   │   ├── layout/
│   │   └── dashboard/
│   ├── lib/                # Utilities
│   │   └── supabase/       # Supabase clients
│   └── middleware.ts       # Auth middleware
│
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── config.py       # Settings
│   │   ├── database.py     # DB connection
│   │   ├── routers/        # API routes (to be created)
│   │   ├── services/       # Business logic (to be created)
│   │   └── models/         # Pydantic models (to be created)
│   └── requirements.txt
│
└── DATABASE_SCHEMA.md       # Database documentation
```

## Next Steps - MVP Development

Following the development plan in `AMBIENTALIST dev plan.txt`:

### ✅ Objective 1: Environment & Authentication (COMPLETED)
- [x] Configure Next.js and FastAPI
- [x] Implement Supabase Auth
- [x] Route protection
- [ ] Organization system UI

### 🔄 Objective 2: Document Ingestion & Vision (IN PROGRESS)
- [ ] File upload module (Supabase Storage)
- [ ] Document classification
- [ ] Vision API integration for PDF → Markdown
- [ ] Error handling ("Golden Rule")

### 📋 Objective 3: Regulatory Memory (RAG)
- [ ] Upload and vectorize regulations
- [ ] Semantic search implementation
- [ ] pgvector integration

### 🎨 Objective 4: Audit Interface
- [ ] Dashboard with compliance score
- [ ] Audit detail view `/auditoria/[id]`
- [ ] Split view: Document + AI Report
- [ ] Contextual chat

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Supabase Connection Issues
- Verify your API keys are correct
- Check that you're using HTTPS in the Supabase URL
- Ensure your IP is not blocked by Supabase

### Module Not Found Errors
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
pip install -r requirements.txt --force-reinstall
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [LiteLLM Documentation](https://docs.litellm.ai)

## Support

For issues or questions, please check:
1. `GEMINI.md` - Project context and conventions
2. `AMBIENTALIST dev plan.txt` - Development roadmap
3. This README for common setup issues
