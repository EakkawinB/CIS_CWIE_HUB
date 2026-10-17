import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, Check, Clock, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  acceptApplication,
  getApiErrorStatus,
  getStaffApplications,
  moveApplicationToWaitingResult,
  recordApplicationAttendance,
  rejectApplication,
  scheduleApplicationInterview,
  type ApplicationResponseDto,
  type InterviewChannel,
  type StaffApplicationResponseDto,
} from '../../services/api';

interface Props {
  search: string;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function StaffApplicationMatching({ search, onNotify }: Props) {
  const { i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');
  const [items, setItems] = useState<StaffApplicationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStaffApplications();
      setItems(response.items);
    } catch (error) {
      const status = getApiErrorStatus(error);
      onNotify?.(status === 401 ? (isThai ? 'กรุณาเข้าสู่ระบบใหม่' : 'Please sign in again.') : status === 403 ? (isThai ? 'เฉพาะ Staff เท่านั้นที่เข้าถึงได้' : 'Staff access is required.') : (isThai ? 'โหลดรายการใบสมัครไม่สำเร็จ' : 'Unable to load applications.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [isThai, onNotify]);

  useEffect(() => { load(); }, [load]);

  const runMutation = async (applicationId: string, action: () => Promise<unknown>, success: string) => {
    setBusyId(applicationId);
    try {
      await action();
      await load();
      onNotify?.(success, 'success');
    } catch (error) {
      const status = getApiErrorStatus(error);
      const message = status === 409 ? (isThai ? 'สถานะปัจจุบันไม่อนุญาตให้ทำรายการนี้' : 'The current status does not allow this action.') : status === 404 ? (isThai ? 'ไม่พบใบสมัคร' : 'Application not found.') : status === 422 ? (isThai ? 'ข้อมูลไม่ถูกต้อง' : 'Invalid request data.') : (isThai ? 'ดำเนินการไม่สำเร็จ' : 'Action failed.');
      onNotify?.(message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const schedule = (item: ApplicationResponseDto) => {
    const value = window.prompt(isThai ? 'วันเวลาแบบ ISO เช่น 2027-01-10T09:00:00+07:00' : 'Interview datetime with timezone, e.g. 2027-01-10T09:00:00+07:00');
    if (!value) return;
    const channel = window.prompt('Channel: online / onsite / phone', item.interview_channel ?? 'online') as InterviewChannel | null;
    if (!channel || !['online', 'onsite', 'phone'].includes(channel)) return;
    const location = channel === 'phone' ? null : window.prompt(isThai ? 'สถานที่หรือลิงก์สัมภาษณ์' : 'Location or meeting link');
    if (channel !== 'phone' && !location?.trim()) return;
    runMutation(item.application_id, () => scheduleApplicationInterview(item.application_id, { interview_at: value, interview_channel: channel, interview_location: location?.trim() || null }), isThai ? 'บันทึกนัดสัมภาษณ์แล้ว' : 'Interview scheduled.');
  };

  const filtered = items.filter((item) => `${item.student_name ?? ''} ${item.student_code ?? ''} ${item.company_name ?? ''} ${item.position_name ?? ''} ${item.student_id} ${item.position_id} ${item.status}`.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="rounded-2xl border bg-white p-8 text-sm text-slate-500">{isThai ? 'กำลังโหลดใบสมัคร...' : 'Loading applications...'}</div>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-xs">
      <table className="w-full text-left text-xs"><thead className="border-b bg-slate-50 text-[10px] uppercase text-slate-500"><tr><th className="p-4">Student</th><th className="p-4">Company / Position</th><th className="p-4">Status</th><th className="p-4">Interview</th><th className="p-4 text-right">Actions</th></tr></thead>
        <tbody className="divide-y">{filtered.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">{isThai ? 'ไม่พบใบสมัคร' : 'No applications found.'}</td></tr> : filtered.map((item) => {
          const active = ['applied', 'interview_scheduled', 'waiting_result'].includes(item.status);
          const busy = busyId === item.application_id;
          return <tr key={item.application_id}><td className="p-4"><div className="font-bold">{item.student_name ?? (isThai ? 'ไม่พบข้อมูลชื่อ' : 'Name unavailable')}</div><div className="text-[10px] text-slate-400">{item.student_code ?? (isThai ? 'ไม่พบรหัสนักศึกษา' : 'Student code unavailable')}</div></td><td className="p-4"><div className="font-bold">{item.company_name ?? (isThai ? 'ไม่พบข้อมูลชื่อ' : 'Company name unavailable')}</div><div className="text-[11px] text-[#6B122C]">{item.position_name ?? (isThai ? 'ไม่พบข้อมูลชื่อ' : 'Position name unavailable')}</div></td><td className="p-4 font-semibold">{item.status}</td><td className="p-4 text-[11px]">{item.interview_at ? new Date(item.interview_at).toLocaleString(isThai ? 'th-TH' : 'en-US') : '-'}<div className="text-slate-400">{item.interview_channel ?? '-'} / {item.interview_attended === null ? '-' : item.interview_attended ? 'attended' : 'absent'}</div></td><td className="p-4"><div className="flex flex-wrap justify-end gap-1">
            {item.status === 'applied' && <button disabled={busy} onClick={() => schedule(item)} className="rounded-lg border px-2 py-1"><Calendar className="inline h-3 w-3" /> Interview</button>}
            {item.status === 'interview_scheduled' && item.interview_attended === null && <><button disabled={busy} onClick={() => runMutation(item.application_id, () => recordApplicationAttendance(item.application_id, true), 'Attendance recorded.')} className="rounded-lg border px-2 py-1"><Check className="inline h-3 w-3" /> Attended</button><button disabled={busy} onClick={() => runMutation(item.application_id, () => recordApplicationAttendance(item.application_id, false), 'Attendance recorded.')} className="rounded-lg border px-2 py-1"><X className="inline h-3 w-3" /> Absent</button></>}
            {(item.status === 'applied' || item.status === 'interview_scheduled') && <button disabled={busy} onClick={() => runMutation(item.application_id, () => moveApplicationToWaitingResult(item.application_id), 'Moved to waiting result.')} className="rounded-lg border px-2 py-1"><Clock className="inline h-3 w-3" /> Waiting</button>}
            {active && <button disabled={busy} onClick={() => window.confirm(isThai ? 'ยืนยันการตอบรับและสร้าง Internship?' : 'Accept and create the internship?') && runMutation(item.application_id, () => acceptApplication(item.application_id), 'Application accepted.')} className="rounded-lg bg-emerald-600 px-2 py-1 font-bold text-white">Accept</button>}
            {active && <button disabled={busy} onClick={() => { if (!window.confirm(isThai ? 'ยืนยันการปฏิเสธใบสมัคร?' : 'Reject this application?')) return; const reason = window.prompt(isThai ? 'เหตุผล (ไม่บังคับ)' : 'Reason (optional)'); if (reason !== null) runMutation(item.application_id, () => rejectApplication(item.application_id, reason.trim() || null), 'Application rejected.'); }} className="rounded-lg border border-rose-200 px-2 py-1 font-bold text-rose-700">Reject</button>}
          </div></td></tr>;
        })}</tbody>
      </table>
    </div>
  );
}
