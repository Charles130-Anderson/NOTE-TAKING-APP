#!/usr/bin/env python3
"""Pydantic schema for sending emails."""

from pydantic import BaseModel, EmailStr


class EmailRequest(BaseModel):
    """Schema for an email request."""
    to: EmailStr
    subject: str
    body: str
