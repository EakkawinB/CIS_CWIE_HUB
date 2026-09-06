export type Role = 'guest' | 'student' | 'advisor' | 'mentor' | 'staff' | 'login' | 'design-system';

export interface Student {
  id: string;
  name: string;
  email: string;
  gpa: number;
  major: string;
  academicYear: string;
  status: 'Unassigned' | 'Matching' | 'Confirmed' | 'Completed';
  companyId?: string;
  advisorId?: string;
  supervisorId?: string;
  skills: string[];
  resumeUrl?: string;
  progress: number; // 0 to 100
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  industryTh?: string;
  location: string;
  locationTh?: string;
  logoColor: string;
  description: string;
  descriptionTh?: string;
  positions: Position[];
  rating: number;
}

export interface Position {
  id: string;
  title: string;
  titleTh?: string;
  slots: number;
  filled: number;
  description: string;
  descriptionTh?: string;
  requirements: string[];
  requirementsTh?: string[];
  salary: string;
  salaryTh?: string;
  tags: string[];
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  summary: string;
  achievements: string;
  obstacles: string;
  hoursWorked: number;
  status: 'Pending' | 'Approved' | 'Requires Edit';
  advisorComment?: string;
  supervisorComment?: string;
  submittedAt: string;
}

export interface Timesheet {
  id: string;
  studentId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  hoursWorked: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  fileUrl?: string;
  fileName?: string;
  approvedBy?: string;
  submittedAt: string;
}

export interface Document {
  id: string;
  name: string;
  category: 'Agreement' | 'Report' | 'Evaluation' | 'General';
  status: 'Missing' | 'Submitted' | 'Approved' | 'Action Required';
  fileSize?: string;
  uploadedAt?: string;
  feedback?: string;
}

export interface Examination {
  studentId: string;
  status: 'Not Scheduled' | 'Scheduled' | 'Completed';
  date?: string;
  time?: string;
  room?: string;
  committee: string[];
  checkedIn: boolean;
  score?: number; // max 100
  feedback?: string;
}

export interface WorkspaceEmail {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  date: string;
  read: boolean;
}

export interface WorkspaceEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'academic' | 'cwie' | 'exam' | 'visit';
}

export interface WorkspaceDoc {
  id: string;
  name: string;
  lastModified: string;
  url: string;
}

