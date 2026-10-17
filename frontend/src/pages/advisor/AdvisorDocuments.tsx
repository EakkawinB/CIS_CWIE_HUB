import React, { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, Clock, User, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student, Document } from '../../types';

interface AdvisorDocumentsProps {
  students: Student[];
  documents: Document[];
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function AdvisorDocuments({ students, documents, onNotify }: AdvisorDocumentsProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'STU001');

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const studentDocs = documents.filter(d => !d.studentId || d.studentId === selectedStudentId);

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Header */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isThai ? 'Documents (เอกสารสหกิจศึกษา แยกตามรายชื่อนักศึกษา)' : 'Student Documents Grouped by Supervised Student'}
          </h2>
          <p className="text-xs text-slate-400">
            {isThai 
              ? 'ตรวจสอบสถานะเอกสาร หนังสือข้อตกลง รายงาน และแบบประเมินของนักศึกษาในการดูแลแต่ละคน'
              : 'Audit document compliance, training agreements, and evaluation files organized per student.'}
          </p>
        </div>

        {/* Student Selector Dropdown / Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">{isThai ? 'เลือกนักศึกษา:' : 'Select Student:'}</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none font-semibold text-slate-800"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grouped Documents Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {isThai ? `รายการเอกสารของ: ${selectedStudent?.name}` : `Documents of: ${selectedStudent?.name}`}
            </h3>
            <span className="text-xs text-slate-400">
              {selectedStudent?.major} • {selectedStudent?.academicYear}
            </span>
          </div>

          <span className="text-xs font-mono text-[#6B122C] font-semibold">
            {studentDocs.length} {isThai ? 'ฉบับ' : 'Files'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-2.5 px-3">{isThai ? 'ชื่อเอกสาร' : 'Document Title'}</th>
                <th className="py-2.5 px-3 hidden md:table-cell">{isThai ? 'หมวดหมู่' : 'Category'}</th>
                <th className="py-2.5 px-3 hidden sm:table-cell">{isThai ? 'วันที่อัปโหลด' : 'Uploaded At'}</th>
                <th className="py-2.5 px-3 text-right">{isThai ? 'สถานะ (Status)' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {studentDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/40">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#6B122C] shrink-0" />
                      <div>
                        <span>{doc.name}</span>
                        {doc.fileName && (
                          <span className="text-[10px] text-slate-400 font-mono block">{doc.fileName}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[10px] hidden md:table-cell">{doc.category}</td>
                  <td className="py-3 px-3 text-slate-400 hidden sm:table-cell">{doc.uploadedAt || '--'}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      doc.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : doc.status === 'Submitted'
                          ? 'bg-rose-50 text-[#6B122C] border border-rose-100'
                          : doc.status === 'Action Required'
                            ? 'bg-amber-50 text-amber-700 animate-pulse'
                            : 'bg-slate-100 text-slate-400'
                    }`}>
                      {doc.status}
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
