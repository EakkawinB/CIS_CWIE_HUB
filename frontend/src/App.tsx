import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Key, ShieldCheck, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';
import LandingPage from './components/LandingPage';
import { LanguageProvider, useLanguage } from './LanguageContext';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('student');
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const { language, t } = useLanguage();

  // Function to add toast notification
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove toast
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  
  const handleStartLogin = () => {
    setIsLoginModalOpen(true);
    setOtpSent(false);
    setOtpInput('');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setOtpSent(true);
    addToast(
      language === 'th' 
        ? `ส่งรหัส OTP ไปยัง ${emailInput} เรียบร้อยแล้ว (รหัสทดสอบ: 123456)` 
        : `OTP sent to ${emailInput} (Demo code: 123456)`, 
      'success'
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(
      language === 'th' 
        ? `ยืนยันตัวตนสำเร็จ! สิทธิ์ผู้ใช้งาน: ${selectedRole.toUpperCase()}` 
        : `Authenticated successfully as ${selectedRole.toUpperCase()}!`, 
      'success'
    );
    setIsLoginModalOpen(false);
  };

  const handleQuickSelectRole = (role: 'student' | 'advisor' | 'supervisor' | 'staff') => {
    setSelectedRole(role);
    const emails: Record<string, string> = {
      student: 'student.kasidis@university.edu',
      advisor: 'advisor.somchai@university.edu',
      supervisor: 'somsak.p@nexatech.co.th',
      staff: 'cwie.staff@university.edu'
    };
    setEmailInput(emails[role] || 'user@university.edu');
    setIsLoginModalOpen(true);
    setOtpSent(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col relative font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Main Landing View */}
      <div className="flex-1 flex flex-col w-full">
        <LandingPage 
          onStartLogin={handleStartLogin} 
          onExploreDesignSystem={() => {
            addToast(language === 'th' ? 'ระบบการออกแบบ (CIS CWIE Design System v2.0)' : 'CIS CWIE Design System Guidelines Active', 'info');
          }} 
          onQuickSelectRole={handleQuickSelectRole}
        />
      </div>

      {/* SSO Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoginModalOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Key className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {language === 'th' ? 'เข้าสู่ระบบ SSO สหกิจศึกษา' : 'SSO Portal Authentication'}
                    </h3>
                    <p className="text-[11px] text-slate-400">Department of Computer Information Systems</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Role Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'th' ? 'เลือกบทบาทผู้ใช้งาน (Select Role):' : 'Select Account Role:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'student', label: language === 'th' ? '🎓 นักศึกษา' : '🎓 Student' },
                    { id: 'advisor', label: language === 'th' ? '👨‍🏫 อาจารย์นิเทศ' : '👨‍🏫 Advisor' },
                    { id: 'supervisor', label: language === 'th' ? '🏢 พี่เลี้ยงงาน' : '🏢 Supervisor' },
                    { id: 'staff', label: language === 'th' ? '🏛️ เจ้าหน้าที่' : '🏛️ Staff Admin' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r.id);
                        const emails: Record<string, string> = {
                          student: 'student.kasidis@university.edu',
                          advisor: 'advisor.somchai@university.edu',
                          supervisor: 'somsak.p@nexatech.co.th',
                          staff: 'cwie.staff@university.edu'
                        };
                        setEmailInput(emails[r.id]);
                      }}
                      className={`p-2 text-xs font-semibold rounded-xl border text-left transition-all ${
                        selectedRole === r.id 
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs font-bold' 
                          : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'th' ? 'อีเมลมหาวิทยาลัย / องค์กร:' : 'University / Enterprise Email:'}
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="user@university.edu"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {language === 'th' ? 'ขอรหัส OTP เพื่อยืนยันตัวตน' : 'Request Verification OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      {language === 'th' 
                        ? 'รหัส OTP ถูกส่งไปที่อีเมลของคุณเรียบร้อยแล้ว (รหัสทดสอบ: 123456)' 
                        : 'Verification OTP sent to your email (Demo Code: 123456)'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'th' ? 'กรอกรหัส OTP 6 หลัก:' : 'Enter 6-Digit OTP Code:'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="123456"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg tracking-widest font-mono text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      {language === 'th' ? 'เปลี่ยนอีเมล' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4" />
                      {language === 'th' ? 'ยืนยันเข้าใช้งาน' : 'Verify & Sign In'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Toast Drawer */}
      <div className="fixed bottom-6 right-6 z-[100] pointer-events-none flex flex-col gap-2 max-w-sm w-full px-4 text-left">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="pointer-events-auto w-full bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 p-3.5 flex items-start gap-3 relative"
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <span className="text-emerald-400">●</span>}
                {toast.type === 'info' && <span className="text-blue-400">●</span>}
                {toast.type === 'warning' && <span className="text-amber-400">●</span>}
                {toast.type === 'error' && <span className="text-rose-400">●</span>}
              </div>
              
              <div className="flex-1 pr-4">
                <p className="text-xs font-medium text-slate-100">{toast.message}</p>
              </div>

              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

