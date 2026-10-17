import React, { useState } from 'react';
import { 
  ClipboardCheck, Search, Users, Award, CheckCircle2, 
  Clock, AlertCircle, Building2, GraduationCap, Eye, FileText, 
  Filter, Sliders, Plus, Edit2, Trash2, X, Check, ArrowUpDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface StaffEvaluationProps {
  students: Student[];
  initialSubTab?: 'advisers' | 'mentors' | 'final';
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

// 1. Committee evaluation per member
export interface CommitteeEvaluationItem {
  adviserId: string;
  adviserName: string;
  adviserRole: string; // e.g. Chair, Committee Member, External
  score: number;
  maxScore: number;
  comment: string;
  submittedAt: string;
}

// Student Defense Record with ALL committee members evaluations
export interface StudentDefenseEvaluationRecord {
  studentId: string;
  studentName: string;
  major: string;
  topic: string;
  round: string;
  evaluations: CommitteeEvaluationItem[];
  averageScore?: number;
  resultStatus: 'Passed' | 'Failed' | 'Pending';
}

// 2. Mentor Evaluation Record
export interface MentorEvaluationRecord {
  studentId: string;
  studentName: string;
  companyName: string;
  mentorName: string;
  evaluationScore: number;
  maxScore: number;
  mentorComment: string;
  status: 'Completed' | 'Pending Review';
  submittedDate: string;
  resultStatus: 'Passed' | 'Failed' | 'Pending';
}

// 3. Final Combined Record
export interface FinalStudentEvaluationRecord {
  studentId: string;
  studentName: string;
  adviserResult: string; // e.g. 'Passed (Avg 88/100)'
  mentorResult: string;  // e.g. 'Passed (94/100)'
  adviserScore: number;
  mentorScore: number;
  finalScore?: number;
  grade: string;
  resultStatus: 'Passed' | 'Failed' | 'Pending';
}

// 4. Configurable Grade Criteria
export interface GradeCriterion {
  id: string;
  grade: string;
  minScore: number;
  maxScore: number;
  description?: string;
}

export default function StaffEvaluation({
  students,
  initialSubTab = 'advisers',
  onNotify
}: StaffEvaluationProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeSubTab, setActiveSubTab] = useState<'advisers' | 'mentors' | 'final'>(
    initialSubTab === 'mentors' ? 'mentors' : initialSubTab === 'final' ? 'final' : 'advisers'
  );

  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState<'All' | 'Passed' | 'Failed'>('All');

  // Selected student for detailed committee inspection
  const [inspectingDefense, setInspectingDefense] = useState<StudentDefenseEvaluationRecord | null>(null);
  const [inspectingMentor, setInspectingMentor] = useState<MentorEvaluationRecord | null>(null);

  // ---------------------------------------------------------------------------
  // 1. ADVISERS EVALUATION DATA (ALL Committee evaluations shown separately)
  // ---------------------------------------------------------------------------
  const [adviserDefenseRecords] = useState<StudentDefenseEvaluationRecord[]>([
    {
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      major: 'Applied CIS (Regular)',
      topic: 'ระบบจัดการวงจรชีวิตข้อมูลขนาดใหญ่และ Streaming Pipeline ด้วย Kafka และ Go',
      round: 'รอบสอบปากเปล่าสหกิจศึกษา (Final Defense)',
      averageScore: 91,
      resultStatus: 'Passed',
      evaluations: [
        {
          adviserId: 'ADV01',
          adviserName: 'ดร.สมชาย ศรีสุวรรณ',
          adviserRole: 'ประธานกรรมการสอบ (Chair)',
          score: 92,
          maxScore: 100,
          comment: 'ผลงานโครงงานมีสถาปัตยกรรมที่แข็งแกร่ง มีการวัดผล Throughput และ Latency ชัดเจน ตอบคำถามได้ดีเยี่ยม',
          submittedAt: '2026-09-22 10:15'
        },
        {
          adviserId: 'ADV02',
          adviserName: 'ดร.วิทวัส จันทร์ทราภิรักษ์',
          adviserRole: 'กรรมการผู้ทรงคุณวุฒิ',
          score: 89,
          maxScore: 100,
          comment: 'โครงสร้างโค้ดและ CI/CD pipeline ทำได้ถูกต้องตามระเบียบ ควรเพิ่ม security scan ใน container เพิ่มเติม',
          submittedAt: '2026-09-22 10:20'
        },
        {
          adviserId: 'ADV03',
          adviserName: 'ผศ.ดร. ธีรเดช กิตติศักดิ์',
          adviserRole: 'กรรมการที่ปรึกษา',
          score: 92,
          maxScore: 100,
          comment: 'นักศึกษาพัฒนาโครงงานได้เกินเป้าหมายที่กำหนดไว้ในข้อตกลงสหกิจ ชื่นชมความมุ่งมั่น',
          submittedAt: '2026-09-22 10:25'
        }
      ]
    },
    {
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      major: 'Applied CIS (Regular)',
      topic: 'สถาปัตยกรรมคลาวด์เนทีฟอัตโนมัติบน Kubernetes ด้วย Terraform และ GitOps',
      round: 'รอบสอบปากเปล่าสหกิจศึกษา (Final Defense)',
      averageScore: 87,
      resultStatus: 'Passed',
      evaluations: [
        {
          adviserId: 'ADV01',
          adviserName: 'ดร.สมชาย ศรีสุวรรณ',
          adviserRole: 'ประธานกรรมการสอบ (Chair)',
          score: 88,
          maxScore: 100,
          comment: 'การนำเสนอมีความมั่นใจ เข้าใจหลักการ Infrastructure as Code อย่างถ่องแท้',
          submittedAt: '2026-09-22 11:00'
        },
        {
          adviserId: 'ADV02',
          adviserName: 'ดร.วิทวัส จันทร์ทราภิรักษ์',
          adviserRole: 'กรรมการผู้ทรงคุณวุฒิ',
          score: 86,
          maxScore: 100,
          comment: 'การสาธิตระบบ (Live Demo) ราบรื่นดีมาก เอกสารประกอบมีความละเอียดตามมาตรฐาน',
          submittedAt: '2026-09-22 11:05'
        }
      ]
    },
    {
      studentId: 'STU003',
      studentName: 'ชวัลวิทย์ เตชะวณิช',
      major: 'Applied CIS (Regular)',
      topic: 'โมเดลตรวจจับความผิดปกติในเครือข่ายความเร็วสูงด้วย Machine Learning',
      round: 'รอบสอบปากเปล่าสหกิจศึกษา (Final Defense)',
      averageScore: 48,
      resultStatus: 'Failed',
      evaluations: [
        {
          adviserId: 'ADV04',
          adviserName: 'รศ.ดร. สุภาวดี สถิตย์',
          adviserRole: 'ประธานกรรมการสอบ (Chair)',
          score: 45,
          maxScore: 100,
          comment: 'ชุดข้อมูลทดสอบมี Data Leakage และยังไม่สามารถอธิบายทฤษฎีทางสถิติที่สนับสนุนโมเดลได้ชัดเจน',
          submittedAt: '2026-09-22 11:40'
        },
        {
          adviserId: 'ADV02',
          adviserName: 'ดร.วิทวัส จันทร์ทราภิรักษ์',
          adviserRole: 'กรรมการที่ปรึกษา',
          score: 51,
          maxScore: 100,
          comment: 'ชิ้นงานไม่เสร็จสมบูรณ์ตามขอบเขตงานโครงงานสหกิจ ไม่ผ่านเกณฑ์ขั้นต่ำ ต้องสอบแก้ตัว',
          submittedAt: '2026-09-22 11:45'
        }
      ]
    },
    {
      studentId: 'STU004',
      studentName: 'พิมพ์ชนก รัตนกุล',
      major: 'Applied CIS (Special)',
      topic: 'แพลตฟอร์มวิเคราะห์พฤติกรรมผู้บริโภคด้วย Microservices และ Next.js',
      round: 'รอบสอบปากเปล่าสหกิจศึกษา (Final Defense)',
      averageScore: 84,
      resultStatus: 'Passed',
      evaluations: [
        {
          adviserId: 'ADV04',
          adviserName: 'รศ.ดร. สุภาวดี สถิตย์',
          adviserRole: 'ประธานกรรมการสอบ (Chair)',
          score: 85,
          maxScore: 100,
          comment: 'การออกแบบ User Experience ทำได้ประณีต การเชื่อมโยง Service ตอบสนองได้รวดเร็ว',
          submittedAt: '2026-09-22 12:15'
        },
        {
          adviserId: 'ADV02',
          adviserName: 'ดร.วิทวัส จันทร์ทราภิรักษ์',
          adviserRole: 'กรรมการที่ปรึกษา',
          score: 83,
          maxScore: 100,
          comment: 'ผลการทดสอบระบบผ่านเกณฑ์ทุกด้าน รายงานเรียบร้อยดี',
          submittedAt: '2026-09-22 12:20'
        }
      ]
    }
  ]);

  // ---------------------------------------------------------------------------
  // 2. MENTORS EVALUATION DATA (Inspection of Mentor Comment & Score)
  // ---------------------------------------------------------------------------
  const [mentorEvaluations] = useState<MentorEvaluationRecord[]>([
    {
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      companyName: 'NexaTech Solutions Co., Ltd.',
      mentorName: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
      evaluationScore: 95,
      maxScore: 100,
      mentorComment: 'นักศึกษามีทักษะทางเทคนิคยอดเยี่ยม สามารถทำงานร่วมกับทีม Production ได้ตั้งแต่วันแรก มีความรับผิดชอบและส่งงานตรงเวลาเสมอ',
      status: 'Completed',
      submittedDate: '2026-09-15',
      resultStatus: 'Passed'
    },
    {
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      companyName: 'Linear Digital Innovations',
      mentorName: 'คุณกฤษณ์ ตั้งตรง',
      evaluationScore: 92,
      maxScore: 100,
      mentorComment: 'เรียนรู้เทคโนโลยีใหม่ได้เร็วมาก มีทัศนคติที่ดีในการแก้ปัญหาเฉพาะหน้า บริษัทมีความประสงค์จะรับเข้าทำงานต่อทันทีหลังจบการศึกษา',
      status: 'Completed',
      submittedDate: '2026-09-16',
      resultStatus: 'Passed'
    },
    {
      studentId: 'STU003',
      studentName: 'ชวัลวิทย์ เตชะวณิช',
      companyName: 'NexaTech Solutions Co., Ltd.',
      mentorName: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
      evaluationScore: 68,
      maxScore: 100,
      mentorComment: 'ยังขาดวินัยในเรื่องการสื่อสารกับทีม และงานที่ได้รับมอบหมายล่าช้ากว่ากำหนด ต้องปรับปรุงความใส่ใจในรายละเอียดงาน',
      status: 'Completed',
      submittedDate: '2026-09-15',
      resultStatus: 'Passed'
    },
    {
      studentId: 'STU004',
      studentName: 'พิมพ์ชนก รัตนกุล',
      companyName: 'Linear Digital Innovations',
      mentorName: 'คุณพิมพา สุขเกษม',
      evaluationScore: 89,
      maxScore: 100,
      mentorComment: 'ทำงานด้าน Design System ร่วมกับทีมนักพัฒนาได้เป็นอย่างดี มีความคิดสร้างสรรค์และรับฟังคำติชมเพื่อพัฒนาตนเอง',
      status: 'Completed',
      submittedDate: '2026-09-17',
      resultStatus: 'Passed'
    }
  ]);

  // ---------------------------------------------------------------------------
  // 3. CONFIGURABLE GRADE CRITERIA (Managed by Staff)
  // ---------------------------------------------------------------------------
  const [gradeCriteria, setGradeCriteria] = useState<GradeCriterion[]>([
    { id: 'GC-01', grade: 'A', minScore: 80, maxScore: 100, description: 'ดีเยี่ยม (Excellent)' },
    { id: 'GC-02', grade: 'B+', minScore: 75, maxScore: 79, description: 'ดีมาก (Very Good)' },
    { id: 'GC-03', grade: 'B', minScore: 70, maxScore: 74, description: 'ดี (Good)' },
    { id: 'GC-04', grade: 'C+', minScore: 65, maxScore: 69, description: 'ค่อนข้างดี (Fairly Good)' },
    { id: 'GC-05', grade: 'C', minScore: 60, maxScore: 64, description: 'พอใช้ (Fair)' },
    { id: 'GC-06', grade: 'D+', minScore: 55, maxScore: 59, description: 'อ่อน (Poor)' },
    { id: 'GC-07', grade: 'D', minScore: 50, maxScore: 54, description: 'อ่อนมาก (Very Poor)' },
    { id: 'GC-08', grade: 'F', minScore: 0, maxScore: 49, description: 'ตก (Fail)' }
  ]);

  const [isManagingGradeCriteria, setIsManagingGradeCriteria] = useState(false);
  const [editingGradeCriterion, setEditingGradeCriterion] = useState<GradeCriterion | null>(null);
  const [gradeForm, setGradeForm] = useState({ grade: '', minScore: 0, maxScore: 100, description: '' });

  // Calculate grade based on current grade criteria
  const calculateGrade = (score: number): string => {
    const matched = gradeCriteria.find(c => score >= c.minScore && score <= c.maxScore);
    return matched ? matched.grade : '-';
  };

  // ---------------------------------------------------------------------------
  // 4. FINAL EVALUATION DATA (Combined without fixed 50% formula)
  // ---------------------------------------------------------------------------
  const finalEvaluationRecords: FinalStudentEvaluationRecord[] = students.map(student => {
    const adv = adviserDefenseRecords.find(a => a.studentId === student.id);
    const men = mentorEvaluations.find(m => m.studentId === student.id);

    const advScore = adv?.averageScore ?? 0;
    const menScore = men?.evaluationScore ?? 0;

    // Both available? Representative score without fixed weighting
    const hasBoth = adv !== undefined && men !== undefined;
    const finalScore = hasBoth ? Math.round((advScore + menScore) / 2) : undefined;
    const grade = finalScore !== undefined ? calculateGrade(finalScore) : '—';
    const isPassed = adv?.resultStatus === 'Passed' && (men?.resultStatus === 'Passed' || !men);

    return {
      studentId: student.id,
      studentName: student.name,
      adviserResult: adv ? `${adv.resultStatus} (${adv.averageScore}/100)` : (isThai ? 'รอผลสอบ' : 'Pending'),
      mentorResult: men ? `${men.resultStatus} (${men.evaluationScore}/100)` : (isThai ? 'รอผลประเมิน' : 'Pending'),
      adviserScore: advScore,
      mentorScore: menScore,
      finalScore,
      grade,
      resultStatus: adv?.resultStatus === 'Failed' ? 'Failed' : isPassed ? 'Passed' : 'Pending'
    };
  });

  // Handlers for Grade Criteria
  const handleSaveGradeCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGradeCriterion) {
      setGradeCriteria(gradeCriteria.map(c => c.id === editingGradeCriterion.id ? editingGradeCriterion : c));
      setEditingGradeCriterion(null);
      onNotify?.(isThai ? 'แก้ไขเกณฑ์ตัดเกรดเรียบร้อย' : 'Updated grade criterion!', 'success');
    } else {
      const newCriterion: GradeCriterion = {
        id: `GC-${Date.now().toString().slice(-4)}`,
        grade: gradeForm.grade.toUpperCase(),
        minScore: gradeForm.minScore,
        maxScore: gradeForm.maxScore,
        description: gradeForm.description
      };
      setGradeCriteria([...gradeCriteria, newCriterion]);
      setGradeForm({ grade: '', minScore: 0, maxScore: 100, description: '' });
      onNotify?.(isThai ? 'เพิ่มเกณฑ์ตัดเกรดใหม่สำเร็จ' : 'Added grade criterion!', 'success');
    }
  };

  const handleDeleteGradeCriterion = (id: string) => {
    setGradeCriteria(gradeCriteria.filter(c => c.id !== id));
    onNotify?.(isThai ? 'ลบเกณฑ์ตัดเกรดเรียบร้อยแล้ว' : 'Deleted grade criterion.', 'info');
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* 3 Main Sub-sections */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Sub-tab 1: Advisers Evaluation */}
          <button
            onClick={() => setActiveSubTab('advisers')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'advisers'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>{isThai ? 'Advisers Evaluation (ผลสอบจากอาจารย์)' : 'Advisers Evaluation'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {adviserDefenseRecords.length}
            </span>
          </button>

          {/* Sub-tab 2: Mentors Evaluation */}
          <button
            onClick={() => setActiveSubTab('mentors')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'mentors'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{isThai ? 'Mentors Evaluation (ผลประเมินจากพี่เลี้ยง)' : 'Mentors Evaluation'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {mentorEvaluations.length}
            </span>
          </button>

          {/* Sub-tab 3: Final Evaluation */}
          <button
            onClick={() => setActiveSubTab('final')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'final'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>{isThai ? 'Final Evaluation (สรุปผลและตัดเกรด)' : 'Final Evaluation'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {finalEvaluationRecords.length}
            </span>
          </button>
        </div>

        {/* Action button & Filter */}
        <div className="flex items-center gap-2">
          {activeSubTab === 'final' && (
            <button
              onClick={() => setIsManagingGradeCriteria(true)}
              className="px-3 py-1.5 border border-[#6B122C] bg-[#6B122C]/5 hover:bg-[#6B122C]/10 text-[#6B122C] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{isThai ? 'จัดการเกณฑ์ตัดเกรด (Grade Criteria)' : 'Manage Grade Criteria'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value as any)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">{isThai ? 'ผลการประเมินทั้งหมด' : 'All Results'}</option>
              <option value="Passed">{isThai ? 'ผ่าน (Passed)' : 'Passed'}</option>
              <option value="Failed">{isThai ? 'ไม่ผ่าน (Failed)' : 'Failed'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl shadow-xs">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input 
          type="text"
          placeholder={isThai ? 'ค้นหาชื่อนักศึกษา, รหัสนักศึกษา หรือหัวข้อโครงงาน...' : 'Search student name, ID, or project topic...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400"
        />
        {search && (
          <button onClick={() => setSearch('')} className="p-1 hover:bg-slate-100 text-slate-400 rounded-lg cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. ADVISERS EVALUATION (Committee separate scores & comments) */}
      {/* ========================================================= */}
      {activeSubTab === 'advisers' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <div>
              <strong className="text-slate-800 font-bold block">
                {isThai ? 'ผลการสอบประเมินจากคณะกรรมการสอบทุกคน (Advisers & Committee Evaluations)' : 'Defense Committee Evaluations'}
              </strong>
              <span>
                {isThai 
                  ? 'เจ้าหน้าที่สามารถตรวจสอบคะแนนรายบุคคล และความเห็น/คอมเมนต์ ของกรรมการสอบทุกคนแยกจากกันได้อย่างละเอียด' 
                  : 'Staff can inspect both individual scores and comments submitted by every committee member separately.'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shrink-0">
              Audit Mode
            </span>
          </div>

          <div className="space-y-3">
            {adviserDefenseRecords
              .filter(item => {
                const matchesSearch = 
                  item.studentName.toLowerCase().includes(search.toLowerCase()) ||
                  item.studentId.toLowerCase().includes(search.toLowerCase()) ||
                  item.topic.toLowerCase().includes(search.toLowerCase());
                const matchesResult = resultFilter === 'All' || item.resultStatus === resultFilter;
                return matchesSearch && matchesResult;
              })
              .map((record) => (
                <div 
                  key={record.studentId}
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4 text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{record.studentName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">({record.studentId})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {record.major}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium line-clamp-1">
                        📋 {record.topic}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">
                          {isThai ? 'คะแนนเฉลี่ยกรรมการ' : 'Avg Score'}
                        </span>
                        <strong className="text-base font-bold font-mono text-slate-900">
                          {record.averageScore} / 100
                        </strong>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.resultStatus === 'Passed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {record.resultStatus}
                      </span>
                    </div>
                  </div>

                  {/* SEPARATE EVALUATION PER COMMITTEE MEMBER */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isThai ? 'ผลการประเมินและข้อคิดเห็นของกรรมการแต่ละท่าน' : 'Individual Committee Scores & Comments'}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {record.evaluations.map((ev) => (
                        <div key={ev.adviserId} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-[#6B122C]">{ev.adviserName}</span>
                              <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-900">
                                {ev.score} / {ev.maxScore}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mb-1.5">{ev.adviserRole}</span>
                            <p className="text-[11px] text-slate-600 leading-relaxed italic line-clamp-3">
                              "{ev.comment}"
                            </p>
                          </div>

                          <div className="text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-200/50 flex justify-between">
                            <span>{isThai ? 'ส่งผลเมื่อ' : 'Submitted'}:</span>
                            <span>{ev.submittedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MENTORS EVALUATION                                     */}
      {/* ========================================================= */}
      {activeSubTab === 'mentors' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <div>
              <strong className="text-slate-800 font-bold block">
                {isThai ? 'ผลการประเมินจากพี่เลี้ยงสถานประกอบการ (Mentor Evaluations)' : 'Mentor Evaluation Results'}
              </strong>
              <span>
                {isThai 
                  ? 'เจ้าหน้าที่ทำหน้าที่ตรวจสอบคะแนนและคอมเมนต์ที่พี่เลี้ยงส่งมา (เจ้าหน้าที่ไม่สามารถแก้ไขคะแนนหรือความเห็นของพี่เลี้ยงได้)' 
                  : 'Staff inspects submitted mentor scores and comments. Staff cannot edit mentor evaluation data.'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shrink-0">
              Read Only
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">{isThai ? 'นักศึกษา' : 'Student'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'สถานประกอบการ' : 'Company'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'พี่เลี้ยงผู้ประเมิน' : 'Mentor'}</th>
                    <th className="py-3.5 px-4 text-center">{isThai ? 'คะแนนประเมิน' : 'Score'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'ความเห็นของพี่เลี้ยง' : 'Mentor Comment'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'สถานะผลประเมิน' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mentorEvaluations
                    .filter(m => {
                      const matchesSearch = 
                        m.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        m.studentId.toLowerCase().includes(search.toLowerCase()) ||
                        m.companyName.toLowerCase().includes(search.toLowerCase()) ||
                        m.mentorName.toLowerCase().includes(search.toLowerCase());
                      const matchesResult = resultFilter === 'All' || m.resultStatus === resultFilter;
                      return matchesSearch && matchesResult;
                    })
                    .map((item) => (
                      <tr key={item.studentId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{item.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.studentId}</div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {item.companyName}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#6B122C]">{item.mentorName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{item.submittedDate}</div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold font-mono text-sm px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.evaluationScore} / {item.maxScore}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-sm">
                          <p className="text-slate-600 text-[11px] leading-relaxed italic line-clamp-2">
                            "{item.mentorComment}"
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {item.resultStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. FINAL EVALUATION (Combined Result & Grade Criteria)    */}
      {/* ========================================================= */}
      {activeSubTab === 'final' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <div>
              <strong className="text-slate-800 font-bold block">
                {isThai ? 'สรุปผลการประเมินและตัดเกรดวิชาสหกิจศึกษา' : 'Final Evaluation & Grade Allocation'}
              </strong>
              <span>
                {isThai 
                  ? 'แสดงผลลัพธ์รวมทั้งฝั่งอาจารย์และพี่เลี้ยง พร้อมคำนวณเกรดตาม "เกณฑ์ตัดเกรด" ที่เจ้าหน้าที่กำหนดไว้' 
                  : 'Displays combined adviser and mentor results with grade calculation based on configured grade criteria.'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shrink-0">
              Grade Engine
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">{isThai ? 'นักศึกษา' : 'Student'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'ผลสอบจากอาจารย์' : 'Adviser Result'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'ผลประเมินจากพี่เลี้ยง' : 'Mentor Result'}</th>
                    <th className="py-3.5 px-4 text-center">{isThai ? 'คะแนนรวม' : 'Final Score'}</th>
                    <th className="py-3.5 px-4 text-center">{isThai ? 'เกรด' : 'Grade'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'สรุปผล' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finalEvaluationRecords
                    .filter(item => {
                      const matchesSearch = 
                        item.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        item.studentId.toLowerCase().includes(search.toLowerCase());
                      const matchesResult = resultFilter === 'All' || item.resultStatus === resultFilter;
                      return matchesSearch && matchesResult;
                    })
                    .map((item) => (
                      <tr key={item.studentId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{item.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.studentId}</div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {item.adviserResult}
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {item.mentorResult}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                          {item.finalScore !== undefined ? `${item.finalScore} / 100` : '—'}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center justify-center h-8 w-8 rounded-xl font-bold font-mono text-sm ${
                            item.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                            item.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            item.grade.startsWith('C') ? 'bg-amber-100 text-amber-800' :
                            item.grade === 'F' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {item.grade}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.resultStatus === 'Passed' ? 'bg-emerald-100 text-emerald-800' :
                            item.resultStatus === 'Failed' ? 'bg-rose-100 text-rose-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {item.resultStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MANAGE GRADE CRITERIA                              */}
      {/* ========================================================= */}
      {isManagingGradeCriteria && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isThai ? 'จัดการเกณฑ์การตัดเกรด (Manage Grade Criteria)' : 'Manage Grade Criteria'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isThai ? 'กำหนดช่วงคะแนนต่ำสุด-สูงสุด สำหรับการแปลงคะแนนเป็นเกรด' : 'Configure score bounds for grade assignment.'}
                </p>
              </div>
              <button onClick={() => setIsManagingGradeCriteria(false)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Add / Edit Form */}
            <form onSubmit={handleSaveGradeCriterion} className="p-3 bg-slate-50 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                {editingGradeCriterion 
                  ? (isThai ? `แก้ไขเกรด: ${editingGradeCriterion.grade}` : `Edit Grade: ${editingGradeCriterion.grade}`)
                  : (isThai ? 'เพิ่มเกณฑ์เกรดใหม่' : 'Add New Grade Criterion')}
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    {isThai ? 'สัญลักษณ์เกรด *' : 'Grade *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น A, B+, S"
                    value={editingGradeCriterion ? editingGradeCriterion.grade : gradeForm.grade}
                    onChange={(e) => {
                      if (editingGradeCriterion) setEditingGradeCriterion({ ...editingGradeCriterion, grade: e.target.value });
                      else setGradeForm({ ...gradeForm, grade: e.target.value });
                    }}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    {isThai ? 'คะแนนต่ำสุด *' : 'Min Score *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={editingGradeCriterion ? editingGradeCriterion.minScore : gradeForm.minScore}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingGradeCriterion) setEditingGradeCriterion({ ...editingGradeCriterion, minScore: val });
                      else setGradeForm({ ...gradeForm, minScore: val });
                    }}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    {isThai ? 'คะแนนสูงสุด *' : 'Max Score *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={editingGradeCriterion ? editingGradeCriterion.maxScore : gradeForm.maxScore}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingGradeCriterion) setEditingGradeCriterion({ ...editingGradeCriterion, maxScore: val });
                      else setGradeForm({ ...gradeForm, maxScore: val });
                    }}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  {isThai ? 'คำอธิบายเกรด' : 'Description'}
                </label>
                <input
                  type="text"
                  placeholder="เช่น ดีเยี่ยม (Excellent)"
                  value={editingGradeCriterion ? editingGradeCriterion.description || '' : gradeForm.description}
                  onChange={(e) => {
                    if (editingGradeCriterion) setEditingGradeCriterion({ ...editingGradeCriterion, description: e.target.value });
                    else setGradeForm({ ...gradeForm, description: e.target.value });
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                {editingGradeCriterion && (
                  <button
                    type="button"
                    onClick={() => setEditingGradeCriterion(null)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-white cursor-pointer"
                  >
                    {isThai ? 'ยกเลิกการแก้ไข' : 'Cancel Edit'}
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#6B122C] text-white rounded-lg text-xs font-bold hover:bg-[#520d21] cursor-pointer"
                >
                  {editingGradeCriterion ? (isThai ? 'อัปเดตเกณฑ์' : 'Update') : (isThai ? 'เพิ่มเกณฑ์' : 'Add')}
                </button>
              </div>
            </form>

            {/* Criteria List */}
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">{isThai ? 'เกรด' : 'Grade'}</th>
                    <th className="py-2.5 px-3">{isThai ? 'ช่วงคะแนน' : 'Score Range'}</th>
                    <th className="py-2.5 px-3">{isThai ? 'คำอธิบาย' : 'Description'}</th>
                    <th className="py-2.5 px-3 text-right">{isThai ? 'จัดการ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradeCriteria.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                        {c.grade}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {c.minScore} – {c.maxScore}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {c.description || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingGradeCriterion(c)}
                            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                            title={isThai ? 'แก้ไข' : 'Edit'}
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteGradeCriterion(c.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                            title={isThai ? 'ลบ' : 'Delete'}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsManagingGradeCriteria(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isThai ? 'ปิด' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
