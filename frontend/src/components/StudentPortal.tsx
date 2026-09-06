import React, { useState } from 'react';
import { 
  LayoutDashboard, Building2, UserCheck, FileText, Calendar, Clock, BookOpen, 
  User, Bell, Search, Filter, ArrowUpRight, CheckCircle, AlertTriangle, 
  XCircle, UploadCloud, Download, Plus, Star, MapPin, DollarSign, RefreshCw, Eye, SlidersHorizontal, X, Menu
} from 'lucide-react';
import { 
  MOCK_STUDENTS, MOCK_COMPANIES, MOCK_REPORTS, MOCK_TIMESHEETS, MOCK_DOCUMENTS, 
  MOCK_EXAM, Student, Company, WeeklyReport, Timesheet, Document
} from '../types';
import { useLanguage } from '../LanguageContext';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';

interface StudentPortalProps {
  onNotify: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onLogout: () => void;
}

export default function StudentPortal({ onNotify, onLogout }: StudentPortalProps) {
  const { t, language, setLanguage } = useLanguage();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'companies' | 'matching' | 'documents' | 'reports' | 'timesheets' | 'examination' | 'profile'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data State (re-uses mock data as reactive local state)
  const [student, setStudent] = useState<Student>(MOCK_STUDENTS[0]);
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: student.name,
    email: student.email,
    major: student.major,
    gpa: student.gpa.toString(),
    skills: student.skills.join(', ')
  });

  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [reports, setReports] = useState<WeeklyReport[]>(MOCK_REPORTS);
  const [timesheets, setTimesheets] = useState<Timesheet[]>(MOCK_TIMESHEETS);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [exam, setExam] = useState(MOCK_EXAM);

  // Search & Filter State (for Companies page)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Form State (for Weekly Reports submissions)
  const [newReport, setNewReport] = useState({
    summary: '',
    achievements: '',
    obstacles: '',
    hours: 40
  });

  // State for interest markers
  const [interestedPositions, setInterestedPositions] = useState<string[]>([]);

  // Simulation handlers
  const handleToggleInterest = (posId: string) => {
    if (interestedPositions.includes(posId)) {
      setInterestedPositions(interestedPositions.filter(id => id !== posId));
      onNotify('Withdrew interest for position.', 'info');
    } else {
      setInterestedPositions([...interestedPositions, posId]);
      onNotify('Interest successfully registered! The employer has been notified.', 'success');
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.summary) {
      onNotify('Please write a weekly summary description.', 'warning');
      return;
    }

    const reportItem: WeeklyReport = {
      id: `REP00${reports.length + 1}`,
      studentId: student.id,
      weekNumber: reports.length + 1,
      startDate: '2026-07-06',
      endDate: '2026-07-10',
      summary: newReport.summary,
      achievements: newReport.achievements,
      obstacles: newReport.obstacles,
      hoursWorked: Number(newReport.hours),
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    setReports([reportItem, ...reports]);
    setNewReport({ summary: '', achievements: '', obstacles: '', hours: 40 });
    onNotify(`Week ${reportItem.weekNumber} Report submitted successfully!`, 'success');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStudent({
      ...student,
      name: editForm.name,
      email: editForm.email,
      major: editForm.major,
      gpa: parseFloat(editForm.gpa) || 3.82,
      skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsEditingProfile(false);
    onNotify(language === 'th' ? 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!' : 'Profile updated successfully!', 'success');
  };

  const handleFileUpload = (docId: string, name: string) => {
    setDocuments(documents.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'Submitted',
          fileName: name,
          uploadedAt: 'Just now',
          fileSize: '1.8 MB'
        };
      }
      return doc;
    }));
    onNotify(`Document successfully uploaded and queued for audit.`, 'success');
  };

  return (
    <div className="flex min-h-screen bg-slate-50/40 text-slate-800" id="student-portal-root">
      
      {/* Mobile Drawer Menu Overlay */}
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
              {[
                { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
                { id: 'companies', label: language === 'th' ? 'สถานประกอบการ' : 'Companies', icon: Building2 },
                { id: 'matching', label: t('matching_status'), icon: UserCheck },
                { id: 'documents', label: language === 'th' ? 'เอกสารยื่นเรื่อง' : 'Documents', icon: FileText },
                { id: 'reports', label: t('weekly_diaries'), icon: BookOpen },
                { id: 'timesheets', label: t('timesheets'), icon: Clock },
                { id: 'examination', label: t('examinations'), icon: Calendar },
                { id: 'profile', label: t('profile'), icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isSel = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                      isSel 
                        ? 'bg-blue-600 text-white shadow-xs' 
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
                  {language === 'th' ? 'นักศึกษาที่ใช้งานอยู่' : 'Active Student'}
                </span>
                <span className="text-xs font-bold text-slate-800 block truncate">{student.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{student.email}</span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-1.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold rounded-lg cursor-pointer"
              >
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

        {/* Sidebar Nav Buttons */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
            { id: 'companies', label: language === 'th' ? 'สถานประกอบการ' : 'Companies', icon: Building2 },
            { id: 'matching', label: t('matching_status'), icon: UserCheck },
            { id: 'documents', label: language === 'th' ? 'เอกสารยื่นเรื่อง' : 'Documents', icon: FileText },
            { id: 'reports', label: t('weekly_diaries'), icon: BookOpen },
            { id: 'timesheets', label: t('timesheets'), icon: Clock },
            { id: 'examination', label: t('examinations'), icon: Calendar },
            { id: 'profile', label: t('profile'), icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  isSel 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/50 m-4 rounded-xl">
          <div className="text-left mb-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              {language === 'th' ? 'นักศึกษาที่ใช้งานอยู่' : 'Active Student'}
            </span>
            <span className="text-xs font-bold text-slate-800 block truncate">{student.name}</span>
            <span className="text-[10px] text-slate-400 block truncate">{student.email}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-1.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold rounded-lg cursor-pointer"
          >
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-50 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
              title="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-left">
              <h1 className="text-sm font-bold text-slate-900 capitalize font-sans leading-tight">
                {language === 'th' ? `แดชบอร์ด ${activeTab}` : `${activeTab} Dashboard`}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono leading-none sm:leading-normal">{t('academic_year')} &bull; {language === 'th' ? 'คณะวิทยาศาสตร์ประยุกต์' : 'Faculty of Applied Science'}</p>
            </div>
          </div>

          {/* Quick Notification & Status Area */}
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher onNotify={onNotify} />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {language === 'th' ? 'สถานะผ่านการตรวจสอบ' : 'Verified Status'}
            </div>
            <button className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg relative cursor-pointer">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>
          </div>
        </header>

        {/* Tab Switchboard */}
        <div className="flex-1 overflow-y-auto p-8 text-left space-y-6">

          {/* SCREEN 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Placement status banner */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    {language === 'th' ? 'สถานะตำแหน่งงาน' : 'Placement Status'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">
                      {language === 'th' ? 'สถานประกอบการปัจจุบันที่ได้รับการจัดสรร:' : 'Current Assigned Employer:'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">NexaTech Solutions</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {language === 'th' 
                      ? 'ตำแหน่ง: นักพัฒนาเว็บฝรอนต์เอนด์ (React ฝึกงาน). เริ่มปฏิบัติงาน: 1 มิถุนายน 2569.' 
                      : 'Position: Frontend Developer (React Intern). Commenced: June 01, 2026.'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-slate-400">
                    {language === 'th' ? 'ความก้าวหน้าช่วงเริ่มงาน:' : 'Onboarding progress:'}
                  </span>
                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">75%</span>
                </div>
              </div>
 
              {/* Grid Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Widgets Col 1: Upcoming Deadlines */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>{language === 'th' ? 'กำหนดการเป้าหมายถัดไป' : 'Upcoming Milestones'}</span>
                    <Clock className="h-4 w-4 text-blue-600" />
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {language === 'th' ? 'ส่งรายงานความก้าวหน้าประจำสัปดาห์ที่ 6' : 'Submit Week 6 Report'}
                        </span>
                        <span className="text-[9px] bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.5 rounded-sm">
                          {language === 'th' ? 'เหลืออีก 5 วัน' : '5 Days Left'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {language === 'th' ? 'กำหนดส่งภายใน: วันศุกร์ 17:00 น.' : 'Target Deadline: Friday, 5:00 PM'}
                      </p>
                    </div>
 
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {language === 'th' ? 'การเข้าเยี่ยมนิเทศงานกลางภาคเรียน' : 'Midterm Supervision Visit'}
                        </span>
                        <span className="text-[9px] bg-slate-100 text-slate-500 font-semibold px-1.5 py-0.5 rounded-sm">
                          {language === 'th' ? '25 ก.ค.' : 'Jul 25'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {language === 'th' ? 'สำนักงานใหญ่บริษัท NexaTech, ห้องประชุม 302' : 'NexaTech corporate office. Room 302.'}
                      </p>
                    </div>
                  </div>
                </div>
 
                {/* Widgets Col 2: Pipeline status chips */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>{language === 'th' ? 'การติดตามสถานะในระบบ' : 'Pipeline Tracking'}</span>
                    <FileText className="h-4 w-4 text-blue-600" />
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-semibold">
                        {language === 'th' ? 'ความสมบูรณ์รายงานรายสัปดาห์' : 'Weekly Log Completion'}
                      </span>
                      <span className="text-emerald-600 font-semibold font-mono">
                        {language === 'th' ? 'อนุมัติแล้ว (2)' : 'Approved (2)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-semibold">
                        {language === 'th' ? 'การส่งรายงานลงเวลาทำงาน' : 'Timesheet Submissions'}
                      </span>
                      <span className="text-amber-600 font-semibold font-mono">
                        {language === 'th' ? 'รออนุมัติ 1' : '1 Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-semibold">
                        {language === 'th' ? 'สัญญาจ้าง/เอกสารข้อตกลง' : 'Required Agreements'}
                      </span>
                      <span className="text-emerald-600 font-semibold font-mono">
                        {language === 'th' ? 'ลงนามเสร็จสิ้น (2/2)' : 'Signed (2/2)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 font-semibold">
                        {language === 'th' ? 'คะแนนแบบประเมินทางวิชาการ' : 'Academic Evaluation Form'}
                      </span>
                      <span className="text-rose-600 font-semibold font-mono">
                        {language === 'th' ? 'ยังไม่เสร็จสิ้น' : 'Incomplete'}
                      </span>
                    </div>
                  </div>
                </div>
 
                {/* Widgets Col 3: Examination Schedule */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>{language === 'th' ? 'บอร์ดกรรมการจัดสอบปากเปล่า' : 'Defenses Board'}</span>
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </h3>
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                    <span className="text-[10px] font-mono text-blue-800 uppercase tracking-wider block">
                      {language === 'th' ? 'ตารางกำหนดการสอบป้องกันโครงงาน' : 'Scheduled Examination'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-950">
                      {language === 'th' ? '15 สิงหาคม 2569' : 'August 15, 2026'}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {language === 'th' 
                        ? 'เวลา: 10:00 น. สถานที่: ศูนย์คอมพิวเตอร์ภาควิชา CIS มหาวิทยาลัย แต่งตั้งบอร์ดคณะกรรมการสอบแล้ว' 
                        : 'Time: 10:00 AM. Room: CIS Computing Center. Evaluation Board assigned.'}
                    </p>
                  </div>
                </div>
 
              </div>
 
              {/* Horizontal Timeline */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  {language === 'th' ? 'เส้นทางความสำเร็จและเป้าหมายสหกิจศึกษา (CWIE)' : 'CWIE Milestone Pathway'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { 
                      title: language === 'th' ? 'ข้อเสนอรับเข้าทำงาน' : 'Placement Offer', 
                      date: language === 'th' ? '10 พ.ค.' : 'May 10', 
                      desc: language === 'th' ? 'ได้รับการตอบรับเข้าปฏิบัติงานที่บริษัท NexaTech' : 'Accepted at NexaTech', 
                      isDone: true 
                    },
                    { 
                      title: language === 'th' ? 'จัดทำเอกสารข้อตกลง' : 'Agreement Forms', 
                      date: language === 'th' ? '18 พ.ค.' : 'May 18', 
                      desc: language === 'th' ? 'ลงนามเสร็จสิ้นสมบูรณ์ร่วมกันทั้งสามฝ่ายเรียบร้อย' : 'Fully signed by both parties', 
                      isDone: true 
                    },
                    { 
                      title: language === 'th' ? 'การประเมินกลางภาค' : 'Midterm Evaluation', 
                      date: language === 'th' ? '25 ก.ค.' : 'July 25', 
                      desc: language === 'th' ? 'กำหนดการเข้าเยี่ยมนิเทศงาน ณ สถานประกอบการจริง' : 'On-site Supervisor visit scheduled', 
                      isDone: false, 
                      isCurrent: true 
                    },
                    { 
                      title: language === 'th' ? 'สอบป้องกันผลงานโครงงาน' : 'Final Defense', 
                      date: language === 'th' ? '15 ส.ค.' : 'August 15', 
                      desc: language === 'th' ? 'นำเสนอผลงานและสรุปผลสำเร็จต่อคณะกรรมการสอบปากเปล่า' : 'Evaluation presentation board review', 
                      isDone: false 
                    },
                  ].map((milestone, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border relative overflow-hidden ${
                      milestone.isDone 
                        ? 'bg-emerald-50/20 border-emerald-100 text-emerald-800' 
                        : milestone.isCurrent
                          ? 'bg-blue-50/30 border-blue-200 text-blue-900 ring-2 ring-blue-100'
                          : 'bg-slate-50/30 border-slate-100 text-slate-500'
                    }`}>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-xs font-bold">{milestone.title}</span>
                        {milestone.isDone ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : milestone.isCurrent ? (
                          <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                        ) : null}
                      </div>
                      <span className="text-[10px] font-mono block opacity-80 mb-1">{milestone.date}</span>
                      <p className="text-[10px] opacity-70 leading-normal">{milestone.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: COMPANIES */}
          {activeTab === 'companies' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Filters bar */}
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="relative flex-1 w-full">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'th' ? "ค้นหาตำแหน่งงาน, เทคโนโลยี (เช่น React)..." : "Search engineering positions, tech stacks..."} 
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none text-slate-600"
                  >
                    <option value="All">{language === 'th' ? 'ทุกหมวดหมู่อุตสาหกรรม' : 'All Industries'}</option>
                    <option value="SaaS">{language === 'th' ? 'ซอฟต์แวร์ระดับองค์กร (SaaS)' : 'Enterprise SaaS'}</option>
                    <option value="Fintech">{language === 'th' ? 'เทคโนโลยีทางการเงิน (Fintech)' : 'Financial Technology'}</option>
                    <option value="Creative">{language === 'th' ? 'เทคโนโลยีสร้างสรรค์ (Creative)' : 'Creative Technology'}</option>
                  </select>
                </div>
              </div>

              {/* Companies Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <div key={company.id} className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 hover:shadow-sm transition-all flex flex-col justify-between h-[300px]">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 bg-gradient-to-tr ${company.logoColor} text-white text-xs font-black rounded-xl h-10 w-10 flex items-center justify-center shadow-xs`}>
                          {company.name.charAt(0)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {company.rating}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-sm">{company.name}</h3>
                        <p className="text-[10px] text-blue-600 font-medium font-mono uppercase tracking-wider">
                          {language === 'th' ? (company.industryTh || company.industry) : company.industry}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {language === 'th' ? (company.descriptionTh || company.description) : company.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[120px]">
                          {language === 'th' ? (company.locationTh || company.location) : company.location}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 transition-all rounded-lg cursor-pointer"
                      >
                        {language === 'th' ? 'ดูตำแหน่งงาน' : 'Explore Positions'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Modal for selected Company */}
              {selectedCompany && (
                <div 
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[70] flex items-center justify-end"
                  onClick={() => setSelectedCompany(null)}
                >
                  <div 
                    className="bg-white h-full w-full max-w-lg p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center pb-6 border-b border-slate-100 mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${selectedCompany.logoColor} text-white font-extrabold flex items-center justify-center text-lg`}>
                          {selectedCompany.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-slate-950 text-base">{selectedCompany.name}</h3>
                          <span className="text-xs text-blue-600 font-medium font-mono uppercase">
                            {language === 'th' ? (selectedCompany.industryTh || selectedCompany.industry) : selectedCompany.industry}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedCompany(null)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-slate-100 text-xs font-semibold"
                      >
                        <X className="h-4 w-4" />
                        {language === 'th' ? 'ปิด' : 'Close'}
                      </button>
                    </div>

                    <div className="space-y-6 text-left">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          {language === 'th' ? 'ข้อมูลภาพรวมบริษัท' : 'Company Overview'}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {language === 'th' ? (selectedCompany.descriptionTh || selectedCompany.description) : selectedCompany.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {language === 'th' ? 'ตำแหน่งงานสหกิจศึกษาที่เปิดรับ' : 'Available CWIE Internships'}
                        </h4>
                        
                        {selectedCompany.positions.map((pos) => (
                          <div key={pos.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">
                                  {language === 'th' ? (pos.titleTh || pos.title) : pos.title}
                                </h5>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                                  <span>
                                    {language === 'th' 
                                      ? `จำนวนที่รับ: ${pos.filled}/${pos.slots} คน` 
                                      : `Slots: ${pos.filled}/${pos.slots} filled`
                                    }
                                  </span>
                                  <span>&bull;</span>
                                  <span className="text-blue-600">
                                    {language === 'th' ? (pos.salaryTh || pos.salary) : pos.salary}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleToggleInterest(pos.id)}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                  interestedPositions.includes(pos.id)
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {interestedPositions.includes(pos.id) 
                                  ? (language === 'th' ? 'สนใจแล้ว' : 'Registered Interest')
                                  : (language === 'th' ? 'สนใจสมัคร' : 'Express Interest')
                                }
                              </button>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                              {language === 'th' ? (pos.descriptionTh || pos.description) : pos.description}
                            </p>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                                {language === 'th' ? 'คุณสมบัติของผู้สมัคร:' : 'Candidate Requirements:'}
                              </span>
                              <ul className="space-y-1">
                                {(language === 'th' && pos.requirementsTh ? pos.requirementsTh : pos.requirements).map((req, i) => (
                                  <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-tight">
                                    <span className="text-blue-500 font-bold shrink-0">&bull;</span>
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 3: MATCHING */}
          {activeTab === 'matching' && (
            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-xs max-w-2xl space-y-6 animate-in fade-in duration-150 text-left">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 inline-block">
                  {language === 'th' ? 'ผ่านการคัดเลือกตำแหน่งงานแล้ว' : 'Matching Clearance Active'}
                </span>
                <h2 className="text-lg font-bold text-slate-900 font-sans">
                  {language === 'th' ? 'สถานะการจัดคู่ตำแหน่งงานสหกิจศึกษา' : 'Official Placement Matching Status'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'th' 
                    ? 'ตรวจสอบ อนุมัติ หรือปฏิเสธการจัดสรรตำแหน่งงานสหกิจศึกษา (CWIE) ของคุณที่นี่' 
                    : 'Review, authorize, or decline formal CWIE placement allocations below.'}
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    {language === 'th' ? 'นักศึกษาฝึกงานวิศวกรรมฟรอนต์เอนด์ (Frontend)' : 'Frontend Engineering Intern'}
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold mb-2">NexaTech Solutions Ltd.</p>
                  <p className="text-xs text-slate-500">
                    {language === 'th' 
                      ? 'ระยะเวลา: 16 สัปดาห์ (1 มิถุนายน - 18 กันยายน 2569)' 
                      : 'Duration: 16 Weeks (June 01 - September 18, 2026)'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {language === 'th' 
                      ? 'ผู้ควบคุมงาน: คุณสมศักดิ์ พิพัฒน์พัฒนา (Dev Lead)' 
                      : 'Supervisor: Khun Somsak Pipatpatana (Dev Lead)'}
                  </p>
                </div>
                
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> 
                  {language === 'th' ? 'จัดสรรและยืนยันเรียบร้อยแล้ว' : 'Allocated & Confirmed'}
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'th' ? 'ขั้นตอนถัดไปที่ต้องดำเนินการ' : 'Next Required Actions'}
                </h4>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>
                      {language === 'th' 
                        ? 'ยืนยันแบบฟอร์มสัญญาจ้างและใบสมัครในเมนู "เอกสารยื่นเรื่อง"' 
                        : 'Confirm placement contract forms on the "Documents" tab.'}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>
                      {language === 'th' 
                        ? 'ประสานงานกับอาจารย์ที่ปรึกษา ผศ.ดร.สมชาย เพื่อกำหนดและยืนยันวันออกนิเทศงาน' 
                        : 'Coordinate with academic advisor Asst. Prof. Dr. Somchai to confirm site visit.'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  disabled
                  onClick={() => onNotify(language === 'th' ? 'ปฏิเสธการจัดตำแหน่งสหกิจสำเร็จ' : 'Declined matching offer.', 'info')}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed"
                >
                  {language === 'th' ? 'ปฏิเสธการจัดสรร' : 'Decline Allocation'}
                </button>
                <button
                  onClick={() => onNotify(
                    language === 'th' ? 'คุณได้กดยืนยันการจัดสรรและลงนามในเอกสารนี้แล้ว' : 'You have already confirmed and signed this allocation.', 
                    'info'
                  )}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {language === 'th' ? 'ข้อเสนอนี้ได้รับการยืนยันแล้ว' : 'Offer Already Confirmed'}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-left">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  {language === 'th' ? 'เอกสารประกอบหลักสูตรสหกิจศึกษา (CWIE)' : 'Required Academic CWIE Documentation'}
                </h2>
                <p className="text-xs text-slate-400">
                  {language === 'th' 
                    ? 'อัปโหลดใบสมัคร สัญญาจ้าง บันทึกรายงาน และสรุปผลการประเมินจากสถานประกอบการที่ลงนามแล้ว' 
                    : 'Upload agreement signatures, weekly timesheet reviews, and final evaluation results.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Upload & Table column */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {language === 'th' ? 'รายการคลังเอกสารสหกิจ' : 'Documents Inventory'}
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-2 px-3">{language === 'th' ? 'ชื่อเอกสาร' : 'Document Name'}</th>
                          <th className="py-2 px-3 hidden md:table-cell">{language === 'th' ? 'ประเภท' : 'Type'}</th>
                          <th className="py-2 px-3 hidden sm:table-cell">{language === 'th' ? 'วันที่อัปโหลด' : 'Date'}</th>
                          <th className="py-2 px-3 text-right">{language === 'th' ? 'สถานะ' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {documents.map((doc) => {
                          // Inline translations for categories and status
                          let displayCategory = doc.category;
                          if (language === 'th') {
                            if (doc.category === 'Agreement') displayCategory = 'เอกสารข้อตกลง';
                            else if (doc.category === 'Report') displayCategory = 'รายงานความคืบหน้า';
                            else if (doc.category === 'Evaluation') displayCategory = 'การประเมินผล';
                          }

                          let displayStatus = doc.status;
                          if (language === 'th') {
                            if (doc.status === 'Approved') displayStatus = 'อนุมัติเรียบร้อย';
                            else if (doc.status === 'Submitted') displayStatus = 'ยื่นเรื่องแล้ว';
                            else if (doc.status === 'Action Required') displayStatus = 'ต้องแก้ไขเอกสาร';
                            else if (doc.status === 'Missing') displayStatus = 'ยังไม่ได้ส่ง';
                          }

                          return (
                            <tr key={doc.id} className="hover:bg-slate-50/50">
                              <td className="py-3 px-3 font-medium text-slate-950">
                                <div className="space-y-1">
                                  <span>{doc.name}</span>
                                  {doc.feedback && (
                                    <span className="block text-[10px] text-amber-600 bg-amber-50 p-1.5 rounded border border-amber-100">
                                      <b>{language === 'th' ? 'ข้อเสนอแนะเพิ่มเติม:' : 'Feedback:'}</b> {doc.feedback}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono text-[10px] hidden md:table-cell">{displayCategory}</td>
                              <td className="py-3 px-3 text-slate-400 hidden sm:table-cell">{doc.uploadedAt || '--'}</td>
                              <td className="py-3 px-3 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  doc.status === 'Approved' 
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : doc.status === 'Submitted'
                                      ? 'bg-blue-50 text-blue-700'
                                      : doc.status === 'Action Required'
                                        ? 'bg-amber-50 text-amber-700 animate-pulse'
                                        : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {displayStatus}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Download and quick templates */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      {language === 'th' ? 'ดาวน์โหลดเอกสารเปล่า / แบบฟอร์ม' : 'Download Institutional Templates'}
                    </h3>
                    <div className="space-y-2">
                      <button 
                        onClick={() => onNotify(
                          language === 'th' ? 'ดาวน์โหลดแบบฟอร์มใบสมัครสหกิจศึกษาเรียบร้อย' : 'Downloaded CWIE Application signed document template.', 
                          'success'
                        )}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700 transition-colors"
                      >
                        <span className="font-semibold text-left block truncate max-w-[200px]">CWIE_Application_Form.docx</span>
                        <Download className="h-4 w-4 text-blue-600 shrink-0" />
                      </button>

                      <button 
                        onClick={() => onNotify(
                          language === 'th' ? 'ดาวน์โหลดแผ่นบันทึกเวลาปฏิบัติงานเรียบร้อย' : 'Downloaded timesheet tracking sheet template.', 
                          'success'
                        )}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700 transition-colors"
                      >
                        <span className="font-semibold text-left block truncate max-w-[200px]">Weekly_Timesheet_Blank.xlsx</span>
                        <Download className="h-4 w-4 text-blue-600 shrink-0" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      {language === 'th' ? 'อัปโหลดรายงานหรือใบสมัครที่ลงนามแล้ว' : 'Upload signed Agreement Forms'}
                    </h3>
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 rounded-xl p-4 text-center relative cursor-pointer">
                      <input 
                        type="file" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload('DOC05', e.target.files[0].name);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                      <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <span className="text-[11px] font-semibold text-slate-700 block">
                        {language === 'th' ? 'ลากและวางเอกสารเพื่ออัปโหลดใหม่ที่นี่' : 'Drag & Drop new revisions here'}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {language === 'th' ? 'รองรับ PDF, DOCX ขนาดไม่เกิน 10MB' : 'PDF, DOCX up to 10MB'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SCREEN 5: WEEKLY REPORTS */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-150 text-left">
              
              {/* Form Input column */}
              <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="border-b border-slate-50 pb-3 mb-2">
                  <h2 className="text-base font-bold text-slate-900">
                    {language === 'th' ? `เพิ่มรายงานสรุปผลประจำสัปดาห์ที่ ${reports.length + 1}` : `Add Week ${reports.length + 1} Diary Report`}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {language === 'th' 
                      ? 'บันทึกสรุปงานและส่งไดอารี่ชั่วโมงการทำงาน รวมถึงผลงานหลักและอุปสรรคที่พบระหว่างสัปดาห์' 
                      : 'Submit descriptive diaries detailing weekly progress, key achievements, and blocks.'}
                  </p>
                </div>

                <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {language === 'th' ? 'จำนวนชั่วโมงสะสม' : 'Hours Logged'}
                      </label>
                      <input 
                        type="number" 
                        required
                        value={newReport.hours}
                        onChange={(e) => setNewReport({ ...newReport, hours: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        {language === 'th' ? 'ช่วงสัปดาห์ที่ครอบคลุม' : 'Covering Period'}
                      </label>
                      <input 
                        type="text" 
                        disabled
                        value={language === 'th' ? '6 กรกฎาคม 2569 - 10 กรกฎาคม 2569' : 'July 06, 2026 - July 10, 2026'}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs outline-none text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {language === 'th' ? '1. สรุปรายละเอียดงานและการดำเนินงาน' : '1. Summary of Tasks & Operations'}
                    </label>
                    <textarea 
                      rows={3}
                      required
                      placeholder={language === 'th' ? 'เขียนรายละเอียดของงานที่คุณทำในสัปดาห์นี้สั้นๆ...' : 'Write brief description of tasks accomplished...'}
                      value={newReport.summary}
                      onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {language === 'th' ? '2. ผลสัมฤทธิ์หรือผลงานที่ทำสำเร็จ' : '2. Core Key Achievements'}
                    </label>
                    <textarea 
                      rows={2}
                      placeholder={language === 'th' ? 'เช่น พัฒนาหน้าจอแดชบอร์ด, ออกแบบฐานข้อมูลใหม่...' : 'e.g. Optimized SQL schema, resolved dashboard rendering bugs...'}
                      value={newReport.achievements}
                      onChange={(e) => setNewReport({ ...newReport, achievements: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {language === 'th' ? '3. ปัญหาอุปสรรคและแนวทางแก้ไขที่พบ' : '3. Encountered Obstacles & Resolutions'}
                    </label>
                    <textarea 
                      rows={2}
                      placeholder={language === 'th' ? 'อธิบายปัญหาเชิงเทคนิคที่คุณพบและวิธีที่คุณใช้ก้าวผ่านอุปสรรค...' : 'Describe any tech blockers and how you overcame them...'}
                      value={newReport.obstacles}
                      onChange={(e) => setNewReport({ ...newReport, obstacles: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    {language === 'th' ? 'ส่งรายงานความคืบหน้าประจำสัปดาห์' : 'Submit Report to Advisor Review'}
                  </button>
                </form>
              </div>

              {/* History Column */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'th' ? 'ประวัติไดอารี่สรุปงานย้อนหลัง' : 'Previous Weekly Diaries'}
                </h3>
                
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
                  {reports.map((rep) => {
                    let displayStatus = rep.status;
                    if (language === 'th') {
                      if (rep.status === 'Approved') displayStatus = 'ตรวจผ่านแล้ว';
                      else displayStatus = 'รอดำเนินการ';
                    }

                    return (
                      <div key={rep.id} className="p-4 bg-white border border-slate-100 rounded-xl shadow-xs space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-900">
                            {language === 'th' ? `บันทึกสรุปผลสัปดาห์ที่ ${rep.weekNumber}` : `Week ${rep.weekNumber} Diary Log`}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            rep.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {displayStatus}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{rep.summary}</p>

                        {rep.advisorComment && (
                          <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-[10px] text-blue-800 leading-relaxed">
                            <b>{language === 'th' ? 'อาจารย์ที่ปรึกษา สมชาย:' : 'Advisor Somchai:'}</b> "{rep.advisorComment}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* SCREEN 6: TIMESHEETS */}
          {activeTab === 'timesheets' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-left">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {language === 'th' ? 'อัปโหลดใบลงเวลาปฏิบัติงานประจำสัปดาห์' : 'Weekly timesheet uploads'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {language === 'th' 
                      ? 'บันทึกเวลาการปฏิบัติงานและชั่วโมงทำงานที่ลงนามโดยพี่เลี้ยง/ผู้ควบคุมงานจากสถานประกอบการ' 
                      : 'Log clocking logs signed by on-site supervisors. Ensures placement hours audits pass.'}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {language === 'th' ? 'จำนวนชั่วโมงที่ได้รับการอนุมัติแล้ว' : 'Approved placement hours'}
                    </span>
                    <span className="text-sm font-extrabold text-blue-600 block">80.0 / 640 hrs</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Inventory Table */}
                <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    {language === 'th' ? 'ประวัติการส่งใบลงเวลาการทำงาน' : 'Submitted Timesheets'}
                  </h3>
                  
                  <div className="space-y-3">
                    {timesheets.map((ts) => (
                      <div key={ts.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4">
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-slate-800">
                            {language === 'th' ? `ใบลงเวลาประจำสัปดาห์ที่ ${ts.weekNumber}` : `Week ${ts.weekNumber} Timesheet`}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {language === 'th' ? 'ระยะเวลา:' : 'Duration:'} {ts.startDate} &mdash; {ts.endDate}
                          </p>
                          {ts.approvedBy && (
                            <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">
                              {language === 'th' ? 'ผู้ยืนยัน:' : 'Verified:'} {ts.approvedBy}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-700">{ts.hoursWorked} hrs</span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${
                            ts.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {ts.status === 'Approved' ? (language === 'th' ? 'อนุมัติแล้ว' : 'Approved') : (language === 'th' ? 'รอตรวจสอบ' : 'Pending')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Timesheet widget */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {language === 'th' ? 'ส่งรายงานเวลาการปฏิบัติงานสัปดาห์ใหม่' : 'Submit New Timesheet Log'}
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                        {language === 'th' ? 'ประจำสัปดาห์ที่' : 'Week Number'}
                      </label>
                      <input 
                        type="number" 
                        defaultValue={timesheets.length + 1}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1 font-mono">
                        {language === 'th' ? 'อัปโหลดไฟล์ PDF/Excel ที่มีลายเซ็น' : 'Upload Signed Excel/PDF'}
                      </label>
                      <div className="border border-dashed border-slate-200 bg-slate-50 p-4 text-center rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
                        <UploadCloud className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {language === 'th' ? 'เลือกไฟล์ประวัติเวลาปฏิบัติงาน' : 'Select Timesheet Artifact'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const nextId = timesheets.length + 1;
                        const newTs: Timesheet = {
                          id: `TS00${nextId}`,
                          studentId: student.id,
                          weekNumber: nextId,
                          startDate: '2026-07-06',
                          endDate: '2026-07-10',
                          hoursWorked: 40,
                          status: 'Pending',
                          fileName: `timesheet_week_${nextId}_kasidis.pdf`,
                          submittedAt: new Date().toISOString()
                        };
                        setTimesheets([...timesheets, newTs]);
                        onNotify(
                          language === 'th' ? 'บันทึกเวลาได้รับการยื่นเสนอแก่ผู้ควบคุมงานแล้ว!' : 'Timesheet successfully submitted for Supervisor approval!', 
                          'success'
                        );
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl"
                    >
                      {language === 'th' ? 'ยืนยันการส่งใบลงเวลา' : 'Submit Log'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SCREEN 7: EXAMINATION */}
          {activeTab === 'examination' && (
            <div className="max-w-2xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs space-y-6 animate-in fade-in duration-150 text-left">
              <div className="border-b border-slate-100 pb-4">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 inline-block">
                  {language === 'th' ? 'การประเมินโดยคณะกรรมการวิชาการ' : 'Academic board review'}
                </span>
                <h2 className="text-lg font-bold text-slate-900 font-sans">
                  {language === 'th' ? 'การสอบปากเปล่าและป้องกันรายงานสหกิจศึกษา' : 'Formal Defense & Examination'}
                </h2>
                <p className="text-xs text-slate-400">
                  {language === 'th' 
                    ? 'ติดตามกำหนดการนำเสนอ รายชื่อคณะกรรมการสอบ รายละเอียดสถานที่จัดสอบ และคะแนนการสอบปากเปล่า' 
                    : 'Track presentation schedules, evaluation committee panels, room details, and defense scores.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Schedule Card */}
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {language === 'th' ? 'กำหนดการนำเสนอผลงาน' : 'Presentation Schedule'}
                  </span>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {language === 'th' ? 'วันที่สอบปากเปล่า:' : 'Defense Date:'}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{exam.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {language === 'th' ? 'ช่วงเวลาสอบที่กำหนด:' : 'Assigned Time-block:'}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{exam.time}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {language === 'th' ? 'สถานที่นำเสนอผลงาน:' : 'Assigned Presentation Venue:'}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{exam.room}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setExam({ ...exam, checkedIn: true });
                        onNotify(
                          language === 'th' ? 'รายงานตัวเข้าสอบสําเร็จ! แจ้งประธานคณะกรรมการสอบเรียบร้อยแล้ว' : 'Check-in successful! The examination committee chairperson has been notified of your arrival.', 
                          'success'
                        );
                      }}
                      disabled={exam.checkedIn}
                      className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        exam.checkedIn 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {exam.checkedIn 
                        ? (language === 'th' ? 'รายงานตัวและเข้าห้องสอบแล้ว' : 'Checked-In & Present') 
                        : (language === 'th' ? 'รายงานตัวเข้าร่วมสอบ' : 'Verify Present Check-in')}
                    </button>
                  </div>
                </div>

                {/* Committee Panel List */}
                <div className="space-y-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {language === 'th' ? 'รายชื่อคณะกรรมการประเมินผล' : 'Assigned Evaluation Committee'}
                  </span>
                  
                  <div className="space-y-2">
                    {exam.committee.map((member, i) => (
                      <div key={i} className="p-2.5 bg-white border border-slate-100 rounded-xl text-xs text-slate-700 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="font-semibold">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Grading Feedback Results */}
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono text-blue-800 uppercase tracking-wider">
                    {language === 'th' ? 'ผลการประเมินกลางภาควิชาการ (สัดส่วน 70%)' : 'Midterm Assessment Performance (70% weight)'}
                  </span>
                  <span className="text-xs font-extrabold text-blue-700">
                    {language === 'th' ? 'อยู่ระหว่างรอแบบฟอร์มการประเมิน' : 'Awaiting Evaluation Form'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {language === 'th' 
                    ? 'เมื่อผู้ควบคุมงานในสถานประกอบการกรอกแบบประเมินผล 70% ในระบบ คะแนนจะซิงค์มาแสดงที่นี่ทันที ทั้งนี้ อาจารย์ที่ปรึกษาและคณะกรรมการร่วมจะให้คะแนนอีก 30% ในวันสอบปากเปล่านำเสนอผลงานสุดท้าย' 
                    : 'Once your industrial supervisor records the digital 70% evaluation assessment form, the score will sync instantly here. Academic advisors and committee boards provide the remaining 30% grading weight during the final defense presentation.'}
                </p>
              </div>

            </div>
          )}

          {/* SCREEN 8: PROFILE */}
          {activeTab === 'profile' && (
            <div className="w-full bg-white border border-slate-100 p-8 rounded-2xl shadow-xs space-y-6 animate-in fade-in duration-150 text-left">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-extrabold flex items-center justify-center text-xl rounded-2xl shadow-md">
                    {student.name.charAt(0) + (student.name.split(' ')[1]?.charAt(0) || '')}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-sans">{student.name}</h2>
                    <p className="text-xs text-slate-400">{student.major} &bull; {student.academicYear}</p>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setEditForm({
                        name: student.name,
                        email: student.email,
                        major: student.major,
                        gpa: student.gpa.toString(),
                        skills: student.skills.join(', ')
                      });
                      setIsEditingProfile(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 transition-all rounded-lg cursor-pointer"
                  >
                    {language === 'th' ? 'แก้ไขโปรไฟล์' : 'Edit Profile'}
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        {language === 'th' ? 'อีเมล' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        {language === 'th' ? 'สาขาวิชา' : 'Major'}
                      </label>
                      <input
                        type="text"
                        value={editForm.major}
                        onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        {language === 'th' ? 'เกรดเฉลี่ยสะสม (GPA)' : 'Academic GPA'}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.gpa}
                        onChange={(e) => setEditForm({ ...editForm, gpa: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        {language === 'th' ? 'ทักษะทางเทคนิค (พิมพ์แยกด้วยจุลภาค)' : 'Technical Skills (comma-separated list)'}
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {language === 'th' ? 'หรือกดปุ่มเลือกด้านล่าง' : 'Or click tags below to add/remove'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editForm.skills}
                      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                      placeholder="React, TypeScript, Tailwind CSS"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all font-mono"
                    />

                    {/* Predefined skill click tags */}
                    <div className="pt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        {language === 'th' ? 'ทักษะยอดนิยมสำหรับการเลือกด่วน:' : 'Popular Skills Catalog:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-50/60 border border-slate-100 rounded-xl">
                        {[
                          'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 
                          'Python', 'Java', 'Docker', 'Git', 'REST API', 'Firebase', 
                          'HTML5/CSS3', 'Next.js', 'MongoDB', 'AWS', 'Vue.js', 'C++', 'SQL'
                        ].map((skillName) => {
                          const currentArray = editForm.skills
                            ? editForm.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
                            : [];
                          const isSelected = currentArray.includes(skillName.toLowerCase());
                          return (
                            <button
                              key={skillName}
                              type="button"
                              onClick={() => {
                                const arr = editForm.skills
                                  ? editForm.skills.split(',').map(s => s.trim()).filter(Boolean)
                                  : [];
                                const lowerArr = arr.map(s => s.toLowerCase());
                                let updated;
                                if (lowerArr.includes(skillName.toLowerCase())) {
                                  updated = arr.filter(s => s.toLowerCase() !== skillName.toLowerCase());
                                } else {
                                  updated = [...arr, skillName];
                                }
                                setEditForm({ ...editForm, skills: updated.join(', ') });
                              }}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer select-none ${
                                isSelected 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                                  : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {skillName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {language === 'th' ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {language === 'th' ? 'เกรดเฉลี่ยสะสม (GPA):' : 'Academic GPA:'}
                      </span>
                      <span className="font-bold text-slate-800">{student.gpa}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {language === 'th' ? 'รหัสประจำตัวประชาชน/นักศึกษา:' : 'University ID Card:'}
                      </span>
                      <span className="font-semibold text-slate-800">5a7f05ef-7bf6</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {language === 'th' ? 'สถานะการฝึกงาน:' : 'Placement Status:'}
                      </span>
                      <span className="text-emerald-600 font-bold">
                        {language === 'th' ? 'ยืนยันสิทธิ์ & กำลังดำเนินงาน' : 'Confirmed & Active'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {language === 'th' ? 'สาขาวิชา / คณะ:' : 'Department:'}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {language === 'th' ? 'ระบบสารสนเทศคอมพิวเตอร์ (CIS)' : 'Computer Information Systems (CIS)'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {language === 'th' ? 'อีเมลติดต่อ:' : 'Email Contact:'}
                      </span>
                      <span className="font-semibold text-slate-800">{student.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {language === 'th' ? 'กลุ่มทักษะความสามารถหลัก' : 'Primary Skill Stack'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
