import React from 'react';
import { Users, Clock, Calendar, Award, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student, WeeklyReport } from '../../types';

interface AdvisorDashboardProps {
  students: Student[];
  reports: WeeklyReport[];
  bookings: { id: number; studentName: string; company: string; date: string; time: string; round: number; status: string }[];
  onNavigateTab: (tab: 'dashboard' | 'students' | 'documents' | 'diary-review' | 'coop-visit' | 'examination' | 'profile') => void;
}

export default function AdvisorDashboard({
  students,
  reports,
  bookings,
  onNavigateTab
}: AdvisorDashboardProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const pendingReports = reports.filter(r => r.status === 'Pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            {isThai ? 'นักศึกษาในความดูแล' : 'Assigned Students'}
          </span>
          <span className="block text-2xl font-extrabold text-slate-900 mt-1">
            {students.length} {isThai ? 'คน' : 'Students'}
          </span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            {isThai ? 'บันทึกที่รอตรวจ (Pending)' : 'Diaries Awaiting Review'}
          </span>
          <span className="block text-2xl font-extrabold text-[#6B122C] mt-1">
            {pendingReports.length} {isThai ? 'รายงาน' : 'Diaries'}
          </span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            {isThai ? 'นัดหมายนิเทศงาน (2 รอบ)' : 'Co-op Visits (2 Rounds)'}
          </span>
          <span className="block text-2xl font-extrabold text-slate-800 mt-1">
            {bookings.length} {isThai ? 'นัดหมาย' : 'Scheduled'}
          </span>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            {isThai ? 'งานประเมินการสอบ (Grading)' : 'Exam Grading Tasks'}
          </span>
          <span className="block text-2xl font-extrabold text-emerald-600 mt-1">
            1 {isThai ? 'ห้องสอบ' : 'Board'}
          </span>
        </div>
      </div>

      {/* 2. Urgent Tasks / Action Items (รายการด่วนที่ต้องทำ) */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {isThai ? 'รายการด่วนที่ต้องทำ (Urgent Tasks & Action Items)' : 'Action Required Alerts'}
        </h3>
        
        <div className="space-y-2.5">
          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-[#6B122C] shrink-0" />
              <span>
                {isThai 
                  ? <>นักศึกษา <b>กษิดิศ พรหมศร</b> ได้ส่งบันทึกความคืบหน้าสัปดาห์ที่ 3 รอให้อาจารย์ตรวจและอนุมัติ</>
                  : <>Student <b>Kasidis Phromsorn</b> has a pending Week 3 diary awaiting review.</>}
              </span>
            </div>
            <button 
              onClick={() => onNavigateTab('diary-review')} 
              className="px-3 py-1.5 bg-[#6B122C] text-white font-semibold rounded-lg hover:bg-[#580E24] cursor-pointer shrink-0"
            >
              {isThai ? 'ตรวจบันทึก' : 'Review Diary'}
            </button>
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
              <span>
                {isThai
                  ? <>กำหนดการนิเทศงานรอบที่ 2 (Midterm Audit) สำหรับบริษัท <b>NexaTech Solutions</b> รอการยืนยันวันเข้าตรวจ</>
                  : <>Co-op Visit Round 2 schedule for <b>NexaTech Solutions</b> requires calendar confirmation.</>}
              </span>
            </div>
            <button 
              onClick={() => onNavigateTab('coop-visit')}
              className="px-3 py-1.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 cursor-pointer shrink-0"
            >
              {isThai ? 'กำหนดวันนิเทศ' : 'Schedule Visit'}
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-[#6B122C] shrink-0" />
              <span>
                {isThai
                  ? <>ห้องสอบปากเปล่า <b>Room 604</b> มีนักศึกษา <b>กษิดิศ</b> รอรับการประเมินคะแนนวิชาการจากคณะกรรมการ</>
                  : <>Oral Defense Board <b>Room 604</b> has pending academic evaluation rubrics to score.</>}
              </span>
            </div>
            <button 
              onClick={() => onNavigateTab('examination')}
              className="px-3 py-1.5 bg-[#6B122C] text-white font-semibold rounded-lg hover:bg-[#580E24] cursor-pointer shrink-0"
            >
              {isThai ? 'ไปหน้าสอบประเมิน' : 'Go to Examination'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
