import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Clock, Award, User, Bell, 
  Search, CheckCircle, AlertTriangle, Save, Star, ThumbsUp, Check, X, Menu 
} from 'lucide-react';
import { 
  MOCK_STUDENTS, MOCK_REPORTS, MOCK_TIMESHEETS, Student, WeeklyReport, Timesheet 
} from '../types';
import { useLanguage } from '../LanguageContext';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';

interface SupervisorPortalProps {
  onNotify: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onLogout: () => void;
}

export default function SupervisorPortal({ onNotify, onLogout }: SupervisorPortalProps) {
  const { t, language, setLanguage } = useLanguage();

  // Tabs: 'dashboard' | 'students' | 'reports' | 'timesheets' | 'evaluation' | 'profile'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'reports' | 'timesheets' | 'evaluation' | 'profile'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Supervisor Profile State
  const [supervisor, setSupervisor] = useState({
    name: 'Khun Somsak NexaTech',
    email: 'somsak@nexatech.com',
    company: 'NexaTech Solutions Co., Ltd.',
    role: 'Senior Full-Stack Lead & Industrial Mentor'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: supervisor.name,
    email: supervisor.email,
    company: supervisor.company,
    role: supervisor.role
  });
  
  // Data State (NexaTech supervisor only views students placed at NexaTech: STU001)
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS.filter(s => s.companyId === 'COMP01'));
  const [reports, setReports] = useState<WeeklyReport[]>(MOCK_REPORTS.filter(r => r.studentId === 'STU001'));
  const [timesheets, setTimesheets] = useState<Timesheet[]>(MOCK_TIMESHEETS.filter(t => t.studentId === 'STU001'));
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(MOCK_STUDENTS[0]);

  // Evaluation state (70% corporate supervisor assessment)
  const [evalScores, setEvalScores] = useState({
    punctuality: 15, // max 20
    technicalSkill: 25, // max 30
    initiative: 15, // max 20
    comments: ''
  });

  const handleApproveTimesheet = (id: string) => {
    setTimesheets(timesheets.map(t => t.id === id ? { ...t, status: 'Approved', approvedBy: 'Supervisor Somsak' } : t));
    onNotify('Timesheet successfully verified and approved.', 'success');
  };

  const handleRejectTimesheet = (id: string) => {
    setTimesheets(timesheets.map(t => t.id === id ? { ...t, status: 'Rejected' } : t));
    onNotify('Timesheet flagged as rejected. Notify student to correct hours.', 'warning');
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(evalScores.punctuality) + Number(evalScores.technicalSkill) + Number(evalScores.initiative);
    onNotify(`70% Midterm Evaluation Recorded! Total Supervisor Score: ${total}/70 points. Synced with university board.`, 'success');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSupervisor({
      ...supervisor,
      name: editForm.name,
      email: editForm.email,
      company: editForm.company,
      role: editForm.role
    });
    setIsEditingProfile(false);
    onNotify(language === 'th' ? 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!' : 'Profile updated successfully!', 'success');
  };

  return (
    <div className="flex min-h-screen bg-slate-50/40 text-slate-800" id="supervisor-portal-root">
      
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
                { id: 'students', label: language === 'th' ? 'นักศึกษาในการนิเทศ' : 'Assigned Students', icon: Users },
                { id: 'reports', label: language === 'th' ? 'ตรวจบันทึกประจำสัปดาห์' : 'Weekly Report Viewer', icon: BookOpen },
                { id: 'timesheets', label: language === 'th' ? 'อนุมัติชั่วโมงเวลา' : 'Timesheet Approval', icon: Clock },
                { id: 'evaluation', label: language === 'th' ? 'แบบประเมินผล (70%)' : 'Evaluation Form (70%)', icon: Award },
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
                        ? 'bg-slate-900 text-white shadow-xs' 
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
                  {t('company_supervisor')}
                </span>
                <span className="text-xs font-bold text-slate-800 block truncate">{supervisor.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{supervisor.email}</span>
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

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
            { id: 'students', label: language === 'th' ? 'นักศึกษาในการนิเทศ' : 'Assigned Students', icon: Users },
            { id: 'reports', label: language === 'th' ? 'ตรวจบันทึกประจำสัปดาห์' : 'Weekly Report Viewer', icon: BookOpen },
            { id: 'timesheets', label: language === 'th' ? 'อนุมัติชั่วโมงเวลา' : 'Timesheet Approval', icon: Clock },
            { id: 'evaluation', label: language === 'th' ? 'แบบประเมินผล (70%)' : 'Evaluation Form (70%)', icon: Award },
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
                    ? 'bg-slate-900 text-white shadow-xs' 
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
              {t('company_supervisor')}
            </span>
            <span className="text-xs font-bold text-slate-800 block truncate">{supervisor.name}</span>
            <span className="text-[10px] text-slate-400 block truncate">{supervisor.email}</span>
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
                {language === 'th' ? `แผงควบคุม ${activeTab}` : `${activeTab} Controls`}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono leading-none sm:leading-normal">{language === 'th' ? 'ศูนย์บริการพันธมิตรสถานประกอบการ • NexaTech Solutions' : 'Employer Partnership Hub • NexaTech Solutions'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher onNotify={onNotify} />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-500">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              {language === 'th' ? 'ผู้ดูแลระดับองค์กร' : 'Corporate Sponsor'}
            </div>
            <button className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg relative cursor-pointer">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
            </button>
          </div>
        </header>

        {/* Views */}
        <div className="flex-1 overflow-y-auto p-8 text-left space-y-6">

          {/* VIEW 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Stats row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{language === 'th' ? 'นักศึกษาในความดูแล' : 'Assigned Interns'}</span>
                  <span className="block text-2xl font-extrabold text-slate-950 mt-1">{language === 'th' ? '1 คน' : '1 Student'}</span>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{language === 'th' ? 'แผ่นลงเวลาที่รออนุมัติ' : 'Pending Timesheets'}</span>
                  <span className="block text-2xl font-extrabold text-blue-600 mt-1">
                    {timesheets.filter(t => t.status === 'Pending').length} {language === 'th' ? 'รายการ' : 'Logs'}
                  </span>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{language === 'th' ? 'ความคืบหน้าโดยเฉลี่ย' : 'Avg Progress Score'}</span>
                  <span className="block text-2xl font-extrabold text-indigo-700 mt-1">{language === 'th' ? 'เสร็จสิ้น 75%' : '75% Complete'}</span>
                </div>
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{language === 'th' ? 'การประเมินโดยพี่เลี้ยง' : 'Supervisor Grading'}</span>
                  <span className="block text-2xl font-extrabold text-amber-600 mt-1">{language === 'th' ? 'ยังไม่เสร็จสิ้น' : 'Not Completed'}</span>
                </div>
              </div>

              {/* Quick actions panel */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{language === 'th' ? 'รายการด่วนที่ต้องดำเนินการ' : 'Action Items'}</h3>
                
                <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span>
                      {language === 'th' 
                        ? <>นักศึกษาฝึกงาน <b>กษิดิศ พรหมศร</b> ได้อัปโหลดบันทึกเวลาสัปดาห์ที่ 3 เพื่อขออนุมัติการเข้างาน</> 
                        : <>Intern <b>Kasidis Phromsorn</b> has uploaded Week 3 timesheet log for clocking authorization.</>
                      }
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('timesheets')}
                    className="px-3.5 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {language === 'th' ? 'อนุมัติเวลาปฏิบัติงาน' : 'Authorize Clocking'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: ASSIGNED STUDENTS LIST */}
          {activeTab === 'students' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-150">
              
              {/* List */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-900">{language === 'th' ? 'นักศึกษาสหกิจศึกษาในความดูแล' : 'Assigned CWIE Interns'}</h3>
                  <p className="text-xs text-slate-400">{language === 'th' ? 'จัดการและติดตามนักศึกษาสหกิจศึกษาที่ปฏิบัติงาน ณ NexaTech Solutions' : 'Manage corporate student workers placed at NexaTech Solutions.'}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-2.5 px-3">{language === 'th' ? 'ชื่อนักศึกษา' : 'Student Name'}</th>
                        <th className="py-2.5 px-3 hidden sm:table-cell">{language === 'th' ? 'สาขาวิชา' : 'Institutional Major'}</th>
                        <th className="py-2.5 px-3 text-right">{language === 'th' ? 'ความคืบหน้า' : 'Progress'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {students.map((stu) => (
                        <tr 
                          key={stu.id} 
                          onClick={() => setSelectedStudent(stu)}
                          className={`cursor-pointer transition-colors ${selectedStudent?.id === stu.id ? 'bg-slate-100/50 font-medium' : 'hover:bg-slate-50/50'}`}
                        >
                          <td className="py-3 px-3 text-slate-950 font-semibold">{stu.name}</td>
                          <td className="py-3 px-3 text-slate-500 hidden sm:table-cell">{stu.major}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-blue-600">{stu.progress}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Student detail */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-4">
                {selectedStudent ? (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-slate-100">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">{language === 'th' ? 'การ์ดโปรไฟล์นักศึกษาฝึกงาน' : 'Intern Profile Card'}</span>
                      <h4 className="text-sm font-bold text-slate-950 mt-1">{selectedStudent.name}</h4>
                      <p className="text-xs text-slate-400">{selectedStudent.email}</p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'ตำแหน่งงาน:' : 'Position Title:'}</span>
                        <span className="font-bold text-slate-800">Frontend Engineer (Intern)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'อาจารย์ที่ปรึกษาสหกิจ:' : 'Academic Advisor:'}</span>
                        <span className="font-semibold text-slate-800 font-sans">Dr. Somchai Srisuwan</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">{language === 'th' ? 'ทักษะความสามารถ (Skills Stack)' : 'Skills Stack'}</span>
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
                  <p className="text-xs text-slate-400 text-center py-6">{language === 'th' ? 'กรุณาเลือกนักศึกษาเพื่อดูรายละเอียด' : 'Select student record to view details.'}</p>
                )}
              </div>

            </div>
          )}

          {/* VIEW 3: WEEKLY REPORT VIEWER */}
          {activeTab === 'reports' && (
            <div className="max-w-2xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs text-left animate-in fade-in duration-150 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">{language === 'th' ? 'เครื่องมือตรวจบันทึกประจำสัปดาห์ของนักศึกษา' : 'Intern Weekly Diaries Reviewer'}</h2>
                <p className="text-xs text-slate-400">{language === 'th' ? 'ติดตามรายงานผลการปฏิบัติงานประจำสัปดาห์ที่นักศึกษาบันทึกไว้' : 'Track task notes compiled by your company interns.'}</p>
              </div>

              <div className="space-y-4">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800">{language === 'th' ? `สรุปรายงานความคืบหน้า สัปดาห์ที่ ${rep.weekNumber}` : `Week ${rep.weekNumber} Progress summary`}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{language === 'th' ? 'ส่งเมื่อ:' : 'Submitted:'} {new Date(rep.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded text-[9px] uppercase">{language === 'th' ? 'บันทึกผ่านการตรวจสอบแล้ว' : 'Verified Logs'}</span>
                    </div>

                    <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 mt-2">{rep.summary}</p>
                    
                    {rep.supervisorComment ? (
                      <p className="text-[10px] text-blue-800 bg-blue-50 p-2 rounded">
                        <b>{language === 'th' ? 'ความคิดเห็นที่คุณบันทึกไว้:' : 'Your saved comments:'}</b> "{rep.supervisorComment}"
                      </p>
                    ) : (
                      <div className="pt-2 flex gap-2 justify-end">
                        <input 
                          type="text" 
                          id={`sup-comment-${rep.id}`}
                          placeholder={language === 'th' ? 'เพิ่มข้อคิดเห็นสนับสนุนจากพี่เลี้ยงผู้ดูแล...' : 'Add supportive supervisor feedback...'}
                          className="flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] outline-none"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`sup-comment-${rep.id}`) as HTMLInputElement;
                            rep.supervisorComment = input?.value || 'Excellent progress, matches company targets.';
                            onNotify('Supervisor diary remarks successfully recorded.', 'success');
                            setActiveTab('dashboard'); // re-renders
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-[10px]"
                        >
                          {language === 'th' ? 'ส่งความเห็น' : 'Submit Note'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: TIMESHEET APPROVAL */}
          {activeTab === 'timesheets' && (
            <div className="max-w-2xl bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-left animate-in fade-in duration-150 space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">{language === 'th' ? 'อนุมัติบันทึกเวลาเข้าปฏิบัติงาน' : 'Authorize clocking logs'}</h2>
                <p className="text-xs text-slate-400">{language === 'th' ? 'อนุมัติหรือปฏิเสธบันทึกเวลาทำงาน 40 ชั่วโมงประจำสัปดาห์ของนักศึกษา' : 'Approve or reject completed 40-hour weekly timesheets.'}</p>
              </div>

              <div className="space-y-3">
                {timesheets.map((ts) => (
                  <div key={ts.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-700">
                    <div>
                      <h4 className="font-bold text-slate-900">{language === 'th' ? `บันทึกการลงเวลาปฏิบัติงาน สัปดาห์ที่ ${ts.weekNumber}` : `Week ${ts.weekNumber} Work logs`}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{language === 'th' ? 'ช่วงวันที่ปฏิบัติงาน:' : 'Date parameters:'} {ts.startDate} &mdash; {ts.endDate}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{language === 'th' ? 'เอกสารแนบ:' : 'Attached file:'} <span className="text-blue-600 underline font-semibold">{ts.fileName}</span></p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-bold text-slate-800">{language === 'th' ? `${ts.hoursWorked} ชม. ที่บันทึกไว้` : `${ts.hoursWorked} hrs recorded`}</span>
                      
                      {ts.status === 'Pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleRejectTimesheet(ts.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                            title="Reject logs"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApproveTimesheet(ts.id)}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                            title="Approve logs"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ts.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {language === 'th' ? (ts.status === 'Approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ/แก้ไข') : ts.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: EVALUATION FORM (70%) */}
          {activeTab === 'evaluation' && (
            <div className="max-w-xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs text-left animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold rounded uppercase tracking-wider mb-2 inline-block">
                  {language === 'th' ? 'แบบฟอร์มการประเมินของสถาบัน' : 'Institutional assessment form'}
                </span>
                <h2 className="text-base font-bold text-slate-900">{language === 'th' ? 'แบบประเมินผลกลางภาคเรียนโดยพี่เลี้ยง/ผู้ควบคุมดูแล (สัดส่วนคะแนน 70%)' : 'Supervisor Midterm assessment (70% weight)'}</h2>
                <p className="text-xs text-slate-400">{language === 'th' ? 'บันทึกคะแนนการตรงต่อเวลา ความคิดริเริ่มสร้างสรรค์ และผลงานทางเทคนิคที่ได้รับมอบหมาย' : 'Record punctuality, initiative, and technical deliverables marks.'}</p>
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-5 text-xs text-slate-700">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">{language === 'th' ? 'นักศึกษาฝึกงานที่เป็นเป้าหมายประเมิน' : 'Target Intern worker'}</label>
                  <select className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none">
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <label className="font-semibold">{language === 'th' ? 'ความเป็นมืออาชีพและการตรงต่อเวลาลงบันทึกเวลา (คะแนนเต็ม 20)' : 'Professional Punctuality & Clocking (max 20)'}</label>
                      <span className="font-mono font-bold text-blue-600">{evalScores.punctuality} pts</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={evalScores.punctuality}
                      onChange={(e) => setEvalScores({ ...evalScores, punctuality: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <label className="font-semibold">{language === 'th' ? 'คุณภาพงานเชิงเทคนิคและการส่งมอบผลงาน (คะแนนเต็ม 30)' : 'Technical Deliverables & Code Quality (max 30)'}</label>
                      <span className="font-mono font-bold text-blue-600">{evalScores.technicalSkill} pts</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={evalScores.technicalSkill}
                      onChange={(e) => setEvalScores({ ...evalScores, technicalSkill: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <label className="font-semibold">{language === 'th' ? 'ความคิดริเริ่มสร้างสรรค์และความรับผิดชอบในบทบาทตนเอง (คะแนนเต็ม 20)' : 'Enterprise Initiative & Autonomy (max 20)'}</label>
                      <span className="font-mono font-bold text-blue-600">{evalScores.initiative} pts</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={evalScores.initiative}
                      onChange={(e) => setEvalScores({ ...evalScores, initiative: Number(e.target.value) })}
                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold mb-1">{language === 'th' ? 'ความคิดเห็นเพิ่มเติมและข้อเสนอแนะโดยรวมจากผู้ควบคุมดูแล' : 'Supervisor feedback commentary'}</label>
                  <textarea
                    rows={3}
                    placeholder={language === 'th' ? 'พิมพ์ความคิดเห็นเกี่ยวกับทักษะการเรียนรู้งาน ความทุ่มเท และความเป็นมืออาชีพของนักศึกษา...' : "Provide comments on student's industrial growth, focus, and professionalism..."}
                    value={evalScores.comments}
                    onChange={(e) => setEvalScores({ ...evalScores, comments: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {language === 'th' ? 'บันทึกและล็อกคะแนนประเมินอย่างเป็นทางการ' : 'Lock & Record Rubric Scores'}
                </button>
              </form>
            </div>
          )}

          {/* VIEW 6: PROFILE */}
          {activeTab === 'profile' && (
            <div className="w-full bg-white border border-slate-100 p-8 rounded-2xl shadow-xs text-left animate-in fade-in duration-150 space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-tr from-blue-950 to-slate-900 text-white font-extrabold flex items-center justify-center text-xl rounded-2xl">
                    {supervisor.name.split(' ').pop()?.charAt(0) || 'SP'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-sans">{supervisor.name}</h2>
                    <p className="text-xs text-slate-400">{supervisor.role}</p>
                  </div>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setEditForm({
                        name: supervisor.name,
                        email: supervisor.email,
                        company: supervisor.company,
                        role: supervisor.role
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
                      {language === 'th' ? 'สถานประกอบการ' : 'Affiliated Employer'}
                    </label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
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
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'สถานประกอบการฝึกงาน:' : 'Affiliated Employer:'}</span>
                    <span className="font-bold text-blue-600">{supervisor.company}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'ที่อยู่อีเมลติดต่อ:' : 'Email Address:'}</span>
                    <span className="font-semibold text-slate-800">{supervisor.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">{language === 'th' ? 'ภาระหน้าที่การนิเทศงาน:' : 'Supervision Load:'}</span>
                    <span className="font-semibold text-slate-800">{language === 'th' ? 'นักศึกษา 1 คนสังกัดในความดูแล (กษิดิศ)' : '1 Intern worker Placed (Kasidis)'}</span>
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
