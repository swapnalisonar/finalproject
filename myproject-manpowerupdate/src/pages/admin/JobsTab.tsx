import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, X, Loader2, Download } from 'lucide-react';
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/api';
import { downloadJobsExcel } from '@/lib/excelExport';
import type { Job } from '@/lib/types';

const empty: Partial<Job> = {
  title: '',
  company: '',
  location: '',
  type: 'Full-time',
  category: '',
  salary: '',
  description: '',
  requirements: [],
  vacancies: 1,
  is_active: true,
};

export default function JobsTab() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Job> | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const load = () => {
    setLoading(true);
    getJobs().then(setJobs).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...empty });
  const openEdit = (job: Job) => setEditing({ ...job, requirements: job.requirements || [] });

  const remove = async (id: string) => {
    if (!confirm(t('admin.jobs.confirmDelete'))) return;
    await deleteJob(id);
    load();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload = {
      ...editing,
      requirements: (editing.requirements || []).filter((r) => r.trim() !== ''),
    };
    try {
      if (editing.id) {
        await updateJob(editing.id, payload);
      } else {
        await createJob(payload);
      }
      setEditing(null);
      load();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      await downloadJobsExcel(jobs);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Excel file could not be created.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>;
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{t('admin.dashboard.jobs')}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportExcel} disabled={jobs.length === 0 || exporting} className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download Excel
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" /> {t('admin.jobs.add')}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">{t('admin.jobs.title')}</th>
              <th className="px-5 py-3">{t('jobs.location')}</th>
              <th className="px-5 py-3">{t('jobs.type')}</th>
              <th className="px-5 py-3">{t('admin.jobs.active')}</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">{job.title}</td>
                <td className="px-5 py-3 text-slate-600">{job.location || '—'}</td>
                <td className="px-5 py-3 text-slate-600">{job.type || '—'}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${job.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {job.is_active ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => openEdit(job)} className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(job.id)} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing.id ? t('admin.jobs.edit') : t('admin.jobs.add')}
              </h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <Field label={t('admin.jobs.title')}>
                <input required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="adm-input" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('admin.jobs.company')}>
                  <input value={editing.company || ''} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="adm-input" />
                </Field>
                <Field label={t('admin.jobs.location')}>
                  <input value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="adm-input" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('admin.jobs.type')}>
                  <input value={editing.type || ''} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className="adm-input" />
                </Field>
                <Field label={t('admin.jobs.category')}>
                  <input value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="adm-input" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('admin.jobs.salary')}>
                  <input value={editing.salary || ''} onChange={(e) => setEditing({ ...editing, salary: e.target.value })} className="adm-input" />
                </Field>
                <Field label={t('admin.jobs.vacancies')}>
                  <input type="number" min={0} value={editing.vacancies ?? 1} onChange={(e) => setEditing({ ...editing, vacancies: Number(e.target.value) })} className="adm-input" />
                </Field>
              </div>
              <Field label={t('admin.jobs.description')}>
                <textarea rows={4} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="adm-input" />
              </Field>
              <Field label={t('admin.jobs.requirements')}>
                <textarea
                  rows={4}
                  value={(editing.requirements || []).join('\n')}
                  onChange={(e) => setEditing({ ...editing, requirements: e.target.value.split('\n') })}
                  className="adm-input"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                {t('admin.jobs.active')}
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  {t('admin.jobs.cancel')}
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t('admin.jobs.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .adm-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(51 65 85);
          outline: none;
          transition: all 0.15s;
        }
        .adm-input:focus {
          border-color: rgb(96 165 250);
          box-shadow: 0 0 0 2px rgb(219 234 254);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
