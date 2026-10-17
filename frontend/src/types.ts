export type Role =
  | 'guest'
  | 'login'
  | 'student'
  | 'advisor'
  | 'mentor'
  | 'staff'
  | 'design-system';

// ---- Position ----
export interface Position {
  id: string;
  title: string;
  titleTh?: string;
  slots: number;
  filled: number;
  salary: string;
  salaryTh?: string;
  description: string;
  descriptionTh?: string;
  requirements: string[];
  requirementsTh?: string[];
  status: 'open' | 'closed';
}

// ---- Company ----
export interface Company {
  id: string;
  name: string;
  industry: string;
  industryTh?: string;
  location: string;
  locationTh?: string;
  rating: number;
  description: string;
  descriptionTh?: string;
  logoColor: string;
  positions: Position[];
  mouStatus?: 'Active' | 'Expired' | 'Pending';
}

// ---- Student ----
export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  academicYear: string;
  gpa: number;
  skills: string[];
  companyId?: string;
  progress: number;
  status: 'Confirmed' | 'Pending' | 'Rejected' | 'Not Placed' | 'Approved' | 'Placed';
  programType: 'Regular' | 'Special' | 'Bilingual'; // ปกติ | สมทบ | สองภาษา
  resumeUrl?: string;
  advisorId?: string;
  mentorId?: string;
  advisorName?: string;
  mentorName?: string;
  internshipPeriod?: { startDate: string; endDate: string };
}

// ---- Weekly Report ----
export interface WeeklyReport {
  id: string;
  studentId: string;
  studentName?: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  summary: string;
  achievements?: string;
  obstacles?: string;
  hoursWorked: number;
  status: 'Pending' | 'Approved' | 'Requires Edit';
  advisorComment?: string;
  supervisorComment?: string;
  submittedAt: string;
}

// ---- Timesheet ----
export interface Timesheet {
  id: string;
  studentId: string;
  studentName?: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  hoursWorked: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  fileName?: string;
  approvedBy?: string;
  submittedAt: string;
}

// ---- Document ----
export interface Document {
  id: string;
  name: string;
  category: 'Agreement' | 'Report' | 'Evaluation' | 'Resume';
  status: 'Approved' | 'Submitted' | 'Action Required' | 'Missing';
  studentId?: string;
  studentName?: string;
  uploadedAt?: string;
  fileSize?: string;
  feedback?: string;
  fileName?: string;
}

// ---- ExaminationInfo ----
export interface ExaminationInfo {
  date: string;
  time: string;
  room: string;
  chair: string;
  committee: string[];
  checkedIn: boolean;
  scoreCriteria?: { name: string; maxScore: number }[];
  materials?: string[];
}

// ---- AdvisorInfo ----
export interface AdvisorInfo {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  credentials: string;
  assignedStudentIds: string[];
  visitCountRound1?: boolean;
  visitCountRound2?: boolean;
}

// ---- MentorInfo ----
export interface MentorInfo {
  id: string;
  name: string;
  email: string;
  company: string;
  companyId: string;
  role: string;
  assignedStudentIds: string[];
}

// ---- CoopTimelineStage ----
export interface CoopTimelineStage {
  id: string;
  stepNumber: number;
  title: string;
  titleTh: string;
  dateRange: string;
  status: 'completed' | 'current' | 'upcoming';
  desc: string;
  descTh: string;
}

