import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, FileText, BookOpen, Calendar, Award, 
  User, Bell, LogOut, Menu, X 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  MOCK_STUDENTS, MOCK_DOCUMENTS, MOCK_REPORTS, MOCK_BOOKINGS,
  Student, Document, WeeklyReport 
} from '../types';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';

// Advisor sub-components
import AdvisorDashboard from '../pages/advisor/AdvisorDashboard';
import AdvisorStudents from '../pages/advisor/AdvisorStudents';
import AdvisorDocuments from '../pages/advisor/AdvisorDocuments';
import AdvisorDiaryReview from '../pages/advisor/AdvisorDiaryReview';
import AdvisorCoopVisit from '../pages/advisor/AdvisorCoopVisit';
import AdvisorExamination from '../pages/advisor/AdvisorExamination';
import AdvisorProfile from '../pages/advisor/AdvisorProfile';

interface AdvisorPortalProps {
  onNotify: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onLogout: () => void;
}

export default function AdvisorPortal({ onNotify, onLogout }: AdvisorPortalProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  // 7 Confirmed NAV items
  type AdvisorTab = 'dashboard' | 'students' | 'documents' | 'diary-review' | 'coop-visit' | 'examination' | 'profile';
  const [activeTab, setActiveTab] = useState<AdvisorTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State
  const [students] = useState<Student[]>(MOCK_STUDENTS);
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS);
  const [reports, setReports] = useState<WeeklyReport[]>(MOCK_REPORTS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const navItems: { id: AdvisorTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'students', label: t('students'), icon: Users },
    { id: 'documents', label: t('documents'), icon: FileText },
    { id: 'diary-review', label: t('diary_report_review'), icon: BookOpen },
    { id: 'coop-visit', label: t('coop_visit'), icon: Calendar },
    { id: 'examination', label: t('examination'), icon: Award },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  const handleApproveReport = (reportId: string, comment: string) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: 'Approved', advisorComment: comment } : r));
    onNotify(isThai ? 'อนุมัติบันทึกประจำสัปดาห์เรียบร้อยแล้ว' : 'Approved weekly diary submission.', 'success');
  };

  const handleRejectReport = (reportId: string, comment: string) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: 'Requires Edit', advisorComment: comment } : r));
    onNotify(isThai ? 'ส่งข้อความแจ้งเตือนให้นักศึกษาแก้ไขบันทึกเรียบร้อย' : 'Requested diary revision with feedback.', 'warning');
  };

  const handleBookVisit = (newB: { studentId: string; date: string; time: string; round: number }) => {
    const student = students.find(s => s.id === newB.studentId);
    const item = {
      id: bookings.length + 1,
      studentName: student?.name || 'Student',
      company: 'NexaTech Solutions Co., Ltd.',
      date: newB.date,
      time: newB.time,
      round: newB.round,
      status: 'Confirmed'
    };
    setBookings([...bookings, item]);
    onNotify(
      isThai 
        ? `ยืนยันการนัดหมายนิเทศงานรอบที่ ${newB.round} วันที่ ${newB.date} เรียบร้อยแล้ว` 
        : `Confirmed Co-op Visit Round ${newB.round} on ${newB.date}!`, 
      'success'
    );
  };

  const handleSaveEvaluation = (evaluation: {
    studentId: string;
    presentationScore: number;
    reportScore: number;
    overallCompetence: number;
    comments: string;
  }) => {
    const total = evaluation.presentationScore + evaluation.reportScore + evaluation.overallCompetence;
    onNotify(
      isThai 
        ? `บันทึกคะแนนสอบ ${total}/100 คะแนนและ Feedback เรียบร้อยแล้ว` 
        : `Saved examination evaluation (${total}/100 pts) and remarks!`,
      'success'
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50/40 text-slate-800" id="advisor-portal-root">
      
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
                  {t('advisor_role')}
                </span>
                <span className="text-xs font-bold text-slate-800 block truncate">ผศ.ดร. ธีรเดช กิตติศักดิ์</span>
                <span className="text-[10px] text-slate-400 block truncate">teeradej.k@sci.kmutnb.ac.th</span>
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
              {t('advisor_role')}
            </span>
            <span className="text-xs font-bold text-slate-800 block truncate">ผศ.ดร. ธีรเดช กิตติศักดิ์</span>
            <span className="text-[10px] text-slate-400 block truncate">teeradej.k@sci.kmutnb.ac.th</span>
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

      {/* Main Area */}
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
                {t('academic_year')} • {isThai ? 'อาจารย์ที่ปรึกษาและกรรมการสอบ' : 'Faculty Advisor Board'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher onNotify={onNotify} />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isThai ? 'ระบบพร้อมใช้งาน' : 'Advisor Verified'}
            </div>
            <button 
              onClick={() => onNotify(isThai ? 'ไม่มีการแจ้งเตือนใหม่ในขณะนี้' : 'No new notifications.', 'info')}
              className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg relative cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#E11D48]" />
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === 'dashboard' && (
            <AdvisorDashboard
              students={students}
              reports={reports}
              bookings={bookings}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'students' && (
            <AdvisorStudents />
          )}

          {activeTab === 'documents' && (
            <AdvisorDocuments students={students} documents={documents} onNotify={onNotify} />
          )}

          {activeTab === 'diary-review' && (
            <AdvisorDiaryReview
              students={students}
              reports={reports}
              onApproveReport={handleApproveReport}
              onRejectReport={handleRejectReport}
            />
          )}

          {activeTab === 'coop-visit' && (
            <AdvisorCoopVisit
              students={students}
              bookings={bookings}
              onBookVisit={handleBookVisit}
            />
          )}

          {activeTab === 'examination' && (
            <AdvisorExamination
              students={students}
              onSaveEvaluation={handleSaveEvaluation}
            />
          )}

          {activeTab === 'profile' && (
            <AdvisorProfile onNotify={onNotify} />
          )}
        </div>
      </main>

    </div>
  );
}
