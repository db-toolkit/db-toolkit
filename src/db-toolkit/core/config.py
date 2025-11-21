"""Application configuration."""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings."""
    
    # Gemini API Keys (supports single key or up to 5 numbered keys)
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_api_key_1: str = os.getenv("GEMINI_API_KEY_1", "")
    gemini_api_key_2: str = os.getenv("GEMINI_API_KEY_2", "")
    gemini_api_key_3: str = os.getenv("GEMINI_API_KEY_3", "")
    gemini_api_key_4: str = os.getenv("GEMINI_API_KEY_4", "")
    gemini_api_key_5: str = os.getenv("GEMINI_API_KEY_5", "")
    
    # Gemini Configuration
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    gemini_temperature: float = float(os.getenv("GEMINI_TEMPERATURE", "0.3"))
    gemini_max_tokens: int = int(os.getenv("GEMINI_MAX_TOKENS", "2048"))
    
    # Storage
    STORAGE_PATH: Path = Path.home() / ".db-toolkit"
    
    @property
    def has_gemini_keys(self) -> bool:
        """Check if any Gemini API keys are configured."""
        if self.gemini_api_key:
            return True
        for i in range(1, 6):
            if getattr(self, f'gemini_api_key_{i}'):
                return True
        return False


settings = Settings()
