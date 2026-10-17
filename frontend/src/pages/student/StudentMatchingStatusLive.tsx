import React, { useEffect, useState } from 'react';
import { AlertCircle, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getApiErrorStatus, getMyMatching, type ApplicationResponseDto, type MatchingResponseDto } from '../../services/api';

interface Props {
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

const labels: Record<ApplicationResponseDto['status'], { th: string; en: string }> = {
  applied: { th: 'ส่งใบสมัครแล้ว', en: 'Applied' },
  interview_scheduled: { th: 'นัดสัมภาษณ์แล้ว', en: 'Interview Scheduled' },
  waiting_result: { th: 'รอผลการพิจารณา', en: 'Waiting for Result' },
  accepted: { th: 'ตอบรับแล้ว', en: 'Accepted' },
  rejected: { th: 'ไม่ผ่านการพิจารณา', en: 'Rejected' },
};

const displayDate = (value: string | null, locale: string) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(locale);
};

export default function StudentMatchingStatusLive({ onNotify }: Props) {
  const { i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');
  const [data, setData] = useState<MatchingResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getMyMatching()
      .then((response) => { if (mounted) setData(response); })
      .catch((requestError) => {
        if (!mounted) return;
        const status = getApiErrorStatus(requestError);
        const message = status === 401
          ? (isThai ? 'กรุณาเข้าสู่ระบบใหม่' : 'Please sign in again.')
          : status === 403
            ? (isThai ? 'บัญชีนี้ไม่มีสิทธิ์ดูสถานะนักศึกษา' : 'This account cannot view student matching status.')
            : status === 404
              ? (isThai ? 'ไม่พบข้อมูลนักศึกษา' : 'Student profile was not found.')
              : (isThai ? 'ไม่สามารถโหลดสถานะการสมัครได้' : 'Unable to load matching status.');
        setError(message);
        onNotify?.(message, 'error');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [isThai, onNotify]);

  if (loading) return <div className="rounded-2xl border bg-white p-8 text-sm text-slate-500">{isThai ? 'กำลังโหลดสถานะ...' : 'Loading matching status...'}</div>;
  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>;

  const application = data?.active_application ?? data?.application_history[0] ?? null;
  if (!application && !data?.internship) {
    return <div className="max-w-4xl rounded-2xl border bg-white p-8 text-center shadow-xs"><Briefcase className="mx-auto mb-3 text-slate-300" /><h2 className="font-bold">{isThai ? 'ยังไม่มีใบสมัคร' : 'No application yet'}</h2><p className="mt-1 text-xs text-slate-500">{isThai ? 'เลือกตำแหน่งที่เปิดรับจากหน้า Companies เพื่อเริ่มสมัคร' : 'Choose an open position from Companies to apply.'}</p></div>;
  }

  const status = data?.internship ? 'accepted' : application!.status;
  const statusLabel = isThai ? labels[status].th : labels[status].en;
  const rejected = application?.status === 'rejected';

  return (
    <div className="max-w-4xl space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs sm:p-8">
      <div className="flex items-center justify-between border-b pb-4"><div><p className="text-[10px] font-bold uppercase text-[#6B122C]">{isThai ? 'สถานะการสมัครฝึกงาน' : 'Application Matching Status'}</p><h2 className="mt-1 text-lg font-bold">{statusLabel}</h2></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold ${rejected ? 'bg-rose-100 text-rose-700' : status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{statusLabel}</span></div>
      {application && <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold text-slate-400">POSITION ID</p><p className="mt-1 break-all text-xs font-semibold">{application.position_id}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold text-slate-400">{isThai ? 'วันที่สมัคร' : 'APPLIED AT'}</p><p className="mt-1 text-xs font-semibold">{displayDate(application.applied_at, isThai ? 'th-TH' : 'en-US')}</p></div></div>}
      {application?.interview_at && <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs"><div className="mb-2 flex items-center gap-2 font-bold text-blue-800"><Calendar className="h-4 w-4" />{isThai ? 'รายละเอียดการสัมภาษณ์' : 'Interview Details'}</div><p>{displayDate(application.interview_at, isThai ? 'th-TH' : 'en-US')}</p><p>{application.interview_channel}</p><p>{application.interview_location ?? '—'}</p>{application.interview_details && <p className="mt-1 text-slate-500">{application.interview_details}</p>}<p className="mt-2 text-slate-500">{isThai ? 'การเข้าร่วม: ' : 'Attendance: '}{application.interview_attended === null ? (isThai ? 'ยังไม่บันทึก' : 'Not recorded') : application.interview_attended ? (isThai ? 'เข้าร่วม' : 'Attended') : (isThai ? 'ไม่เข้าร่วม' : 'Did not attend')}</p></div>}
      {data?.internship && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900"><div className="flex items-center gap-2 font-bold"><CheckCircle className="h-4 w-4" />{isThai ? 'สร้างสถานะฝึกงานแล้ว' : 'Internship placement created'}</div><p className="mt-1">{displayDate(data.internship.placed_at, isThai ? 'th-TH' : 'en-US')}</p></div>}
      {rejected && application?.rejection_reason && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800"><div className="flex items-center gap-2 font-bold"><AlertCircle className="h-4 w-4" />{isThai ? 'เหตุผล' : 'Reason'}</div><p className="mt-1">{application.rejection_reason}</p></div>}
      <p className="text-[11px] text-slate-500">{isThai ? 'สถานะมาจาก Backend และนักศึกษาเปลี่ยนสถานะจากหน้านี้ไม่ได้' : 'Status comes from the backend and cannot be changed by the student.'}</p>
    </div>
  );
}
