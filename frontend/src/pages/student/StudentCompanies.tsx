import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Building2, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CompanyBrowse, PositionBrowse } from '../../types/company';
import {
  browseCompanies,
  getApiErrorStatus,
  getMyMatching,
  submitApplication,
} from '../../services/api';

interface StudentPositionViewModel {
  id: string;
  title: string;
  description: string | null;
  requirements: string[];
  salary: number | string | null;
  capacity: number | null;
  status: 'open' | 'closed' | 'unknown';
}

interface StudentCompanyViewModel {
  id: string;
  name: string;
  industry: string | null;
  description: string | null;
  logoUrl: string | null;
  location: string | null;
  positions: StudentPositionViewModel[];
}

const buildLocation = (address: string | null, province: string | null): string | null => {
  const trimmedAddress = address?.trim() || null;
  const trimmedProvince = province?.trim() || null;

  if (!trimmedAddress) return trimmedProvince;
  if (!trimmedProvince) return trimmedAddress;

  if (trimmedAddress.toLocaleLowerCase().includes(trimmedProvince.toLocaleLowerCase())) {
    return trimmedAddress;
  }

  return `${trimmedAddress}, ${trimmedProvince}`;
};

const mapPositionToViewModel = (position: PositionBrowse): StudentPositionViewModel => ({
  id: position.position_id,
  title: position.position_name,
  description: position.description,
  requirements: position.requirements ?? [],
  salary: position.salary,
  capacity: position.capacity,
  status: position.status === 'open' || position.status === 'closed'
    ? position.status
    : 'unknown',
});

const mapCompanyToViewModel = (company: CompanyBrowse): StudentCompanyViewModel => ({
  id: company.company_id,
  name: company.company_name,
  industry: company.industry,
  description: company.description,
  logoUrl: company.logo_url,
  location: buildLocation(company.address, company.province),
  positions: company.positions.map(mapPositionToViewModel),
});

