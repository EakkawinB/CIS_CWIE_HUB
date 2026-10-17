import axios from 'axios';

import type {
  CompanyBrowse,
  PositionStatusFilter,
} from '../types/company';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  });

export default api;

export interface BrowseCompaniesParams {
  search?: string;
  province?: string;
  position_status?: PositionStatusFilter;
}

export async function browseCompanies(
  params: BrowseCompaniesParams = {}
): Promise<CompanyBrowse[]> {
  const response = await api.get<CompanyBrowse[]>(
    '/companies/browse',
    {
      params: {
        ...(params.search
          ? { search: params.search }
          : {}),

        ...(params.province
          ? { province: params.province }
          : {}),

        ...(params.position_status
          ? { position_status: params.position_status }
          : {}),
      },
    }
  );

  return response.data;
}

export interface DocumentResponseDto {
  id: number;
  document_type: string | null;
  status: string;
  uploaded_at: string | null;
}

export interface StudentProfileResponseDto {
  id: number;
  user_id: string | null;
  student_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  major: string | null;
  year: number | null;
  gpax: number | null;
  company_id: string | null;
  is_active: boolean | null;
}

export async function getMyDocuments(): Promise<DocumentResponseDto[]> {
  const response = await api.get<DocumentResponseDto[]>('/documents/me');
  return response.data;
}

export async function getMyStudentProfile(): Promise<StudentProfileResponseDto> {
  const response = await api.get<StudentProfileResponseDto>('/students/me');
  return response.data;
}

export interface ResumeResponseDto {
  id: number;
  document_type: string;
  status: string;
  uploaded_at: string | null;
}

export interface ResumeDownloadResponseDto {
  download_url: string;
  expires_in_seconds: number;
}

