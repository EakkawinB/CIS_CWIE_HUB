import React from 'react';
import { Users, Clock, CheckCircle, AlertCircle, Building2, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student, Timesheet } from '../../types';

interface MentorDashboardProps {
  students: Student[];
  timesheets: Timesheet[];
  onNavigateTab: (tab: 'dashboard' | 'students' | 'timesheets-review' | 'evaluation' | 'profile') => void;
}

export default function MentorDashboard({ students, timesheets, onNavigateTab }: MentorDashboardProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const pendingTimesheets = timesheets.filter(t => t.status === 'Pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Company / Mentor Greeting Banner */}
      <div className="bg-gradient-to-r from-[#6B122C] to-[#8B1E3F] text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-rose-200" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-200">
              NexaTech Solutions Co., Ltd.
            </span>
          </div>
          <h2 className="text-lg font-extrabold tracking-tight">
            {isThai ? 'ยินดีต้อนรับ คุณสมศักดิ์ พิพัฒน์พัฒนา (Lead Architect / Mentor)' : 'Welcome, Khun Somsak Pipatpatana (Mentor)'}
          </h2>
          <p className="text-xs text-rose-100/80">
            {isThai 
              ? 'ระบบดูแลนักศึกษาฝึกงานและสหกิจศึกษา ประจำสถานประกอบการ'
              : 'Enterprise Mentor Workplace & Evaluation Portal.'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-xs">
          <span className="text-[10px] text-rose-200 block font-mono uppercase">{isThai ? 'สถานะพี่เลี้ยง:' : 'Role Status:'}</span>
          <span className="font-bold text-emerald-300">✓ {isThai ? 'พี่เลี้ยงหลักประจำหน่วยงาน' : 'Active Enterprise Mentor'}</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            {isThai ? 'นักศึกษาฝึกงานในแผนก' : 'Supervised Interns'}
          </span>
          <span className="block text-2xl font-extrabold text-slate-900 mt-1">
            {students.length} {isThai ? 'คน' : 'Students'}
          </span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            {isThai ? 'ใบลงเวลารอลงนาม (Pending Timesheets)' : 'Timesheets Awaiting Signature'}
          </span>
          <span className="block text-2xl font-extrabold text-[#6B122C] mt-1">
            {pendingTimesheets.length} {isThai ? 'ฉบับ' : 'Pending'}
          </span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            {isThai ? 'การประเมินผลปฏิบัติงาน' : 'Evaluation Schedule'}
          </span>
          <span className="block text-2xl font-extrabold text-slate-800 mt-1">
            2 {isThai ? 'ช่วง (กลางภาค/สิ้นสุด)' : 'Phases (Mid/Final)'}
          </span>
        </div>
      </div>

      {/* Urgent Tasks */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {isThai ? 'รายการด่วนที่ต้องดำเนินการ (Urgent Mentor Action Items)' : 'Urgent Mentor Action Items'}
        </h3>

        <div className="space-y-2.5">
          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-[#6B122C] shrink-0" />
              <span>
                {isThai 
                  ? <>นักศึกษา <b>กษิดิศ พรหมศร</b> ได้ส่งใบลงเวลาการทำงาน (Timesheet) สัปดาห์ล่าสุด รอการลงนามรับรองจากพี่เลี้ยง</>
                  : <>Intern <b>Kasidis Phromsorn</b> has submitted weekly timesheet requiring your verification & signature.</>}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('timesheets-review')}
              className="px-3 py-1.5 bg-[#6B122C] text-white font-semibold rounded-lg hover:bg-[#580E24] cursor-pointer shrink-0"
            >
              {isThai ? 'ลงนามใบลงเวลา' : 'Sign Timesheet'}
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-[#6B122C] shrink-0" />
              <span>
                {isThai
                  ? <>เปิดรอบการประเมินผลกลางภาค (Midterm Evaluation) ประจำภาคการศึกษา สำหรับนักศึกษาในความดูแล</>
                  : <>Workplace Midterm Evaluation cycle is now open for your assigned intern candidates.</>}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('evaluation')}
              className="px-3 py-1.5 bg-[#6B122C] text-white font-semibold rounded-lg hover:bg-[#580E24] cursor-pointer shrink-0"
            >
              {isThai ? 'ไปหน้าประเมินผล' : 'Go to Evaluation'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
