"""Application configuration."""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings."""
    
    # Gemini API Keys (supports up to 5 keys for rate limit management)
    GEMINI_API_KEY_1: str = os.getenv("GEMINI_API_KEY_1", "")
    GEMINI_API_KEY_2: str = os.getenv("GEMINI_API_KEY_2", "")
    GEMINI_API_KEY_3: str = os.getenv("GEMINI_API_KEY_3", "")
    GEMINI_API_KEY_4: str = os.getenv("GEMINI_API_KEY_4", "")
    GEMINI_API_KEY_5: str = os.getenv("GEMINI_API_KEY_5", "")
    
    # Gemini Configuration
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GEMINI_TEMPERATURE: float = float(os.getenv("GEMINI_TEMPERATURE", "0.3"))
    GEMINI_MAX_TOKENS: int = int(os.getenv("GEMINI_MAX_TOKENS", "2048"))
    
    # Storage
    STORAGE_PATH: Path = Path.home() / ".db-toolkit"
    
    @property
    def gemini_api_keys(self) -> list[str]:
        """Get all configured Gemini API keys."""
        keys = []
        for i in range(1, 6):
            key = getattr(self, f'GEMINI_API_KEY_{i}')
            if key:
                keys.append(key)
        return keys
    
    @property
    def has_gemini_keys(self) -> bool:
        """Check if any Gemini API keys are configured."""
        return len(self.gemini_api_keys) > 0


settings = Settings()
