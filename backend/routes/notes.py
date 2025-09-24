import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models.note import Note
from models.shared_note import SharedNote
from models.user import User
from schemas.notes import NoteCreate, NoteOut, NoteUpdate
from utils.auth import get_current_user

router = APIRouter(prefix="/notes")

@router.post("", response_model=NoteOut)
def create_note(payload: NoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = Note(title=payload.title, content=payload.content, owner_id=current_user.id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.get("", response_model=list[NoteOut])
def list_my_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notes = db.execute(select(Note).where(Note.owner_id == current_user.id).order_by(Note.created_at.desc()))
    return list(notes.scalars().all())

@router.get("/{note_id}", response_model=NoteOut)
def get_note(note_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        note_uuid = uuid.UUID(note_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Note not found")

    note = db.get(Note, note_uuid)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note.owner_id != current_user.id:
        shared = db.execute(
            select(SharedNote).where(SharedNote.note_id == note.id, SharedNote.shared_with_user_id == current_user.id)
        ).scalar_one_or_none()
        if not shared:
            raise HTTPException(status_code=403, detail="Not authorized to view this note")
    return note

@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: str, payload: NoteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        note_uuid = uuid.UUID(note_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Note not found")

    note = db.get(Note, note_uuid)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the owner can update this note")

    if payload.title is not None:
        note.title = payload.title
    if payload.content is not None:
        note.content = payload.content

    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.delete("/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        note_uuid = uuid.UUID(note_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Note not found")

    note = db.get(Note, note_uuid)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the owner can delete this note")

    db.delete(note)
    db.commit()
    return {"detail": "Note deleted"}