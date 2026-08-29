from sqlalchemy.orm import Session
from . import models, schemas
import bcrypt

def get_password_hash(password: str) -> str:
    # Hash the password and decode the bytes to string
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed = get_password_hash(user.password)
    is_admin = user.email == "viba@gmail.com"
    db_user = models.User(email=user.email, full_name=user.full_name, hashed_password=hashed, is_admin=is_admin)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def set_reset_token(db: Session, email: str, token: str, expires_at):
    user = get_user_by_email(db, email)
    if not user:
        return None
    user.reset_token = token
    user.reset_expires_at = expires_at
    db.add(user)
    db.commit()
    return user


def reset_password(db: Session, email: str, new_password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    user.hashed_password = get_password_hash(new_password)
    user.reset_token = None
    user.reset_expires_at = None
    db.add(user)
    db.commit()
    return user


def update_user_profile(db: Session, email: str, profile: schemas.UpdateProfileRequest):
    user = get_user_by_email(db, email)
    if not user:
        return None
    
    update_data = profile.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
        
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def change_user_password(db: Session, email: str, new_password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    user.hashed_password = get_password_hash(new_password)
    db.add(user)
    db.commit()
    return user


def delete_user(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    db.delete(user)
    db.commit()
    return True


def add_user_skill(db: Session, email: str, skill: schemas.SkillCreate):
    user = get_user_by_email(db, email)
    if not user:
        return None
    db_skill = models.Skill(user_id=user.id, skill_name=skill.skill_name, proficiency=skill.proficiency)
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def remove_user_skill(db: Session, email: str, skill_id: int):
    user = get_user_by_email(db, email)
    if not user:
        return None
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id, models.Skill.user_id == user.id).first()
    if db_skill:
        db.delete(db_skill)
        db.commit()
        return True
    return False

def create_listing(db: Session, email: str, listing: schemas.ServiceListingCreate):
    user = get_user_by_email(db, email)
    if not user:
        return None
    db_listing = models.ServiceListing(
        user_id=user.id,
        title=listing.title,
        category=listing.category,
        price=listing.price,
        description=listing.description,
        delivery_time=listing.delivery_time,
        sample_work_url=listing.sample_work_url
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

def get_active_listings(db: Session):
    return db.query(models.ServiceListing).filter(models.ServiceListing.is_active == True).all()

def update_listing(db: Session, email: str, listing_id: int, update_data: schemas.ServiceListingUpdate):
    user = get_user_by_email(db, email)
    if not user:
        return None
    listing = db.query(models.ServiceListing).filter(
        models.ServiceListing.id == listing_id,
        models.ServiceListing.user_id == user.id
    ).first()
    if not listing:
        return None
    
    update_dict = update_data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(listing, key, value)
    
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

def delete_listing(db: Session, email: str, listing_id: int):
    user = get_user_by_email(db, email)
    if not user:
        return None
    listing = db.query(models.ServiceListing).filter(
        models.ServiceListing.id == listing_id,
        models.ServiceListing.user_id == user.id
    ).first()
    if not listing:
        return False
    db.delete(listing)
    db.commit()
    return True

def create_service_request(db: Session, email: str, request_data: schemas.ServiceRequestCreate):
    requester = get_user_by_email(db, email)
    if not requester:
        return None
    listing = db.query(models.ServiceListing).filter(models.ServiceListing.id == request_data.listing_id).first()
    if not listing:
        return None
    
    db_req = models.ServiceRequest(
        listing_id=listing.id,
        requester_id=requester.id,
        seller_id=listing.user_id,
        notes=request_data.notes,
        status="pending"
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

def get_incoming_requests(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        return []
    return db.query(models.ServiceRequest).filter(models.ServiceRequest.seller_id == user.id).all()

def get_outgoing_requests(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        return []
    return db.query(models.ServiceRequest).filter(models.ServiceRequest.requester_id == user.id).all()

def update_request_status(db: Session, email: str, request_id: int, status: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == request_id).first()
    if not req:
        return None
    
    # only seller can accept/decline/complete. buyer can cancel.
    if req.seller_id == user.id and status in ["accepted", "completed", "declined"]:
        req.status = status
    elif req.requester_id == user.id and status == "cancelled":
        req.status = status
    else:
        return None
        
    db.commit()
    db.refresh(req)
    return req

def create_review(db: Session, email: str, review_data: schemas.ReviewCreate):
    user = get_user_by_email(db, email)
    if not user:
        return None
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == review_data.request_id).first()
    if not req or req.requester_id != user.id or req.status != "completed":
        return None
    
    # Check if already reviewed
    existing_review = db.query(models.Review).filter(models.Review.request_id == req.id).first()
    if existing_review:
        return None
        
    db_review = models.Review(
        request_id=req.id,
        reviewer_id=user.id,
        seller_id=req.seller_id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    db.add(db_review)
    
    # Update seller rating
    seller = db.query(models.User).filter(models.User.id == req.seller_id).first()
    if seller:
        current_avg = seller.average_rating or 0.0
        current_count = seller.rating_count or 0
        total_rating = (current_avg * current_count) + review_data.rating
        seller.rating_count = current_count + 1
        seller.average_rating = total_rating / seller.rating_count
        
    db.commit()
    db.refresh(db_review)
    return db_review

def create_dispute(db: Session, email: str, dispute_data: schemas.DisputeCreate):
    user = get_user_by_email(db, email)
    if not user:
        return None
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == dispute_data.request_id).first()
    if not req:
        return None
    
    # only buyer or seller can dispute
    if user.id not in [req.requester_id, req.seller_id]:
        return None
        
    db_dispute = models.Dispute(
        request_id=req.id,
        reporter_id=user.id,
        reason=dispute_data.reason
    )
    db.add(db_dispute)
    
    req.status = "disputed"
    
    db.commit()
    db.refresh(db_dispute)
    return db_dispute


def check_user_enrolled(db: Session, user_id: int, listing_id: int) -> bool:
    listing = db.query(models.ServiceListing).filter(models.ServiceListing.id == listing_id).first()
    if not listing:
        return False
    # Owner always has access
    if listing.user_id == user_id:
        return True
    # Check if user has an active or completed booking request for this listing
    req = db.query(models.ServiceRequest).filter(
        models.ServiceRequest.listing_id == listing_id,
        models.ServiceRequest.requester_id == user_id,
        models.ServiceRequest.status.in_(["pending", "accepted", "completed", "disputed"])
    ).first()
    return req is not None


def add_listing_media(db: Session, email: str, listing_id: int, filename: str, file_url: str, file_type: str, title: str = None):
    user = get_user_by_email(db, email)
    if not user:
        return None
    listing = db.query(models.ServiceListing).filter(
        models.ServiceListing.id == listing_id,
        models.ServiceListing.user_id == user.id
    ).first()
    if not listing:
        return None

    db_media = models.SkillMedia(
        listing_id=listing_id,
        filename=filename,
        file_url=file_url,
        file_type=file_type,
        title=title or filename
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media


def get_listing_media(db: Session, listing_id: int):
    return db.query(models.SkillMedia).filter(models.SkillMedia.listing_id == listing_id).all()


def delete_listing_media(db: Session, email: str, listing_id: int, media_id: int):
    user = get_user_by_email(db, email)
    if not user:
        return False
    listing = db.query(models.ServiceListing).filter(
        models.ServiceListing.id == listing_id,
        models.ServiceListing.user_id == user.id
    ).first()
    if not listing:
        return False
    media = db.query(models.SkillMedia).filter(
        models.SkillMedia.id == media_id,
        models.SkillMedia.listing_id == listing_id
    ).first()
    if not media:
        return False
    db.delete(media)
    db.commit()
    return True

