from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os

from app.models import User, UserCreate, UserUpdate
from app.database import get_database
from app.utils.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter()
security = HTTPBearer()

# Password hashing - using pbkdf2_sha256 instead of bcrypt to avoid 72-byte limit
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        db = get_database()
        
        # Check if user already exists
        existing_user = await db.users.find_one({
            "$or": [
                {"email": user_data.email},
                {"username": user_data.username}
            ]
        })
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email or username already exists"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user document
        user_doc = {
            "username": user_data.username,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "hashed_password": hashed_password,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert user
        result = await db.users.insert_one(user_doc)
        
        # Don't create access token for registration
        # User must login separately after email verification
        
        return {
            "status": "success",
            "message": "User registered successfully. Please check your email for verification.",
            "user_id": str(result.inserted_id),
            "email": user_data.email,
            "requires_email_verification": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=dict)
async def login(login_data: dict):
    """Login user"""
    try:
        email = login_data.get("email") or login_data.get("username")
        password = login_data.get("password")
        
        if not email or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and password are required"
            )
        
        db = get_database()
        
        # Find user by email or username
        user = await db.users.find_one({
            "$or": [
                {"email": email},
                {"username": email}
            ]
        })
        
        if not user or not verify_password(password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is deactivated"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(user["_id"]), "username": user["username"]}
        )
        
        return {
            "status": "success",
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "full_name": user["full_name"],
                "avatar_url": user.get("avatar_url"),
                "is_active": user.get("is_active", True),
                "created_at": user["created_at"],
                "updated_at": user["updated_at"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    try:
        db = get_database()
        
        from bson import ObjectId
        
        user = await db.users.find_one(
            {"_id": ObjectId(current_user["user_id"])},
            {"hashed_password": 0}  # Exclude password from response
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "status": "success",
            "user": {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"],
                "full_name": user["full_name"],
                "avatar_url": user.get("avatar_url"),
                "is_active": user.get("is_active", True),
                "created_at": user["created_at"],
                "updated_at": user["updated_at"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user info: {str(e)}"
        )

@router.put("/me", response_model=dict)
async def update_current_user(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update current user information"""
    try:
        db = get_database()
        
        # Prepare update data
        update_data = {"updated_at": datetime.utcnow()}
        
        if user_update.username is not None:
            # Check if username is already taken
            existing_user = await db.users.find_one({
                "username": user_update.username,
                "_id": {"$ne": current_user["user_id"]}
            })
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
            update_data["username"] = user_update.username
        
        if user_update.full_name is not None:
            update_data["full_name"] = user_update.full_name
        
        if user_update.avatar_url is not None:
            update_data["avatar_url"] = user_update.avatar_url
        
        # Update user
        result = await db.users.update_one(
            {"_id": current_user["user_id"]},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "status": "success",
            "message": "User updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )

@router.post("/logout", response_model=dict)
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (client should remove token)"""
    return {
        "status": "success",
        "message": "Logout successful"
    }

@router.post("/refresh", response_model=dict)
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Refresh access token"""
    try:
        # Create new access token
        access_token = create_access_token(
            data={"sub": str(current_user["user_id"]), "username": current_user["username"]}
        )
        
        return {
            "status": "success",
            "message": "Token refreshed successfully",
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to refresh token: {str(e)}"
        )
