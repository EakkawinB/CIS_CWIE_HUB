import React, { useState } from 'react';
import { 
  LayoutDashboard, Building2, Users, GraduationCap, Briefcase, 
  FileText, Award, ClipboardCheck, BarChart3, UserCheck, 
  Settings, User, Bell, LogOut, Menu, X 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  MOCK_STUDENTS, MOCK_COMPANIES, MOCK_DOCUMENTS, MOCK_TIMESHEETS,
  Student, Company, Document, Timesheet 
} from '../types';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';

// Sub-components for 12 Top-Level Staff Functional Areas
import StaffDashboard from '../pages/staff/StaffDashboard';
import StaffCompanies from '../pages/staff/StaffCompanies';
import StaffStudents from '../pages/staff/StaffStudents';
import StaffAdvisors from '../pages/staff/StaffAdvisors';
import StaffMentors from '../pages/staff/StaffMentors';
import StaffDocuments from '../pages/staff/StaffDocuments';
import StaffExamination from '../pages/staff/StaffExamination';
import StaffEvaluation from '../pages/staff/StaffEvaluation';
import StaffReports from '../pages/staff/StaffReports';
import StaffUserManagement from '../pages/staff/StaffUserManagement';
import StaffSettings from '../pages/staff/StaffSettings';
import StaffProfile from '../pages/staff/StaffProfile';

interface StaffPortalProps {
  onNotify: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onLogout: () => void;
}

export type StaffTab = 
  | 'dashboard'
  | 'companies'
  | 'students'
  | 'advisors'
  | 'mentors'
  | 'documents'
  | 'examination'
  | 'evaluation'
  | 'reports'
  | 'user-management'
  | 'settings'
  | 'profile';

export default function StaffPortal({ onNotify, onLogout }: StaffPortalProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeTab, setActiveTab] = useState<StaffTab>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Central mock states
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [timesheets, setTimesheets] = useState<Timesheet[]>(MOCK_TIMESHEETS);

  // Exactly 12 Top-Level Staff Areas in exact sequence
  const navItems: { id: StaffTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'companies', label: t('companies'), icon: Building2 },
    { id: 'students', label: t('students'), icon: Users },
    { id: 'advisors', label: t('advisers'), icon: GraduationCap },
    { id: 'mentors', label: t('mentor'), icon: Briefcase },
    { id: 'documents', label: t('documents'), icon: FileText },
    { id: 'examination', label: t('examination'), icon: Award },
    { id: 'evaluation', label: t('evaluation'), icon: ClipboardCheck },
    { id: 'reports', label: t('reports'), icon: BarChart3 },
    { id: 'user-management', label: t('user_management'), icon: UserCheck },
    { id: 'settings', label: t('settings'), icon: Settings },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  const handleNavigateTab = (tab: StaffTab, subTab?: string) => {
    setActiveTab(tab);
    setActiveSubTab(subTab);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
  };

  const handleAddCompany = (newCompany: Company) => {
    setCompanies([...companies, newCompany]);
  };

  const handleUpdateDocument = (updatedDoc: Document) => {
    setDocuments(documents.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };

  return (
    <div className="flex min-h-screen bg-slate-50/40 text-slate-800" id="staff-portal-root">
      
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

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSel = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setActiveSubTab(undefined);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-[#6B122C] text-white shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-50 bg-slate-50/50 m-3 rounded-xl">
              <div className="text-left mb-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
                  {t('staff_role')}
                </span>
                <span className="text-xs font-bold text-slate-800 block truncate">นางสาววิมลรัตน์ บุญประเสริฐ</span>
                <span className="text-[10px] text-slate-400 block truncate">สำนักงานคณบดี วทป.</span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-1.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t('logout')}</span>
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

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSel = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setActiveSubTab(undefined);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isSel 
                    ? 'bg-[#6B122C] text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-50 bg-slate-50/50 m-3 rounded-xl">
          <div className="text-left mb-2.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              {t('staff_role')}
            </span>
            <span className="text-xs font-bold text-slate-800 block truncate">นางสาววิมลรัตน์ บุญประเสริฐ</span>
            <span className="text-[10px] text-slate-400 block truncate">สำนักงานคณบดี วทป.</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-1.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t('logout')}</span>
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
                {t('academic_year')} • {isThai ? 'เจ้าหน้าที่สหกิจศึกษา' : 'CWIE Coordinator'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher onNotify={onNotify} />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-500">
              <span className="h-2 w-2 rounded-full bg-[#6B122C]" />
              <span>{isThai ? 'ผู้ดูแลระบบส่วนกลาง' : 'System Staff'}</span>
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
            <StaffDashboard
              students={students}
              companies={companies}
              documents={documents}
              timesheets={timesheets}
              onNavigateTab={handleNavigateTab}
            />
          )}

          {activeTab === 'companies' && (
            <StaffCompanies
              companies={companies}
              students={students}
              initialSubTab={activeSubTab === 'matching' ? 'matching' : 'all'}
              onUpdateCompany={handleUpdateCompany}
              onAddCompany={handleAddCompany}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'students' && (
            <StaffStudents
              students={students}
              initialSubTab={activeSubTab === 'students-status' || activeSubTab === 'status' ? 'status' : 'all'}
              onUpdateStudent={handleUpdateStudent}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'advisors' && (
            <StaffAdvisors
              students={students}
              initialSubTab={activeSubTab === 'coop-visit' ? 'coop-visit' : activeSubTab === 'matching' ? 'matching' : 'all'}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'mentors' && (
            <StaffMentors
              students={students}
              initialSubTab={activeSubTab === 'assigned' ? 'assigned' : 'all'}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'documents' && (
            <StaffDocuments
              documents={documents}
              students={students}
              timesheets={timesheets}
              initialSubTab={activeSubTab === 'advisers' ? 'advisers' : activeSubTab === 'mentors' ? 'mentors' : 'students'}
              onUpdateDocument={handleUpdateDocument}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'examination' && (
            <StaffExamination
              students={students}
              initialSubTab={activeSubTab === 'rooms' ? 'rooms' : activeSubTab === 'schedule' ? 'schedule' : 'criteria'}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'evaluation' && (
            <StaffEvaluation
              students={students}
              initialSubTab={activeSubTab === 'mentors' || activeSubTab === 'mentor' ? 'mentors' : activeSubTab === 'final' ? 'final' : 'advisers'}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'reports' && (
            <StaffReports
              students={students}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'user-management' && (
            <StaffUserManagement
              initialSubTab={activeSubTab === 'add' ? 'add' : 'all'}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'settings' && (
            <StaffSettings
              initialSubTab={activeSubTab === 'timeline' ? 'timeline' : activeSubTab === 'permissions' ? 'permissions' : 'academic-year'}
              onNotify={onNotify}
            />
          )}

          {activeTab === 'profile' && (
            <StaffProfile
              onNotify={onNotify}
            />
          )}
        </div>
      </main>

    </div>
  );
}
