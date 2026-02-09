from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    app_name: str = "AmbientaList API"
    environment: str = "development"
    
    # Database
    supabase_url: str
    supabase_key: str
    database_url: str | None = None
    
    # AI Configuration
    litellm_api_key: str | None = None
    gemini_api_key: str | None = None
    anthropic_api_key: str | None = None
    default_ai_model: str = "gemini/gemini-2.0-flash-exp"
    
    # CORS
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


@lru_cache()
def get_settings() -> Settings:
    return Settings()
