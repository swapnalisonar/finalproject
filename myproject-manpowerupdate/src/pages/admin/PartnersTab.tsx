import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Save, Upload, CheckCircle2, Plus } from 'lucide-react';
import { createPartner, getPartners, updatePartner, uploadPartnerPhoto } from '@/lib/api';
import type { Partner } from '@/lib/types';

function errorMessage(err: unknown, fallback: string) {
  if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
    return err.message;
  }
  return fallback;
}

export default function PartnersTab() {
  const { t } = useTranslation();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPartners().then(setPartners).finally(() => setLoading(false));
  }, []);

  const save = async (p: Partner) => {
    setSavingId(p.id);
    setError(null);
    try {
      const details = {
        name: p.name,
        title: p.title,
        bio: p.bio,
        photo_url: p.photo_url,
      };
      const detailsWithPhone = p.phone ? { ...details, phone: p.phone } : details;
      const isNew = p.id.startsWith('draft-');
      const updated = isNew
        ? await createPartner({ ...detailsWithPhone, display_order: p.display_order })
        : await updatePartner(p.id, detailsWithPhone);
      setPartners((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      setSavedId(updated.id);
      setTimeout(() => setSavedId(null), 2500);
    } catch (err) {
      console.error('Could not save team member:', err);
      setError(errorMessage(err, 'Could not save this team member.'));
    } finally {
      setSavingId(null);
    }
  };

  const onPhoto = async (p: Partner, file: File) => {
    setUploadingId(p.id);
    setError(null);
    try {
      const url = await uploadPartnerPhoto(file);
      if (p.id.startsWith('draft-')) {
        setPartners((prev) => prev.map((x) => (x.id === p.id ? { ...x, photo_url: url } : x)));
      } else {
        const updated = await updatePartner(p.id, { photo_url: url });
        setPartners((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      }
    } catch (err) {
      console.error('Could not upload team photo:', err);
      setError(errorMessage(err, 'Photo upload failed.'));
    } finally {
      setUploadingId(null);
    }
  };

  const addPartner = () => {
    setError(null);
    setPartners((prev) => [
      ...prev,
      {
        id: `draft-${Date.now()}`,
        name: 'New Team Member',
        title: '',
        bio: '',
        photo_url: '',
        phone: '',
        display_order: Math.max(0, ...prev.map((p) => p.display_order || 0)) + 1,
      },
    ]);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>;
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{t('owner.title')}</h2>
        <button
          onClick={addPartner}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </button>
      </div>
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        {partners.map((p) => (
        <div
  key={p.id}
  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
>
            {savedId === p.id && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved
              </div>
            )}
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
<div className="h-56 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-60">
    {p.photo_url ? (
      <img
        src={p.photo_url}
        alt={p.name}
        className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
      />
    ) : (
      <div className="flex h-full items-center justify-center text-slate-400">
        No Photo
      </div>
    )}
  </div>
</div>
           <label className="mb-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100">
              {uploadingId === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onPhoto(p, f);
                }}
              />
            </label>
            <div className="space-y-3">
              <Field label="Name">
                <input value={p.name} onChange={(e) => setPartners((prev) => prev.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)))} className="adm-input" />
              </Field>
              <Field label="Title">
                <input value={p.title || ''} onChange={(e) => setPartners((prev) => prev.map((x) => (x.id === p.id ? { ...x, title: e.target.value } : x)))} className="adm-input" />
              </Field>
              <Field label="Phone Number">
                <input value={p.phone || ''} onChange={(e) => setPartners((prev) => prev.map((x) => (x.id === p.id ? { ...x, phone: e.target.value } : x)))} placeholder="+91 7021797373" className="adm-input" />
              </Field>
              <Field label="Bio">
                <textarea rows={4} value={p.bio || ''} onChange={(e) => setPartners((prev) => prev.map((x) => (x.id === p.id ? { ...x, bio: e.target.value } : x)))} className="adm-input" />
              </Field>
              <button
                onClick={() => save(p)}
                disabled={savingId === p.id}
className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-60"
              >
                {savingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {p.id.startsWith('draft-') ? 'Create Team Member' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .adm-input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #dbe4ee;
  background: white;
  padding: 12px 14px;
  font-size: 14px;
  color: #334155;
  transition: 0.2s;
}

.adm-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37,99,235,.15);
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
