import React, { useEffect, useState } from 'react';
import { Building2, Mail, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  AdvisorStudentDto,
  getMyAdvisorStudents,
} from '../../services/api';


export default function AdvisorStudents() {
  const { i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');
  const [students, setStudents] = useState<AdvisorStudentDto[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<AdvisorStudentDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStudents() {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyAdvisorStudents();
        if (!cancelled) {
          setStudents(response);
          setSelectedStudent(response[0] ?? null);
        }
      } catch {
        if (!cancelled) {
          setError(isThai ? 'ไม่สามารถโหลดรายชื่อนักศึกษาได้' : 'Unable to load assigned students.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStudents();
    return () => { cancelled = true; };
  }, [isThai]);

  const displayDate = (value: string | null) => value || (isThai ? 'ยังไม่มีข้อมูล' : 'Not available');

  if (loading) {
    return <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">{isThai ? 'กำลังโหลดข้อมูล...' : 'Loading...'}</div>;
  }

  if (error) {
    return <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>;
  }

  if (students.length === 0) {
    return <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">{isThai ? 'ยังไม่มีนักศึกษาที่ได้รับมอบหมาย' : 'No assigned students.'}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-150 text-left">
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users className="h-4 w-4" />{isThai ? 'รายชื่อนักศึกษาในความดูแล' : 'Assigned Students'}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead><tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/50"><th className="py-2.5 px-3">{isThai ? 'นักศึกษา' : 'Student'}</th><th className="py-2.5 px-3">{isThai ? 'บริษัท' : 'Company'}</th><th className="py-2.5 px-3">{isThai ? 'สถานะฝึกงาน' : 'Status'}</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => (
                <tr key={student.student_id} onClick={() => setSelectedStudent(student)} className={`cursor-pointer ${selectedStudent?.student_id === student.student_id ? 'bg-rose-50/60' : 'hover:bg-slate-50/50'}`}>
                  <td className="py-3 px-3"><span className="block font-semibold text-slate-900">{student.student_name}</span><span className="font-mono text-[10px] text-slate-400">{student.student_code ?? '—'}</span></td>
                  <td className="py-3 px-3 text-slate-600">{student.company_name}</td>
                  <td className="py-3 px-3 font-semibold text-[#6B122C]">{student.internship_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit">
        {selectedStudent && (
          <div className="space-y-4 text-xs">
            <div className="pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-950">{selectedStudent.student_name}</h4>
              <p className="text-slate-400 font-mono">{selectedStudent.student_code ?? '—'}</p>
            </div>
            <p className="flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4" />{selectedStudent.email}</p>
            <div><span className="text-slate-400 block">{isThai ? 'บริษัท' : 'Company'}</span><strong className="text-[#6B122C]">{selectedStudent.company_name}</strong></div>
            <div><span className="text-slate-400 block">{isThai ? 'ตำแหน่ง' : 'Position'}</span><strong>{selectedStudent.position_name}</strong></div>
            <div><span className="text-slate-400 block">{isThai ? 'สถานะฝึกงาน' : 'Internship status'}</span><strong>{selectedStudent.internship_status}</strong></div>
            <div className="flex gap-2"><Building2 className="h-4 w-4 text-slate-400" /><div><span className="text-slate-400 block">{isThai ? 'ระยะเวลาฝึกงานจริง' : 'Actual internship period'}</span><strong>{displayDate(selectedStudent.start_date)} — {displayDate(selectedStudent.end_date)}</strong></div></div>
          </div>
        )}
      </div>
    </div>
  );
}
