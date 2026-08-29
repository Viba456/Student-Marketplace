import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.auth import router as auth_router
from app.admin import router as admin_router

app = FastAPI(title="Student Skill Marketplace - Backend (Module 1)")

# Ensure uploads directory exists
os.makedirs("uploads/media", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# Allow the frontend dev server to access the API
origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3001",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(admin_router)


@app.get("/")
def root():
    return {"status": "backend up", "module": "auth"}
