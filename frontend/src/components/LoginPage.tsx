import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, Key, RefreshCw, AlertTriangle, HelpCircle, Lock, GraduationCap, Clock } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';
import api from '../services/api';
import axios from 'axios';

interface LoginPageProps {
  onLoginSuccess: (email: string, targetRole: 'student' | 'advisor' | 'mentor' | 'staff') => void;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function LoginPage({ onLoginSuccess, onNotify }: LoginPageProps) {
  const { t, language } = useLanguage();
  
  // Screen sub-states: 'email' | 'otp' | 'loading' | 'expired' | 'unauthorized'
  const [subState, setSubState] = useState<'email' | 'otp' | 'loading' | 'expired' | 'unauthorized'>('email');
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(59);
  const [roleSelection, setRoleSelection] = useState<'student' | 'advisor' | 'mentor' | 'staff'>('student');

  // Trigger countdown timer when on OTP screen
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (subState === 'otp' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [subState, countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      if (onNotify) {
        onNotify(
          language === 'th' ? 'กรุณากรอกอีเมลมหาวิทยาลัยของคุณ' : 'Please enter your university email.', 
          'warning'
        );
      }
      return;
    }
    if (!email.includes('@')) {
      if (onNotify) {
        onNotify(
          language === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Please enter a valid email address.', 
          'error'
        );
      }
      return;
    }
    
    // Simulate loading transition
    setSubState('loading');

    setSubState('loading');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/auth/request-otp',
        {
          email: email
        }
      );
 
      console.log('Send OTP success:', response.data);

      setSubState('otp');
      setCountdown(59);

      onNotify?.(
        `${t('otp_sent_to')} ${email}`,
        'success'
      );

    } catch (error) {

      console.error('Send OTP error:', error);

      setSubState('email');

      if (onNotify) {
        onNotify(
          language === 'th'
            ? 'ไม่สามารถส่งรหัส OTP ได้ กรุณาลองใหม่อีกครั้ง'
            : 'Unable to send OTP. Please try again.',
          'error'
        );
      }
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto focus next input
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && e.currentTarget.previousSibling) {
        (e.currentTarget.previousSibling as HTMLInputElement).focus();
        newOtp[index - 1] = '';
      } else {
        newOtp[index] = '';
      }
      setOtp(newOtp);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const joined = otp.join('');

    if (joined.length < 6) {
      onNotify?.(
        language === 'th'
          ? 'กรุณากรอกรหัส OTP ให้ครบ 6 หลัก'
          : 'Please fill in all 6 OTP digits.',
        'warning'
      );
      return;
    }

