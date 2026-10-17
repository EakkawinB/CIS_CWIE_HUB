import React, { useState } from 'react';
import { 
  Award, Search, Users, Calendar, Clock, MapPin, 
  CheckCircle2, XCircle, Check, X, FileText, Filter, 
  AlertCircle, Plus, Edit2, Trash2, ArrowUp, ArrowDown, 
  ChevronRight, Sliders, GraduationCap, Building2, Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Student } from '../../types';

interface StaffExaminationProps {
  students: Student[];
  initialSubTab?: 'criteria' | 'rooms' | 'schedule';
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

// 1. Score Criteria Interface
export interface ScoreCriterion {
  id: string;
  round: string; // e.g. 'Round 1 (Final Defense)' or 'รอบการสอบประเมินโครงงาน'
  name: string;
  description: string;
  maxScore: number;
}

// 2. Examination Room Interface (Room as Primary Organizational Unit)
export interface ExaminationRoom {
  id: string;
  roomNumber: string;
  building: string;
  date: string;
  sessionTime: string; // e.g. '09:00 - 12:00'
  committee: {
    id: string;
    name: string;
    role: string; // e.g. 'ประธานกรรมการ', 'กรรมการที่ปรึกษา', 'ผู้ทรงคุณวุฒิ'
  }[];
  studentIds: string[];
}

// 3. Presentation Slot Interface
export interface PresentationSlot {
  id: string;
  roomId: string;
  studentId: string;
  studentName: string;
  topic: string;
  startTime: string;
  endTime: string;
  order: number;
}

export default function StaffExamination({
  students,
  initialSubTab = 'criteria',
  onNotify
}: StaffExaminationProps) {
  const { t, i18n } = useTranslation();
  const isThai = i18n.language?.startsWith('th');

  const [activeSubTab, setActiveSubTab] = useState<'criteria' | 'rooms' | 'schedule'>(
    initialSubTab === 'rooms' ? 'rooms' : initialSubTab === 'schedule' ? 'schedule' : 'criteria'
  );

  const [search, setSearch] = useState('');

  // ---------------------------------------------------------------------------
  // 1. SCORE CRITERIA STATE
  // ---------------------------------------------------------------------------
  const [criteria, setCriteria] = useState<ScoreCriterion[]>([
    {
      id: 'CRIT-01',
      round: 'รอบสอบปากเปล่าโครงงานสหกิจ (Final Defense)',
      name: 'คุณภาพของโครงงานและความรู้ความเข้าใจ (Project Quality & Technical Depth)',
      description: 'ความถูกต้องของระบบ ระดับความยาก การประยุกต์ใช้องค์ความรู้ และความสมบูรณ์ของผลงาน',
      maxScore: 35
    },
    {
      id: 'CRIT-02',
      round: 'รอบสอบปากเปล่าโครงงานสหกิจ (Final Defense)',
      name: 'ทักษะการนำเสนอและการสื่อสาร (Presentation & Communication)',
      description: 'ความกระชับ ชัดเจน ลำดับขั้นตอน การใช้สื่อนำเสนอ และการบริหารเวลา',
      maxScore: 20
    },
    {
      id: 'CRIT-03',
      round: 'รอบสอบปากเปล่าโครงงานสหกิจ (Final Defense)',
      name: 'การตอบคำถามของคณะกรรมการ (Defense & Q&A)',
      description: 'ไหวพริบ ความสามารถในการชี้แจงข้อสงสัย และความเข้าใจในเหตุผลทางวิศวกรรม/สารสนเทศ',
      maxScore: 25
    },
    {
      id: 'CRIT-04',
      round: 'รอบสอบปากเปล่าโครงงานสหกิจ (Final Defense)',
      name: 'ความสมบูรณ์ของรูปเล่มรายงาน (Report Documentation)',
      description: 'รูปแบบตามระเบียบ แบบอ้างอิง เอกสารคู่มือระบบ และการวิเคราะห์ผลลัพธ์',
      maxScore: 20
    }
  ]);

  const [editingCriterion, setEditingCriterion] = useState<ScoreCriterion | null>(null);
  const [isAddingCriterion, setIsAddingCriterion] = useState(false);
  const [criterionForm, setCriterionForm] = useState<Omit<ScoreCriterion, 'id'>>({
    round: 'รอบสอบปากเปล่าโครงงานสหกิจ (Final Defense)',
    name: '',
    description: '',
    maxScore: 20
  });

  // ---------------------------------------------------------------------------
  // 2. EXAMINATION ROOMS STATE (Room as primary unit)
  // ---------------------------------------------------------------------------
  const [rooms, setRooms] = useState<ExaminationRoom[]>([
    {
      id: 'ROOM-401',
      roomNumber: 'ห้อง 401',
      building: 'อาคาร 78 ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
      date: '2026-09-22',
      sessionTime: '09:00 - 12:00',
      committee: [
        { id: 'ADV01', name: 'ดร.สมชาย ศรีสุวรรณ', role: 'ประธานกรรมการสอบ (Chair)' },
        { id: 'ADV02', name: 'ดร.วิทวัส จันทร์ทราภิรักษ์', role: 'กรรมการผู้ทรงคุณวุฒิ' },
        { id: 'ADV03', name: 'ผศ.ดร. ธีรเดช กิตติศักดิ์', role: 'กรรมการที่ปรึกษา' }
      ],
      studentIds: ['STU001', 'STU002']
    },
    {
      id: 'ROOM-402',
      roomNumber: 'ห้อง 402',
      building: 'อาคาร 78 ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
      date: '2026-09-22',
      sessionTime: '09:00 - 12:00',
      committee: [
        { id: 'ADV04', name: 'รศ.ดร. สุภาวดี สถิตย์', role: 'ประธานกรรมการสอบ (Chair)' },
        { id: 'ADV02', name: 'ดร.วิทวัส จันทร์ทราภิรักษ์', role: 'กรรมการที่ปรึกษา' }
      ],
      studentIds: ['STU003', 'STU004']
    }
  ]);

  const [editingRoom, setEditingRoom] = useState<ExaminationRoom | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [managingRoomMembers, setManagingRoomMembers] = useState<ExaminationRoom | null>(null);
  const [roomForm, setRoomForm] = useState<Omit<ExaminationRoom, 'id' | 'committee' | 'studentIds'>>({
    roomNumber: '',
    building: 'อาคาร 78 ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
    date: '2026-09-22',
    sessionTime: '09:00 - 12:00'
  });

  // ---------------------------------------------------------------------------
  // 3. PRESENTATION SCHEDULE STATE
  // ---------------------------------------------------------------------------
  const [selectedScheduleRoomId, setSelectedScheduleRoomId] = useState<string>('ROOM-401');
  const [defaultDurationMinutes, setDefaultDurationMinutes] = useState<number>(15);
  const [presentationSlots, setPresentationSlots] = useState<PresentationSlot[]>([
    {
      id: 'SLOT-01',
      roomId: 'ROOM-401',
      studentId: 'STU001',
      studentName: 'กษิดิศ พรหมศร',
      topic: 'ระบบจัดการวงจรชีวิตข้อมูลขนาดใหญ่และ Streaming Pipeline ด้วย Kafka และ Go',
      startTime: '09:00',
      endTime: '09:15',
      order: 1
    },
    {
      id: 'SLOT-02',
      roomId: 'ROOM-401',
      studentId: 'STU002',
      studentName: 'นริศรา สุวรรณโชติ',
      topic: 'สถาปัตยกรรมคลาวด์เนทีฟอัตโนมัติบน Kubernetes ด้วย Terraform และ GitOps',
      startTime: '09:15',
      endTime: '09:30',
      order: 2
    },
    {
      id: 'SLOT-03',
      roomId: 'ROOM-402',
      studentId: 'STU003',
      studentName: 'ชวัลวิทย์ เตชะวณิช',
      topic: 'โมเดลตรวจจับความผิดปกติในเครือข่ายความเร็วสูงด้วย Machine Learning',
      startTime: '09:00',
      endTime: '09:15',
      order: 1
    },
    {
      id: 'SLOT-04',
      roomId: 'ROOM-402',
      studentId: 'STU004',
      studentName: 'พิมพ์ชนก รัตนกุล',
      topic: 'แพลตฟอร์มวิเคราะห์พฤติกรรมผู้บริโภคด้วย Microservices และ Next.js',
      startTime: '09:15',
      endTime: '09:30',
      order: 2
    }
  ]);

  const [editingSlot, setEditingSlot] = useState<PresentationSlot | null>(null);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [slotForm, setSlotForm] = useState<Omit<PresentationSlot, 'id' | 'roomId' | 'order'>>({
    studentId: '',
    studentName: '',
    topic: '',
    startTime: '09:30',
    endTime: '09:45'
  });

  // Available advisers for committee
  const availableAdvisers = [
    { id: 'ADV01', name: 'ดร.สมชาย ศรีสุวรรณ', defaultRole: 'ประธานกรรมการสอบ (Chair)' },
    { id: 'ADV02', name: 'ดร.วิทวัส จันทร์ทราภิรักษ์', defaultRole: 'กรรมการผู้ทรงคุณวุฒิ' },
    { id: 'ADV03', name: 'ผศ.ดร. ธีรเดช กิตติศักดิ์', defaultRole: 'กรรมการที่ปรึกษา' },
    { id: 'ADV04', name: 'รศ.ดร. สุภาวดี สถิตย์', defaultRole: 'ประธานกรรมการสอบ (Chair)' }
  ];

  // ==========================================
  // HANDLERS: CRITERIA
  // ==========================================
  const handleSaveCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCriterion) {
      setCriteria(criteria.map(c => c.id === editingCriterion.id ? editingCriterion : c));
      setEditingCriterion(null);
      onNotify?.(isThai ? 'แก้ไขเกณฑ์การให้คะแนนสำเร็จ' : 'Updated score criterion!', 'success');
    } else {
      const newCrit: ScoreCriterion = {
        id: `CRIT-${Date.now().toString().slice(-4)}`,
        ...criterionForm
      };
      setCriteria([...criteria, newCrit]);
      setIsAddingCriterion(false);
      setCriterionForm({
        round: 'รอบสอบปากเปล่าโครงงานสหกิจ (Final Defense)',
        name: '',
        description: '',
        maxScore: 20
      });
      onNotify?.(isThai ? 'เพิ่มเกณฑ์การให้คะแนนใหม่สำเร็จ' : 'Added new score criterion!', 'success');
    }
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    onNotify?.(isThai ? 'ลบเกณฑ์การให้คะแนนเรียบร้อยแล้ว' : 'Deleted criterion.', 'info');
  };

  // ==========================================
  // HANDLERS: ROOMS
  // ==========================================
  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r));
      setEditingRoom(null);
      onNotify?.(isThai ? 'แก้ไขข้อมูลห้องสอบสำเร็จ' : 'Updated examination room!', 'success');
    } else {
      const newRoom: ExaminationRoom = {
        id: `ROOM-${Date.now().toString().slice(-4)}`,
        ...roomForm,
        committee: [],
        studentIds: []
      };
      setRooms([...rooms, newRoom]);
      setIsAddingRoom(false);
      setRoomForm({
        roomNumber: '',
        building: 'อาคาร 78 ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
        date: '2026-09-22',
        sessionTime: '09:00 - 12:00'
      });
      onNotify?.(isThai ? 'เพิ่มห้องสอบใหม่สำเร็จ' : 'Added examination room!', 'success');
    }
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
    setPresentationSlots(presentationSlots.filter(s => s.roomId !== id));
    onNotify?.(isThai ? 'ลบห้องสอบเรียบร้อยแล้ว' : 'Deleted examination room.', 'info');
  };

  // Assign Committee to Room
  const handleToggleCommitteeMember = (roomId: string, adviserId: string) => {
    const adv = availableAdvisers.find(a => a.id === adviserId);
    if (!adv) return;

    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        const exists = r.committee.some(c => c.id === adviserId);
        if (exists) {
          return { ...r, committee: r.committee.filter(c => c.id !== adviserId) };
        } else {
          return {
            ...r,
            committee: [...r.committee, { id: adv.id, name: adv.name, role: adv.defaultRole }]
          };
        }
      }
      return r;
    }));
  };

  // Assign Student to Room
  const handleToggleStudentInRoom = (roomId: string, studentId: string) => {
    setRooms(rooms.map(r => {
      if (r.id === roomId) {
        const exists = r.studentIds.includes(studentId);
        if (exists) {
          return { ...r, studentIds: r.studentIds.filter(id => id !== studentId) };
        } else {
          return { ...r, studentIds: [...r.studentIds, studentId] };
        }
      }
      return r;
    }));
  };

  // ==========================================
  // HANDLERS: PRESENTATION SCHEDULE
  // ==========================================
  const currentRoomSlots = presentationSlots
    .filter(s => s.roomId === selectedScheduleRoomId)
    .sort((a, b) => a.order - b.order);

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlot) {
      setPresentationSlots(presentationSlots.map(s => s.id === editingSlot.id ? editingSlot : s));
      setEditingSlot(null);
      onNotify?.(isThai ? 'แก้ไขลำดับการนำเสนอสำเร็จ' : 'Updated presentation slot!', 'success');
    } else {
      const selectedStudent = students.find(st => st.id === slotForm.studentId);
      const newSlot: PresentationSlot = {
        id: `SLOT-${Date.now().toString().slice(-4)}`,
        roomId: selectedScheduleRoomId,
        studentId: slotForm.studentId,
        studentName: selectedStudent ? selectedStudent.name : slotForm.studentName,
        topic: slotForm.topic,
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
        order: currentRoomSlots.length + 1
      };
      setPresentationSlots([...presentationSlots, newSlot]);
      setIsAddingSlot(false);
      setSlotForm({
        studentId: '',
        studentName: '',
        topic: '',
        startTime: '09:30',
        endTime: '09:45'
      });
      onNotify?.(isThai ? 'เพิ่มคิวนำเสนอเรียบร้อย' : 'Added presentation slot!', 'success');
    }
  };

  const handleDeleteSlot = (slotId: string) => {
    setPresentationSlots(presentationSlots.filter(s => s.id !== slotId));
    onNotify?.(isThai ? 'ลบคิวนำเสนอแล้ว' : 'Removed presentation slot.', 'info');
  };

  const handleMoveOrder = (slotId: string, direction: 'up' | 'down') => {
    const slots = [...currentRoomSlots];
    const index = slots.findIndex(s => s.id === slotId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = slots[index].order;
      slots[index].order = slots[index - 1].order;
      slots[index - 1].order = temp;
    } else if (direction === 'down' && index < slots.length - 1) {
      const temp = slots[index].order;
      slots[index].order = slots[index + 1].order;
      slots[index + 1].order = temp;
    }

    setPresentationSlots(presentationSlots.map(s => {
      const updated = slots.find(item => item.id === s.id);
      return updated || s;
    }));
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-150">
      
      {/* Sub-Navigation: 3 REQUIRED SECTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Sub-tab 1: Score Criteria */}
          <button
            onClick={() => setActiveSubTab('criteria')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'criteria'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>{isThai ? 'Score Criteria (เกณฑ์การให้คะแนน)' : 'Score Criteria'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {criteria.length}
            </span>
          </button>

          {/* Sub-tab 2: Examination Rooms */}
          <button
            onClick={() => setActiveSubTab('rooms')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'rooms'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{isThai ? 'Examination Rooms (ห้องสอบและกรรมการ)' : 'Examination Rooms'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {rooms.length}
            </span>
          </button>

          {/* Sub-tab 3: Presentation Schedule */}
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'schedule'
                ? 'bg-[#6B122C] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{isThai ? 'Presentation Schedule (ตารางนำเสนอ)' : 'Presentation Schedule'}</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">
              {presentationSlots.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. SCORE CRITERIA SUB-SECTION                             */}
      {/* ========================================================= */}
      {activeSubTab === 'criteria' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'เกณฑ์การให้คะแนนการสอบปากเปล่าสหกิจศึกษา (Configurable Score Criteria)' : 'Defense Score Criteria'}
              </h3>
              <p className="text-xs text-slate-500">
                {isThai ? 'เจ้าหน้าที่สามารถ กำหนด/เพิ่ม/แก้ไข/ลบ เกณฑ์คะแนนตามรอบการสอบได้' : 'Staff can view, add, edit, and delete criteria for each round.'}
              </p>
            </div>
            <button
              onClick={() => setIsAddingCriterion(true)}
              className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{isThai ? 'เพิ่มเกณฑ์คะแนน' : 'Add Criterion'}</span>
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">{isThai ? 'รอบการสอบ' : 'Round'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'หัวข้อเกณฑ์การประเมิน' : 'Criterion Name'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'คำอธิบายเกณฑ์' : 'Description'}</th>
                    <th className="py-3.5 px-4 text-center">{isThai ? 'คะแนนเต็ม' : 'Max Score'}</th>
                    <th className="py-3.5 px-4 text-right">{isThai ? 'การจัดการ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {criteria.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {c.round}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-md">
                        {c.description}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs font-mono">
                          {c.maxScore}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingCriterion(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                            title={isThai ? 'แก้ไขเกณฑ์' : 'Edit'}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCriterion(c.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                            title={isThai ? 'ลบเกณฑ์' : 'Delete'}
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

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {isThai ? 'คะแนนเต็มรวมทั้งหมดของเกณฑ์:' : 'Total Max Score Sum:'}
              </span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                {criteria.reduce((sum, c) => sum + c.maxScore, 0)} คะแนน
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. EXAMINATION ROOMS SUB-SECTION (Room as Primary Unit)   */}
      {/* ========================================================= */}
      {activeSubTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'ห้องสอบและคณะกรรมการ (Examination Rooms as Primary Unit)' : 'Examination Rooms'}
              </h3>
              <p className="text-xs text-slate-500">
                {isThai 
                  ? 'ห้องสอบ 1 ห้องเป็นโครงสร้างหลัก บรรจุวัน-เวลา-สถานที่ คณะกรรมการ (หลายท่าน) และนักศึกษาที่จะสอบในห้องนั้น' 
                  : 'Room is the primary unit holding date, time, location, multiple committee advisers, and examined students.'}
              </p>
            </div>
            <button
              onClick={() => setIsAddingRoom(true)}
              className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{isThai ? 'เพิ่มห้องสอบใหม่' : 'Add Room'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {rooms.map((room) => {
              const assignedStudents = students.filter(s => room.studentIds.includes(s.id));

              return (
                <div 
                  key={room.id}
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4 text-left"
                >
                  {/* Room Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#6B122C]" />
                        <h4 className="text-sm font-bold text-slate-900">{room.roomNumber}</h4>
                        <span className="text-[10px] font-mono text-slate-400">({room.id})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{room.building}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingRoom(room)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                        title={isThai ? 'แก้ไขข้อมูลห้อง' : 'Edit Room'}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title={isThai ? 'ลบห้องสอบ' : 'Delete Room'}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Date and Session Time */}
                  <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block uppercase">
                        {isThai ? 'วันที่สอบ' : 'Exam Date'}
                      </span>
                      <strong className="text-slate-800 font-mono">{room.date}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block uppercase">
                        {isThai ? 'ช่วงเวลาสอบ' : 'Session Time'}
                      </span>
                      <strong className="text-slate-800 font-mono">{room.sessionTime}</strong>
                    </div>
                  </div>

                  {/* Committee Members */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        {isThai ? 'คณะกรรมการสอบในห้องนี้' : 'Committee Members'} ({room.committee.length})
                      </span>
                      <button
                        onClick={() => setManagingRoomMembers(room)}
                        className="text-[11px] font-bold text-[#6B122C] hover:underline cursor-pointer"
                      >
                        {isThai ? 'จัดการกรรมการ/นศ.' : 'Manage Members'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {room.committee.length === 0 ? (
                        <p className="text-xs text-amber-600 italic">
                          {isThai ? '— ยังไม่ได้มอบหมายคณะกรรมการ —' : '— No committee assigned —'}
                        </p>
                      ) : (
                        room.committee.map(c => (
                          <div key={c.id} className="p-2 bg-slate-50/80 rounded-lg flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800">{c.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                              {c.role}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Students in Room */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        {isThai ? 'นักศึกษาที่สอบห้องนี้' : 'Examined Students'} ({assignedStudents.length})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {assignedStudents.length} {isThai ? 'คน' : 'students'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {assignedStudents.length === 0 ? (
                        <p className="text-xs text-amber-600 italic">
                          {isThai ? '— ยังไม่มีนักศึกษาในห้องนี้ —' : '— No students in this room —'}
                        </p>
                      ) : (
                        assignedStudents.map(st => (
                          <span 
                            key={st.id} 
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium flex items-center gap-1.5"
                          >
                            <span>{st.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono">({st.id})</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PRESENTATION SCHEDULE SUB-SECTION                      */}
      {/* ========================================================= */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isThai ? 'ตารางเวลาและลำดับการนำเสนอ (Presentation Schedule per Room)' : 'Presentation Schedule'}
              </h3>
              <p className="text-xs text-slate-500">
                {isThai 
                  ? 'กำหนดเวลาสอบเฉพาะของนักศึกษาแต่ละคน (เช่น 10-15 นาที/คน) เรียงลำดับคิว และระบุหัวข้อสอบ' 
                  : 'Configure individual student presentation slots, timings, order, and topics per room.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedScheduleRoomId}
                onChange={(e) => setSelectedScheduleRoomId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:outline-none focus:border-[#6B122C]"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.roomNumber} ({r.date} {r.sessionTime})
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsAddingSlot(true)}
                className="px-3 py-1.5 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer flex items-center gap-1 shadow-xs shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{isThai ? 'เพิ่มคิวนำเสนอ' : 'Add Slot'}</span>
              </button>
            </div>
          </div>

          {/* Current Room Info Banner */}
          {(() => {
            const currentRoom = rooms.find(r => r.id === selectedScheduleRoomId);
            if (!currentRoom) return null;

            return (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 block text-sm">
                    {currentRoom.roomNumber} — {currentRoom.building}
                  </span>
                  <span className="text-slate-500">
                    {isThai ? 'กรรมการสอบ:' : 'Committee:'} {currentRoom.committee.map(c => c.name).join(' • ') || (isThai ? 'ยังไม่มีกรรมการ' : 'None')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{isThai ? 'ระยะเวลานำเสนอมาตรฐาน:' : 'Default slot duration:'}</span>
                  <input
                    type="number"
                    value={defaultDurationMinutes}
                    onChange={(e) => setDefaultDurationMinutes(Number(e.target.value))}
                    className="w-16 p-1 bg-white border border-slate-200 rounded-lg text-center font-mono font-bold"
                  />
                  <span>{isThai ? 'นาที' : 'min'}</span>
                </div>
              </div>
            );
          })()}

          {/* Schedule Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 text-center w-16">{isThai ? 'ลำดับ' : 'Order'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'ช่วงเวลาสอบ' : 'Time Slot'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'นักศึกษา' : 'Student'}</th>
                    <th className="py-3.5 px-4">{isThai ? 'หัวข้อโครงงานสหกิจ' : 'Topic'}</th>
                    <th className="py-3.5 px-4 text-right">{isThai ? 'การจัดการ' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRoomSlots.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                        {isThai ? 'ยังไม่มีคิวนำเสนอในห้องนี้ กรุณากด "เพิ่มคิวนำเสนอ"' : 'No presentation slots scheduled for this room yet.'}
                      </td>
                    </tr>
                  ) : (
                    currentRoomSlots.map((slot, index) => (
                      <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 text-center">
                          <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 font-bold font-mono inline-flex items-center justify-center text-xs">
                            {slot.order}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{slot.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{slot.studentId}</div>
                        </td>

                        <td className="py-3.5 px-4 max-w-md">
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {slot.topic}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleMoveOrder(slot.id, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title={isThai ? 'เลื่อนขึ้น' : 'Move Up'}
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveOrder(slot.id, 'down')}
                              disabled={index === currentRoomSlots.length - 1}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title={isThai ? 'เลื่อนลง' : 'Move Down'}
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingSlot(slot)}
                              className="p-1 rounded text-slate-500 hover:text-slate-800 cursor-pointer"
                              title={isThai ? 'แก้ไขเวลา/หัวข้อ' : 'Edit'}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="p-1 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                              title={isThai ? 'ลบคิว' : 'Delete'}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT SCORE CRITERION                         */}
      {/* ========================================================= */}
      {(isAddingCriterion || editingCriterion) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCriterion 
                  ? (isThai ? 'แก้ไขเกณฑ์การให้คะแนน' : 'Edit Score Criterion')
                  : (isThai ? 'เพิ่มเกณฑ์การให้คะแนนใหม่' : 'Add New Score Criterion')}
              </h3>
              <button onClick={() => { setIsAddingCriterion(false); setEditingCriterion(null); }} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCriterion} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'รอบการสอบ' : 'Examination Round'}
                </label>
                <input
                  type="text"
                  required
                  value={editingCriterion ? editingCriterion.round : criterionForm.round}
                  onChange={(e) => {
                    if (editingCriterion) setEditingCriterion({ ...editingCriterion, round: e.target.value });
                    else setCriterionForm({ ...criterionForm, round: e.target.value });
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'ชื่อเกณฑ์การประเมิน *' : 'Criterion Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={editingCriterion ? editingCriterion.name : criterionForm.name}
                  onChange={(e) => {
                    if (editingCriterion) setEditingCriterion({ ...editingCriterion, name: e.target.value });
                    else setCriterionForm({ ...criterionForm, name: e.target.value });
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'คำอธิบายเกณฑ์' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={editingCriterion ? editingCriterion.description : criterionForm.description}
                  onChange={(e) => {
                    if (editingCriterion) setEditingCriterion({ ...editingCriterion, description: e.target.value });
                    else setCriterionForm({ ...criterionForm, description: e.target.value });
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'คะแนนเต็ม (Max Score) *' : 'Maximum Score *'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={editingCriterion ? editingCriterion.maxScore : criterionForm.maxScore}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (editingCriterion) setEditingCriterion({ ...editingCriterion, maxScore: val });
                    else setCriterionForm({ ...criterionForm, maxScore: val });
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddingCriterion(false); setEditingCriterion(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer"
                >
                  {isThai ? 'บันทึกเกณฑ์' : 'Save Criterion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT ROOM                                    */}
      {/* ========================================================= */}
      {(isAddingRoom || editingRoom) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingRoom 
                  ? (isThai ? 'แก้ไขข้อมูลห้องสอบ' : 'Edit Examination Room')
                  : (isThai ? 'เพิ่มห้องสอบใหม่' : 'Add Examination Room')}
              </h3>
              <button onClick={() => { setIsAddingRoom(false); setEditingRoom(null); }} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'หมายเลขห้องสอบ *' : 'Room Number *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ห้อง 401, ห้อง 502"
                  value={editingRoom ? editingRoom.roomNumber : roomForm.roomNumber}
                  onChange={(e) => {
                    if (editingRoom) setEditingRoom({ ...editingRoom, roomNumber: e.target.value });
                    else setRoomForm({ ...roomForm, roomNumber: e.target.value });
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'อาคาร / สถานที่สอบ *' : 'Building / Location *'}
                </label>
                <input
                  type="text"
                  required
                  value={editingRoom ? editingRoom.building : roomForm.building}
                  onChange={(e) => {
                    if (editingRoom) setEditingRoom({ ...editingRoom, building: e.target.value });
                    else setRoomForm({ ...roomForm, building: e.target.value });
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'วันที่สอบ *' : 'Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={editingRoom ? editingRoom.date : roomForm.date}
                    onChange={(e) => {
                      if (editingRoom) setEditingRoom({ ...editingRoom, date: e.target.value });
                      else setRoomForm({ ...roomForm, date: e.target.value });
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'ช่วงเวลาสอบ *' : 'Session Time *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="09:00 - 12:00"
                    value={editingRoom ? editingRoom.sessionTime : roomForm.sessionTime}
                    onChange={(e) => {
                      if (editingRoom) setEditingRoom({ ...editingRoom, sessionTime: e.target.value });
                      else setRoomForm({ ...roomForm, sessionTime: e.target.value });
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddingRoom(false); setEditingRoom(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer"
                >
                  {isThai ? 'บันทึกห้องสอบ' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MANAGE ROOM COMMITTEE AND STUDENTS                 */}
      {/* ========================================================= */}
      {managingRoomMembers && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isThai ? `จัดการกรรมการและนักศึกษา — ${managingRoomMembers.roomNumber}` : `Manage Members — ${managingRoomMembers.roomNumber}`}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {managingRoomMembers.date} ({managingRoomMembers.sessionTime})
                </p>
              </div>
              <button onClick={() => setManagingRoomMembers(null)} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Committee Section */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                {isThai ? 'มอบหมายอาจารย์ / คณะกรรมการสอบในห้องนี้' : 'Assign Committee Members'}
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableAdvisers.map(adv => {
                  const roomInstance = rooms.find(r => r.id === managingRoomMembers.id);
                  const isAssigned = roomInstance?.committee.some(c => c.id === adv.id);

                  return (
                    <div 
                      key={adv.id}
                      onClick={() => handleToggleCommitteeMember(managingRoomMembers.id, adv.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isAssigned 
                          ? 'bg-[#6B122C]/5 border-[#6B122C]/40 text-[#6B122C] font-semibold' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>{adv.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{adv.defaultRole}</span>
                        <input
                          type="checkbox"
                          checked={!!isAssigned}
                          readOnly
                          className="accent-[#6B122C]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Students Section */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800">
                {isThai ? 'จัดสรรนักศึกษาเข้าสอบในห้องนี้' : 'Assign Students to Room'}
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {students.map(st => {
                  const roomInstance = rooms.find(r => r.id === managingRoomMembers.id);
                  const isAssigned = roomInstance?.studentIds.includes(st.id);

                  return (
                    <div 
                      key={st.id}
                      onClick={() => handleToggleStudentInRoom(managingRoomMembers.id, st.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isAssigned 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="block">{st.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {st.id} • {st.major}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!isAssigned}
                        readOnly
                        className="accent-emerald-700"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setManagingRoomMembers(null)}
                className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer"
              >
                {isThai ? 'เสร็จสิ้น' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRESENTATION SLOT                       */}
      {/* ========================================================= */}
      {(isAddingSlot || editingSlot) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingSlot 
                  ? (isThai ? 'แก้ไขช่วงเวลานำเสนอ' : 'Edit Presentation Slot')
                  : (isThai ? 'เพิ่มคิวนำเสนอในห้องสอบ' : 'Add Presentation Slot')}
              </h3>
              <button onClick={() => { setIsAddingSlot(false); setEditingSlot(null); }} className="p-1 hover:bg-slate-50 text-slate-400 rounded-lg cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'เลือกนักศึกษา *' : 'Select Student *'}
                </label>
                {editingSlot ? (
                  <input
                    type="text"
                    disabled
                    value={`${editingSlot.studentName} (${editingSlot.studentId})`}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600"
                  />
                ) : (
                  <select
                    required
                    value={slotForm.studentId}
                    onChange={(e) => setSlotForm({ ...slotForm, studentId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  >
                    <option value="">{isThai ? '-- เลือกนักศึกษา --' : '-- Choose Student --'}</option>
                    {students.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.id})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isThai ? 'หัวข้อโครงงานสหกิจ *' : 'Presentation Topic *'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={editingSlot ? editingSlot.topic : slotForm.topic}
                  onChange={(e) => {
                    if (editingSlot) setEditingSlot({ ...editingSlot, topic: e.target.value });
                    else setSlotForm({ ...slotForm, topic: e.target.value });
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'เวลาเริ่ม *' : 'Start Time *'}
                  </label>
                  <input
                    type="time"
                    required
                    value={editingSlot ? editingSlot.startTime : slotForm.startTime}
                    onChange={(e) => {
                      if (editingSlot) setEditingSlot({ ...editingSlot, startTime: e.target.value });
                      else setSlotForm({ ...slotForm, startTime: e.target.value });
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isThai ? 'เวลาสิ้นสุด *' : 'End Time *'}
                  </label>
                  <input
                    type="time"
                    required
                    value={editingSlot ? editingSlot.endTime : slotForm.endTime}
                    onChange={(e) => {
                      if (editingSlot) setEditingSlot({ ...editingSlot, endTime: e.target.value });
                      else setSlotForm({ ...slotForm, endTime: e.target.value });
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6B122C]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddingSlot(false); setEditingSlot(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  {isThai ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B122C] text-white rounded-xl text-xs font-bold hover:bg-[#520d21] cursor-pointer"
                >
                  {isThai ? 'บันทึกคิว' : 'Save Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
