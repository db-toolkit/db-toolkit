"""FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router

app = FastAPI(
    title="DB Toolkit API",
    description="Database management toolkit API",
    version="0.1.0"
)

# CORS middleware for Electron frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)