    try {
      setSubState('loading');

      const response = await axios.post(
        'http://127.0.0.1:8000/auth/verify-otp',
        {
          email: email,
          otp: joined
        }
      );

      console.log('Verify OTP:', response.data);

      onNotify?.(
        language === 'th'
          ? 'เข้าสู่ระบบสำเร็จ'
          : 'Login successful',
        'success'
      );

      onLoginSuccess(
        email,
        response.data.role
      );

    } catch (error) {
      console.error('Verify OTP error:', error);

      setSubState('otp');

      onNotify?.(
        language === 'th'
          ? 'OTP ไม่ถูกต้องหรือหมดอายุแล้ว'
          : 'Invalid or expired OTP.',
        'error'
      );
    }
  };
  const handleResendOtp = () => {
    setCountdown(59);
    setOtp(['', '', '', '', '', '']);
    if (onNotify) {
      onNotify(
        language === 'th' ? 'ส่งรหัสยืนยันตัวตน OTP รหัสใหม่แล้ว' : 'A fresh 6-digit security code has been sent.', 
        'success'
      );
    }
  };

  const triggerExpiredScreen = () => {
    setSubState('expired');
    if (onNotify) {
      onNotify(
        language === 'th' ? 'เซสชันหมดอายุเนื่องจากไม่มีกิจกรรมใดๆ' : 'Session expired due to inactivity.', 
        'warning'
      );
    }
  };

  const triggerUnauthorizedScreen = () => {
    setSubState('unauthorized');
    if (onNotify) {
      onNotify(
        language === 'th' ? 'ไม่ได้รับการตรวจสอบสิทธิ์ การเข้าถึงล้มเหลว' : 'Access cleared role check failed.', 
        'error'
      );
    }
  };

  const handleQuickAutofill = (selectedEmail: string, selectedRole: 'student' | 'advisor' | 'mentor' | 'staff') => {
    setEmail(selectedEmail);
    setRoleSelection(selectedRole);
    if (onNotify) {
      onNotify(
        language === 'th' 
          ? `ป้อนข้อมูลบัญชี ${selectedEmail} อัตโนมัติเรียบร้อย` 
          : `Autofilled credentials for ${selectedEmail}`, 
        'info'
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50/50 relative" id="login-root">
      
      {/* Top right language switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-10">
        <LanguageSwitcher onNotify={onNotify} />
      </div>

      {/* 1. EMAIL FORM */}
      {subState === 'email' && (
        <div className="bg-white border border-slate-100 p-5 sm:p-8 rounded-2xl shadow-lg max-w-md w-full text-left space-y-6">
          <div className="text-center space-y-3 flex flex-col items-center">
            <CISLogo size="xl" showText={false} />
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-sans">{t('portal_title')}</h2>
              <p className="text-xs text-slate-400 mt-1">
                {t('sign_in_desc')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t('email_address')}</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs text-slate-800 outline-none transition-colors"
                />
                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                {language === 'th' 
                  ? 'รองรับอีเมลมหาวิทยาลัยหรือโดเมนที่กำหนดเท่านั้น เช่น student@university.edu' 
                  : 'Authorized university email only. Example: student.name@university.edu or staff@university.edu.'}
              </p>
            </div>

            {/* Quick Demo Selector for Testing Roles */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
              <label className="block text-[11px] font-semibold text-blue-800">
                {language === 'th' ? 'จำลองบทบาทการเข้าสู่ระบบ' : 'Simulated Portal Access Role'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'student', label: t('student_role'), email: 'kasidis.p@university.edu' },
                  { key: 'advisor', label: t('advisor_role'), email: 'advisor.somchai@university.edu' },
                  { key: 'supervisor', label: t('supervisor_role'), email: 'somsak.p@nexatech.co.th' },
                  { key: 'staff', label: t('staff_role'), email: 'cwie.center@university.edu' }
                ].map((role) => (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => handleQuickAutofill(role.email, role.key as any)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold border transition-all text-center ${
                      roleSelection === role.key 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer text-center"
            >
              {t('send_otp')}
            </button>
          </form>

          {/* Diagnostic utilities to show other required screen designs */}
          <div className="border-t border-slate-100 pt-4 mt-2 flex flex-col gap-2">
            <span className="text-[9px] font-mono text-slate-400 text-center uppercase tracking-wider block">
              {language === 'th' ? 'ภาพตัวอย่างหน้าจออื่นๆ (สำหรับตรวจสอบ)' : 'Screen Prototypes Viewports (For Inspection)'}
            </span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <button 
                onClick={triggerExpiredScreen}
                className="text-[10px] text-amber-600 hover:underline flex items-center justify-center gap-1 border border-amber-100 bg-amber-50/20 py-1 rounded-lg cursor-pointer"
              >
                <Clock className="h-3 w-3" /> {language === 'th' ? 'เซสชันหมดอายุ' : 'Session Expired'}
              </button>
              <button 
                onClick={triggerUnauthorizedScreen}
                className="text-[10px] text-rose-600 hover:underline flex items-center justify-center gap-1 border border-rose-100 bg-rose-50/20 py-1 rounded-lg cursor-pointer"
              >
                <Lock className="h-3 w-3" /> {language === 'th' ? 'ไม่ได้รับอนุญาต' : 'Unauthorized'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. OTP VERIFICATION FORM */}
      {subState === 'otp' && (
        <div className="bg-white border border-slate-100 p-5 sm:p-8 rounded-2xl shadow-lg max-w-md w-full text-left space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 bg-blue-50 text-blue-600 rounded-xl items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-sans">
              {language === 'th' ? 'การยืนยันรหัสสองขั้นตอน (OTP)' : 'Two-Factor OTP Check'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'th' 
                ? `ระบบส่งรหัส 6 หลักไปยังอีเมลเรียบร้อยแล้ว: ` 
                : 'Dispatched 6-digit code to '} 
              <span className="font-semibold text-slate-700 break-all">{email}</span>. 
              {language === 'th' ? ' มีอายุการใช้งาน 10 นาที' : ' Valid for 10 minutes.'}
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-center gap-1.5 sm:gap-2.5 max-w-full">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className="flex-1 min-w-0 h-10 sm:h-12 max-w-[44px] bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg sm:rounded-xl text-center font-bold text-slate-800 text-base sm:text-lg outline-none transition-all"
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] sm:text-xs text-slate-400 gap-2 mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                  {language === 'th' ? 'รหัสจะหมดอายุใน: ' : 'Code expires in: '} 
                  <span className="font-mono font-semibold text-slate-600">0:{countdown < 10 ? `0${countdown}` : countdown}</span>
                </span>
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleResendOtp}
                  className={`font-semibold hover:underline cursor-pointer text-left ${countdown > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600'}`}
                >
                  {language === 'th' ? 'ส่งรหัสใหม่อีกครั้ง' : 'Resend OTP Code'}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSubState('email')}
                className="flex-1 py-2 sm:py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-center"
              >
                {language === 'th' ? 'ย้อนกลับ' : 'Back to Email'}
              </button>
              <button
                type="submit"
                className="flex-1 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                {t('verify_signin')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. LOADING SPLASH SCREEN */}
      {subState === 'loading' && (
        <div className="bg-white border border-slate-100 p-12 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-4">
          <div className="flex justify-center">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            {language === 'th' ? 'กำลังตรวจสอบคีย์ความปลอดภัย...' : 'Validating Security Tokens'}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'th' 
              ? 'กำลังเชื่อมข้อมูลและสร้างพารามิเตอร์ตรวจสอบสิทธิ์ระบบงานสถาบัน...' 
              : 'Checking academic clearance directories and establishing dual-assessor session parameters...'}
          </p>
        </div>
      )}

      {/* 4. SESSION EXPIRED SCREEN */}
      {subState === 'expired' && (
        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">
          <div className="inline-flex h-12 w-12 bg-amber-50 text-amber-600 rounded-xl items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 font-sans font-semibold">
              {language === 'th' ? 'เซสชันการเชื่อมต่อหมดอายุ' : 'Session Invalidation Alert'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'th' 
                ? 'ระบบความปลอดภัยระงับการเชื่อมต่อเนื่องจากขาดกิจกรรมเกิน 15 นาที เพื่อป้องกันข้อมูลวิชาการของคุณ' 
                : 'Your security token has expired due to 15 minutes of inactivity. For your protection, university records have been locked.'}
            </p>
          </div>
          <button
            onClick={() => setSubState('email')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {language === 'th' ? 'รับรหัส OTP ชุดใหม่' : 'Re-initiate Verification Code'}
          </button>
        </div>
      )}

      {/* 5. UNAUTHORIZED ACCESS PAGE */}
      {subState === 'unauthorized' && (
        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">
          <div className="inline-flex h-12 w-12 bg-rose-50 text-rose-600 rounded-xl items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 font-sans font-semibold">
              {language === 'th' ? 'ปฏิเสธการเข้าถึงห้องข้อมูล' : 'Access Clearance Rejected'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'th' 
                ? 'คุณไม่มีระดับสิทธิ์การเข้าถึงสารสนเทศระบบงานนี้ กรุณาเลือกสถานะบทบาทการเชื่อมต่อวิชาการให้เหมาะสม' 
                : 'You do not have the required role clearance to view this directory. Ensure you have selected the appropriate role parameters and verified using your official university credentials.'}
            </p>
          </div>
          <button
            onClick={() => setSubState('email')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {language === 'th' ? 'กลับสู่ศูนย์ยืนยันตัวตน' : 'Return to Verification Center'}
          </button>
        </div>
      )}

    </div>
  );
}
