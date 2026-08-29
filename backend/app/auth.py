import os
import shutil
import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from datetime import datetime, timedelta
from jose import jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .config import settings
from .schemas import PasswordResetRequest, PasswordResetConfirm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)



try:
    from sqlalchemy.orm import Session
    from . import crud, models, schemas
    from .emailer import send_otp_email, generate_otp, otp_expiry
    from .emailer import send_password_reset_email
    from .crud import set_reset_token, reset_password
    import uuid
    from datetime import datetime
    from .database import get_db, engine

    models.Base.metadata.create_all(bind=engine)
    USE_DB = True
except Exception:
    # Fallback to an in-memory store when SQLAlchemy or DB isn't usable
    USE_DB = False
    from . import schemas
    from .emailer import send_otp_email, generate_otp, otp_expiry, send_password_reset_email

    class InMemoryUser:
        def __init__(self, email, full_name, password):
            self.id = 1
            self.email = email
            self.full_name = full_name
            self.hashed_password = password
            self.is_active = True
            self.is_verified = False
            self.is_admin = email == "viba@gmail.com"
            self.created_at = datetime.utcnow()
            self.verification_code = None
            self.verification_expires_at = None
            self.phone = None
            self.bio = None
            self.university = None
            self.major = None
            self.graduation_year = None
            self.profile_picture_url = None
            self.average_rating = 0.0
            self.rating_count = 0
            self.skills = []
            self._next_skill_id = 1
            self.listings = []
            self._next_listing_id = 1
            self.incoming_requests = []
            self.outgoing_requests = []
            self._next_request_id = 1

    _fake_users: dict[str, InMemoryUser] = {}

    def get_db():
        yield None

# Ensure _fake_users is defined even if USE_DB is true, so imports don't fail
if 'USE_DB' in locals() and USE_DB:
    _fake_users = {}

router = APIRouter()

