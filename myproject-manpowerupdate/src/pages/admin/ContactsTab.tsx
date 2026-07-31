import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Loader2, Download } from 'lucide-react';
import { getContacts, deleteContact } from '@/lib/api';
import { downloadContactsExcel } from '@/lib/excelExport';
import type { Contact } from '@/lib/types';

export default function ContactsTab() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = () => {
    setLoading(true);
    getContacts().then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    await deleteContact(id);
    load();
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      await downloadContactsExcel(items);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Excel file could not be created.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{t('admin.contacts.title')}</h2>
        <button onClick={exportExcel} disabled={items.length === 0 || exporting} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download Excel
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">{t('admin.contacts.empty')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
                </div>
                <button onClick={() => remove(c.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {c.subject && <p className="mt-3 text-sm font-medium text-slate-700">{c.subject}</p>}
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.message}</p>
              <p className="mt-3 text-xs text-slate-400">{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
