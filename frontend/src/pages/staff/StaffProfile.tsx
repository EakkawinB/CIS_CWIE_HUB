import React, { useState } from 'react';
import { 
  User, Mail, Phone, Building2, Edit3, Save, 
  Lock, Shield, KeyRound, CheckCircle2, History 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StaffProfileProps {
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function StaffProfile({ onNotify }: StaffProfileProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'นางสาววิมลรัตน์ บุญประเสริฐ',
    nameEn: 'Ms. Wimonrat Boonprasert',
    role: 'เจ้าหน้าที่บริหารงานทั่วไป (CWIE Coordinator)',
    staffId: 'STF-40291',
    email: 'wimonrat.b@sci.kmutnb.ac.th',
    phone: '02-555-2000 ต่อ 4211',
    office: 'สำนักงานคณบดี คณะวิทยาศาสตร์ประยุกต์ ชั้น 2',
    faculty: 'คณะวิทยาศาสตร์ประยุกต์ มจพ. (KMUTNB)'
  });

  const [form, setForm] = useState(profile);

  // Security Settings State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(form);
    setIsEditing(false);
    onNotify?.(
      isThai ? 'บันทึกข้อมูลส่วนตัวเจ้าหน้าที่เรียบร้อยแล้ว!' : 'Staff profile saved successfully!',
      'success'
    );
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      onNotify?.(
        isThai ? 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน' : 'New passwords do not match.',
        'error'
      );
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    onNotify?.(
      isThai ? 'เปลี่ยนรหัสผ่านความปลอดภัยสำเร็จแล้ว' : 'Password updated successfully!',
      'success'
    );
  };

  return (
    <div className="w-full max-w-3xl space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* Top Profile Card */}
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-tr from-[#6B122C] to-[#8B1E3F] text-white font-extrabold flex items-center justify-center text-2xl rounded-2xl shadow-md shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{profile.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-[#6B122C] border border-rose-200">
                  {profile.staffId}
                </span>
              </div>
              <p className="text-xs text-slate-500">{profile.nameEn}</p>
              <p className="text-xs text-slate-400 mt-0.5">{profile.role}</p>
              <p className="text-[11px] text-[#6B122C] font-semibold">{profile.faculty}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'personal'
                  ? 'bg-[#6B122C] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isThai ? 'ข้อมูลส่วนตัว' : 'Personal Info'}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#6B122C] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isThai ? 'ความปลอดภัย' : 'Security Settings'}
            </button>
          </div>
        </div>

        {/* TAB 1: Personal Information */}
        {activeTab === 'personal' && (
          <div>
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">
                    {isThai ? 'ข้อมูลส่วนตัวและสถานที่ติดต่อ (Personal Information)' : 'Personal Information & Contact'}
                  </h3>
                  <button
                    onClick={() => {
                      setForm(profile);
                      setIsEditing(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-[#6B122C] hover:text-white bg-rose-50 hover:bg-[#6B122C] transition-all rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{isThai ? 'แก้ไขข้อมูล' : 'Edit Info'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">{isThai ? 'ชื่อ-นามสกุล (ไทย)' : 'Thai Full Name'}</span>
                    <span className="font-semibold text-slate-800 text-sm">{profile.name}</span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">{isThai ? 'ชื่อ-นามสกุล (อังกฤษ)' : 'English Full Name'}</span>
                    <span className="font-semibold text-slate-800 text-sm">{profile.nameEn}</span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">{isThai ? 'อีเมลทางการ' : 'Email Address'}</span>
                    <span className="font-semibold text-slate-800 font-mono">{profile.email}</span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">{isThai ? 'เบอร์โทรศัพท์โต๊ะทำงาน' : 'Office Phone'}</span>
                    <span className="font-semibold text-slate-800 font-mono">{profile.phone}</span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">{isThai ? 'ห้องทำงาน / ที่ตั้งสำนักงาน' : 'Office Location'}</span>
                    <span className="font-semibold text-slate-800">{profile.office}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {isThai ? 'ชื่อ-นามสกุล (ไทย)' : 'Full Name (Thai)'}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {isThai ? 'ชื่อ-นามสกุล (อังกฤษ)' : 'Full Name (English)'}
                    </label>
                    <input
                      type="text"
                      value={form.nameEn}
                      onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {isThai ? 'อีเมลมหาวิทยาลัย' : 'Academic Email'}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      {isThai ? 'เบอร์โทรศัพท์โต๊ะ' : 'Office Phone'}
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    {isThai ? 'ห้องทำงาน / ที่ตั้งสำนักงาน' : 'Office Location'}
                  </label>
                  <input
                    type="text"
                    value={form.office}
                    onChange={(e) => setForm({ ...form, office: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                  />
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
                    <span>{isThai ? 'บันทึกข้อมูล' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'การตั้งค่าความปลอดภัยของบัญชี (Security Settings)' : 'Account Security & Access Credentials'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isThai ? 'เปลี่ยนรหัสผ่าน และเปิดใช้งานระบบยืนยันตัวตนแบบหลายชั้น' : 'Update administrative password and two-factor authentication.'}
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  {isThai ? 'รหัสผ่านปัจจุบัน:' : 'Current Password:'}
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  {isThai ? 'รหัสผ่านใหม่:' : 'New Password:'}
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  {isThai ? 'ยืนยันรหัสผ่านใหม่:' : 'Confirm New Password:'}
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#6B122C] hover:bg-[#580E24] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>{isThai ? 'อัปเดตรหัสผ่านใหม่' : 'Update Password'}</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {isThai ? 'การยืนยันตัวตนสองขั้นตอน (Two-Factor Authentication)' : 'Two-Factor Authentication (2FA)'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isThai ? 'เพิ่มความปลอดภัยด้วย OTP หรือ Authenticator App' : 'Enforce OTP authentication upon signing into the CWIE Portal.'}
                </p>
              </div>

              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  onNotify?.(
                    isThai 
                      ? (!twoFactorEnabled ? 'เปิดใช้งาน 2FA สำเร็จ' : 'ปิดการใช้งาน 2FA') 
                      : (!twoFactorEnabled ? 'Enabled 2FA' : 'Disabled 2FA'),
                    'info'
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  twoFactorEnabled 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {twoFactorEnabled ? (isThai ? 'เปิดใช้งานอยู่ (Enabled)' : 'Enabled') : (isThai ? 'ปิดใช้งาน (Disabled)' : 'Disabled')}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
