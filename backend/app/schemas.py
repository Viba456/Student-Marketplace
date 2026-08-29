from pydantic import BaseModel, EmailStr
from typing import Optional, List


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class SkillCreate(BaseModel):
    skill_name: str
    proficiency: str

class SkillOut(BaseModel):
    id: int
    skill_name: str
    proficiency: str

    class Config:
        orm_mode = True

class ServiceListingCreate(BaseModel):
    title: str
    category: str
    price: str
    description: str
    delivery_time: Optional[str] = None
    sample_work_url: Optional[str] = None

class ServiceListingUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    price: Optional[str] = None
    description: Optional[str] = None
    delivery_time: Optional[str] = None
    sample_work_url: Optional[str] = None
    is_active: Optional[bool] = None

class SkillMediaOut(BaseModel):
    id: int
    listing_id: int
    filename: str
    file_url: str
    file_type: str
    title: Optional[str] = None

    class Config:
        orm_mode = True

class SkillMediaAccessOut(BaseModel):
    access_granted: bool
    is_locked: bool
    media_count: int = 0
    message: str
    media: List[SkillMediaOut] = []

class ServiceListingOut(BaseModel):
    id: int
    title: str
    category: str
    price: str
    description: str
    delivery_time: Optional[str] = None
    sample_work_url: Optional[str] = None
    is_active: bool
    # simplified user info for grid
    seller_name: Optional[str] = None
    seller_avatar: Optional[str] = None
    seller_major: Optional[str] = None
    rating: Optional[float] = 0.0
    reviews: Optional[int] = 0
    media_count: Optional[int] = 0

    class Config:
        orm_mode = True

class ServiceRequestCreate(BaseModel):
    listing_id: int
    notes: Optional[str] = None

class ServiceRequestUpdate(BaseModel):
    status: str

class ServiceRequestOut(BaseModel):
    id: int
    listing_id: int
    requester_id: int
    seller_id: int
    notes: Optional[str] = None
    status: str
    listing: ServiceListingOut
    has_review: bool = False
    has_dispute: bool = False

    class Config:
        orm_mode = True

class ReviewCreate(BaseModel):
    request_id: int
    rating: int
    comment: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    request_id: int
    reviewer_id: int
    seller_id: int
    rating: int
    comment: Optional[str] = None

    class Config:
        orm_mode = True

class DisputeCreate(BaseModel):
    request_id: int
    reason: str

class DisputeOut(BaseModel):
    id: int
    request_id: int
    reporter_id: int
    reason: str
    status: str

    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    major: Optional[str] = None
    is_verified: bool
    is_admin: bool
    phone: Optional[str] = None
    bio: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[int] = None
    profile_picture_url: Optional[str] = None
    average_rating: float
    rating_count: int
    skills: List[SkillOut] = []
    listings: List[ServiceListingOut] = []

    class Config:
        orm_mode = True

class AdminStatsOut(BaseModel):
    total_users: int
    total_listings: int
    total_requests: int
    total_disputes: int


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    email: EmailStr
    token: str
    new_password: str


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    university: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    profile_picture_url: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ResendOTPRequest(BaseModel):
    email: EmailStr
