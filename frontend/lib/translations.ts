export type Language = 'en' | 'th'

export const translations = {
  en: {
    // Navigation
    nav: {
      announcements: 'Announcements',
      eligibility: 'Eligibility',
      workflow: 'Workflow',
      faq: 'FAQ',
      login: 'Login',
      language: 'TH | EN',
      guest: 'Guest',
      contact: 'Contact',
    },

    // Hero
    hero: {
      badge: 'KMUTNB Cooperative Education Platform',
      title: 'Welcome to CIS CWIE Hub',
      titleHighlight: 'CIS CWIE Hub',
      subtitle: 'Cooperative and Work-Integrated Education Management System',
      description:
        'A platform that connects students, advisors, mentors, and companies through a fully digital CWIE workflow.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
    },

    // Announcements
    announcements: {
      badge: 'Latest',
      title: 'Latest Announcements',
      viewAll: 'View All',
    },

    // Upcoming Events
    events: {
      eyebrow: 'Calendar',
      title: 'Upcoming CWIE Events',
      description:
        'Prepare, connect, and grow with activities designed for your professional journey.',
      register: 'Register',
    },

    // Eligibility Checker
    eligibility: {
      eyebrow: 'Student Check',
      title: 'Check Your CWIE Eligibility',
      description:
        'Get a quick indication before you sign in. Official verification happens securely inside your workspace.',
      minRequirements: 'Minimum requirements',
      enterInfo:
        'Enter your latest academic information to see whether you meet the baseline CWIE criteria.',
      gpa: 'Cumulative GPA',
      credits: 'Completed credits',
      gpaPlaceholder: 'e.g. 3.25',
      creditsPlaceholder: 'e.g. 84',
      verify: 'Verify Eligibility',
      congratulations: 'Congratulations!',
      congratulationsDesc: 'You meet the minimum CWIE requirements.',
      gpaPass: 'GPA requirement passed',
      creditPass: 'Credit requirement passed',
      continueLogin: 'Continue to Login',
      notMeet: "Don't worry!",
      notMeetDesc: 'You have not met the requirements yet.',
      gap: 'Gap',
      missing: 'Missing',
      keepWorking: 'Keep working hard. You will be ready soon.',
      demoOnly: 'This checker is for demonstration only and does not connect to the university database.',
    },

    // Partner Companies
    companies: {
      eyebrow: 'Industry Partners',
      title: 'Trusted by Leading Companies',
      description:
        'Building strong pathways from university learning to meaningful professional experience.',
    },

    // Features
    features: {
      eyebrow: 'One Connected Platform',
      title: 'Why CIS CWIE Hub',
      description:
        'Everything needed to run a transparent, efficient, and student-centered cooperative education program.',
      paperless: 'Paperless Document Management',
      paperlessDesc: 'Manage every CWIE document securely in one organized workspace.',
      matching: 'Student-Company Matching',
      matchingDesc: 'Connect student strengths with the right industry opportunities.',
      monitoring: 'Progress Monitoring',
      monitoringDesc: 'See milestones, submissions, and internship status at a glance.',
      evaluation: 'Evaluation System',
      evaluationDesc: 'Structured assessment for advisors, mentors, and students.',
      notifications: 'Smart Notifications',
      notificationsDesc: 'Stay ahead of deadlines with timely, relevant reminders.',
      multiLanguage: 'Multi-language Support',
      multiLanguageDesc: 'A clear experience available in both Thai and English.',
    },

    // Workflow
    workflow: {
      eyebrow: 'Your Journey',
      title: 'A Clear Path from Campus to Career',
      description:
        'Nine guided stages keep every participant aligned from first profile to final evaluation.',
      steps: [
        'Complete Profile',
        'Resume Submission',
        'Student–Company Matching',
        'Upload Documents',
        'Company Confirmation',
        'Internship',
        'Progress Monitoring',
        'Evaluation',
        'Completion',
      ],
    },

    // Statistics
    statistics: {
      students: 'Students',
      advisors: 'Advisors',
      companies: 'Partner Companies',
      paperless: 'Paperless',
    },

    // FAQ
    faq: {
      eyebrow: 'Help Center',
      title: 'Frequently Asked Questions',
      q1: 'How do I login?',
      a1: 'Select Login or Get Started, then authenticate using your KMUTNB university email, Google account, or ICIT SSO.',
      q2: 'Can I use Google login?',
      a2: 'Yes. Google login is available for authorized university email domains only.',
      q3: 'How does OTP work?',
      a3: 'Enter your university email and we will send a time-limited one-time password. Enter that code to access your workspace securely.',
      q4: 'What documents are required?',
      a4: 'Requirements vary by stage, but typically include your resume, academic record, application, agreement, and internship reports.',
      q5: 'How can I contact staff?',
      a5: 'Contact the CIS CWIE team through the help channel in your workspace or the department contact details below.',
    },

    // CTA
    cta: {
      eyebrow: 'Begin your journey',
      title: 'Ready to Start Your Cooperative Education Journey?',
      subtitle: 'Manage your CWIE experience in one trusted platform.',
      loginNow: 'Login Now',
    },

    // Footer
    footer: {
      about: 'Department of Computer and Information Science',
      university: "King Mongkut's University of Technology North Bangkok",
      quickLinks: 'Quick Links',
      footerContact: 'Contact',
      address: "Department of Computer and Information Science Faculty of Science, King Mongkut's University of Technology North Bangkok, BangSue, Bangkok, 10800",
      email: 'cis@kmutnb.ac.th',
      phone: '02-555-2000 ext. 4601, 4602',
      copyright: '© 2026 CIS KMUTNB. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      help: 'Help',
    },

    // Login Page - Left Section
    loginPage: {
      cooperative: 'Cooperative education, connected',
      title: 'Your professional journey starts here.',
      description: 'One secure workspace for students, advisors, mentors, and partner companies to manage the entire CWIE experience.',
      benefit1: 'Manage every document digitally',
      benefit2: 'Follow progress in real time',
      benefit3: 'Connect securely with your CWIE team',
      footer: 'Department of Computer and Information Science · KMUTNB',
    },

    // Login Card
    login: {
      signIn: 'Sign in to CIS CWIE Hub',
      accessWorkspace: 'Access your cooperative education workspace',
      universityEmail: 'University Email',
      emailPlaceholder: 'student@mail.kmutnb.ac.th',
      sendOTP: 'Send One-Time Password',
      otpSent: 'A 6-digit code was sent to',
      oneTimePassword: 'One-Time Password',
      otpPlaceholder: '000000',
      verifySignIn: 'Verify & Sign In',
      differentEmail: 'Use a different email',
      orContinueWith: 'OR CONTINUE WITH',
      continueGoogle: 'Continue with Google',
      loginSSO: 'Login with ICIT SSO',
      connecting: 'Connecting...',
      accessRestricted:
        'Access is restricted to authorized KMUTNB users only. Only approved university email domains are accepted.',
    },

    // Site Header
    siteHeader: {
      cooperative: 'Cooperative Education',
    },

    // Dashboard
    dashboard: {
      title: 'CWIE Dashboard',
      documents: 'Documents',
      matched: 'Matched',
      profileComplete: 'Profile complete',
      resumeApproved: 'Resume approved',
      interviewScheduled: 'Interview scheduled',
      paperlessWorkflow: 'Paperless workflow',
    },

    // Announcements Data
    announcementsList: [
      {
        tag: 'Application',
        title: 'Internship Application Round',
        date: 'Aug 12, 2026',
        desc: 'Round 2 applications for Term 2/2026 are now open for eligible students.',
      },
      {
        tag: 'Deadline',
        title: 'Document Submission Deadline',
        date: 'Aug 20, 2026',
        desc: 'Submit CWIE agreement and insurance forms before the closing date.',
      },
      {
        tag: 'Workshop',
        title: 'Resume Workshop',
        date: 'Aug 25, 2026',
        desc: 'Learn how to build a standout resume with our career advisors.',
      },
      {
        tag: 'Schedule',
        title: 'Interview Schedule Released',
        date: 'Sep 01, 2026',
        desc: 'Company interview slots have been published in your dashboard.',
      },
      {
        tag: 'Recruitment',
        title: 'Company Recruitment Fair',
        date: 'Sep 08, 2026',
        desc: 'Meet 15+ partner companies recruiting CWIE students this term.',
      },
    ],

    // Events Data
    eventsList: [
      {
        day: '25',
        month: 'AUG',
        title: 'Resume Workshop',
        time: '13:00 – 16:00',
        place: 'CIS Lab 4, Floor 6',
        label: 'Career Prep',
      },
      {
        day: '03',
        month: 'SEP',
        title: 'CIS Career Fair 2026',
        time: '09:00 – 16:30',
        place: 'Navamindra Hall',
        label: 'Networking',
      },
      {
        day: '12',
        month: 'SEP',
        title: 'Mock Interview Day',
        time: '10:00 – 15:00',
        place: 'CIS Meeting Room',
        label: 'Practice',
      },
    ],
  },

  th: {
    // Navigation
    nav: {
      announcements: 'ประกาศ',
      eligibility: 'ความสามารถ',
      workflow: 'ขั้นตอน',
      faq: 'คำถาม',
      login: 'เข้าสู่ระบบ',
      language: 'TH | EN',
      guest: 'ผู้เยี่ยมชม',
      contact: 'ติดต่อ',
    },

    // Hero
    hero: {
      badge: 'แพลตฟอร์มการศึกษาร่วมสหกิจของ KMUTNB',
      title: 'ยินดีต้อนรับสู่ CIS CWIE Hub',
      titleHighlight: 'CIS CWIE Hub',
      subtitle: 'ระบบจัดการการศึกษาร่วมสหกิจและการเรียนรู้ที่บูรณาการกับงาน',
      description:
        'แพลตฟอร์มที่เชื่อมต่อนักเรียน ที่ปรึกษา พี่เลี้ยง และบริษัทผ่านเวิร์กโฟลว์ดิจิทัลแบบครบวงจร',
      getStarted: 'เริ่มต้น',
      learnMore: 'เรียนรู้เพิ่มเติม',
    },

    // Announcements
    announcements: {
      badge: 'ล่าสุด',
      title: 'ประกาศล่าสุด',
      viewAll: 'ดูทั้งหมด',
    },

    // Upcoming Events
    events: {
      eyebrow: 'ปฏิทิน',
      title: 'กิจกรรม CWIE ที่จะเกิดขึ้น',
      description:
        'เตรียมตัว เชื่อมต่อ และพัฒนาด้วยกิจกรรมที่ออกแบบมาเพื่อการเดินทางอาชีพของคุณ',
      register: 'ลงทะเบียน',
    },

    // Eligibility Checker
    eligibility: {
      eyebrow: 'ตรวจสอบนักเรียน',
      title: 'ตรวจสอบความสามารถของ CWIE',
      description:
        'รับข้อบ่งชี้อย่างรวดเร็วก่อนเข้าสู่ระบบ การตรวจสอบแบบอย่างเป็นทางการจะเกิดขึ้นอย่างปลอดภัยในพื้นที่ทำงานของคุณ',
      minRequirements: 'ข้อกำหนดขั้นต่ำ',
      enterInfo:
        'ป้อนข้อมูลวิชาการล่าสุดของคุณเพื่อดูว่าคุณตรงตามเกณฑ์ CWIE ขั้นพื้นฐานหรือไม่',
      gpa: 'เกรดเฉลี่ยสะสม',
      credits: 'เรียนแล้ว',
      gpaPlaceholder: 'เช่น 3.25',
      creditsPlaceholder: 'เช่น 84',
      verify: 'ตรวจสอบความสามารถ',
      congratulations: 'ยินดีด้วย!',
      congratulationsDesc: 'คุณตรงตามข้อกำหนดขั้นต่ำของ CWIE',
      gpaPass: 'ผ่านข้อกำหนด GPA',
      creditPass: 'ผ่านข้อกำหนดหน่วยกิต',
      continueLogin: 'ดำเนินการต่อไปยังการเข้าสู่ระบบ',
      notMeet: 'ไม่ต้องกังวล!',
      notMeetDesc: 'คุณยังไม่ได้ตรงตามข้อกำหนด',
      gap: 'ช่องว่าง',
      missing: 'ขาดหายไป',
      keepWorking: 'ทำงานให้หนักขึ้นไป คุณจะพร้อมในไม่ช้า',
      demoOnly: 'ตัวตรวจสอบนี้ใช้เพื่อการสาธิตเท่านั้นและไม่เชื่อมต่อกับฐานข้อมูลของมหาวิทยาลัย',
    },

    // Partner Companies
    companies: {
      eyebrow: 'คู่ค้าอุตสาหกรรม',
      title: 'เชื่อถือโดยบริษัทชั้นนำ',
      description:
        'สร้างเส้นทางที่มั่นคงจากการเรียนรู้ที่มหาวิทยาลัยไปสู่ประสบการณ์ทางวิชาชีพที่มีความหมาย',
    },

    // Features
    features: {
      eyebrow: 'แพลตฟอร์มที่เชื่อมต่อ',
      title: 'ทำไมถึง CIS CWIE Hub',
      description:
        'ทุกสิ่งที่จำเป็นในการดำเนินการโปรแกรมการศึกษาร่วมสหกิจที่โปร่งใสและมีประสิทธิภาพและเน้นนักเรียน',
      paperless: 'การจัดการเอกสารแบบไร้กระดาษ',
      paperlessDesc: 'จัดการเอกสาร CWIE ทั้งหมดอย่างปลอดภัยในพื้นที่ทำงานที่เป็นระเบียบ',
      matching: 'การจับคู่นักเรียนกับบริษัท',
      matchingDesc: 'เชื่อมต่อจุดแข็งของนักเรียนกับโอกาสอุตสาหกรรมที่เหมาะสม',
      monitoring: 'การตรวจสอบความก้าวหน้า',
      monitoringDesc: 'ดูเหตุการณ์สำคัญ การส่งมอบ และสถานะการฝึกงานได้ในคราวเดียว',
      evaluation: 'ระบบการประเมินผล',
      evaluationDesc: 'การประเมินแบบมีโครงสร้างสำหรับที่ปรึกษา พี่เลี้ยง และนักเรียน',
      notifications: 'การแจ้งเตือนอย่างชาญฉลาด',
      notificationsDesc: 'อยู่ข้างหน้าเส้นตายด้วยการเตือนที่เหมาะสมและทันเวลา',
      multiLanguage: 'การสนับสนุนหลายภาษา',
      multiLanguageDesc: 'ประสบการณ์ที่ชัดเจนพร้อมใช้งานทั้งภาษาไทยและภาษาอังกฤษ',
    },

    // Workflow
    workflow: {
      eyebrow: 'การเดินทางของคุณ',
      title: 'เส้นทางที่ชัดเจนจากแคมปัสไปสู่อาชีพ',
      description:
        'เก้าขั้นตอนที่กำหนดไว้ให้ผู้เข้าร่วมทั้งหมดสอดคล้องกันจากโปรไฟล์แรกไปจนถึงการประเมินผลสุดท้าย',
      steps: [
        'เสร็จสิ้นโปรไฟล์',
        'ส่งประวัติย่อ',
        'จับคู่นักเรียนกับบริษัท',
        'อัปโหลดเอกสาร',
        'ยืนยันของบริษัท',
        'ฝึกงาน',
        'การตรวจสอบความก้าวหน้า',
        'การประเมินผล',
        'การสิ้นสุด',
      ],
    },

    // Statistics
    statistics: {
      students: 'นักเรียน',
      advisors: 'ที่ปรึกษา',
      companies: 'บริษัทคู่ค้า',
      paperless: 'ไร้กระดาษ',
    },

    // FAQ
    faq: {
      eyebrow: 'ศูนย์ช่วยเหลือ',
      title: 'คำถามที่พบบ่อย',
      q1: 'ฉันจะเข้าสู่ระบบได้อย่างไร',
      a1: 'เลือกเข้าสู่ระบบหรือเริ่มต้น จากนั้นตรวจสอบสิทธิ์โดยใช้อีเมลมหาวิทยาลัย KMUTNB บัญชี Google หรือ ICIT SSO ของคุณ',
      q2: 'ฉันสามารถใช้การเข้าสู่ระบบของ Google ได้หรือไม่',
      a2: 'ได้ การเข้าสู่ระบบของ Google ใช้ได้สำหรับโดเมนอีเมลมหาวิทยาลัยที่ได้รับอนุญาตเท่านั้น',
      q3: 'OTP ทำงานอย่างไร',
      a3: 'ป้อนอีเมลมหาวิทยาลัยของคุณ และเราจะส่งรหัสผ่านแบบใช้ครั้งเดียวที่มีระยะเวลาจำกัด ป้อนรหัสนั้นเพื่อเข้าถึงพื้นที่ทำงานของคุณอย่างปลอดภัย',
      q4: 'ต้องการเอกสารใดบ้าง',
      a4: 'ข้อกำหนดแตกต่างกันไปตามขั้นตอน แต่โดยทั่วไปรวมถึงประวัติย่อ บันทึกการศึกษา ใบสมัคร ข้อตกลง และรายงานการฝึกงาน',
      q5: 'ฉันจะติดต่อเจ้าหน้าที่ได้อย่างไร',
      a5: 'ติดต่อทีม CIS CWIE ผ่านช่องช่วยเหลือในพื้นที่ทำงานของคุณหรือรายละเอียดการติดต่อของแผนกด้านล่าง',
    },

    // CTA
    cta: {
      eyebrow: 'เริ่มการเดินทางของคุณ',
      title: 'พร้อมจะเริ่มการเดินทางการศึกษาร่วมสหกิจของคุณหรือไม่',
      subtitle: 'จัดการประสบการณ์ CWIE ของคุณในแพลตฟอร์มที่เชื่อถือได้',
      loginNow: 'เข้าสู่ระบบตอนนี้',
    },

    // Footer
    footer: {
      about: 'ภาควิชาวิทยาศาสตร์คอมพิวเตอร์และสารสนเทศ',
      university: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี',
      quickLinks: 'ลิงก์ด่วน',
      footerContact: 'ติดต่อ',
      address: 'ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศคณะวิทยาศาสตร์ประยุกต์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ บางซื่อ กรุงเทพมหานคร 10800',
      email: 'cis@kmutnb.ac.th',
      phone: '02-555-2000 ต่อ 4601, 4602',
      copyright: '© 2026 CIS KMUTNB สงวนลิขสิทธิ์',
      privacyPolicy: 'นโยบายความเป็นส่วนตัว',
      help: 'ช่วยเหลือ',
    },

    // Login Page - Left Section
    loginPage: {
      cooperative: 'การศึกษาร่วมสหกิจ เชื่อมต่ออย่างมั่นคง',
      title: 'การเดินทางอาชีพของคุณเริ่มต้นที่นี่',
      description: 'พื้นที่ทำงานที่ปลอดภัยสำหรับนักเรียน ที่ปรึกษา พี่เลี้ยง และบริษัทคู่ค้าเพื่อจัดการประสบการณ์ CWIE ทั้งหมด',
      benefit1: 'จัดการเอกสารทุกฉบับแบบดิจิทัล',
      benefit2: 'ติดตามความก้าวหน้าแบบเรียลไทม์',
      benefit3: 'เชื่อมต่ออย่างปลอดภัยกับทีม CWIE ของคุณ',
      footer: 'ภาควิชาวิทยาศาสตร์คอมพิวเตอร์และสารสนเทศ · KMUTNB',
    },

    // Login Card
    login: {
      backHome: 'กลับไปหน้าแรก',
      signIn: 'เข้าสู่ระบบ CIS CWIE Hub',
      accessWorkspace: 'เข้าถึงพื้นที่ทำงานการศึกษาร่วมสหกิจของคุณ',
      universityEmail: 'อีเมลมหาวิทยาลัย',
      emailPlaceholder: 'student@mail.kmutnb.ac.th',
      sendOTP: 'ส่งรหัสผ่านแบบใช้ครั้งเดียว',
      otpSent: 'รหัส 6 หลักถูกส่งไปยัง',
      oneTimePassword: 'รหัสผ่านแบบใช้ครั้งเดียว',
      otpPlaceholder: '000000',
      verifySignIn: 'ตรวจสอบและเข้าสู่ระบบ',
      differentEmail: 'ใช้อีเมลอื่น',
      orContinueWith: 'หรือดำเนินการต่อด้วย',
      continueGoogle: 'ดำเนินการต่อด้วย Google',
      loginSSO: 'เข้าสู่ระบบด้วย ICIT SSO',
      connecting: 'กำลังเชื่อมต่อ...',
      accessRestricted:
        'การเข้าถึงถูก จำกัดสำหรับผู้ใช้ KMUTNB ที่ได้รับอนุญาตเท่านั้น เฉพาะโดเมนอีเมลมหาวิทยาลัยที่ได้รับอนุญาตเท่านั้น',
    },

    // Site Header
    siteHeader: {
      cooperative: 'การศึกษาร่วมสหกิจ',
    },

    // Dashboard
    dashboard: {
      title: 'แดชบอร์ด CWIE',
      documents: 'เอกสาร',
      matched: 'จับคู่แล้ว',
      profileComplete: 'เสร็จสิ้นโปรไฟล์',
      resumeApproved: 'อนุมัติประวัติย่อ',
      interviewScheduled: 'กำหนดการสัมภาษณ์แล้ว',
      paperlessWorkflow: 'เวิร์กโฟลว์ไร้กระดาษ',
    },

    // Announcements Data
    announcementsList: [
      {
        tag: 'สมัคร',
        title: 'รอบการสมัครฝึกงาน',
        date: 'ส.ค. 12, 2026',
        desc: 'การสมัครรอบที่ 2 สำหรับเทอม 2/2026 เปิดให้สมัครแล้วสำหรับนักเรียนที่สอบผ่าน',
      },
      {
        tag: 'กำหนดเวลา',
        title: 'กำหนดส่งเอกสาร',
        date: 'ส.ค. 20, 2026',
        desc: 'ส่งแบบฟอร์มข้อตกลง CWIE และแบบประกันภัยก่อนวันปิดรับสมัคร',
      },
      {
        tag: 'การอบรม',
        title: 'สัมมนาประวัติย่อ',
        date: 'ส.ค. 25, 2026',
        desc: 'เรียนรู้วิธีสร้างประวัติย่อที่โดดเด่นจากที่ปรึกษาด้านอาชีพของเรา',
      },
      {
        tag: 'กำหนดเวลา',
        title: 'เผยแพร่กำหนดการสัมภาษณ์',
        date: 'ก.ย. 01, 2026',
        desc: 'สล็อตสัมภาษณ์ของบริษัทได้รับการเผยแพร่ในแดชบอร์ดของคุณ',
      },
      {
        tag: 'การสรรหา',
        title: 'งานแรกจ้างของบริษัท',
        date: 'ก.ย. 08, 2026',
        desc: 'พบกับบริษัทคู่ค้า 15+ บริษัทที่สรรหาผู้สำเร็จการศึกษา CWIE เทอมนี้',
      },
    ],

    // Events Data
    eventsList: [
      {
        day: '25',
        month: 'ส.ค.',
        title: 'สัมมนาประวัติย่อ',
        time: '13:00 – 16:00',
        place: 'CIS Lab 4, ชั้น 6',
        label: 'เตรียมอาชีพ',
      },
      {
        day: '03',
        month: 'ก.ย.',
        title: 'งานแรกจ้างอาชีพ CIS 2026',
        time: '09:00 – 16:30',
        place: 'หอประชุม Navamindra',
        label: 'เครือข่าย',
      },
      {
        day: '12',
        month: 'ก.ย.',
        title: 'วันสัมภาษณ์จำลอง',
        time: '10:00 – 15:00',
        place: 'ห้องประชุม CIS',
        label: 'ฝึกซ้อม',
      },
    ],
  },
}

export function getTranslation(language: Language) {
  return translations[language]
}
