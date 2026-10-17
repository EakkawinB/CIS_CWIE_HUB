import React, { useState } from 'react';
import { Award, FileText, Download, CheckCircle, Save, Star, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface AdvisorExaminationProps {
  students: Student[];
  onSaveEvaluation: (evaluation: {
    studentId: string;
    presentationScore: number;
    reportScore: number;
    overallCompetence: number;
    comments: string;
  }) => void;
}

export default function AdvisorExamination({ students, onSaveEvaluation }: AdvisorExaminationProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [studentId, setStudentId] = useState<string>(students[0]?.id || 'STU001');
  const [presentationScore, setPresentationScore] = useState<number>(16); // max 20
  const [reportScore, setReportScore] = useState<number>(24); // max 30
  const [overallCompetence, setOverallCompetence] = useState<number>(42); // max 50
  const [comments, setComments] = useState<string>('');

  const selectedStudent = students.find(s => s.id === studentId) || students[0];

  const totalScore = Number(presentationScore) + Number(reportScore) + Number(overallCompetence);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEvaluation({
      studentId,
      presentationScore,
      reportScore,
      overallCompetence,
      comments
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-150 text-left">
      
      {/* 1. Evaluation / Scoring Form (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-slate-100 p-8 rounded-2xl shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <span className="px-2 py-0.5 bg-rose-50 text-[#6B122C] border border-rose-100 text-[10px] font-bold rounded uppercase tracking-wider mb-2 inline-block">
            {isThai ? 'คณะกรรมการสอบปากเปล่าสหกิจศึกษา' : 'Defense Committee Evaluation Board'}
          </span>
          <h2 className="text-base font-bold text-slate-900">
            {isThai ? 'Examination (ประเมินคะแนนการสอบและให้ข้อเสนอแนะ)' : 'Evaluate Assigned Examination Students'}
          </h2>
          <p className="text-xs text-slate-400">
            {isThai 
              ? 'ประเมินคะแนนสอบของนักศึกษาแต่ละคนที่ท่านได้รับการแต่งตั้งเป็นกรรมการสอบ พร้อมบันทึก Feedback'
              : 'Grade defense presentation slides, technical report depth, and issue committee comments.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700">
          <div>
            <label className="block text-[11px] font-semibold mb-1">
              {isThai ? 'เลือกนักศึกษาที่เข้ารับการประเมิน' : 'Target Examination Candidate'}
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none font-semibold text-slate-800"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id}) - {s.major}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  {isThai ? '1. คุณภาพสไลด์และลีลาการนำเสนอ (เต็ม 20 คะแนน)' : '1. Presentation Quality & Slide Design (max 20)'}
                </label>
                <span className="font-mono font-bold text-[#6B122C]">{presentationScore} pts</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20" 
                value={presentationScore}
                onChange={(e) => setPresentationScore(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6B122C]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  {isThai ? '2. ความถูกต้องและสมบูรณ์ของเล่มรายงานวิชาการ (เต็ม 30 คะแนน)' : '2. Written Technical Report Accuracy (max 30)'}
                </label>
                <span className="font-mono font-bold text-[#6B122C]">{reportScore} pts</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                value={reportScore}
                onChange={(e) => setReportScore(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6B122C]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  {isThai ? '3. สมรรถนะและความสามารถในการตอบข้อซักถาม (เต็ม 50 คะแนน)' : '3. Technical Defense & Q&A Competence (max 50)'}
                </label>
                <span className="font-mono font-bold text-[#6B122C]">{overallCompetence} pts</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={overallCompetence}
                onChange={(e) => setOverallCompetence(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6B122C]"
              />
            </div>
          </div>

          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between text-xs font-bold text-[#6B122C]">
            <span>{isThai ? 'คะแนนรวมการประเมินวิชาการ (Academic Score):' : 'Combined Academic Score:'}</span>
            <span className="font-mono text-base text-[#6B122C]">{totalScore} / 100</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1">
              {isThai ? 'เขียน Feedback Comments (ข้อคิดเห็นเสนอแนะของกรรมการ)' : 'Assessor Feedback Comments'}
            </label>
            <textarea
              rows={3}
              placeholder={isThai ? 'พิมพ์ข้อคิดเห็น ข้อดี และข้อควรปรับปรุงในโครงงานหรือการนำเสนอ...' : 'Provide feedback remarks and constructive critiques for defense...'}
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
            {isThai ? 'บันทึกและล็อกคะแนนประเมิน (Save Examination Score)' : 'Save Examination Score'}
          </button>
        </form>
      </div>

      {/* 2. Supporting Materials Viewer (ดูเอกสารประกอบการสอบ) (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isThai ? 'ดูเอกสารประกอบการสอบ (Supporting Materials)' : 'Candidate Defense Materials'}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">STU001</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-[#6B122C] shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 truncate max-w-[170px]">
                    {isThai ? 'สไลด์นำเสนอโครงงาน (Slides)' : 'Slide Presentation.pdf'}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">12.8 MB • PDF</span>
                </div>
              </div>
              <button 
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-rose-50 hover:text-[#6B122C] rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
              >
                {isThai ? 'เปิดดู' : 'View'}
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-slate-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 truncate max-w-[170px]">
                    {isThai ? 'เล่มรายงานฉบับสมบูรณ์ (Report)' : 'Full Project Report.pdf'}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">8.4 MB • PDF</span>
                </div>
              </div>
              <button 
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-rose-50 hover:text-[#6B122C] rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
              >
                {isThai ? 'เปิดดู' : 'View'}
              </button>
            </div>
          </div>
        </div>

        {/* Defense Guidelines Card */}
        <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl text-xs text-slate-600 space-y-2">
          <span className="font-bold text-slate-800 block">
            {isThai ? 'แนวทางข้อบังคับการสอบปากเปล่า:' : 'Committee Defense Protocol:'}
          </span>
          <p className="leading-relaxed">
            {isThai 
              ? 'การประเมินผลการสอบนี้จัดทำโดยอาจารย์ที่ปรึกษาและกรรมการผู้ทรงคุณวุฒิ เพื่อวัดผลสัมฤทธิ์ทางการเรียนรู้เชิงทฤษฎีและประยุกต์ของโครงงานสหกิจศึกษา คะแนนจะนำไปรวมกับผลการประเมินจากพี่เลี้ยงในสัดส่วนขั้นสุดท้าย'
              : 'Committee evaluations rate academic synthesis, solution architecture, and theoretical defense. Scores feed directly into the central grade reconciliation board.'}
          </p>
        </div>

      </div>

    </div>
  );
}
