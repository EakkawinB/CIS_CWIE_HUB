import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Building2, UserCheck, FileText, Calendar, 
  Settings, UserCircle, LogOut, Search, Plus, SlidersHorizontal, CheckCircle, 
  ArrowUpRight, Download, BarChart3, RefreshCw, Layers, ShieldCheck, Mail, Save, FileSpreadsheet, Trash2, Menu, X 
} from 'lucide-react';
import { 
  MOCK_STUDENTS, MOCK_COMPANIES, MOCK_DOCUMENTS, Student, Company, Document 
} from '../types';
import { useLanguage } from '../LanguageContext';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';

interface StaffPortalProps {
  onNotify: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onLogout: () => void;
}

export default function StaffPortal({ onNotify, onLogout }: StaffPortalProps) {
  const { t, language, setLanguage } = useLanguage();

  // Tabs: 'dashboard' | 'users' | 'companies' | 'matching' | 'documents' | 'examination' | 'reports' | 'settings' | 'profile'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'companies' | 'matching' | 'documents' | 'examination' | 'reports' | 'settings' | 'profile'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Staff profile state
  const [staff, setStaff] = useState({
    name: 'Ms. Patraporn Sukprasert',
    email: 'patraporn.s@appliedsci.kmutnb.ac.th',
    department: 'Department of Applied Computer Information Systems (CIS)',
    faculty: 'Faculty of Applied Science',
    university: 'KMUTNB',
    role: 'Head Coordinator & Operations Officer'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: staff.name,
    email: staff.email,
    department: staff.department,
    role: staff.role
  });

  // Sub-navigation selections inside folders (to map all requested screens)
  const [userSubTab, setUserSubTab] = useState<'students' | 'users'>('students');
  const [companySubTab, setCompanySubTab] = useState<'companies' | 'positions'>('companies');
  const [matchingSubTab, setMatchingSubTab] = useState<'qualifications' | 'candidate-pool' | 'matching-mgmt' | 'advisors'>('matching-mgmt');
  const [docSubTab, setDocSubTab] = useState<'documents' | 'templates'>('documents');
  const [examSubTab, setExamSubTab] = useState<'scheduling' | 'committees' | 'rooms'>('scheduling');

  // Reactive data states
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);

  // Scheduling Generator form state
  const [schedForm, setSchedForm] = useState({
    date: '2026-08-15',
    room: 'Room 604',
    chair: 'Asst. Prof. Dr. Chitsutha Soomlek',
    committee: 'Dr. Wittawat Chantharaphirak'
  });

  // Schedule array
  const [examSchedules, setExamSchedules] = useState([
    { id: 1, studentName: 'Kasidis Phromsorn', date: '2026-08-15', room: 'Room 604', chair: 'Asst. Prof. Dr. Chitsutha Soomlek' }
  ]);

  // Handle generation click
  const handleGenerateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = examSchedules.length + 1;
    const pendingStudent = students.find(s => s.status === 'Confirmed' && !examSchedules.some(ex => ex.studentName === s.name));
    const targetName = pendingStudent ? pendingStudent.name : 'Natapat Kittisukhon';

    setExamSchedules([
      ...examSchedules,
      {
        id: nextId,
        studentName: targetName,
        date: schedForm.date,
        room: schedForm.room,
        chair: schedForm.chair
      }
    ]);
    onNotify(`Examination slots batch generated. Assigned student: ${targetName}.`, 'success');
  };

  const handleExportPDF = () => {
    onNotify('Compiling parameters and exporting matching reports to PDF format...', 'info');
    setTimeout(() => {
      onNotify('Report exported. Saved as "CIS_CWIE_Placement_Report_Q2_2026.pdf"', 'success');
    }, 1200);
  };

  const handleExportEligibleStudents = () => {
    const headers = ['Student ID', 'Name', 'Email', 'Major', 'Academic Year', 'GPA', 'Status'];
    const rows = MOCK_STUDENTS.map(s => [
      s.id,
      s.name,
      s.email,
      s.major,
      s.academicYear,
      s.gpa.toString(),
      s.status
    ]);
    
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KMUTNB_CIS_CWIE_Eligible_Students_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onNotify(language === 'th' ? 'ส่งออกข้อมูลนักศึกษาที่มีสิทธิ์สหกิจศึกษาปี 2026 สำเร็จ!' : 'Exported CWIE Eligible Students for Year 2026 successfully!', 'success');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStaff({
      ...staff,
      name: editForm.name,
      email: editForm.email,
      department: editForm.department,
      role: editForm.role
    });
    setIsEditingProfile(false);
    onNotify(language === 'th' ? 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!' : 'Profile updated successfully!', 'success');
  };

  return (
    <div className="flex min-h-screen bg-slate-50/40 text-slate-800" id="staff-portal-root">
      
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
                { id: 'dashboard', label: language === 'th' ? 'สถิติและแดชบอร์ด' : 'Dashboard Statistics', icon: LayoutDashboard },
                { id: 'users', label: language === 'th' ? 'ผู้ใช้งานและนักศึกษา' : 'Users & Students', icon: Users },
                { id: 'companies', label: language === 'th' ? 'สถานประกอบการและงาน' : 'Companies & Positions', icon: Building2 },
                { id: 'matching', label: language === 'th' ? 'จัดคู่งานและที่ปรึกษา' : 'Matching & Advisors', icon: UserCheck },
                { id: 'documents', label: language === 'th' ? 'เอกสารและเทมเพลต' : 'Documents & Templates', icon: FileText },
                { id: 'examination', label: language === 'th' ? 'คณะกรรมการจัดสอบ' : 'Examination Boards', icon: Calendar },
                { id: 'reports', label: language === 'th' ? 'แดชบอร์ดสรุปรายงาน' : 'Reports Dashboard', icon: BarChart3 },
                { id: 'settings', label: t('system_settings'), icon: Settings },
                { id: 'profile', label: language === 'th' ? 'ตั้งค่าโปรไฟล์' : 'Profile Settings', icon: UserCircle },
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
                  {t('staff_admin')}
                </span>
                <span className="text-xs font-bold text-slate-800 block truncate">{staff.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{staff.email}</span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-1.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
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

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: language === 'th' ? 'สถิติและแดชบอร์ด' : 'Dashboard Statistics', icon: LayoutDashboard },
            { id: 'users', label: language === 'th' ? 'ผู้ใช้งานและนักศึกษา' : 'Users & Students', icon: Users },
            { id: 'companies', label: language === 'th' ? 'สถานประกอบการและงาน' : 'Companies & Positions', icon: Building2 },
            { id: 'matching', label: language === 'th' ? 'จัดคู่งานและที่ปรึกษา' : 'Matching & Advisors', icon: UserCheck },
            { id: 'documents', label: language === 'th' ? 'เอกสารและเทมเพลต' : 'Documents & Templates', icon: FileText },
            { id: 'examination', label: language === 'th' ? 'คณะกรรมการจัดสอบ' : 'Examination Boards', icon: Calendar },
            { id: 'reports', label: language === 'th' ? 'แดชบอร์ดสรุปรายงาน' : 'Reports Dashboard', icon: BarChart3 },
            { id: 'settings', label: t('system_settings'), icon: Settings },
            { id: 'profile', label: language === 'th' ? 'ตั้งค่าโปรไฟล์' : 'Profile Settings', icon: UserCircle },
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

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/50 m-4 rounded-xl">
          <div className="text-left mb-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              {t('staff_admin')}
            </span>
            <span className="text-xs font-bold text-slate-800 block truncate">{staff.name}</span>
            <span className="text-[10px] text-slate-400 block truncate">{staff.email}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-1.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
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
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-left">
              <h1 className="text-sm font-bold text-slate-900 capitalize font-sans leading-tight">
                {language === 'th' ? `แดชบอร์ดฝ่ายจัดการ ${activeTab}` : `${activeTab} Admin Control`}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono leading-none sm:leading-normal">{language === 'th' ? 'หน่วยบริหารจัดการกลาง • ภาควิชา CIS CWIE' : 'Central Management Unit • CIS CWIE Department'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher onNotify={onNotify} />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[10px] font-mono text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              {language === 'th' ? 'ระบบออนไลน์' : 'Live System'}
            </div>
          </div>
        </header>

        {/* Content switch */}
        <div className="flex-1 overflow-y-auto p-8 text-left space-y-6">

          {/* TAB 1: EXECUTIVE DASHBOARD & STATISTICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Stats Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{language === 'th' ? 'อัตราการจัดหาสถานที่ฝึกงาน' : 'Onboarding Placement Rate'}</span>
                  <span className="block text-2xl font-extrabold text-blue-600 mt-1">{language === 'th' ? 'จัดสรรแล้ว 100%' : '100% Placed'}</span>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{language === 'th' ? 'พันธมิตรสถานประกอบการ' : 'Verified Corporate Partners'}</span>
                  <span className="block text-2xl font-extrabold text-slate-900 mt-1">{language === 'th' ? '45 แห่ง' : '45 Employers'}</span>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{language === 'th' ? 'จำนวนนักศึกษาในโครงการ' : 'Active Student Cohort'}</span>
                  <span className="block text-2xl font-extrabold text-indigo-700 mt-1">{language === 'th' ? '320 คน' : '320 Students'}</span>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{language === 'th' ? 'ความถูกต้องของเอกสารระบบ' : 'System Document Audits'}</span>
                  <span className="block text-2xl font-extrabold text-emerald-600 mt-1">{language === 'th' ? 'ผ่านเกณฑ์ 98.2%' : '98.2% Passing'}</span>
                </div>
              </div>

              {/* CWIE Eligibility and Year-by-Year Cohort Card */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 border border-blue-800 rounded-2xl p-6 shadow-md text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5 text-left">
                  <span className="px-2.5 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold rounded-full uppercase tracking-wider inline-block">
                    {language === 'th' ? 'ระบบจัดการข้อมูลผู้มีสิทธิ์โครงการสหกิจ' : 'CWIE Academic Coordinator Desk'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-sans tracking-tight">
                    {language === 'th' ? 'สถิตินักศึกษาผู้มีสิทธิ์สหกิจศึกษาปีการศึกษา 2026' : 'Academic Year 2026 Cohort Stats'}
                  </h3>
                  <p className="text-xs text-blue-200/80 max-w-xl font-sans">
                    {language === 'th' 
                      ? 'ระบบประเมินพบนักศึกษาชั้นปีที่ 4 ที่มีเกรดเฉลี่ยและหน่วยกิตผ่านเกณฑ์ทั้งหมด 320 คน สามารถกดส่งออกข้อมูลเพื่อเตรียมเสนอคณะกรรมการจัดคู่งานได้ทันที' 
                      : 'The system has identified 320 active 4th Year students in CIS & IT meeting CWIE GPA and credit requirements. Export now to draft placements.'
                    }
                  </p>
                </div>
                <button
                  onClick={handleExportEligibleStudents}
                  className="px-4 py-2.5 bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm select-none shrink-0"
                >
                  <Download className="h-4 w-4" />
                  {language === 'th' ? 'ส่งออกข้อมูลสิทธิ์สหกิจ (CSV)' : 'Export Eligibility Data (CSV)'}
                </button>
              </div>

              {/* Charts grid using clean CSS custom SVG charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* SVG Bar Chart */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-1">{language === 'th' ? 'อัตราความสำเร็จในการจับคู่รายสาขาวิชา' : 'Matching success Rate by major'}</h3>
                    <p className="text-xs text-slate-400">{language === 'th' ? 'แสดงข้อมูลการจัดหาสถานที่ฝึกงานในรอบการจับคู่ไตรมาสที่ 2' : 'Illustrating active placements in matching cycle Q2.'}</p>
                  </div>

                  <div className="py-6 flex items-end justify-around gap-6 h-52">
                    {[
                      { code: 'CIS', major: language === 'th' ? 'ระบบสารสนเทศคอมพิวเตอร์' : 'Computer Info Systems', rate: 95, color: 'from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600' },
                      { code: 'SE', major: language === 'th' ? 'วิศวกรรมซอฟต์แวร์' : 'Software Engineering', rate: 85, color: 'from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600' },
                      { code: 'IT', major: language === 'th' ? 'เทคโนโลยีสารสนเทศ' : 'Information Tech', rate: 70, color: 'from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600' },
                      { code: 'DA', major: language === 'th' ? 'วิทยาศาสตร์ข้อมูลและการวิเคราะห์' : 'Data Analytics', rate: 90, color: 'from-sky-600 to-indigo-500 hover:from-sky-700 hover:to-indigo-600' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 max-w-[64px] sm:max-w-[80px]">
                        {/* Interactive SVG Bar */}
                        <div className="w-8 sm:w-12 bg-slate-100 rounded-xl overflow-hidden flex items-end h-32 shadow-inner border border-slate-50">
                          <div 
                            className={`w-full bg-gradient-to-t ${item.color} rounded-b-lg transition-all duration-700 cursor-pointer shadow-xs`}
                            style={{ height: `${item.rate}%` }}
                            title={`${item.major}: ${item.rate}%`}
                          />
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 font-sans tracking-tight mt-1" title={item.major}>
                          {item.code}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold block leading-none text-center truncate w-full" title={item.major}>
                          {item.major}
                        </span>
                        <span className="text-[11px] font-black text-blue-600 font-mono mt-0.5">{item.rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SVG Line / Trend Chart */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-1">{language === 'th' ? 'การส่งรายงานตรงต่อเวลาประจำสัปดาห์' : 'Weekly Submission Compliance'}</h3>
                    <p className="text-xs text-slate-400">{language === 'th' ? 'การอัปโหลดแผ่นลงเวลาและบันทึกประจำวันตรงเวลา สัปดาห์ที่ 1-5' : 'On-time timesheet & diary uploads over weeks 1-5.'}</p>
                  </div>

                  {/* SVG Line Diagram */}
                  <div className="py-4 h-48 relative flex items-center justify-center">
                    <svg viewBox="0 0 400 150" className="w-full h-full">
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="75" x2="400" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Smooth Area curves */}
                      <path 
                        d="M 10 130 Q 100 80, 200 40 T 390 20 L 390 150 L 10 150 Z" 
                        fill="url(#blue-gradient)" 
                        opacity="0.15" 
                      />

                      {/* Line graph path */}
                      <path 
                        d="M 10 130 Q 100 80, 200 40 T 390 20" 
                        fill="none" 
                        stroke="#2563eb" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                      />

                      {/* Indicator circles */}
                      <circle cx="10" cy="130" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="120" cy="72" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="240" cy="35" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="390" cy="20" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

                      {/* Gradients */}
                      <defs>
                        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>{language === 'th' ? 'สัปดาห์ที่ 1' : 'Week 1'}</span>
                      <span>{language === 'th' ? 'สัปดาห์ที่ 2' : 'Week 2'}</span>
                      <span>{language === 'th' ? 'สัปดาห์ที่ 3' : 'Week 3'}</span>
                      <span>{language === 'th' ? 'สัปดาห์ที่ 4' : 'Week 4'}</span>
                      <span>{language === 'th' ? 'สัปดาห์ที่ 5 (ประมาณ)' : 'Week 5 (Est.)'}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: USERS & STUDENTS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Sub navigation folder tabs */}
              <div className="border-b border-slate-100 flex gap-4">
                <button
                  onClick={() => setUserSubTab('students')}
                  className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${userSubTab === 'students' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {language === 'th' ? 'ผู้จัดการรุ่นนักศึกษา' : 'Student Cohorts Manager'}
                </button>
                <button
                  onClick={() => setUserSubTab('users')}
                  className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${userSubTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {language === 'th' ? 'สารบนการเข้าถึงระบบ' : 'System Access Directory'}
                </button>
              </div>

              {/* List View */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 text-sm">{language === 'th' ? 'ระเบียนข้อมูลผู้ใช้งาน' : 'User Database Records'}</h3>
                  <button 
                    onClick={() => onNotify('Direct student registration dialog opened.', 'info')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> {language === 'th' ? 'เพิ่มบัญชีผู้ใช้' : 'Add User Account'}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-2.5 px-3 hidden sm:table-cell">{language === 'th' ? 'รหัสประจำตัว' : 'Unique ID'}</th>
                        <th className="py-2.5 px-3">{language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}</th>
                        <th className="py-2.5 px-3 hidden md:table-cell">{language === 'th' ? 'หลักสูตร / สาขาวิชา' : 'Curriculum / Major'}</th>
                        <th className="py-2.5 px-3 hidden lg:table-cell">{language === 'th' ? 'สิทธิ์การเข้าถึงระบบ' : 'System Clearance'}</th>
                        <th className="py-2.5 px-3 text-right">{language === 'th' ? 'สถานะ' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {students.map((stu) => (
                        <tr key={stu.id} className="hover:bg-slate-50/40">
                          <td className="py-3 px-3 font-mono font-bold text-slate-500 hidden sm:table-cell">{stu.id}</td>
                          <td className="py-3 px-3 font-semibold text-slate-950">{stu.name}</td>
                          <td className="py-3 px-3 text-slate-500 hidden md:table-cell">{stu.major}</td>
                          <td className="py-3 px-3 hidden lg:table-cell">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                              {language === 'th' ? 'นักศึกษา' : 'Student'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              stu.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {language === 'th' ? (stu.status === 'Confirmed' ? 'ยืนยันแล้ว' : 'รอดำเนินการ') : stu.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPANIES & POSITIONS */}
          {activeTab === 'companies' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Folder Tabs */}
              <div className="border-b border-slate-100 flex gap-4">
                <button
                  onClick={() => setCompanySubTab('companies')}
                  className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${companySubTab === 'companies' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {language === 'th' ? 'ทำเนียบพันธมิตรสถานประกอบการ' : 'Corporate Partners Directory'}
                </button>
                <button
                  onClick={() => setCompanySubTab('positions')}
                  className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${companySubTab === 'positions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {language === 'th' ? 'การจัดสรรตำแหน่งงานฝึกงาน' : 'Placement Positions Allocation'}
                </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 text-sm">{language === 'th' ? 'คลังข้อมูลผู้สนับสนุนภาคอุตสาหกรรม' : 'Industrial Sponsor Inventory'}</h3>
                  <button 
                    onClick={() => onNotify('New corporate partner form opened.', 'info')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> {language === 'th' ? 'ลงทะเบียนสถานประกอบการ' : 'Register Employer'}
                  </button>
                </div>

                <div className="space-y-3">
                  {companies.map((comp) => (
                    <div key={comp.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{comp.name}</h4>
                        <p className="text-slate-400 font-medium">{comp.industry}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{language === 'th' ? 'สถานที่ตั้ง:' : 'Location:'} {comp.location}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">{language === 'th' ? 'ตำแหน่งงานว่าง' : 'Active slots'}</span>
                        <span className="font-bold text-blue-600 block">{language === 'th' ? 'ได้รับจัดสรร 3 ตำแหน่ง' : '3 Positions Assigned'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MATCHING & ADVISOR ASSIGNMENT */}
          {activeTab === 'matching' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Subtabs */}
              <div className="border-b border-slate-100 flex gap-4">
                {[
                  { id: 'matching-mgmt', label: language === 'th' ? 'การบริหารจัดการจับคู่' : 'Matching management' },
                  { id: 'qualifications', label: language === 'th' ? 'เกณฑ์คุณสมบัตินักศึกษา' : 'Student qualification rules' },
                  { id: 'candidate-pool', label: language === 'th' ? 'ดัชนีกลุ่มผู้สมัครงาน' : 'Candidate pool indexes' },
                  { id: 'advisors', label: language === 'th' ? 'การมอบหมายอาจารย์นิเทศ' : 'Advisor allocation assignment' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setMatchingSubTab(sub.id as any)}
                    className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${matchingSubTab === sub.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Subtab Contents mapping */}
              {matchingSubTab === 'matching-mgmt' && (
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{language === 'th' ? 'กระดานจัดคู่เข้าฝึกงาน' : 'Onboarding Matching board'}</h3>
                      <p className="text-xs text-slate-400">{language === 'th' ? 'ส่งมอบโอกาสงานฝึกงานที่จับคู่สำเร็จไปยังนักศึกษา' : 'Dispatch matched placement opportunities to students.'}</p>
                    </div>
                    <button 
                      onClick={() => onNotify('Auto-matcher heuristic completed matching for 2 leftover candidates.', 'success')}
                      className="px-3.5 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold rounded-xl"
                    >
                      {language === 'th' ? 'เรียกใช้ระบบสุ่มจับคู่อัตโนมัติ' : 'Trigger Auto-Matcher Heuristics'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {students.map((stu) => (
                      <div key={stu.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block uppercase">{language === 'th' ? 'ผู้สมัคร' : 'Candidate'}</span>
                          <h4 className="font-bold text-slate-950">{stu.name} ({stu.id})</h4>
                          <p className="text-slate-500">{language === 'th' ? 'สาขาวิชา:' : 'Major:'} {stu.major} &bull; GPA: {stu.gpa}</p>
                        </div>

                        <div className="text-right flex items-center gap-4">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'สถานประกอบการที่ได้รับจัดสรร' : 'Assigned Partner'}</span>
                            <span className="font-semibold text-slate-800">
                              {stu.companyId === 'COMP01' ? 'NexaTech Solutions' : stu.companyId === 'COMP02' ? 'Linear Digital' : (language === 'th' ? 'กลุ่มที่ยังไม่ได้รับการจัดคู่' : 'Unassigned Pool')}
                            </span>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            stu.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {language === 'th' ? (stu.status === 'Confirmed' ? 'ยืนยันแล้ว' : 'รอดำเนินการ') : stu.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingSubTab === 'qualifications' && (
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4 max-w-xl">
                  <h3 className="font-bold text-slate-900 text-sm">{language === 'th' ? 'เกณฑ์คุณสมบัติตามหลักการสหกิจศึกษา (CWIE)' : 'Academic CWIE Qualification Criteria'}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'th' ? 'ตั้งค่าคะแนนเกรดเฉลี่ยสะสมขั้นต่ำและตัวกรองหลักสูตรเพื่อกรองผู้สมัครในสถานประกอบการโดยอัตโนมัติ' : 'Set academic GPA and curriculum filters to auto-restrict student registration pool on corporate positions.'}
                  </p>
                  
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span>{language === 'th' ? 'เกณฑ์คะแนนเฉลี่ยสะสมสะสม (GPAX) ขั้นต่ำ' : 'Minimum Placement GPA Criteria'}</span>
                      <span className="font-mono font-bold text-blue-600">&gt;= 2.50 {language === 'th' ? 'เกรดเฉลี่ย' : 'GPA'}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span>{language === 'th' ? 'จำนวนหน่วยกิตที่เรียนผ่านแล้ว' : 'Completed Credit Units'}</span>
                      <span className="font-mono font-bold text-blue-600">&gt;= 90 {language === 'th' ? 'หน่วยกิต' : 'units'}</span>
                    </div>
                  </div>
                </div>
              )}

              {matchingSubTab === 'candidate-pool' && (
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-xs text-slate-500">
                  {language === 'th' ? 'ระบบจัดเก็บดัชนีกลุ่มผู้สมัครประกอบด้วยประวัติย่อ (CV), แฟ้มสะสมผลงาน และบันทึกผลการศึกษาที่เป็นปัจจุบัน ซึ่งจัดเรียงตามคะแนนความสามารถเชิงเทคนิค ท่านสามารถใช้แถบค้นหาในเมนูผู้ใช้เพื่อเรียกดูข้อมูลได้' : 'Candidate pool indices contain active CVs, resume portfolios, and academic registries sorted by technical scores. Use search bar inside Users panel to query indices.'}
                </div>
              )}

              {matchingSubTab === 'advisors' && (
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">{language === 'th' ? 'การจัดสรรอาจารย์ที่ปรึกษาสหกิจ' : 'Academic Advisor Allocations'}</h3>
                  <p className="text-xs text-slate-400">{language === 'th' ? 'จัดสรรนักศึกษาไปยังอาจารย์ที่ปรึกษาเพื่อควบคุมดูแลและติดตามการเยี่ยมชมสถานประกอบการ' : 'Allocate students to academic supervisors to monitor site visits.'}</p>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-950">Kasidis Phromsorn</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{language === 'th' ? 'อาจารย์ที่ปรึกษาที่ดูแล:' : 'Assigned Advisor:'} Dr. Somchai Srisuwan</p>
                      </div>
                      <button 
                        onClick={() => onNotify('Reallocation dropdown opened.', 'info')}
                        className="px-2 py-1 bg-white border border-slate-200 text-slate-600 font-semibold rounded hover:bg-slate-100"
                      >
                        {language === 'th' ? 'จัดสรรใหม่' : 'Re-allocate'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: DOCUMENTS & TEMPLATE MANAGEMENT */}
          {activeTab === 'documents' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Folder Tabs */}
              <div className="border-b border-slate-100 flex gap-4">
                <button
                  onClick={() => setDocSubTab('documents')}
                  className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${docSubTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {language === 'th' ? 'การตรวจสอบเอกสารนักศึกษา' : 'Student Documents Audit'}
                </button>
                <button
                  onClick={() => setDocSubTab('templates')}
                  className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${docSubTab === 'templates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {language === 'th' ? 'คลังแม่แบบเอกสารของระบบ' : 'System Template Repository'}
                </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 text-sm">{language === 'th' ? 'ทะเบียนเอกสารสถาบัน' : 'Institutional Document Registries'}</h3>
                  <button 
                    onClick={handleExportPDF}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="h-4 w-4" /> {language === 'th' ? 'ส่งออกบัญชีรายชื่อ CSV/PDF' : 'Export CSV/PDF Roster'}
                  </button>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4 text-xs text-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900">{doc.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block">{language === 'th' ? 'หมวดหมู่เอกสาร:' : 'Category:'} {doc.category}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        doc.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700 animate-pulse'
                      }`}>
                        {language === 'th' ? (doc.status === 'Approved' ? 'อนุมัติแล้ว' : 'รอตรวจสอบ') : doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EXAMINATION SCHEDULE & COMMITTEE GENERATOR */}
          {activeTab === 'examination' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-150 text-left">
              
              {/* Batch generator form */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{language === 'th' ? 'ระบบช่วยจัดตารางสอบประเมินผล' : 'Batch Examination Generator'}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{language === 'th' ? 'จัดสรรลำดับการนำเสนอสอบ บัญชีคณะกรรมการ และห้องสอบอย่างสะดวกรวดเร็ว' : 'Quickly allocate defenses, board seats, and rooms.'}</p>
                </div>

                <form onSubmit={handleGenerateSchedule} className="space-y-4 text-xs text-slate-700">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{language === 'th' ? 'ห้องสอบ/สถานที่' : 'Target Room Venue'}</label>
                    <input 
                      type="text" 
                      required
                      value={schedForm.room}
                      onChange={(e) => setSchedForm({ ...schedForm, room: e.target.value })}
                      placeholder="e.g. Advanced Computing Lab"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{language === 'th' ? 'วันที่สอบป้องกัน' : 'Defense Target Date'}</label>
                    <input 
                      type="date" 
                      required
                      value={schedForm.date}
                      onChange={(e) => setSchedForm({ ...schedForm, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{language === 'th' ? 'ประธานคณะกรรมการจัดสอบ' : 'Committee Chairperson'}</label>
                    <input 
                      type="text" 
                      required
                      value={schedForm.chair}
                      onChange={(e) => setSchedForm({ ...schedForm, chair: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    {language === 'th' ? 'สร้างตารางสอบคณะกรรมการ' : 'Generate Board Schedules'}
                  </button>
                </form>
              </div>

              {/* Schedules view list */}
              <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{language === 'th' ? 'ตารางการสอบป้องกันสหกิจศึกษาที่สร้างขึ้น' : 'Generated Defenses Schedules'}</h3>
                
                <div className="space-y-3">
                  {examSchedules.map((ex) => (
                    <div key={ex.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{ex.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: #{ex.id}</span>
                      </div>
                      <p className="text-slate-500">{language === 'th' ? 'ประธานคณะกรรมการ:' : 'Board Chairperson:'} <b>{ex.chair}</b></p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>{language === 'th' ? 'ห้องสอบ:' : 'Venue:'} {ex.room}</span>
                        <span>{language === 'th' ? 'วันที่:' : 'Date:'} {ex.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: REPORTS & ANALYTICS */}
          {activeTab === 'reports' && (
            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-xs text-left animate-in fade-in duration-150 space-y-4 max-w-xl">
              <h2 className="text-base font-bold text-slate-900">{language === 'th' ? 'แดชบอร์ดรายงานการวิเคราะห์และส่งออกข้อมูล' : 'Reports, Exports & Analytics Dashboard'}</h2>
              <p className="text-xs text-slate-400">{language === 'th' ? 'ดาวน์โหลดฐานข้อมูลรายงานเชิงลึกเพื่อการประเมินและทบทวนโครงการสหกิจศึกษา' : 'Download complete analytical databases for cooperative education reviews.'}</p>
              
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleExportPDF}
                  className="w-full p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs font-semibold flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-slate-900">{language === 'th' ? 'สรุปรายงานผลการฝึกงานไตรมาส 2 (PDF)' : 'Q2 Placement Outcomes Summary (PDF)'}</h4>
                    <span className="text-[10px] text-slate-400 font-normal">{language === 'th' ? 'รวมข้อมูลเกรดเฉลี่ยผลรวมและการประเมินนักศึกษาขั้นสุดท้าย' : 'Includes final student grading aggregates.'}</span>
                  </div>
                  <Download className="h-5 w-5 text-blue-600 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    onNotify('Compiling CSV dataset for system audit log...', 'info');
                    setTimeout(() => {
                      onNotify('Raw CSV download initialized.', 'success');
                    }, 1000);
                  }}
                  className="w-full p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs font-semibold flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-slate-900">{language === 'th' ? 'ข้อมูลบันทึกประวัติการจับคู่งานดิบ (CSV)' : 'Raw Placement Audit logs (CSV)'}</h4>
                    <span className="text-[10px] text-slate-400 font-normal">{language === 'th' ? 'ข้อมูลเวลาทำงานดิบ แผ่นลงเวลา และบันทึกผลสะท้อนกลับทั้งหมด' : 'Raw clocking entries, timesheets, and feedback logs.'}</span>
                  </div>
                  <FileSpreadsheet className="h-5 w-5 text-blue-600 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-xs text-left animate-in fade-in duration-150 space-y-6 w-full">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">{language === 'th' ? 'พารามิเตอร์การตั้งค่าระบบ' : 'System Parameters'}</h2>
                <p className="text-xs text-slate-400">{language === 'th' ? 'แก้ไขพารามิเตอร์ส่วนกลางของระบบการจัดการสหกิจศึกษา' : 'Modify global parameters for the cooperative system.'}</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); onNotify(language === 'th' ? 'บันทึกการตั้งค่าระบบเรียบร้อยแล้ว' : 'System settings successfully stored.', 'success'); }} className="space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">{language === 'th' ? 'ปีการศึกษา/ภาคการศึกษาที่เปิดใช้งาน' : 'Active Academic Term'}</label>
                    <input type="text" defaultValue={language === 'th' ? 'ภาคการศึกษาที่ 1/2569' : 'Semester 1/2026'} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">{language === 'th' ? 'เวลาปิดระบบลงเวลาปกติ' : 'Default Log Lock Hour'}</label>
                    <input type="text" defaultValue={language === 'th' ? 'วันศุกร์ เวลา 17:00 น.' : 'Friday, 17:00'} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl" />
                  </div>
                </div>

                <button type="submit" className="w-full py-2 bg-blue-600 text-white font-semibold rounded-xl">
                  {language === 'th' ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 9: PROFILE */}
          {activeTab === 'profile' && (
            <div className="w-full bg-white border border-slate-100 p-8 rounded-2xl shadow-xs text-left animate-in fade-in duration-150 space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-800 text-white font-extrabold flex items-center justify-center text-xl rounded-2xl">
                    {staff.name.split(' ').pop()?.charAt(0) || 'CS'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-sans">{staff.name}</h2>
                    <p className="text-xs text-slate-400">{staff.role}</p>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setEditForm({
                        name: staff.name,
                        email: staff.email,
                        department: staff.department,
                        role: staff.role
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
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                      {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                      {language === 'th' ? 'ตำแหน่ง/บทบาท' : 'Title / Role'}
                    </label>
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                      {language === 'th' ? 'แผนก/สาขาวิชา' : 'Department'}
                    </label>
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
                <div className="space-y-3 text-xs text-slate-600 font-sans">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'ภาควิชา/สาขาวิชาที่สังกัด:' : 'Affiliation:'}</span>
                    <span className="font-bold text-slate-800">{staff.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'คณะ / มหาวิทยาลัย:' : 'Faculty / University:'}</span>
                    <span className="font-semibold text-slate-800">{staff.faculty} ({staff.university})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'ที่อยู่อีเมลติดต่อ:' : 'Email Address:'}</span>
                    <span className="font-semibold text-slate-800">{staff.email}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                    {language === 'th' ? 'มีหน้าที่รับผิดชอบบริหารจัดการตารางกรรมการนำเสนอสอบปากเปล่า การพิจารณาของคณะกรรมการ การจัดสรรตำแหน่งงาน และค่าพารามิเตอร์การตั้งค่าส่วนกลางของระบบ' : 'Manages final defense presentation boards, committee reviews, corporate slots allocations, and system settings parameters.'}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
