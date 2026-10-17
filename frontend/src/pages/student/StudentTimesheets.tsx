import React, { useState } from 'react';
import { Clock, UploadCloud, CheckCircle, AlertCircle, FileSpreadsheet, Download, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Timesheet } from '../../types';

interface StudentTimesheetsProps {
  timesheets: Timesheet[];
  onSubmitTimesheet: (newTs: Timesheet) => void;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function StudentTimesheets({ timesheets, onSubmitTimesheet, onNotify }: StudentTimesheetsProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [weekNum, setWeekNum] = useState<number>(timesheets.length + 1);
  const [hours, setHours] = useState<number>(40);

  const totalApprovedHours = timesheets
    .filter(t => t.status === 'Approved')
    .reduce((sum, t) => sum + t.hoursWorked, 0);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      onNotify?.(
        isThai ? 'กรุณาแนบไฟล์ใบลงเวลาการทำงานที่มีลายเซ็นพี่เลี้ยง' : 'Please attach your signed timesheet document.',
        'warning'
      );
      return;
    }

    const newTs: Timesheet = {
      id: `TS00${timesheets.length + 1}`,
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      weekNumber: weekNum,
      startDate: '2026-06-22',
      endDate: '2026-06-26',
      hoursWorked: hours,
      status: 'Pending',
      fileName: uploadedFile,
      submittedAt: new Date().toISOString()
    };

    onSubmitTimesheet(newTs);
    setUploadedFile('');
    setWeekNum(timesheets.length + 2);
    onNotify?.(
      isThai 
        ? `อัปโหลดใบลงเวลาสัปดาห์ที่ ${newTs.weekNumber} สำเร็จ รอการลงนามอนุมัติจากพี่เลี้ยง` 
        : `Submitted Week ${newTs.weekNumber} timesheet. Awaiting Mentor signature.`,
      'success'
    );
  };

  const handleDownloadTemplate = () => {
    onNotify?.(
      isThai ? 'ดาวน์โหลดแบบฟอร์มบันทึกเวลาปฏิบัติงาน (Weekly_Timesheet_Blank.xlsx) สำเร็จ' : 'Downloaded Weekly_Timesheet_Blank.xlsx template.',
      'success'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Header Metric */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isThai ? 'Timesheets (ใบลงเวลาการทำงานสหกิจศึกษา)' : 'Weekly Timesheets & Clocking Logs'}
          </h2>
          <p className="text-xs text-slate-400">
            {isThai 
              ? 'อัปโหลดใบลงเวลาที่มีลายเซ็นและคำรับรองจากพี่เลี้ยงสถานประกอบการ พร้อมตรวจสอบสถานะการอนุมัติ'
              : 'Upload timesheets signed by your enterprise mentor and track approval statuses.'}
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-[10px] text-slate-400 block font-mono">
            {isThai ? 'ชั่วโมงสะสมที่ได้รับการอนุมัติแล้ว' : 'Approved Co-op Hours'}
          </span>
          <span className="text-lg font-extrabold text-[#6B122C] block">
            {totalApprovedHours} / 640 {isThai ? 'ชั่วโมง' : 'hrs'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Timesheets List / Status Table */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isThai ? 'Status ของใบลงเวลาที่ส่งแล้ว (Submission Records)' : 'Submitted Timesheets Status'}
          </h3>
          
          <div className="space-y-3">
            {timesheets.map((ts) => (
              <div key={ts.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-800">
                      {isThai ? `ใบลงเวลาสัปดาห์ที่ ${ts.weekNumber}` : `Week ${ts.weekNumber} Timesheet`}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {ts.startDate} — {ts.endDate} • {ts.fileName || 'timesheet.pdf'}
                  </p>
                  {ts.approvedBy && (
                    <p className="text-[10px] text-emerald-700 font-semibold">
                      {isThai ? `ลงนามอนุมัติโดย: ${ts.approvedBy}` : `Signed & verified by: ${ts.approvedBy}`}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 font-mono">{ts.hoursWorked} hrs</span>
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                    ts.status === 'Approved' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : ts.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700 animate-pulse'
                  }`}>
                    {ts.status === 'Approved' 
                      ? (isThai ? 'อนุมัติแล้ว' : 'Approved') 
                      : (isThai ? 'รอลงนาม' : 'Pending')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Template Section & Upload Form */}
        <div className="space-y-6">
          {/* Document Template Section */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isThai ? 'Template แบบฟอร์มใบลงเวลา' : 'Timesheet Document Template'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {isThai 
                ? 'ดาวน์โหลดแบบฟอร์มเปล่าเพื่อนำไปบันทึกเวลาทำงานและให้พี่เลี้ยงลงนามรับรอง' 
                : 'Download the official blank timesheet template to log hours and collect mentor signature.'}
            </p>
            
            <button 
              type="button"
              onClick={handleDownloadTemplate}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 truncate">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-semibold truncate">Weekly_Timesheet_Blank.xlsx</span>
              </div>
              <Download className="h-4 w-4 text-[#6B122C] group-hover:scale-110 transition-transform shrink-0" />
            </button>
          </div>

          {/* Upload Form requiring mentor signature */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isThai ? 'Upload เอกสาร ที่มีลายเซ็นพี่เลี้ยง' : 'Upload Signed Timesheet'}
            </h3>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  {isThai ? 'สัปดาห์ที่' : 'Week Number'}
                </label>
                <input 
                  type="number" 
                  value={weekNum}
                  onChange={(e) => setWeekNum(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  {isThai ? 'ชั่วโมงทำงานจริง' : 'Hours Logged'}
                </label>
                <input 
                  type="number" 
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1 font-mono">
                  {isThai ? 'แนบไฟล์ที่มีลายเซ็นพี่เลี้ยง (PDF/Excel)' : 'Signed File Attachment'}
                </label>
                <div className="border border-dashed border-slate-200 bg-slate-50 p-4 text-center rounded-xl cursor-pointer hover:border-[#6B122C] transition-colors relative">
                  <input 
                    type="file" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFile(e.target.files[0].name);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-600 font-semibold block truncate">
                    {uploadedFile || (isThai ? 'คลิกเลือกไฟล์ที่มีลายเซ็น' : 'Choose signed artifact')}
                  </span>
                  <span className="text-[9px] text-slate-400">PDF, XLSX up to 10MB</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#6B122C] hover:bg-[#580E24] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isThai ? 'อัปโหลดใบลงเวลา' : 'Submit Timesheet'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
