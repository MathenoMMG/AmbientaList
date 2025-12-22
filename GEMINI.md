# AMBIENTALIST - Project Context

## Project Overview
**AMBIENTALIST** is a web application designed to centralize, analyze, and audit environmental compliance for companies using Multimodal Artificial Intelligence. The system ingests complex documents (PDFs with tables, images) and contrasts them against an updated regulatory database using RAG (Retrieval-Augmented Generation).

### Core Architecture
- **Multimodal Ingestion:** Converts documents to Markdown using Vision APIs to preserve structure (tables, images).
- **RAG System:** Retrieves relevant environmental laws dynamically rather than training the model on them.
- **Model Independence:** Uses a service layer (LiteLLM) to switch between models (Gemini, Claude, etc.) without code changes.
- **Clean Architecture:** Strict separation of concerns to ensure scalability and maintainability.

### Tech Stack
- **Frontend:** Next.js 15+ (App Router), Tailwind CSS, Shadcn/UI.
- **Backend:** FastAPI (Python 3.11+), LiteLLM, LangChain.
- **Database:** PostgreSQL (Supabase) for relational data, `pgvector` for vector embeddings.
- **Auth & Storage:** Supabase Auth, Supabase Storage.
- **Infrastructure:** Vercel (Frontend), Google Cloud Run (Backend).

## Development Workflow

### Frontend (Next.js)
*Located in the frontend directory (to be created)*

*   **Start Dev Server:** `npm run dev`
*   **Production Build:** `npm run build`
*   **Linting:** `npm run lint`
*   **Testing:** `npm test`
    *   Single test: `npm test -- --testNamePattern="specific-test"`

### Backend (FastAPI)
*Located in the backend directory (to be created)*

*   **Start Dev Server:** `uvicorn app.main:app --reload`
*   **Testing:** `pytest`
    *   Single test: `pytest tests/test_specific.py::test_function`
*   **Linting:** `ruff check .`
*   **Formatting:** `ruff format .`

## Coding Standards & Conventions

### Frontend (TypeScript/Next.js)
- **Imports:** Use absolute imports (e.g., `import { Component } from '@/components'`).
- **Naming:** PascalCase for component files (e.g., `UserProfile.tsx`).
- **Styling:** Use Tailwind CSS classes combined via a `cn()` utility; avoid inline styles.
- **Error Handling:** Use async functions with proper error boundaries.

### Backend (Python/FastAPI)
- **Typing:** Type hints are **mandatory** for all functions.
- **Validation:** Use Pydantic models for all request and response schemas.
- **Concurrency:** Use `async/await` for all I/O operations.
- **Exceptions:** Handle errors using custom exceptions.

### Architectural Principles
- **Clean Architecture:** Maintain clear boundaries between layers.
- **Model Agnosticism:** Never call AI providers directly; go through the abstraction layer.
- **Context Awareness:** Prioritize RAG over model context window limits.

### UX Guidelines (The "Golden Rule")
- **No Dead Ends:** If the AI fails to process a document, never stop the flow. Ask the user for clarification (e.g., "Image unclear, please describe it").
- **Active Waiting:** Always provide visual feedback (progress bars, status messages) during long AI operations (10-30s).

### Application Routes
- `/login` - Authentication & Onboarding.
- `/dashboard` - Organization overview & Global Status.
- `/normativas` - Legal framework management (Upload/Vectorize).
- `/auditoria/nueva` - Evidence ingestion (Drag & Drop).
- `/auditoria/[id]` - Detailed analysis (Dual view: Doc + AI Report).