// Initial Mock Data

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'STU001',
    name: 'กษิดิศ พรหมศร (Kasidis Phromsorn)',
    email: 'kasidis.p@university.edu',
    major: 'ระบบสารสนเทศคอมพิวเตอร์ (CIS)',
    academicYear: 'ปีการศึกษา 2569 (ชั้นปีที่ 4)',
    gpa: 3.82,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    companyId: 'COMP01',
    progress: 75,
    status: 'Confirmed',
    programType: 'Regular',
    resumeUrl: 'Resume_Kasidis_Phromsorn_2026.pdf',
    advisorId: 'ADV001',
    mentorId: 'MEN001',
    internshipPeriod: { startDate: '2026-06-01', endDate: '2026-09-18' }
  },
  {
    id: 'STU002',
    name: 'ณัฐภัทร กิตติสุคนธ์ (Natapat Kittisukhon)',
    email: 'natapat.k@university.edu',
    major: 'วิศวกรรมซอฟต์แวร์ (SE)',
    academicYear: 'ปีการศึกษา 2569 (ชั้นปีที่ 4)',
    gpa: 3.65,
    skills: ['Java', 'Spring Boot', 'Docker', 'Kubernetes'],
    companyId: 'COMP02',
    progress: 40,
    status: 'Confirmed',
    programType: 'Special',
    resumeUrl: 'Resume_Natapat_K_2026.pdf',
    advisorId: 'ADV001',
    mentorId: 'MEN002'
  },
  {
    id: 'STU003',
    name: 'วรภพ รัตนโชติ (Vorapop Rattanachote)',
    email: 'vorapop.r@university.edu',
    major: 'เทคโนโลยีสารสนเทศ (IT)',
    academicYear: 'ปีการศึกษา 2569 (ชั้นปีที่ 4)',
    gpa: 3.45,
    skills: ['Python', 'FastAPI', 'Machine Learning', 'SQL'],
    companyId: 'COMP01',
    progress: 60,
    status: 'Confirmed',
    programType: 'Bilingual',
    resumeUrl: 'Resume_Vorapop_R_2026.pdf',
    advisorId: 'ADV002',
    mentorId: 'MEN001'
  },
  {
    id: 'STU004',
    name: 'พิชญุตม์ ธนะสัมบูรณ์ (Pichayut Thanasomboon)',
    email: 'pichayut.t@university.edu',
    major: 'ระบบสารสนเทศคอมพิวเตอร์ (CIS)',
    academicYear: 'ปีการศึกษา 2569 (ชั้นปีที่ 4)',
    gpa: 3.12,
    skills: ['HTML5', 'CSS3', 'Vue.js', 'Figma'],
    companyId: undefined,
    progress: 10,
    status: 'Not Placed',
    programType: 'Regular',
    resumeUrl: 'Resume_Pichayut_T_Draft.pdf',
    advisorId: 'ADV002'
  }
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'COMP01',
    name: 'NexaTech Solutions Co., Ltd.',
    industry: 'Enterprise Software & Cloud Architecture',
    industryTh: 'ซอฟต์แวร์ระดับองค์กรและคลาวด์',
    location: 'Bangkok (Silom / BTS Chong Nonsi)',
    locationTh: 'กรุงเทพมหานคร (สีลม / BTS ช่องนนทรี)',
    rating: 4.9,
    description: 'Leading provider of enterprise cloud-native applications, real-time analytics platforms, and microservice engineering for financial institutions.',
    descriptionTh: 'ผู้นำด้านการพัฒนาแอปพลิเคชันระดับองค์กรบนคลาวด์ แพลตฟอร์มการวิเคราะห์ข้อมูลแบบเรียลไทม์ และสถาปัตยกรรมไมโครเซอร์วิสสำหรับสถาบันการเงิน',
    logoColor: 'from-blue-700 to-indigo-800',
    positions: [
      {
        id: 'POS01',
        title: 'Frontend Developer Intern (React/TypeScript)',
        titleTh: 'นักศึกษาฝึกงานพัฒนาฟรอนต์เอนด์ (React/TypeScript)',
        slots: 2,
        filled: 2,
        salary: '600 THB/day allowance',
        salaryTh: '600 บาท/วัน (มีเบี้ยเลี้ยง)',
        description: 'Collaborate with senior software architects to implement performant, design-system-compliant responsive dashboards.',
        descriptionTh: 'ร่วมงานกับทีมวิศวกรซอฟต์แวร์อาวุโสในการพัฒนาแดชบอร์ดความเร็วสูงที่ตอบสนองทุกอุปกรณ์ตามระบบการออกแบบ',
        requirements: [
          'Solid understanding of React 18+ and TypeScript',
          'Familiarity with Tailwind CSS and state management',
          'Git version control proficiency'
        ],
        requirementsTh: [
          'เข้าใจ React 18+ และ TypeScript เป็นอย่างดี',
          'คุ้นเคยกับ Tailwind CSS และการจัดการสถานะ',
          'ใช้ Git คล่องแคล่ว'
        ],
        status: 'open'
      },
      {
        id: 'POS02',
        title: 'Full Stack Engineer Intern (Node.js/PostgreSQL)',
        titleTh: 'นักศึกษาฝึกงานวิศวกรฟูลสแต็ก (Node.js/PostgreSQL)',
        slots: 1,
        filled: 1,
        salary: '650 THB/day allowance',
        salaryTh: '650 บาท/วัน (มีเบี้ยเลี้ยง)',
        description: 'Design robust RESTful APIs, manage schema migrations in PostgreSQL, and build background workers.',
        descriptionTh: 'ออกแบบ RESTful API จัดการโครงสร้างฐานข้อมูล PostgreSQL และพัฒนาระบบ Background Worker',
        requirements: [
          'Node.js/Express or NestJS experience',
          'Relational database SQL indexing skills'
        ],
        requirementsTh: [
          'มีประสบการณ์ Node.js/Express หรือ NestJS',
          'มีความรู้ด้านฐานข้อมูลเชิงสัมพันธ์และ SQL'
        ],
        status: 'closed'
      }
    ]
  },
  {
    id: 'COMP02',
    name: 'Linear Digital Innovations',
    industry: 'Financial Technology (FinTech)',
    industryTh: 'เทคโนโลยีทางการเงิน (FinTech)',
    location: 'Bangkok (Sathorn / MRT Lumphini)',
    locationTh: 'กรุงเทพมหานคร (สาทร / MRT ลุมพินี)',
    rating: 4.8,
    description: 'Specialized in high-frequency transaction processing, payment gateways, and cryptographic ledger integrity.',
    descriptionTh: 'เชี่ยวชาญด้านการประมวลผลธุรกรรมความเร็วสูง เกตเวย์การชำระเงิน และระบบการจัดการความปลอดภัยทางดิจิทัล',
    logoColor: 'from-indigo-600 to-blue-800',
    positions: [
      {
        id: 'POS03',
        title: 'Backend Platform Engineer Intern',
        titleTh: 'นักศึกษาฝึกงานวิศวกรแพลตฟอร์มแบ็กเอนด์',
        slots: 2,
        filled: 1,
        salary: '700 THB/day allowance',
        salaryTh: '700 บาท/วัน (มีเบี้ยเลี้ยง)',
        description: 'Develop distributed service endpoints and integrate secure authentication protocols.',
        descriptionTh: 'พัฒนา Service Endpoint แบบกระจายศูนย์และเชื่อมต่อโปรโตคอลความปลอดภัยในการยืนยันตัวตน',
        requirements: [
          'Java, Go, or Node.js background',
          'Understanding of async event streams and queues'
        ],
        requirementsTh: [
          'มีความรู้พื้นฐาน Java, Go หรือ Node.js',
          'เข้าใจระบบ Event Stream และ Message Queue'
        ],
        status: 'open'
      }
    ]
  },
  {
    id: 'COMP03',
    name: 'Vortex Studio Labs',
    industry: 'Creative Tech & AI Solutions',
    industryTh: 'เทคโนโลยีสร้างสรรค์และปัญญาประดิษฐ์',
    location: 'Bangkok (Asok / BTS Asok)',
    locationTh: 'กรุงเทพมหานคร (อโศก / BTS อโศก)',
    rating: 4.7,
    description: 'Building next-generation generative AI interfaces, interactive data visualizations, and modern mobile tooling.',
    descriptionTh: 'พัฒนาอินเทอร์เฟซปัญญาประดิษฐ์ยุคใหม่ การสร้างภาพข้อมูลเชิงโต้ตอบ และเครื่องมือโมบายล์สมัยใหม่',
    logoColor: 'from-sky-600 to-blue-700',
    positions: [
      {
        id: 'POS04',
        title: 'AI Interface & Design Engineer Intern',
        titleTh: 'นักศึกษาฝึกงานออกแบบอินเทอร์เฟซและปัญญาประดิษฐ์',
        slots: 1,
        filled: 0,
        salary: '600 THB/day allowance',
        salaryTh: '600 บาท/วัน (มีเบี้ยเลี้ยง)',
        description: 'Prototype intelligent AI experiences, prompt engineering pipelines, and intuitive UI components.',
        descriptionTh: 'สร้างต้นแบบประสบการณ์การใช้งาน AI และออกแบบคอมโพเนนต์ UI ที่ใช้งานง่าย',
        requirements: [
          'Modern UI/UX prototyping skills',
          'Basic experience interacting with LLM APIs'
        ],
        requirementsTh: [
          'มีทักษะการสร้างต้นแบบ UI/UX',
          'มีประสบการณ์เชื่อมต่อ API ปัญญาประดิษฐ์'
        ],
        status: 'open'
      }
    ]
  }
];

