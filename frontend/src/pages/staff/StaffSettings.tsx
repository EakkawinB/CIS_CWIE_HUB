import React, { useState } from 'react';
import { 
  Settings, Calendar, Clock, Sliders, Save, CheckCircle2, 
  Check, X, Plus, Edit2, Trash2, Power, AlertCircle, Shield, 
  ArrowRight, Flag, Layers, BookmarkCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StaffSettingsProps {
  initialSubTab?: 'academic-year' | 'timeline' | 'permissions';
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

// 1. Academic Year Period Interface
export interface AcademicPeriod {
  id: string;
  yearTh: string; // e.g. 2569
  yearEn: string; // e.g. 2026
  semester: '1' | '2' | 'Summer';
  batchRound: string; // e.g. 'รุ่นที่ 1 (ปกติ)', 'รุ่นที่ 2 (พิเศษ)'
  status: 'Open' | 'Closed' | 'Upcoming';
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

// 2. Timeline Milestone Interface
export interface TimelineMilestone {
  id: string;
  nameTh: string;
  nameEn: string;
  category: 'Preparation' | 'WorkTerm' | 'Assessment';
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  descriptionTh: string;
  descriptionEn: string;
}

export default function StaffSettings({
  initialSubTab = 'academic-year',
  onNotify
}: StaffSettingsProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeSubTab, setActiveSubTab] = useState<'academic-year' | 'timeline' | 'permissions'>(
    initialSubTab === 'timeline' ? 'timeline' : initialSubTab === 'permissions' ? 'permissions' : 'academic-year'
  );

  // ---------------------------------------------------------------------------
  // 1. ACADEMIC YEAR STATE
  // ---------------------------------------------------------------------------
  const [academicPeriods, setAcademicPeriods] = useState<AcademicPeriod[]>([
    {
      id: 'AY-2569-1',
      yearTh: '2569',
      yearEn: '2026',
      semester: '1',
      batchRound: 'รุ่นที่ 1 (ภาคปกติ & ภาคสมทบ)',
      status: 'Open',
      isCurrent: true,
      startDate: '2026-06-01',
      endDate: '2026-10-31'
    },
    {
      id: 'AY-2569-2',
      yearTh: '2569',
      yearEn: '2026',
      semester: '2',
      batchRound: 'รุ่นที่ 2 (ภาคการศึกษาที่ 2)',
      status: 'Upcoming',
      isCurrent: false,
      startDate: '2026-11-15',
      endDate: '2027-03-31'
    },
    {
      id: 'AY-2568-2',
      yearTh: '2568',
      yearEn: '2025',
      semester: '2',
      batchRound: 'รุ่นที่ 2 (ปีการศึกษา 2568)',
      status: 'Closed',
      isCurrent: false,
      startDate: '2025-11-15',
      endDate: '2026-03-31'
    }
  ]);

  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<AcademicPeriod | null>(null);
  const [periodForm, setPeriodForm] = useState({
    yearTh: '2570',
    yearEn: '2027',
    semester: '1' as '1' | '2' | 'Summer',
    batchRound: 'รุ่นที่ 1',
    status: 'Upcoming' as 'Open' | 'Closed' | 'Upcoming',
    startDate: '2027-06-01',
    endDate: '2027-10-31'
  });

  const handleSetCurrentPeriod = (id: string) => {
    setAcademicPeriods(academicPeriods.map(p => ({
      ...p,
      isCurrent: p.id === id
    })));
    const selected = academicPeriods.find(p => p.id === id);
    onNotify?.(
      isThai 
        ? `ตั้งค่าปีการศึกษาปัจจุบันเป็น ${selected?.yearTh}/${selected?.semester} แล้ว` 
        : `Active academic period set to ${selected?.yearEn}/${selected?.semester}!`,
      'success'
    );
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPeriod) {
      setAcademicPeriods(academicPeriods.map(p => p.id === editingPeriod.id ? editingPeriod : p));
      setEditingPeriod(null);
      onNotify?.(isThai ? 'บันทึกการแก้ไขปีการศึกษาสำเร็จ' : 'Updated academic period!', 'success');
    } else {
      const newPeriod: AcademicPeriod = {
        id: `AY-${periodForm.yearTh}-${periodForm.semester}-${Date.now().toString().slice(-3)}`,
        ...periodForm,
        isCurrent: false
      };
      setAcademicPeriods([...academicPeriods, newPeriod]);
      setIsAddingPeriod(false);
      onNotify?.(isThai ? 'เพิ่มปีการศึกษาใหม่สำเร็จ' : 'Added academic period!', 'success');
    }
  };

  const handleDeletePeriod = (id: string) => {
    setAcademicPeriods(academicPeriods.filter(p => p.id !== id));
    onNotify?.(isThai ? 'ลบข้อมูลปีการศึกษาเรียบร้อย' : 'Deleted academic period.', 'info');
  };

  // ---------------------------------------------------------------------------
  // 2. TIMELINE CO-OP STATE (Distinct configuration concern)
  // ---------------------------------------------------------------------------
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([
    {
      id: 'TL-01',
      nameTh: 'ช่วงรับสมัครและยื่นคำร้องเข้าร่วมสหกิจ (Co-op Application Period)',
      nameEn: 'Co-op Application & Registration Period',
      category: 'Preparation',
      startDate: '2026-03-01',
      endDate: '2026-04-30',
      isCurrent: false,
      status: 'Completed',
      descriptionTh: 'นักศึกษากรอกข้อมูลส่วนตัว ประวัติ และยื่นแบบคำร้องขอไปสหกิจศึกษา',
      descriptionEn: 'Students submit initial application and required prerequisites'
    },
    {
      id: 'TL-02',
      nameTh: 'ช่วงคัดเลือกและจับคู่สถานประกอบการ (Company Placement / Matching)',
      nameEn: 'Company Placement / Matching Period',
      category: 'Preparation',
      startDate: '2026-05-01',
      endDate: '2026-05-25',
      isCurrent: false,
      status: 'Completed',
      descriptionTh: 'สัมภาษณ์กับสถานประกอบการ ออกหนังสือขอความอนุเคราะห์ และยืนยันการตอบรับ',
      descriptionEn: 'Interviews, official acceptance letters, and student matching'
    },
    {
      id: 'TL-03',
      nameTh: 'ช่วงปฏิบัติงานสหกิจศึกษาในสถานประกอบการ (Internship / Work Term)',
      nameEn: 'Internship / Work Term Period',
      category: 'WorkTerm',
      startDate: '2026-06-01',
      endDate: '2026-09-30',
      isCurrent: true,
      status: 'In Progress',
      descriptionTh: 'ระยะเวลา 16 สัปดาห์เต็ม บันทึกเวลาปฏิบัติงาน (Timesheet) ประจำวัน',
      descriptionEn: '16 weeks of full-time on-site work and daily timesheet logging'
    },
    {
      id: 'TL-04',
      nameTh: 'ช่วงอาจารย์นิเทศก์ออกตรวจเยี่ยมนักศึกษา (Adviser Supervision / Visit Window)',
      nameEn: 'Adviser Supervision / Visit Window',
      category: 'WorkTerm',
      startDate: '2026-07-15',
      endDate: '2026-08-31',
      isCurrent: false,
      status: 'In Progress',
      descriptionTh: 'อาจารย์ที่ปรึกษาลงพื้นที่หรือนิเทศออนไลน์ พร้อมบันทึกผลการนิเทศ',
      descriptionEn: 'Advisers visit companies on-site or conduct virtual supervisions'
    },
    {
      id: 'TL-05',
      nameTh: 'กำหนดส่งรูปเล่มรายงานสหกิจฉบับสมบูรณ์ (Report Submission Deadline)',
      nameEn: 'Final Report Submission Deadline',
      category: 'Assessment',
      startDate: '2026-09-10',
      endDate: '2026-09-20',
      isCurrent: false,
      status: 'Upcoming',
      descriptionTh: 'นักศึกษาอัปโหลดไฟล์รายงานโครงงานสหกิจศึกษาพร้อมเอกสารรับรอง',
      descriptionEn: 'Final project report and signed mentor approval submission'
    },
    {
      id: 'TL-06',
      nameTh: 'ช่วงการสอบปากเปล่าโครงงานสหกิจ (Examination / Defense Period)',
      nameEn: 'Examination / Defense Period',
      category: 'Assessment',
      startDate: '2026-09-22',
      endDate: '2026-09-30',
      isCurrent: false,
      status: 'Upcoming',
      descriptionTh: 'นำเสนอโครงงานต่อหน้าคณะกรรมการประจำห้องสอบตามเวลาที่กำหนด',
      descriptionEn: 'Oral project defense evaluated by assigned room committees'
    },
    {
      id: 'TL-07',
      nameTh: 'ช่วงประเมินผลและตัดเกรดสรุป (Evaluation & Grade Period)',
      nameEn: 'Evaluation & Final Grading Period',
      category: 'Assessment',
      startDate: '2026-10-01',
      endDate: '2026-10-15',
      isCurrent: false,
      status: 'Upcoming',
      descriptionTh: 'รวบรวมคะแนนอาจารย์และพี่เลี้ยง เพื่อคำนวณและตัดเกรดส่งทะเบียน',
      descriptionEn: 'Consolidate committee and mentor assessments for final grading'
    }
  ]);

  const [editingMilestone, setEditingMilestone] = useState<TimelineMilestone | null>(null);

  const handleSetCurrentMilestone = (id: string) => {
    setMilestones(milestones.map(m => ({
      ...m,
      isCurrent: m.id === id,
      status: m.id === id ? 'In Progress' : m.status
    })));
    const target = milestones.find(m => m.id === id);
    onNotify?.(
      isThai 
        ? `ปรับหมุดหมาย "${target?.nameTh}" ให้เป็นช่วงเวลาปัจจุบันแล้ว` 
        : `Marked "${target?.nameEn}" as the active/current milestone!`,
      'info'
    );
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;

    setMilestones(milestones.map(m => m.id === editingMilestone.id ? editingMilestone : m));
    setEditingMilestone(null);
    onNotify?.(
      isThai ? 'บันทึกการปรับปรุงช่วงเวลาไทม์ไลน์สหกิจสำเร็จ' : 'Updated milestone dates successfully!',
      'success'
    );
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Sub-tab 1: Academic Year Settings */}
          <button
            onClick={() => setActiveSubTab('academic-year')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'academic-year'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>{isThai ? 'Academic Year (ตั้งค่าปีการศึกษา)' : 'Academic Year Settings'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {academicPeriods.length}
            </span>
          </button>

          {/* Sub-tab 2: Timeline Co-op */}
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'timeline'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{isThai ? 'Timeline Co-op (ไทม์ไลน์วงจรชีวิตสหกิจ)' : 'Timeline Co-op'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {milestones.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. ACADEMIC YEAR SETTINGS SUB-SECTION                     */}
      {/* ========================================================= */}
      {activeSubTab === 'academic-year' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'จัดการปีการศึกษาและภาคเรียนสหกิจ (Academic Year & Semester)' : 'Academic Year & Semester'}
              </h3>
              <p className="text-xs text-slate-500">
                {isThai 
                  ? 'กำหนดปีการศึกษาที่เปิดรับ ปิดรับ หรือกำลังจะมาถึง พร้อมสลับปีการศึกษาที่ใช้งานอยู่ปัจจุบัน (Current Active Period)' 
                  : 'Configure operational academic year, semesters, rounds, status, and active operational period.'}
              </p>
            </div>
            <button
              onClick={() => setIsAddingPeriod(true)}
              className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{isThai ? 'เพิ่มปีการศึกษา' : 'Add Academic Period'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicPeriods.map((period) => (
              <div 
                key={period.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs space-y-4 transition-all ${
                  period.isCurrent 
                    ? 'border-[#6B122C] ring-2 ring-[#6B122C]/10' 
                    : 'border-slate-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">
                        {isThai ? `ปี ${period.yearTh}` : `Year ${period.yearEn}`}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                        {isThai ? `ภาคเรียนที่ ${period.semester}` : `Term ${period.semester}`}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium block mt-1">
                      {period.batchRound}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    period.status === 'Open' ? 'bg-emerald-100 text-emerald-800' :
                    period.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {period.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{isThai ? 'วันเริ่มต้นภาคเรียน:' : 'Start Date:'}</span>
                    <strong className="font-mono text-slate-800">{period.startDate}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{isThai ? 'วันสิ้นสุดภาคเรียน:' : 'End Date:'}</span>
                    <strong className="font-mono text-slate-800">{period.endDate}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {period.isCurrent ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#6B122C]/10 text-[#6B122C] text-xs font-bold">
                      <BookmarkCheck className="h-4 w-4" />
                      <span>{isThai ? 'ภาคเรียนปัจจุบัน' : 'Current Active'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetCurrentPeriod(period.id)}
                      className="px-3 py-1 border border-slate-200 hover:border-[#6B122C] hover:text-[#6B122C] text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                    >
                      {isThai ? 'เลือกเป็นปัจจุบัน' : 'Set as Current'}
                    </button>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingPeriod(period)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title={isThai ? 'แก้ไข' : 'Edit'}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    {!period.isCurrent && (
                      <button
                        onClick={() => handleDeletePeriod(period.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title={isThai ? 'ลบ' : 'Delete'}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TIMELINE CO-OP SUB-SECTION                             */}
      {/* ========================================================= */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'กำหนดการไทม์ไลน์วงจรชีวิตสหกิจศึกษา (Timeline Co-op Milestones)' : 'Timeline Co-op Lifecycle'}
              </h3>
              <p className="text-xs text-slate-500">
                {isThai 
                  ? 'กำหนดช่วงเวลาสำคัญ: รับสมัคร, คัดเลือก, ปฏิบัติงาน, นิเทศก์, กำหนดส่งเล่ม, สอบปากเปล่า, และประเมินผล' 
                  : 'Manage critical dates: Application, Placement, Internship, Visits, Report Deadline, Defense, and Evaluation.'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              {milestones.length} {isThai ? 'หมุดหมายหลัก' : 'Milestones'}
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="space-y-4">
              {milestones.map((m, idx) => (
                <div 
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    m.isCurrent 
                      ? 'border-[#6B122C] bg-[#6B122C]/5 ring-1 ring-[#6B122C]/20' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono inline-flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">
                          {isThai ? m.nameTh : m.nameEn}
                        </h4>
                        {m.isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6B122C] text-white">
                            {isThai ? 'กำลังดำเนินการขณะนี้' : 'Active Milestone'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 pl-8">
                        {isThai ? m.descriptionTh : m.descriptionEn}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pl-8 lg:pl-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">
                          {isThai ? 'ช่วงเวลากำหนดการ' : 'Date Range'}
                        </span>
                        <strong className="font-mono text-xs text-slate-800">
                          {m.startDate} – {m.endDate}
                        </strong>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        m.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {m.status}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingMilestone(m)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title={isThai ? 'แก้ไขวันที่' : 'Edit Milestone'}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {!m.isCurrent && (
                          <button
                            onClick={() => handleSetCurrentMilestone(m.id)}
                            className="px-2.5 py-1 text-[11px] font-bold border border-slate-200 text-slate-600 hover:text-[#6B122C] hover:border-[#6B122C] rounded-lg cursor-pointer transition-colors"
                          >
                            {isThai ? 'ตั้งเป็นหมุดปัจจุบัน' : 'Mark Current'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT ACADEMIC PERIOD                         */}
      {/* ========================================================= */}
      {(isAddingPeriod || editingPeriod) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingPeriod 
                  ? (isThai ? 'แก้ไขปีการศึกษา' : 'Edit Academic Period')
                  : (isThai ? 'เพิ่มปีการศึกษาใหม่' : 'Add Academic Period')}
              </h3>
              <button onClick={() => { setIsAddingPeriod(false); setEditingPeriod(null); }} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSavePeriod} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'ปี พ.ศ. (ไทย) *' : 'Year (B.E.) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPeriod ? editingPeriod.yearTh : periodForm.yearTh}
                    onChange={(e) => {
                      if (editingPeriod) setEditingPeriod({ ...editingPeriod, yearTh: e.target.value });
                      else setPeriodForm({ ...periodForm, yearTh: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'ปี ค.ศ. (En) *' : 'Year (A.D.) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPeriod ? editingPeriod.yearEn : periodForm.yearEn}
                    onChange={(e) => {
                      if (editingPeriod) setEditingPeriod({ ...editingPeriod, yearEn: e.target.value });
                      else setPeriodForm({ ...periodForm, yearEn: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'ภาคการศึกษา *' : 'Semester *'}
                  </label>
                  <select
                    value={editingPeriod ? editingPeriod.semester : periodForm.semester}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      if (editingPeriod) setEditingPeriod({ ...editingPeriod, semester: val });
                      else setPeriodForm({ ...periodForm, semester: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'สถานะ *' : 'Status *'}
                  </label>
                  <select
                    value={editingPeriod ? editingPeriod.status : periodForm.status}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      if (editingPeriod) setEditingPeriod({ ...editingPeriod, status: val });
                      else setPeriodForm({ ...periodForm, status: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Open">Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'รุ่น / ข้อความรอบการจัด *' : 'Batch / Round Description *'}
                </label>
                <input
                  type="text"
                  required
                  value={editingPeriod ? editingPeriod.batchRound : periodForm.batchRound}
                  onChange={(e) => {
                    if (editingPeriod) setEditingPeriod({ ...editingPeriod, batchRound: e.target.value });
                    else setPeriodForm({ ...periodForm, batchRound: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'วันเริ่มต้น *' : 'Start Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={editingPeriod ? editingPeriod.startDate : periodForm.startDate}
                    onChange={(e) => {
                      if (editingPeriod) setEditingPeriod({ ...editingPeriod, startDate: e.target.value });
                      else setPeriodForm({ ...periodForm, startDate: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'วันสิ้นสุด *' : 'End Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={editingPeriod ? editingPeriod.endDate : periodForm.endDate}
                    onChange={(e) => {
                      if (editingPeriod) setEditingPeriod({ ...editingPeriod, endDate: e.target.value });
                      else setPeriodForm({ ...periodForm, endDate: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddingPeriod(false); setEditingPeriod(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer"
                >
                  {isThai ? 'บันทึก' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT MILESTONE                                     */}
      {/* ========================================================= */}
      {editingMilestone && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'แก้ไขกำหนดการหมุดหมาย' : 'Edit Milestone Schedule'}
              </h3>
              <button onClick={() => setEditingMilestone(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'ชื่อหมุดหมาย (ไทย):' : 'Milestone Name (TH):'}
                </label>
                <input
                  type="text"
                  required
                  value={editingMilestone.nameTh}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, nameTh: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'ชื่อหมุดหมาย (En):' : 'Milestone Name (EN):'}
                </label>
                <input
                  type="text"
                  required
                  value={editingMilestone.nameEn}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, nameEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'วันเริ่มต้น *' : 'Start Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={editingMilestone.startDate}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'วันสิ้นสุด *' : 'End Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={editingMilestone.endDate}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'สถานะหมุดหมาย:' : 'Status:'}
                </label>
                <select
                  value={editingMilestone.status}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="In Progress">{isThai ? 'กำลังดำเนินการ (In Progress)' : 'In Progress'}</option>
                  <option value="Completed">{isThai ? 'เสร็จสิ้น (Completed)' : 'Completed'}</option>
                  <option value="Upcoming">{isThai ? 'กำลังจะมาถึง (Upcoming)' : 'Upcoming'}</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer"
                >
                  {isThai ? 'บันทึก' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
