"""Configuration settings for InboxPrism backend."""

import os
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings

# Get the project root directory
PROJECT_ROOT = Path(__file__).parent.parent

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # AI Provider Settings
    google_api_key: Optional[str] = None
    default_provider: str = "gemini"

    # Azure OpenAI Settings
    azure_openai_api_key: Optional[str] = None
    azure_openai_endpoint: Optional[str] = None
    azure_openai_chat_deployment_name: str = "gpt-4o"
    openai_api_type: str = "azure"
    azure_openai_api_version: str = "2024-12-01-preview"
    azure_openai_embeddings_deployment_name: str = "text-embedding-ada-002"

    # Application Settings
    log_level: str = "INFO"
    summary_max_chars: int = 4000
    debug: bool = False
    allowed_hosts: str = "localhost,127.0.0.1"

    # Database
    database_path: str = str(PROJECT_ROOT / "emails.db")

    # Gmail OAuth
    gmail_credentials_path: str = str(PROJECT_ROOT / "credentials.json")
    gmail_token_path: str = str(PROJECT_ROOT / "token.json")

    class Config:
        env_file = str(PROJECT_ROOT / ".env")
        env_file_encoding = "utf-8"
        case_sensitive = False

# Global settings instance
settings = Settings()
