import React, { useState } from 'react';
import { 
  Building2, MapPin, Plus, Edit2, CheckCircle2, AlertCircle, 
  Search, Users, Check, X, Filter, Briefcase, ChevronRight,
  Calendar, Clock, Video, Trash2, Eye, ExternalLink, HelpCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Company, Position, Student } from '../../types';
import StaffApplicationMatching from './StaffApplicationMatching';

interface StaffCompaniesProps {
  companies: Company[];
  students: Student[];
  initialSubTab?: 'all' | 'matching';
  onUpdateCompany: (company: Company) => void;
  onAddCompany: (company: Company) => void;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

interface MatchingApplication {
  id: string;
  studentId: string;
  studentName: string;
  programType: 'Regular' | 'Special' | 'Bilingual';
  companyId: string;
  companyName: string;
  positionId?: string;
  position: string;
  status: 'Applied' | 'Interview Scheduled' | 'Accepted' | 'Rejected' | 'Matched';
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewNote?: string;
  companyFeedback?: string;
}

export default function StaffCompanies({
  companies,
  students,
  initialSubTab = 'all',
  onUpdateCompany,
  onAddCompany,
  onNotify
}: StaffCompaniesProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'matching'>(initialSubTab);
  const [search, setSearch] = useState('');
  const showLegacyMatching: boolean = false;

  // Local state for companies to support in-memory deletions/edits
  const [localCompanies, setLocalCompanies] = useState<Company[]>(companies);

  // View & Edit Company Modals
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);

