import resend

from app.core.config import settings


resend.api_key = settings.RESEND_API_KEY


def send_otp_email(email: str, otp: str):
    response = resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to" : email,
        "subject": "CIS CWIE HUB - OTP Verification",
        "html": f"""
        <html>
        <body>
            <h2>CIS CWIE Hub</h2>

            <p>Your OTP code is:</p>

            <h1>{otp}</h1>

            <p>This code will expire in 10 minutes.</p>

            <p>Please do not share this code with anyone.</p>
        </body>
        </html>
        """,
    })

    return response