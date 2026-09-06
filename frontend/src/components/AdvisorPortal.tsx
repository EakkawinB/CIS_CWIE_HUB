import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Calendar, Award, User, Bell, 
  Search, CheckCircle, Clock, AlertCircle, MessageSquare, Plus, Save, CalendarDays, Check, Menu, X 
} from 'lucide-react';
import { 
  MOCK_STUDENTS, MOCK_REPORTS, Student, WeeklyReport 
} from '../types';
import { useLanguage } from '../LanguageContext';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';

interface AdvisorPortalProps {
  onNotify: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onLogout: () => void;
}

export default function AdvisorPortal({ onNotify, onLogout }: AdvisorPortalProps) {
  const { t, language, setLanguage } = useLanguage();

  // Tabs: 'dashboard' | 'students' | 'reports' | 'supervision' | 'evaluation' | 'profile'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'reports' | 'supervision' | 'evaluation' | 'profile'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Advisor Profile State
  const [advisor, setAdvisor] = useState({
    name: 'Dr. Somchai Srisuwan',
    email: 'somchai.s@university.edu',
    title: 'Associate Professor of Computer Information Systems • Senior Advisor',
    department: 'Computer Information Systems',
    credentials: 'Ph.D in Distributed Software Architectures, KMUTNB.'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: advisor.name,
    email: advisor.email,
    title: advisor.title,
    department: advisor.department,
    credentials: advisor.credentials
  });
  
  // Data State
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [reports, setReports] = useState<WeeklyReport[]>(MOCK_REPORTS);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(MOCK_STUDENTS[0]);

  // Visit booking state
  const [bookings, setBookings] = useState([
    { id: 1, studentName: 'Kasidis Phromsorn', company: 'NexaTech Solutions', date: '2026-07-25', time: '13:30', status: 'Confirmed' }
  ]);
  const [newBooking, setNewBooking] = useState({ studentId: 'STU001', date: '2026-07-29', time: '10:00' });

  // Evaluation Form state
  const [evaluation, setEvaluation] = useState({
    studentId: 'STU001',
    academicPresentation: 15, // max 20
    technicalReport: 20, // max 30
    overallCompetence: 40, // max 50
    comments: ''
  });

  // Report review handlers
  const handleApproveReport = (reportId: string, comment: string) => {
    setReports(reports.map(rep => {
      if (rep.id === reportId) {
        return { ...rep, status: 'Approved', advisorComment: comment };
      }
      return rep;
    }));
    onNotify('Weekly report approved and recorded.', 'success');
  };

  const handleRejectReport = (reportId: string, comment: string) => {
    setReports(reports.map(rep => {
      if (rep.id === reportId) {
        return { ...rep, status: 'Requires Edit', advisorComment: comment };
      }
      return rep;
    }));
    onNotify('Report flagged for editing. Student has been notified.', 'warning');
  };

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const stu = students.find(s => s.id === newBooking.studentId);
    if (!stu) return;

    setBookings([
      ...bookings,
      {
        id: bookings.length + 1,
        studentName: stu.name,
        company: stu.companyId === 'COMP01' ? 'NexaTech Solutions' : stu.companyId === 'COMP02' ? 'Linear Digital' : 'Vortex Studio',
        date: newBooking.date,
        time: newBooking.time,
        status: 'Confirmed'
      }
    ]);
    onNotify(`Supervision visit successfully scheduled for ${stu.name}.`, 'success');
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const totalScore = Number(evaluation.academicPresentation) + Number(evaluation.technicalReport) + Number(evaluation.overallCompetence);
    onNotify(`Evaluation saved! Combined Academic Score: ${totalScore}/100. Recorded to final grade matrix.`, 'success');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvisor({
      ...advisor,
      name: editForm.name,
      email: editForm.email,
      title: editForm.title,
      department: editForm.department,
      credentials: editForm.credentials
    });
    setIsEditingProfile(false);
    onNotify(language === 'th' ? 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!' : 'Profile updated successfully!', 'success');
  };

  return (
    <div className="flex min-h-screen bg-slate-50/40 text-slate-800" id="advisor-portal-root">
      
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
                { id: 'students', label: language === 'th' ? 'นักศึกษาในการดูแล' : 'Students Overview', icon: Users },
                { id: 'reports', label: language === 'th' ? 'ตรวจรายงานประจำสัปดาห์' : 'Weekly Reports Review', icon: BookOpen },
                { id: 'supervision', label: t('supervision'), icon: Calendar },
                { id: 'evaluation', label: t('evaluation'), icon: Award },
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
                        ? 'bg-blue-800 text-white shadow-xs' 
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
                  {t('academic_advisor')}
                </span>
                <span className="text-xs font-bold text-slate-800 block truncate">{advisor.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{advisor.email}</span>
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
            { id: 'students', label: language === 'th' ? 'นักศึกษาในการดูแล' : 'Students Overview', icon: Users },
            { id: 'reports', label: language === 'th' ? 'ตรวจรายงานประจำสัปดาห์' : 'Weekly Reports Review', icon: BookOpen },
            { id: 'supervision', label: t('supervision'), icon: Calendar },
            { id: 'evaluation', label: t('evaluation'), icon: Award },
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
                    ? 'bg-blue-800 text-white shadow-xs' 
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
              {t('academic_advisor')}
            </span>
            <span className="text-xs font-bold text-slate-800 block truncate">{advisor.name}</span>
            <span className="text-[10px] text-slate-400 block truncate">{advisor.email}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-1.5 border border-slate-200 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold rounded-lg cursor-pointer"
          >
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
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
                {language === 'th' ? `พอร์ทัล ${activeTab}` : `${activeTab} Hub`}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono leading-none sm:leading-normal">Academic Advisor Board &bull; Department of CIS</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher onNotify={onNotify} />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('active_supervisor')}
            </div>
            <button className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg relative cursor-pointer">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>
          </div>
        </header>

        {/* Content switchboard */}
        <div className="flex-1 overflow-y-auto p-8 text-left space-y-6">

          {/* VIEW 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Stats Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    {language === 'th' ? 'นักศึกษาในการดูแล' : 'Assigned Students'}
                  </span>
                  <span className="block text-2xl font-extrabold text-slate-900 mt-1">
                    {language === 'th' ? '4 คน' : '4 Students'}
                  </span>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    {language === 'th' ? 'รายงานรอตรวจ' : 'Pending Diaries'}
                  </span>
                  <span className="block text-2xl font-extrabold text-blue-600 mt-1">
                    {reports.filter(r => r.status === 'Pending').length} {language === 'th' ? 'รายงาน' : 'Reports'}
                  </span>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    {language === 'th' ? 'ตารางนิเทศงาน' : 'Scheduled Visits'}
                  </span>
                  <span className="block text-2xl font-extrabold text-indigo-700 mt-1">
                    {language === 'th' ? '1 นัดหมายยืนยัน' : '1 Confirmed'}
                  </span>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    {language === 'th' ? 'บันทึกคะแนนประเมิน' : 'Grading Recorded'}
                  </span>
                  <span className="block text-2xl font-extrabold text-emerald-600 mt-1">
                    {language === 'th' ? 'สำเร็จ 2 / 4 คน' : '2 / 4 Completed'}
                  </span>
                </div>
              </div>

              {/* Supervision alerts */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'th' ? 'รายการด่วนที่ต้องดำเนินการ' : 'Action Required Alerts'}
                </h3>
                
                <div className="space-y-2.5">
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                      <span>
                        {language === 'th' 
                          ? <>นักศึกษา <b>ณัฐภัทร กิตติสุคนธ์</b> มีรายงานความคืบหน้าสัปดาห์ที่ 3 รอตรวจ</>
                          : <>Student <b>Natapat Kittisukhon</b> has a pending Weekly Progress Log for Week 3.</>}
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('reports')} 
                      className="px-2.5 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      {language === 'th' ? 'ตรวจรายงาน' : 'Review Log'}
                    </button>
                  </div>

                  <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                      <span>
                        {language === 'th'
                          ? <>แบบประเมินผลสัมฤทธิ์ปลายภาคเรียนสหกิจศึกษา ของนักศึกษา <b>กษิดิศ</b> รอรับการประเมิน</>
                          : <>Cooperative placement final evaluation form needs completion for student <b>Kasidis</b>.</>}
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('evaluation')}
                      className="px-2.5 py-1 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 cursor-pointer"
                    >
                      {language === 'th' ? 'กรอกแบบฟอร์ม' : 'Fill Form'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: STUDENTS OVERVIEW & DETAIL */}
          {activeTab === 'students' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-150">
              
              {/* Data Table Column */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-900">{language === 'th' ? 'รายชื่อนักศึกษาในการดูแล' : 'Assigned Student Roster'}</h3>
                  <p className="text-xs text-slate-400">{language === 'th' ? 'ตรวจสอบสถิติการทำงานจริงและคะแนนเฉลี่ยสะสม (GPA)' : 'Review real-time placement stats and GPA scores.'}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-2.5 px-3">{language === 'th' ? 'ชื่อนักศึกษา' : 'Student Name'}</th>
                        <th className="py-2.5 px-3 hidden sm:table-cell">{language === 'th' ? 'สาขาวิชา' : 'Major'}</th>
                        <th className="py-2.5 px-3 hidden sm:table-cell">{language === 'th' ? 'เกรดเฉลี่ย' : 'GPA'}</th>
                        <th className="py-2.5 px-3 text-right">{language === 'th' ? 'ความคืบหน้า' : 'Progress'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {students.map((stu) => (
                        <tr 
                          key={stu.id} 
                          onClick={() => setSelectedStudent(stu)}
                          className={`cursor-pointer transition-colors ${selectedStudent?.id === stu.id ? 'bg-blue-50/40 font-medium' : 'hover:bg-slate-50/50'}`}
                        >
                          <td className="py-3 px-3 text-slate-950 font-semibold">{stu.name}</td>
                          <td className="py-3 px-3 text-slate-500 hidden sm:table-cell">{stu.major}</td>
                          <td className="py-3 px-3 font-mono text-slate-500 hidden sm:table-cell">{stu.gpa}</td>
                          <td className="py-3 px-3 text-right">
                            <span className="font-mono font-bold text-blue-600">{stu.progress}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Student Detail Panel */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-4">
                {selectedStudent ? (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-slate-100">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{language === 'th' ? 'ข้อมูลโปรไฟล์นักศึกษา' : 'Student Profiler'}</span>
                      <h4 className="text-sm font-bold text-slate-950 mt-1">{selectedStudent.name}</h4>
                      <p className="text-xs text-slate-400">{selectedStudent.email}</p>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'ปีการศึกษา:' : 'Academic year:'}</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.academicYear}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'สถานประกอบการที่ได้รับจัดสรร:' : 'Affiliated Company:'}</span>
                        <span className="font-bold text-blue-600">
                          {selectedStudent.companyId === 'COMP01' ? 'NexaTech Solutions' : selectedStudent.companyId === 'COMP02' ? 'Linear Digital' : 'Vortex Studio'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'ความคืบหน้าการทำงาน/เริ่มงาน:' : 'onboarding progress:'}</span>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${selectedStudent.progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">{language === 'th' ? 'ดัชนีทักษะความสามารถ' : 'Skills Index'}</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedStudent.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8">{language === 'th' ? 'กรุณาเลือกเรคคอร์ดนักศึกษาเพื่อขยายรายละเอียดข้อมูลส่วนตัว' : 'Select a student record to expand profile metadata.'}</p>
                )}
              </div>

            </div>
          )}

          {/* VIEW 3: WEEKLY REPORTS REVIEW */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-150 text-left">
              
              {/* Reports list */}
              <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{language === 'th' ? 'รายงานบันทึกสรุปผลที่รอการอนุมัติ' : 'Awaiting Diary Approvals'}</h3>
                
                <div className="space-y-4">
                  {reports.map((rep) => (
                    <div key={rep.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{language === 'th' ? 'นักศึกษา:' : 'Student:'} {students.find(s => s.id === rep.studentId)?.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">{language === 'th' ? `สัปดาห์ที่ ${rep.weekNumber}` : `Week ${rep.weekNumber}`} &bull; {language === 'th' ? `เวลาทำงาน: ${rep.hoursWorked} ชม.` : `Work Hours: ${rep.hoursWorked} hrs`}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          rep.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700 animate-pulse'
                        }`}>
                          {language === 'th' ? (rep.status === 'Approved' ? 'อนุมัติแล้ว' : 'รอดำเนินการ') : rep.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">{rep.summary}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                        <div>
                          <b>{language === 'th' ? 'ผลงานความสำเร็จหลัก:' : 'Key Achievements:'}</b>
                          <p className="line-clamp-2 italic">"{rep.achievements || (language === 'th' ? 'ไม่ได้บันทึกไว้' : 'None recorded')}"</p>
                        </div>
                        <div>
                          <b>{language === 'th' ? 'อุปสรรคปัญหาที่พบ:' : 'Key Obstacles:'}</b>
                          <p className="line-clamp-2 italic">"{rep.obstacles || (language === 'th' ? 'ไม่ได้บันทึกไว้' : 'None recorded')}"</p>
                        </div>
                      </div>

                      {/* Comment section inside each report card */}
                      {rep.status === 'Pending' && (
                        <div className="pt-3 border-t border-slate-200 space-y-2">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">{language === 'th' ? 'ส่งความเห็นและข้อเสนอแนะในการตรวจ' : 'Submit Review Comments'}</label>
                          <input 
                            type="text" 
                            id={`comment-input-${rep.id}`}
                            placeholder={language === 'th' ? 'ให้ข้อเสนอแนะหรือบันทึกแก่นักศึกษา...' : 'Provide feedback or notes to student...'}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                const input = document.getElementById(`comment-input-${rep.id}`) as HTMLInputElement;
                                handleRejectReport(rep.id, input?.value || 'Requires revision');
                              }}
                              className="px-2.5 py-1 text-[10px] font-semibold text-rose-600 bg-rose-50 rounded"
                            >
                              {language === 'th' ? 'ต้องการการแก้ไข' : 'Requires Edit'}
                            </button>
                            <button
                              onClick={() => {
                                const input = document.getElementById(`comment-input-${rep.id}`) as HTMLInputElement;
                                handleApproveReport(rep.id, input?.value || 'Excellent work logged.');
                              }}
                              className="px-2.5 py-1 text-[10px] font-semibold text-white bg-blue-600 rounded"
                            >
                              {language === 'th' ? 'อนุมัติบันทึก' : 'Approve Log'}
                            </button>
                          </div>
                        </div>
                      )}

                      {rep.advisorComment && (
                        <p className="text-[10px] text-blue-800 bg-blue-50 p-2 rounded">
                          <b>{language === 'th' ? 'ความเห็นที่บันทึกของคุณ:' : 'Your Saved Comment:'}</b> "{rep.advisorComment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Guidelines panel */}
              <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{language === 'th' ? 'เกณฑ์การให้คะแนนและคำแนะนำ' : 'Advisor Rubrics'}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'th' 
                    ? <>อาจารย์ที่ปรึกษาจำเป็นต้องตรวจสอบรายงานบันทึกสรุปประจำสัปดาห์ของนักศึกษา เพื่อให้สอดคล้องกับแนวทางทางวิชาการและสหกิจศึกษา หากรายงานมีความกระชับเกินไปหรือขาดรายละเอียดทางเทคนิค กรุณาตั้งสถานะเป็น <b>ต้องการการแก้ไข (Requires Edit)</b> และพิมพ์เสนอแนะเพื่อพัฒนาแก่นักศึกษา</>
                    : <>Advisors must review student logs weekly to ensure alignment with institutional scientific guidelines. If summaries are brief or lack technical specificity, flag the record as <b>Requires Edit</b> and insert developmental feedback comments.</>
                  }
                </p>
              </div>

            </div>
          )}

          {/* VIEW 4: SUPERVISION Visit Booking */}
          {activeTab === 'supervision' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-150 text-left">
              
              {/* Form & Bookings list */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{language === 'th' ? 'กำหนดตารางวันเข้าเยี่ยมนิเทศงาน' : 'Schedule Supervision Visit'}</h3>
                  <p className="text-xs text-slate-400">{language === 'th' ? 'ระบุวันและเวลาเป้าหมายสำหรับการเข้าเยี่ยมนิเทศงาน ณ สถานประกอบการ' : 'Submit date/time parameters for on-site employer audits.'}</p>
                </div>

                <form onSubmit={handleBookVisit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 mb-1">{language === 'th' ? 'เลือกนักศึกษา' : 'Select Student'}</label>
                    <select
                      value={newBooking.studentId}
                      onChange={(e) => setNewBooking({ ...newBooking, studentId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl outline-none"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 mb-1">{language === 'th' ? 'วันที่เข้าเยี่ยมนิเทศงาน' : 'Visit Date'}</label>
                      <input 
                        type="date" 
                        value={newBooking.date}
                        onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 mb-1">{language === 'th' ? 'ช่วงเวลาปฏิบัติงาน' : 'Timeblock'}</label>
                      <input 
                        type="time" 
                        value={newBooking.time}
                        onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl"
                  >
                    {language === 'th' ? 'ยืนยันกำหนดเวลานิเทศงาน' : 'Schedule Audit Visit'}
                  </button>
                </form>
              </div>

              {/* Bookings List */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{language === 'th' ? 'ตารางเวลานิเทศงานที่ได้รับการยืนยันแล้ว' : 'Confirmed Schedules'}</h3>
                
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{b.studentName}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-slate-500">{language === 'th' ? 'สถานที่:' : 'Venue:'} <b>{b.company}</b></p>
                      <p className="text-[10px] text-slate-400 font-mono">{language === 'th' ? 'วันที่:' : 'Date:'} {b.date} {language === 'th' ? 'เวลา:' : 'at'} {b.time}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEW 5: EVALUATION FORM */}
          {activeTab === 'evaluation' && (
            <div className="max-w-xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs text-left animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-base font-bold text-slate-900">{language === 'th' ? 'แบบฟอร์มการประเมินคะแนนวิชาการ (30%)' : 'Academic Grading Evaluation Form (30%)'}</h2>
                <p className="text-xs text-slate-400">{language === 'th' ? 'ประเมินสไลด์การนำเสนอ ความถูกต้องทางเทคนิค และรายงานโครงงานสหกิจศึกษา' : 'Rate student presentation slides, technical accuracy, and academic reports.'}</p>
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-5 text-xs text-slate-700">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">{language === 'th' ? 'บันทึกข้อมูลนักศึกษาที่เป็นเป้าหมาย' : 'Target Student Record'}</label>
                  <select
                    value={evaluation.studentId}
                    onChange={(e) => setEvaluation({ ...evaluation, studentId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl outline-none"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold">{language === 'th' ? 'คุณภาพสไลด์ทางวิชาการและลีลาการนำเสนอ (คะแนนเต็ม 20)' : 'Academic Slides & Presentation Quality (max 20)'}</label>
                      <span className="font-mono font-bold text-blue-600">{evaluation.academicPresentation} pts</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={evaluation.academicPresentation}
                      onChange={(e) => setEvaluation({ ...evaluation, academicPresentation: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold">{language === 'th' ? 'ความถูกต้องและสมบูรณ์ของรายงานวิชาการ (คะแนนเต็ม 30)' : 'Written Technical report Accuracy (max 30)'}</label>
                      <span className="font-mono font-bold text-blue-600">{evaluation.technicalReport} pts</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={evaluation.technicalReport}
                      onChange={(e) => setEvaluation({ ...evaluation, technicalReport: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold">{language === 'th' ? 'สมรรถนะและความเหมาะสมการทำงานสหกิจโดยรวม (คะแนนเต็ม 50)' : 'Overall Cooperative Competence (max 50)'}</label>
                      <span className="font-mono font-bold text-blue-600">{evaluation.overallCompetence} pts</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={evaluation.overallCompetence}
                      onChange={(e) => setEvaluation({ ...evaluation, overallCompetence: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1">{language === 'th' ? 'ความเห็นและข้อเสนอแนะของผู้ประเมินผล' : 'Assessor Review Feedback Comments'}</label>
                  <textarea
                    rows={3}
                    placeholder="Provide academic defense highlights and critique remarks..."
                    value={evaluation.comments}
                    onChange={(e) => setEvaluation({ ...evaluation, comments: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {language === 'th' ? 'บันทึกและล็อกคะแนนประเมินอย่างเป็นทางการ' : 'Lock & Record Grading Scheme'}
                </button>
              </form>
            </div>
          )}

          {/* VIEW 6: PROFILE */}
          {activeTab === 'profile' && (
            <div className="w-full bg-white border border-slate-100 p-8 rounded-2xl shadow-xs text-left animate-in fade-in duration-150 space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-tr from-blue-800 to-indigo-900 text-white font-extrabold flex items-center justify-center text-xl rounded-2xl">
                    {advisor.name.split(' ').pop()?.charAt(0) || 'DS'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-sans">{advisor.name}</h2>
                    <p className="text-xs text-slate-400">{advisor.title}</p>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setEditForm({
                        name: advisor.name,
                        email: advisor.email,
                        title: advisor.title,
                        department: advisor.department,
                        credentials: advisor.credentials
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
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        {language === 'th' ? 'สาขา/ภาควิชา' : 'Department'}
                      </label>
                      <input
                        type="text"
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                        {language === 'th' ? 'วุฒิการศึกษา/ประวัติ' : 'Credentials'}
                      </label>
                      <input
                        type="text"
                        value={editForm.credentials}
                        onChange={(e) => setEditForm({ ...editForm, credentials: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                      />
                    </div>
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
                <div className="space-y-3 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'สาขาวิชา/ภาควิชาที่สังกัด:' : 'Assigned department:'}</span>
                    <span className="font-semibold text-slate-800">{advisor.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'ที่อยู่อีเมล:' : 'Email Address:'}</span>
                    <span className="font-semibold text-slate-800">{advisor.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'คุณวุฒิการศึกษาที่ผ่านการรับรอง:' : 'Verified Credentials:'}</span>
                    <span className="font-semibold text-slate-800">{advisor.credentials}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'จำนวนนักศึกษาภายใต้การดูแล:' : 'Supervision Load:'}</span>
                    <span className="font-semibold text-slate-800">{language === 'th' ? 'นักศึกษา 4 คนกำลังปฏิบัติงานสหกิจศึกษา' : '4 Students Currently Placed'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
