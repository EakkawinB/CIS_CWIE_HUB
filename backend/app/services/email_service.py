"""
Email service for sending OTP codes via Mailpit SMTP
"""

import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from app.config import settings


class EmailService:
    """บริการส่ง email ผ่าน SMTP (Mailpit)"""
    
    def __init__(self):
        self.smtp_host = settings.EMAIL_HOST or "localhost"
        self.smtp_port = settings.EMAIL_PORT or 1025
        self.sender_email = settings.EMAIL_ADDRESS or "otp@ciswciehub.local"
        self.sender_password = settings.EMAIL_PASSWORD or ""
    
    def _create_otp_email(self, recipient_email: str, otp: str, role: str) -> tuple[str, str]:
        """
        สร้าง email subject และ HTML body สำหรับ OTP
        
        Args:
            recipient_email: อีเมลของผู้รับ
            otp: รหัส OTP
            role: บทบาทของผู้ใช้ (student, teacher, staff)
        
        Returns:
            tuple: (subject, html_body)
        """
        role_display = {
            "student": "นักศึกษา",
            "teacher": "อาจารย์",
            "staff": "เจ้าหน้าที่"
        }.get(role, role)
        
        subject = "🔐 รหัส OTP ของคุณ - CIS CWIE Hub"
        
        html_body = f"""
        <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{
                        font-family: 'Segoe UI', Arial, sans-serif;
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
                        font-family: 'Courier New', monospace;
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
                        <h1>🔐 CIS CWIE Hub</h1>
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
                            ⚠️ <strong>คำเตือน:</strong> อย่าแชร์รหัส OTP นี้กับใคร ทีม CIS CWIE Hub จะไม่เคยขออะไรจากคุณผ่านทาง email
                        </div>
                        
                        <p>หากคุณไม่ได้ขอรหัส OTP นี้ กรุณาเพิกเฉยต่ออีเมลนี้</p>
                    </div>
                    
                    <div class="footer">
                        <p>© 2026 CIS CWIE Hub. สงวนสิทธิ์ทั้งหมด</p>
                        <p>นี่คือข้อความอัตโนมัติ กรุณาอย่าตอบกลับ</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return subject, html_body
    
    async def send_otp_email(
        self,
        recipient_email: str,
        otp: str,
        role: str
    ) -> bool:
        """
        ส่ง OTP ไปยัง email ของผู้ใช้
        
        Args:
            recipient_email: อีเมลปลายทาง
            otp: รหัส OTP
            role: บทบาทของผู้ใช้
        
        Returns:
            bool: True ถ้าส่งสำเร็จ, False ถ้าล้มเหลว
        """
        try:
            # Run SMTP operation in thread pool to avoid blocking
            return await asyncio.to_thread(
                self._send_smtp,
                recipient_email,
                otp,
                role
            )
        except Exception as e:
            print(f"❌ Error sending OTP email to {recipient_email}: {str(e)}")
            return False
    
    def _send_smtp(self, recipient_email: str, otp: str, role: str) -> bool:
        """
        ส่ง email ผ่าน SMTP (synchronous operation)
        
        Args:
            recipient_email: อีเมลปลายทาง
            otp: รหัส OTP
            role: บทบาทของผู้ใช้
        
        Returns:
            bool: True ถ้าส่งสำเร็จ
        """
        try:
            # สร้าง email
            subject, html_body = self._create_otp_email(recipient_email, otp, role)
            
            # สร้าง message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.sender_email
            message["To"] = recipient_email
            
            # เพิ่ม plain text version (fallback)
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
            
            part1 = MIMEText(text_body, "plain", "utf-8")
            part2 = MIMEText(html_body, "html", "utf-8")
            
            message.attach(part1)
            message.attach(part2)
            
            # เชื่อมต่อกับ SMTP server และส่ง
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                # Mailpit ไม่ต้องใช้ TLS
                # server.starttls()
                
                # Mailpit ไม่ต้อง authentication
                # if self.sender_password:
                #     server.login(self.sender_email, self.sender_password)
                
                server.sendmail(
                    self.sender_email,
                    recipient_email,
                    message.as_string()
                )
            
            print(f"✓ OTP email sent to {recipient_email}")
            return True
        
        except smtplib.SMTPException as e:
            print(f"❌ SMTP Error: {str(e)}")
            return False
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return False


# Singleton instance
_email_service: Optional[EmailService] = None


def get_email_service() -> EmailService:
    """Get email service singleton"""
    global _email_service
    if _email_service is None:
        _email_service = EmailService()
    return _email_service
