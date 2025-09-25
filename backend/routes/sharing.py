import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session
from utils.emails import send_email
from database import get_db
from models.note import Note
from models.shared_note import SharedNote
from models.user import User
from schemas.notes import NoteOut
from schemas.sharing import ShareRequest, ShareUpdate
from utils.auth import get_current_user
from schemas.emails import EmailRequest

router = APIRouter()


@router.post("/notes/{note_id}/share")
def share_note(
    note_id: str,
    payload: ShareRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Share a note with another user and assign permission"""
    if not payload.email:
        raise HTTPException(status_code=400, detail="Provide email to share with")

    try:
        note_uuid = uuid.UUID(note_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Note not found")

    note = db.get(Note, note_uuid)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the owner can share this note")

    target_user = db.execute(
        select(User).where(User.email == payload.email)
    ).scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=404, detail="User to share with not found")

    if target_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot share a note with yourself")

    existing = db.execute(
        select(SharedNote).where(
            and_(
                SharedNote.note_id == note.id,
                SharedNote.shared_with_user_id == target_user.id,
            )
        )
    ).scalar_one_or_none()
    if existing:
        return {"detail": f"Already shared as {existing.permission}"}

    share = SharedNote(
        note_id=note.id,
        shared_with_user_id=target_user.id,
        permission=payload.permission,
    )
    db.add(share)
    db.commit()
    return {"detail": f"Note shared with {payload.email} as {payload.permission}"}

    send_email(
        to_email=payload.email,
        subject="A note has been shared with you",
        content=f"{current_user.username} shared a note with you. Visit your dashboard to view."
    )

    return {"detail": f"Note shared with {payload.email} as {payload.permission}"}

@router.get("/notes/{note_id}/permissions")
def list_permissions(
    note_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Owner can see all shared users and their permissions"""
    try:
        note_uuid = uuid.UUID(note_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Note not found")

    note = db.get(Note, note_uuid)
    if not note or note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    stmt = (
        select(User.email.lebel("email"), SharedNote.permission.label("permission"))
        .join(User, User.id == SharedNote.shared_with_user_id)
        .where(SharedNote.note_id == note.id)
    )
    results = db.execute(stmt).all()
    return [{"email": r[0], "permission": r[1]} for r in results]


@router.put("/notes/{note_id}/permissions/{user_id}")
def update_permission(
    note_id: str,
    user_id: str,
    payload: ShareUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Owner can update a shared user's permission"""
    try:
        note_uuid = uuid.UUID(note_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Note not found")

    note = db.get(Note, note_uuid)
    if not note or note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    shared_entry = db.execute(
        select(SharedNote).where(
            and_(
                SharedNote.note_id == note.id,
                SharedNote.shared_with_user_id == uuid.UUID(user_id),
            )
        )
    ).scalar_one_or_none()

    if not shared_entry:
        raise HTTPException(status_code=404, detail="Share entry not found")

    shared_entry.permission = payload.permission
    db.commit()
    return {"detail": f"Permission updated to {payload.permission}"}

@router.post("/send-email")
async def send_email_endpoint(request: EmailRequest):
    status = send_email(request.to, request.subject, request.body)
    if status is None:
        raise HTTPException(status_code=500, detail="Failed to send email")
    return {"message": "Email sent successfully", "status": status}

@router.delete("/notes/{note_id}/permissions/{user_id}")
def revoke_access(
    note_id: str,
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Owner can revoke access from a shared user"""
    try:
        note_uuid = uuid.UUID(note_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Note not found")

    note = db.get(Note, note_uuid)
    if not note or note.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    shared_entry = db.execute(
        select(SharedNote).where(
            and_(
                SharedNote.note_id == note.id,
                SharedNote.shared_with_user_id == uuid.UUID(user_id),
            )
        )
    ).scalar_one_or_none()

    if not shared_entry:
        raise HTTPException(status_code=404, detail="Share entry not found")

    db.delete(shared_entry)
    db.commit()
    return {"detail": "Access revoked"}