export const MOCK_REPORTS: WeeklyReport[] = [
  {
    id: 'REP001',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    weekNumber: 1,
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    summary: 'Onboarding with the frontend engineering team. Configured local Docker development environment and reviewed codebase architecture.',
    achievements: 'Setup local workspace, completed security compliance training, merged first UI bugfix PR.',
    obstacles: 'Configuring SSO environment tokens took longer than anticipated.',
    hoursWorked: 40,
    status: 'Approved',
    advisorComment: 'Good start. Ensure you document your environment setup steps in your technical appendix.',
    supervisorComment: 'Quick learner, completed onboarding tasks ahead of schedule.',
    submittedAt: '2026-06-05T17:00:00Z'
  },
  {
    id: 'REP002',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    weekNumber: 2,
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    summary: 'Developed user profile management modal component and synchronized responsive styling across desktop and tablet views.',
    achievements: 'Created 4 reusable form components in Figma-to-React workflow.',
    obstacles: 'Handling edge cases in form validation required additional testing.',
    hoursWorked: 40,
    status: 'Approved',
    advisorComment: 'Well structured. Please remember to record user experience metrics.',
    submittedAt: '2026-06-12T17:00:00Z'
  },
  {
    id: 'REP003',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    weekNumber: 3,
    startDate: '2026-06-15',
    endDate: '2026-06-19',
    summary: 'Optimized rendering performance of the live transaction dashboard. Implemented virtualized list for data feeds exceeding 1,000 items.',
    achievements: 'Reduced initial render lag by 45% using useMemo and memoization hooks.',
    obstacles: 'Scroll sync between header and virtualized table rows.',
    hoursWorked: 40,
    status: 'Pending',
    submittedAt: '2026-06-19T17:00:00Z'
  }
];

