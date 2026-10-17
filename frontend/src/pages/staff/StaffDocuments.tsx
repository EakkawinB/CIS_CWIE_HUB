import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, AlertTriangle, Download, 
  X, Search, Clock, User, Eye, Filter, Calendar, 
  Building2, GraduationCap, Briefcase, FileSpreadsheet, ShieldAlert, Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Document, Student, Timesheet, WeeklyReport } from '../../types';

interface StaffDocumentsProps {
  documents?: Document[];
  students: Student[];
  timesheets?: Timesheet[];
  initialSubTab?: 'students' | 'advisers' | 'mentors';
  onUpdateDocument?: (doc: Document) => void;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

interface StudentDocItem {
  id: string;
  studentId: string;
  studentName: string;
  major: string;
  docType: 'Resume' | 'Job Acceptance' | 'Co-op Contract' | 'Health Certificate';
  fileName: string;
  fileSize: string;
  submissionDate: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Action Required';
  downloadUrl: string;
}

interface AdviserWeeklyDiaryRecord {
  id: string;
  adviserName: string;
  adviserDept: string;
  studentId: string;
  studentName: string;
  weekNumber: number;
  periodText: string;
  hoursWorked: number;
  submissionDate: string;
  reviewStatus: 'Approved' | 'Pending Review' | 'Requires Edit';
  adviserComment: string;
  studentSummary: string;
}

interface MentorTimesheetRecord {
  id: string;
  companyName: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  period: string; // e.g., 'มิถุนายน 2569 (Month 1)'
  totalHours: number;
  submissionDate: string;
  reviewStatus: 'Signed & Verified' | 'Pending Mentor Signature' | 'Rejected';
  mentorSignatureDate?: string;
  mentorNotes?: string;
}

export default function StaffDocuments({
  students,
  initialSubTab = 'students',
  onNotify
}: StaffDocumentsProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeSubTab, setActiveSubTab] = useState<'students' | 'advisers' | 'mentors'>(
    initialSubTab === 'advisers' ? 'advisers' : initialSubTab === 'mentors' ? 'mentors' : 'students'
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStudentDoc, setSelectedStudentDoc] = useState<StudentDocItem | null>(null);
  const [selectedDiary, setSelectedDiary] = useState<AdviserWeeklyDiaryRecord | null>(null);
  const [selectedTimesheet, setSelectedTimesheet] = useState<MentorTimesheetRecord | null>(null);

  // 1. Students Documents state
  const [studentDocs, setStudentDocs] = useState<StudentDocItem[]>([
    {
      id: 'SDOC-01',
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      major: 'Applied CIS (Regular)',
      docType: 'Resume',
      fileName: 'resume_kasidit_promsorn_2026.pdf',
      fileSize: '2.4 MB',
      submissionDate: '2026-05-10',
      status: 'Approved',
      downloadUrl: '#'
    },
    {
      id: 'SDOC-02',
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      major: 'Applied CIS (Regular)',
      docType: 'Job Acceptance',
      fileName: 'acceptance_nexatech_kasidit.pdf',
      fileSize: '1.1 MB',
      submissionDate: '2026-05-18',
      status: 'Approved',
      downloadUrl: '#'
    },
    {
      id: 'SDOC-03',
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      major: 'Applied CIS (Regular)',
      docType: 'Co-op Contract',
      fileName: 'coop_tripartite_contract_kasidit.pdf',
      fileSize: '3.8 MB',
      submissionDate: '2026-05-25',
      status: 'Approved',
      downloadUrl: '#'
    },
    {
      id: 'SDOC-04',
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      major: 'Applied CIS (Regular)',
      docType: 'Resume',
      fileName: 'resume_narissara_suwan.pdf',
      fileSize: '1.8 MB',
      submissionDate: '2026-05-12',
      status: 'Approved',
      downloadUrl: '#'
    },
    {
      id: 'SDOC-05',
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      major: 'Applied CIS (Regular)',
      docType: 'Co-op Contract',
      fileName: 'contract_linear_digital_narissara.pdf',
      fileSize: '2.1 MB',
      submissionDate: '2026-06-02',
      status: 'Under Review',
      downloadUrl: '#'
    },
    {
      id: 'SDOC-06',
      studentId: 'STU003',
      studentName: 'ชวัลวิทย์ เตชะวณิช',
      major: 'Applied CIS (Regular)',
      docType: 'Resume',
      fileName: 'resume_chawanwit_2026.pdf',
      fileSize: '3.2 MB',
      submissionDate: '2026-05-15',
      status: 'Action Required',
      downloadUrl: '#'
    },
    {
      id: 'SDOC-07',
      studentId: 'STU004',
      studentName: 'พิมพ์ชนก รัตนกุล',
      major: 'Applied CIS (Special)',
      docType: 'Resume',
      fileName: 'pimchanok_cwie_cv.pdf',
      fileSize: '1.5 MB',
      submissionDate: '2026-05-16',
      status: 'Submitted',
      downloadUrl: '#'
    }
  ]);

