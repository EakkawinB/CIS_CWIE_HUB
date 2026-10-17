import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, FileSpreadsheet, Download, PenTool, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Timesheet } from '../../types';

interface MentorTimesheetReviewProps {
  timesheets: Timesheet[];
  onSignTimesheet: (timesheetId: string, mentorName: string) => void;
  onRejectTimesheet: (timesheetId: string) => void;
}

export default function MentorTimesheetReview({
  timesheets,
  onSignTimesheet,
  onRejectTimesheet
}: MentorTimesheetReviewProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const mentorName = 'คุณสมศักดิ์ พิพัฒน์พัฒนา (Lead Architect)';

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Header */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isThai ? 'Timesheets Report Review (ตรวจและลงนามอนุมัติใบลงเวลา)' : 'Timesheets Report Review & Digital Signature'}
          </h2>
          <p className="text-xs text-slate-400">
            {isThai 
              ? 'ตรวจสอบชั่วโมงการทำงานจริงของนักศึกษาในสถานประกอบการ และลงนามรับรองใบลงเวลาประจำสัปดาห์'
              : 'Review submitted work hours and digitally sign weekly timesheet audit sheets.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{isThai ? 'รอลงนามรับรอง:' : 'Awaiting Signatures:'}</span>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-lg border border-amber-200">
            {timesheets.filter(t => t.status === 'Pending').length} {isThai ? 'ฉบับ' : 'Files'}
          </span>
        </div>
      </div>

      {/* Timesheets List */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {isThai ? 'รายการใบลงเวลาปฏิบัติงานของนักศึกษา (Intern Timesheets Queue)' : 'Weekly Timesheets Queue'}
        </h3>

        <div className="space-y-3">
          {timesheets.map((ts) => {
            const isPending = ts.status === 'Pending';
            const isApproved = ts.status === 'Approved';

            return (
              <div 
                key={ts.id} 
                className="p-5 bg-slate-50/80 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {isThai ? `ใบลงเวลาสัปดาห์ที่ ${ts.weekNumber}` : `Week ${ts.weekNumber} Timesheet`} — {ts.studentName || 'กษิดิศ พรหมศร'}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {ts.startDate} — {ts.endDate} • {ts.fileName || 'timesheet.pdf'}
                      </p>
                    </div>
                  </div>

                  {ts.approvedBy && (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                      <Check className="h-3 w-3" />
                      <span>{isThai ? `ลงนามและรับรองโดย: ${ts.approvedBy}` : `Signed & verified by: ${ts.approvedBy}`}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'ชั่วโมงทำงาน' : 'Hours Logged'}</span>
                    <span className="text-xs font-extrabold text-slate-800 font-mono">{ts.hoursWorked} hrs</span>
                  </div>

                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRejectTimesheet(ts.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl cursor-pointer"
                      >
                        {isThai ? 'ส่งคืนแก้ไข' : 'Reject'}
                      </button>

                      <button
                        onClick={() => onSignTimesheet(ts.id, mentorName)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#6B122C] hover:bg-[#580E24] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <PenTool className="h-3.5 w-3.5" />
                        {isThai ? 'เซ็นชื่อ / ลงนามอนุมัติ' : 'Sign & Approve'}
                      </button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isApproved ? (isThai ? '✓ ลงนามรับรองแล้ว' : '✓ Signed & Approved') : ts.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
