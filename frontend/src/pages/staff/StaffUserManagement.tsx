import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, Shield, Filter, CheckCircle2, 
  XCircle, Edit2, Lock, Mail, Building2, GraduationCap, Briefcase,
  Trash2, Phone, Calendar, Clock, Eye, AlertTriangle, X, Check, Power
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StaffUserManagementProps {
  initialSubTab?: 'all' | 'add';
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export interface AppUser {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  role: 'Student' | 'Adviser' | 'Mentor' | 'Staff';
  departmentOrCompany: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastLogin: string;
}

export default function StaffUserManagement({
  initialSubTab = 'all',
  onNotify
}: StaffUserManagementProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'add'>(initialSubTab);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Student' | 'Adviser' | 'Mentor' | 'Staff'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Users dataset with phone and creation date
  const [users, setUsers] = useState<AppUser[]>([
    {
      id: 'USR001',
      name: 'กษิดิศ พรหมศร',
      nameEn: 'Kasidit Promsorn',
      email: 's6504062610011@email.kmutnb.ac.th',
      phone: '081-234-5678',
      role: 'Student',
      departmentOrCompany: 'Applied CIS (Regular)',
      status: 'Active',
      createdAt: '2026-06-01',
      lastLogin: '2026-09-18 10:24'
    },
    {
      id: 'USR002',
      name: 'ผศ.ดร. ธีรเดช กิตติศักดิ์',
      nameEn: 'Asst. Prof. Dr. Teeradej Kittisak',
      email: 'teeradej.k@sci.kmutnb.ac.th',
      phone: '089-876-5432',
      role: 'Adviser',
      departmentOrCompany: 'Applied CIS Department',
      status: 'Active',
      createdAt: '2025-11-15',
      lastLogin: '2026-09-18 08:15'
    },
    {
      id: 'USR003',
      name: 'คุณสมศักดิ์ พิพัฒน์พัฒนา',
      nameEn: 'Somsak Pipatpattana',
      email: 'somsak.p@nexatech.co.th',
      phone: '086-555-1234',
      role: 'Mentor',
      departmentOrCompany: 'NexaTech Solutions Co., Ltd.',
      status: 'Active',
      createdAt: '2026-05-20',
      lastLogin: '2026-09-17 16:40'
    },
    {
      id: 'USR004',
      name: 'คุณวราภรณ์ สุขสมบูรณ์',
      nameEn: 'Waraporn Suksomboon',
      email: 'staff.cwie@sci.kmutnb.ac.th',
      phone: '02-555-2000 #4102',
      role: 'Staff',
      departmentOrCompany: 'Faculty of Applied Science CWIE Center',
      status: 'Active',
      createdAt: '2024-01-10',
      lastLogin: '2026-09-18 11:00'
    },
    {
      id: 'USR005',
      name: 'นริศรา สุวรรณโชติ',
      nameEn: 'Narissara Suwannachote',
      email: 's6504062610029@email.kmutnb.ac.th',
      phone: '083-999-8877',
      role: 'Student',
      departmentOrCompany: 'Applied CIS (Regular)',
      status: 'Active',
      createdAt: '2026-06-01',
      lastLogin: '2026-09-17 21:05'
    },
    {
      id: 'USR006',
      name: 'คุณกฤษณ์ ตั้งตรง',
      nameEn: 'Krit Tangtrong',
      email: 'krit.t@lineardigital.io',
      phone: '084-222-3344',
      role: 'Mentor',
      departmentOrCompany: 'Linear Digital Innovations',
      status: 'Inactive',
      createdAt: '2026-04-12',
      lastLogin: '2026-08-30 14:12'
    }
  ]);

  // Modals state
  const [viewingUser, setViewingUser] = useState<AppUser | null>(null);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [confirmStatusAction, setConfirmStatusAction] = useState<{ user: AppUser; targetStatus: 'Active' | 'Inactive' } | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<AppUser | null>(null);

  // Form State for Add User
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    email: '',
    phone: '',
    role: 'Student' as 'Student' | 'Adviser' | 'Mentor' | 'Staff',
    departmentOrCompany: '',
    initialPassword: 'Password@1234'
  });

  // Action: Add User
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newUser: AppUser = {
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
      name: formData.name,
      nameEn: formData.nameEn || formData.name,
      email: formData.email,
      phone: formData.phone || '-',
      role: formData.role,
      departmentOrCompany: formData.departmentOrCompany || 'KMUTNB Applied CIS',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };

    setUsers([newUser, ...users]);
    setActiveSubTab('all');
    setFormData({
      name: '',
      nameEn: '',
      email: '',
      phone: '',
      role: 'Student',
      departmentOrCompany: '',
      initialPassword: 'Password@1234'
    });

    onNotify?.(
      isThai 
        ? `เพิ่มผู้ใช้ใหม่ "${newUser.name}" เรียบร้อยแล้ว` 
        : `Created new user "${newUser.name}" successfully!`,
      'success'
    );
  };

  // Action: Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    onNotify?.(
      isThai ? `บันทึกการแก้ไขข้อมูลผู้ใช้ ${editingUser.name} แล้ว` : `Updated user details successfully!`,
      'success'
    );
  };

  // Action: Activate / Deactivate (without deleting)
  const handleConfirmToggleStatus = () => {
    if (!confirmStatusAction) return;
    const { user, targetStatus } = confirmStatusAction;

    setUsers(users.map(u => u.id === user.id ? { ...u, status: targetStatus } : u));
    setConfirmStatusAction(null);

    onNotify?.(
      isThai 
        ? `ปรับสถานะบัญชีของ "${user.name}" เป็น ${targetStatus === 'Active' ? 'เปิดใช้งาน (Active)' : 'ระงับการใช้งาน (Inactive)'} แล้ว` 
        : `Account status for "${user.name}" updated to ${targetStatus}!`,
      'info'
    );
  };

  // Action: Delete User
  const handleConfirmDelete = () => {
    if (!confirmDeleteUser) return;
    setUsers(users.filter(u => u.id !== confirmDeleteUser.id));
    const name = confirmDeleteUser.name;
    setConfirmDeleteUser(null);

    onNotify?.(
      isThai ? `ลบบัญชีผู้ใช้ "${name}" ออกจากระบบแล้ว` : `Deleted user account "${name}".`,
      'warning'
    );
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase()) ||
      u.departmentOrCompany.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'all'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isThai ? 'All Users (ผู้ใช้งานทั้งหมด)' : 'All Users'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('add')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'add'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>{isThai ? 'Add User (เพิ่มผู้ใช้ใหม่)' : 'Add User'}</span>
          </button>
        </div>

        {activeSubTab === 'all' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-48">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isThai ? 'ค้นหาชื่อ, อีเมล, เบอร์โทร...' : 'Search user...'}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#6B122C]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 focus:border-[#6B122C]"
            >
              <option value="All">{isThai ? 'ทุกสิทธิ์ (All Roles)' : 'All Roles'}</option>
              <option value="Student">{isThai ? 'นักศึกษา (Student)' : 'Student'}</option>
              <option value="Adviser">{isThai ? 'อาจารย์ที่ปรึกษา (Adviser)' : 'Adviser'}</option>
              <option value="Mentor">{isThai ? 'พี่เลี้ยง (Mentor)' : 'Mentor'}</option>
              <option value="Staff">{isThai ? 'เจ้าหน้าที่ (Staff)' : 'Staff'}</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 focus:border-[#6B122C]"
            >
              <option value="All">{isThai ? 'ทุกสถานะบัญชี' : 'All Status'}</option>
              <option value="Active">{isThai ? 'เปิดใช้งาน (Active)' : 'Active'}</option>
              <option value="Inactive">{isThai ? 'ระงับใช้งาน (Inactive)' : 'Inactive'}</option>
            </select>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. ALL USERS DIRECTORY TABLE                              */}
      {/* ========================================================= */}
      {activeSubTab === 'all' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'บัญชีผู้ใช้งานระบบและสิทธิ์การเข้าถึง (User Management Directory)' : 'User Management Directory'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isThai 
                  ? 'แยกความแตกต่างชัดเจนระหว่าง "สถานะบัญชี (Account Status)" และ "การดำเนินการ (View/Add/Edit/Activate/Deactivate/Delete)"' 
                  : 'Manages Student, Adviser, Mentor, and Staff accounts with independent status and action controls.'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {filteredUsers.length} {isThai ? 'บัญชี' : 'Accounts'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-3">{isThai ? 'ผู้ใช้งาน / อีเมล' : 'User'}</th>
                  <th className="py-2.5 px-3">{isThai ? 'บทบาท' : 'Role'}</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">{isThai ? 'สังกัด / องค์กร' : 'Organization'}</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">{isThai ? 'เบอร์โทรศัพท์' : 'Phone'}</th>
                  <th className="py-2.5 px-3 hidden lg:table-cell">{isThai ? 'เข้าสู่ระบบล่าสุด' : 'Last Active'}</th>
                  <th className="py-2.5 px-3 text-center">{isThai ? 'สถานะบัญชี' : 'Account Status'}</th>
                  <th className="py-2.5 px-3 text-right">{isThai ? 'การจัดการ (Actions)' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'Staff'
                          ? 'bg-rose-50 text-[#6B122C] border border-rose-200'
                          : u.role === 'Adviser'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : u.role === 'Mentor'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-3 hidden md:table-cell text-slate-600 font-medium">
                      {u.departmentOrCompany}
                    </td>

                    <td className="py-3 px-3 hidden sm:table-cell text-slate-600 font-mono text-[11px]">
                      {u.phone}
                    </td>

                    <td className="py-3 px-3 hidden lg:table-cell text-slate-400 font-mono text-[11px]">
                      {u.lastLogin}
                    </td>

                    {/* Account Status Column */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                        <span>{u.status}</span>
                      </span>
                    </td>

                    {/* Management Actions Column: View, Edit, Activate/Deactivate, Delete */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* 1. View User */}
                        <button
                          onClick={() => setViewingUser(u)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title={isThai ? 'ดูข้อมูลผู้ใช้' : 'View User'}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* 2. Edit User */}
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title={isThai ? 'แก้ไขข้อมูล' : 'Edit User'}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        {/* 3. Activate / Deactivate */}
                        <button
                          onClick={() => setConfirmStatusAction({
                            user: u,
                            targetStatus: u.status === 'Active' ? 'Inactive' : 'Active'
                          })}
                          className={`p-1 rounded-lg cursor-pointer transition-colors ${
                            u.status === 'Active' 
                              ? 'text-amber-500 hover:text-amber-700 hover:bg-amber-50' 
                              : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                          }`}
                          title={u.status === 'Active' ? (isThai ? 'ระงับบัญชี' : 'Deactivate') : (isThai ? 'เปิดใช้งาน' : 'Activate')}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </button>

                        {/* 4. Delete User */}
                        <button
                          onClick={() => setConfirmDeleteUser(u)}
                          className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title={isThai ? 'ลบบัญชี' : 'Delete User'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ADD USER FORM                                          */}
      {/* ========================================================= */}
      {activeSubTab === 'add' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs max-w-2xl mx-auto space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              {isThai ? 'เพิ่มผู้ใช้งานใหม่ (Add New System User)' : 'Add New System User'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isThai ? 'สร้างบัญชีผู้ใช้ใหม่และกำหนดสิทธิ์ (Student, Adviser, Mentor, Staff)' : 'Provision a new identity with assigned roles.'}
            </p>
          </div>

          <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'ชื่อ-นามสกุล (ภาษาไทย):' : 'Full Name (Thai):'} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น นายอานนท์ มีทรัพย์"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'ชื่อ-นามสกุล (ภาษาอังกฤษ):' : 'Full Name (English):'}
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Arnon Meesub"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'อีเมลสำหรับเข้าสู่ระบบ (Email):' : 'Email Address:'} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@kmutnb.ac.th หรือ company.co.th"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'เบอร์โทรศัพท์ติดต่อ (Phone):' : 'Phone Number:'}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08x-xxx-xxxx"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'บทบาท / สิทธิ์การใช้งาน (Role):' : 'Assigned Role:'} <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C] font-semibold text-slate-800"
                >
                  <option value="Student">{isThai ? 'นักศึกษา (Student)' : 'Student'}</option>
                  <option value="Adviser">{isThai ? 'อาจารย์ที่ปรึกษา (Adviser)' : 'Adviser'}</option>
                  <option value="Mentor">{isThai ? 'พี่เลี้ยงสถานประกอบการ (Mentor)' : 'Mentor'}</option>
                  <option value="Staff">{isThai ? 'เจ้าหน้าที่สหกิจศึกษา (Staff)' : 'Staff'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'หน่วยงาน / สาขาวิชา / บริษัทที่สังกัด:' : 'Department / Affiliation / Company:'}
                </label>
                <input
                  type="text"
                  value={formData.departmentOrCompany}
                  onChange={(e) => setFormData({ ...formData, departmentOrCompany: e.target.value })}
                  placeholder="เช่น ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์ หรือ บริษัท เน็กซ่าเทค โซลูชั่นส์"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                {isThai ? 'รหัสผ่านเริ่มต้น (Initial Temporary Password):' : 'Temporary Password:'}
              </label>
              <input
                type="text"
                disabled
                value={formData.initialPassword}
                className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-xs cursor-not-allowed"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {isThai ? '* ผู้ใช้งานจะถูกบังคับให้เปลี่ยนรหัสผ่านในการเข้าสู่ระบบครั้งแรก' : '* User will be prompted to reset password on first login.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveSubTab('all')}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {isThai ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer shadow-xs"
              >
                {isThai ? 'สร้างบัญชีผู้ใช้งาน' : 'Create User Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW USER DETAILS                                  */}
      {/* ========================================================= */}
      {viewingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-[#6B122C]" />
                <span>{isThai ? 'รายละเอียดข้อมูลผู้ใช้งาน' : 'User Account Details'}</span>
              </h3>
              <button onClick={() => setViewingUser(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{viewingUser.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    viewingUser.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {viewingUser.status}
                  </span>
                </div>
                <span className="text-slate-500 font-mono block">{viewingUser.nameEn}</span>
                <span className="text-[10px] text-slate-400 font-mono">ID: {viewingUser.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isThai ? 'บทบาท' : 'Role'}</span>
                  <strong className="text-slate-800">{viewingUser.role}</strong>
                </div>
                <div className="p-2.5 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isThai ? 'เบอร์โทร' : 'Phone'}</span>
                  <strong className="text-slate-800 font-mono">{viewingUser.phone}</strong>
                </div>
              </div>

              <div className="p-2.5 border border-slate-100 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{isThai ? 'อีเมล' : 'Email'}</span>
                <strong className="text-slate-800 font-mono">{viewingUser.email}</strong>
              </div>

              <div className="p-2.5 border border-slate-100 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">{isThai ? 'สังกัด / บริษัท' : 'Affiliation'}</span>
                <strong className="text-slate-800">{viewingUser.departmentOrCompany}</strong>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                <div>
                  <span>{isThai ? 'วันที่สร้างบัญชี:' : 'Created:'} </span>
                  <strong className="font-mono text-slate-700">{viewingUser.createdAt}</strong>
                </div>
                <div>
                  <span>{isThai ? 'เข้าสู่ระบบล่าสุด:' : 'Last Active:'} </span>
                  <strong className="font-mono text-slate-700">{viewingUser.lastLogin}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isThai ? 'ปิด' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT USER                                          */}
      {/* ========================================================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-[#6B122C]" />
                <span>{isThai ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'Edit User Details'}</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'ชื่อ-นามสกุล (ภาษาไทย):' : 'Full Name (Thai):'}
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'ชื่อ-นามสกุล (ภาษาอังกฤษ):' : 'Full Name (English):'}
                </label>
                <input
                  type="text"
                  value={editingUser.nameEn}
                  onChange={(e) => setEditingUser({ ...editingUser, nameEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'บทบาท / สิทธิ์:' : 'Role:'}
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                  >
                    <option value="Student">Student</option>
                    <option value="Adviser">Adviser</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isThai ? 'สถานะบัญชี:' : 'Account Status:'}
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C] font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'อีเมล (Email):' : 'Email:'}
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'เบอร์โทรศัพท์ (Phone):' : 'Phone:'}
                </label>
                <input
                  type="tel"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isThai ? 'หน่วยงาน / สาขาวิชา / บริษัท:' : 'Affiliation:'}
                </label>
                <input
                  type="text"
                  value={editingUser.departmentOrCompany}
                  onChange={(e) => setEditingUser({ ...editingUser, departmentOrCompany: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer"
                >
                  {isThai ? 'บันทึกการแก้ไข' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONFIRM ACTIVATE / DEACTIVATE                      */}
      {/* ========================================================= */}
      {confirmStatusAction && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-full ${
                confirmStatusAction.targetStatus === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                <Power className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {confirmStatusAction.targetStatus === 'Active' 
                    ? (isThai ? 'ยืนยันเปิดใช้งานบัญชี' : 'Confirm Activate Account')
                    : (isThai ? 'ยืนยันระงับการใช้งานบัญชี' : 'Confirm Deactivate Account')}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {confirmStatusAction.user.name} ({confirmStatusAction.user.role})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmStatusAction.targetStatus === 'Active'
                ? (isThai ? 'ผู้ใช้งานจะสามารถเข้าสู่ระบบและดำเนินการตามสิทธิ์ได้ตามปกติ' : 'The user will regain access to log in and perform actions.')
                : (isThai ? 'ผู้ใช้งานจะไม่สามารถเข้าสู่ระบบได้ชั่วคราว แต่ข้อมูลประวัติทั้งหมดยังคงอยู่' : 'The user will be blocked from logging in. No user data will be lost.')}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmStatusAction(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {isThai ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleStatus}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold text-white cursor-pointer ${
                  confirmStatusAction.targetStatus === 'Active' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {confirmStatusAction.targetStatus === 'Active' 
                  ? (isThai ? 'เปิดใช้งาน' : 'Activate')
                  : (isThai ? 'ระงับการใช้งาน' : 'Deactivate')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONFIRM DELETE USER                                */}
      {/* ========================================================= */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-100 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {isThai ? 'ยืนยันการลบบัญชีผู้ใช้' : 'Confirm Delete Account'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {confirmDeleteUser.name} ({confirmDeleteUser.role})
                </p>
              </div>
            </div>

            <p className="text-xs text-rose-600 leading-relaxed font-medium">
              {isThai 
                ? 'คำเตือน: การลบบัญชีจะนำข้อมูลผู้ใช้งานออกจากสารบบอย่างถาวร หากต้องการเพียงปิดการเข้าใช้งานชั่วคราว ให้เลือก "ระงับการใช้งาน (Deactivate)" แทน' 
                : 'Warning: Deleting this account will permanently remove it from the system. If you only want to revoke access temporarily, consider Deactivating instead.'}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteUser(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {isThai ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
              >
                {isThai ? 'ลบบัญชีถาวร' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