  // 2. Advisers Weekly Diary Review Workflow state
  const [adviserDiaries] = useState<AdviserWeeklyDiaryRecord[]>([
    {
      id: 'DIARY-01',
      adviserName: 'ดร.สมชาย ศรีสุวรรณ',
      adviserDept: 'ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      weekNumber: 1,
      periodText: 'สัปดาห์ที่ 1 (02 มิ.ย. - 06 มิ.ย. 2569)',
      hoursWorked: 40,
      submissionDate: '2026-06-08',
      reviewStatus: 'Approved',
      adviserComment: 'รับทราบการปรับตัวเข้ากับสภาพแวดล้อมการทำงานของ NexaTech รายงานละเอียดดีมาก',
      studentSummary: 'เข้าปฐมนิเทศพนักงานใหม่ ติดตั้ง Development Environment (Docker, Node.js, Go) และศึกษา Architecture ของระบบหลัก'
    },
    {
      id: 'DIARY-02',
      adviserName: 'ดร.สมชาย ศรีสุวรรณ',
      adviserDept: 'ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      weekNumber: 2,
      periodText: 'สัปดาห์ที่ 2 (09 มิ.ย. - 13 มิ.ย. 2569)',
      hoursWorked: 40,
      submissionDate: '2026-06-15',
      reviewStatus: 'Approved',
      adviserComment: 'วางแผนงานได้ตรงตามหัวข้อสหกิจ ให้ติดตามเรื่อง API Schema ร่วมกับพี่เลี้ยงอย่างต่อเนื่อง',
      studentSummary: 'ออกแบบ RESTful API Endpoints สำหรับโมดูล Authentication และเขียน Unit Tests ครอบคลุม 85%'
    },
    {
      id: 'DIARY-03',
      adviserName: 'ดร.สมชาย ศรีสุวรรณ',
      adviserDept: 'ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      weekNumber: 1,
      periodText: 'สัปดาห์ที่ 1 (02 มิ.ย. - 06 มิ.ย. 2569)',
      hoursWorked: 40,
      submissionDate: '2026-06-07',
      reviewStatus: 'Approved',
      adviserComment: 'การเขียนบันทึกชัดเจน ให้รักษามาตรฐานการบันทึกเช่นนี้ในทุกสัปดาห์',
      studentSummary: 'ศึกษา Cloud Architecture และ Terraform Script ของ Linear Digital'
    },
    {
      id: 'DIARY-04',
      adviserName: 'ดร.วิทวัส จันทร์ทราภิรักษ์',
      adviserDept: 'ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
      studentId: 'STU003',
      studentName: 'ชวัลวิทย์ เตชะวณิช',
      weekNumber: 1,
      periodText: 'สัปดาห์ที่ 1 (02 มิ.ย. - 06 มิ.ย. 2569)',
      hoursWorked: 35,
      submissionDate: '2026-06-10',
      reviewStatus: 'Requires Edit',
      adviserComment: 'นักศึกษาเขียนสรุปผลลัพธ์การปฏิบัติงานสั้นเกินไป กรุณาเพิ่มรายละเอียดทักษะที่นำมาประยุกต์ใช้',
      studentSummary: 'เริ่มเข้าฝึกงาน ปฐมนิเทศ และติดตั้งเครื่องมือ'
    },
    {
      id: 'DIARY-05',
      adviserName: 'ดร.วิทวัส จันทร์ทราภิรักษ์',
      adviserDept: 'ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
      studentId: 'STU004',
      studentName: 'พิมพ์ชนก รัตนกุล',
      weekNumber: 1,
      periodText: 'สัปดาห์ที่ 1 (02 มิ.ย. - 06 มิ.ย. 2569)',
      hoursWorked: 40,
      submissionDate: '2026-06-09',
      reviewStatus: 'Pending Review',
      adviserComment: '— รออาจารย์ที่ปรึกษาเข้าตรวจประเมิน —',
      studentSummary: 'เข้าทีม Product Design ทำการวิเคราะห์ User Journey และ Wireframes'
    }
  ]);

