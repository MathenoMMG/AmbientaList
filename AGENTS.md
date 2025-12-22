# AMBIENTALIST - Agent Development Guidelines

## Build & Test Commands
### Frontend (Next.js)
- `npm run dev` - Start development server
- `npm run build` - Production build  
- `npm run lint` - ESLint + Prettier
- `npm test` - Run all tests
- `npm test -- --testNamePattern="specific-test"` - Single test

### Backend (FastAPI)
- `uvicorn app.main:app --reload` - Development server
- `pytest` - Run all tests
- `pytest tests/test_specific.py::test_function` - Single test
- `ruff check .` - Linting
- `ruff format .` - Formatting

## Code Style Guidelines
### Frontend (TypeScript/Next.js)
- Use absolute imports: `import { Component } from '@/components'`
- Component files: PascalCase (UserProfile.tsx)
- Async functions with proper error boundaries
- Tailwind classes via cn() utility, no inline styles

### Backend (Python/FastAPI)
- Type hints required for all functions
- Use Pydantic models for request/response
- Async/await for I/O operations
- Error handling with custom exceptions

### Architecture Principles
- Clean Architecture: separation of concerns
- Model independence via LiteLLM abstraction
- Multimodal processing (vision + text)
- RAG patterns for regulatory compliance