interface StudentCompaniesProps {
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function StudentCompanies({ onNotify }: StudentCompaniesProps) {
  const { i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [companies, setCompanies] = useState<StudentCompanyViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | 'open' | 'closed'>('');
  const [selectedCompany, setSelectedCompany] = useState<StudentCompanyViewModel | null>(null);

  // One-company application workflow rule: Student can have only ONE active application at a time
  const [appliedPositionId, setAppliedPositionId] = useState<string>('');
  const [hasInternship, setHasInternship] = useState(false);
  const [applicationSubmittingId, setApplicationSubmittingId] = useState<string | null>(null);

  const fetchMatching = async () => {
    try {
      const matching = await getMyMatching();
      setAppliedPositionId(matching.active_application?.position_id ?? '');
      setHasInternship(matching.internship !== null);
    } catch {
      onNotify?.(
        isThai ? 'ไม่สามารถโหลดสถานะการสมัครได้' : 'Unable to load your application status.',
        'error'
      );
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await browseCompanies({
        search: searchQuery || undefined,
        province: provinceFilter || undefined,
        position_status: statusFilter ? statusFilter : undefined
      });
      setCompanies(data.map(mapCompanyToViewModel));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchQuery, provinceFilter, statusFilter]);

  useEffect(() => {
    fetchMatching();
  }, []);

  const _legacyLocalApplySimulation = (pos: StudentPositionViewModel, comp: StudentCompanyViewModel) => {
    if (pos.status !== 'open') {
      onNotify?.(
        isThai ? 'ตำแหน่งนี้ปิดรับสมัครแล้ว' : 'This position is currently closed.',
        'warning'
      );
      return;
    }

    if (appliedPositionId === pos.id) {
      // Withdraw
      setAppliedPositionId('');
      onNotify?.(
        isThai ? 'ยกเลิกการยื่นใบสมัครเรียบร้อยแล้ว' : 'Withdrew internship application.',
        'info'
      );
      return;
    }

    if (appliedPositionId && appliedPositionId !== pos.id) {
      onNotify?.(
        isThai 
          ? 'คุณสามารถขอยื่นฝึกงานได้ 1 บริษัทเท่านั้นตามเกณฑ์สหกิจศึกษา (กรุณายกเลิกตำแหน่งเดิมก่อน)' 
          : 'Under CWIE policy, you can only apply to 1 company at a time. Please withdraw your previous application first.',
        'warning'
      );
      return;
    }

    // Apply
    setAppliedPositionId(pos.id);
    onNotify?.(
      isThai 
        ? `ยื่นใบสมัครตำแหน่ง ${pos.title} ที่บริษัท ${comp.name} สำเร็จ (1 บริษัทตามระเบียบ)` 
        : `Successfully applied to ${pos.title} at ${comp.name} (Single-company quota).`,
      'success'
    );
  };

  const handleApplyPosition = async (pos: StudentPositionViewModel, comp: StudentCompanyViewModel) => {
    if (pos.status !== 'open' || applicationSubmittingId !== null) return;

    if (hasInternship) {
      onNotify?.(
        isThai ? 'คุณมีสถานที่ฝึกงานแล้ว จึงไม่สามารถสมัครซ้ำได้' : 'You already have an internship and cannot apply again.',
        'warning'
      );
      return;
    }

    if (appliedPositionId) {
      onNotify?.(
        isThai ? 'คุณมีใบสมัครที่กำลังดำเนินการอยู่แล้ว' : 'You already have an active application.',
        'warning'
      );
      return;
    }

    setApplicationSubmittingId(pos.id);
    try {
      await submitApplication(pos.id);
      await fetchMatching();
      onNotify?.(
        isThai
          ? `ส่งใบสมัครตำแหน่ง ${pos.title} ที่ ${comp.name} สำเร็จ`
          : `Application submitted for ${pos.title} at ${comp.name}.`,
        'success'
      );
    } catch (error) {
      const status = getApiErrorStatus(error);
      const message = status === 409
        ? (isThai ? 'ไม่สามารถสมัครได้ เนื่องจากมีใบสมัครหรือสถานที่ฝึกงานอยู่แล้ว' : 'Application conflicts with an existing application or internship.')
        : status === 401
          ? (isThai ? 'กรุณาเข้าสู่ระบบใหม่' : 'Please sign in again.')
          : status === 403
            ? (isThai ? 'บัญชีนี้ไม่มีสิทธิ์สมัครตำแหน่งงาน' : 'This account cannot submit student applications.')
            : status === 404
              ? (isThai ? 'ไม่พบข้อมูลนักศึกษาหรือตำแหน่งงาน' : 'Student profile or position was not found.')
              : status === 422
                ? (isThai ? 'ข้อมูลตำแหน่งงานไม่ถูกต้อง' : 'The position data is invalid.')
                : (isThai ? 'ส่งใบสมัครไม่สำเร็จ กรุณาลองใหม่' : 'Unable to submit the application. Please try again.');
      onNotify?.(message, 'error');
    } finally {
      setApplicationSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 text-left">
      
      {/* 1. Policy Alert Banner */}
      <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Building2 className="h-5 w-5 text-[#6B122C] shrink-0" />
          <span>
            {isThai 
              ? <>ข้อกำหนดสหกิจศึกษา: <b>ขอยื่นฝึกงานได้ 1 บริษัทเท่านั้น</b> เพื่อความเป็นธรรมในการคัดเลือกของสถานประกอบการ</>
              : <>Co-op Guideline: <b>You may apply to 1 company only at a time</b> according to university placement policy.</>
            }
          </span>
        </div>
        {appliedPositionId && (
          <span className="px-2.5 py-1 bg-[#6B122C] text-white font-semibold rounded-lg text-[10px] shrink-0">
            {isThai ? 'คุณมียื่นสมัครแล้ว 1 แห่ง' : '1 Active Application'}
          </span>
        )}
      </div>

      {/* 2. Filter & Search Bar - Backend GET /companies/browse compliant */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isThai ? "ค้นหาชื่อบริษัท หรือตำแหน่งงาน (เช่น React)..." : "Search company name or position..."} 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#6B122C] focus:bg-white"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none text-slate-600"
          >
            <option value="">{isThai ? 'ทุกจังหวัด (Province)' : 'All Provinces'}</option>
            <option value="Bangkok">{isThai ? 'กรุงเทพมหานคร' : 'Bangkok'}</option>
            <option value="Nonthaburi">{isThai ? 'นนทบุรี' : 'Nonthaburi'}</option>
            <option value="Pathum Thani">{isThai ? 'ปทุมธานี' : 'Pathum Thani'}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none text-slate-600"
          >
            <option value="">{isThai ? 'สถานะตำแหน่ง (ทั้งหมด)' : 'All Statuses'}</option>
            <option value="open">{isThai ? 'เปิดรับสมัคร (Open)' : 'Open Positions'}</option>
            <option value="closed">{isThai ? 'ปิดรับสมัคร (Closed)' : 'Closed Positions'}</option>
          </select>
        </div>
      </div>

      {/* 3. Companies Grid */}
      {loading && (
        <div className="text-center text-xs text-slate-500">
          {isThai ? 'กำลังโหลดบริษัท...' : 'Loading companies...'}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 hover:shadow-sm transition-all flex flex-col justify-between h-[310px]">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="h-10 w-10 rounded-xl object-cover shadow-xs"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-200 text-slate-700 text-xs font-black rounded-xl h-10 w-10 flex items-center justify-center shadow-xs">
                    {company.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm truncate">{company.name}</h3>
                <p className="text-[10px] text-[#6B122C] font-medium font-mono uppercase tracking-wider truncate">
                  {company.industry || '—'}
                </p>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {company.description || '—'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate max-w-[120px]">
                  {company.location || '—'}
                </span>
              </div>
              <button
                onClick={() => setSelectedCompany(company)}
                className="px-3 py-1.5 text-xs font-semibold text-[#6B122C] hover:text-white bg-rose-50 hover:bg-[#6B122C] transition-all rounded-lg cursor-pointer"
              >
                {isThai ? 'ดูตำแหน่งงาน' : 'Explore Positions'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Company Detail Modal / Position Application */}
      {selectedCompany && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[70] flex items-center justify-end"
          onClick={() => setSelectedCompany(null)}
        >
          <div 
            className="bg-white h-full w-full max-w-lg p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-6 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                {selectedCompany.logoUrl ? (
                  <img
                    src={selectedCompany.logoUrl}
                    alt={selectedCompany.name}
                    className="h-12 w-12 rounded-xl object-cover shadow-xs"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-slate-200 text-slate-700 font-extrabold flex items-center justify-center text-lg">
                    {selectedCompany.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <h3 className="font-bold text-slate-950 text-base">{selectedCompany.name}</h3>
                  <span className="text-xs text-[#6B122C] font-medium font-mono uppercase">
                    {selectedCompany.industry || '—'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCompany(null)}
                className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-slate-100 text-xs font-semibold"
              >
                <X className="h-4 w-4" />
                {isThai ? 'ปิด' : 'Close'}
              </button>
            </div>

            <div className="space-y-6 text-left">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {isThai ? 'ข้อมูลภาพรวมสถานประกอบการ' : 'Company Overview'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedCompany.description || '—'}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedCompany.location || '—'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isThai ? 'ตำแหน่งงานที่เปิดรับ (CWIE Positions)' : 'Available CWIE Positions'}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {isThai ? 'ขอยื่นฝึกงาน 1 บอเท่านั้น' : 'Single application allowed'}
                  </span>
                </div>
                
                {selectedCompany.positions.map((pos) => {
                  const isApplied = appliedPositionId === pos.id;
                  const isOpen = pos.status === 'open';
                  const isClosed = pos.status === 'closed';

                  return (
                    <div key={pos.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900">
                              {pos.title}
                            </h5>
                            {isClosed ? (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-bold rounded-full">
                                {isThai ? 'ปิดรับสมัคร' : 'Closed'}
                              </span>
                            ) : isOpen ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded-full">
                                {isThai ? 'เปิดรับ' : 'Open'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-full">
                                {isThai ? 'ไม่ระบุสถานะ' : 'Status unavailable'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-1">
                            <span>
                              {isThai
                                ? `จำนวนปัจจุบัน / จำนวนที่รับ: — / ${pos.capacity ?? '—'} คน`
                                : `Filled / Capacity: — / ${pos.capacity ?? '—'}`}
                            </span>
                            <span>•</span>
                            <span className="text-[#6B122C] font-semibold">
                              {pos.salary ?? '—'}
                            </span>
                          </div>
                        </div>

                        {/* Apply / Withdraw button */}
                        <button
                          disabled={!isOpen || Boolean(appliedPositionId) || hasInternship || applicationSubmittingId !== null}
                          onClick={() => handleApplyPosition(pos, selectedCompany)}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-[#6B122C] text-white border-[#6B122C] shadow-xs'
                              : !isOpen || Boolean(appliedPositionId) || hasInternship || applicationSubmittingId !== null
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {applicationSubmittingId === pos.id
                            ? (isThai ? 'กำลังส่งใบสมัคร...' : 'Submitting...')
                            : isApplied
                            ? (isThai ? 'ส่งใบสมัครแล้ว' : 'Applied')
                            : !isOpen
                              ? (isThai ? 'ไม่เปิดรับสมัคร' : 'Unavailable')
                              : (isThai ? 'ขอยื่นฝึกงาน' : 'Apply Position')
                          }
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {pos.description || '—'}
                      </p>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                          {isThai ? 'คุณสมบัติของตำแหน่งงาน:' : 'Requirements:'}
                        </span>
                        <ul className="space-y-1">
                          {pos.requirements.map((req, i) => (
                            <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-tight">
                              <span className="text-[#6B122C] font-bold shrink-0">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
