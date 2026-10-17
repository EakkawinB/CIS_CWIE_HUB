
import smtplib
from email.message import EmailMessage
from html import escape

import resend

from app.core.config import settings


def send_otp_email(email: str, otp: str):
    provider = settings.EMAIL_PROVIDER.lower()

    if provider == "mailpit":
        # ส่ง OTP ไปยัง Mailpit บนเครื่อง Development
        message = EmailMessage()
        message["From"] = "otp@cis-cwie.local"
        message["To"] = email
        message["Subject"] = "CIS CWIE HUB - OTP Verification"

        message.set_content(
            f"Your OTP code is: {otp}\n"
            "This code will expire in 10 minutes."
        )

        message.add_alternative(
            f"""
            <html>
              <body>
                <h2>CIS CWIE Hub</h2>
                <p>Your OTP code is:</p>
                <h1>{escape(otp)}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>Please do not share this code with anyone.</p>
              </body>
            </html>
            """,
            subtype="html",
        )

        with smtplib.SMTP(
            settings.SMTP_HOST,
            settings.SMTP_PORT,
            timeout=10,
        ) as smtp:
            smtp.send_message(message)

        return {"provider": "mailpit", "status": "sent"}

    if provider == "resend":
        resend.api_key = settings.RESEND_API_KEY

        return resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": email,
            "subject": "CIS CWIE HUB - OTP Verification",
            "html": f"""
            <html>
              <body>
                <h2>CIS CWIE Hub</h2>
                <p>Your OTP code is:</p>
                <h1>{escape(otp)}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>Please do not share this code with anyone.</p>
              </body>
            </html>
            """,
        })

    raise ValueError(
        f"Unsupported EMAIL_PROVIDER: {provider}"
    )
