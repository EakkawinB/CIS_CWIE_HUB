import React, { useState } from 'react';
import {
  CheckCircle, MapPin, Calendar, Clock, Building2,
  AlertCircle, ArrowRight, UserCheck, HelpCircle, Briefcase, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StudentMatchingStatusProps {
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export type MatchingStage =
  | 'application_processing'  // Stage A
  | 'interview_scheduled'      // Stage B
  | 'interview_confirmed'      // Stage C
  | 'waiting_company_result'   // Stage D
  | 'company_accepted'         // Stage E
  | 'placement_completed';     // Stage F

export default function StudentMatchingStatus({ onNotify }: StudentMatchingStatusProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  // Context: Student applies to a specific POSITION at a Company
  const positionContext = {
    companyName: 'NexaTech Solutions Co., Ltd.',
    positionTitle: 'Frontend Engineering Intern (React / TypeScript)',
    department: 'Core Product Engineering Team',
    location: 'NexaTech Headquarters, Floor 14, Silom, Bangkok (or Google Meet: meet.google.com/cis-cwie)',
    interviewDate: '2026-05-18',
    interviewTime: '10:00 - 11:30 น. (GMT+7)',
    mentorName: 'คุณสมศักดิ์ พิพัฒน์พัฒนา (Lead Architect)'
  };

  // Default stage for demonstration: Stage B (Interview Scheduled)
  const [currentStage, setCurrentStage] = useState<MatchingStage>('interview_scheduled');

  // Distinct Action 1: Confirm Interview (Attendance acknowledgement only, NOT employment acceptance)
  const handleConfirmInterview = () => {
    setCurrentStage('interview_confirmed');
    onNotify?.(
      isThai
        ? 'ยืนยันเข้าร่วมการสัมภาษณ์เรียบร้อยแล้ว! ข้อมูลได้ส่งถึงสถานประกอบการแล้ว'
        : 'Interview attendance confirmed! The company has been notified.',
      'success'
    );
  };

  // Distinct Action 2: Confirm Employment (Final formal placement acceptance)
  const handleConfirmEmployment = () => {
    setCurrentStage('placement_completed');
    onNotify?.(
      isThai
        ? 'ยืนยันเข้าทำงานเรียบร้อยแล้ว! ระบบกำลังเตรียมการสำหรับเอกสารสัญญา 3 ฝ่าย'
        : 'Employment confirmed! Transitioning to placement agreement phase.',
      'success'
    );
  };

  // Helper metadata for the 6 conceptual stages
  const stageInfo = {
    application_processing: {
      badge: isThai ? 'ใบสมัครอยู่ระหว่างการพิจารณา' : 'Application Processing',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      questionStage: isThai
        ? 'ใบสมัครของคุณถูกส่งไปยังสถานประกอบการเรียบร้อยแล้ว และอยู่ระหว่างทีมวิศวกรตรวจสอบคุณสมบัติ'
        : 'Your application has been submitted and is currently being reviewed by the engineering hiring team.',
      questionAction: isThai
        ? 'ยังไม่มีการดำเนินการที่ต้องทำในขณะนี้'
        : 'No action required from you at this time.',
      questionWaiting: isThai
        ? 'รอสถานประกอบการตรวจสอบประวัติและกำหนดวัน-เวลานัดสัมภาษณ์'
        : 'Waiting for the company to review qualifications and schedule an interview.'
    },
    interview_scheduled: {
      badge: isThai ? 'มีนัดหมายการสัมภาษณ์งาน' : 'Interview Scheduled',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      questionStage: isThai
        ? 'สถานประกอบการตอบรับการสมัคร และได้ระบุวัน เวลา และสถานที่สัมภาษณ์แล้ว'
        : 'The company has reviewed your application and provided interview appointment details.',
      questionAction: isThai
        ? 'โปรดกดปุ่ม "ยืนยันการสัมภาษณ์" ด้านล่าง เพื่อยืนยันการเข้าร่วมสัมภาษณ์ตามวันเวลาที่กำหนด'
        : 'Please click "Confirm Interview" below to acknowledge and commit to attending the interview.',
      questionWaiting: isThai
        ? 'รอนักศึกษายืนยันการสัมภาษณ์เพื่อส่งให้สถานประกอบการจัดสรรเวลา'
        : 'Waiting for your interview attendance confirmation.'
    },
    interview_confirmed: {
      badge: isThai ? 'ยืนยันการสัมภาษณ์แล้ว' : 'Interview Confirmed',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      questionStage: isThai
        ? 'คุณได้ยืนยันการเข้าร่วมสัมภาษณ์เรียบร้อยแล้ว กรุณาเข้าสัมภาษณ์ตามกำหนด'
        : 'You have confirmed your interview attendance. Please attend the interview as scheduled.',
      questionAction: isThai
        ? 'เตรียมความพร้อมสำหรับสอบสัมภาษณ์และเข้าร่วมตามเวลาที่ระบุ'
        : 'Prepare technical portfolio and join the interview session on time.',
      questionWaiting: isThai
        ? 'รอเข้าสัมภาษณ์และรอคณะกรรมการสัมภาษณ์บันทึกผลการคัดเลือก'
        : 'Waiting to complete the interview session and await company evaluation.'
    },
    waiting_company_result: {
      badge: isThai ? 'รอผลการคัดเลือกจากบริษัท' : 'Waiting for Company Result',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      questionStage: isThai
        ? 'การสัมภาษณ์เสร็จสิ้นแล้ว อยู่ระหว่างการสรุปผลการคัดเลือกของสถานประกอบการ'
        : 'The interview has been concluded. The company is evaluating interview outcomes.',
      questionAction: isThai
        ? 'ไม่มีการดำเนินการที่ต้องทำในขณะนี้'
        : 'No action required from you at this time.',
      questionWaiting: isThai
        ? 'รอสถานประกอบการแจ้งผลการตอบรับอย่างเป็นทางการผ่านระบบ'
        : 'Waiting for company HR to release official placement decision.'
    },
    company_accepted: {
      badge: isThai ? 'บริษัทตอบรับเข้าทำงานแล้ว' : 'Company Accepted',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      questionStage: isThai
        ? 'ยินดีด้วย! สถานประกอบการได้ตอบรับคุณเข้าปฏิบัติงานสหกิจในตำแหน่งนี้อย่างเป็นทางการ'
        : 'Congratulations! The company has officially selected and accepted you for this position.',
      questionAction: isThai
        ? 'โปรดกดปุ่ม "ยืนยันเข้าทำงาน" เพื่อตอบรับข้อเสนอและเสร็จสิ้นขั้นตอนการจับคู่'
        : 'Please click "Confirm Employment" below to formally accept the co-op placement offer.',
      questionWaiting: isThai
        ? 'รอนักศึกษายืนยันการเข้าทำงานเพื่อบันทึกผลการจับคู่สมบูรณ์'
        : 'Waiting for your formal employment confirmation.'
    },
    placement_completed: {
      badge: isThai ? 'ยืนยันเข้าทำงานเรียบร้อย (เสร็จสมบูรณ์)' : 'Placement Completed',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-400',
      questionStage: isThai
        ? 'กระบวนการจับคู่สหกิจศึกษาเสร็จสมบูรณ์แล้ว คุณได้รับการจัดสรรเข้าสถานประกอบการเรียบร้อย'
        : 'The matching process is completed. Your co-op placement is fully finalized.',
      questionAction: isThai
        ? 'ดำเนินการจัดทำเอกสารและหนังสือสัญญา 3 ฝ่ายในเมนู "เอกสารยื่นเรื่อง (Documents)"'
        : 'Proceed to prepare official tripartite agreements in the Documents section.',
      questionWaiting: isThai
        ? 'รอการเริ่มระยะเวลาปฏิบัติงานสหกิจศึกษาตามปฏิทินการศึกษา'
        : 'Awaiting commencement of the internship work term.'
    }
  };

  const currentInfo = stageInfo[currentStage];

  // Stage sequence for progress tracker
  const stagesList: { id: MatchingStage; labelTh: string; labelEn: string; step: number }[] = [
    { id: 'application_processing', labelTh: '1. ยื่นใบสมัคร', labelEn: '1. Applied', step: 1 },
    { id: 'interview_scheduled', labelTh: '2. นัดสัมภาษณ์', labelEn: '2. Interview', step: 2 },
    { id: 'interview_confirmed', labelTh: '3. ยืนยันนัด', labelEn: '3. Confirmed', step: 3 },
    { id: 'waiting_company_result', labelTh: '4. รอผลสัมภาษณ์', labelEn: '4. Waiting', step: 4 },
    { id: 'company_accepted', labelTh: '5. บริษัทตอบรับ', labelEn: '5. Accepted', step: 5 },
    { id: 'placement_completed', labelTh: '6. สหกิจสมบูรณ์', labelEn: '6. Placed', step: 6 },
  ];

  const currentStepNumber = stagesList.find(s => s.id === currentStage)?.step || 1;

  return (
    <div className="max-w-4xl bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="px-2.5 py-0.5 bg-rose-50 text-[#6B122C] border border-rose-100 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 inline-block">
            {isThai ? 'สถานะการจับคู่และการตอบกลับจากสถานประกอบการ' : 'Position Matching Workflow'}
          </span>
          <h2 className="text-lg font-bold text-slate-900 font-sans">
            {isThai ? 'Matching Status (สถานะการจับคู่ตำแหน่งงาน)' : 'Co-op Position Matching Status'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isThai
              ? 'ติดตามขั้นตอนการสมัคร การสัมภาษณ์ และการตอบรับเข้าทำงานในตำแหน่งที่เลือก'
              : 'Track application stages, interview confirmations, and employment acceptance per position.'}
          </p>
        </div>

        {/* Demo Stage Switcher Bar (Local/Mock Simulator strictly for review) */}
        <div className="bg-slate-50 border border-slate-200/80 p-1.5 rounded-xl flex items-center gap-1 shrink-0 overflow-x-auto max-w-full">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase font-mono hidden sm:inline">
            {isThai ? 'จำลองสถานะ:' : 'Demo Stage:'}
          </span>
          {stagesList.map((st) => (
            <button
              key={st.id}
              onClick={() => setCurrentStage(st.id)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentStage === st.id
                  ? 'bg-[#6B122C] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {isThai ? st.labelTh : st.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Conceptual Workflow Stepper */}
      <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {stagesList.map((st) => {
            const isDone = st.step < currentStepNumber;
            const isCurrent = st.step === currentStepNumber;
            return (
              <div
                key={st.id}
                className={`p-2 rounded-xl text-center border transition-all ${
                  isCurrent
                    ? 'bg-white border-[#6B122C] shadow-xs ring-1 ring-[#6B122C]/20'
                    : isDone
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                      : 'bg-white/40 border-slate-200/60 text-slate-400 opacity-60'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">
                  {isDone ? '✓ ' : ''}{isThai ? st.labelTh : st.labelEn}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Context Card: Company & Position (Applied context is always preserved) */}
      <div className="p-5 sm:p-6 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              {isThai ? 'ตำแหน่งงานที่สมัครและจับคู่ (Position Applied)' : 'Applied Position'}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {positionContext.positionTitle}
            </h3>
            <p className="text-xs font-semibold text-[#6B122C] mt-0.5 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>{positionContext.companyName}</span>
              <span className="text-slate-400 font-normal">• {positionContext.department}</span>
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 border ${currentInfo.badgeColor}`}>
            <Sparkles className="h-3.5 w-3.5" />
            <span>{currentInfo.badge}</span>
          </span>
        </div>

        {/* Detailed Info Grid: Interview Details shown when available */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">
              {isThai ? 'พี่เลี้ยงผู้ดูแล / หัวหน้างาน:' : 'Assigned Mentor / Supervisor:'}
            </span>
            <span className="font-semibold text-slate-800">
              {positionContext.mentorName}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-mono">
              {isThai ? 'กำหนดการสัมภาษณ์:' : 'Interview Schedule:'}
            </span>
            <span className="font-semibold text-slate-800">
              {currentStage === 'application_processing'
                ? (isThai ? '— รอสถานประกอบการกำหนดวันเวลา —' : '— Pending Schedule —')
                : `${positionContext.interviewDate} • ${positionContext.interviewTime}`}
            </span>
          </div>

          {currentStage !== 'application_processing' && (
            <div className="sm:col-span-2">
              <span className="text-[10px] text-slate-400 block font-mono flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[#6B122C]" />
                {isThai ? 'สถานที่สัมภาษณ์ / ช่องทางติดต่อ:' : 'Interview Location / Details:'}
              </span>
              <span className="font-semibold text-slate-800 block bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                {positionContext.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* THREE CORE QUESTIONS CARD (Explicitly answering requirements A1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Question 1: What stage is my application currently in? */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-[#6B122C]">
            <HelpCircle className="h-4 w-4 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {isThai ? '1. ขั้นตอนปัจจุบัน' : '1. Current Stage'}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {currentInfo.questionStage}
          </p>
        </div>

        {/* Question 2: Is there anything I need to do now? */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-blue-700">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {isThai ? '2. สิ่งที่ต้องทำในตอนนี้' : '2. Action Required'}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {currentInfo.questionAction}
          </p>
        </div>

        {/* Question 3: What am I waiting for? */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-amber-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {isThai ? '3. สิ่งที่กำลังรอคอย' : '3. What You Await'}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {currentInfo.questionWaiting}
          </p>
        </div>

      </div>

      {/* DISTINCT ACTIONS SECTION (Rejection actions permanently removed) */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {isThai ? 'การดำเนินการของนักศึกษา (Student Action)' : 'Student Workflow Actions'}
        </h4>

        {/* STAGE B: Show EXACTLY ONE action: Confirm Interview (ยืนยันการสัมภาษณ์) */}
        {currentStage === 'interview_scheduled' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-blue-50/50 border border-blue-200/80 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-blue-900 block">
                {isThai ? 'ยืนยันการเข้าร่วมสัมภาษณ์ (Confirm Interview)' : 'Confirm Interview Attendance'}
              </span>
              <p className="text-[11px] text-blue-700">
                {isThai
                  ? 'การยืนยันนี้หมายถึงการรับทราบข้อมูลและยืนยันเข้าร่วมสัมภาษณ์ (ยังมิใช่การตอบรับเข้าทำงาน)'
                  : 'Confirms your attendance commitment for the interview. Does NOT mean accepting employment.'}
              </p>
            </div>
            <button
              onClick={handleConfirmInterview}
              className="px-5 py-2.5 bg-[#6B122C] hover:bg-[#580E24] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0"
            >
              <CheckCircle className="h-4 w-4" />
              <span>{isThai ? 'ยืนยันการสัมภาษณ์' : 'Confirm Interview'}</span>
            </button>
          </div>
        )}

        {/* STAGE E: Show EXACTLY ONE action: Confirm Employment (ยืนยันเข้าทำงาน) */}
        {currentStage === 'company_accepted' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-emerald-950 block">
                {isThai ? 'ยืนยันการเข้าทำงานสหกิจศึกษา (Confirm Employment)' : 'Confirm Co-op Employment'}
              </span>
              <p className="text-[11px] text-emerald-800">
                {isThai
                  ? 'สถานประกอบการตอบรับคุณแล้ว กดปุ่มนี้เพื่อตอบรับเข้าทำงานอย่างเป็นทางการ'
                  : 'The company has accepted you. Click below to formally accept the placement offer.'}
              </p>
            </div>
            <button
              onClick={handleConfirmEmployment}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0"
            >
              <UserCheck className="h-4 w-4" />
              <span>{isThai ? 'ยืนยันเข้าทำงาน' : 'Confirm Employment'}</span>
            </button>
          </div>
        )}

        {/* STAGES WITH NO ACTION (A, C, D, F): Explain state clearly with no buttons */}
        {currentStage === 'application_processing' && (
          <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-500">
            {isThai
              ? 'ยังไม่มีการดำเนินการที่นักศึกษาต้องทำในขั้นตอนนี้ ใบสมัครของคุณถูกจัดส่งถึงบริษัทเรียบร้อยแล้ว'
              : 'No action required at this stage. Your application has been successfully transmitted to the company.'}
          </div>
        )}

        {currentStage === 'interview_confirmed' && (
          <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              {isThai
                ? 'คุณได้ยืนยันการสัมภาษณ์แล้ว โปรดเข้าสัมภาษณ์ตามวันและเวลาที่กำหนดไว้'
                : 'Interview attendance acknowledged. Please attend the interview session on time.'}
            </span>
          </div>
        )}

        {currentStage === 'waiting_company_result' && (
          <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-500 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {isThai
                ? 'สัมภาษณ์เสร็จสิ้นแล้ว กำลังรอสถานประกอบการประมวลผลและส่งผลการคัดเลือก'
                : 'Interview concluded. Waiting for the company to finalize evaluation and announce results.'}
            </span>
          </div>
        )}

        {currentStage === 'placement_completed' && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle className="h-4 w-4 text-emerald-700" />
              <span>{isThai ? 'การจับคู่เสร็จสมบูรณ์ — ยืนยันการเข้าทำงานแล้ว' : 'Placement & Employment Confirmed — Complete'}</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              {isThai
                ? 'ระบบได้บันทึกการตอบรับเรียบร้อยแล้ว ให้เข้าสู่เมนู "เอกสารยื่นเรื่อง" เพื่อดำเนินขั้นตอนสัญญาสหกิจต่อไป'
                : 'Your placement is confirmed. Please proceed to the Documents section for tripartite agreement workflow.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