export const MOCK_TIMESHEETS: Timesheet[] = [
  {
    id: 'TS001',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    weekNumber: 1,
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    hoursWorked: 40,
    status: 'Approved',
    fileName: 'timesheet_week_1_kasidis.pdf',
    approvedBy: 'Khun Somsak (Mentor Lead)',
    submittedAt: '2026-06-05T18:00:00Z'
  },
  {
    id: 'TS002',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    weekNumber: 2,
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    hoursWorked: 40,
    status: 'Approved',
    fileName: 'timesheet_week_2_kasidis.pdf',
    approvedBy: 'Khun Somsak (Mentor Lead)',
    submittedAt: '2026-06-12T18:00:00Z'
  },
  {
    id: 'TS003',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    weekNumber: 3,
    startDate: '2026-06-15',
    endDate: '2026-06-19',
    hoursWorked: 40,
    status: 'Pending',
    fileName: 'timesheet_week_3_kasidis.pdf',
    submittedAt: '2026-06-19T18:00:00Z'
  }
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'DOC01',
    name: 'ใบตอบรับการเข้าปฏิบัติงานสหกิจศึกษา (CWIE Acceptance Agreement)',
    category: 'Agreement',
    status: 'Approved',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    uploadedAt: '2026-05-18',
    fileSize: '2.4 MB',
    fileName: 'CWIE_Agreement_NexaTech_Signed.pdf'
  },
  {
    id: 'DOC02',
    name: 'หนังสือขอความอนุเคราะห์และส่งตัวนักศึกษา (University Endorsement Letter)',
    category: 'Agreement',
    status: 'Approved',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    uploadedAt: '2026-05-22',
    fileSize: '1.2 MB',
    fileName: 'University_Endorsement_STU001.pdf'
  },
  {
    id: 'DOC03',
    name: 'แบบฟอร์มประเมินผลกลางภาคสหกิจศึกษา (Midterm Evaluation Form)',
    category: 'Evaluation',
    status: 'Action Required',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    uploadedAt: '2026-07-20',
    fileSize: '850 KB',
    feedback: 'Mentor signature missing on page 3. Please re-upload with official stamp.',
    fileName: 'Midterm_Evaluation_Draft.pdf'
  },
  {
    id: 'DOC04',
    name: 'สไลด์นำเสนอการสอบปากเปล่าโครงงาน (Defense Slides)',
    category: 'Report',
    status: 'Submitted',
    studentId: 'STU001',
    studentName: 'กษิดิศ พรหมศร',
    uploadedAt: '2026-08-01',
    fileSize: '12.8 MB',
    fileName: 'Kasidis_Final_CWIE_Presentation.pdf'
  }
];

