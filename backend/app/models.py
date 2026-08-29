from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    verification_code = Column(String(20), nullable=True, index=True)
    verification_expires_at = Column(DateTime(timezone=True), nullable=True)
    reset_token = Column(String(64), nullable=True, index=True)
    reset_expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # Profile Extensions
    phone = Column(String(20), nullable=True)
    bio = Column(String(500), nullable=True)
    university = Column(String(255), nullable=True)
    major = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    profile_picture_url = Column(String(255), nullable=True)
    average_rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)

    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    listings = relationship("ServiceListing", back_populates="user", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    proficiency = Column(String(50), nullable=False)

    user = relationship("User", back_populates="skills")


class ServiceListing(Base):
    __tablename__ = "service_listings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    price = Column(String(50), nullable=False)
    description = Column(String(1000), nullable=False)
    delivery_time = Column(String(100), nullable=True)
    sample_work_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="listings")
    requests = relationship("ServiceRequest", back_populates="listing", cascade="all, delete-orphan")
    media = relationship("SkillMedia", back_populates="listing", cascade="all, delete-orphan")


class SkillMedia(Base):
    __tablename__ = "skill_media"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("service_listings.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False) # 'video' or 'image'
    title = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    listing = relationship("ServiceListing", back_populates="media")



class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("service_listings.id", ondelete="CASCADE"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    notes = Column(String(1000), nullable=True)
    status = Column(String(50), default="pending")  # pending, accepted, completed, declined, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    listing = relationship("ServiceListing", back_populates="requests")
    requester = relationship("User", foreign_keys=[requester_id])
    seller = relationship("User", foreign_keys=[seller_id])
    reviews = relationship("Review", back_populates="request", cascade="all, delete-orphan")
    disputes = relationship("Dispute", back_populates="request", cascade="all, delete-orphan")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("service_requests.id", ondelete="CASCADE"), nullable=False, unique=True)
    reviewer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False) # 1-5
    comment = Column(String(1000), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    request = relationship("ServiceRequest", back_populates="reviews")
    reviewer = relationship("User", foreign_keys=[reviewer_id])
    seller = relationship("User", foreign_keys=[seller_id])


class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("service_requests.id", ondelete="CASCADE"), nullable=False)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reason = Column(String(1000), nullable=False)
    status = Column(String(50), default="open") # open, resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    request = relationship("ServiceRequest", back_populates="disputes")
    reporter = relationship("User", foreign_keys=[reporter_id])
