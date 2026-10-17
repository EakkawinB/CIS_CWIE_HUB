import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Building2, UserCheck, FileText, BookOpen, Clock, 
  Calendar, User, Bell, LogOut, Menu, X 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  MOCK_STUDENTS, MOCK_DOCUMENTS, MOCK_REPORTS, MOCK_TIMESHEETS, MOCK_EXAM, MOCK_TIMELINE_STAGES,
  Student, Document, WeeklyReport, Timesheet, ExaminationInfo, CoopTimelineStage 
} from '../types';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';

// Sub-page components
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentCompanies from '../pages/student/StudentCompanies';
import StudentMatchingStatus from '../pages/student/StudentMatchingStatusLive';
import StudentDocuments, { type StudentDocumentViewModel } from '../pages/student/StudentDocuments';
import StudentWeeklyDiaries from '../pages/student/StudentWeeklyDiaries';
import StudentTimesheets from '../pages/student/StudentTimesheets';
import StudentExamination from '../pages/student/StudentExamination';
import StudentProfileReadOnly from '../pages/student/StudentProfileReadOnly';
import {
  getMyResume,
  getMyResumeDownload,
  getMyDocuments,
  getMyStudentProfile,
  uploadMyResume,
  type ResumeResponseDto,
  type StudentProfileResponseDto,
} from '../services/api';

interface StudentPortalProps {
  onNotify: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onLogout: () => void;
}

