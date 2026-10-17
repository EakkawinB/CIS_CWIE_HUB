import React, { useState } from 'react';
import { 
  Building2, Users, Mail, Phone, Search, Award, 
  CheckCircle2, UserCheck, Check, Filter, Send, 
  Clock, ShieldAlert, AlertCircle, Eye, ExternalLink, HelpCircle, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface StaffMentorsProps {
  students: Student[];
  initialSubTab?: 'all' | 'assigned';
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export type MentorOnboardingStatus = 'Pending Review' | 'Invitation Pending' | 'Invited' | 'Activated';

interface MentorItem {
  id: string;
  name: string;
  company: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  onboardingStatus: MentorOnboardingStatus;
  submittedByStudentName?: string;
  submittedAt?: string;
  assignedStudentIds: string[];
}

export default function StaffMentors({
  students,
  initialSubTab = 'all',
  onNotify
}: StaffMentorsProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'assigned'>(
    initialSubTab === 'assigned' ? 'assigned' : 'all'
  );
  const [search, setSearch] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');

  // Mentors dataset with onboarding statuses
  const [mentors, setMentors] = useState<MentorItem[]>([
    {
      id: 'MEN01',
      name: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
      company: 'NexaTech Solutions Co., Ltd.',
      department: 'Core Platform Engineering',
      position: 'Senior Lead Software Engineer',
      email: 'somsak.p@nexatech.co.th',
      phone: '02-123-4567 ต่อ 802',
      status: 'Active',
      onboardingStatus: 'Activated',
      submittedByStudentName: 'กษิดิศ พรหมศร',
      submittedAt: '2026-05-18',
      assignedStudentIds: ['STU001', 'STU003']
    },
    {
      id: 'MEN02',
      name: 'คุณกฤษณ์ ตั้งตรง',
      company: 'Linear Digital Innovations',
      department: 'Cloud & Infrastructure',
      position: 'Principal Cloud Architect',
      email: 'krit.t@lineardigital.io',
      phone: '02-987-6543 ต่อ 101',
      status: 'Active',
      onboardingStatus: 'Activated',
      submittedByStudentName: 'นริศรา สุวรรณโชติ',
      submittedAt: '2026-05-20',
      assignedStudentIds: ['STU002']
    },
    {
      id: 'MEN03',
      name: 'คุณพิมพา สุขเกษม',
      company: 'Linear Digital Innovations',
      department: 'Design & UX Research',
      position: 'Head of Product Design',
      email: 'pimpa.s@lineardigital.io',
      phone: '02-987-6543 ต่อ 105',
      status: 'Active',
      onboardingStatus: 'Invited',
      submittedByStudentName: 'พิมพ์ชนก รัตนกุล',
      submittedAt: '2026-06-01',
      assignedStudentIds: ['STU004']
    },
    {
      id: 'MEN04',
      name: 'คุณณัฐพล วงศ์สวัสดิ์',
      company: 'NexaTech Solutions Co., Ltd.',
      department: 'DevOps & Quality Assurance',
      position: 'Lead QA Automation Specialist',
      email: 'nattapol.w@nexatech.co.th',
      phone: '02-123-4567 ต่อ 810',
      status: 'Active',
      onboardingStatus: 'Pending Review',
      submittedByStudentName: 'วรภัทร อัศววิบูลย์',
      submittedAt: '2026-06-05',
      assignedStudentIds: ['STU005']
    }
  ]);

  // Review and send invitation action
  const handleSendInvitation = (mentorId: string) => {
    setMentors(mentors.map(m => {
      if (m.id === mentorId) {
        return {
          ...m,
          onboardingStatus: 'Invited' as const
        };
      }
      return m;
    }));

    const m = mentors.find(item => item.id === mentorId);
    onNotify?.(
      isThai 
        ? `ตรวจสอบข้อมูลและจำลองส่งอีเมลคำเชิญไปยัง ${m?.name} (${m?.email}) เรียบร้อยแล้ว` 
        : `Sent mock onboarding invitation email to ${m?.name}!`,
      'success'
    );
  };

  // Mock activate account
  const handleSimulateActivation = (mentorId: string) => {
    setMentors(mentors.map(m => {
      if (m.id === mentorId) {
        return {
          ...m,
          onboardingStatus: 'Activated' as const,
          status: 'Active' as const
        };
      }
      return m;
    }));

    const m = mentors.find(item => item.id === mentorId);
    onNotify?.(
      isThai 
        ? `จำลองการเปิดใช้งานบัญชี (Activated) ของ ${m?.name} เรียบร้อยแล้ว` 
        : `Simulated account activation for ${m?.name}!`,
      'info'
    );
  };

  // Companies list for grouping
  const uniqueCompanies = Array.from(new Set(mentors.map(m => m.company)));

  // Filtered mentors
  const filteredMentors = mentors.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase()) ||
      m.position.toLowerCase().includes(search.toLowerCase());

    const matchesComp = selectedCompanyFilter === 'All' || m.company === selectedCompanyFilter;

    return matchesSearch && matchesComp;
  });

  // Grouped by Company for Assigned Students view
  const companiesGrouping = uniqueCompanies.map(companyName => {
    const companyMentors = mentors.filter(m => m.company === companyName);
    return {
      companyName,
      mentors: companyMentors
    };
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'all'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{isThai ? 'All Mentor (พี่เลี้ยงสถานประกอบการทั้งหมด)' : 'All Mentor'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {mentors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('assigned')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'assigned'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isThai ? 'Assigned Students (นศ. ในความดูแล)' : 'Assigned Students'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {mentors.reduce((acc, m) => acc + m.assignedStudentIds.length, 0)}
            </span>
          </button>
        </div>

        {/* Company Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{isThai ? 'สถานประกอบการ:' : 'Company:'}</span>
          <select
            value={selectedCompanyFilter}
            onChange={(e) => setSelectedCompanyFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-[#6B122C]"
          >
            <option value="All">{isThai ? 'ทุกบริษัท (All Companies)' : 'All Companies'}</option>
            {uniqueCompanies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Onboarding Flow Explanation Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-[#6B122C] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-slate-900 block">
            {isThai ? 'วงจรการเริ่มต้นใช้งานของพี่เลี้ยง (Mentor Onboarding Flow)' : 'Mentor Onboarding Workflow'}
          </strong>
          <p className="text-slate-600 leading-relaxed">
            {isThai 
              ? 'นักศึกษาเริ่มฝึกงานและแจ้งข้อมูลพี่เลี้ยง → เจ้าหน้าที่ตรวจสอบข้อมูล (Review) → ระบบส่งอีเมลคำเชิญ (Invite) → พี่เลี้ยงเปิดใช้งานบัญชี (Activated) → ระบบสร้างความสัมพันธ์ บริษัท ↔ พี่เลี้ยง ↔ นักศึกษา โดยอัตโนมัติ (เจ้าหน้าที่ทำหน้าที่ตรวจสอบและกำกับติดตาม ไม่ได้สุ่มจับคู่เอง)' 
              : 'Student submits mentor details → Staff reviews/confirms info → System dispatches invitation email → Mentor activates account → System establishes Company ↔ Mentor ↔ Student relation automatically.'}
          </p>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl shadow-xs">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input 
          type="text"
          placeholder={isThai ? 'ค้นหาชื่อพี่เลี้ยง, ตำแหน่ง หรือแผนก...' : 'Search mentor name, position, or department...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400"
        />
        {search && (
          <button onClick={() => setSearch('')} className="p-1 hover:bg-slate-100 text-slate-400 rounded-lg cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: ALL MENTOR (Grouped by Company)               */}
      {/* ========================================================= */}
      {activeSubTab === 'all' && (
        <div className="space-y-6">
          {uniqueCompanies
            .filter(c => selectedCompanyFilter === 'All' || c === selectedCompanyFilter)
            .map(companyName => {
              const companyMentors = filteredMentors.filter(m => m.company === companyName);
              if (companyMentors.length === 0) return null;

              return (
                <div key={companyName} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <Building2 className="h-4 w-4 text-[#6B122C]" />
                    <h3 className="text-sm font-bold text-slate-900">{companyName}</h3>
                    <span className="text-xs text-slate-400 font-mono">
                      ({companyMentors.length} {isThai ? 'คน' : 'mentors'})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companyMentors.map((mentor) => {
                      const assignedStudents = students.filter(s => mentor.assignedStudentIds.includes(s.id));

                      return (
                        <div 
                          key={mentor.id}
                          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-slate-200 transition-all text-left space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">{mentor.name}</h4>
                                <span className="text-[10px] font-mono text-slate-400">({mentor.id})</span>
                              </div>
                              <p className="text-xs text-[#6B122C] font-semibold mt-0.5">{mentor.position}</p>
                              <p className="text-[11px] text-slate-500">{mentor.department}</p>
                            </div>

                            {/* Onboarding Status Badge */}
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                              mentor.onboardingStatus === 'Activated' ? 'bg-emerald-100 text-emerald-800' :
                              mentor.onboardingStatus === 'Invited' ? 'bg-blue-100 text-blue-800' :
                              mentor.onboardingStatus === 'Invitation Pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {mentor.onboardingStatus}
                            </span>
                          </div>

                          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />
                              <span className="font-mono">{mentor.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              <span>{mentor.phone}</span>
                            </div>
                          </div>

                          {/* Submission & Assigned Students Info */}
                          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5">
                            {mentor.submittedByStudentName && (
                              <div className="text-[11px] text-slate-500">
                                {isThai ? 'นศ. ที่ส่งข้อมูลพี่เลี้ยง:' : 'Submitted by student:'} &nbsp;
                                <strong className="text-slate-800">{mentor.submittedByStudentName}</strong>
                                {mentor.submittedAt && <span className="text-[10px] text-slate-400 font-mono ml-2">({mentor.submittedAt})</span>}
                              </div>
                            )}

                            <div className="text-[11px] text-slate-700 flex items-center justify-between">
                              <span>{isThai ? 'นักศึกษาในความดูแล:' : 'Assigned Students:'}</span>
                              <strong className="text-[#6B122C]">{assignedStudents.length} {isThai ? 'คน' : 'students'}</strong>
                            </div>
                          </div>

                          {/* Onboarding Action Buttons */}
                          <div className="pt-2 flex items-center justify-end gap-2">
                            {mentor.onboardingStatus === 'Pending Review' && (
                              <button
                                onClick={() => handleSendInvitation(mentor.id)}
                                className="px-3 py-1.5 bg-[#6B122C] hover:bg-[#520d21] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Send className="h-3 w-3" />
                                <span>{isThai ? 'ตรวจสอบ & ส่งคำเชิญ' : 'Review & Send Invite'}</span>
                              </button>
                            )}

                            {mentor.onboardingStatus === 'Invited' && (
                              <button
                                onClick={() => handleSimulateActivation(mentor.id)}
                                className="px-3 py-1.5 border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                title={isThai ? 'จำลองการคลิกลิงก์เปิดใช้งานของพี่เลี้ยง' : 'Simulate activation'}
                              >
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                <span>{isThai ? 'จำลองการเปิดบัญชี (Activate)' : 'Simulate Activate'}</span>
                              </button>
                            )}

                            {mentor.onboardingStatus === 'Activated' && (
                              <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>{isThai ? 'บัญชีพร้อมใช้งานแล้ว' : 'Account Ready'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: ASSIGNED STUDENTS (Monitoring Hierarchy)       */}
      {/* Company -> Mentor -> Assigned Students                    */}
      {/* ========================================================= */}
      {activeSubTab === 'assigned' && (
        <div className="space-y-6">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
            {isThai 
              ? 'หน้านี้ใช้สำหรับการกำกับติดตาม (Monitoring) ความสัมพันธ์ระดับ: สถานประกอบการ → พี่เลี้ยง → นักศึกษาที่ดูแล โดยที่เจ้าหน้าที่ไม่ได้ทำการจัดสรรแบบกำหนดเองในหน้านี้' 
              : 'This view is dedicated to monitoring the established hierarchy: Company → Mentor → Assigned Students.'}
          </div>

          <div className="space-y-5">
            {companiesGrouping
              .filter(g => selectedCompanyFilter === 'All' || g.companyName === selectedCompanyFilter)
              .map(group => (
                <div key={group.companyName} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
                  
                  {/* Company Header */}
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="h-8 w-8 rounded-lg bg-[#6B122C] text-white flex items-center justify-center font-bold text-xs">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{group.companyName}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {group.mentors.length} {isThai ? 'พี่เลี้ยงประจำสถานประกอบการ' : 'mentors registered'}
                      </p>
                    </div>
                  </div>

                  {/* Mentors in Company */}
                  <div className="space-y-4 pl-2">
                    {group.mentors.map(mentor => {
                      const assignedStudents = students.filter(s => mentor.assignedStudentIds.includes(s.id));

                      return (
                        <div key={mentor.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                          
                          {/* Mentor Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/80 pb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900">{mentor.name}</span>
                                <span className="text-[10px] text-slate-400">({mentor.position})</span>
                              </div>
                              <p className="text-[11px] text-slate-500">{mentor.department} • {mentor.email}</p>
                            </div>

                            <span className="text-xs text-slate-600 font-medium">
                              {isThai ? 'ดูแลนักศึกษา:' : 'Supervising:'} &nbsp;
                              <strong className="text-[#6B122C]">{assignedStudents.length} คน</strong>
                            </span>
                          </div>

                          {/* Assigned Students List */}
                          <div className="space-y-1.5">
                            {assignedStudents.length === 0 ? (
                              <div className="text-xs text-slate-400 italic py-1">
                                {isThai ? 'ยังไม่มีนักศึกษาในความดูแล' : 'No students assigned yet.'}
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {assignedStudents.map(st => (
                                  <div 
                                    key={st.id}
                                    className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-2xs flex items-center justify-between"
                                  >
                                    <div>
                                      <span className="font-bold text-xs text-slate-800 block">{st.name}</span>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        ID: {st.id} • {st.programType}
                                      </span>
                                    </div>

                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                      {isThai ? 'ฝึกงานอยู่' : 'Active'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
}
