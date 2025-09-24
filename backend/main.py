from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import Base, engine
from routes.auth import router as auth_router
from routes.notes import router as notes_router
from routes.sharing import router as sharing_router

settings = get_settings()
app = FastAPI(title="Note Taking App", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.on_event("startup")
def on_startup():
    import models.user  # noqa: F401
    import models.note  # noqa: F401
    import models.shared_note  # noqa: F401
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(notes_router)
app.include_router(sharing_router)