from datetime import datetime
from pydantic import BaseModel, EmailStr
from uuid import UUID
class ShareRequest(BaseModel):
    username: str | None = None
    email: EmailStr | None = None

class SharedNoteOut(BaseModel):
    id: UUID
    note_id: UUID
    shared_with_user_id: str
    shared_at: datetime

    class Config:
        from_attributes = True