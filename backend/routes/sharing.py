import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session

from database import get_db
from models.note import Note
from models.shared_note import SharedNote
from models.user import User
from schemas.notes import NoteOut
from schemas.sharing import ShareRequest
from utils.auth import get_current_user

router = APIRouter()

@router.post("/notes/{note_id}/share")
def share_note(note_id: str, payload: ShareRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not payload.username and not payload.email:
        raise HTTPException(status_code=400, detail="Provide username or email to share with")

    try:
        note_uuid = uuid.UUID(note_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Note not found")

    note = db.get(Note, note_uuid)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the owner can share this note")

    user_q = select(User)
    if payload.username:
        user_q = user_q.where(User.username == payload.username)
    if payload.email:
        user_q = user_q.where(User.email == payload.email) if payload.username is None else user_q.where(or_(User.email == payload.email, User.username == payload.username))

    target_user = db.execute(user_q).scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=404, detail="User to share with not found")

    if target_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot share a note with yourself")

    existing = db.execute(
        select(SharedNote).where(and_(SharedNote.note_id == note.id, SharedNote.shared_with_user_id == target_user.id))
    ).scalar_one_or_none()
    if existing:
        return {"detail": "Already shared with this user"}

    share = SharedNote(note_id=note.id, shared_with_user_id=target_user.id)
    db.add(share)
    db.commit()
    return {"detail": "Note shared"}

@router.get("/shared", response_model=list[NoteOut])
def list_shared_with_me(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = (
        select(Note)
        .join(SharedNote, SharedNote.note_id == Note.id)
        .where(SharedNote.shared_with_user_id == current_user.id)
        .order_by(Note.created_at.desc())
    )
    notes = db.execute(stmt).scalars().all()
    return list(notes)