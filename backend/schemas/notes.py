#!/usr/bin/env python3
"""Pydantic schemas for notes CRUD operations."""

from datetime import datetime
from pydantic import BaseModel
from uuid import UUID


class NoteCreate(BaseModel):
    """Schema for creating a new note."""
    title: str
    content: str


class NoteUpdate(BaseModel):
    """Schema for updating an existing note."""
    title: str | None = None
    content: str | None = None


class NoteOut(BaseModel):
    """Schema for returning note details."""
    id: UUID
    title: str
    content: str
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
