import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, UploadCloud, CheckCircle2, FileText, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ExaminationInfo } from '../../types';

interface StudentExaminationProps {
  exam: ExaminationInfo;
  onCheckIn: () => void;
  onUploadMaterial: (fileName: string) => void;
}

export default function StudentExamination({ exam, onCheckIn, onUploadMaterial }: StudentExaminationProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [uploadedMaterial, setUploadedMaterial] = useState<string>('');
  const [materialsList, setMaterialsList] = useState<string[]>(exam.materials || [
    'สไลด์การนำเสนอโครงงานสหกิจ (Slide_Presentation_STU001.pdf)',
    'เล่มรายงานโครงงานฉบับสมบูรณ์ (Final_Report_STU001.pdf)'
  ]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const name = e.target.files[0].name;
      setUploadedMaterial(name);
      setMaterialsList([...materialsList, name]);
      onUploadMaterial(name);
    }
  };

  return (
    <div className="max-w-3xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <span className="px-2.5 py-0.5 bg-rose-50 text-[#6B122C] border border-rose-100 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 inline-block">
          {isThai ? 'คณะกรรมการสอบและประเมินผลโครงงาน' : 'Oral Defense & Examination'}
        </span>
        <h2 className="text-lg font-bold text-slate-900 font-sans">
          {isThai ? 'Examination (ข้อมูลการสอบปากเปล่าและรายงานตัว)' : 'Formal Defense Examination Information'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isThai 
            ? 'ตรวจสอบห้องสอบ เวลาสอบ คณะกรรมการสอบ อัปโหลดเอกสารประกอบการสอบ และกดปุ่มรายงานตัวเข้าสอบ'
            : 'Review defense room, schedule, committee panel, upload presentation slides, and check in.'}
        </p>
      </div>

      {/* Examination Schedule & Venue Card */}
      <div className="p-6 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
              {isThai ? 'กำหนดการสอบป้องกันโครงงาน' : 'Defense Schedule Parameters'}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {exam.date} • {exam.time}
            </h3>
          </div>

          {/* Check-in Button */}
          <div>
            <button
              onClick={onCheckIn}
              disabled={exam.checkedIn}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                exam.checkedIn
                  ? 'bg-emerald-600 text-white shadow-xs cursor-default'
                  : 'bg-[#6B122C] hover:bg-[#580E24] text-white shadow-xs'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {exam.checkedIn 
                ? (isThai ? '✓ รายงานตัวเข้าสอบแล้ว' : '✓ Checked In (Present)') 
                : (isThai ? 'ปุ่ม Check-in (รายงานตัวเข้าสอบ)' : 'Check-in Button')
              }
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#6B122C]" />
              {isThai ? 'ห้องสอบ / สถานที่:' : 'Examination Room / Venue:'}
            </span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{exam.room}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#6B122C]" />
              {isThai ? 'เวลาสอบ / ระยะเวลา:' : 'Time Window:'}
            </span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{exam.time} (30 นาทีนำเสนอ + 15 นาทีตอบคำถาม)</span>
          </div>
        </div>
      </div>

      {/* Examination Committee / อาจารย์สอบ */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Users className="h-4 w-4 text-[#6B122C]" />
          <span>{isThai ? 'อาจารย์สอบ / คณะกรรมการสอบ (Examination Committee)' : 'Assigned Examination Committee'}</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {exam.committee.map((member, i) => (
            <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-[#6B122C] shrink-0" />
              <span className="font-semibold truncate">{member}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Examination Supporting Materials / Upload เอกสารประกอบการสอบ */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-[#6B122C]" />
          <span>{isThai ? 'Upload เอกสารประกอบการสอบ (Supporting Materials)' : 'Upload Examination Materials'}</span>
        </h4>

        {/* Existing uploaded materials */}
        <div className="space-y-2">
          {materialsList.map((m, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 text-[#6B122C] shrink-0" />
                <span className="font-medium truncate">{m}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                {isThai ? 'อัปโหลดแล้ว' : 'Uploaded'}
              </span>
            </div>
          ))}
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-slate-200 hover:border-[#6B122C] bg-slate-50/60 rounded-xl p-5 text-center relative cursor-pointer transition-colors">
          <input 
            type="file" 
            onChange={handleUpload}
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
          <UploadCloud className="h-7 w-7 text-slate-400 mx-auto mb-1.5" />
          <span className="text-xs font-semibold text-slate-700 block">
            {isThai ? 'คลิกหรือลากไฟล์สไลด์นำเสนอ / เล่มรายงานโครงงานมาที่นี่' : 'Click or drop presentation slides / report here'}
          </span>
          <span className="text-[10px] text-slate-400">PDF, PPTX up to 25MB</span>
        </div>
      </div>

    </div>
  );
}
