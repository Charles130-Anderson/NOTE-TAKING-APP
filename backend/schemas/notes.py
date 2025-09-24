from datetime import datetime
from pydantic import BaseModel
from uuid import UUID
class NoteCreate(BaseModel):
    title: str
    content: str

class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None

class NoteOut(BaseModel):
    id: UUID
    title: str
    content: str
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True