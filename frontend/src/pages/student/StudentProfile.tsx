import React, { useState } from 'react';
import { User, UploadCloud, FileText, CheckCircle2, Edit3, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface StudentProfileProps {
  student: Student;
  onUpdateStudent: (updated: Student) => void;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function StudentProfile({ student, onUpdateStudent, onNotify }: StudentProfileProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    major: student.major,
    gpa: student.gpa.toString(),
    skills: student.skills.join(', ')
  });

  const [resumeFile, setResumeFile] = useState<string>(student.resumeUrl || 'Resume_Kasidis_Phromsorn_2026.pdf');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Student = {
      ...student,
      name: form.name,
      email: form.email,
      major: form.major,
      gpa: parseFloat(form.gpa) || 3.82,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      resumeUrl: resumeFile
    };
    onUpdateStudent(updated);
    setIsEditing(false);
    onNotify?.(
      isThai ? 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!' : 'Profile updated successfully!',
      'success'
    );
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file.name);
      onUpdateStudent({
        ...student,
        resumeUrl: file.name
      });
      onNotify?.(
        isThai ? `อัปโหลด Resume "${file.name}" สำเร็จ!` : `Uploaded Resume "${file.name}" successfully!`,
        'success'
      );
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Top Banner */}
      <div className="flex justify-between items-start pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-[#6B122C] text-white font-extrabold flex items-center justify-center text-xl rounded-2xl shadow-md">
            {student.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">{student.name}</h2>
            <p className="text-xs text-slate-400">{student.major} • {student.academicYear}</p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setForm({
                name: student.name,
                email: student.email,
                major: student.major,
                gpa: student.gpa.toString(),
                skills: student.skills.join(', ')
              });
              setIsEditing(true);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#6B122C] hover:text-white bg-rose-50 hover:bg-[#6B122C] transition-all rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {isThai ? 'แก้ไขโปรไฟล์ (Edit Profile)' : 'Edit Profile'}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                {isThai ? 'ชื่อ-นามสกุล' : 'Full Name'}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#6B122C] bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                {isThai ? 'อีเมลสถาบัน' : 'Email Address'}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#6B122C] bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                {isThai ? 'สาขาวิชา' : 'Major'}
              </label>
              <input
                type="text"
                value={form.major}
                onChange={(e) => setForm({ ...form, major: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#6B122C] bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                {isThai ? 'เกรดเฉลี่ยสะสม (GPA)' : 'Academic GPA'}
              </label>
              <input
                type="number"
                step="0.01"
                value={form.gpa}
                onChange={(e) => setForm({ ...form, gpa: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#6B122C] bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              {isThai ? 'ทักษะความสามารถ (คั่นด้วยเครื่องหมายจุลภาค)' : 'Technical Skills (comma-separated)'}
            </label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#6B122C] bg-slate-50/50 focus:bg-white font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer"
            >
              {isThai ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B122C] hover:bg-[#580E24] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              {isThai ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'เกรดเฉลี่ยสะสม (GPA):' : 'Academic GPA:'}</span>
              <span className="font-bold text-slate-800">{student.gpa}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'รูปแบบหลักสูตร:' : 'Program Type:'}</span>
              <span className="font-semibold text-slate-800">
                {student.programType === 'Regular' ? 'ปกติ (Regular)' : student.programType === 'Special' ? 'สมทบ (Special)' : 'สองภาษา (Bilingual)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'สถานะการฝึกงาน:' : 'Placement Status:'}</span>
              <span className="text-emerald-600 font-bold">
                {isThai ? 'ยืนยันสิทธิ์เรียบร้อย (Confirmed)' : 'Confirmed & Placed'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'อีเมลติดต่อ:' : 'Email Contact:'}</span>
              <span className="font-semibold text-slate-800">{student.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              {isThai ? 'กลุ่มทักษะความสามารถ (Skills Stack)' : 'Primary Skill Stack'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Resume Section (Requirement: อัปโหลด resume ได้) */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-[#6B122C]" />
          <span>{isThai ? 'อัปโหลด Resume (Curriculum Vitae / ประวัติย่อ)' : 'Upload Student Resume'}</span>
        </h3>

        {resumeFile && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold">{resumeFile}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {isThai ? 'ใช้งานอยู่ในระบบ' : 'Active in System'}
            </span>
          </div>
        )}

        <div className="border-2 border-dashed border-slate-200 hover:border-[#6B122C] bg-slate-50/60 rounded-xl p-4 text-center relative cursor-pointer transition-colors">
          <input 
            type="file" 
            accept=".pdf,.docx"
            onChange={handleResumeUpload}
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
          <UploadCloud className="h-7 w-7 text-slate-400 mx-auto mb-1" />
          <span className="text-xs font-semibold text-slate-700 block">
            {isThai ? 'อัปโหลดไฟล์ Resume ใหม่ (PDF, DOCX)' : 'Upload New Resume Version'}
          </span>
          <span className="text-[10px] text-slate-400">PDF up to 10MB</span>
        </div>
      </div>

    </div>
  );
}
