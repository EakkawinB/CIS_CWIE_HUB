import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Users, AlertCircle, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface AdvisorCoopVisitProps {
  students: Student[];
  bookings: { id: number; studentName: string; company: string; date: string; time: string; round: number; status: string }[];
  onBookVisit: (newBooking: { studentId: string; date: string; time: string; round: number }) => void;
}

export default function AdvisorCoopVisit({ students, bookings, onBookVisit }: AdvisorCoopVisitProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [studentId, setStudentId] = useState<string>(students[0]?.id || 'STU001');
  const [date, setDate] = useState('2026-07-25');
  const [time, setTime] = useState('13:30');
  const [round, setRound] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookVisit({ studentId, date, time, round });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* 1. Header Banner showing 2 Rounds requirements */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-rose-50 text-[#6B122C] border border-rose-100 text-[10px] font-bold rounded-full uppercase">
              {isThai ? 'เกณฑ์มาตรฐานสหกิจศึกษา' : 'Official CWIE Policy'}
            </span>
            <span className="text-xs font-bold text-slate-800">
              {isThai ? 'การนิเทศงานนักศึกษา 2 รอบ (Co-op Visit 2 Rounds)' : 'Mandatory 2 Co-op Visit Rounds'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isThai 
              ? 'รอบที่ 1: ติดตามการเริ่มงานช่วงต้น (สัปดาห์ที่ 4-8) • รอบที่ 2: นิเทศประเมินความก้าวหน้าโครงงาน (สัปดาห์ที่ 10-14)'
              : 'Round 1: Initial Onboarding Audit (Weeks 4-8) • Round 2: Midterm Project Review (Weeks 10-14)'}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs">
            <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'รอบที่ 1' : 'Round 1'}</span>
            <span className="font-bold text-emerald-600">✓ {isThai ? 'นัดหมายแล้ว' : 'Scheduled'}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs">
            <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'รอบที่ 2' : 'Round 2'}</span>
            <span className="font-bold text-[#6B122C]">{isThai ? 'เปิดจอง' : 'Open'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Form to schedule co-op visit on calendar */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isThai ? 'กำหนดวันนิเทศนักศึกษาลง Calendar (Schedule Visit)' : 'Schedule Co-op Supervision Visit'}
            </h3>
            <p className="text-xs text-slate-400">
              {isThai ? 'ระบุวันและเวลาเป้าหมายสำหรับการเข้าเยี่ยมนิเทศงาน ณ สถานประกอบการจริง' : 'Submit on-site employer audit visit parameters.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                {isThai ? 'รอบการนิเทศงาน (Co-op Visit Round)' : 'Select Visit Round'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRound(1)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    round === 1 
                      ? 'bg-[#6B122C] text-white border-[#6B122C] shadow-xs' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isThai ? 'รอบที่ 1 (ช่วงต้น)' : 'Round 1 (Early)'}
                </button>
                <button
                  type="button"
                  onClick={() => setRound(2)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    round === 2 
                      ? 'bg-[#6B122C] text-white border-[#6B122C] shadow-xs' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isThai ? 'รอบที่ 2 (กลางภาค)' : 'Round 2 (Midterm)'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                {isThai ? 'เลือกนักศึกษาเป้าหมาย' : 'Target Student'}
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                  {isThai ? 'วันที่เข้าเยี่ยมนิเทศ' : 'Visit Date'}
                </label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                  {isThai ? 'ช่วงเวลานิเทศ' : 'Visit Timeblock'}
                </label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#6B122C] hover:bg-[#580E24] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isThai ? 'ยืนยันการนิเทศนักศึกษา (Confirm Visit)' : 'Confirm Co-op Visit'}
            </button>
          </form>
        </div>

        {/* Confirmed Schedules on Calendar / Bookings list */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isThai ? 'ตารางเวลานิเทศงานที่ได้รับการยืนยัน (Confirmed Calendar)' : 'Confirmed Visit Schedule'}
            </h3>
            <span className="text-xs font-mono text-slate-400">{bookings.length} {isThai ? 'รายการ' : 'Records'}</span>
          </div>
          
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-rose-100 text-[#6B122C] text-[10px] font-bold rounded">
                      {isThai ? `รอบที่ ${b.round}` : `Round ${b.round}`}
                    </span>
                    <span className="font-bold text-slate-900">{b.studentName}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded">
                    {b.status}
                  </span>
                </div>
                <p className="text-slate-500">
                  {isThai ? 'สถานที่:' : 'Venue:'} <b>{b.company}</b>
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <Clock className="h-3.5 w-3.5 text-[#6B122C]" />
                  <span>{b.date} • {b.time} น.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