// REALISTIC MOCK DATA
export const MOCK_STUDENTS: Student[] = [
  {
    id: 'STU001',
    name: 'Kasidis Phromsorn',
    email: 'kasidis.p@university.edu',
    gpa: 3.82,
    major: 'Computer Information Systems',
    academicYear: '4th Year',
    status: 'Confirmed',
    companyId: 'COMP01',
    advisorId: 'ADV01',
    supervisorId: 'SUP01',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    progress: 75,
  },
  {
    id: 'STU002',
    name: 'Natapat Kittisukhon',
    email: 'natapat.k@university.edu',
    gpa: 3.45,
    major: 'Software Engineering',
    academicYear: '4th Year',
    status: 'Matching',
    companyId: 'COMP02',
    advisorId: 'ADV01',
    skills: ['Vue.js', 'Java Spring Boot', 'MySQL', 'Docker'],
    progress: 40,
  },
  {
    id: 'STU003',
    name: 'Piyabutr Wongkaew',
    email: 'piyabutr.w@university.edu',
    gpa: 3.12,
    major: 'Computer Information Systems',
    academicYear: '4th Year',
    status: 'Unassigned',
    skills: ['Python', 'Django', 'Data Analysis', 'Tableau'],
    progress: 10,
  },
  {
    id: 'STU004',
    name: 'Chayanit Srisuwan',
    email: 'chayanit.s@university.edu',
    gpa: 3.91,
    major: 'Computer Information Systems',
    academicYear: '4th Year',
    status: 'Confirmed',
    companyId: 'COMP03',
    advisorId: 'ADV02',
    supervisorId: 'SUP02',
    skills: ['UX/UI Design', 'Figma', 'React Native', 'Tailwind CSS'],
    progress: 90,
  }
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'COMP01',
    name: 'NexaTech Solutions',
    industry: 'Enterprise Software & Cloud Services',
    industryTh: 'ซอฟต์แวร์ระดับองค์กรและบริการคลาวด์',
    location: 'District 1, Bangkok Tech Corridor',
    locationTh: 'เขต 1, กรุงเทพฯ เทค คอริดอร์',
    logoColor: 'from-blue-600 to-indigo-600',
    description: 'NexaTech is a pioneering SaaS enterprise specializing in cloud-native operational management databases and real-time logistics networks.',
    descriptionTh: 'NexaTech เป็นบริษัทผู้บุกเบิกด้าน Enterprise SaaS ที่เชี่ยวชาญด้านระบบฐานข้อมูลการจัดการบนคลาวด์เนทีฟและเครือข่ายโลจิสติกส์แบบเรียลไทม์',
    rating: 4.8,
    positions: [
      {
        id: 'POS01',
        title: 'Frontend Engineer (React)',
        titleTh: 'วิศวกรฟรอนต์เอนด์ (React)',
        slots: 2,
        filled: 1,
        description: 'Build robust, highly performant web application components using React 19, TypeScript, and modern design systems.',
        descriptionTh: 'พัฒนาคอมโพเนนต์เว็บแอปพลิเคชันที่มีประสิทธิภาพสูงและเสถียร โดยใช้ React 19, TypeScript และระบบการออกแบบที่ทันสมัย',
        requirements: ['Strong understanding of React & hook states', 'CSS frameworks (Tailwind preferred)', 'Understanding of RESTful JSON APIs'],
        requirementsTh: ['มีความเข้าใจอย่างลึกซึ้งเกี่ยวกับ React และ Hook State', 'มีความชำนาญในการใช้ CSS Frameworks (พิจารณา Tailwind CSS เป็นพิเศษ)', 'มีความเข้าใจเกี่ยวกับการเชื่อมต่อ RESTful JSON APIs'],
        salary: '18,000 - 22,000 THB/month',
        salaryTh: '18,000 - 22,000 บาท/เดือน',
        tags: ['React', 'TypeScript', 'Tailwind'],
      },
      {
        id: 'POS02',
        title: 'DevOps & Systems Assistant',
        titleTh: 'ผู้ช่วยฝ่ายวิศวกรรมระบบและเดฟออปส์',
        slots: 1,
        filled: 0,
        description: 'Support cloud-native container workloads in Kubernetes and assist with Continuous Integration workflows.',
        descriptionTh: 'สนับสนุนและดูแลโครงสร้างระบบตู้คอนเทนเนอร์ (Container Workloads) บน Kubernetes และช่วยเหลืองานด้านกระบวนการ Continuous Integration (CI/CD)',
        requirements: ['Basic Linux shell command line experience', 'Docker container understanding', 'Familiarity with Git'],
        requirementsTh: ['มีประสบการณ์พื้นฐานการใช้งาน Linux command line', 'มีความเข้าใจระบบตู้คอนเทนเนอร์ด้วย Docker', 'มีความคุ้นเคยกับระบบควบคุมเวอร์ชัน Git'],
        salary: '20,000 THB/month',
        salaryTh: '20,000 บาท/เดือน',
        tags: ['Docker', 'AWS', 'Linux'],
      }
    ]
  },
  {
    id: 'COMP02',
    name: 'Linear Digital Corp',
    industry: 'Financial Technology & Agile Products',
    industryTh: 'เทคโนโลยีทางการเงินและผลิตภัณฑ์ดิจิทัล',
    location: 'Sathorn Financial District, Bangkok',
    locationTh: 'ย่านการเงินสาทร, กรุงเทพฯ',
    logoColor: 'from-slate-800 to-slate-950',
    description: 'A modern, Linear-inspired digital products builder focused on crafting gorgeous user interfaces and solid distributed banking protocols.',
    descriptionTh: 'ผู้พัฒนาผลิตภัณฑ์ดิจิทัลยุคใหม่ที่ได้รับแรงบันดาลใจจากสไตล์มินิมอล มุ่งเน้นการออกแบบยูสเซอร์อินเตอร์เฟสที่สวยงามและโปรโตคอลระบบการเงินแบบกระจายศูนย์ที่มีความเสถียร',
    rating: 4.9,
    positions: [
      {
        id: 'POS03',
        title: 'Fullstack Software Intern',
        titleTh: 'นักศึกษาฝึกงานพัฒนาซอฟต์แวร์แบบฟูลสแต็ก',
        slots: 3,
        filled: 1,
        description: 'Implement back-to-front features in fullstack Node.js environments. Work directly under senior engineering architects.',
        descriptionTh: 'พัฒนาฟีเจอร์ทั้งฝั่งหน้าบ้านและหลังบ้านในสภาพแวดล้อม Node.js โดยทำงานร่วมกับสถาปนิกซอฟต์แวร์อาวุโสโดยตรง',
        requirements: ['Node.js/Express experience', 'Relational database familiarity (Postgres)', 'Willingness to learn agile workflows'],
        requirementsTh: ['มีประสบการณ์การใช้งาน Node.js และ Express', 'มีความคุ้นเคยกับระบบฐานข้อมูลเชิงสัมพันธ์ เช่น PostgreSQL', 'มีความกระตือรือร้นในการเรียนรู้กระบวนการทำงานแบบ Agile'],
        salary: '22,000 THB/month',
        salaryTh: '22,000 บาท/เดือน',
        tags: ['Node.js', 'Postgres', 'Vue'],
      }
    ]
  },
  {
    id: 'COMP03',
    name: 'Vortex Studio',
    industry: 'Digital Experience & Creative Tech',
    industryTh: 'ประสบการณ์ดิจิทัลและเทคโนโลยีสร้างสรรค์',
    location: 'Sukhumvit Soi 21, Bangkok',
    locationTh: 'สุขุมวิท ซอย 21, กรุงเทพฯ',
    logoColor: 'from-violet-600 to-fuchsia-600',
    description: 'Vortex is a creative studio merging the boundaries of high-fidelity UX/UI design with modern interactive graphics and spatial products.',
    descriptionTh: 'สตูดิโอสร้างสรรค์ที่ผสานขีดจำกัดของการออกแบบ UX/UI ความละเอียดสูง เข้ากับกราฟิกแบบอินเตอร์แอคทีฟที่ทันสมัยและผลิตภัณฑ์เชิงพื้นที่ดิจิทัล',
    rating: 4.6,
    positions: [
      {
        id: 'POS04',
        title: 'UI/UX Designer Intern',
        titleTh: 'นักศึกษาฝึกงานออกแบบ UI/UX',
        slots: 2,
        filled: 1,
        description: 'Translate complicated workflows into beautiful, seamless interactive design systems. Create high-fidelity Figma prototypes.',
        descriptionTh: 'แปลงกระบวนการทำงานที่ซับซ้อนให้กลายเป็นระบบการออกแบบเชิงโต้ตอบที่สวยงามและใช้งานง่าย สร้างชิ้นงานจำลองความละเอียดสูงบน Figma',
        requirements: ['Outstanding portfolio in Figma', 'Solid grip on grids, typography, and visual hierarchy', 'Basic knowledge of frontend limitations'],
        requirementsTh: ['มีผลงานการออกแบบที่โดดเด่นโดยใช้โปรแกรม Figma', 'มีความรู้ความเข้าใจที่แน่นหนาเรื่อง Grid, Typography และการจัดลำดับความสำคัญของภาพ', 'มีความรู้พื้นฐานเกี่ยวกับข้อจำกัดทางเทคนิคฝั่ง Frontend'],
        salary: '15,000 - 18,000 THB/month',
        salaryTh: '15,000 - 18,000 บาท/เดือน',
        tags: ['Figma', 'UX Research', 'Design System'],
      }
    ]
  }
];

