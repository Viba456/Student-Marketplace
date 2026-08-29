from datetime import datetime, timedelta
from typing import Optional
from .config import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

try:
    import resend
except Exception:
    resend = None

def send_email_internal(to_email: str, subject: str, html: str) -> bool:
    # Always print for local development
    print(f"\n{'='*50}\n[DEV MODE] EMAIL INTERCEPTED\nTO: {to_email}\nSUBJECT: {subject}\nBODY: {html}\n{'='*50}\n")
    
    # 1. Try SMTP if configured
    if settings.SMTP_PASSWORD:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = to_email
        msg.attach(MIMEText(html, "html"))
        
        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(settings.EMAIL_FROM, settings.SMTP_PASSWORD)
                server.sendmail(settings.EMAIL_FROM, to_email, msg.as_string())
            print("Email sent via SMTP!")
            return True
        except Exception as e:
            print(f"Failed to send email via SMTP: {e}")
            return False

    # 2. Fallback to Resend if configured
    if settings.RESEND_API_KEY and resend is not None:
        resend.api_key = settings.RESEND_API_KEY
        try:
            resend.Emails.send({
                "from": settings.EMAIL_FROM,
                "to": [to_email],
                "subject": subject,
                "html": html,
            })
            print("Email sent via Resend!")
            return True
        except Exception as e:
            print(f"Failed to send email via Resend: {e}")
            return False
            
    print("No email provider configured. Check .env file.")
    return False


def send_otp_email(to_email: str, otp: str, subject: str = "Your verification code") -> bool:
    html = f"<p>Your verification code is: <strong>{otp}</strong></p>"
    return send_email_internal(to_email, subject, html)


def generate_otp(length: int = 6) -> str:
    from random import randint
    range_start = 10 ** (length - 1)
    range_end = (10 ** length) - 1
    return str(randint(range_start, range_end))


def send_password_reset_email(to_email: str, token: str, subject: str = "Password reset for Student Marketplace") -> bool:
    reset_link = f"http://localhost:3000/reset/confirm?token={token}&email={to_email}"
    html = f"<p>Click the link to reset your password:</p><p><a href=\"{reset_link}\">Reset password</a></p><p>If you did not request this, ignore this email.</p>"
    return send_email_internal(to_email, subject, html)


def otp_expiry(minutes: int = 10) -> datetime:
    return datetime.utcnow() + timedelta(minutes=minutes)
