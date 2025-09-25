#!/usr/bin/env python3
"""Pydantic schemas for note sharing operations."""

from datetime import datetime
from pydantic import BaseModel, EmailStr
from uuid import UUID


class ShareRequest(BaseModel):
    """Schema for sharing a note with a user."""
    username: str | None = None
    email: EmailStr | None = None


class ShareUpdate(BaseModel):
    """Schema for updating sharing permissions."""
    permission: str


class SharedNoteOut(BaseModel):
    """Schema for returning shared note details."""
    id: UUID
    note_id: UUID
    shared_with_user_id: str
    shared_at: datetime

    class Config:
        from_attributes = True