export async function getMyResume(): Promise<ResumeResponseDto | null> {
  try {
    const response = await api.get<ResumeResponseDto>('/documents/resume/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function uploadMyResume(file: File): Promise<ResumeResponseDto> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<ResumeResponseDto>(
    '/documents/resume/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

export async function getMyResumeDownload(): Promise<ResumeDownloadResponseDto> {
  const response = await api.get<ResumeDownloadResponseDto>(
    '/documents/resume/me/download'
  );
  return response.data;
}

export async function getStudentResumeForStaff(
  studentCode: string
): Promise<ResumeResponseDto> {
  const response = await api.get<ResumeResponseDto>(
    `/documents/resume/students/${encodeURIComponent(studentCode)}`
  );
  return response.data;
}

export async function getStudentResumeDownloadForStaff(
  studentCode: string
): Promise<ResumeDownloadResponseDto> {
  const response = await api.get<ResumeDownloadResponseDto>(
    `/documents/resume/students/${encodeURIComponent(studentCode)}/download`
  );
  return response.data;
}

export type ApplicationStatus =
  | 'applied'
  | 'interview_scheduled'
  | 'waiting_result'
  | 'accepted'
  | 'rejected';

export type InterviewChannel = 'online' | 'onsite' | 'phone';

export interface ApplicationResponseDto {
  application_id: string;
  student_id: number;
  position_id: string;
  status: ApplicationStatus;
  interview_at: string | null;
  interview_channel: InterviewChannel | null;
  interview_location: string | null;
  interview_details: string | null;
  interview_attended: boolean | null;
  interview_completed_at: string | null;
  rejection_reason: string | null;
  outcome_recorded_by: string | null;
  outcome_recorded_at: string | null;
  applied_at: string;
  created_at: string;
  updated_at: string;
}

export interface InternshipResponseDto {
  internship_id: string;
  application_id: string;
  student_id: number;
  position_id: string;
  status: 'placed' | 'closed';
  start_date: string | null;
  end_date: string | null;
  placed_at: string;
  closed_at: string | null;
  closed_by_staff_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchingResponseDto {
  active_application: ApplicationResponseDto | null;
  internship: InternshipResponseDto | null;
  application_history: ApplicationResponseDto[];
}

export interface StaffApplicationListResponseDto {
  items: StaffApplicationResponseDto[];
  page: number;
  page_size: number;
  total: number;
}

export interface StaffApplicationResponseDto extends ApplicationResponseDto {
  student_name: string | null;
  student_code: string | null;
  company_name: string | null;
  position_name: string | null;
}

export interface InterviewScheduleRequestDto {
  interview_at: string;
  interview_channel: InterviewChannel;
  interview_location?: string | null;
  interview_details?: string | null;
}

export async function submitApplication(
  positionId: string
): Promise<ApplicationResponseDto> {
  const response = await api.post<ApplicationResponseDto>('/applications', {
    position_id: positionId,
  });
  return response.data;
}

export async function getMyMatching(): Promise<MatchingResponseDto> {
  const response = await api.get<MatchingResponseDto>('/matching/me');
  return response.data;
}

export async function getStaffApplications(
  page = 1,
  pageSize = 100
): Promise<StaffApplicationListResponseDto> {
  const response = await api.get<StaffApplicationListResponseDto>(
    '/staffs/applications',
    { params: { page, page_size: pageSize } }
  );
  return response.data;
}

export async function scheduleApplicationInterview(
  applicationId: string,
  data: InterviewScheduleRequestDto
): Promise<ApplicationResponseDto> {
  const response = await api.patch<ApplicationResponseDto>(
    `/staffs/applications/${encodeURIComponent(applicationId)}/interview`,
    data
  );
  return response.data;
}

export async function recordApplicationAttendance(
  applicationId: string,
  attended: boolean
): Promise<ApplicationResponseDto> {
  const response = await api.patch<ApplicationResponseDto>(
    `/staffs/applications/${encodeURIComponent(applicationId)}/attendance`,
    { attended }
  );
  return response.data;
}

export async function moveApplicationToWaitingResult(
  applicationId: string
): Promise<ApplicationResponseDto> {
  const response = await api.patch<ApplicationResponseDto>(
    `/staffs/applications/${encodeURIComponent(applicationId)}/waiting-result`
  );
  return response.data;
}

export async function acceptApplication(
  applicationId: string
): Promise<InternshipResponseDto> {
  const response = await api.post<InternshipResponseDto>(
    `/staffs/applications/${encodeURIComponent(applicationId)}/accept`
  );
  return response.data;
}

export async function rejectApplication(
  applicationId: string,
  rejectionReason: string | null
): Promise<ApplicationResponseDto> {
  const response = await api.patch<ApplicationResponseDto>(
    `/staffs/applications/${encodeURIComponent(applicationId)}/reject`,
    { rejection_reason: rejectionReason }
  );
  return response.data;
}

export function getApiErrorStatus(error: unknown): number | null {
  return axios.isAxiosError(error) ? error.response?.status ?? null : null;
}

export interface EligibleAdvisorStudentDto {
  student_id: number;
  student_code: string | null;
  student_name: string;
  internship_id: string;
  company_name: string;
  position_name: string;
  internship_status: string;
  start_date: string | null;
  end_date: string | null;
}

export interface ActiveAdvisorDto {
  advisor_id: string;
  advisor_name: string;
  department: string | null;
}

export interface AdvisorAssignmentDto {
  assignment_id: string;
  student_id: number;
  student_code: string | null;
  student_name: string;
  advisor_id: string;
  advisor_name: string;
  company_name: string;
  position_name: string;
  internship_status: string;
  start_date: string | null;
  end_date: string | null;
  assigned_at: string;
}

export interface AdvisorStudentDto {
  student_id: number;
  student_code: string | null;
  student_name: string;
  email: string;
  company_name: string;
  position_name: string;
  internship_status: string;
  start_date: string | null;
  end_date: string | null;
}

export interface StudentAdvisorDto {
  advisor_id: string | null;
  advisor_name: string | null;
}

export async function getEligibleAdvisorStudents(): Promise<EligibleAdvisorStudentDto[]> {
  const response = await api.get<EligibleAdvisorStudentDto[]>(
    '/staffs/advisor-assignments/eligible-students'
  );
  return response.data;
}

export async function getActiveAdvisors(): Promise<ActiveAdvisorDto[]> {
  const response = await api.get<ActiveAdvisorDto[]>(
    '/staffs/advisor-assignments/active-advisors'
  );
  return response.data;
}

export async function getAdvisorAssignments(): Promise<AdvisorAssignmentDto[]> {
  const response = await api.get<AdvisorAssignmentDto[]>(
    '/staffs/advisor-assignments'
  );
  return response.data;
}

export async function createAdvisorAssignment(
  studentId: number,
  advisorId: string
): Promise<AdvisorAssignmentDto> {
  const response = await api.post<AdvisorAssignmentDto>(
    '/staffs/advisor-assignments',
    { student_id: studentId, advisor_id: advisorId }
  );
  return response.data;
}

export async function getMyAdvisorStudents(): Promise<AdvisorStudentDto[]> {
  const response = await api.get<AdvisorStudentDto[]>('/advisors/me/students');
  return response.data;
}

export async function getMyAdvisor(): Promise<StudentAdvisorDto> {
  const response = await api.get<StudentAdvisorDto>('/students/me/advisor');
  return response.data;
}