@router.get("")
def auth_root():
    return {"status": "auth module up"}


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: object = Depends(get_db)):
    if USE_DB:
        existing = crud.get_user_by_email(db, user.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        created = crud.create_user(db, user)
        code = generate_otp()
        created.verification_code = code
        created.verification_expires_at = otp_expiry()
        db.add(created)
        db.commit()
        send_otp_email(created.email, code, subject="Verify your Student Marketplace account")
        return created
    else:
        if user.email in _fake_users:
            raise HTTPException(status_code=400, detail="Email already registered")
        u = InMemoryUser(user.email, user.full_name, user.password)
        code = generate_otp()
        u.verification_code = code
        u.verification_expires_at = otp_expiry()
        _fake_users[user.email] = u
        send_otp_email(user.email, code, subject="Verify your Student Marketplace account")
        return {
            "id": 1,
            "email": u.email,
            "full_name": u.full_name,
            "is_active": u.is_active,
            "is_verified": u.is_verified,
        }


@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: object = Depends(get_db)):
    if USE_DB:
        user = crud.authenticate_user(db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
        if not user.is_verified:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not verified")
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        user = _fake_users.get(form_data.username)
        if not user or user.hashed_password != form_data.password:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
        if not user.is_verified:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not verified")
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(token: str = Depends(oauth2_scheme), db: object = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    if USE_DB:
        user = crud.get_user_by_email(db, email)
        if user is None:
            raise credentials_exception
        return user
    else:
        user = _fake_users.get(email)
        if not user:
            raise credentials_exception
        return {
            "id": 1, "email": user.email, "full_name": user.full_name, "is_active": user.is_active, "is_verified": user.is_verified,
            "phone": user.phone, "bio": user.bio, "university": user.university, "major": user.major, "graduation_year": user.graduation_year,
            "profile_picture_url": user.profile_picture_url, "average_rating": user.average_rating, "rating_count": user.rating_count,
            "skills": user.skills,
            "listings": user.listings
        }


def get_optional_current_user(token: Optional[str] = Depends(optional_oauth2_scheme), db: object = Depends(get_db)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except Exception:
        return None
    if USE_DB:
        user = crud.get_user_by_email(db, email)
        return user
    else:
        user = _fake_users.get(email)
        if not user:
            return None
        return {
            "id": user.id, "email": user.email, "full_name": user.full_name, "is_active": user.is_active, "is_verified": user.is_verified,
            "phone": user.phone, "bio": user.bio, "university": user.university, "major": user.major, "graduation_year": user.graduation_year,
            "profile_picture_url": user.profile_picture_url, "average_rating": user.average_rating, "rating_count": user.rating_count,
            "skills": user.skills,
            "listings": user.listings
        }



@router.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/verify-email")
def verify_email(payload: schemas.VerifyEmailRequest, db: object = Depends(get_db)):
    email = payload.email
    code = payload.code
    if USE_DB:
        user = crud.get_user_by_email(db, email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.is_verified:
            return {"status": "ok", "detail": "already verified"}
        if not user.verification_code or user.verification_code != code:
            raise HTTPException(status_code=400, detail="Invalid verification code")
        if user.verification_expires_at and user.verification_expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Verification code expired")
        user.is_verified = True
        user.verification_code = None
        user.verification_expires_at = None
        db.add(user)
        db.commit()
        return {"status": "ok", "detail": "email verified"}
    else:
        user = _fake_users.get(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.is_verified:
            return {"status": "ok", "detail": "already verified"}
        if user.verification_code != code:
            raise HTTPException(status_code=400, detail="Invalid verification code")
        if user.verification_expires_at and user.verification_expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Verification code expired")
        user.is_verified = True
        user.verification_code = None
        user.verification_expires_at = None
        return {"status": "ok", "detail": "email verified"}


@router.post("/resend-otp")
def resend_otp(payload: schemas.ResendOTPRequest, db: object = Depends(get_db)):
    email = payload.email
    code = generate_otp()
    if USE_DB:
        user = crud.get_user_by_email(db, email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.is_verified:
            return {"status": "ok", "detail": "already verified"}
        user.verification_code = code
        user.verification_expires_at = otp_expiry()
        db.add(user)
        db.commit()
        send_otp_email(user.email, code, subject="Your new verification code")
        return {"status": "ok", "detail": "OTP sent"}
    else:
        user = _fake_users.get(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.is_verified:
            return {"status": "ok", "detail": "already verified"}
        user.verification_code = code
        user.verification_expires_at = otp_expiry()
        send_otp_email(user.email, code, subject="Your new verification code")
        return {"status": "ok", "detail": "OTP sent"}


@router.put("/users/me", response_model=schemas.UserOut)
def update_profile(
    profile_update: schemas.UpdateProfileRequest,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        user = crud.update_user_profile(db, current_user.email, profile_update)
        return user
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        if profile_update.full_name is not None: user.full_name = profile_update.full_name
        if profile_update.phone is not None: user.phone = profile_update.phone
        if profile_update.bio is not None: user.bio = profile_update.bio
        if profile_update.university is not None: user.university = profile_update.university
        if profile_update.major is not None: user.major = profile_update.major
        if profile_update.graduation_year is not None: user.graduation_year = profile_update.graduation_year
        if profile_update.profile_picture_url is not None: user.profile_picture_url = profile_update.profile_picture_url
        
        return {
            "id": 1, "email": user.email, "full_name": user.full_name, "is_active": user.is_active, "is_verified": user.is_verified,
            "phone": user.phone, "bio": user.bio, "university": user.university, "major": user.major, "graduation_year": user.graduation_year,
            "profile_picture_url": user.profile_picture_url, "average_rating": user.average_rating, "rating_count": user.rating_count,
            "skills": user.skills,
            "listings": user.listings
        }

@router.post("/users/me/skills", response_model=schemas.SkillOut)
def add_skill(
    skill: schemas.SkillCreate,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        return crud.add_user_skill(db, current_user.email, skill)
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        new_skill = {
            "id": user._next_skill_id,
            "skill_name": skill.skill_name,
            "proficiency": skill.proficiency
        }
        user._next_skill_id += 1
        user.skills.append(new_skill)
        return new_skill

@router.delete("/users/me/skills/{skill_id}")
def remove_skill(
    skill_id: int,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        success = crud.remove_user_skill(db, current_user.email, skill_id)
        if not success:
            raise HTTPException(status_code=404, detail="Skill not found")
        return {"status": "ok", "detail": "Skill removed"}
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        user.skills = [s for s in user.skills if s["id"] != skill_id]
        return {"status": "ok", "detail": "Skill removed"}

@router.post("/users/me/listings", response_model=schemas.ServiceListingOut)
def create_listing(
    listing: schemas.ServiceListingCreate,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        db_listing = crud.create_listing(db, current_user.email, listing)
        return {
            "id": db_listing.id,
            "title": db_listing.title,
            "category": db_listing.category,
            "price": db_listing.price,
            "description": db_listing.description,
            "delivery_time": db_listing.delivery_time,
            "sample_work_url": db_listing.sample_work_url,
            "is_active": db_listing.is_active,
            "seller_name": db_listing.user.full_name,
            "seller_avatar": db_listing.user.profile_picture_url,
            "seller_major": db_listing.user.major,
            "rating": db_listing.user.average_rating,
            "reviews": db_listing.user.rating_count
        }
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        new_listing = {
            "id": user._next_listing_id,
            "title": listing.title,
            "category": listing.category,
            "price": listing.price,
            "description": listing.description,
            "delivery_time": listing.delivery_time,
            "sample_work_url": listing.sample_work_url,
            "is_active": True,
            "seller_name": user.full_name,
            "seller_avatar": user.profile_picture_url,
            "seller_major": user.major,
            "rating": user.average_rating,
            "reviews": user.rating_count
        }
        user._next_listing_id += 1
        user.listings.append(new_listing)
        return new_listing

@router.get("/listings", response_model=list[schemas.ServiceListingOut])
def get_all_listings(db: object = Depends(get_db)):
    if USE_DB:
        db_listings = crud.get_active_listings(db)
        out = []
        for l in db_listings:
            out.append({
                "id": l.id,
                "title": l.title,
                "category": l.category,
                "price": l.price,
                "description": l.description,
                "delivery_time": l.delivery_time,
                "sample_work_url": l.sample_work_url,
                "is_active": l.is_active,
                "seller_name": l.user.full_name,
                "seller_avatar": l.user.profile_picture_url,
                "seller_major": l.user.major,
                "rating": l.user.average_rating,
                "reviews": l.user.rating_count,
            })
        return out
    else:
        all_listings = []
        for user in _fake_users.values():
            for l in user.listings:
                if l["is_active"]:
                    all_listings.append(l)
        return all_listings

@router.put("/users/me/listings/{listing_id}", response_model=schemas.ServiceListingOut)
def update_listing(
    listing_id: int,
    listing_update: schemas.ServiceListingUpdate,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        listing = crud.update_listing(db, current_user.email, listing_id, listing_update)
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        return {
            "id": listing.id,
            "title": listing.title,
            "category": listing.category,
            "price": listing.price,
            "description": listing.description,
            "delivery_time": listing.delivery_time,
            "sample_work_url": listing.sample_work_url,
            "is_active": listing.is_active,
            "seller_name": listing.user.full_name,
            "seller_avatar": listing.user.profile_picture_url,
            "seller_major": listing.user.major,
            "rating": listing.user.average_rating,
            "reviews": listing.user.rating_count,
        }
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        for l in user.listings:
            if l["id"] == listing_id:
                if listing_update.title is not None: l["title"] = listing_update.title
                if listing_update.category is not None: l["category"] = listing_update.category
                if listing_update.price is not None: l["price"] = listing_update.price
                if listing_update.description is not None: l["description"] = listing_update.description
                if listing_update.delivery_time is not None: l["delivery_time"] = listing_update.delivery_time
                if listing_update.sample_work_url is not None: l["sample_work_url"] = listing_update.sample_work_url
                if listing_update.is_active is not None: l["is_active"] = listing_update.is_active
                return l
        raise HTTPException(status_code=404, detail="Listing not found")

@router.delete("/users/me/listings/{listing_id}")
def delete_listing(
    listing_id: int,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        success = crud.delete_listing(db, current_user.email, listing_id)
        if not success:
            raise HTTPException(status_code=404, detail="Listing not found")
        return {"status": "ok", "detail": "Listing removed"}
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        user.listings = [l for l in user.listings if l["id"] != listing_id]
        return {"status": "ok", "detail": "Listing removed"}

@router.post("/listings/{listing_id}/media", response_model=List[schemas.SkillMediaOut])
def upload_listing_media(
    listing_id: int,
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    title: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    upload_list = []
    if files:
        upload_list.extend(files)
    if file:
        upload_list.append(file)
        
    if not upload_list:
        raise HTTPException(status_code=400, detail="No files provided for upload")
        
    uploaded_items = []
    user_email = current_user.email if hasattr(current_user, "email") else current_user.get("email")

    for f in upload_list:
        content_type = f.content_type or ""
        filename = f.filename or "media_file"
        ext = os.path.splitext(filename)[1].lower()
        
        if content_type.startswith("video/") or ext in [".mp4", ".webm", ".mov", ".avi", ".mkv"]:
            file_type = "video"
        elif content_type.startswith("image/") or ext in [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]:
            file_type = "image"
        else:
            file_type = "video" if "video" in filename.lower() else "image"
            
        unique_filename = f"{uuid.uuid4().hex}{ext or '.dat'}"
        save_path = os.path.join("uploads", "media", unique_filename)
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(f.file, buffer)
            
        file_url = f"/uploads/media/{unique_filename}"
        media_title = title if (len(upload_list) == 1 and title) else filename

        if USE_DB:
            db_media = crud.add_listing_media(db, user_email, listing_id, filename, file_url, file_type, media_title)
            if not db_media:
                raise HTTPException(status_code=403, detail="Listing not found or permission denied")
            uploaded_items.append({
                "id": db_media.id,
                "listing_id": db_media.listing_id,
                "filename": db_media.filename,
                "file_url": db_media.file_url,
                "file_type": db_media.file_type,
                "title": db_media.title
            })
        else:
            user = _fake_users.get(user_email)
            listing = None
            if user:
                for l in user.listings:
                    if l["id"] == listing_id:
                        listing = l
                        break
            if not listing:
                raise HTTPException(status_code=403, detail="Listing not found or permission denied")
            if "media" not in listing:
                listing["media"] = []
            new_media = {
                "id": len(listing["media"]) + 1,
                "listing_id": listing_id,
                "filename": filename,
                "file_url": file_url,
                "file_type": file_type,
                "title": media_title
            }
            listing["media"].append(new_media)
            uploaded_items.append(new_media)

    return uploaded_items



@router.get("/listings/{listing_id}/media", response_model=schemas.SkillMediaAccessOut)
def get_listing_media(
    listing_id: int,
    current_user: Optional[dict] = Depends(get_optional_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        listing = db.query(models.ServiceListing).filter(models.ServiceListing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        user_id = 0
        if current_user:
            if hasattr(current_user, "id"):
                user_id = current_user.id
            elif isinstance(current_user, dict):
                user_id = current_user.get("id", 0)
                if not user_id and current_user.get("email"):
                    db_u = crud.get_user_by_email(db, current_user.get("email"))
                    if db_u:
                        user_id = db_u.id
        
        all_media = crud.get_listing_media(db, listing_id)
        media_count = len(all_media)
        
        is_enrolled = crud.check_user_enrolled(db, user_id, listing_id) if user_id else False
        
        if is_enrolled:
            out_media = [
                {
                    "id": m.id,
                    "listing_id": m.listing_id,
                    "filename": m.filename,
                    "file_url": m.file_url,
                    "file_type": m.file_type,
                    "title": m.title
                } for m in all_media
            ]
            return {
                "access_granted": True,
                "is_locked": False,
                "media_count": media_count,
                "message": "Access granted to course media.",
                "media": out_media
            }
        else:
            return {
                "access_granted": False,
                "is_locked": True,
                "media_count": media_count,
                "message": "Exclusive course media is locked. Book/Sign up for this skill to unlock full access!",
                "media": []
            }
    else:
        email = current_user.get("email") if (current_user and isinstance(current_user, dict)) else None
        current_u = _fake_users.get(email) if email else None
        user_id = current_u.id if current_u else 0
        
        target_listing = None
        target_seller = None
        for u in _fake_users.values():
            for l in u.listings:
                if l["id"] == listing_id:
                    target_listing = l
                    target_seller = u
                    break
        
        if not target_listing:
            raise HTTPException(status_code=404, detail="Listing not found")
            
        media_list = target_listing.get("media", [])
        media_count = len(media_list)
        
        is_enrolled = False
        if target_seller and target_seller.id == user_id and user_id != 0:
            is_enrolled = True
        else:
            if current_u:
                for req in current_u.outgoing_requests:
                    if req.get("listing_id") == listing_id and req.get("status") in ["pending", "accepted", "completed", "disputed"]:
                        is_enrolled = True
                        break
                        
        if is_enrolled:
            return {
                "access_granted": True,
                "is_locked": False,
                "media_count": media_count,
                "message": "Access granted to course media.",
                "media": media_list
            }
        else:
            return {
                "access_granted": False,
                "is_locked": True,
                "media_count": media_count,
                "message": "Exclusive course media is locked. Book/Sign up for this skill to unlock full access!",
                "media": []
            }



@router.delete("/listings/{listing_id}/media/{media_id}")
def delete_listing_media(
    listing_id: int,
    media_id: int,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        user_email = current_user.email if hasattr(current_user, "email") else current_user.get("email")
        success = crud.delete_listing_media(db, user_email, listing_id, media_id)
        if not success:
            raise HTTPException(status_code=404, detail="Media not found or permission denied")
        return {"status": "ok", "detail": "Media deleted"}
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        for l in user.listings:
            if l["id"] == listing_id:
                if "media" in l:
                    l["media"] = [m for m in l["media"] if m["id"] != media_id]
                return {"status": "ok", "detail": "Media deleted"}
        raise HTTPException(status_code=404, detail="Listing not found")


@router.post("/requests", response_model=schemas.ServiceRequestOut)
def create_request(
    req: schemas.ServiceRequestCreate,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        db_req = crud.create_service_request(db, current_user.email, req)
        if not db_req:
            raise HTTPException(status_code=400, detail="Failed to create request")
        return {
            "id": db_req.id,
            "listing_id": db_req.listing_id,
            "requester_id": db_req.requester_id,
            "seller_id": db_req.seller_id,
            "notes": db_req.notes,
            "status": db_req.status,
            "listing": {
                "id": db_req.listing.id,
                "title": db_req.listing.title,
                "category": db_req.listing.category,
                "price": db_req.listing.price,
                "description": db_req.listing.description,
                "is_active": db_req.listing.is_active,
                "seller_name": db_req.listing.user.full_name,
            }
        }
    else:
        email = current_user.get("email")
        buyer = _fake_users.get(email)
        
        # find listing
        target_listing = None
        target_seller = None
        for u in _fake_users.values():
            for l in u.listings:
                if l["id"] == req.listing_id:
                    target_listing = l
                    target_seller = u
                    break
        
        if not target_listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        req_id = buyer._next_request_id
        buyer._next_request_id += 1
        
        req_obj = {
            "id": req_id,
            "listing_id": target_listing["id"],
            "requester_id": buyer.id,
            "seller_id": target_seller.id,
            "notes": req.notes,
            "status": "pending",
            "listing": target_listing
        }
        
        buyer.outgoing_requests.append(req_obj)
        target_seller.incoming_requests.append(req_obj)
        return req_obj

@router.get("/requests/incoming", response_model=list[schemas.ServiceRequestOut])
def get_incoming_requests(current_user: dict = Depends(get_current_user), db: object = Depends(get_db)):
    if USE_DB:
        db_reqs = crud.get_incoming_requests(db, current_user.email)
        out = []
        for r in db_reqs:
            out.append({
                "id": r.id,
                "listing_id": r.listing_id,
                "requester_id": r.requester_id,
                "seller_id": r.seller_id,
                "notes": r.notes,
                "status": r.status,
                "has_review": len(r.reviews) > 0,
                "has_dispute": len(r.disputes) > 0,
                "listing": {
                    "id": r.listing.id,
                    "title": r.listing.title,
                    "category": r.listing.category,
                    "price": r.listing.price,
                    "description": r.listing.description,
                    "is_active": r.listing.is_active,
                    "seller_name": r.listing.user.full_name,
                }
            })
        return out
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        return user.incoming_requests

@router.get("/requests/outgoing", response_model=list[schemas.ServiceRequestOut])
def get_outgoing_requests(current_user: dict = Depends(get_current_user), db: object = Depends(get_db)):
    if USE_DB:
        db_reqs = crud.get_outgoing_requests(db, current_user.email)
        out = []
        for r in db_reqs:
            out.append({
                "id": r.id,
                "listing_id": r.listing_id,
                "requester_id": r.requester_id,
                "seller_id": r.seller_id,
                "notes": r.notes,
                "status": r.status,
                "has_review": len(r.reviews) > 0,
                "has_dispute": len(r.disputes) > 0,
                "listing": {
                    "id": r.listing.id,
                    "title": r.listing.title,
                    "category": r.listing.category,
                    "price": r.listing.price,
                    "description": r.listing.description,
                    "is_active": r.listing.is_active,
                    "seller_name": r.listing.user.full_name,
                }
            })
        return out
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        return user.outgoing_requests

@router.put("/requests/{request_id}/status", response_model=schemas.ServiceRequestOut)
def update_request_status(
    request_id: int,
    update_data: schemas.ServiceRequestUpdate,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        r = crud.update_request_status(db, current_user.email, request_id, update_data.status)
        if not r:
            raise HTTPException(status_code=400, detail="Invalid request or permission denied")
        return {
            "id": r.id,
            "listing_id": r.listing_id,
            "requester_id": r.requester_id,
            "seller_id": r.seller_id,
            "notes": r.notes,
            "status": r.status,
            "has_review": len(r.reviews) > 0,
            "has_dispute": len(r.disputes) > 0,
            "listing": {
                "id": r.listing.id,
                "title": r.listing.title,
                "category": r.listing.category,
                "price": r.listing.price,
                "description": r.listing.description,
                "is_active": r.listing.is_active,
                "seller_name": r.listing.user.full_name,
            }
        }
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        # Search in incoming or outgoing
        found_req = None
        for req in user.incoming_requests:
            if req["id"] == request_id:
                if update_data.status in ["accepted", "completed", "declined"]:
                    req["status"] = update_data.status
                    found_req = req
                    break
        if not found_req:
            for req in user.outgoing_requests:
                if req["id"] == request_id:
                    if update_data.status == "cancelled":
                        req["status"] = update_data.status
                        found_req = req
                        break
        
        if not found_req:
            raise HTTPException(status_code=400, detail="Invalid request or permission denied")
        
        # update the other user's list as well in the mock
        if found_req in user.incoming_requests:
            # user is seller, update buyer
            for u in _fake_users.values():
                if u.id == found_req["requester_id"]:
                    for br in u.outgoing_requests:
                        if br["id"] == request_id:
                            br["status"] = update_data.status
        else:
            # user is buyer, update seller
            for u in _fake_users.values():
                if u.id == found_req["seller_id"]:
                    for sr in u.incoming_requests:
                        if sr["id"] == request_id:
                            sr["status"] = update_data.status
        return found_req

@router.post("/reviews", response_model=schemas.ReviewOut)
def create_review(
    req: schemas.ReviewCreate,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        r = crud.create_review(db, current_user.email, req)
        if not r:
            raise HTTPException(status_code=400, detail="Invalid request or already reviewed")
        return r
    else:
        # Mock logic
        email = current_user.get("email")
        buyer = _fake_users.get(email)
        found_req = None
        for r in buyer.outgoing_requests:
            if r["id"] == req.request_id and r["status"] == "completed" and not r.get("has_review"):
                found_req = r
                break
        if not found_req:
            raise HTTPException(status_code=400, detail="Invalid request or already reviewed")
            
        found_req["has_review"] = True
        # update seller rating
        seller = None
        for u in _fake_users.values():
            if u.id == found_req["seller_id"]:
                seller = u
                break
        if seller:
            current_avg = seller.average_rating or 0.0
            current_count = seller.rating_count or 0
            total = (current_avg * current_count) + req.rating
            seller.rating_count = current_count + 1
            seller.average_rating = total / seller.rating_count
            
        return {
            "id": 999,
            "request_id": req.request_id,
            "reviewer_id": buyer.id,
            "seller_id": seller.id if seller else 0,
            "rating": req.rating,
            "comment": req.comment
        }

@router.post("/disputes", response_model=schemas.DisputeOut)
def create_dispute(
    req: schemas.DisputeCreate,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        r = crud.create_dispute(db, current_user.email, req)
        if not r:
            raise HTTPException(status_code=400, detail="Invalid request")
        return r
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        
        found_req = None
        for r in user.incoming_requests + user.outgoing_requests:
            if r["id"] == req.request_id:
                found_req = r
                break
                
        if not found_req:
            raise HTTPException(status_code=400, detail="Invalid request")
            
        found_req["status"] = "disputed"
        found_req["has_dispute"] = True
        
        # sync to other user
        is_seller = found_req in user.incoming_requests
        other_id = found_req["requester_id"] if is_seller else found_req["seller_id"]
        for u in _fake_users.values():
            if u.id == other_id:
                lst = u.outgoing_requests if is_seller else u.incoming_requests
                for x in lst:
                    if x["id"] == req.request_id:
                        x["status"] = "disputed"
                        x["has_dispute"] = True
                        
        return {
            "id": 999,
            "request_id": req.request_id,
            "reporter_id": user.id,
            "reason": req.reason,
            "status": "open"
        }

@router.post("/change-password")
def change_password(
    payload: schemas.ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        # Check current password
        user = crud.authenticate_user(db, current_user.email, payload.current_password)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect current password")
        crud.change_user_password(db, current_user.email, payload.new_password)
        return {"status": "ok", "detail": "Password changed successfully"}
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        if user.hashed_password != payload.current_password:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect current password")
        user.hashed_password = payload.new_password
        return {"status": "ok", "detail": "Password changed successfully"}


@router.delete("/users/me")
def delete_account(
    current_user: dict = Depends(get_current_user),
    db: object = Depends(get_db)
):
    if USE_DB:
        crud.delete_user(db, current_user.email)
        return {"status": "ok", "detail": "Account deleted"}
    else:
        email = current_user.get("email")
        if email in _fake_users:
            del _fake_users[email]
        return {"status": "ok", "detail": "Account deleted"}


@router.post("/password-reset")
def password_reset_request(payload: PasswordResetRequest, db: object = Depends(get_db)):
    email = payload.email
    if USE_DB:
        user = crud.get_user_by_email(db, email)
        if not user:
            # avoid leaking existence
            return {"status": "ok", "detail": "reset email sent if account exists"}
        token = uuid.uuid4().hex
        expires = datetime.utcnow() + timedelta(hours=1)
        set_reset_token(db, email, token, expires)
        send_password_reset_email(email, token)
        return {"status": "ok", "detail": "reset email sent"}
    else:
        user = _fake_users.get(email)
        if not user:
            return {"status": "ok", "detail": "reset email sent if account exists"}
        token = uuid.uuid4().hex
        expires = datetime.utcnow() + timedelta(hours=1)
        user.reset_token = token
        user.reset_expires_at = expires
        send_password_reset_email(email, token)
        return {"status": "ok", "detail": "reset email sent"}


@router.post("/password-reset/confirm")
def password_reset_confirm(payload: PasswordResetConfirm, db: object = Depends(get_db)):
    email = payload.email
    token = payload.token
    new_password = payload.new_password
    if USE_DB:
        user = crud.get_user_by_email(db, email)
        if not user or not user.reset_token or user.reset_token != token:
            raise HTTPException(status_code=400, detail="Invalid token")
        if user.reset_expires_at and user.reset_expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Token expired")
        reset_password(db, email, new_password)
        return {"status": "ok", "detail": "password changed"}
    else:
        user = _fake_users.get(email)
        if not user or not user.reset_token or user.reset_token != token:
            raise HTTPException(status_code=400, detail="Invalid token")
        if user.reset_expires_at and user.reset_expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Token expired")
        user.hashed_password = new_password
        user.reset_token = None
        user.reset_expires_at = None
        return {"status": "ok", "detail": "password changed"}


@router.get("/debug/user")
def debug_user(email: str):
    """Dev-only: return in-memory user state for testing (only when no DB)."""
    if USE_DB:
        raise HTTPException(status_code=404, detail="Not available")
    user = _fake_users.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "email": user.email,
        "verification_code": user.verification_code,
        "reset_token": user.reset_token,
        "reset_expires_at": user.reset_expires_at.isoformat() if user.reset_expires_at else None,
    }
