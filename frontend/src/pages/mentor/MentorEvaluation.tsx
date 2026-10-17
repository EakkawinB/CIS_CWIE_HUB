import React, { useState } from 'react';
import { Award, CheckCircle, Save, Star, Users, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface MentorEvaluationProps {
  students: Student[];
  onSaveEvaluation: (evaluation: {
    studentId: string;
    phase: 'midterm' | 'final';
    professionalism: number;
    technicalDelivery: number;
    collaboration: number;
    projectQuality: number;
    comments: string;
  }) => void;
}

export default function MentorEvaluation({ students, onSaveEvaluation }: MentorEvaluationProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [studentId, setStudentId] = useState<string>(students[0]?.id || 'STU001');
  const [phase, setPhase] = useState<'midterm' | 'final'>('midterm');

  // Sliders
  const [professionalism, setProfessionalism] = useState<number>(23); // max 25
  const [technicalDelivery, setTechnicalDelivery] = useState<number>(24); // max 25
  const [collaboration, setCollaboration] = useState<number>(24); // max 25
  const [projectQuality, setProjectQuality] = useState<number>(22); // max 25
  const [comments, setComments] = useState<string>('');

  const totalScore = professionalism + technicalDelivery + collaboration + projectQuality;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEvaluation({
      studentId,
      phase,
      professionalism,
      technicalDelivery,
      collaboration,
      projectQuality,
      comments
    });
  };

  return (
    <div className="max-w-3xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Top Banner */}
      <div className="border-b border-slate-100 pb-4">
        <span className="px-2.5 py-0.5 bg-rose-50 text-[#6B122C] text-[10px] font-bold rounded uppercase tracking-wider mb-2 inline-block">
          {isThai ? 'แบบประเมินผลการปฏิบัติงานสหกิจศึกษาในสถานประกอบการ' : 'Workplace Performance Evaluation Board'}
        </span>
        <h2 className="text-lg font-bold text-slate-900 font-sans">
          {isThai ? 'Evaluation (ประเมินผลกลางภาคและสิ้นสุดการฝึกงาน)' : 'Workplace Intern Performance Evaluation'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isThai 
            ? 'ประเมินสมรรถนะการทำงานจริง ความรับผิดชอบ คุณภาพโครงงาน และความประพฤติ โดยพี่เลี้ยงสถานประกอบการ'
            : 'Evaluate student workplace performance, technical execution, and professionalism.'}
        </p>
      </div>

      {/* Phase Selector (Midterm / Final) */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPhase('midterm')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
            phase === 'midterm'
              ? 'bg-[#6B122C] text-white border-[#6B122C] shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {isThai ? '1. การประเมินผลกลางภาค (Midterm Evaluation)' : '1. Midterm Evaluation Phase'}
        </button>

        <button
          type="button"
          onClick={() => setPhase('final')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
            phase === 'final'
              ? 'bg-[#6B122C] text-white border-[#6B122C] shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          {isThai ? '2. การประเมินผลสิ้นสุดการฝึกงาน (Final Evaluation)' : '2. Final Evaluation Phase'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700">
        <div>
          <label className="block text-[11px] font-semibold mb-1">
            {isThai ? 'เลือกนักศึกษาที่เข้ารับการประเมิน' : 'Select Intern'}
          </label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none font-semibold text-slate-800"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.id}) - Frontend Intern</option>
            ))}
          </select>
        </div>

        {/* 4 Rubric Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-800">
                {isThai ? '1. ความประพฤติ ความตรงต่อเวลา และความเป็นมืออาชีพ (เต็ม 25)' : '1. Professionalism & Punctuality (max 25)'}
              </label>
              <span className="font-mono font-bold text-[#6B122C]">{professionalism} pts</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="25" 
              value={professionalism}
              onChange={(e) => setProfessionalism(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6B122C]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-800">
                {isThai ? '2. ความสามารถเชิงเทคนิคและการส่งมอบงานจริง (เต็ม 25)' : '2. Technical Competence & Execution (max 25)'}
              </label>
              <span className="font-mono font-bold text-[#6B122C]">{technicalDelivery} pts</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="25" 
              value={technicalDelivery}
              onChange={(e) => setTechnicalDelivery(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6B122C]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-800">
                {isThai ? '3. การทำงานร่วมกับทีมและการสื่อสาร (เต็ม 25)' : '3. Team Collaboration & Communication (max 25)'}
              </label>
              <span className="font-mono font-bold text-[#6B122C]">{collaboration} pts</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="25" 
              value={collaboration}
              onChange={(e) => setCollaboration(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6B122C]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-800">
                {isThai ? '4. คุณภาพผลงานและโครงงานที่ได้รับมอบหมาย (เต็ม 25)' : '4. Assigned Project & Deliverables Quality (max 25)'}
              </label>
              <span className="font-mono font-bold text-[#6B122C]">{projectQuality} pts</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="25" 
              value={projectQuality}
              onChange={(e) => setProjectQuality(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6B122C]"
            />
          </div>
        </div>

        {/* Total Score Summary */}
        <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl flex items-center justify-between text-xs font-bold text-[#6B122C]">
          <span>{isThai ? `คะแนนประเมินรวม (${phase === 'midterm' ? 'กลางภาค' : 'สิ้นสุดการฝึก'}):` : `Combined Evaluation Score (${phase.toUpperCase()}):`}</span>
          <span className="font-mono text-base text-[#6B122C]">{totalScore} / 100</span>
        </div>

        <div>
          <label className="block text-[11px] font-semibold mb-1">
            {isThai ? 'ข้อคิดเห็นและคำเสนอแนะจากพี่เลี้ยง (Mentor Remarks):' : 'Mentor Qualitative Remarks:'}
          </label>
          <textarea
            rows={3}
            placeholder={isThai ? 'ระบุจุดเด่น และสิ่งที่นักศึกษาควรพัฒนาเพิ่มเติมก่อนจบหลักสูตร...' : 'Provide qualitative feedback and growth recommendations...'}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#6B122C]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-[#6B122C] hover:bg-[#580E24] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Save className="h-4 w-4" />
          {isThai 
            ? `บันทึกและส่งผลการประเมิน${phase === 'midterm' ? 'กลางภาค' : 'สิ้นสุดการฝึก'}` 
            : `Save & Lock ${phase.toUpperCase()} Evaluation`}
        </button>
      </form>

    </div>
  );
}