export const MOCK_REPORTS: WeeklyReport[] = [
  {
    id: 'REP001',
    studentId: 'STU001',
    weekNumber: 1,
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    summary: 'Onboarded into NexaTech frontend team. Configured workspace with pnpm and set up local development servers. Explored the central codebase structure.',
    achievements: 'Set up development environment in under 4 hours. Solved 2 minor layout bugs in the client dashboard dashboard.',
    obstacles: 'Getting access permissions for the internal repository took some back-and-forth emails, but was resolved on Tuesday.',
    hoursWorked: 40,
    status: 'Approved',
    advisorComment: 'Great start, Kasidis! Keep maintaining this clean log format.',
    supervisorComment: 'Kasidis adapted very quickly to our development environment. Promising start.',
    submittedAt: '2026-06-05T17:00:00Z',
  },
  {
    id: 'REP002',
    studentId: 'STU001',
    weekNumber: 2,
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    summary: 'Assigned to rebuild the main company analytical tables. Designed custom table filter views using responsive layouts.',
    achievements: 'Delivered the table filter components 2 days ahead of schedule, with perfect CSS transitions.',
    obstacles: 'Struggled slightly with custom memoization arrays in useEffect to avoid excess re-renders, but refactored it after senior review.',
    hoursWorked: 40,
    status: 'Approved',
    advisorComment: 'Excellent technical progress. Good utilization of state.',
    submittedAt: '2026-06-12T17:15:00Z',
  },
  {
    id: 'REP003',
    studentId: 'STU001',
    weekNumber: 3,
    startDate: '2026-06-15',
    endDate: '2026-06-19',
    summary: 'Began building interactive analytics charts showing real-time container CPU stats. Experimented with pure custom SVGs.',
    achievements: 'Successfully created fully interactive charts with responsive scales.',
    obstacles: 'SVG resizing challenges on mobile, but resolved by adding a ResizeObserver wrapper.',
    hoursWorked: 40,
    status: 'Pending',
    submittedAt: '2026-06-19T16:50:00Z',
  }
];

