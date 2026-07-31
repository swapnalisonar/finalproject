export interface Job {
  id: string;
  title: string;
  company?: string;
  location?: string;
  type?: string;
  category?: string;
  salary?: string;
  description?: string;
  requirements?: string[];
  vacancies?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface Application {
  id: string;
  job_id?: string | null;
  name: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  cv_file_path?: string;
  cv_file_name?: string;
  created_at?: string;
  job?: Job | null;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  created_at?: string;
}

export interface Partner {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  photo_url?: string;
  display_order?: number;
  phone?: string;
}

export interface Company {
  id?: string;
  name?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  map_embed_url?: string;
}
