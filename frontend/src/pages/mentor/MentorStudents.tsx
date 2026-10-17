import React, { useState } from 'react';
import { Users, Building2, Clock, Briefcase, Mail, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface MentorStudentsProps {
  students: Student[];
}

export default function MentorStudents({ students }: MentorStudentsProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-150 text-left">
      
      {/* 1. Supervised Interns Roster Table */}
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            {isThai ? 'รายชื่อนักศึกษาฝึกงานในสถานประกอบการ (Company Intern Roster)' : 'Company Supervised Intern Roster'}
          </h3>
          <p className="text-xs text-slate-400">
            {isThai 
              ? 'นักศึกษาที่ประจำแผนก ณ บริษัท เน็กซ่าเทค โซลูชั่นส์ จำกัด' 
              : 'Students placed at NexaTech Solutions Co., Ltd. under your direct mentorship.'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-2.5 px-3">{isThai ? 'ชื่อ-นามสกุล' : 'Intern Name'}</th>
                <th className="py-2.5 px-3 hidden sm:table-cell">{isThai ? 'ตำแหน่งงาน' : 'Position'}</th>
                <th className="py-2.5 px-3 hidden md:table-cell">{isThai ? 'ระยะเวลา' : 'Period'}</th>
                <th className="py-2.5 px-3 text-right">{isThai ? 'ชั่วโมงสะสม' : 'Hours'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {students.map((stu) => (
                <tr 
                  key={stu.id} 
                  onClick={() => setSelectedStudent(stu)}
                  className={`cursor-pointer transition-colors ${selectedStudent?.id === stu.id ? 'bg-rose-50/60 font-medium' : 'hover:bg-slate-50/50'}`}
                >
                  <td className="py-3 px-3 text-slate-950 font-semibold">{stu.name}</td>
                  <td className="py-3 px-3 text-slate-600 hidden sm:table-cell">
                    {stu.id === 'STU001' ? 'Frontend Dev Intern' : 'Software Intern'}
                  </td>
                  <td className="py-3 px-3 text-slate-500 hidden md:table-cell font-mono text-[10px]">
                    16 {isThai ? 'สัปดาห์' : 'weeks'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#6B122C]">
                    480 / 640 hrs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Intern Details Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs h-fit space-y-4">
        {selectedStudent ? (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                {isThai ? 'ข้อมูลนักศึกษาฝึกงาน' : 'Intern Candidate Details'}
              </span>
              <h4 className="text-sm font-bold text-slate-950 mt-1">{selectedStudent.name}</h4>
              <p className="text-xs text-slate-400">{selectedStudent.email}</p>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {isThai ? 'ตำแหน่งงานในบริษัท:' : 'Workplace Assigned Position:'}
                </span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.id === 'STU001' 
                    ? 'Frontend Developer Intern (React / TypeScript)'
                    : 'Software Platform Intern'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {isThai ? 'ระยะเวลาการฝึกงานและชั่วโมงสะสม:' : 'Training Period & Total Hours:'}
                </span>
                <span className="font-semibold text-slate-800">
                  {isThai ? '1 มิ.ย. 2569 – 18 ก.ย. 2569 (16 สัปดาห์ • 640 ชม.)' : 'June 01 – September 18, 2026 (16 Weeks)'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {isThai ? 'สถาบันการศึกษา:' : 'University / Faculty:'}
                </span>
                <span className="font-semibold text-slate-800">
                  {isThai ? 'มจพ. (KMUTNB) • วิทยาการคอมพิวเตอร์ (CIS)' : 'KMUTNB • Applied Science (CIS)'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {isThai ? 'ความคืบหน้าการทำงาน:' : 'Internship Completion Progress:'}
                </span>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#6B122C] h-full rounded-full" style={{ width: `${selectedStudent.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                {isThai ? 'ทักษะความสามารถ (Skills)' : 'Technical Skills'}
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedStudent.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-8">
            {isThai ? 'กรุณาเลือกนักศึกษา' : 'Select an intern record to view.'}
          </p>
        )}
      </div>

    </div>
  );
}
