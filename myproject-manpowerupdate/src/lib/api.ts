import { supabase } from './supabase';
import type { Job, Application, Contact, Partner, Company } from './types';

// ---------- Jobs ----------
export async function getJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Job[];
}

export async function getActiveJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Job[];
}

export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Job | null;
}

export async function createJob(job: Partial<Job>): Promise<Job> {
  const { data, error } = await supabase.from('jobs').insert(job).select().single();
  if (error) throw error;
  return data as Job;
}

export async function updateJob(id: string, job: Partial<Job>): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .update(job)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Job;
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Applications ----------
export async function submitApplication(
  application: Omit<Application, 'id' | 'created_at'>,
  cvFile: File | null
): Promise<Application> {
  let cvFilePath = '';
  let cvFileName = '';

  if (cvFile) {
    const ext = cvFile.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from('cvs').upload(path, cvFile);
    if (upErr) throw upErr;
    cvFilePath = path;
    cvFileName = cvFile.name;
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      ...application,
      cv_file_path: cvFilePath,
      cv_file_name: cvFileName,
    });
  if (error) throw error;
  return { ...application, cv_file_path: cvFilePath, cv_file_name: cvFileName } as Application;
}

export async function getApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*, job:jobs(id, title, location)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Application[];
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from('applications').delete().eq('id', id);
  if (error) throw error;
}

export async function downloadCvFile(path: string, fileName: string) {
  const { data, error } = await supabase.storage.from('cvs').download(path);
  if (error) throw error;
  const blob = data;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'candidate-cv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ---------- Contacts ----------
export async function submitContact(contact: Omit<Contact, 'id' | 'created_at'>): Promise<Contact> {
  const { error } = await supabase.from('contacts').insert(contact);
  if (error) throw error;
  return contact as Contact;
}

export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Contact[];
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Partners ----------
export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data as Partner[];
}

export async function updatePartner(id: string, partner: Partial<Partner>): Promise<Partner> {
  const { data, error } = await supabase
    .from('partners')
    .update(partner)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Partner;
}

export async function createPartner(partner: Omit<Partner, 'id'>): Promise<Partner> {
  const { data, error } = await supabase
    .from('partners')
    .insert(partner)
    .select()
    .single();
  if (error) throw error;
  return data as Partner;
}

export async function uploadPartnerPhoto(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `partners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('photos').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Company ----------
export async function getCompany(): Promise<Company | null> {
  const { data, error } = await supabase.from('company').select('*').maybeSingle();
  if (error) throw error;
  return data as Company | null;
}

export async function updateCompany(company: Partial<Company>): Promise<Company> {
  const { data: existing } = await supabase.from('company').select('id').maybeSingle();
  let result;
  if (existing) {
    const { data, error } = await supabase
      .from('company')
      .update(company)
      .eq('id', (existing as Company).id as string)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase.from('company').insert(company).select().single();
    if (error) throw error;
    result = data;
  }
  return result as Company;
}
