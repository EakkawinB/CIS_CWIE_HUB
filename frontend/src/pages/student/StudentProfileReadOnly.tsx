import React, { useState } from 'react';
import { Download, FileText, UploadCloud, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { ResumeResponseDto, StudentProfileResponseDto } from '../../services/api';

interface StudentProfileReadOnlyProps {
  profile: StudentProfileResponseDto | null;
  resume: ResumeResponseDto | null;
  loading: boolean;
  error: string | null;
  onUploadResume: (file: File) => Promise<void>;
  onDownloadResume: () => Promise<void>;
}

export default function StudentProfileReadOnly({
  profile,
  resume,
  loading,
  error,
  onUploadResume,
  onDownloadResume,
}: StudentProfileReadOnlyProps) {
  const { i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      await onUploadResume(file);
    } catch {
      return;
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="w-full max-w-3xl bg-white p-8 rounded-2xl text-center text-xs text-slate-500">{isThai ? '\u0e01\u0e33\u0e25\u0e31\u0e07\u0e42\u0e2b\u0e25\u0e14\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25...' : 'Loading profile...'}</div>;
  }
  if (error || !profile) {
    return <div className="w-full max-w-3xl bg-white p-8 rounded-2xl text-center text-xs text-rose-700">{error || 'Student profile was not found.'}</div>;
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim();
  return (
    <div className="w-full max-w-3xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs space-y-6 text-left">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="h-14 w-14 bg-[#6B122C] text-white font-extrabold flex items-center justify-center text-xl rounded-2xl">
          {fullName.charAt(0) || <User className="h-6 w-6" />}
        </div>
        <div><h2 className="text-lg font-bold text-slate-900">{fullName || '-'}</h2><p className="text-xs text-slate-400">{profile.major || '-'}{profile.year ? ` | ${profile.year}` : ''}</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <Info label="Student ID" value={profile.student_id} />
        <Info label="Email" value={profile.email} />
        <Info label={isThai ? '\u0e2a\u0e32\u0e02\u0e32' : 'Major'} value={profile.major} />
        <Info label="GPAX" value={profile.gpax} />
        <Info label={isThai ? '\u0e0a\u0e31\u0e49\u0e19\u0e1b\u0e35' : 'Academic Year'} value={profile.year} />
        <Info label={isThai ? '\u0e40\u0e1a\u0e2d\u0e23\u0e4c\u0e42\u0e17\u0e23\u0e28\u0e31\u0e1e\u0e17\u0e4c' : 'Phone'} value={profile.phone} />
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resume</h3>
        {resume ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-[#6B122C]" /><div><p className="text-xs font-bold">Resume PDF</p><p className="text-[10px] text-slate-400">{resume.status} | {resume.uploaded_at?.slice(0, 10) || '-'}</p></div></div>
            <button type="button" onClick={onDownloadResume} className="px-3 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"><Download className="h-4 w-4" />{isThai ? '\u0e14\u0e32\u0e27\u0e19\u0e4c\u0e42\u0e2b\u0e25\u0e14' : 'Download'}</button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-slate-200 hover:border-[#6B122C] bg-slate-50 rounded-xl p-5 text-center relative cursor-pointer block">
            <input type="file" accept="application/pdf,.pdf" disabled={uploading} onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
            <UploadCloud className="h-7 w-7 text-slate-400 mx-auto mb-1.5" />
            <span className="text-xs font-semibold text-slate-700 block">{uploading ? 'Uploading...' : 'Upload Resume PDF'}</span>
            <span className="text-[10px] text-slate-400">PDF only, maximum 5 MiB</span>
          </label>
        )}
      </div>
      <p className="text-[10px] text-slate-400">{isThai ? '\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e42\u0e1b\u0e23\u0e44\u0e1f\u0e25\u0e4c\u0e40\u0e1b\u0e47\u0e19\u0e41\u0e1a\u0e1a\u0e2d\u0e48\u0e32\u0e19\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e40\u0e14\u0e35\u0e22\u0e27' : 'Profile information is read-only.'}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number | null }) {
  return <div><span className="text-[10px] text-slate-400 block font-mono">{label}</span><span className="font-semibold text-slate-800">{value ?? '-'}</span></div>;
}