export const MOCK_EXAM: ExaminationInfo = {
  date: '2026-08-15',
  time: '10:00 - 11:30 น.',
  room: 'ห้อง 604 ศูนย์คอมพิวเตอร์ อาคารคณะวิทยาศาสตร์ประยุกต์',
  chair: 'ผศ.ดร.ชิดสุธา สุ่มเล็ก (Asst. Prof. Dr. Chitsutha Soomlek)',
  committee: [
    'ผศ.ดร.ชิดสุธา สุ่มเล็ก (ประธานกรรมการสอบ)',
    'ดร.สมชาย ศรีสุวรรณ (อาจารย์ที่ปรึกษาหลัก)',
    'ดร.วิทวัส จันทร์ทราภิรักษ์ (กรรมการผู้ทรงคุณวุฒิ)',
    'คุณสมศักดิ์ พิพัฒน์พัฒนา (ผู้แทนจากสถานประกอบการ / Mentor)'
  ],
  checkedIn: false,
  materials: ['สไลด์นำเสนอ (PDF)', 'เล่มรายงานโครงงานฉบับสมบูรณ์ (PDF)']
};

export const MOCK_ADVISORS: AdvisorInfo[] = [
  {
    id: 'ADV001',
    name: 'ดร.สมชาย ศรีสุวรรณ (Dr. Somchai Srisuwan)',
    email: 'somchai.s@university.edu',
    title: 'Associate Professor of Computer Information Systems',
    department: 'ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
    credentials: 'Ph.D. in Distributed Software Architectures, KMUTNB',
    assignedStudentIds: ['STU001', 'STU002'],
    visitCountRound1: true,
    visitCountRound2: false
  },
  {
    id: 'ADV002',
    name: 'ดร.วิทวัส จันทร์ทราภิรักษ์ (Dr. Wittawat Chantharaphirak)',
    email: 'wittawat.c@university.edu',
    title: 'Assistant Professor of Information Technology',
    department: 'ภาควิชาระบบสารสนเทศคอมพิวเตอร์ประยุกต์',
    credentials: 'Ph.D. in Information Systems & Cloud Security, Chulalongkorn Univ.',
    assignedStudentIds: ['STU003', 'STU004'],
    visitCountRound1: false,
    visitCountRound2: false
  }
];

export const MOCK_MENTORS: MentorInfo[] = [
  {
    id: 'MEN001',
    name: 'คุณสมศักดิ์ พิพัฒน์พัฒนา (Khun Somsak Pipatpatana)',
    email: 'somsak@nexatech.com',
    company: 'NexaTech Solutions Co., Ltd.',
    companyId: 'COMP01',
    role: 'Senior Full-Stack Lead & Industrial Mentor',
    assignedStudentIds: ['STU001', 'STU003']
  },
  {
    id: 'MEN002',
    name: 'คุณธีรพงศ์ อนันตชิต (Khun Teerapong Anantachit)',
    email: 'teerapong@lineardigital.io',
    company: 'Linear Digital Innovations',
    companyId: 'COMP02',
    role: 'Lead Cloud Architect & Mentor',
    assignedStudentIds: ['STU002']
  }
];

