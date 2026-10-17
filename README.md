# CIS CWIE Hub

CIS CWIE Hub is a web application for managing the Cooperative and Work-Integrated Education (CWIE) process of the Department of Computer and Information Science.

The system supports the entire CWIE workflow, including company management, student-company matching, document management, supervision, examination management, evaluation, and reporting.

---

## Quick Start

### Prerequisites
- Node.js (v18+) for frontend
- Python (v3.9+) for backend  
- Redis for OTP storage
- PostgreSQL/Supabase for database

### Installation & Running

**See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.**

**Quick:**
```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Redis (if local)
redis-server
```

Then visit: **http://localhost:3000**

### Automated Startup (Windows)
```powershell
.\run-dev.ps1
```

### Automated Startup (macOS/Linux)
```bash
chmod +x run-dev.sh
./run-dev.sh
```

---

# Project Scope

# 1. User Scope

The system supports 4 types of users:

## 1. Student

Students can:

### Dashboard
- View internship position information
- View internship start and end dates
- View CWIE process timeline
- View upcoming required documents
- Track document status
- View examination information

### Companies
- Search available companies
- View company information and internship positions
- Submit internship applications (one company per student)
- Track matching status
- View interview location
- Accept or reject internship offers

### Documents
- View document status
- Download document templates

### Weekly Diary
- Record weekly work details
- Record problems and obstacles
- Track submitted document status

### Timesheet
- Upload timesheet documents
- Submit documents requiring mentor signatures
- Track approval status

### Examination
- View examination schedule
- View examination room information
- View examiner information
- Upload presentation documents
- Check-in for examination

### Profile
- Edit personal information
- Upload resume

---

# 2. Advisor

## Dashboard

Advisers can:

- View assigned students
- View pending documents
- View supervision schedules
- View examination evaluation tasks
- View urgent tasks

---

## Students

- View assigned students
- View student details:
  - Company
  - Internship position
  - Internship period

---

## Documents

- Review student documents
- View document status by student

---

## Weekly Diary Review

- Review weekly diaries
- Add comments
- Approve weekly diaries

---

## Cooperative Visit

- Schedule student supervision visits
- Manage visit calendar
- Confirm supervision completion

---

## Examination

- Review examination documents
- Evaluate student presentations
- Provide feedback comments

---

## Profile

- Edit profile information

---

# 3. Mentor

## Dashboard

Mentors can:

- View assigned students
- View documents waiting for approval
- View evaluation tasks
- View urgent tasks

---

## Students

- View assigned students
- View student information:
  - Internship position
  - Internship period

---

## Timesheet Review

- Review student timesheets
- Add comments
- Sign documents

---

## Evaluation

- Evaluate student internship performance
- Provide feedback comments

---

## Profile

- Edit profile information

---

# 4. Staff

## Dashboard

Staff can view:

- Total CWIE students in current year
- Total companies
- Students who received internship placements
- Student document status
- Adviser supervision statistics
- Student position statistics
- Pass/fail statistics

---

# Company Management

Staff can:

- View all companies
- Add company information
- Add internship positions
- Search companies

---

# Student Management

Staff can:

- View all students
- Separate students by program:
  - Regular
  - Special program
  - International program

- View student details
- Search students

---

# Student Status

- View students with internship placement
- View students without internship placement
- Search students

---

# Adviser Management

- View all advisers
- Search advisers
- Match students with advisers

---

# Cooperative Visit Management

- View adviser supervision information
- Track completed and incomplete visits
- Search supervision records

---

# Mentor Management

- View all mentors
- Group mentors by company
- View assigned students

---

# Document Management

## Student Documents

- Manage resume documents

## Adviser Documents

- Manage weekly diary documents
- Track approval status

## Mentor Documents

- Manage timesheet documents
- Track approval status

---

# Examination Management

Staff can:

- Define examination scoring criteria
- Create examination schedules
- Manage examination rooms
- Assign students to examination rooms
- Assign examiners
- Manage presentation schedules

---

# Evaluation Management

## Adviser Evaluation

- Calculate scores from examiners
- Display pass/fail status by topic

## Mentor Evaluation

- Display internship evaluation scores

## Final Evaluation

- Calculate final scores from advisers and mentors
- Display student pass/fail results

---

# Reports

- Export documents as PDF
- Generate CWIE reports

---

# Settings

## Profile

- Edit profile information

---

# System Navigation

The system provides:

- Language switching (TH/EN)
- Account status
- Notification system
- User profile management