import React, { useState } from 'react';
import { 
  BarChart3, Download, Search, Printer, CheckCircle2, 
  XCircle, Filter, FileSpreadsheet, Award, GraduationCap, Building2, Clock 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface StaffReportsProps {
  students: Student[];
  initialSubTab?: 'summary';
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

interface StudentGradeReport {
  studentId: string;
  studentName: string;
  programType: string;
  company: string;
  advisorName: string;
  mentorName: string;
  advisorScore: number; // 50%
  mentorScore: number;  // 50%
  totalScore: number;   // 100%
  grade: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' | 'I';
  result: 'Pass' | 'Fail' | 'Pending';
}

export default function StaffReports({
  students,
  initialSubTab = 'summary',
  onNotify
}: StaffReportsProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState<'All' | 'Pass' | 'Fail' | 'Pending'>('All');

  // Student final grading report dataset
  const [gradeReports] = useState<StudentGradeReport[]>([
    {
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      programType: 'Regular',
      company: 'NexaTech Solutions Co., Ltd.',
      advisorName: 'ผศ.ดร. ธีรเดช กิตติศักดิ์',
      mentorName: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
      advisorScore: 46, // out of 50
      mentorScore: 47,  // out of 50
      totalScore: 93,
      grade: 'A',
      result: 'Pass'
    },
    {
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      programType: 'Regular',
      company: 'Linear Digital Innovations',
      advisorName: 'ผศ.ดร. ธีรเดช กิตติศักดิ์',
      mentorName: 'คุณกฤษณ์ ตั้งตรง',
      advisorScore: 43.5,
      mentorScore: 44.5,
      totalScore: 88,
      grade: 'A',
      result: 'Pass'
    },
    {
      studentId: 'STU003',
      studentName: 'ชวัลวิทย์ เตชะวณิช',
      programType: 'Special',
      company: 'NexaTech Solutions Co., Ltd.',
      advisorName: 'ดร.วิทวัส จันทร์ทราภิรักษ์',
      mentorName: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
      advisorScore: 39,
      mentorScore: 41,
      totalScore: 80,
      grade: 'B+',
      result: 'Pass'
    },
    {
      studentId: 'STU004',
      studentName: 'พิมพ์ชนก รัตนกุล',
      programType: 'Bilingual',
      company: 'Linear Digital Innovations',
      advisorName: 'รศ.ดร. สุภาวดี สถิตย์',
      mentorName: 'คุณพิมพา สุขเกษม',
      advisorScore: 45.5,
      mentorScore: 45.5,
      totalScore: 91,
      grade: 'A',
      result: 'Pass'
    },
    {
      studentId: 'STU005',
      studentName: 'ธนกฤต วิริยะพานิช',
      programType: 'Regular',
      company: 'Siam Intelligence Systems',
      advisorName: 'ดร.สมชาย ศรีสุวรรณ',
      mentorName: 'คุณธวัชชัย เลิศกิจ',
      advisorScore: 0,
      mentorScore: 0,
      totalScore: 0,
      grade: 'I',
      result: 'Pending'
    },
    {
      studentId: 'STU006',
      studentName: 'วรัญญา บุญยเกียรติ',
      programType: 'Special',
      company: 'CloudNexus Bangkok',
      advisorName: 'ดร.สมชาย ศรีสุวรรณ',
      mentorName: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
      advisorScore: 0,
      mentorScore: 0,
      totalScore: 0,
      grade: 'I',
      result: 'Pending'
    }
  ]);

  const passedCount = gradeReports.filter(r => r.result === 'Pass').length;
  const failedCount = gradeReports.filter(r => r.result === 'Fail').length;
  const pendingCount = gradeReports.filter(r => r.result === 'Pending').length;

  const filteredReports = gradeReports.filter(r => {
    const matchSearch = 
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase());
    const matchResult = resultFilter === 'All' || r.result === resultFilter;
    return matchSearch && matchResult;
  });

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Program', 'Company', 'Advisor Score (50)', 'Mentor Score (50)', 'Total (100)', 'Grade', 'Result'];
    const rows = gradeReports.map(r => [
      r.studentId,
      `"${r.studentName}"`,
      r.programType,
      `"${r.company}"`,
      r.advisorScore,
      r.mentorScore,
      r.totalScore,
      r.grade,
      r.result
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CWIE_Final_Grading_Report_AY2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify?.(
      isThai ? 'ส่งออกรายงานเกรด (CSV) เรียบร้อยแล้ว' : 'Exported CWIE final grade report to CSV!',
      'success'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-[#6B122C] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>{isThai ? 'Summary (ภาพรวมผลการประเมินและตัดเกรด)' : 'Summary'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10 font-mono">
              {gradeReports.length} {isThai ? 'คน' : 'Students'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isThai ? 'ค้นหาชื่อ, รหัส, บริษัท...' : 'Search student...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#6B122C]"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-[#6B122C]" />
            <span>{isThai ? 'Export CSV' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5 text-slate-600" />
            <span>{isThai ? 'พิมพ์รายงาน' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">{isThai ? 'นักศึกษาทั้งหมด' : 'Total Evaluated'}</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{gradeReports.length}</span>
          <span className="text-[10px] text-slate-400">{isThai ? 'ปีการศึกษา 2569' : 'AY 2026 Cohort'}</span>
        </div>

        <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-emerald-800 uppercase block font-bold">{isThai ? 'ผ่านการประเมิน (Pass)' : 'Passed CWIE'}</span>
          <span className="text-2xl font-bold text-emerald-800 mt-1 block">{passedCount}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">{Math.round((passedCount / gradeReports.length) * 100)}% {isThai ? 'ของรุ่น' : 'of total'}</span>
        </div>

        <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-rose-800 uppercase block font-bold">{isThai ? 'ไม่ผ่านเกณฑ์ (Fail)' : 'Failed'}</span>
          <span className="text-2xl font-bold text-rose-800 mt-1 block">{failedCount}</span>
          <span className="text-[10px] text-rose-600 font-semibold">0% {isThai ? 'ของรุ่น' : 'of total'}</span>
        </div>

        <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl shadow-xs">
          <span className="text-[10px] font-mono text-amber-800 uppercase block font-bold">{isThai ? 'รอผลคะแนน (Pending)' : 'Awaiting Grade'}</span>
          <span className="text-2xl font-bold text-amber-800 mt-1 block">{pendingCount}</span>
          <span className="text-[10px] text-amber-600 font-semibold">{pendingCount} {isThai ? 'คนรอนิเทศ/สอบ' : 'in review'}</span>
        </div>
      </div>

      {/* Main Final Grading Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isThai ? 'ตารางสรุปผลคะแนนและการตัดเกรด (Final Grading Overview)' : 'Final Grading Matrix (Tripartite Assessment)'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isThai ? 'คำนวณจาก: อาจารย์ที่ปรึกษา (Adviser 50%) + พี่เลี้ยงสถานประกอบการ (Mentor 50%)' : 'Calculated from Advisor 50% + Enterprise Mentor 50% weighted criteria.'}
            </p>
          </div>

          {/* Result Filter Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setResultFilter('All')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                resultFilter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isThai ? 'ทั้งหมด' : 'All'}
            </button>
            <button
              onClick={() => setResultFilter('Pass')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                resultFilter === 'Pass' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {isThai ? 'ผ่าน (Pass)' : 'Pass'}
            </button>
            <button
              onClick={() => setResultFilter('Pending')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                resultFilter === 'Pending' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {isThai ? 'รอผล (Pending)' : 'Pending'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-2.5 px-3">{isThai ? 'นักศึกษา' : 'Student'}</th>
                <th className="py-2.5 px-3 hidden md:table-cell">{isThai ? 'สถานประกอบการ' : 'Company'}</th>
                <th className="py-2.5 px-3 text-center">{isThai ? 'คะแนนอาจารย์ (50%)' : 'Advisor (50%)'}</th>
                <th className="py-2.5 px-3 text-center">{isThai ? 'คะแนนพี่เลี้ยง (50%)' : 'Mentor (50%)'}</th>
                <th className="py-2.5 px-3 text-center">{isThai ? 'คะแนนรวม (100%)' : 'Total (100%)'}</th>
                <th className="py-2.5 px-3 text-center">{isThai ? 'ระดับผลการเรียน' : 'Grade'}</th>
                <th className="py-2.5 px-3 text-right">{isThai ? 'ผลสรุป' : 'Result'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {filteredReports.map((item) => (
                <tr key={item.studentId} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{item.studentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.studentId} • {item.programType}</span>
                  </td>
                  <td className="py-3 px-3 hidden md:table-cell">
                    <span className="font-medium text-slate-800 block">{item.company}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ที่ปรึกษา: {item.advisorName}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                    {item.advisorScore > 0 ? `${item.advisorScore} / 50` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                    {item.mentorScore > 0 ? `${item.mentorScore} / 50` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 text-sm">
                    {item.totalScore > 0 ? `${item.totalScore} / 100` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-md font-mono font-extrabold text-xs ${
                      item.grade === 'A' 
                        ? 'bg-rose-50 text-[#6B122C] border border-rose-200' 
                        : item.grade === 'B+' || item.grade === 'B'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.result === 'Pass'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : item.result === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {item.result === 'Pass' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      <span>{item.result}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
