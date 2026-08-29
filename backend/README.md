# Backend - Module 1 (Authentication)

This folder contains a minimal FastAPI backend implementing Module 1: user registration and authentication endpoints.

Quick start:

1. Create a virtualenv and install requirements:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Set `DATABASE_URL` and `SECRET_KEY` environment variables, then run:

```bash
uvicorn main:app --reload --port 8000
```

The API exposes `/register`, `/token` (login), and `/users/me` endpoints.
