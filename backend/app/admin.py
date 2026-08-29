from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import schemas, models, crud
from .database import get_db
from .auth import get_current_user, USE_DB, _fake_users

router = APIRouter(prefix="/admin", tags=["admin"])

def require_admin(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if USE_DB:
        user = crud.get_user_by_email(db, current_user.email)
        if not user or not user.is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        return user
    else:
        email = current_user.get("email")
        user = _fake_users.get(email)
        if not user or not user.is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        return user


@router.get("/stats", response_model=schemas.AdminStatsOut)
def get_stats(admin_user = Depends(require_admin), db: Session = Depends(get_db)):
    if USE_DB:
        total_users = db.query(models.User).count()
        total_listings = db.query(models.ServiceListing).count()
        total_requests = db.query(models.ServiceRequest).count()
        total_disputes = db.query(models.Dispute).count()
        return {
            "total_users": total_users,
            "total_listings": total_listings,
            "total_requests": total_requests,
            "total_disputes": total_disputes
        }
    else:
        # Mock logic
        users = len(_fake_users)
        listings = sum(len(u.listings) for u in _fake_users.values())
        requests = sum(len(u.incoming_requests) for u in _fake_users.values())
        
        # count disputes by finding requests with has_dispute
        disputes = 0
        for u in _fake_users.values():
            for r in u.incoming_requests:
                if r.get("has_dispute"):
                    disputes += 1
                    
        return {
            "total_users": users,
            "total_listings": listings,
            "total_requests": requests,
            "total_disputes": disputes
        }


@router.get("/users")
def get_all_users(admin_user = Depends(require_admin), db: Session = Depends(get_db)):
    if USE_DB:
        users = db.query(models.User).all()
        return [
            {
                "id": u.id,
                "email": u.email,
                "full_name": u.full_name,
                "is_admin": u.is_admin,
                "created_at": u.created_at
            } for u in users
        ]
    else:
        return [
            {
                "id": u.id,
                "email": u.email,
                "full_name": u.full_name,
                "is_admin": getattr(u, 'is_admin', False),
                "created_at": "Just now"
            } for u in _fake_users.values()
        ]


@router.delete("/users/{user_id}")
def delete_user(user_id: int, admin_user = Depends(require_admin), db: Session = Depends(get_db)):
    if USE_DB:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        db.delete(user)
        db.commit()
        return {"status": "ok"}
    else:
        # Find email for this ID
        target_email = None
        for email, u in _fake_users.items():
            if u.id == user_id:
                target_email = email
                break
        if target_email:
            del _fake_users[target_email]
        return {"status": "ok"}


@router.get("/listings")
def get_all_listings(admin_user = Depends(require_admin), db: Session = Depends(get_db)):
    if USE_DB:
        listings = db.query(models.ServiceListing).all()
        return [
            {
                "id": l.id,
                "title": l.title,
                "seller_name": l.user.full_name,
                "is_active": l.is_active,
                "created_at": l.created_at
            } for l in listings
        ]
    else:
        out = []
        for u in _fake_users.values():
            for l in u.listings:
                out.append({
                    "id": l["id"],
                    "title": l["title"],
                    "seller_name": u.full_name,
                    "is_active": l["is_active"],
                    "created_at": "Just now"
                })
        return out


@router.delete("/listings/{listing_id}")
def delete_listing(listing_id: int, admin_user = Depends(require_admin), db: Session = Depends(get_db)):
    if USE_DB:
        listing = db.query(models.ServiceListing).filter(models.ServiceListing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        db.delete(listing)
        db.commit()
        return {"status": "ok"}
    else:
        for u in _fake_users.values():
            u.listings = [l for l in u.listings if l["id"] != listing_id]
        return {"status": "ok"}


@router.get("/disputes")
def get_all_disputes(admin_user = Depends(require_admin), db: Session = Depends(get_db)):
    if USE_DB:
        disputes = db.query(models.Dispute).filter(models.Dispute.status == "open").all()
        out = []
        for d in disputes:
            out.append({
                "id": d.id,
                "request_id": d.request_id,
                "reporter_name": d.reporter.full_name,
                "reason": d.reason,
                "status": d.status,
                "created_at": d.created_at,
                "request": {
                    "id": d.request.id,
                    "listing_title": d.request.listing.title,
                    "seller_name": d.request.seller.full_name,
                    "requester_name": d.request.requester.full_name,
                    "status": d.request.status
                }
            })
        return out
    else:
        out = []
        for u in _fake_users.values():
            for req in u.incoming_requests:
                if req.get("has_dispute") and req.get("status") == "disputed":
                    out.append({
                        "id": 999,
                        "request_id": req["id"],
                        "reporter_name": "User",
                        "reason": "Mock reason",
                        "status": "open",
                        "created_at": "Just now",
                        "request": {
                            "id": req["id"],
                            "listing_title": req["listing"]["title"],
                            "seller_name": "Seller",
                            "requester_name": "Buyer",
                            "status": req["status"]
                        }
                    })
        return out


@router.put("/disputes/{dispute_id}/resolve")
def resolve_dispute(
    dispute_id: int, 
    resolution: dict,  # e.g., {"outcome": "cancelled" | "completed"}
    admin_user = Depends(require_admin), 
    db: Session = Depends(get_db)
):
    outcome = resolution.get("outcome")
    if outcome not in ["cancelled", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid outcome")
        
    if USE_DB:
        dispute = db.query(models.Dispute).filter(models.Dispute.id == dispute_id).first()
        if not dispute:
            raise HTTPException(status_code=404, detail="Dispute not found")
            
        dispute.status = "resolved"
        
        # update request
        req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == dispute.request_id).first()
        if req:
            req.status = outcome
            
        db.commit()
        return {"status": "ok"}
    else:
        # Mock logic
        # For simplicity, resolve all disputes with this ID
        for u in _fake_users.values():
            for req in u.incoming_requests + u.outgoing_requests:
                if req.get("has_dispute"):
                    req["status"] = outcome
                    req["has_dispute"] = False
        return {"status": "ok"}
