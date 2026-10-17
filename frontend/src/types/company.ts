export interface PositionBrowse {
  position_id: string;
  company_id: string;
  position_name: string;
  description: string | null;
  requirements: string[] | null;
  salary: number | string | null;
  project_topic: string | null;
  capacity: number | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
}

export interface CompanyBrowse {
  company_id: string;
  company_name: string;
  industry: string | null;
  description: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  province: string | null;
  website: string | null;
  positions: PositionBrowse[];
}

export type PositionStatusFilter = '' | 'open' | 'closed';
