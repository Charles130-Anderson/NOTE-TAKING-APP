#!/usr/bin/env python3
"""Pydantic schemas for authentication requests and responses."""

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    """Schema for user registration request."""
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    """Schema for user login request."""
    username_or_email: str
    password: str


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str
