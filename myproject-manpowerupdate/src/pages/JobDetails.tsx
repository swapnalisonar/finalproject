import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Briefcase,
  Users,
  Wallet,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Upload,
} from 'lucide-react';
import { getJob, submitApplication } from '@/lib/api';
import type { Job } from '@/lib/types';

export default function JobDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [cv, setCv] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!id) return;
    getJob(id)
      .then(setJob)
      .catch(() => {})
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0 });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    setStatus('idle');
    try {
      await submitApplication(
        {
          job_id: job.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          cover_letter: form.coverLetter,
        },
        cv
      );
      setStatus('success');
      setForm({ name: '', email: '', phone: '', coverLetter: '' });
      setCv(null);
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-32 text-center">
        <p className="text-slate-500">Job not found.</p>
        <Link to="/jobs" className="mt-4 inline-block text-blue-600 hover:underline">
          {t('jobs.back')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> {t('jobs.back')}
          </Link>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {job.title}
          </h1>
          {job.company && <p className="mt-2 text-lg text-slate-300">{job.company}</p>}
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {job.location}
              </span>
            )}
            {job.type && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" /> {job.type}
              </span>
            )}
            {job.vacancies != null && (
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {job.vacancies} {t('jobs.vacancies')}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1.5">
                <Wallet className="h-4 w-4" /> {job.salary}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-xl font-semibold text-slate-900">{t('jobs.description')}</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {job.description}
              </p>

              {job.requirements && job.requirements.length > 0 && (
                <>
                  <h2 className="mt-8 text-xl font-semibold text-slate-900">
                    {t('jobs.requirements')}
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Apply form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{t('apply.title')}</h2>

              {status === 'success' && (
                <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {t('apply.success')}
                </div>
              )}
              {status === 'error' && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {t('apply.error')}
                </div>
              )}

              <form onSubmit={submit} className="mt-4 space-y-4">
                <Field label={t('apply.name')}>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label={t('apply.email')}>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label={t('apply.phone')}>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label={t('apply.coverLetter')}>
                  <textarea
                    rows={3}
                    value={form.coverLetter}
                    onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label={t('apply.resume')}>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 transition hover:border-blue-400 hover:bg-blue-50">
                    <Upload className="h-4 w-4" />
                    {cv ? cv.name : t('apply.resume')}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setCv(e.target.files?.[0] || null)}
                    />
                  </label>
                </Field>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t('apply.submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(51 65 85);
          outline: none;
          transition: all 0.15s;
        }
        .input:focus {
          border-color: rgb(96 165 250);
          box-shadow: 0 0 0 2px rgb(219 234 254);
        }
      `}</style>
    </>
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
