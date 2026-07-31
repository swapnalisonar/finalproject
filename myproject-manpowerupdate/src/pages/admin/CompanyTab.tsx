import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { getCompany, updateCompany } from '@/lib/api';
import { clearCompanyCache } from '@/lib/useCompany';
import type { Company } from '@/lib/types';

const empty: Company = {
  name: '',
  tagline: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  map_embed_url: '',
};

export default function CompanyTab() {
  const { t } = useTranslation();
  const [data, setData] = useState<Company>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCompany().then((c) => setData({ ...empty, ...c })).finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateCompany(data);
      setData(updated);
      clearCompanyCache();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>;
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> {t('admin.company.saved')}
        </div>
      )}

      <Card title={t('admin.company.title')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={t('admin.company.name')} value={data.name || ''} onChange={(v) => setData({ ...data, name: v })} />
          <Input label={t('admin.company.tagline')} value={data.tagline || ''} onChange={(v) => setData({ ...data, tagline: v })} />
        </div>
        <TextArea label={t('admin.company.description')} value={data.description || ''} onChange={(v) => setData({ ...data, description: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={t('admin.company.email')} value={data.email || ''} onChange={(v) => setData({ ...data, email: v })} />
          <Input label={t('admin.company.phone')} value={data.phone || ''} onChange={(v) => setData({ ...data, phone: v })} />
        </div>
        <Input label={t('admin.company.address')} value={data.address || ''} onChange={(v) => setData({ ...data, address: v })} />
        <Input label={t('admin.company.mapEmbedUrl')} value={data.map_embed_url || ''} onChange={(v) => setData({ ...data, map_embed_url: v })} />
      </Card>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {t('admin.company.save')}
      </button>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-base font-semibold text-slate-900">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
