import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Edit3, Save, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MentorProfileProps {
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function MentorProfile({ onNotify }: MentorProfileProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
    role: 'Lead Architect & Enterprise Mentor',
    email: 'somsak.p@nexatech.co.th',
    phone: '02-123-4567 ต่อ 802',
    department: 'Core Platform Engineering',
    company: 'บริษัท เน็กซ่าเทค โซลูชั่นส์ จำกัด (NexaTech Solutions Co., Ltd.)',
    address: 'อาคารเน็กซ่าทาวเวอร์ ชั้น 14 ถนนสีลม เขตบางรัก กรุงเทพฯ 10500'
  });

  const [form, setForm] = useState(profile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(form);
    setIsEditing(false);
    onNotify?.(
      isThai ? 'บันทึกข้อมูลส่วนตัวของพี่เลี้ยงเรียบร้อยแล้ว!' : 'Mentor profile updated successfully!',
      'success'
    );
  };

  return (
    <div className="w-full max-w-3xl bg-white border border-slate-100 p-8 rounded-2xl shadow-xs space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Top Banner */}
      <div className="flex justify-between items-start pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-gradient-to-tr from-[#6B122C] to-[#8B1E3F] text-white font-extrabold flex items-center justify-center text-xl rounded-2xl shadow-md">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">{profile.name}</h2>
            <p className="text-xs text-slate-400">{profile.role}</p>
            <p className="text-[11px] text-[#6B122C] font-semibold mt-0.5">{profile.company}</p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setForm(profile);
              setIsEditing(true);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#6B122C] hover:text-white bg-rose-50 hover:bg-[#6B122C] transition-all rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {isThai ? 'แก้ไขโปรไฟล์' : 'Edit Profile'}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                {isThai ? 'ชื่อ-นามสกุล' : 'Full Name'}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C] bg-slate-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                {isThai ? 'อีเมลที่ทำงาน' : 'Company Email'}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C] bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                {isThai ? 'เบอร์โทรศัพท์' : 'Phone'}
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C] bg-slate-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                {isThai ? 'แผนก / ฝ่าย' : 'Department'}
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C] bg-slate-50/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer"
            >
              {isThai ? 'ยกเลิก' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B122C] hover:bg-[#580E24] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              {isThai ? 'บันทึกข้อมูล' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-5 text-xs text-slate-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'สถานประกอบการ:' : 'Enterprise Company:'}</span>
              <span className="font-semibold text-slate-800">{profile.company}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'แผนกที่ดูแล:' : 'Department:'}</span>
              <span className="font-semibold text-slate-800">{profile.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'อีเมลติดต่อ:' : 'Email:'}</span>
              <span className="font-semibold text-slate-800">{profile.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'เบอร์โทรศัพท์:' : 'Phone Contact:'}</span>
              <span className="font-semibold text-slate-800">{profile.phone}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] text-slate-400 block font-mono">{isThai ? 'ที่อยู่บริษัท:' : 'Company Workplace Address:'}</span>
              <span className="font-semibold text-slate-800">{profile.address}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
