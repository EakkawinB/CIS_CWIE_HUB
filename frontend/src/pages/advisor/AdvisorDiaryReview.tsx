import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student, WeeklyReport } from '../../types';

interface AdvisorDiaryReviewProps {
  students: Student[];
  reports: WeeklyReport[];
  onApproveReport: (reportId: string, comment: string) => void;
  onRejectReport: (reportId: string, comment: string) => void;
}

export default function AdvisorDiaryReview({
  students,
  reports,
  onApproveReport,
  onRejectReport
}: AdvisorDiaryReviewProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCommentChange = (id: string, val: string) => {
    setCommentInputs({ ...commentInputs, [id]: val });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-150 text-left">
      
      {/* 1. Reports Review List (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isThai ? 'ตรวจบันทึกประจำสัปดาห์ (Weekly Diary Review)' : 'Weekly Diaries Awaiting Review'}
          </h3>
          <span className="text-xs text-[#6B122C] font-mono font-semibold">
            {reports.filter(r => r.status === 'Pending').length} {isThai ? 'รายการรอตรวจ' : 'Pending'}
          </span>
        </div>
        
        <div className="space-y-4">
          {reports.map((rep) => {
            const student = students.find(s => s.id === rep.studentId);
            const isPending = rep.status === 'Pending';

            return (
              <div key={rep.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {isThai ? 'นักศึกษา:' : 'Student:'} {student?.name || rep.studentName}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {isThai ? `สัปดาห์ที่ ${rep.weekNumber}` : `Week ${rep.weekNumber}`} • {rep.hoursWorked} {isThai ? 'ชั่วโมง' : 'hrs'}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    rep.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700 animate-pulse'
                  }`}>
                    {rep.status === 'Approved' ? (isThai ? 'อนุมัติแล้ว' : 'Approved') : (isThai ? 'รอตรวจ' : 'Pending')}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                    {isThai ? '1. รายละเอียดงานที่ทำ:' : 'Work Details Summary:'}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                    {rep.summary}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                  <div>
                    <b>{isThai ? 'ผลงานความสำเร็จหลัก:' : 'Key Achievements:'}</b>
                    <p className="italic text-slate-600">"{rep.achievements || (isThai ? 'ไม่ได้ระบุ' : 'None')}"</p>
                  </div>
                  <div>
                    <b>{isThai ? 'อุปสรรคปัญหาที่พบ:' : 'Obstacles Encountered:'}</b>
                    <p className="italic text-slate-600">"{rep.obstacles || (isThai ? 'ไม่ได้ระบุ' : 'None')}"</p>
                  </div>
                </div>

                {/* Review Comments & Approve / Reject actions */}
                {isPending && (
                  <div className="pt-3 border-t border-slate-200/80 space-y-2">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                      {isThai ? 'เขียน Review Comments (ข้อคิดเห็นเสนอแนะ)' : 'Submit Review Comments'}
                    </label>
                    <input 
                      type="text" 
                      value={commentInputs[rep.id] || ''}
                      onChange={(e) => handleCommentChange(rep.id, e.target.value)}
                      placeholder={isThai ? 'ให้ข้อเสนอแนะทางวิชาการแก่นักศึกษา...' : 'Provide technical feedback or improvement notes...'}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#6B122C]"
                    />
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => onRejectReport(rep.id, commentInputs[rep.id] || (isThai ? 'ต้องแก้ไขบันทึกเพิ่มเติม' : 'Requires revision'))}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
                      >
                        {isThai ? 'ต้องการการแก้ไข (Reject)' : 'Requires Edit'}
                      </button>
                      <button
                        onClick={() => onApproveReport(rep.id, commentInputs[rep.id] || (isThai ? 'บันทึกผ่านเกณฑ์วิชาการ' : 'Approved.'))}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#6B122C] hover:bg-[#580E24] rounded-lg cursor-pointer"
                      >
                        {isThai ? 'Approve Diary (อนุมัติบันทึก)' : 'Approve Diary'}
                      </button>
                    </div>
                  </div>
                )}

                {rep.advisorComment && (
                  <p className="text-[10px] text-[#6B122C] bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                    <b>{isThai ? 'ความคิดเห็นของคุณที่บันทึกไว้:' : 'Your Recorded Comment:'}</b> "{rep.advisorComment}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Guidelines & Rubrics Panel (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {isThai ? 'เกณฑ์การประเมินบันทึกประจำสัปดาห์' : 'Advisor Review Guidelines'}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {isThai 
            ? 'อาจารย์ที่ปรึกษาจำเป็นต้องตรวจสอบรายงานบันทึกสรุปประจำสัปดาห์ (Weekly Diary) ของนักศึกษา เพื่อประเมินความสอดคล้องกับวัตถุประสงค์ของหลักสูตรสหกิจศึกษา หากงานสั้นเกินไปหรือขาดรายละเอียดทางเทคนิค กรุณาแจ้งให้นักศึกษาแก้ไข'
            : 'Advisors must review student weekly diaries to ensure alignment with scientific cooperative learning objectives. Provide developmental feedback on technical depth and problem resolution.'}
        </p>
        <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 text-xs text-[#6B122C] space-y-1">
          <span className="font-bold block">{isThai ? 'แนวทางการตรวจ:' : 'Review Rubric:'}</span>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            <li>{isThai ? 'ชั่วโมงงานครบ 40 ชม./สัปดาห์' : 'Verified 40 weekly work hours'}</li>
            <li>{isThai ? 'มีการบันทึกปัญหาและวิธีแก้ไข' : 'Recorded challenges & solutions'}</li>
            <li>{isThai ? 'ตรงตามเป้าหมายของโครงงาน' : 'Aligned with project objectives'}</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