  // Add Company Modal State
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'Software & Cloud Solutions',
    location: 'Bangkok, Thailand',
    description: '',
  });

  // Position Management Modals
  const [targetCompanyForPos, setTargetCompanyForPos] = useState<Company | null>(null);
  const [newPosition, setNewPosition] = useState({
    title: '',
    slots: 2,
    salary: '600 - 800 THB/day',
    description: '',
  });
  const [editingPosition, setEditingPosition] = useState<{ company: Company; position: Position } | null>(null);
  const [deletingPosition, setDeletingPosition] = useState<{ company: Company; positionId: string } | null>(null);

  // Matching applications data
  const [matchings, setMatchings] = useState<MatchingApplication[]>([
    {
      id: 'MATCH01',
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      programType: 'Regular',
      companyId: 'COMP01',
      companyName: 'NexaTech Solutions Co., Ltd.',
      positionId: 'POS01',
      position: 'Frontend Engineering Intern',
      status: 'Matched',
      interviewDate: '2026-05-15',
      interviewTime: '10:00 - 11:00',
      interviewLocation: 'อาคารเอ็มไพร์ทาวเวอร์ ชั้น 28 / Google Meet',
      companyFeedback: 'Candidate accepted after technical presentation.'
    },
    {
      id: 'MATCH02',
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      programType: 'Regular',
      companyId: 'COMP02',
      companyName: 'Linear Digital Innovations',
      positionId: 'POS02',
      position: 'Cloud Infrastructure Intern',
      status: 'Interview Scheduled',
      interviewDate: '2026-05-19',
      interviewTime: '14:00 - 14:45',
      interviewLocation: 'อาคารสยามสแควร์วัน ชั้น 14 (ห้องสัมภาษณ์ C)',
      companyFeedback: 'Interview scheduled by coordinator.'
    },
    {
      id: 'MATCH03',
      studentId: 'STU003',
      studentName: 'ชวัลวิทย์ เตชะวณิช',
      programType: 'Special',
      companyId: 'COMP01',
      companyName: 'NexaTech Solutions Co., Ltd.',
      positionId: 'POS01',
      position: 'Frontend Engineering Intern',
      status: 'Applied',
      companyFeedback: 'Application under technical screening.'
    },
    {
      id: 'MATCH04',
      studentId: 'STU004',
      studentName: 'พิมพ์ชนก รัตนกุล',
      programType: 'Bilingual',
      companyId: 'COMP02',
      companyName: 'Linear Digital Innovations',
      positionId: 'POS02',
      position: 'Cloud Infrastructure Intern',
      status: 'Applied',
      companyFeedback: 'Pending coordinator interview scheduling.'
    },
    {
      id: 'MATCH05',
      studentId: 'STU005',
      studentName: 'วรภัทร อัศววิบูลย์',
      programType: 'Regular',
      companyId: 'COMP01',
      companyName: 'NexaTech Solutions Co., Ltd.',
      positionId: 'POS01',
      position: 'Frontend Engineering Intern',
      status: 'Rejected',
      companyFeedback: 'Position slots filled for this cohort.'
    }
  ]);

  // Interview Schedule Modal
  const [schedulingMatch, setSchedulingMatch] = useState<MatchingApplication | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    location: '',
    note: ''
  });

  // Calculate matched count for a position
  const getMatchedCountForPosition = (companyId: string, positionTitle: string) => {
    return matchings.filter(m => m.companyId === companyId && m.position === positionTitle && m.status === 'Matched').length;
  };

  // Check and update position open/closed based on capacity
  const updatePositionCapacityLogic = (currentCompanies: Company[], companyId: string, positionTitle: string, newMatchedCount: number) => {
    return currentCompanies.map(c => {
      if (c.id !== companyId) return c;
      return {
        ...c,
        positions: c.positions.map(p => {
          if (p.title === positionTitle) {
            const shouldBeClosed = newMatchedCount >= p.slots;
            return {
              ...p,
              filled: newMatchedCount,
              status: shouldBeClosed ? 'closed' : p.status
            };
          }
          return p;
        })
      };
    });
  };

  // Toggle position manually
  const handleTogglePositionStatus = (company: Company, posId: string) => {
    const updatedPositions = company.positions.map(p => {
      if (p.id === posId) {
        const nextStatus: 'open' | 'closed' = p.status === 'open' ? 'closed' : 'open';
        return { ...p, status: nextStatus };
      }
      return p;
    });
    const updatedCompany = { ...company, positions: updatedPositions };
    
    setLocalCompanies(localCompanies.map(c => c.id === company.id ? updatedCompany : c));
    onUpdateCompany(updatedCompany);
    onNotify?.(
      isThai ? 'อัปเดตสถานะเปิด/ปิดรับสมัครเรียบร้อยแล้ว' : 'Toggled position open/closed status.',
      'info'
    );
  };

  // Add Company
  const handleCreateCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name.trim()) return;

    const brandColors = [
      'from-rose-800 to-rose-950',
      'from-amber-700 to-amber-900',
      'from-slate-700 to-slate-900',
      'from-emerald-700 to-emerald-900'
    ];

    const created: Company = {
      id: `COMP${String(localCompanies.length + 1).padStart(2, '0')}`,
      name: newCompany.name,
      industry: newCompany.industry,
      location: newCompany.location,
      rating: 4.8,
      description: newCompany.description || 'KMUTNB Applied CIS Approved CWIE Industry Partner.',
      logoColor: brandColors[localCompanies.length % brandColors.length],
      positions: []
    };

    setLocalCompanies([...localCompanies, created]);
    onAddCompany(created);
    setIsAddCompanyOpen(false);
    setNewCompany({ name: '', industry: 'Software & Cloud Solutions', location: 'Bangkok, Thailand', description: '' });
    onNotify?.(
      isThai ? `เพิ่มสถานประกอบการ "${created.name}" เรียบร้อยแล้ว` : `Added company "${created.name}" successfully!`,
      'success'
    );
  };

  // Edit Company
  const handleEditCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    setLocalCompanies(localCompanies.map(c => c.id === editingCompany.id ? editingCompany : c));
    onUpdateCompany(editingCompany);
    setEditingCompany(null);
    onNotify?.(
      isThai ? `บันทึกข้อมูล "${editingCompany.name}" เรียบร้อยแล้ว` : `Saved company "${editingCompany.name}"!`,
      'success'
    );
  };

  // Delete Company
  const handleConfirmDeleteCompany = () => {
    if (!deletingCompany) return;
    setLocalCompanies(localCompanies.filter(c => c.id !== deletingCompany.id));
    setDeletingCompany(null);
    onNotify?.(
      isThai ? `ลบสถานประกอบการเรียบร้อยแล้ว` : `Deleted company successfully.`,
      'warning'
    );
  };

  // Add Position
  const handleCreatePositionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCompanyForPos || !newPosition.title.trim()) return;

    const slots = Number(newPosition.slots) || 1;
    const newPosObj: Position = {
      id: `POS${Date.now()}`,
      title: newPosition.title,
      slots: slots,
      filled: 0,
      salary: newPosition.salary,
      description: newPosition.description || 'Full-time cooperative education position.',
      requirements: ['TypeScript / Modern Framework', 'Git Workflow', 'Team Communication'],
      status: 'open'
    };

    const updated: Company = {
      ...targetCompanyForPos,
      positions: [...targetCompanyForPos.positions, newPosObj]
    };

    setLocalCompanies(localCompanies.map(c => c.id === updated.id ? updated : c));
    onUpdateCompany(updated);
    setTargetCompanyForPos(null);
    setNewPosition({ title: '', slots: 2, salary: '600 - 800 THB/day', description: '' });
    onNotify?.(
      isThai ? `เพิ่มตำแหน่งงานใน ${updated.name} เรียบร้อยแล้ว (สถานะเริ่มต้น: OPEN)` : `Added position to ${updated.name}! (Status: OPEN)`,
      'success'
    );
  };

  // Edit Position
  const handleEditPositionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPosition) return;

    const { company, position } = editingPosition;
    const currentMatched = getMatchedCountForPosition(company.id, position.title);
    const shouldBeClosed = currentMatched >= position.slots;
    const finalPos: Position = {
      ...position,
      status: shouldBeClosed ? 'closed' : position.status
    };

    const updated: Company = {
      ...company,
      positions: company.positions.map(p => p.id === position.id ? finalPos : p)
    };

    setLocalCompanies(localCompanies.map(c => c.id === updated.id ? updated : c));
    onUpdateCompany(updated);
    setEditingPosition(null);
    onNotify?.(
      isThai ? `แก้ไขตำแหน่งงาน "${position.title}" เรียบร้อยแล้ว` : `Updated position "${position.title}"!`,
      'success'
    );
  };

  // Delete Position
  const handleConfirmDeletePosition = () => {
    if (!deletingPosition) return;
    const { company, positionId } = deletingPosition;
    const updated: Company = {
      ...company,
      positions: company.positions.filter(p => p.id !== positionId)
    };

    setLocalCompanies(localCompanies.map(c => c.id === updated.id ? updated : c));
    onUpdateCompany(updated);
    setDeletingPosition(null);
    onNotify?.(
      isThai ? `ลบตำแหน่งงานเรียบร้อยแล้ว` : `Removed position successfully.`,
      'warning'
    );
  };

  // Open Schedule Interview Modal
  const handleOpenScheduleModal = (match: MatchingApplication) => {
    setSchedulingMatch(match);
    setInterviewForm({
      date: match.interviewDate || '2026-05-20',
      time: match.interviewTime || '10:00 - 11:00',
      location: match.interviewLocation || 'Google Meet / Online Meeting Room',
      note: match.interviewNote || ''
    });
  };

  // Confirm Interview Schedule
  const handleConfirmInterviewSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingMatch) return;

    const updatedMatchings = matchings.map(m => {
      if (m.id === schedulingMatch.id) {
        return {
          ...m,
          status: 'Interview Scheduled' as const,
          interviewDate: interviewForm.date,
          interviewTime: interviewForm.time,
          interviewLocation: interviewForm.location,
          interviewNote: interviewForm.note,
          companyFeedback: isThai ? 'นัดหมายการสัมภาษณ์เรียบร้อยแล้ว' : 'Interview scheduled by coordinator.'
        };
      }
      return m;
    });

    setMatchings(updatedMatchings);
    setSchedulingMatch(null);
    onNotify?.(
      isThai 
        ? `บันทึกการนัดสัมภาษณ์และจำลองการแจ้งเตือน นศ. (${schedulingMatch.studentName}) เรียบร้อยแล้ว` 
        : `Interview scheduled & mock notification sent to ${schedulingMatch.studentName}!`,
      'success'
    );
  };

  // Company Decision: Accept
  const handleCompanyDecisionAccept = (match: MatchingApplication) => {
    const updatedMatchings = matchings.map(m => {
      if (m.id === match.id) {
        return {
          ...m,
          status: 'Matched' as const,
          companyFeedback: isThai ? 'สถานประกอบการตอบรับการฝึกงานและยืนยันการจับคู่สำเร็จ' : 'Company accepted candidate. Matched placement confirmed.'
        };
      }
      return m;
    });

    setMatchings(updatedMatchings);

    // Update capacity logic: count total matched for this company & position
    const currentMatched = updatedMatchings.filter(m => m.companyId === match.companyId && m.position === match.position && m.status === 'Matched').length;
    const nextCompanies = updatePositionCapacityLogic(localCompanies, match.companyId, match.position, currentMatched);
    setLocalCompanies(nextCompanies);

    const comp = nextCompanies.find(c => c.id === match.companyId);
    if (comp) onUpdateCompany(comp);

    onNotify?.(
      isThai 
        ? `ยืนยันผลรับเข้าฝึกงาน (Matched) เรียบร้อย! ตำแหน่งงานจะถูกปิดรับอัตโนมัติหากครบจำนวน Capacity` 
        : `Candidate accepted! Status updated to Matched. Position capacity evaluated.`,
      'success'
    );
  };

  // Company Decision: Reject
  const handleCompanyDecisionReject = (match: MatchingApplication) => {
    const updatedMatchings = matchings.map(m => {
      if (m.id === match.id) {
        return {
          ...m,
          status: 'Rejected' as const,
          companyFeedback: isThai ? 'สถานประกอบการไม่ผ่านการคัดเลือกในรอบนี้' : 'Candidate not selected for this position.'
        };
      }
      return m;
    });

    setMatchings(updatedMatchings);
    onNotify?.(
      isThai ? `ปรับสถานะเป็นปฏิเสธ (Rejected) เรียบร้อยแล้ว` : `Updated matching status to Rejected.`,
      'warning'
    );
  };

  // Filtering
  const filteredCompanies = localCompanies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMatchings = matchings.filter(m =>
    m.studentName.toLowerCase().includes(search.toLowerCase()) ||
    m.companyName.toLowerCase().includes(search.toLowerCase()) ||
    m.position.toLowerCase().includes(search.toLowerCase())
  );

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
            <Building2 className="h-4 w-4" />
            <span>{isThai ? 'All Companies (สถานประกอบการทั้งหมด)' : 'All Companies'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {localCompanies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('matching')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'matching'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isThai ? 'Matching Students (การจับคู่ นศ.)' : 'Matching Students'}</span>
          </button>
        </div>

        {activeSubTab === 'all' && (
          <button
            onClick={() => setIsAddCompanyOpen(true)}
            className="px-4 py-2 bg-[#6B122C] hover:bg-[#520d21] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{isThai ? 'เพิ่มสถานประกอบการใหม่' : 'Add Company'}</span>
          </button>
        )}
      </div>

      {/* Search Header */}
      <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl shadow-xs">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input 
          type="text"
          placeholder={
            activeSubTab === 'all'
              ? (isThai ? 'ค้นหาสถานประกอบการ หรือประเภทธุรกิจ...' : 'Search companies by name or industry...')
              : (isThai ? 'ค้นหารายชื่อ นศ., บริษัท หรือตำแหน่งงาน...' : 'Search student, company, or position...')
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-700 placeholder:text-slate-400"
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="p-1 hover:bg-slate-100 text-slate-400 rounded-lg cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: ALL COMPANIES                                 */}
      {/* ========================================================= */}
      {activeSubTab === 'all' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredCompanies.map((comp) => {
              const totalSlots = comp.positions.reduce((acc, p) => acc + p.slots, 0);
              const openPositionsCount = comp.positions.filter(p => p.status === 'open').length;

              return (
                <div 
                  key={comp.id} 
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-slate-200 transition-all text-left"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#6B122C] to-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                        {comp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{comp.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 text-slate-600">
                            {comp.industry}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{comp.description}</p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {comp.location}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-slate-600">
                            {comp.positions.length} {isThai ? 'ตำแหน่งงานทั้งหมด' : 'positions'}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium">
                            {openPositionsCount} {isThai ? 'ตำแหน่งเปิดรับ' : 'open'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Company Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => setViewingCompany(comp)}
                        className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        title={isThai ? 'ดูรายละเอียด' : 'View Company'}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{isThai ? 'รายละเอียด' : 'View'}</span>
                      </button>

                      <button
                        onClick={() => setEditingCompany(comp)}
                        className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        title={isThai ? 'แก้ไขข้อมูล' : 'Edit Company'}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{isThai ? 'แก้ไข' : 'Edit'}</span>
                      </button>

                      <button
                        onClick={() => setTargetCompanyForPos(comp)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{isThai ? 'เพิ่มตำแหน่งงาน' : 'Add Position'}</span>
                      </button>

                      <button
                        onClick={() => setDeletingCompany(comp)}
                        className="p-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        title={isThai ? 'ลบสถานประกอบการ' : 'Delete Company'}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Positions List in Company */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>{isThai ? 'ตำแหน่งงานและโควตารับ (Positions & Capacity)' : 'Positions & Capacity'}</span>
                      <span>{isThai ? 'สถานะเปิด/ปิดรับ' : 'Status'}</span>
                    </div>

                    {comp.positions.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        {isThai ? 'ยังไม่มีตำแหน่งงานเปิดรับ คลิก "เพิ่มตำแหน่งงาน" เพื่อสร้างตำแหน่งใหม่' : 'No positions listed yet. Click "Add Position" to add one.'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {comp.positions.map((pos) => {
                          const matchedCount = getMatchedCountForPosition(comp.id, pos.title);
                          const isOpen = pos.status === 'open';

                          return (
                            <div 
                              key={pos.id} 
                              className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex flex-col justify-between gap-2 text-left"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-slate-800">{pos.title}</h4>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                      isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                      {isOpen ? 'OPEN' : 'CLOSED'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-0.5">{pos.salary}</p>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => setEditingPosition({ company: comp, position: pos })}
                                    className="p-1 hover:bg-white text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
                                    title={isThai ? 'แก้ไขตำแหน่งงาน' : 'Edit Position'}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingPosition({ company: comp, positionId: pos.id })}
                                    className="p-1 hover:bg-white text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                                    title={isThai ? 'ลบตำแหน่งงาน' : 'Delete Position'}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Capacity Bar & Toggle */}
                              <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-[11px]">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500">
                                    {isThai ? 'รับแล้ว' : 'Matched'}: <strong className="text-slate-800">{matchedCount}/{pos.slots}</strong>
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    (Capacity: {pos.slots})
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleTogglePositionStatus(comp, pos.id)}
                                  className={`px-2 py-0.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all border ${
                                    isOpen
                                      ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                      : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                  }`}
                                >
                                  {isOpen 
                                    ? (isThai ? 'คลิกเพื่อปิดรับ (Close)' : 'Close Position') 
                                    : (isThai ? 'คลิกเพื่อเปิดรับ (Open)' : 'Open Position')}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: MATCHING STUDENTS (Student <-> Company Workflow)*/}
      {/* ========================================================= */}
      {activeSubTab === 'matching' && (
        <StaffApplicationMatching search={search} onNotify={onNotify} />
      )}

      {showLegacyMatching && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">
                {isThai ? 'กระบวนการจับคู่ฝึกงาน (CWIE Matching Workflow)' : 'CWIE Student Matching Workflow'}
              </strong>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                {isThai 
                  ? 'ลำดับขั้นตอน: Applied (สมัคร) → นัดสัมภาษณ์ (Interview Scheduled) → การตัดสินใจของสถานประกอบการ (Company Decision: Accept/Reject) → ยืนยันการจับคู่สำเร็จ (Matched). เมื่อรับ นศ. ครบจำนวนโควตา Capacity ของตำแหน่งงาน ระบบจะเปลี่ยนสถานะตำแหน่งเป็น CLOSED โดยอัตโนมัติ' 
                  : 'Workflow sequence: Applied → Interview Scheduled → Company Decision (Accept/Reject) → Matched. When confirmed matches reach position capacity, the position automatically transitions to CLOSED.'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">{isThai ? 'นักศึกษา' : 'Student'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'สถานประกอบการ / ตำแหน่ง' : 'Company & Position'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'สถานะการจับคู่' : 'Matching Status'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'ข้อมูลการสัมภาษณ์' : 'Interview Details'}</th>
                    <th className="py-3.5 px-4 text-right">{isThai ? 'การดำเนินการ (Actions)' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMatchings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        {isThai ? 'ไม่พบข้อมูลการจับคู่ที่ตรงกับคำค้นหา' : 'No matching records found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredMatchings.map((match) => {
                      return (
                        <tr key={match.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 align-top">
                            <div className="font-bold text-slate-900">{match.studentName}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              ID: {match.studentId} • {match.programType}
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="font-bold text-slate-800">{match.companyName}</div>
                            <div className="text-[11px] text-[#6B122C] font-semibold mt-0.5">
                              {match.position}
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                match.status === 'Matched' ? 'bg-emerald-100 text-emerald-800' :
                                match.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
                                match.status === 'Accepted' ? 'bg-indigo-100 text-indigo-800' :
                                match.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  match.status === 'Matched' ? 'bg-emerald-600' :
                                  match.status === 'Interview Scheduled' ? 'bg-blue-600' :
                                  match.status === 'Accepted' ? 'bg-indigo-600' :
                                  match.status === 'Rejected' ? 'bg-rose-600' :
                                  'bg-amber-600'
                                }`} />
                                {match.status}
                              </span>
                              {match.companyFeedback && (
                                <p className="text-[10px] text-slate-500 mt-1 max-w-xs line-clamp-1 italic">
                                  "{match.companyFeedback}"
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            {match.interviewDate ? (
                              <div className="space-y-0.5 text-[11px] text-slate-600">
                                <div className="flex items-center gap-1 font-semibold text-slate-800">
                                  <Calendar className="h-3 w-3 text-slate-400" />
                                  <span>{match.interviewDate} ({match.interviewTime})</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <MapPin className="h-3 w-3 text-slate-400" />
                                  <span className="truncate max-w-[180px]">{match.interviewLocation}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                {isThai ? 'ยังไม่มีนัดหมาย' : 'Not scheduled'}
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 align-top text-right space-y-1.5">
                            {/* Actions according to workflow */}
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Action 1: Schedule Interview */}
                              <button
                                onClick={() => handleOpenScheduleModal(match)}
                                className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Calendar className="h-3 w-3 text-slate-500" />
                                <span>{isThai ? 'นัดสัมภาษณ์' : 'Schedule Interview'}</span>
                              </button>

                              {/* Action 2: Company Decision Accept */}
                              {match.status !== 'Matched' && (
                                <button
                                  onClick={() => handleCompanyDecisionAccept(match)}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                  title={isThai ? 'สถานประกอบการรับเข้าฝึกงาน' : 'Accept & Match'}
                                >
                                  <Check className="h-3 w-3" />
                                  <span>{isThai ? 'ตอบรับ (Accept)' : 'Accept'}</span>
                                </button>
                              )}

                              {/* Action 3: Company Decision Reject */}
                              {match.status !== 'Rejected' && match.status !== 'Matched' && (
                                <button
                                  onClick={() => handleCompanyDecisionReject(match)}
                                  className="px-2.5 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                  title={isThai ? 'ไม่ผ่านการคัดเลือก' : 'Reject'}
                                >
                                  <X className="h-3 w-3" />
                                  <span>{isThai ? 'ปฏิเสธ' : 'Reject'}</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD COMPANY                                        */}
      {/* ========================================================= */}
      {isAddCompanyOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'เพิ่มสถานประกอบการใหม่' : 'Add New Company'}
              </h3>
              <button onClick={() => setIsAddCompanyOpen(false)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCompanySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'ชื่อสถานประกอบการ *' : 'Company Name *'}
                </label>
                <input 
                  type="text" 
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder={isThai ? 'เช่น บริษัท นวัตกรรมซอฟต์แวร์ จำกัด' : 'e.g. NexaTech Solutions Co., Ltd.'}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'กลุ่มอุตสาหกรรม / ประเภทธุรกิจ' : 'Industry'}
                </label>
                <select
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                >
                  <option value="Software & Cloud Solutions">Software & Cloud Solutions</option>
                  <option value="FinTech & Banking">FinTech & Banking</option>
                  <option value="Data Analytics & AI">Data Analytics & AI</option>
                  <option value="E-Commerce & Digital Media">E-Commerce & Digital Media</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'ที่อยู่ / ที่ตั้งสถานประกอบการ' : 'Location'}
                </label>
                <input 
                  type="text" 
                  value={newCompany.location}
                  onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                  placeholder="Bangkok, Thailand"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'รายละเอียดโดยย่อ' : 'Description'}
                </label>
                <textarea 
                  rows={3}
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                  placeholder={isThai ? 'ข้อมูลเกี่ยวกับสถานประกอบการ...' : 'Company description...'}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer shadow-xs"
                >
                  {isThai ? 'บันทึกสถานประกอบการ' : 'Save Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW COMPANY                                       */}
      {/* ========================================================= */}
      {viewingCompany && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#6B122C] text-white flex items-center justify-center font-bold text-xs">
                  {viewingCompany.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{viewingCompany.name}</h3>
                  <p className="text-[10px] text-slate-400">{viewingCompany.industry}</p>
                </div>
              </div>
              <button onClick={() => setViewingCompany(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {isThai ? 'ที่อยู่ / สถานที่ปฏิบัติงาน' : 'Location'}
                </span>
                <p className="text-slate-800 font-medium mt-0.5">{viewingCompany.location}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {isThai ? 'รายละเอียดสถานประกอบการ' : 'Description'}
                </span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{viewingCompany.description}</p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  {isThai ? 'ตำแหน่งงานทั้งหมดในบริษัทนี้' : 'Registered Positions'} ({viewingCompany.positions.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {viewingCompany.positions.map(pos => (
                    <div key={pos.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{pos.title}</div>
                        <div className="text-[10px] text-slate-400">{pos.salary} • Capacity: {pos.slots} คน</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        pos.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {pos.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewingCompany(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                {isThai ? 'ปิดหน้าต่าง' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT COMPANY                                       */}
      {/* ========================================================= */}
      {editingCompany && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'แก้ไขข้อมูลสถานประกอบการ' : 'Edit Company'}
              </h3>
              <button onClick={() => setEditingCompany(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleEditCompanySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'ชื่อสถานประกอบการ *' : 'Company Name *'}
                </label>
                <input 
                  type="text" 
                  required
                  value={editingCompany.name}
                  onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'กลุ่มอุตสาหกรรม' : 'Industry'}
                </label>
                <input 
                  type="text" 
                  value={editingCompany.industry}
                  onChange={(e) => setEditingCompany({ ...editingCompany, industry: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'ที่อยู่ / ที่ตั้งสถานประกอบการ' : 'Location'}
                </label>
                <input 
                  type="text" 
                  value={editingCompany.location}
                  onChange={(e) => setEditingCompany({ ...editingCompany, location: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'รายละเอียดโดยย่อ' : 'Description'}
                </label>
                <textarea 
                  rows={3}
                  value={editingCompany.description}
                  onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCompany(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer shadow-xs"
                >
                  {isThai ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE COMPANY CONFIRMATION                        */}
      {/* ========================================================= */}
      {deletingCompany && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{isThai ? 'ยืนยันการลบสถานประกอบการ' : 'Confirm Delete Company'}</h3>
                <p className="text-xs text-slate-500">{deletingCompany.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isThai 
                ? 'คุณแน่ใจหรือไม่ว่าต้องการลบสถานประกอบการนี้? ตำแหน่งงานทั้งหมดภายใต้บริษัทนี้จะถูกลบออกด้วย' 
                : 'Are you sure you want to delete this company? All associated positions will also be removed.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingCompany(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {isThai ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmDeleteCompany}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                {isThai ? 'ยืนยันลบ' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD POSITION                                       */}
      {/* ========================================================= */}
      {targetCompanyForPos && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isThai ? 'เพิ่มตำแหน่งงานใหม่' : 'Add New Position'}
                </h3>
                <p className="text-[10px] text-slate-400">{targetCompanyForPos.name}</p>
              </div>
              <button onClick={() => setTargetCompanyForPos(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePositionSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'ชื่อตำแหน่งงาน *' : 'Position Title *'}
                </label>
                <input 
                  type="text" 
                  required
                  value={newPosition.title}
                  onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
                  placeholder={isThai ? 'เช่น Frontend Developer Intern' : 'e.g. Frontend Developer Intern'}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'จำนวนที่เปิดรับ (Capacity) *' : 'Capacity (Slots) *'}
                  </label>
                  <input 
                    type="number" 
                    min={1}
                    max={20}
                    required
                    value={newPosition.slots}
                    onChange={(e) => setNewPosition({ ...newPosition, slots: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'ค่าตอบแทน / เบี้ยเลี้ยง' : 'Salary / Allowance'}
                  </label>
                  <input 
                    type="text" 
                    value={newPosition.salary}
                    onChange={(e) => setNewPosition({ ...newPosition, salary: e.target.value })}
                    placeholder="600 - 800 THB/day"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'รายละเอียดงาน' : 'Description'}
                </label>
                <textarea 
                  rows={2}
                  value={newPosition.description}
                  onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })}
                  placeholder={isThai ? 'ลักษณะงาน ความรับผิดชอบ...' : 'Job responsibilities...'}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
                {isThai 
                  ? '💡 สถานะเริ่มต้นของตำแหน่งใหม่จะเป็น "OPEN" และจะปิดรับ (CLOSED) อัตโนมัติเมื่อจำนวน นศ. ที่ Matched เท่ากับหรือมากกว่า Capacity' 
                  : '💡 Default status is OPEN, and will automatically change to CLOSED when matched students reach capacity.'}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTargetCompanyForPos(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer shadow-xs"
                >
                  {isThai ? 'เพิ่มตำแหน่ง' : 'Save Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT POSITION                                      */}
      {/* ========================================================= */}
      {editingPosition && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'แก้ไขตำแหน่งงาน' : 'Edit Position'}
              </h3>
              <button onClick={() => setEditingPosition(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleEditPositionSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'ชื่อตำแหน่งงาน *' : 'Position Title *'}
                </label>
                <input 
                  type="text" 
                  required
                  value={editingPosition.position.title}
                  onChange={(e) => setEditingPosition({
                    ...editingPosition,
                    position: { ...editingPosition.position, title: e.target.value }
                  })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'จำนวนที่เปิดรับ (Capacity) *' : 'Capacity (Slots) *'}
                  </label>
                  <input 
                    type="number" 
                    min={1}
                    required
                    value={editingPosition.position.slots}
                    onChange={(e) => setEditingPosition({
                      ...editingPosition,
                      position: { ...editingPosition.position, slots: Number(e.target.value) }
                    })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'ค่าตอบแทน / เบี้ยเลี้ยง' : 'Salary / Allowance'}
                  </label>
                  <input 
                    type="text" 
                    value={editingPosition.position.salary}
                    onChange={(e) => setEditingPosition({
                      ...editingPosition,
                      position: { ...editingPosition.position, salary: e.target.value }
                    })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'สถานะเปิด/ปิดรับ' : 'Status'}
                </label>
                <select
                  value={editingPosition.position.status}
                  onChange={(e) => setEditingPosition({
                    ...editingPosition,
                    position: { ...editingPosition.position, status: e.target.value as 'open' | 'closed' }
                  })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                >
                  <option value="open">OPEN (เปิดรับสมัคร)</option>
                  <option value="closed">CLOSED (ปิดรับสมัคร)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPosition(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer shadow-xs"
                >
                  {isThai ? 'บันทึกการแก้ไข' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE POSITION CONFIRMATION                       */}
      {/* ========================================================= */}
      {deletingPosition && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{isThai ? 'ยืนยันการลบตำแหน่งงาน' : 'Confirm Delete Position'}</h3>
                <p className="text-xs text-slate-500">{deletingPosition.company.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isThai 
                ? 'คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่งงานนี้ออกจากระบบ?' 
                : 'Are you sure you want to delete this position from the system?'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingPosition(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {isThai ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmDeletePosition}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                {isThai ? 'ยืนยันลบ' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SCHEDULE INTERVIEW                                 */}
      {/* ========================================================= */}
      {schedulingMatch && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isThai ? 'นัดหมายการสัมภาษณ์งาน (Schedule Interview)' : 'Schedule Interview'}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {schedulingMatch.studentName} • {schedulingMatch.companyName}
                </p>
              </div>
              <button onClick={() => setSchedulingMatch(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmInterviewSchedule} className="space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isThai ? 'นักศึกษา' : 'Student'}:</span>
                  <span className="font-bold text-slate-800">{schedulingMatch.studentName} ({schedulingMatch.studentId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isThai ? 'บริษัท' : 'Company'}:</span>
                  <span className="font-bold text-slate-800">{schedulingMatch.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isThai ? 'ตำแหน่ง' : 'Position'}:</span>
                  <span className="font-bold text-[#6B122C]">{schedulingMatch.position}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'วันที่สัมภาษณ์ *' : 'Interview Date *'}
                  </label>
                  <input 
                    type="date" 
                    required
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'เวลาสัมภาษณ์ *' : 'Interview Time *'}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="10:00 - 11:00"
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'สถานที่สัมภาษณ์ หรือ ลิงก์ออนไลน์ *' : 'Location or Online Meeting Link *'}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={isThai ? 'เช่น Google Meet: https://meet.google.com/xyz หรือ ตึก A ห้อง 401' : 'e.g. Google Meet link or Room 401'}
                  value={interviewForm.location}
                  onChange={(e) => setInterviewForm({ ...interviewForm, location: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'หมายเหตุเพิ่มเติม (Additional Note)' : 'Additional Note'}
                </label>
                <textarea 
                  rows={2}
                  placeholder={isThai ? 'เอกสารที่ต้องเตรียม, การแต่งกาย...' : 'Dress code, documents to prepare...'}
                  value={interviewForm.note}
                  onChange={(e) => setInterviewForm({ ...interviewForm, note: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSchedulingMatch(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer shadow-xs"
                >
                  {isThai ? 'ยืนยันและส่งแจ้งเตือน (Confirm & Notify)' : 'Confirm & Notify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
