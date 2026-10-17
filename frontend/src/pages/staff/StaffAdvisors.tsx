import React, { useCallback, useEffect, useState } from 'react';
import { 
  GraduationCap, Search, Users, MapPin, CheckCircle2, AlertCircle, 
  Clock, Plus, Calendar, Check, X, Building2, Phone, Mail, Filter,
  Edit2, Sliders, Info, Video
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';
import {
  ActiveAdvisorDto,
  AdvisorAssignmentDto,
  EligibleAdvisorStudentDto,
  createAdvisorAssignment,
  getActiveAdvisors,
  getAdvisorAssignments,
  getApiErrorStatus,
  getEligibleAdvisorStudents,
} from '../../services/api';

interface StaffAdvisorsProps {
  students: Student[];
  initialSubTab?: 'all' | 'matching' | 'coop-visit';
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

interface VisitWindowConfig {
  round: 1 | 2;
  title: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Closed';
  description: string;
}

interface VisitRecord {
  id: string;
  studentId: string;
  studentName: string;
  advisorId: string;
  advisorName: string;
  companyName: string;
  round1Date: string;
  round1Time?: string;
  round1Mode?: 'On-site' | 'Online Meeting';
  round1Location?: string;
  round1Status: 'Completed' | 'Scheduled' | 'Not Scheduled';
  round2Date: string;
  round2Time?: string;
  round2Mode?: 'On-site' | 'Online Meeting';
  round2Location?: string;
  round2Status: 'Completed' | 'Scheduled' | 'Not Scheduled';
  visitNotes: string;
}

export default function StaffAdvisors({
  students,
  initialSubTab = 'all',
  onNotify
}: StaffAdvisorsProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'matching' | 'coop-visit'>(initialSubTab);
  const [search, setSearch] = useState('');
  const [visitFilter, setVisitFilter] = useState<'All' | 'NotStarted' | 'Incomplete'>('All');

  const [eligibleStudents, setEligibleStudents] = useState<EligibleAdvisorStudentDto[]>([]);
  const [activeAdvisors, setActiveAdvisors] = useState<ActiveAdvisorDto[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState<AdvisorAssignmentDto[]>([]);
  const [selectedAdvisors, setSelectedAdvisors] = useState<Record<number, string>>({});
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const [submittingStudentId, setSubmittingStudentId] = useState<number | null>(null);

  // Staff Co-op Visit Period Window Configurations (Round 1 & Round 2)
  const [visitWindows, setVisitWindows] = useState<VisitWindowConfig[]>([
    {
      round: 1,
      title: isThai ? 'การนิเทศงานรอบที่ 1 (ช่วงสัปดาห์ที่ 6 - 8)' : 'Co-op Supervision Round 1 (Weeks 6 - 8)',
      startDate: '2026-06-15',
      endDate: '2026-07-15',
      status: 'Active',
      description: isThai ? 'ติดตามการปรับตัวของนักศึกษา ข้อตกลงงาน และความก้าวหน้าเบื้องต้น' : 'Monitor student onboarding, initial tasks, and adaptation.'
    },
    {
      round: 2,
      title: isThai ? 'การนิเทศงานรอบที่ 2 (ช่วงสัปดาห์ที่ 12 - 14)' : 'Co-op Supervision Round 2 (Weeks 12 - 14)',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      status: 'Upcoming',
      description: isThai ? 'ประเมินความก้าวหน้าของโครงงาน/ภาระงานสหกิจ และการเตรียมตัวสอบ' : 'Evaluate project completion, work deliverables, and defense readiness.'
    }
  ]);

  const [editingWindow, setEditingWindow] = useState<VisitWindowConfig | null>(null);

  // Co-op Visits monitoring data
  const [visits, setVisits] = useState<VisitRecord[]>([
    {
      id: 'VISIT01',
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      advisorId: 'ADV01',
      advisorName: 'ดร.สมชาย ศรีสุวรรณ',
      companyName: 'NexaTech Solutions Co., Ltd.',
      round1Date: '2026-06-25',
      round1Time: '10:00 - 11:30',
      round1Mode: 'On-site',
      round1Location: 'อาคารเอ็มไพร์ทาวเวอร์ ชั้น 28',
      round1Status: 'Completed',
      round2Date: '2026-08-15',
      round2Time: '14:00 - 15:30',
      round2Mode: 'Online Meeting',
      round2Location: 'Google Meet: meet.google.com/nex-coop',
      round2Status: 'Scheduled',
      visitNotes: 'นิเทศรอบ 1 เรียบร้อย นศ.ปรับตัวดีเยี่ยม รอบ 2 กำหนดประชุมออนไลน์'
    },
    {
      id: 'VISIT02',
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      advisorId: 'ADV01',
      advisorName: 'ดร.สมชาย ศรีสุวรรณ',
      companyName: 'Linear Digital Innovations',
      round1Date: '2026-06-28',
      round1Time: '13:30 - 15:00',
      round1Mode: 'On-site',
      round1Location: 'อาคารสยามสแควร์วัน ชั้น 14',
      round1Status: 'Completed',
      round2Date: '',
      round2Status: 'Not Scheduled',
      visitNotes: 'รอบ 1 เข้าพบเรียบร้อย รอบ 2 รอนัดหมายช่วงสัปดาห์ที่ 14'
    },
    {
      id: 'VISIT03',
      studentId: 'STU003',
      studentName: 'ชวัลวิทย์ เตชะวณิช',
      advisorId: 'ADV02',
      advisorName: 'ดร.วิทวัส จันทร์ทราภิรักษ์',
      companyName: 'NexaTech Solutions Co., Ltd.',
      round1Date: '',
      round1Status: 'Not Scheduled',
      round2Date: '',
      round2Status: 'Not Scheduled',
      visitNotes: 'ยังไม่ได้นัดหมายการนิเทศงานรอบที่ 1'
    },
    {
      id: 'VISIT04',
      studentId: 'STU004',
      studentName: 'พิมพ์ชนก รัตนกุล',
      advisorId: 'ADV02',
      advisorName: 'ดร.วิทวัส จันทร์ทราภิรักษ์',
      companyName: 'Linear Digital Innovations',
      round1Date: '2026-07-02',
      round1Time: '10:00 - 11:30',
      round1Mode: 'Online Meeting',
      round1Location: 'Zoom Room 1',
      round1Status: 'Scheduled',
      round2Date: '',
      round2Status: 'Not Scheduled',
      visitNotes: 'อาจารย์นัดหมายรอบ 1 ผ่านระบบ Zoom แล้ว'
    },
    {
      id: 'VISIT05',
      studentId: 'STU005',
      studentName: 'วรภัทร อัศววิบูลย์',
      advisorId: 'ADV03',
      advisorName: 'ผศ.ดร. ธีรเดช กิตติศักดิ์',
      companyName: 'NexaTech Solutions Co., Ltd.',
      round1Date: '',
      round1Status: 'Not Scheduled',
      round2Date: '',
      round2Status: 'Not Scheduled',
      visitNotes: 'เพิ่งได้รับการจัดสรรอาจารย์ที่ปรึกษา'
    }
  ]);

  const loadMatchingData = useCallback(async () => {
    try {
      setMatchingLoading(true);
      setMatchingError(null);
      const [eligible, active, completed] = await Promise.all([
        getEligibleAdvisorStudents(),
        getActiveAdvisors(),
        getAdvisorAssignments(),
      ]);
      setEligibleStudents(eligible);
      setActiveAdvisors(active);
      setCompletedAssignments(completed);
    } catch {
      setMatchingError(isThai ? 'ไม่สามารถโหลดข้อมูลการจับคู่ได้' : 'Unable to load advisor assignments.');
    } finally {
      setMatchingLoading(false);
    }
  }, [isThai]);

  useEffect(() => {
    if (activeSubTab === 'all' || activeSubTab === 'matching') void loadMatchingData();
  }, [activeSubTab, loadMatchingData]);

  async function handleAssignAdvisor(student: EligibleAdvisorStudentDto) {
    const advisorId = selectedAdvisors[student.student_id];
    const advisor = activeAdvisors.find((item) => item.advisor_id === advisorId);
    if (!advisor) return;

    const confirmed = window.confirm(
      isThai
        ? `ยืนยันการมอบหมาย ${advisor.advisor_name} ให้ดูแล ${student.student_name}\n\nเมื่อบันทึกแล้วจะไม่สามารถเปลี่ยนหรือยกเลิกผ่านระบบได้`
        : `Assign ${advisor.advisor_name} to ${student.student_name}?\n\nThis assignment cannot be changed or removed after it is saved.`
    );
    if (!confirmed) return;

    try {
      setSubmittingStudentId(student.student_id);
      await createAdvisorAssignment(student.student_id, advisorId);
      onNotify?.(isThai ? 'มอบหมายอาจารย์ที่ปรึกษาสำเร็จ' : 'Advisor assigned successfully.', 'success');
      setSelectedAdvisors((current) => {
        const next = { ...current };
        delete next[student.student_id];
        return next;
      });
      await loadMatchingData();
    } catch (error) {
      if (getApiErrorStatus(error) === 409) {
        onNotify?.(isThai ? 'นักศึกษาอาจได้รับการจัดสรรแล้ว กรุณาตรวจสอบรายการล่าสุด' : 'The student may already be assigned. The list has been refreshed.', 'warning');
        await loadMatchingData();
      } else {
        onNotify?.(
          isThai
            ? 'ไม่สามารถยืนยันผลการมอบหมายได้ ระบบจะโหลดรายการล่าสุดเพื่อตรวจสอบว่าบันทึกสำเร็จหรือไม่'
            : 'The assignment result could not be confirmed. The latest lists will be loaded for verification.',
          'error'
        );
        await loadMatchingData();
      }
    } finally {
      setSubmittingStudentId(null);
    }
  }

  // Save visit window configuration
  const handleSaveVisitWindow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWindow) return;

    setVisitWindows(visitWindows.map(w => w.round === editingWindow.round ? editingWindow : w));
    setEditingWindow(null);
    onNotify?.(
      isThai 
        ? `บันทึกกรอบเวลานิเทศงานรอบที่ ${editingWindow.round} เรียบร้อยแล้ว` 
        : `Saved visit window period for Round ${editingWindow.round}!`,
      'success'
    );
  };

  // Filtered visits
  const filteredVisits = visits.filter(v => {
    const matchesSearch = 
      v.studentName.toLowerCase().includes(search.toLowerCase()) ||
      v.advisorName.toLowerCase().includes(search.toLowerCase()) ||
      v.companyName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (visitFilter === 'NotStarted') {
      return v.round1Status === 'Not Scheduled';
    }
    if (visitFilter === 'Incomplete') {
      return v.round1Status !== 'Completed' || v.round2Status !== 'Completed';
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'all'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>{isThai ? 'All Advisers (อาจารย์ที่ปรึกษาทั้งหมด)' : 'All Advisers'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {matchingLoading ? '—' : activeAdvisors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('matching')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'matching'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isThai ? 'Matching Students (การจัดสรร นศ.)' : 'Matching Students'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {eligibleStudents.length + completedAssignments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('coop-visit')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'coop-visit'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>{isThai ? 'Co-op Visit (การนิเทศงาน)' : 'Co-op Visit'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {visits.length}
            </span>
          </button>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl shadow-xs">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input 
          type="text"
          placeholder={
            activeSubTab === 'coop-visit'
              ? (isThai ? 'ค้นหาชื่อนักศึกษา, อาจารย์ที่ปรึกษา หรือสถานประกอบการ...' : 'Search student, advisor, or company...')
              : (isThai ? 'ค้นหาอาจารย์ที่ปรึกษา หรือหน่วยงาน...' : 'Search advisor name or department...')
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400"
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="p-1 hover:bg-slate-100 text-slate-400 rounded-lg cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: ALL ADVISERS                                   */}
      {/* ========================================================= */}
      {activeSubTab === 'all' && (
        <div className="space-y-4">
          {matchingLoading && <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-500">{isThai ? 'กำลังโหลดข้อมูลอาจารย์...' : 'Loading advisers...'}</div>}
          {matchingError && !matchingLoading && <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-sm text-rose-700">{matchingError}</div>}
          {!matchingLoading && !matchingError && activeAdvisors.length === 0 && <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-500">{isThai ? 'ไม่พบอาจารย์ที่เปิดใช้งาน' : 'No active advisers found.'}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!matchingLoading && !matchingError && activeAdvisors
              .filter(a => a.advisor_name.toLowerCase().includes(search.toLowerCase()) || (a.department ?? '').toLowerCase().includes(search.toLowerCase()))
              .map((adv) => {
                const assignedCount = completedAssignments.filter(m => m.advisor_id === adv.advisor_id).length;

                return (
                  <div 
                    key={adv.advisor_id}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-slate-200 transition-all text-left space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#6B122C] to-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {adv.advisor_name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-mono">{isThai ? 'อาจารย์ที่เปิดใช้งาน' : 'Active adviser'}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900">{adv.advisor_name}</h3>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700">Active</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">{adv.department ?? (isThai ? 'ยังไม่มีข้อมูลภาควิชา' : 'Department not available')}</p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{isThai ? 'นศ. ในความดูแล' : 'Advisees'}:</span>
                        <strong className="text-slate-900 font-bold">{assignedCount} {isThai ? 'คน' : 'students'}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: MATCHING STUDENTS                             */}
      {/* ========================================================= */}
      {activeSubTab === 'matching' && (
        <div className="space-y-4">
          {matchingLoading && <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-sm text-slate-500">{isThai ? 'กำลังโหลดข้อมูลการจับคู่...' : 'Loading advisor assignments...'}</div>}
          {matchingError && !matchingLoading && <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-sm text-rose-700">{matchingError}</div>}
          {!matchingLoading && !matchingError && <>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-900">{isThai ? 'นักศึกษาที่รอการจัดสรร' : 'Eligible Unassigned Students'}</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">{isThai ? 'นักศึกษา' : 'Student'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'สถานประกอบการ / ตำแหน่ง' : 'Company / Position'}</th>
                    <th className="py-3.5 px-4 text-right">{isThai ? 'จัดสรรอาจารย์' : 'Allocate Advisor'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eligibleStudents
                    .filter((item) => `${item.student_name} ${item.student_code ?? ''} ${item.company_name} ${item.position_name}`.toLowerCase().includes(search.toLowerCase()))
                    .map((item) => (
                        <tr key={item.student_id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{item.student_name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{item.student_code ?? '—'}</div>
                          </td>
                          <td className="py-3.5 px-4"><div className="font-medium text-slate-700">{item.company_name}</div><div className="text-[11px] text-slate-400">{item.position_name}</div></td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-2"><select value={selectedAdvisors[item.student_id] ?? ''} onChange={(event) => setSelectedAdvisors((current) => ({ ...current, [item.student_id]: event.target.value }))} disabled={submittingStudentId !== null} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl outline-none focus:border-[#6B122C]"><option value="">{isThai ? '-- เลือกอาจารย์ที่ปรึกษา --' : '-- Choose Advisor --'}</option>{activeAdvisors.map((advisor) => <option key={advisor.advisor_id} value={advisor.advisor_id}>{advisor.advisor_name}</option>)}</select><button onClick={() => void handleAssignAdvisor(item)} disabled={!selectedAdvisors[item.student_id] || submittingStudentId !== null} className="px-3 py-1.5 rounded-xl bg-[#6B122C] text-white text-xs font-bold disabled:opacity-40">{submittingStudentId === item.student_id ? (isThai ? 'กำลังบันทึก...' : 'Saving...') : (isThai ? 'ยืนยัน' : 'Confirm')}</button></div>
                          </td>
                        </tr>
                    ))}
                  {eligibleStudents.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-slate-400">{isThai ? 'ไม่มีนักศึกษาที่รอการจัดสรร' : 'No eligible unassigned students.'}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-900">{isThai ? 'รายการที่จัดสรรแล้ว' : 'Completed Assignments'}</h3><p className="text-[11px] text-slate-400">{isThai ? 'ข้อมูลส่วนนี้เป็นแบบอ่านอย่างเดียว' : 'These records are read-only.'}</p></div>
            <div className="overflow-x-auto"><table className="w-full text-left text-xs border-collapse"><thead><tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]"><th className="py-3 px-4">{isThai ? 'นักศึกษา' : 'Student'}</th><th className="py-3 px-4">{isThai ? 'อาจารย์ที่ปรึกษา' : 'Advisor'}</th><th className="py-3 px-4">{isThai ? 'บริษัท / ตำแหน่ง' : 'Company / Position'}</th></tr></thead><tbody className="divide-y divide-slate-100">{completedAssignments.filter((item) => `${item.student_name} ${item.student_code ?? ''} ${item.advisor_name} ${item.company_name}`.toLowerCase().includes(search.toLowerCase())).map((item) => <tr key={item.assignment_id}><td className="py-3 px-4"><div className="font-bold">{item.student_name}</div><div className="font-mono text-[11px] text-slate-400">{item.student_code ?? '—'}</div></td><td className="py-3 px-4 font-semibold text-[#6B122C]">{item.advisor_name}</td><td className="py-3 px-4"><div>{item.company_name}</div><div className="text-[11px] text-slate-400">{item.position_name}</div></td></tr>)}{completedAssignments.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-slate-400">{isThai ? 'ยังไม่มีรายการที่จัดสรรแล้ว' : 'No completed assignments.'}</td></tr>}</tbody></table></div>
          </div>
          </>}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: CO-OP VISIT (Config & Monitoring)              */}
      {/* ========================================================= */}
      {activeSubTab === 'coop-visit' && (
        <div className="space-y-6">
          
          {/* 1. Staff Co-op Visit Responsibility: Window Period Configuration */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#6B122C] uppercase tracking-wider font-bold">
                  {isThai ? 'หน้าที่เจ้าหน้าที่ (Staff Responsibility)' : 'Staff Co-op Visit Configuration'}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {isThai ? 'กำหนดกรอบระยะเวลาการนิเทศงาน (Round 1 & Round 2 Allowed Windows)' : 'Co-op Visit Windows Period Configuration'}
                </h3>
              </div>
              <div className="text-xs text-slate-400">
                {isThai ? 'เจ้าหน้าที่กำหนดช่วงเวลา → อาจารย์เลือกวันนิเทศจริงในกรอบนี้' : 'Staff sets windows → Advisors schedule actual dates'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visitWindows.map((win) => (
                <div 
                  key={win.round} 
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{win.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        win.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        win.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {win.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{win.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-700">
                      <span className="text-[10px] text-slate-400 font-mono block uppercase">
                        {isThai ? 'กรอบเวลาที่อนุญาต' : 'Allowed Period'}
                      </span>
                      <strong>{win.startDate}</strong> &nbsp;—&nbsp; <strong>{win.endDate}</strong>
                    </div>

                    <button
                      onClick={() => setEditingWindow(win)}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-white text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Edit2 className="h-3 w-3 text-slate-500" />
                      <span>{isThai ? 'แก้ไขกรอบเวลา' : 'Edit Window'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Co-op Visit Monitoring Table */}
          <div className="space-y-3">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">
                  {isThai ? 'ตัวกรองการนิเทศ:' : 'Filter Monitoring:'}
                </span>
                <button
                  onClick={() => setVisitFilter('All')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    visitFilter === 'All' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isThai ? 'ทั้งหมด (All)' : 'All'}
                </button>
                <button
                  onClick={() => setVisitFilter('NotStarted')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    visitFilter === 'NotStarted' ? 'bg-rose-700 text-white shadow-2xs' : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {isThai ? 'อาจารย์ที่ยังไม่เริ่มนิเทศ (Not Started)' : 'Not Started'}
                </button>
                <button
                  onClick={() => setVisitFilter('Incomplete')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    visitFilter === 'Incomplete' ? 'bg-amber-700 text-white shadow-2xs' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {isThai ? 'อาจารย์ที่ยังนิเทศไม่ครบ 2 รอบ (Incomplete)' : 'Incomplete'}
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {filteredVisits.length} {isThai ? 'รายการติดตาม' : 'records'}
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">{isThai ? 'นักศึกษา / บริษัท' : 'Student & Company'}</th>
                      <th className="py-3.5 px-4">{isThai ? 'อาจารย์ที่ปรึกษา' : 'Adviser'}</th>
                      <th className="py-3.5 px-4">{isThai ? 'การนิเทศรอบที่ 1' : 'Round 1 Status'}</th>
                      <th className="py-3.5 px-4">{isThai ? 'การนิเทศรอบที่ 2' : 'Round 2 Status'}</th>
                      <th className="py-3.5 px-4">{isThai ? 'บันทึก / ข้อมูลนัดหมาย' : 'Visit Info & Notes'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVisits.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold text-slate-900">{v.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{v.studentId}</div>
                          <div className="text-xs text-slate-600 mt-0.5 font-medium">{v.companyName}</div>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <span className="font-bold text-[#6B122C]">{v.advisorName}</span>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            v.round1Status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            v.round1Status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              v.round1Status === 'Completed' ? 'bg-emerald-600' :
                              v.round1Status === 'Scheduled' ? 'bg-blue-600' :
                              'bg-slate-400'
                            }`} />
                            {v.round1Status}
                          </span>
                          {v.round1Date && (
                            <div className="text-[10px] text-slate-500 mt-1 font-mono">
                              {v.round1Date} {v.round1Mode && `(${v.round1Mode})`}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            v.round2Status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            v.round2Status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              v.round2Status === 'Completed' ? 'bg-emerald-600' :
                              v.round2Status === 'Scheduled' ? 'bg-blue-600' :
                              'bg-slate-400'
                            }`} />
                            {v.round2Status}
                          </span>
                          {v.round2Date && (
                            <div className="text-[10px] text-slate-500 mt-1 font-mono">
                              {v.round2Date} {v.round2Mode && `(${v.round2Mode})`}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 align-top text-slate-600">
                          <p className="text-[11px] leading-relaxed italic line-clamp-2">
                            "{v.visitNotes}"
                          </p>
                          {(v.round1Location || v.round2Location) && (
                            <p className="text-[10px] text-slate-400 mt-1 truncate max-w-xs">
                              📍 {v.round1Location || v.round2Location}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT VISIT WINDOW CONFIG                           */}
      {/* ========================================================= */}
      {editingWindow && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isThai ? `แก้ไขกรอบเวลานิเทศงานรอบที่ ${editingWindow.round}` : `Edit Co-op Visit Window (Round ${editingWindow.round})`}
                </h3>
                <p className="text-[10px] text-slate-400">{editingWindow.title}</p>
              </div>
              <button onClick={() => setEditingWindow(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVisitWindow} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'วันเริ่มต้นที่อนุญาต *' : 'Allowed Start Date *'}
                  </label>
                  <input 
                    type="date" 
                    required
                    value={editingWindow.startDate}
                    onChange={(e) => setEditingWindow({ ...editingWindow, startDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'วันสิ้นสุดที่อนุญาต *' : 'Allowed End Date *'}
                  </label>
                  <input 
                    type="date" 
                    required
                    value={editingWindow.endDate}
                    onChange={(e) => setEditingWindow({ ...editingWindow, endDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'สถานะกรอบเวลา' : 'Window Status'}
                </label>
                <select
                  value={editingWindow.status}
                  onChange={(e) => setEditingWindow({ ...editingWindow, status: e.target.value as any })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                >
                  <option value="Active">Active (เปิดให้อาจารย์นัดหมาย)</option>
                  <option value="Upcoming">Upcoming (เร็วๆ นี้)</option>
                  <option value="Closed">Closed (สิ้นสุดระยะเวลานิเทศรอบนี้)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'คำอธิบายเป้าหมายการนิเทศ' : 'Objectives Description'}
                </label>
                <textarea 
                  rows={2}
                  value={editingWindow.description}
                  onChange={(e) => setEditingWindow({ ...editingWindow, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingWindow(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer shadow-xs"
                >
                  {isThai ? 'บันทึกกรอบเวลา' : 'Save Window'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
