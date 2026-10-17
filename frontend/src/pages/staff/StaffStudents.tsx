import React, { useState } from 'react';
import { 
  Users, Search, Filter, Eye, CheckCircle2, AlertCircle, 
  X, UserCheck, GraduationCap, Building2, Phone, Mail, BookOpen 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface StaffStudentsProps {
  students: Student[];
  initialSubTab?: 'all' | 'status';
  onUpdateStudent?: (student: Student) => void;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function StaffStudents({
  students,
  initialSubTab = 'all',
  onUpdateStudent,
  onNotify
}: StaffStudentsProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'status'>(initialSubTab);
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState<'All' | 'Regular' | 'Special' | 'Bilingual'>('All');
  const [placementFilter, setPlacementFilter] = useState<'All' | 'Placed' | 'Unplaced'>('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter for Tab 1: All Students
  const filteredAllStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchProgram = programFilter === 'All' || s.programType === programFilter;
    return matchSearch && matchProgram;
  });

  // Filter for Tab 2: Students Status
  const isPlaced = (s: Student) => s.status === 'Placed' || s.status === 'Approved' || s.status === 'Confirmed';
  const placedStudents = students.filter(isPlaced);
  const unplacedStudents = students.filter(s => !isPlaced(s));

  const filteredStatusStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchProgram = programFilter === 'All' || s.programType === programFilter;
    const placed = isPlaced(s);
    const matchPlacement = placementFilter === 'All' 
      ? true 
      : placementFilter === 'Placed' 
        ? placed 
        : !placed;
    return matchSearch && matchProgram && matchPlacement;
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'all'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isThai ? 'All Students (นักศึกษาทั้งหมด)' : 'All Students'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {students.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('status')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'status'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isThai ? 'Students Status (สถานะการได้ที่ฝึกงาน)' : 'Students Status'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {placedStudents.length}/{students.length}
            </span>
          </button>
        </div>

        {/* Search & Program Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isThai ? 'ค้นหาชื่อ หรือรหัสนักศึกษา...' : 'Search student by name/ID...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#6B122C]"
            />
          </div>

          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none text-slate-700 focus:border-[#6B122C]"
          >
            <option value="All">{isThai ? 'ทุกหลักสูตร (All Programs)' : 'All Programs'}</option>
            <option value="Regular">{isThai ? 'ภาคปกติ (Regular)' : 'Regular'}</option>
            <option value="Special">{isThai ? 'ภาคสมทบ (Special)' : 'Special'}</option>
            <option value="Bilingual">{isThai ? 'สองภาษา (Bilingual)' : 'Bilingual'}</option>
          </select>
        </div>
      </div>

      {/* SUB-VIEW 1: All Students */}
      {activeSubTab === 'all' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'นักศึกษา CWIE ปีการศึกษาปัจจุบัน (Current Academic Year)' : 'Current Academic Year CWIE Cohort'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isThai ? 'แยกตามกลุ่มหลักสูตร: ปกติ, สมทบ, และสองภาษา' : 'Categorized by curriculum: Regular, Special, and Bilingual programs'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {filteredAllStudents.length} {isThai ? 'คน' : 'Students'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-3">{isThai ? 'รหัสนักศึกษา / ชื่อ-นามสกุล' : 'Student'}</th>
                  <th className="py-2.5 px-3">{isThai ? 'หลักสูตร' : 'Program Type'}</th>
                  <th className="py-2.5 px-3">{isThai ? 'สาขาวิชา' : 'Department / Major'}</th>
                  <th className="py-2.5 px-3">{isThai ? 'เกรดเฉลี่ย (GPA)' : 'GPA'}</th>
                  <th className="py-2.5 px-3">{isThai ? 'ทักษะความเชี่ยวชาญ' : 'Skills'}</th>
                  <th className="py-2.5 px-3 text-right">{isThai ? 'รายละเอียด' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredAllStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{s.id} • {s.email}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        s.programType === 'Regular'
                          ? 'bg-rose-50 text-[#6B122C] border border-rose-200/60'
                          : s.programType === 'Special'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                      }`}>
                        {s.programType === 'Regular' ? (isThai ? 'ภาคปกติ' : 'Regular') : s.programType === 'Special' ? (isThai ? 'ภาคสมทบ' : 'Special') : (isThai ? 'สองภาษา' : 'Bilingual')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {s.major}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {s.gpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {s.skills.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-mono">
                            {sk}
                          </span>
                        ))}
                        {s.skills.length > 3 && (
                          <span className="text-[9px] text-slate-400">+{s.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-[#6B122C] hover:text-white text-slate-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{isThai ? 'Student Detail' : 'Detail'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Students Status */}
      {activeSubTab === 'status' && (
        <div className="space-y-6">
          
          {/* Status Metric summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                {isThai ? 'นักศึกษาทั้งหมด' : 'Total Cohort'}
              </span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{students.length}</span>
              <span className="text-[10px] text-slate-500">{isThai ? 'ปีการศึกษา 2569' : 'AY 2026'}</span>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono uppercase text-emerald-800 block font-bold">
                {isThai ? 'ได้สถานที่ฝึกงานแล้ว (Placed)' : 'Placed with Company'}
              </span>
              <span className="text-2xl font-bold text-emerald-800 mt-1 block">{placedStudents.length}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {Math.round((placedStudents.length / students.length) * 100)}% {isThai ? 'ของรุ่น' : 'of cohort'}
              </span>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono uppercase text-amber-800 block font-bold">
                {isThai ? 'ยังไม่ได้สถานที่ฝึกงาน (Unplaced)' : 'Awaiting Placement'}
              </span>
              <span className="text-2xl font-bold text-amber-800 mt-1 block">{unplacedStudents.length}</span>
              <span className="text-[10px] text-amber-600 font-semibold">
                {Math.round((unplacedStudents.length / students.length) * 100)}% {isThai ? 'อยู่ระหว่างคัดเลือก' : 'in interview process'}
              </span>
            </div>
          </div>

          {/* Quick status tabs: All / Placed / Unplaced */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlacementFilter('All')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    placementFilter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isThai ? 'ทั้งหมด' : 'All'} ({students.length})
                </button>
                <button
                  onClick={() => setPlacementFilter('Placed')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    placementFilter === 'Placed' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {isThai ? 'ได้ที่ฝึกแล้ว (Placed)' : 'Placed'} ({placedStudents.length})
                </button>
                <button
                  onClick={() => setPlacementFilter('Unplaced')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                    placementFilter === 'Unplaced' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {isThai ? 'ยังไม่ได้ที่ฝึก (Unplaced)' : 'Unplaced'} ({unplacedStudents.length})
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {isThai ? 'แสดงตามเงื่อนไข:' : 'Showing:'} {filteredStatusStudents.length} {isThai ? 'คน' : 'students'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-2.5 px-3">{isThai ? 'นักศึกษา' : 'Student'}</th>
                    <th className="py-2.5 px-3">{isThai ? 'หลักสูตร' : 'Program'}</th>
                    <th className="py-2.5 px-3">{isThai ? 'สถานะการได้ที่ฝึกงาน' : 'Placement Status'}</th>
                    <th className="py-2.5 px-3">{isThai ? 'สถานประกอบการ' : 'Company'}</th>
                    <th className="py-2.5 px-3 text-right">{isThai ? 'รายละเอียด' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {filteredStatusStudents.map((s) => {
                    const placed = isPlaced(s);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{s.id}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                            {s.programType === 'Regular' ? (isThai ? 'ปกติ' : 'Regular') : s.programType === 'Special' ? (isThai ? 'สมทบ' : 'Special') : (isThai ? 'สองภาษา' : 'Bilingual')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            placed 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {placed ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                            <span>{placed ? (isThai ? 'ได้ที่ฝึกงานแล้ว (Placed)' : 'Placed') : (isThai ? 'ยังไม่ได้ที่ฝึกงาน (Unplaced)' : 'Unplaced')}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800">
                            {placed ? (isThai ? 'NexaTech Solutions Co., Ltd.' : 'NexaTech Solutions Co., Ltd.') : (isThai ? '— รอผลการสัมภาษณ์ —' : '— In Interview Process —')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-[#6B122C] hover:text-white text-slate-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            {isThai ? 'ดูข้อมูล' : 'View'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* MODAL: Student Detail */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-[#6B122C] uppercase tracking-wider font-bold">
                  {isThai ? 'ประวัตินักศึกษา CWIE' : 'CWIE Student Dossier'}
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedStudent.id} • {selectedStudent.major}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono uppercase">{isThai ? 'หลักสูตร' : 'Program:'}</span>
                <span className="font-bold text-slate-800 block">
                  {selectedStudent.programType === 'Regular' ? (isThai ? 'ภาคปกติ' : 'Regular') : selectedStudent.programType === 'Special' ? (isThai ? 'ภาคสมทบ' : 'Special') : (isThai ? 'สองภาษา' : 'Bilingual')}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono uppercase">{isThai ? 'เกรดเฉลี่ยสะสม' : 'Cumulative GPA:'}</span>
                <span className="font-bold text-slate-800 block font-mono">{selectedStudent.gpa.toFixed(2)}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono uppercase">{isThai ? 'สถานะการฝึกงาน' : 'Status:'}</span>
                <span className="font-bold text-[#6B122C] block">{selectedStudent.status}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono uppercase">{isThai ? 'ปีการศึกษา' : 'Academic Year:'}</span>
                <span className="font-bold text-slate-800 block">{selectedStudent.academicYear || '2569 / 2026'}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                {isThai ? 'ทักษะทางวิชาการและการเขียนโค้ด (Technical Skills)' : 'Technical Skills'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-rose-50 text-[#6B122C] border border-rose-100 rounded-md text-[11px] font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="h-3.5 w-3.5 text-[#6B122C]" />
                <span className="font-mono">{selectedStudent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="h-3.5 w-3.5 text-[#6B122C]" />
                <span className="font-mono">081-234-5678</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                {isThai ? 'ปิดหน้าต่าง' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
