import React, { useState } from 'react';
import {
  BookOpen, CheckCircle, Clock, AlertCircle, Plus, Calendar,
  Edit3, Save, X, Info,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WeeklyReport } from '../../types';

interface StudentWeeklyDiariesProps {
  reports: WeeklyReport[];
  onSubmitDiary: (diary: { summary: string; achievements: string; obstacles: string; hours: number }) => void;
  internshipPeriod?: { startDate: string; endDate: string } | null;
  onSaveInternshipPeriod?: (period: { startDate: string; endDate: string }) => void;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function StudentWeeklyDiaries({
  reports,
  onSubmitDiary,
  internshipPeriod,
  onSaveInternshipPeriod,
  onNotify,
}: StudentWeeklyDiariesProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  // Internship period state (B1/B2 - with localStorage fallback for persistency)
  const [period, setPeriod] = useState<{ startDate: string; endDate: string } | null>(() => {
    if (internshipPeriod) return internshipPeriod;
    try {
      const saved = localStorage.getItem('cwie_student_internship_period');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default fallback or mock: can be empty if you want
    return { startDate: '2026-06-01', endDate: '2026-09-18' };
  });

  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [startDateInput, setStartDateInput] = useState(period?.startDate || '2026-06-01');
  const [endDateInput, setEndDateInput] = useState(period?.endDate || '2026-09-18');
  const [periodError, setPeriodError] = useState<string | null>(null);

  // Validate and save period
  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    setPeriodError(null);

    if (!startDateInput || !endDateInput) {
      setPeriodError(
        isThai
          ? 'กรุณาระบุทั้งวันเริ่มต้นและวันสิ้นสุดการปฏิบัติงาน'
          : 'Please enter both start and end dates together.'
      );
      return;
    }
    if (new Date(endDateInput) < new Date(startDateInput)) {
      setPeriodError(
        isThai
          ? 'วันสิ้นสุดการปฏิบัติงานต้องไม่มาก่อนวันเริ่มต้นปฏิบัติงาน'
          : 'End date cannot be earlier than start date.'
      );
      return;
    }
    const newPeriod = { startDate: startDateInput, endDate: endDateInput };
    setPeriod(newPeriod);
    try {
      localStorage.setItem('cwie_student_internship_period', JSON.stringify(newPeriod));
    } catch {}
    onSaveInternshipPeriod?.(newPeriod);
    setIsEditingPeriod(false);
    onNotify?.(
      isThai ? 'บันทึกช่วงเวลาปฏิบัติงานสหกิจเรียบร้อยแล้ว' : 'Saved internship period successfully!',
      'success'
    );
  };

  const handleCancelEditPeriod = () => {
    setStartDateInput(period?.startDate || '');
    setEndDateInput(period?.endDate || '');
    setPeriodError(null);
    setIsEditingPeriod(false);
  };

  // Weekly diary form state
  const [form, setForm] = useState({
    summary: '',
    achievements: '',
    obstacles: '',
    hours: 40,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitDiary(form);
    setForm({ summary: '', achievements: '', obstacles: '', hours: 40 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">

      {/* ===== Internship Period Card (TOP) ===== */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-[#6B122C]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isThai
                  ? 'ช่วงเวลาปฏิบัติงานสหกิจ (Internship Period)'
                  : 'Internship Period'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isThai
                  ? 'กำหนดวันเริ่มต้นและวันสิ้นสุดการปฏิบัติงานจริงของนักศึกษา เพื่อใช้เป็นกรอบเวลาในการบันทึกไดอารี่'
                  : 'Your individual internship work term dates used to frame weekly progress tracking.'}
              </p>
            </div>
          </div>
          {!isEditingPeriod && period && (
            <button
              onClick={() => {
                setStartDateInput(period.startDate);
                setEndDateInput(period.endDate);
                setPeriodError(null);
                setIsEditingPeriod(true);
              }}
              className="px-3 py-1.5 border border-slate-200 hover:border-[#6B122C] text-slate-700 hover:text-[#6B122C] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isThai ? 'แก้ไขช่วงเวลา' : 'Edit Period'}</span>
            </button>
          )}
        </div>

        {!isEditingPeriod && period ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                {isThai
                  ? 'วันเริ่มปฏิบัติงาน (Start Date)'
                  : 'Internship Start Date'}
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                {period.startDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                {isThai
                  ? 'วันสิ้นสุดปฏิบัติงาน (End Date)'
                  : 'Internship End Date'}
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                {period.endDate}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSavePeriod} className="space-y-4 pt-1 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isThai
                    ? '1. วันเริ่มปฏิบัติงาน (Start Date) *'
                    : '1. Internship Start Date *'}
                </label>
                <input
                  type="date"
                  required
                  value={startDateInput}
                  onChange={(e) => {
                    setStartDateInput(e.target.value);
                    setPeriodError(null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#6B122C]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isThai
                    ? '2. วันสิ้นสุดปฏิบัติงาน (End Date) *'
                    : '2. Internship End Date *'}
                </label>
                <input
                  type="date"
                  required
                  value={endDateInput}
                  onChange={(e) => {
                    setEndDateInput(e.target.value);
                    setPeriodError(null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#6B122C]"
                />
              </div>
            </div>
            {periodError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{periodError}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#6B122C] hover:bg-[#580E24] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isThai ? 'บันทึกช่วงเวลาปฏิบัติงาน' : 'Save Internship Period'}</span>
              </button>
              {period && (
                <button
                  type="button"
                  onClick={handleCancelEditPeriod}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* ===== Two-column Section: Diary Form + Diary History ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* FORM: Submit Weekly Diary */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="border-b border-slate-50 pb-3 mb-2">
            <h2 className="text-base font-bold text-slate-900">
              {isThai
                ? `เขียนบันทึกประจำสัปดาห์ที่ ${reports.length + 1} (Weekly Diary)`
                : `Add Week ${reports.length + 1} Weekly Diary`}
            </h2>
            <p className="text-xs text-slate-400">
              {isThai
                ? 'เขียนรายละเอียดงานที่ได้ทำ ปัญหาและอุปสรรคที่พบระหว่างสัปดาห์ เพื่อให้อาจารย์ที่ปรึกษาตรวจและอนุมัติ'
                : 'Record details of work completed and engineering obstacles encountered for advisor review.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isThai ? 'จำนวนชั่วโมงปฏิบัติงาน (ชม.)' : 'Hours Worked'}
                </label>
                <input
                  type="number"
                  required
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>
              {/* Read-only: week # (system-generated) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {isThai ? 'สัปดาห์และช่วงวันที่ (ระบบกำหนด)' : 'Target Week (System-Generated)'}
                </label>
                <input
                  type="text"
                  disabled
                  value={isThai ? `สัปดาห์ที่ ${reports.length + 1}` : `Week ${reports.length + 1}`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs outline-none text-slate-500 cursor-not-allowed font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isThai
                  ? '1. เขียนรายละเอียดงานที่ได้ทำ (Work Details Completed)'
                  : '1. Details of Work Completed'}
              </label>
              <textarea
                rows={3}
                required
                placeholder={isThai
                  ? 'ระบุหน้าที่ ความรับผิดชอบ และงานเชิงเทคนิคที่ได้ลงมือปฏิบัติในสัปดาห์นี้...'
                  : 'Write detailed summary of tasks and engineering operations accomplished...'}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#6B122C] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isThai
                  ? '2. ผลงานและความสำเร็จหลัก (Key Achievements)'
                  : '2. Key Achievements'}
              </label>
              <textarea
                rows={2}
                placeholder={isThai
                  ? 'เช่น พัฒนาระบบ Authenticate ด้วย JWT สำเร็จ, แก้ไขบั๊กหน้า Dashboard...'
                  : 'e.g. Completed JWT auth flow, merged UI PR to develop branch...'}
                value={form.achievements}
                onChange={(e) => setForm({ ...form, achievements: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#6B122C] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {isThai
                  ? '3. เขียนปัญหาและอุปสรรคที่พบ (Problems / Obstacles Encountered)'
                  : '3. Problems / Obstacles Encountered'}
              </label>
              <textarea
                rows={2}
                placeholder={isThai
                  ? 'อธิบายปัญหาเชิงเทคนิค ข้อติดขัด และแนวทางแก้ไขหรือปรึกษาพี่เลี้ยง...'
                  : 'Describe technical blockers, API latency bugs, or knowledge gaps resolved...'}
                value={form.obstacles}
                onChange={(e) => setForm({ ...form, obstacles: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#6B122C] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#6B122C] hover:bg-[#580E24] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isThai
                ? 'ส่งบันทึกประจำสัปดาห์ให้อาจารย์ที่ปรึกษา'
                : 'Submit Weekly Diary to Advisor'}
            </button>
          </form>
        </div>

        {/* SUBMITTED DIARIES HISTORY */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isThai
                ? 'ประวัติบันทึกที่ส่งแล้ว (Submitted Diaries)'
                : 'Submitted Diaries Status'}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {reports.length} {isThai ? 'สัปดาห์' : 'weeks'}
            </span>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[560px] pr-1">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {isThai ? `บันทึกสัปดาห์ที่ ${rep.weekNumber}` : `Week ${rep.weekNumber} Diary`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rep.hoursWorked} {isThai ? 'ชม.' : 'hrs'} • {rep.startDate} - {rep.endDate}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    rep.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : rep.status === 'Requires Edit'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {rep.status === 'Approved'
                      ? (isThai ? 'อนุมัติแล้ว' : 'Approved')
                      : (isThai ? 'รอตรวจ' : 'Pending')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {rep.summary}
                </p>
                {rep.advisorComment && (
                  <div className="p-2.5 bg-rose-50/50 border border-rose-100 rounded-xl text-[10px] text-[#6B122C] leading-relaxed">
                    <b>{isThai ? 'ความเห็นจากอาจารย์ที่ปรึกษา:' : 'Advisor Feedback:'}</b> "{rep.advisorComment}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