export const MOCK_TIMESHEETS: Timesheet[] = [
  {
    id: 'TS001',
    studentId: 'STU001',
    weekNumber: 1,
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    hoursWorked: 40,
    status: 'Approved',
    fileName: 'timesheet_week_1_kasidis.pdf',
    approvedBy: 'Supervisor Somsak (SUP01)',
    submittedAt: '2026-06-05T17:05:00Z',
  },
  {
    id: 'TS002',
    studentId: 'STU001',
    weekNumber: 2,
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    hoursWorked: 40,
    status: 'Approved',
    fileName: 'timesheet_week_2_kasidis.pdf',
    approvedBy: 'Supervisor Somsak (SUP01)',
    submittedAt: '2026-06-12T17:20:00Z',
  },
  {
    id: 'TS003',
    studentId: 'STU001',
    weekNumber: 3,
    startDate: '2026-06-15',
    endDate: '2026-06-19',
    hoursWorked: 40,
    status: 'Pending',
    fileName: 'timesheet_week_3_kasidis.pdf',
    submittedAt: '2026-06-19T17:00:00Z',
  }
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: 'DOC01', name: 'CWIE_Application_Form_signed.pdf', category: 'Agreement', status: 'Approved', fileSize: '1.2 MB', uploadedAt: '2026-05-10 14:22' },
  { id: 'DOC02', name: 'Letter_of_Acceptance_NexaTech.pdf', category: 'Agreement', status: 'Approved', fileSize: '450 KB', uploadedAt: '2026-05-18 10:05' },
  { id: 'DOC03', name: 'Weekly_Progress_Summary_Signed_W1-2.pdf', category: 'Report', status: 'Approved', fileSize: '2.1 MB', uploadedAt: '2026-06-12 17:30' },
  { id: 'DOC04', name: 'Supervisor_Evaluation_Form_70_Percent.pdf', category: 'Evaluation', status: 'Missing' },
  { id: 'DOC05', name: 'Cooperative_Final_Report_Draft.docx', category: 'Report', status: 'Action Required', fileSize: '4.8 MB', uploadedAt: '2026-07-01 11:40', feedback: 'Please update chapter 3 with the revised system architecture diagram and clarify the evaluation metrics.' }
];

export const MOCK_EXAM: Examination = {
  studentId: 'STU001',
  status: 'Scheduled',
  date: '2026-08-15',
  time: '10:00 AM - 12:00 PM',
  room: 'CIS Advanced Computing Lab, Room 604',
  committee: ['Asst. Prof. Dr. Chitsutha Soomlek (Chairperson)', 'Dr. Wittawat Chantharaphirak (Committee)', 'Khun Somsak Pipatpatana (Supervisor)'],
  checkedIn: false,
};

export const MOCK_EMAILS: WorkspaceEmail[] = [
  { id: 'EM01', sender: 'cwie.center@university.edu', subject: 'Urgent: Complete your Supervisor midterm evaluation', snippet: 'Dear Student, please make sure your supervisor logs in to complete the 70% evaluation form before...', date: 'Jul 11, 2026', read: false },
  { id: 'EM02', sender: 'somsak.p@nexatech.co.th', subject: 'Feedback on layout rebuild task', snippet: 'Hi Kasidis, the layout for the analytical tables looks clean. Let’s do a brief walkthrough this Monday at...', date: 'Jul 10, 2026', read: true },
  { id: 'EM03', sender: 'advisor.somchai@university.edu', subject: 'Scheduled CWIE Site Supervision Visit', snippet: 'Hello Kasidis and Somsak, I have confirmed our supervision visit date for July 25 at NexaTech. Please prepare...', date: 'Jul 08, 2026', read: true }
];

export const MOCK_EVENTS: WorkspaceEvent[] = [
  { id: 'EV01', title: 'Submit Weekly Report Week 6', start: '2026-07-17T17:00:00', end: '2026-07-17T18:00:00', type: 'cwie' },
  { id: 'EV02', title: 'Midterm Site Supervision Visit', start: '2026-07-25T13:30:00', end: '2026-07-25T15:30:00', type: 'visit' },
  { id: 'EV03', title: 'Final Report Slides Submission Deadline', start: '2026-08-05T23:59:00', end: '2026-08-06T00:00:00', type: 'academic' },
  { id: 'EV04', title: 'CIS CWIE Examination Presentation', start: '2026-08-15T10:00:00', end: '2026-08-15T12:00:00', type: 'exam' }
];

export const MOCK_WORKSPACE_DOCS: WorkspaceDoc[] = [
  { id: 'WD01', name: 'CIS_CWIE_Final_Report_Template.docx', lastModified: 'May 02, 2026', url: 'https://docs.google.com/document/d/1' },
  { id: 'WD02', name: 'Weekly_Timesheet_Blank_Template.xlsx', lastModified: 'May 04, 2026', url: 'https://docs.google.com/spreadsheets/d/2' },
  { id: 'WD03', name: 'CWIE_Evaluation_Criteria_Rubric_v2.pdf', lastModified: 'Jun 10, 2026', url: 'https://drive.google.com/file/d/3' }
];
