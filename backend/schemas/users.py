#!/usr/bin/env python3
"""Pydantic schema for user output data."""

from datetime import datetime
from pydantic import BaseModel, EmailStr
from uuid import UUID


class UserOut(BaseModel):
    """Schema for returning user details."""
    id: UUID
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
