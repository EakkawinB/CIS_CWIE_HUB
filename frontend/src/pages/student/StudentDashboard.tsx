import React, { useEffect, useState } from 'react';
import { Clock, FileText, Calendar, CheckCircle, AlertCircle, ArrowRight, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student, Document, ExaminationInfo, CoopTimelineStage } from '../../types';
import { getMyAdvisor, StudentAdvisorDto } from '../../services/api';

interface StudentDashboardProps {
  student: Student;
  documents: Document[];
  exam: ExaminationInfo;
  timelineStages: CoopTimelineStage[];
  onNavigateTab: (tab: 'dashboard' | 'companies' | 'matching' | 'documents' | 'reports' | 'timesheets' | 'examination' | 'profile') => void;
}

export default function StudentDashboard({
  student,
  documents,
  exam,
  timelineStages,
  onNavigateTab
}: StudentDashboardProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');
  const [advisor, setAdvisor] = useState<StudentAdvisorDto | null>(null);
  const [advisorLoading, setAdvisorLoading] = useState(true);
  const [advisorError, setAdvisorError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAdvisor() {
      try {
        setAdvisorLoading(true);
        setAdvisorError(false);
        const response = await getMyAdvisor();
        if (!cancelled) setAdvisor(response);
      } catch {
        if (!cancelled) setAdvisorError(true);
      } finally {
        if (!cancelled) setAdvisorLoading(false);
      }
    }

    void loadAdvisor();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-rose-50 text-[#6B122C] flex items-center justify-center shrink-0">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            {isThai ? 'อาจารย์ที่ปรึกษา' : 'Academic Advisor'}
          </span>
          {advisorLoading ? (
            <p className="text-sm text-slate-500">{isThai ? 'กำลังโหลดข้อมูล...' : 'Loading...'}</p>
          ) : advisorError ? (
            <p className="text-sm text-rose-700">{isThai ? 'ไม่สามารถโหลดข้อมูลอาจารย์ที่ปรึกษาได้' : 'Unable to load advisor information.'}</p>
          ) : (
            <p className="text-sm font-bold text-slate-900">
              {advisor?.advisor_name ?? (isThai ? 'ยังไม่ได้รับการจัดสรรอาจารย์ที่ปรึกษา' : 'No advisor has been assigned.')}
            </p>
          )}
        </div>
      </div>
      
      {/* 1. Internship / Placement Information Banner */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            {isThai ? 'ข้อมูลตำแหน่งและการฝึกงาน' : 'Internship Placement Information'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-slate-900">
              {isThai ? 'สถานประกอบการที่ได้รับการตอบรับ:' : 'Assigned Enterprise:'}
            </span>
            <span className="px-2.5 py-0.5 bg-rose-50 text-[#6B122C] border border-rose-100 text-xs font-semibold rounded-full">
              NexaTech Solutions Co., Ltd.
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isThai 
              ? 'ตำแหน่ง: นักพัฒนาฟรอนต์เอนด์ (React Intern) • เริ่มปฏิบัติงาน: 1 มิถุนายน 2569 - สิ้นสุด: 18 กันยายน 2569 (รวม 16 สัปดาห์)'
              : 'Position: Frontend Developer (React Intern) • Period: June 01, 2026 - September 18, 2026 (16 Weeks)'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            {isThai ? 'ความคืบหน้ารวม:' : 'Overall Progress:'}
          </span>
          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#6B122C] h-full rounded-full" style={{ width: `${student.progress}%` }} />
          </div>
          <span className="text-xs font-semibold text-slate-700">{student.progress}%</span>
        </div>
      </div>

      {/* 2. CWIE Timeline - Clearly indicating current process/stage */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isThai ? 'Timeline ของสหกิจศึกษา (CWIE Milestones)' : 'CWIE Cooperative Timeline & Progress'}
          </h3>
          <span className="text-[11px] font-semibold text-[#6B122C] font-mono">
            {isThai ? 'ขั้นตอนปัจจุบัน: การนิเทศงานรอบที่ 2' : 'Current Stage: Co-op Visit Round 2'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {timelineStages.map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';

            return (
              <div 
                key={stage.id} 
                className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
                  isCompleted 
                    ? 'bg-emerald-50/30 border-emerald-100 text-emerald-800' 
                    : isCurrent
                      ? 'bg-rose-50/40 border-rose-200 text-[#6B122C] ring-2 ring-rose-100'
                      : 'bg-slate-50/40 border-slate-100 text-slate-500'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-xs font-bold">
                    {stage.stepNumber}. {isThai ? stage.titleTh : stage.title}
                  </span>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4 text-[#6B122C] shrink-0 animate-pulse" />
                  ) : null}
                </div>
                <span className="text-[10px] font-mono block opacity-80 mb-1">{stage.dateRange}</span>
                <p className="text-[10px] opacity-70 leading-normal">
                  {isThai ? stage.descTh : stage.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Three Columns: Upcoming Documents, Document Status, and Examination Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Col 1: Upcoming Documents (upcoming tasks) */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{isThai ? 'upcoming เอกสารที่ต้องทำต่อไป' : 'Upcoming Documents & Tasks'}</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl space-y-1.5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-800">
                  {isThai ? 'แก้ไขแบบฟอร์มประเมินผลกลางภาค' : 'Revise Midterm Evaluation'}
                </span>
                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                  {isThai ? 'ด่วน' : 'Urgent'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                {isThai ? 'ต้องมีลายเซ็นพี่เลี้ยงและประทับตราสถานประกอบการ' : 'Requires mentor signature & official stamp'}
              </p>
              <button
                onClick={() => onNavigateTab('documents')}
                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                {isThai ? 'ไปที่หน้าเอกสาร' : 'Go to Documents'} <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-800">
                  {isThai ? 'ส่งบันทึกประจำสัปดาห์ที่ 4' : 'Submit Week 4 Diary'}
                </span>
                <span className="text-[9px] bg-slate-200 text-slate-600 font-semibold px-1.5 py-0.5 rounded">
                  {isThai ? 'กำหนดศุกร์นี้' : 'This Friday'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {isThai ? 'บันทึกสรุปผลการพัฒนาระบบและอุปสรรคที่พบ' : 'Log sprint tasks and engineering roadblocks'}
              </p>
            </div>
          </div>
        </div>

        {/* Col 2: Status of All Documents */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isThai ? 'Status ของเอกสารทั้งหมด' : 'All Documents Status'}
            </h3>
            <button
              onClick={() => onNavigateTab('documents')}
              className="text-[10px] font-semibold text-[#6B122C] hover:underline cursor-pointer"
            >
              {isThai ? 'ดูทั้งหมด' : 'View All'}
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <div className="truncate max-w-[170px]">
                  <span className="font-semibold text-slate-800 block truncate text-[11px]">{doc.name}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{doc.category}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  doc.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700'
                    : doc.status === 'Submitted'
                      ? 'bg-rose-50 text-[#6B122C] border border-rose-100'
                      : doc.status === 'Action Required'
                        ? 'bg-amber-50 text-amber-700 animate-pulse'
                        : 'bg-slate-100 text-slate-500'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Examination Board / Examination Information */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#6B122C]" />
              <span>{isThai ? 'Examination Board (ข้อมูลการสอบ)' : 'Examination Board Info'}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('examination')}
              className="text-[10px] font-semibold text-[#6B122C] hover:underline cursor-pointer"
            >
              {isThai ? 'รายละเอียด' : 'Details'}
            </button>
          </div>

          <div className="p-3.5 bg-rose-50/40 border border-rose-100 rounded-xl space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] font-mono text-[#6B122C] uppercase block">{isThai ? 'วัน-เวลาสอบ:' : 'Exam Date & Time:'}</span>
              <span className="font-bold text-slate-900">{exam.date} • {exam.time}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#6B122C] uppercase block">{isThai ? 'ห้องสอบ:' : 'Venue / Room:'}</span>
              <span className="font-semibold text-slate-800">{exam.room}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#6B122C] uppercase block">{isThai ? 'ประธานกรรมการสอบ:' : 'Board Chair:'}</span>
              <span className="text-slate-700">{exam.chair}</span>
            </div>

            <div className="pt-2 border-t border-rose-200/50 flex justify-between items-center">
              <span className="text-[10px] text-slate-500">{isThai ? 'สถานะรายงานตัว:' : 'Check-in:'}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                exam.checkedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {exam.checkedIn ? (isThai ? 'รายงานตัวแล้ว' : 'Checked In') : (isThai ? 'ยังไม่ได้รายงานตัว' : 'Not Checked In')}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
