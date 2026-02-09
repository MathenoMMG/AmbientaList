from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="AI-powered environmental compliance auditing platform",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to AmbientaList API",
        "version": "0.1.0",
        "status": "operational"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "environment": settings.environment}


# Include routers
from app.routers import organizations, invitations

app.include_router(organizations.router, prefix="/api/organizations", tags=["Organizations"])
app.include_router(invitations.router, prefix="/api/invitations", tags=["Invitations"])