export const MOCK_TIMELINE_STAGES: CoopTimelineStage[] = [
  {
    id: 'STAGE01',
    stepNumber: 1,
    title: 'Placement Offer & Company Agreement',
    titleTh: 'การตอบรับเข้าฝึกงานและสัญญาจ้าง 3 ฝ่าย',
    dateRange: '10 พ.ค. 2569',
    status: 'completed',
    desc: 'Accepted placement offer at NexaTech Solutions. Agreement signed by student, university, and company.',
    descTh: 'ได้รับการตอบรับเข้าปฏิบัติงานที่บริษัท NexaTech Solutions และลงนามหนังสือข้อตกลง 3 ฝ่ายเรียบร้อย'
  },
  {
    id: 'STAGE02',
    stepNumber: 2,
    title: 'Co-op Visit Round 1 (Early Supervision)',
    titleTh: 'การนิเทศงานรอบที่ 1 (ติดตามความก้าวหน้าช่วงต้น)',
    dateRange: '25 ก.ค. 2569',
    status: 'completed',
    desc: 'Academic advisor visits student and company mentor on-site to review onboarding progress and work duties.',
    descTh: 'อาจารย์ที่ปรึกษาเข้าเยี่ยมนิเทศงาน ณ สถานประกอบการ ติดตามความก้าวหน้าและข้อตกลงการทำงาน'
  },
  {
    id: 'STAGE03',
    stepNumber: 3,
    title: 'Co-op Visit Round 2 (Midterm / Project Audit)',
    titleTh: 'การนิเทศงานรอบที่ 2 (ประเมินความก้าวหน้าโครงงาน)',
    dateRange: '8 ส.ค. 2569',
    status: 'current',
    desc: 'Advisor conducts secondary evaluation visit. Reviews student project draft and mentor feedback.',
    descTh: 'อาจารย์ที่ปรึกษาเข้านิเทศงานรอบที่ 2 ตรวจร่างรายงานโครงงานและรับฟังข้อเสนอแนะจากพี่เลี้ยง'
  },
  {
    id: 'STAGE04',
    stepNumber: 4,
    title: 'Oral Presentation Defense & Final Evaluation',
    titleTh: 'การสอบป้องกันโครงงานและการประเมินผลคะแนน',
    dateRange: '15 ส.ค. 2569',
    status: 'upcoming',
    desc: 'Oral defense presentation in front of academic committee and company supervisor. Final grade issued.',
    descTh: 'นำเสนอผลงานโครงงานต่อหน้าคณะกรรมการสอบและผู้แทนสถานประกอบการ ตัดเกรดสหกิจศึกษา'
  }
];

// Preserved for dev/preview utility

export const MOCK_EMAILS = [
  {
    id: 'MAIL01',
    sender: 'cwie.center@university.edu',
    subject: 'Official CWIE Matching Confirmation - NexaTech Solutions',
    snippet: 'Your application for Frontend Engineering Intern has been approved and matched.',
    date: 'July 10',
    read: false
  },
  {
    id: 'MAIL02',
    sender: 'advisor.somchai@university.edu',
    subject: 'Cooperative Supervision Visit 1 Confirmed',
    snippet: 'I have confirmed our supervision audit session on-site at NexaTech office.',
    date: 'July 08',
    read: true
  }
];

export const MOCK_EVENTS = [
  {
    id: 'EV01',
    title: 'Midterm Co-op Visit Round 1',
    start: '2026-07-25T13:30:00',
    type: 'visit' as const
  },
  {
    id: 'EV02',
    title: 'Final Oral Examination Defense',
    start: '2026-08-15T10:00:00',
    type: 'exam' as const
  }
];

export const MOCK_WORKSPACE_DOCS = [
  {
    id: 'WSDOC01',
    name: 'CWIE_Agreement_Template_2026.docx',
    lastModified: '2026-05-01'
  },
  {
    id: 'WSDOC02',
    name: 'Weekly_Timesheet_Blank.xlsx',
    lastModified: '2026-05-10'
  }
];

export const MOCK_BOOKINGS = [
  {
    id: 1,
    studentName: 'กษิดิศ พรหมศร (STU001)',
    company: 'NexaTech Solutions Co., Ltd.',
    date: '2026-07-25',
    time: '13:30',
    round: 1,
    status: 'Confirmed'
  },
  {
    id: 2,
    studentName: 'นริศรา สุวรรณโชติ (STU002)',
    company: 'Linear Digital Innovations',
    date: '2026-07-28',
    time: '10:00',
    round: 1,
    status: 'Scheduled'
  }
];
