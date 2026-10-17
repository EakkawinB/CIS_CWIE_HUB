import React from 'react';
import { FileText, Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface StudentDocumentViewModel {
  id: string;
  name: string;
  category?: string;
  status: string;
  uploadedAt?: string;
  feedback?: string;
}

interface StudentDocumentsProps {
  documents: StudentDocumentViewModel[];
  loading?: boolean;
  error?: string | null;
}

export default function StudentDocuments({ documents, loading = false, error = null }: StudentDocumentsProps) {
  const { i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
            {isThai ? 'อนุมัติแล้ว' : 'Approved'}
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-[#6B122C] border border-rose-100">
            {isThai ? 'ยื่นแล้ว' : 'Submitted'}
          </span>
        );
      case 'Action Required':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            {isThai ? 'ต้องดำเนินการ' : 'Action Required'}
          </span>
        );
      case 'Missing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100">
            {isThai ? 'ยังไม่ส่ง' : 'Missing'}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          {isThai ? 'เอกสารยื่นเรื่องประกอบหลักสูตรสหกิจศึกษา (CWIE Documents)' : 'Required Academic CWIE Documentation'}
        </h2>
        <p className="text-xs text-slate-400">
          {isThai
            ? 'ตรวจสอบสถานะเอกสารยื่นเรื่องและคำรับรองทั้งหมดในหลักสูตรสหกิจศึกษา'
            : 'Track review statuses and official feedback for all required CWIE documents.'}
        </p>
      </div>

      {/* Document Status Inventory Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isThai ? 'สถานะของเอกสารทั้งหมด (Document Statuses)' : 'Document Status Inventory'}
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            {isThai ? `ทั้งหมด ${documents.length} รายการ` : `Total ${documents.length} items`}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            {isThai ? 'กำลังโหลดรายการเอกสาร...' : 'Loading documents...'}
          </div>
        ) : error ? (
          <div className="p-12 text-center border border-rose-100 rounded-xl bg-rose-50/50">
            <p className="text-xs font-semibold text-rose-700">{error}</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              {isThai ? 'ไม่พบรายการเอกสารในระบบ' : 'No documents found.'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isThai ? 'เอกสารประกอบหลักสูตรจะแสดงที่นี่เมื่อเริ่มกระบวนการ' : 'Required curriculum documents will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">{isThai ? 'ชื่อเอกสาร' : 'Document Name'}</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">{isThai ? 'หมวดหมู่' : 'Category'}</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">{isThai ? 'วันที่อัปโหลด' : 'Uploaded'}</th>
                  <th className="py-2.5 px-3 text-right">{isThai ? 'สถานะ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-950">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#6B122C] shrink-0" />
                          <span>{doc.name}</span>
                        </div>
                        {doc.feedback && (
                          <span className="block text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                            <b>{isThai ? 'ข้อเสนอแนะแก้ไข:' : 'Feedback:'}</b> {doc.feedback}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500 hidden md:table-cell">{doc.category || '—'}</td>
                    <td className="py-3 px-3 text-slate-400 hidden sm:table-cell">{doc.uploadedAt || '--'}</td>
                    <td className="py-3 px-3 text-right">
                      {getStatusBadge(doc.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
