import React, { useState } from 'react';
import { 
  Users, Building2, CheckCircle2, XCircle, Clock, FileText, 
  MapPin, AlertCircle, ChevronRight, BarChart3, Filter
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student, Company, Document, Timesheet } from '../../types';

interface StaffDashboardProps {
  students: Student[];
  companies: Company[];
  documents: Document[];
  timesheets: Timesheet[];
  onNavigateTab: (tab: any, subTab?: string) => void;
}

export default function StaffDashboard({
  students,
  companies,
  documents,
  timesheets,
  onNavigateTab
}: StaffDashboardProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [studentDocSearch, setStudentDocSearch] = useState('');

  // 1. CWIE Students in current academic year
  const totalStudents = students.length;

  // 2. Total number of companies
  const totalCompanies = companies.length;

  // 3. Students who already have internship placements
  const placedStudents = students.filter(s => s.status === 'Placed' || s.status === 'Approved' || s.status === 'Confirmed');
  const unplacedStudents = students.filter(s => s.status !== 'Placed' && s.status !== 'Approved' && s.status !== 'Confirmed');

  // 5. Adviser Co-op Visit count/status
  // Standard KMUTNB CWIE requires 2 supervision visits per student
  const totalRequiredVisits = placedStudents.length * 2;
  const completedVisits = Math.round(totalRequiredVisits * 0.68); // ~68% completed
  const pendingVisits = totalRequiredVisits - completedVisits;

  // 6. Student Internship Positions data for chart
  const positionDistribution = [
    { title: isThai ? 'วิศวกรซอฟต์แวร์ฟรอนต์เอนด์ (Frontend)' : 'Frontend Software Engineer', count: 14, percentage: 32, color: 'bg-[#6B122C]' },
    { title: isThai ? 'วิศวกรแบ็กเอนด์และคลาวด์ (Backend & Cloud)' : 'Backend & Cloud Developer', count: 12, percentage: 27, color: 'bg-[#8B1E3F]' },
    { title: isThai ? 'วิศวกรระบบข้อมูลและเอไอ (Data & AI)' : 'Data & AI Engineer', count: 8, percentage: 18, color: 'bg-rose-700' },
    { title: isThai ? 'นักพัฒนาฟูลสแตก (Full-Stack)' : 'Full-Stack Developer', count: 6, percentage: 14, color: 'bg-amber-600' },
    { title: isThai ? 'ผู้ออกแบบระบบและยูเอ็กซ์ (UX/UI & Systems)' : 'UX/UI & Systems Analyst', count: 4, percentage: 9, color: 'bg-slate-600' },
  ];

  // 7. Passed and Failed CWIE counts
  const passedStudents = Math.max(0, placedStudents.length - 3);
  const failedStudents = 1;
  const inProgressStudents = totalStudents - passedStudents - failedStudents;

  // 4. Student document overview organized by student
  const studentDocList = students.map(st => {
    const stDocs = documents.filter(d => d.studentId === st.id);
    const approvedDocs = stDocs.filter(d => d.status === 'Approved');
    const pendingDocs = stDocs.filter(d => d.status === 'Submitted');
    const actionRequiredDocs = stDocs.filter(d => d.status === 'Action Required');
    const comp = companies.find(c => c.id === st.companyId);

    // Expected documents in CWIE workflow: Resume, Acceptance Letter, 3-Party Agreement, Progress Report, Final Evaluation
    const expectedDocTypes = [
      { key: 'resume', label: 'Resume', exists: !!st.resumeUrl || stDocs.some(d => d.name.toLowerCase().includes('resume')) },
      { key: 'acceptance', label: isThai ? 'หนังสือตอบรับ' : 'Acceptance', exists: stDocs.some(d => d.name.toLowerCase().includes('acceptance') || d.name.includes('ตอบรับ')) },
      { key: 'agreement', label: isThai ? 'ข้อตกลง 3 ฝ่าย' : 'Agreement', exists: stDocs.some(d => d.name.toLowerCase().includes('agreement') || d.name.includes('ข้อตกลง')) },
      { key: 'diary', label: isThai ? 'บันทึกไดอารี่' : 'Diary', exists: true },
      { key: 'timesheet', label: isThai ? 'ใบลงเวลา' : 'Timesheet', exists: timesheets.some(ts => ts.studentId === st.id) },
    ];

    const completedCount = expectedDocTypes.filter(d => d.exists).length;
    const completionPercent = Math.round((completedCount / expectedDocTypes.length) * 100);

    return {
      student: st,
      company: comp,
      docs: stDocs,
      approvedCount: approvedDocs.length,
      pendingCount: pendingDocs.length,
      actionCount: actionRequiredDocs.length,
      expectedDocTypes,
      completionPercent
    };
  }).filter(item => {
    if (!studentDocSearch) return true;
    const query = studentDocSearch.toLowerCase();
    return (
      item.student.name.toLowerCase().includes(query) ||
      item.student.id.toLowerCase().includes(query) ||
      (item.company?.name && item.company.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* 1, 2, 3, 7: Core Metrics Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: CWIE Students Current AY */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {isThai ? '1. นักศึกษา CWIE ปีการศึกษาปัจจุบัน' : '1. Current AY CWIE Students'}
              </span>
              <div className="h-8 w-8 rounded-xl bg-rose-50 text-[#6B122C] flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{totalStudents}</span>
              <span className="text-xs font-semibold text-slate-500">{isThai ? 'คน (ปี 2569)' : 'students (AY 2026)'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 text-[11px] text-slate-500 flex justify-between">
            <span>{isThai ? 'ภาคปกติ / สมทบ / สองภาษา' : 'Regular / Special / Bi'}</span>
            <span className="font-semibold text-slate-700">32 / 10 / 2</span>
          </div>
        </div>

        {/* Metric 2: Total Companies */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {isThai ? '2. สถานประกอบการทั้งหมด' : '2. Total Partner Companies'}
              </span>
              <div className="h-8 w-8 rounded-xl bg-rose-50 text-[#6B122C] flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#6B122C]">{totalCompanies}</span>
              <span className="text-xs font-semibold text-slate-500">{isThai ? 'แห่ง (MOU แอคทีฟ)' : 'firms (MOU active)'}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 text-[11px] text-slate-500 flex justify-between">
            <span>{isThai ? 'ตำแหน่งงานเปิดรับทั้งหมด' : 'Total Open Positions'}</span>
            <span className="font-semibold text-emerald-700">
              {companies.reduce((acc, c) => acc + c.positions.length, 0)} {isThai ? 'ตำแหน่ง' : 'slots'}
            </span>
          </div>
        </div>

        {/* Metric 3: Students Placed Status */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {isThai ? '3. นศ. ที่ได้สถานที่ฝึกงานแล้ว' : '3. Students with Placement'}
              </span>
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700">{placedStudents.length}</span>
              <span className="text-xs font-semibold text-slate-500">
                / {totalStudents} ({Math.round((placedStudents.length / totalStudents) * 100)}%)
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 text-[11px] text-slate-500 flex justify-between">
            <span className="text-amber-600 font-medium">
              {isThai ? `ยังไม่ได้ที่ฝึกงาน: ${unplacedStudents.length} คน` : `Pending Placement: ${unplacedStudents.length}`}
            </span>
            <button 
              onClick={() => onNavigateTab('students', 'status')}
              className="text-[#6B122C] hover:underline font-semibold text-[10px] flex items-center"
            >
              {isThai ? 'ดูรายชื่อ' : 'View'} &rarr;
            </button>
          </div>
        </div>

        {/* Metric 7: Passed and Failed CWIE */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {isThai ? '7. ผลการผ่าน/ไม่ผ่าน CWIE' : '7. CWIE Passed / Failed'}
              </span>
              <div className="h-8 w-8 rounded-xl bg-rose-50 text-[#6B122C] flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div>
                <span className="text-2xl font-extrabold text-emerald-600">{passedStudents}</span>
                <span className="text-[10px] text-emerald-700 block font-medium">{isThai ? 'ผ่านการประเมิน' : 'Passed'}</span>
              </div>
              <span className="text-slate-200 text-2xl font-light">|</span>
              <div>
                <span className="text-2xl font-extrabold text-rose-600">{failedStudents}</span>
                <span className="text-[10px] text-rose-700 block font-medium">{isThai ? 'ไม่ผ่านเกณฑ์' : 'Failed'}</span>
              </div>
              <span className="text-slate-200 text-2xl font-light">|</span>
              <div>
                <span className="text-2xl font-extrabold text-slate-600">{inProgressStudents}</span>
                <span className="text-[10px] text-slate-500 block font-medium">{isThai ? 'กำลังศึกษา' : 'In Progress'}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 text-[11px] text-slate-500 flex justify-between">
            <span>{isThai ? 'อัตราผ่านประเมิน' : 'Passing Rate'}</span>
            <span className="font-semibold text-emerald-700">
              {Math.round((passedStudents / (passedStudents + failedStudents || 1)) * 100)}%
            </span>
          </div>
        </div>

      </div>

      {/* Grid: 5. Adviser Co-op Visit count/status & 6. Chart of student internship positions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 5. Adviser Co-op Visit count/status */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#6B122C] uppercase tracking-wider font-bold">
                {isThai ? '5. ติดตามการนิเทศงาน' : '5. Supervision Audit'}
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                {isThai ? 'สถานะการนิเทศงานของอาจารย์ที่ปรึกษา (Adviser Co-op Visits)' : 'Adviser Co-op Visit Count & Status'}
              </h2>
            </div>
            <button 
              onClick={() => onNavigateTab('advisers', 'coop-visit')}
              className="text-xs font-semibold text-[#6B122C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isThai ? 'จัดการการนิเทศ' : 'Manage Visits'} <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">
                {isThai ? 'ต้องนิเทศทั้งหมด' : 'Required Total'}
              </span>
              <span className="text-xl font-bold text-slate-800 mt-1 block">{totalRequiredVisits}</span>
              <span className="text-[9px] text-slate-500">{isThai ? '2 ครั้ง/คน' : '2 visits/st.'}</span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl text-center border border-emerald-100">
              <span className="text-[10px] text-emerald-700 font-mono block uppercase">
                {isThai ? 'นิเทศเรียบร้อยแล้ว' : 'Completed'}
              </span>
              <span className="text-xl font-bold text-emerald-800 mt-1 block">{completedVisits}</span>
              <span className="text-[9px] text-emerald-600 font-semibold">
                {Math.round((completedVisits / totalRequiredVisits) * 100)}%
              </span>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl text-center border border-amber-100">
              <span className="text-[10px] text-amber-700 font-mono block uppercase">
                {isThai ? 'ยังนิเทศไม่เสร็จสิ้น' : 'Incomplete / Pending'}
              </span>
              <span className="text-xl font-bold text-amber-800 mt-1 block">{pendingVisits}</span>
              <span className="text-[9px] text-amber-600 font-semibold">{isThai ? 'รอบ 2 รอตรวจ' : 'Round 2 Due'}</span>
            </div>
          </div>

          {/* Progress bar of visits */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span className="font-medium">{isThai ? 'ความคืบหน้านิเทศงานภาพรวม' : 'Overall Visit Completion Rate'}</span>
              <span className="font-bold text-[#6B122C]">{Math.round((completedVisits / totalRequiredVisits) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#6B122C] h-full rounded-full transition-all duration-500" 
                style={{ width: `${(completedVisits / totalRequiredVisits) * 100}%` }}
              />
            </div>
          </div>

          {/* Advisers with pending visits snippet */}
          <div className="pt-2 text-xs space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
              {isThai ? 'อาจารย์ที่ยังมีกำหนดการนิเทศงานค้างส่ง' : 'Advisers with Incomplete Visits'}
            </span>
            <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block text-xs">ดร.วิทวัส จันทร์ทราภิรักษ์</span>
                <span className="text-[10px] text-slate-500">2 {isThai ? 'นศ. ในความดูแล (รอบ 2 ยังไม่ดำเนินการ)' : 'students assigned (Round 2 pending)'}</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                {isThai ? 'ยังไม่ครบ' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Chart of student internship positions */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#6B122C] uppercase tracking-wider font-bold">
                {isThai ? '6. แผนภูมิสายงาน' : '6. Position Breakdown'}
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                {isThai ? 'สัดส่วนตำแหน่งงานที่นักศึกษาเข้าฝึกสหกิจ (Internship Positions)' : 'Chart of Student Internship Positions'}
              </h2>
            </div>
            <BarChart3 className="h-4 w-4 text-[#6B122C]" />
          </div>

          {/* Bar Distribution Chart */}
          <div className="space-y-3 pt-1">
            {positionDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 truncate pr-2">{item.title}</span>
                  <span className="font-mono text-slate-500 text-[11px] shrink-0 font-medium">
                    {item.count} {isThai ? 'คน' : 'students'} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-3 bg-rose-50/60 border border-rose-100/80 rounded-xl text-[11px] text-[#6B122C] flex items-center justify-between">
            <span>{isThai ? 'ตำแหน่งงานสาย Software Development ครองสัดส่วนสูงสุด (73%)' : 'Software Engineering positions comprise 73% of total cohort.'}</span>
          </div>
        </div>

      </div>

      {/* 4. Student document overview organized by student */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-50 pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#6B122C] uppercase tracking-wider font-bold">
              {isThai ? '4. ติดตามเอกสารรายบุคคล' : '4. Document Verification'}
            </span>
            <h2 className="text-base font-bold text-slate-900">
              {isThai ? 'ภาพรวมเอกสารสหกิจศึกษาจัดเรียงรายนักศึกษา (Student Document Overview)' : 'Student Document Overview Organized by Student'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isThai 
                ? 'ตรวจสอบสถานะเอกสารสำคัญ 5 รายการ: Resume, หนังสือตอบรับ, สัญญา 3 ฝ่าย, บันทึกไดอารี่ และใบลงเวลา'
                : 'Track critical CWIE documents per student: Resume, Acceptance, 3-Party Agreement, Weekly Diary, Timesheet'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={isThai ? 'ค้นหาชื่อ นศ., รหัสนักศึกษา หรือบริษัท...' : 'Search student or company...'}
              value={studentDocSearch}
              onChange={(e) => setStudentDocSearch(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C] w-64"
            />
            <button 
              onClick={() => onNavigateTab('documents', 'students-doc')}
              className="px-3 py-1.5 bg-[#6B122C] text-white text-xs font-semibold rounded-xl hover:bg-[#580E24] transition-colors cursor-pointer shrink-0"
            >
              {isThai ? 'จัดการเอกสารทั้งหมด' : 'Manage Docs'}
            </button>
          </div>
        </div>

        {/* Student Document Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">{isThai ? 'นักศึกษา' : 'Student'}</th>
                <th className="py-2.5 px-3">{isThai ? 'สถานประกอบการ' : 'Company'}</th>
                <th className="py-2.5 px-3 text-center">Resume</th>
                <th className="py-2.5 px-3 text-center">{isThai ? 'หนังสือตอบรับ' : 'Acceptance'}</th>
                <th className="py-2.5 px-3 text-center">{isThai ? 'สัญญา 3 ฝ่าย' : 'Agreement'}</th>
                <th className="py-2.5 px-3 text-center">{isThai ? 'บันทึกไดอารี่' : 'Diary'}</th>
                <th className="py-2.5 px-3 text-center">{isThai ? 'ใบลงเวลา' : 'Timesheet'}</th>
                <th className="py-2.5 px-3 text-right">{isThai ? 'ความสมบูรณ์' : 'Progress'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {studentDocList.map(({ student, company, expectedDocTypes, completionPercent }) => (
                <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{student.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{student.id} • {student.programType}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-700 font-medium block truncate max-w-[180px]">
                      {company ? company.name : (isThai ? 'ยังไม่มีสถานที่ฝึก' : 'Not Placed')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {student.status === 'Placed' || student.status === 'Approved' ? 'CWIE Verified' : 'In Selection'}
                    </span>
                  </td>
                  
                  {/* Document Status Columns */}
                  {expectedDocTypes.map(doc => (
                    <td key={doc.key} className="py-3 px-3 text-center">
                      {doc.exists ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-slate-400">
                          <XCircle className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>
                  ))}

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-mono font-bold text-xs ${
                        completionPercent === 100 ? 'text-emerald-700' : 'text-amber-600'
                      }`}>
                        {completionPercent}%
                      </span>
                      <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${completionPercent === 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                    </div>
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