  // 3. Mentors Timesheet Review Workflow state
  const [mentorTimesheets] = useState<MentorTimesheetRecord[]>([
    {
      id: 'TS-01',
      companyName: 'NexaTech Solutions Co., Ltd.',
      mentorName: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      period: 'มิถุนายน 2569 (เดือนที่ 1)',
      totalHours: 168,
      submissionDate: '2026-06-30',
      reviewStatus: 'Signed & Verified',
      mentorSignatureDate: '2026-07-02 11:30',
      mentorNotes: 'ลงเวลาครบถ้วน ไม่เคยขาดหรือสาย มีความตั้งใจสูงและปฏิบัติตามกฎบริษัทเคร่งครัด'
    },
    {
      id: 'TS-02',
      companyName: 'NexaTech Solutions Co., Ltd.',
      mentorName: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
      studentId: 'STU003',
      studentName: 'ชวัลวิทย์ เตชะวณิช',
      period: 'มิถุนายน 2569 (เดือนที่ 1)',
      totalHours: 152,
      submissionDate: '2026-06-30',
      reviewStatus: 'Pending Mentor Signature',
      mentorNotes: 'มีวันลาป่วย 1 วัน อยู่ระหว่างรอตรวจสอบใบรับรองแพทย์'
    },
    {
      id: 'TS-03',
      companyName: 'Linear Digital Innovations',
      mentorName: 'คุณกฤษณ์ ตั้งตรง',
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      period: 'มิถุนายน 2569 (เดือนที่ 1)',
      totalHours: 168,
      submissionDate: '2026-06-30',
      reviewStatus: 'Signed & Verified',
      mentorSignatureDate: '2026-07-01 16:45',
      mentorNotes: 'ตรวจสอบเวลาทำงานเรียบร้อย สมบูรณ์ถูกต้องตามตารางงาน'
    },
    {
      id: 'TS-04',
      companyName: 'Linear Digital Innovations',
      mentorName: 'คุณพิมพา สุขเกษม',
      studentId: 'STU004',
      studentName: 'พิมพ์ชนก รัตนกุล',
      period: 'มิถุนายน 2569 (เดือนที่ 1)',
      totalHours: 160,
      submissionDate: '2026-06-30',
      reviewStatus: 'Pending Mentor Signature',
      mentorNotes: 'นักศึกษาส่งใบบันทึกเวลาแล้ว รอหัวหน้างานลงนามรับรอง'
    }
  ]);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* 3 Main Sub-sections */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Sub-tab 1: Students Document */}
          <button
            onClick={() => { setActiveSubTab('students'); setStatusFilter('All'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'students'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{isThai ? 'Students Document (เอกสารนักศึกษา)' : 'Students Document'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {studentDocs.length}
            </span>
          </button>

          {/* Sub-tab 2: Advisers Document (Weekly Diary) */}
          <button
            onClick={() => { setActiveSubTab('advisers'); setStatusFilter('All'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'advisers'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>{isThai ? 'Advisers Document (Weekly Diary)' : 'Advisers Document'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {adviserDiaries.length}
            </span>
          </button>

          {/* Sub-tab 3: Mentors Document (Timesheets) */}
          <button
            onClick={() => { setActiveSubTab('mentors'); setStatusFilter('All'); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'mentors'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>{isThai ? 'Mentors Document (Timesheets)' : 'Mentors Document'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {mentorTimesheets.length}
            </span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span>{isThai ? 'สถานะ:' : 'Status:'}</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-[#6B122C]"
          >
            <option value="All">{isThai ? 'ทั้งหมด (All)' : 'All'}</option>
            {activeSubTab === 'students' && (
              <>
                <option value="Approved">Approved</option>
                <option value="Under Review">Under Review</option>
                <option value="Submitted">Submitted</option>
                <option value="Action Required">Action Required</option>
              </>
            )}
            {activeSubTab === 'advisers' && (
              <>
                <option value="Approved">Approved</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Requires Edit">Requires Edit</option>
              </>
            )}
            {activeSubTab === 'mentors' && (
              <>
                <option value="Signed & Verified">Signed & Verified</option>
                <option value="Pending Mentor Signature">Pending Mentor Signature</option>
                <option value="Rejected">Rejected</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl shadow-xs">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input 
          type="text"
          placeholder={
            activeSubTab === 'students'
              ? (isThai ? 'ค้นหาชื่อนักศึกษา, รหัสนักศึกษา หรือประเภทเอกสาร...' : 'Search student name, ID, or document type...')
              : activeSubTab === 'advisers'
              ? (isThai ? 'ค้นหาอาจารย์ที่ปรึกษา, นักศึกษา หรือสัปดาห์ที่รายงาน...' : 'Search advisor, student, or weekly diary...')
              : (isThai ? 'ค้นหาสถานประกอบการ, พี่เลี้ยง หรือนักศึกษา...' : 'Search company, mentor, or student...')
          }
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
      {/* SUB-SECTION 1: STUDENTS DOCUMENT                          */}
      {/* Student → Document Type → Document → Status              */}
      {/* ========================================================= */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <div>
              <strong className="text-slate-800 font-bold block">
                {isThai ? 'การกำกับติดตามเอกสารของนักศึกษา (Monitoring Mode)' : 'Student Documents Workflow Monitoring'}
              </strong>
              <span>
                {isThai 
                  ? 'เจ้าหน้าที่ทำหน้าที่กำกับติดตามสถานะการส่งเอกสารของนักศึกษา (เช่น Resume, ใบตอบรับ, สัญญาสหกิจ) โดยไม่สามารถแก้ไขเนื้อหาเอกสารของนักศึกษาได้' 
                  : 'Staff monitors student document submissions and review progress without directly editing student document contents.'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shrink-0">
              Read-Only
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">{isThai ? 'นักศึกษา' : 'Student'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'ประเภทเอกสาร' : 'Document Type'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'ชื่อไฟล์ / เอกสาร' : 'Document / File'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'วันที่ส่ง' : 'Submission Date'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'สถานะ' : 'Status'}</th>
                    <th className="py-3.5 px-4 text-right">{isThai ? 'การจัดการ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentDocs
                    .filter(doc => {
                      const matchesSearch = 
                        doc.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        doc.studentId.toLowerCase().includes(search.toLowerCase()) ||
                        doc.docType.toLowerCase().includes(search.toLowerCase()) ||
                        doc.fileName.toLowerCase().includes(search.toLowerCase());
                      const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{doc.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{doc.studentId} • {doc.major}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700">
                            {doc.docType}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[220px]">{doc.fileName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {doc.submissionDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            doc.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                            doc.status === 'Action Required' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {doc.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedStudentDoc(doc)}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                              title={isThai ? 'ดูรายละเอียดเอกสาร' : 'View Details'}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                onNotify?.(
                                  isThai ? `ดาวน์โหลดไฟล์ ${doc.fileName} สำเร็จ` : `Downloaded ${doc.fileName}!`,
                                  'info'
                                );
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                              title={isThai ? 'ดาวน์โหลดเอกสาร' : 'Download Document'}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
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
      {/* SUB-SECTION 2: ADVISERS DOCUMENT (Weekly Diary Review)    */}
      {/* Adviser → Student → Weekly Diary → Status                 */}
      {/* ========================================================= */}
      {activeSubTab === 'advisers' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <div>
              <strong className="text-slate-800 font-bold block">
                {isThai ? 'การกำกับติดตาม Weekly Diary ที่ตรวจโดยอาจารย์ที่ปรึกษา' : 'Adviser Weekly Diary Review Workflow'}
              </strong>
              <span>
                {isThai 
                  ? 'เจ้าหน้าที่ทำหน้าที่กำกับติดตามว่าอาจารย์ท่านใดดูแลนักศึกษาคนใด และตรวจประเมิน Weekly Diary ถึงไหนแล้ว (เจ้าหน้าที่ไม่อนุมัติแทนอาจารย์ และไม่แก้ไขคอมเมนต์ของอาจารย์)' 
                  : 'Staff monitors supervisor weekly diary reviews. Staff does not approve on behalf of advisers or edit advisor comments.'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shrink-0">
              Audit Only
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">{isThai ? 'อาจารย์ที่ปรึกษา' : 'Adviser'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'นักศึกษา' : 'Student'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'บันทึกประจำสัปดาห์ / ชั่วโมง' : 'Weekly Diary / Hours'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'วันที่ส่ง' : 'Submission Date'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'สถานะการตรวจ' : 'Review Status'}</th>
                    <th className="py-3.5 px-4 text-right">{isThai ? 'ดูรายละเอียด' : 'View'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adviserDiaries
                    .filter(item => {
                      const matchesSearch = 
                        item.adviserName.toLowerCase().includes(search.toLowerCase()) ||
                        item.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        item.studentId.toLowerCase().includes(search.toLowerCase()) ||
                        item.periodText.toLowerCase().includes(search.toLowerCase());
                      const matchesStatus = statusFilter === 'All' || item.reviewStatus === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#6B122C]">{item.adviserName}</div>
                          <div className="text-[10px] text-slate-400">{item.adviserDept}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{item.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.studentId}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{item.periodText}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{item.hoursWorked} {isThai ? 'ชั่วโมง' : 'hours'}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {item.submissionDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.reviewStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            item.reviewStatus === 'Requires Edit' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {item.reviewStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedDiary(item)}
                            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 inline mr-1" />
                            <span>{isThai ? 'ตรวจสอบ' : 'View'}</span>
                          </button>
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
      {/* SUB-SECTION 3: MENTORS DOCUMENT (Timesheets)              */}
      {/* Company → Mentor → Student → Timesheet → Status           */}
      {/* ========================================================= */}
      {activeSubTab === 'mentors' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <div>
              <strong className="text-slate-800 font-bold block">
                {isThai ? 'การกำกับติดตามใบบันทึกเวลา (Timesheets) ของพี่เลี้ยง' : 'Mentor Timesheets Review Workflow'}
              </strong>
              <span>
                {isThai 
                  ? 'เจ้าหน้าที่ทำหน้าที่กำกับติดตามลำดับชั้น สถานประกอบการ → พี่เลี้ยง → นักศึกษา → Timesheet (เจ้าหน้าที่ไม่ลงนามแทนพี่เลี้ยง และไม่แก้ไขข้อมูลการประเมินเวลา)' 
                  : 'Staff monitors Company → Mentor → Student → Timesheet hierarchy. Staff does not sign on behalf of mentors.'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shrink-0">
              Audit Only
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">{isThai ? 'สถานประกอบการ' : 'Company'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'พี่เลี้ยง' : 'Mentor'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'นักศึกษา' : 'Student'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'รอบเวลา / ชั่วโมง' : 'Timesheet / Hours'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'วันที่ส่ง' : 'Submission Date'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'สถานะการลงนาม' : 'Signature Status'}</th>
                    <th className="py-3.5 px-4 text-right">{isThai ? 'ดูเอกสาร' : 'View'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mentorTimesheets
                    .filter(item => {
                      const matchesSearch = 
                        item.companyName.toLowerCase().includes(search.toLowerCase()) ||
                        item.mentorName.toLowerCase().includes(search.toLowerCase()) ||
                        item.studentName.toLowerCase().includes(search.toLowerCase()) ||
                        item.studentId.toLowerCase().includes(search.toLowerCase()) ||
                        item.period.toLowerCase().includes(search.toLowerCase());
                      const matchesStatus = statusFilter === 'All' || item.reviewStatus === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {item.companyName}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#6B122C]">{item.mentorName}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{item.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.studentId}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{item.period}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{item.totalHours} {isThai ? 'ชม.' : 'hrs'}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {item.submissionDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.reviewStatus === 'Signed & Verified' ? 'bg-emerald-100 text-emerald-800' :
                            item.reviewStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {item.reviewStatus}
                          </span>
                          {item.mentorSignatureDate && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ✍️ {item.mentorSignatureDate}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedTimesheet(item)}
                            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 inline mr-1" />
                            <span>{isThai ? 'เปิดดู' : 'View'}</span>
                          </button>
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
      {/* MODAL: VIEW STUDENT DOCUMENT                              */}
      {/* ========================================================= */}
      {selectedStudentDoc && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedStudentDoc.fileName}</h3>
                <p className="text-[11px] text-slate-400">
                  {selectedStudentDoc.studentName} ({selectedStudentDoc.studentId})
                </p>
              </div>
              <button onClick={() => setSelectedStudentDoc(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">{isThai ? 'ประเภทเอกสาร:' : 'Type:'}</span>
                <strong className="font-bold text-slate-900">{selectedStudentDoc.docType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isThai ? 'ขนาดไฟล์:' : 'File Size:'}</span>
                <span className="font-mono">{selectedStudentDoc.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isThai ? 'วันที่อัปโหลด:' : 'Submitted Date:'}</span>
                <span className="font-mono">{selectedStudentDoc.submissionDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{isThai ? 'สถานะปัจจุบัน:' : 'Current Status:'}</span>
                <span className="font-bold text-[#6B122C]">{selectedStudentDoc.status}</span>
              </div>
            </div>

            <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center space-y-2">
              <FileText className="h-8 w-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">
                {isThai ? 'เอกสารถูกจัดเก็บในระบบคลาวด์ของ มจพ. ปลอดภัยตามมาตรฐาน' : 'File stored securely in university document repository.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudentDoc(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {isThai ? 'ปิด' : 'Close'}
              </button>
              <button
                onClick={() => {
                  onNotify?.(
                    isThai ? `ดาวน์โหลด ${selectedStudentDoc.fileName} เรียบร้อย` : `Downloaded file!`,
                    'info'
                  );
                }}
                className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isThai ? 'ดาวน์โหลดเอกสาร' : 'Download File'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW ADVISER WEEKLY DIARY                          */}
      {/* ========================================================= */}
      {selectedDiary && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedDiary.periodText}</h3>
                <p className="text-[11px] text-slate-400">
                  {selectedDiary.studentName} ({selectedDiary.studentId}) • {selectedDiary.adviserName}
                </p>
              </div>
              <button onClick={() => setSelectedDiary(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isThai ? 'สรุปการปฏิบัติงานของนักศึกษา (Student Summary)' : 'Student Summary'}
                </span>
                <p className="text-slate-700 leading-relaxed">{selectedDiary.studentSummary}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  ⏱️ {isThai ? 'ชั่วโมงทำงานสะสมสัปดาห์นี้:' : 'Hours:'} {selectedDiary.hoursWorked} ชั่วโมง
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    {isThai ? 'ความเห็นอาจารย์ที่ปรึกษา (Adviser Comment)' : 'Adviser Comment'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    selectedDiary.reviewStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedDiary.reviewStatus}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium italic">"{selectedDiary.adviserComment}"</p>
                <div className="text-[10px] text-slate-500 font-mono pt-1">
                  ✍️ {selectedDiary.adviserName} ({selectedDiary.adviserDept})
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedDiary(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isThai ? 'ปิด' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW MENTOR TIMESHEET                              */}
      {/* ========================================================= */}
      {selectedTimesheet && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isThai ? 'ใบบันทึกเวลาและรับรองการทำงาน' : 'Timesheet & Verification'}
                </h3>
                <p className="text-[11px] text-slate-400">{selectedTimesheet.period}</p>
              </div>
              <button onClick={() => setSelectedTimesheet(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isThai ? 'สถานประกอบการ:' : 'Company:'}</span>
                  <strong className="font-bold text-slate-900">{selectedTimesheet.companyName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isThai ? 'พี่เลี้ยงผู้รับผิดชอบ:' : 'Mentor:'}</span>
                  <span className="text-[#6B122C] font-semibold">{selectedTimesheet.mentorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isThai ? 'นักศึกษา:' : 'Student:'}</span>
                  <span>{selectedTimesheet.studentName} ({selectedTimesheet.studentId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isThai ? 'ชั่วโมงงานรวมประจำรอบ:' : 'Total Hours:'}</span>
                  <strong className="font-mono text-emerald-700">{selectedTimesheet.totalHours} ชั่วโมง</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isThai ? 'ข้อความกำกับจากพี่เลี้ยง / หมายเหตุ' : 'Mentor Notes'}
                </span>
                <p className="text-slate-700 leading-relaxed italic">
                  "{selectedTimesheet.mentorNotes || '-'}"
                </p>
                {selectedTimesheet.mentorSignatureDate && (
                  <div className="text-[10px] text-emerald-700 font-mono pt-1">
                    ✓ ลงนามรับรองดิจิทัลเมื่อ {selectedTimesheet.mentorSignatureDate}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTimesheet(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
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
