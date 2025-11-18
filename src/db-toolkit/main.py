"""FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.routes.connections import router as connections_router
from .core.routes.health import router as health_router
from .core.routes.schema import router as schema_router

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
app.include_router(connections_router, prefix="/api/v1", tags=["Connections"])
app.include_router(schema_router, prefix="/api/v1", tags=["Schema"])
app.include_router(health_router, prefix="/api/v1", tags=["Health"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)