export default function StudentPortal({ onNotify, onLogout }: StudentPortalProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  // Navigation State: 8 confirmed NAV items
  type StudentTab = 'dashboard' | 'companies' | 'matching' | 'documents' | 'reports' | 'timesheets' | 'examination' | 'profile';
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Student State
  const [student] = useState<Student>(MOCK_STUDENTS[0]);
  const [dashboardDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [documents, setDocuments] = useState<StudentDocumentViewModel[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfileResponseDto | null>(null);
  const [resume, setResume] = useState<ResumeResponseDto | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [reports, setReports] = useState<WeeklyReport[]>(MOCK_REPORTS);
  const [timesheets, setTimesheets] = useState<Timesheet[]>(MOCK_TIMESHEETS);
  const [exam, setExam] = useState<ExaminationInfo>(MOCK_EXAM);
  const [timelineStages] = useState<CoopTimelineStage[]>(MOCK_TIMELINE_STAGES);

  useEffect(() => {
    getMyDocuments()
      .then((data) => {
        setDocuments(data.map((document) => ({
          id: String(document.id),
          name: document.document_type?.trim() || '—',
          status: document.status,
          uploadedAt: document.uploaded_at?.slice(0, 10),
        })));
        setDocumentsError(null);
      })
      .catch(() => {
        setDocumentsError(isThai ? 'ไม่สามารถโหลดรายการเอกสารได้' : 'Unable to load documents.');
      })
      .finally(() => setDocumentsLoading(false));

    getMyStudentProfile()
      .then((data) => {
        setStudentProfile(data);
        setProfileError(null);
      })
      .catch(() => {
        setProfileError(isThai ? 'ไม่สามารถโหลดข้อมูลนักศึกษาได้' : 'Unable to load student profile.');
      })
      .finally(() => setProfileLoading(false));

    getMyResume()
      .then(setResume)
      .catch(() => {
        setProfileError(isThai ? '\u0e44\u0e21\u0e48\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e42\u0e2b\u0e25\u0e14 Resume \u0e44\u0e14\u0e49' : 'Unable to load Resume.');
      })
      .finally(() => setResumeLoading(false));
  }, [isThai]);

  // Nav Items list matching exact latest NAV
  const navItems: { id: StudentTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'companies', label: t('companies'), icon: Building2 },
    { id: 'matching', label: t('matching_status'), icon: UserCheck },
    { id: 'documents', label: t('documents'), icon: FileText },
    { id: 'reports', label: t('weekly_diaries'), icon: BookOpen },
    { id: 'timesheets', label: t('timesheets'), icon: Clock },
    { id: 'examination', label: t('examination'), icon: Calendar },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  // Action Handlers
  const handleUploadResume = async (file: File) => {
    try {
      const uploadedResume = await uploadMyResume(file);
      setResume(uploadedResume);
      onNotify(isThai ? '\u0e2d\u0e31\u0e1b\u0e42\u0e2b\u0e25\u0e14 Resume \u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08' : 'Resume uploaded successfully.', 'success');
    } catch {
      onNotify(isThai ? '\u0e44\u0e21\u0e48\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e2d\u0e31\u0e1b\u0e42\u0e2b\u0e25\u0e14 Resume \u0e44\u0e14\u0e49' : 'Unable to upload Resume.', 'error');
      throw new Error('Resume upload failed');
    }
  };

  const handleDownloadResume = async () => {
    try {
      const response = await getMyResumeDownload();
      window.open(response.download_url, '_blank', 'noopener,noreferrer');
    } catch {
      onNotify(isThai ? '\u0e44\u0e21\u0e48\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e40\u0e1b\u0e34\u0e14 Resume \u0e44\u0e14\u0e49' : 'Unable to open Resume.', 'error');
    }
  };

  const handleSubmitDiary = (newDiary: { summary: string; achievements: string; obstacles: string; hours: number }) => {
    const reportItem: WeeklyReport = {
      id: `REP00${reports.length + 1}`,
      studentId: student.id,
      studentName: student.name,
      weekNumber: reports.length + 1,
      startDate: '2026-06-22',
      endDate: '2026-06-26',
      summary: newDiary.summary,
      achievements: newDiary.achievements,
      obstacles: newDiary.obstacles,
      hoursWorked: newDiary.hours,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    setReports([reportItem, ...reports]);
    onNotify(isThai ? `ส่งบันทึกประจำสัปดาห์ที่ ${reportItem.weekNumber} สำเร็จ!` : `Week ${reportItem.weekNumber} diary submitted!`, 'success');
  };

  const handleSubmitTimesheet = (newTs: Timesheet) => {
    setTimesheets([newTs, ...timesheets]);
  };

  const handleCheckIn = () => {
    setExam({ ...exam, checkedIn: true });
    onNotify(isThai ? 'รายงานตัวเข้าสอบปากเปล่าสำเร็จ! แจ้งประธานกรรมการสอบแล้ว' : 'Check-in successful! Committee has been notified.', 'success');
  };

  const handleUploadMaterial = (fileName: string) => {
    onNotify(isThai ? `อัปโหลดเอกสารประกอบการสอบ "${fileName}" สำเร็จ!` : `Uploaded examination material "${fileName}"!`, 'success');
  };

  return (
    <div className="flex min-h-screen bg-slate-50/40 text-slate-800" id="student-portal-root">
      
      {/* Mobile Drawer Menu */}
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
                  {t('student_role')}
                </span>
                <span className="text-xs font-bold text-slate-800 block truncate">{student.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{student.email}</span>
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

      {/* Desktop Sidebar Layout */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col shrink-0 h-screen sticky top-0">
        <div className="p-5 border-b border-slate-50 bg-slate-50/20">
          <CISLogo size="lg" />
        </div>

        {/* Navigation buttons */}
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

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/50 m-4 rounded-xl">
          <div className="text-left mb-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              {t('student_role')}
            </span>
            <span className="text-xs font-bold text-slate-800 block truncate">{student.name}</span>
            <span className="text-[10px] text-slate-400 block truncate">{student.email}</span>
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
        
        {/* Top Header */}
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
                {t('academic_year')} • {isThai ? 'คณะวิทยาศาสตร์ประยุกต์' : 'Faculty of Applied Science'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher onNotify={onNotify} />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isThai ? 'สถานะผ่านการตรวจสอบ' : 'Verified Student'}
            </div>
            <button 
              onClick={() => onNotify(isThai ? 'ไม่มีการแจ้งเตือนใหม่ในขณะนี้' : 'No new notifications.', 'info')}
              className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg relative cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>
          </div>
        </header>

        {/* Content View Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === 'dashboard' && (
            <StudentDashboard
              student={student}
              documents={dashboardDocuments}
              exam={exam}
              timelineStages={timelineStages}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'companies' && (
            <StudentCompanies onNotify={onNotify} />
          )}

          {activeTab === 'matching' && (
            <StudentMatchingStatus onNotify={onNotify} />
          )}

          {activeTab === 'documents' && (
            <StudentDocuments
              documents={documents}
              loading={documentsLoading}
              error={documentsError}
            />
          )}

          {activeTab === 'reports' && (
            <StudentWeeklyDiaries
              reports={reports}
              onSubmitDiary={handleSubmitDiary}
            />
          )}

          {activeTab === 'timesheets' && (
            <StudentTimesheets
              timesheets={timesheets}
              onSubmitTimesheet={handleSubmitTimesheet}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'examination' && (
            <StudentExamination
              exam={exam}
              onCheckIn={handleCheckIn}
              onUploadMaterial={handleUploadMaterial}
            />
          )}

          {activeTab === 'profile' && (
            <StudentProfileReadOnly
              profile={studentProfile}
              resume={resume}
              loading={profileLoading || resumeLoading}
              error={profileError}
              onUploadResume={handleUploadResume}
              onDownloadResume={handleDownloadResume}
            />
          )}
        </div>
      </main>

    </div>
  );
}
