"""Application configuration."""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings."""
    
    # AI Provider Selection
    ai_provider: str = os.getenv("AI_PROVIDER", "cloudflare")  # cloudflare, gemini, or grok
    
    # Cloudflare Workers AI
    cloudflare_account_id: str = os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
    cloudflare_api_token: str = os.getenv("CLOUDFLARE_API_TOKEN", "")
    cloudflare_model: str = os.getenv("CLOUDFLARE_MODEL", "@cf/meta/llama-3.1-70b-instruct")
    
    # Gemini API Keys (supports single key or up to 5 numbered keys)
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_api_key_1: str = os.getenv("GEMINI_API_KEY_1", "")
    gemini_api_key_2: str = os.getenv("GEMINI_API_KEY_2", "")
    gemini_api_key_3: str = os.getenv("GEMINI_API_KEY_3", "")
    gemini_api_key_4: str = os.getenv("GEMINI_API_KEY_4", "")
    gemini_api_key_5: str = os.getenv("GEMINI_API_KEY_5", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Grok (xAI)
    grok_api_key: str = os.getenv("GROK_API_KEY", "")
    grok_model: str = os.getenv("GROK_MODEL", "grok-beta")
    
    # AI Configuration (shared)
    ai_temperature: float = float(os.getenv("AI_TEMPERATURE", "0.7"))
    ai_max_tokens: int = int(os.getenv("AI_MAX_TOKENS", "2048"))
    
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
    
    @property
    def has_cloudflare_credentials(self) -> bool:
        """Check if Cloudflare credentials are configured."""
        return bool(self.cloudflare_account_id and self.cloudflare_api_token)
    
    @property
    def has_grok_key(self) -> bool:
        """Check if Grok API key is configured."""
        return bool(self.grok_api_key)
    
    @property
    def has_ai_configured(self) -> bool:
        """Check if any AI provider is configured."""
        if self.ai_provider == "cloudflare":
            return self.has_cloudflare_credentials
        elif self.ai_provider == "gemini":
            return self.has_gemini_keys
        elif self.ai_provider == "grok":
            return self.has_grok_key
        return False


settings = Settings()
