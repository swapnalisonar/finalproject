import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Loader2, Send, CheckCircle2, ExternalLink, Map } from 'lucide-react';
import { submitContact } from '@/lib/api';
import { useCompany } from '@/lib/useCompany';

export default function Contact() {
  const { t } = useTranslation();
  const { company } = useCompany();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const rawMap = company?.map_embed_url?.trim() || '';
  const isMapsLink = /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|www\.google\.com\/maps|maps\.google\.com)/i.test(rawMap);
  const mapsLink = isMapsLink ? rawMap : 'https://www.google.com/maps/search/?api=1&query=Kalyan+Maharashtra';

  return (
    <>
      <section className="bg-slate-900 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t('contact.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          {/* Info */}
          <div>
            <div className="space-y-5">
              {company?.address && (
                <InfoRow icon={MapPin} label={t('contact.address')} value={company.address} />
              )}
              {company?.phone && (
                <InfoRow icon={Phone} label={t('contact.phoneLabel')} value={company.phone} />
              )}
              {company?.email && (
                <InfoRow icon={Mail} label={t('contact.emailLabel')} value={company.email} />
              )}
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                {t('contact.findUs')}
              </h3>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
              >
                <Map className="h-5 w-5" />
                Open in Google Maps
                <ExternalLink className="h-4 w-4 opacity-80" />
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {status === 'success' && (
              <div className="mb-5 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {t('contact.success')}
              </div>
            )}
            {status === 'error' && (
              <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {t('contact.error')}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('contact.name')}>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                </Field>
                <Field label={t('contact.email')}>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('contact.phone')}>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
                </Field>
                <Field label={t('contact.subject')}>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input" />
                </Field>
              </div>
              <Field label={t('contact.message')}>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input" />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t('contact.submit')}
              </button>
            </form>
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

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-1 text-sm text-slate-700">{value}</p>
      </div>
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
