from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas.emails import EmailRequest
from config import get_settings
from database import Base, engine
from routes.auth import router as auth_router
from routes.notes import router as notes_router
from routes.sharing import router as sharing_router
from utils.emails import send_email


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

@app.get("/test-email")
def test_email():
    result = send_email("andyotieno2019@gmail.com", "Test", "Hello world!")
    return result

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(notes_router)
app.include_router(sharing_router)