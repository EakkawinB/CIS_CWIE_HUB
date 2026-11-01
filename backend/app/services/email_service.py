"""
Email service for sending OTP codes via the Resend API.
"""

import logging
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """บริการส่ง email ผ่าน Resend API"""
   
    def __init__(self):
        self.api_key = settings.RESEND_API_KEY
        self.sender_email = settings.RESEND_FROM_EMAIL

    def _create_otp_email(self, recipient_email: str, otp: str, role: str) -> tuple[str, str, str]:
        """
        สร้าง email subject, HTML body และ plain text body สำหรับ OTP
        
        Args:
            recipient_email: อีเมลของผู้รับ
            otp: รหัส OTP
            role: บทบาทของผู้ใช้ (student, teacher, staff)
        
        Returns:
            tuple: (subject, html_body, text_body)
        """
        role_display = {
            "student": "นักศึกษา",
            "teacher": "อาจารย์",
            "staff": "เจ้าหน้าที่",
        }.get(role, role)
        
        subject = "🔐 รหัส OTP ของคุณ - CIS CWIE Hub"
        
        html_body = f"""
        <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{
                        font-family: ''Segoe UI'', Arial, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 20px;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: white;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }}
                    .header {{
                        text-align: center;
                        border-bottom: 2px solid #007bff;
                        padding-bottom: 20px;
                        margin-bottom: 20px;
                    }}
                    .header h1 {{
                        color: #007bff;
                        margin: 0;
                        font-size: 24px;
                    }}
                    .content {{
                        text-align: right;
                        line-height: 1.6;
                        color: #333;
                    }}
                    .content p {{
                        margin: 10px 0;
                    }}
                    .otp-box {{
                        background-color: #f8f9fa;
                        border: 2px solid #007bff;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                        text-align: center;
                    }}
                    .otp-code {{
                        font-size: 36px;
                        font-weight: bold;
                        color: #007bff;
                        letter-spacing: 4px;
                        font-family: ''Courier New'', monospace;
                    }}
                    .otp-label {{
                        font-size: 12px;
                        color: #666;
                        margin-top: 10px;
                    }}
                    .warning {{
                        background-color: #fff3cd;
                        border: 1px solid #ffc107;
                        border-radius: 4px;
                        padding: 12px;
                        margin: 20px 0;
                        text-align: right;
                        font-size: 12px;
                        color: #856404;
                    }}
                    .footer {{
                        text-align: center;
                        border-top: 1px solid #e0e0e0;
                        margin-top: 20px;
                        padding-top: 20px;
                        font-size: 12px;
                        color: #999;
                    }}
                    .role-badge {{
                        display: inline-block;
                        background-color: #e7f3ff;
                        color: #0066cc;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        margin-top: 10px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📧 CIS CWIE Hub</h1>
                    </div>

                    <div class="content">
                        <p>สวัสดี,</p>

                        <p>คุณได้ขอรหัส OTP สำหรับการเข้าสู่ระบบ CIS CWIE Hub</p>

                        <div class="otp-box">
                            <div class="otp-code">{otp}</div>
                            <div class="otp-label">รหัส OTP จะหมดอายุภายใน 5 นาที</div>
                        </div>

                        <p>
                            บัญชี: <strong>{recipient_email}</strong>
                            <div class="role-badge">{role_display}</div>
                        </p>

                        <div class="warning">
                            ⚠️ <strong>คำเตือน:</strong> อย่าแชร์รหัส OTP นี้กับใคร
                        </div>

                        <p>หากคุณไม่ได้ขอรหัส OTP นี้ กรุณาเพิกเฉยต่ออีเมลนี้</p>
                    </div>

                    <div class="footer">
                        <p>© 2026 CIS CWIE Hub. สงวนสิทธิ์ทั้งหมด</p>
                        <p>อีเมลนี้ถูกส่งโดยอัตโนมัติจากระบบ CIS CWIE Hub</p>
                    </div>
                </div>
            </body>
        </html>
        """

        text_body = f"""
สวัสดี,

คุณได้ขอรหัส OTP สำหรับการเข้าสู่ระบบ CIS CWIE Hub

รหัส OTP ของคุณ: {otp}

รหัส OTP จะหมดอายุภายใน 5 นาที

บัญชี: {recipient_email}
บทบาท: {role}

⚠️ คำเตือน: อย่าแชร์รหัส OTP นี้กับใคร

หากคุณไม่ได้ขอรหัส OTP นี้ กรุณาเพิกเฉยต่ออีเมลนี้

© 2026 CIS CWIE Hub. สงวนสิทธิ์ทั้งหมด
"""

        return subject, html_body, text_body

    async def send_otp_email(
        self,
        recipient_email: str,
        otp: str,
        role: str
    ) -> bool:
        """
        ส่ง OTP ไปยัง email ของผู้ใช้ผ่าน Resend API
        
        Args:
            recipient_email: อีเมลปลายทาง
            otp: รหัส OTP
            role: บทบาทของผู้ใช้
        
        Returns:
            bool: True ถ้า Resend ยอมรับคำขอส่ง, False ถ้าล้มเหลว
        """
        # Never send without a configured API key and sender address
        if not self.api_key:
            logger.error("Resend is not configured: RESEND_API_KEY is missing")
            return False
        if not self.sender_email:
            logger.error("Resend is not configured: RESEND_FROM_EMAIL is missing")
            return False

        try:
            # Lazy import so the app can start even before the resend package is installed
            import resend  # type: ignore

            resend.api_key = self.api_key
            subject, html_body, text_body = self._create_otp_email(recipient_email, otp, role)

            response = resend.Emails.send({
                "from": self.sender_email,
                "to": [recipient_email],
                "subject": subject,
                "html": html_body,
                "text": text_body,
            })

            # Resend accepts the request when it returns an id (object attribute or dict key)
            accepted = bool(getattr(response, "id", None)) or (
                isinstance(response, dict) and bool(response.get("id"))
            )
            if not accepted:
                logger.error("Resend did not accept OTP email to %s: %s", recipient_email, response)
                return False

            logger.info("✓ OTP email accepted by Resend to %s", recipient_email)
            return True
        except Exception as e:
            # Do not log the OTP or the API key; only a safe error summary
            logger.error("❌ Error sending OTP email to %s via Resend: %s", recipient_email, e)
            return False


# Singleton instance
_email_service: Optional[EmailService] = None


def get_email_service() -> EmailService:
    """Get email service singleton"""
    global _email_service
    if _email_service is None:
        _email_service = EmailService()
    return _email_service