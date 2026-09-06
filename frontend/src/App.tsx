import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Compass, LayoutGrid, Users, Building2, FileText, Settings, 
  Sparkles, Mail, Shield, AlertCircle, X, Bell, LayoutDashboard, Globe, KeyRound 
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import StudentPortal from './components/StudentPortal';
import AdvisorPortal from './components/AdvisorPortal';
import SupervisorPortal from './components/SupervisorPortal';
import StaffPortal from './components/StaffPortal';
import DesignSystem from './components/DesignSystem';
import WorkspaceSync from './components/WorkspaceSync';
import { Role } from './types';
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
  // Current app state / active portal routing
  const [role, setRole] = useState<Role>('guest');
  
  // Toast list state
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const { language, setLanguage, t } = useLanguage();

  // Function to add a toast notification
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Welcome notification on initial boot
  useEffect(() => {
    addToast(t('welcome_message'), 'info');
  }, [language]); // Trigger on language change to show welcome in active language

  const handleLoginSuccess = (email: string, targetRole: 'student' | 'advisor' | 'mentor' | 'staff') => {
    setRole(targetRole);
    addToast(`Successfully logged in as ${email}`, 'success');
  };

  const handleLogout = () => {
    setRole('guest');
    addToast(t('logged_out'), 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col relative font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Floating Demo Deck - Lets anyone instantly inspect all requested portals and states */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl px-4 py-2.5 rounded-full z-50 flex items-center gap-1.5 max-w-[95vw] overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0 border-r border-slate-100 mr-1.5">
          {t('preview_deck')}
        </span>
        
        <button
          onClick={() => setRole('guest')}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all shrink-0 ${
            role === 'guest' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-55'
          }`}
          title="Return to the student-facing landing page"
        >
          🌐 {t('landing')}
        </button>

        <button
          onClick={() => setRole('login')}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all shrink-0 ${
            role === 'login' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-55'
          }`}
          title="Review the Email & OTP entry flows"
        >
          🔑 {t('login')}
        </button>

        <button
          onClick={() => setRole('student')}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all shrink-0 ${
            role === 'student' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title="Preview Student Matching, Diaries, & Defenses"
        >
          🎓 {t('student')}
        </button>

        <button
          onClick={() => setRole('advisor')}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all shrink-0 ${
            role === 'advisor' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
          title="Preview Advisor Supervision Visitis & Logs reviews"
        >
          👨‍🏫 {t('advisor')}
        </button>

        <button
          onClick={() => setRole('mentor')}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all shrink-0 ${
            role === 'mentor' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Preview Corporate Supervisor 70% scoring sheet"
        >
          💼 {t('supervisor')}
        </button>

        <button
          onClick={() => setRole('staff')}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all shrink-0 ${
            role === 'staff' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title="Preview Admin Statistics, Scheduler, & Pool managers"
        >
          ⚙️ {t('staff_panel')}
        </button>

        <button
          onClick={() => setRole('design-system')}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all shrink-0 ${
            role === 'design-system' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
          title="Explore the complete interactive Design System catalog"
        >
          🎨 {t('design_system')}
        </button>

        <div className="flex items-center gap-1 border-l border-slate-200 pl-3 ml-1 shrink-0">
          <button
            onClick={() => {
              setLanguage('en');
              addToast(t('switch_lang'), 'success');
            }}
            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
              language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => {
              setLanguage('th');
              addToast('เปลี่ยนภาษาเป็นภาษาไทยสำเร็จ', 'success');
            }}
            className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
              language === 'th' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            TH
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Render portal based on role routing state */}
        <div className="flex-1 flex flex-col">
          {role === 'guest' && (
            <LandingPage 
              onStartLogin={() => setRole('login')} 
              onExploreDesignSystem={() => setRole('design-system')} 
            />
          )}

          {role === 'login' && (
            <LoginPage 
              onLoginSuccess={handleLoginSuccess} 
              onNotify={addToast} 
            />
          )}

          {role === 'student' && (
            <StudentPortal 
              onNotify={addToast} 
              onLogout={handleLogout} 
            />
          )}

          {role === 'advisor' && (
            <AdvisorPortal 
              onNotify={addToast} 
              onLogout={handleLogout} 
            />
          )}

          {role === 'mentor' && (
            <SupervisorPortal 
              onNotify={addToast} 
              onLogout={handleLogout} 
            />
          )}

          {role === 'staff' && (
            <StaffPortal 
              onNotify={addToast} 
              onLogout={handleLogout} 
            />
          )}

          {role === 'design-system' && (
            <div className="p-8 max-w-6xl mx-auto space-y-8 flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 text-left">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 font-sans">CIS CWIE Design System</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Central guide catalog of elements and components designed for the Cooperative Management platform.
                  </p>
                </div>
                
                {/* Embedded Workspace Sync button for easy access */}
                <div className="flex items-center gap-3 shrink-0 mr-14">
                  <a 
                    href="#workspace-section-nav"
                    onClick={(e) => {
                      e.preventDefault();
                      setRole('design-system');
                      addToast('Navigated to Workspace integration segment', 'info');
                    }}
                    className="px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    {t('view_workspace_feeds')}
                  </a>
                  <button 
                    onClick={() => setRole('guest')}
                    className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl"
                  >
                    {t('back_to_landing')}
                  </button>
                </div>
              </div>

              {/* Design System Elements */}
              <DesignSystem onNotify={addToast} />

              {/* Interactive Workspace Integration Section */}
              <div id="workspace-section-nav" className="pt-8 border-t border-slate-200 text-left">
                <div className="mb-6">
                  <h2 className="text-base font-bold text-slate-950 font-sans">{t('workspace_connectors')}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Synchronized Google Calendar appointments, Gmail advisories, and Google Drive templates.
                  </p>
                </div>
                <WorkspaceSync onNotify={addToast} />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Universal Toasts Drawer */}
      <div className="fixed bottom-24 right-4 z-[100] pointer-events-none flex flex-col gap-2 max-w-sm w-full px-4 text-left">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className="pointer-events-auto w-full bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 p-4 flex items-start gap-3 relative"
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
