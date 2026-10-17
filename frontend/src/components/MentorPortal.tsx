import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Clock, Award, User, Bell, LogOut, Menu, X 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  MOCK_STUDENTS, MOCK_TIMESHEETS,
  Student, Timesheet 
} from '../types';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';

// Sub-components
import MentorDashboard from '../pages/mentor/MentorDashboard';
import MentorStudents from '../pages/mentor/MentorStudents';
import MentorTimesheetReview from '../pages/mentor/MentorTimesheetReview';
import MentorEvaluation from '../pages/mentor/MentorEvaluation';
import MentorProfile from '../pages/mentor/MentorProfile';

interface MentorPortalProps {
  onNotify: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onLogout: () => void;
}

export default function MentorPortal({ onNotify, onLogout }: MentorPortalProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  // 5 Confirmed NAV items
  type MentorTab = 'dashboard' | 'students' | 'timesheets-review' | 'evaluation' | 'profile';
  const [activeTab, setActiveTab] = useState<MentorTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State
  const [students] = useState<Student[]>(MOCK_STUDENTS);
  const [timesheets, setTimesheets] = useState<Timesheet[]>(MOCK_TIMESHEETS);

  const navItems: { id: MentorTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'students', label: t('students'), icon: Users },
    { id: 'timesheets-review', label: t('timesheets_report_review'), icon: Clock },
    { id: 'evaluation', label: t('evaluation'), icon: Award },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  const handleSignTimesheet = (timesheetId: string, mentorName: string) => {
    setTimesheets(timesheets.map(t => 
      t.id === timesheetId ? { ...t, status: 'Approved', approvedBy: mentorName } : t
    ));
    onNotify(isThai ? 'ลงนามอนุมัติใบลงเวลาการทำงานเรียบร้อยแล้ว' : 'Timesheet signed and approved successfully.', 'success');
  };

  const handleRejectTimesheet = (timesheetId: string) => {
    setTimesheets(timesheets.map(t => 
      t.id === timesheetId ? { ...t, status: 'Rejected' } : t
    ));
    onNotify(isThai ? 'ส่งคืนใบลงเวลาเพื่อให้นักศึกษาแก้ไขชั่วโมง' : 'Returned timesheet for hours revision.', 'info');
  };

  const handleSaveEvaluation = (evaluation: {
    studentId: string;
    phase: 'midterm' | 'final';
    professionalism: number;
    technicalDelivery: number;
    collaboration: number;
    projectQuality: number;
    comments: string;
  }) => {
    const total = evaluation.professionalism + evaluation.technicalDelivery + evaluation.collaboration + evaluation.projectQuality;
    onNotify(
      isThai 
        ? `บันทึกผลการประเมิน${evaluation.phase === 'midterm' ? 'กลางภาค' : 'สิ้นสุดการฝึก'} (${total}/100 คะแนน) เรียบร้อยแล้ว` 
        : `Saved ${evaluation.phase.toUpperCase()} evaluation (${total}/100 pts)!`,
      'success'
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50/40 text-slate-800" id="mentor-portal-root">
      
      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[100] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-64 bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <CISLogo size="md" />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSel = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-[#6B122C] text-white shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-50 bg-slate-50/50 m-4 rounded-xl">
              <div className="text-left mb-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
                  {t('mentor_role')}
                </span>
                <span className="text-xs font-bold text-slate-800 block truncate">คุณสมศักดิ์ พิพัฒน์พัฒนา</span>
                <span className="text-[10px] text-slate-400 block truncate">NexaTech Solutions Co., Ltd.</span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-1.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col shrink-0 h-screen sticky top-0">
        <div className="p-5 border-b border-slate-50 bg-slate-50/20">
          <CISLogo size="lg" />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSel = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isSel 
                    ? 'bg-[#6B122C] text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-50 bg-slate-50/50 m-4 rounded-xl">
          <div className="text-left mb-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              {t('mentor_role')}
            </span>
            <span className="text-xs font-bold text-slate-800 block truncate">คุณสมศักดิ์ พิพัฒน์พัฒนา</span>
            <span className="text-[10px] text-slate-400 block truncate">NexaTech Solutions Co., Ltd.</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-1.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-50 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-left">
              <h1 className="text-sm font-bold text-slate-900 capitalize font-sans leading-tight">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono leading-none sm:leading-normal">
                {t('academic_year')} • {isThai ? 'พี่เลี้ยงสถานประกอบการ' : 'Enterprise Mentor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher onNotify={onNotify} />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isThai ? 'พี่เลี้ยงได้รับการรับรอง' : 'Certified Mentor'}
            </div>
            <button 
              onClick={() => onNotify(isThai ? 'ไม่มีการแจ้งเตือนใหม่ในขณะนี้' : 'No new notifications.', 'info')}
              className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg relative cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#6B122C]" />
            </button>
          </div>
        </header>

        {/* Content View Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === 'dashboard' && (
            <MentorDashboard
              students={students}
              timesheets={timesheets}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'students' && (
            <MentorStudents students={students} />
          )}

          {activeTab === 'timesheets-review' && (
            <MentorTimesheetReview
              timesheets={timesheets}
              onSignTimesheet={handleSignTimesheet}
              onRejectTimesheet={handleRejectTimesheet}
            />
          )}

          {activeTab === 'evaluation' && (
            <MentorEvaluation
              students={students}
              onSaveEvaluation={handleSaveEvaluation}
            />
          )}

          {activeTab === 'profile' && (
            <MentorProfile onNotify={onNotify} />
          )}
        </div>
      </main>

    </div>
  );
}
