import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Loader2, Download } from 'lucide-react';
import { getApplications, deleteApplication, downloadCvFile } from '@/lib/api';
import { downloadApplicationsExcel } from '@/lib/excelExport';
import type { Application } from '@/lib/types';

export default function ApplicationsTab() {
  const { t } = useTranslation();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getApplications().then(setApps).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    await deleteApplication(id);
    load();
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      await downloadApplicationsExcel(apps);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Excel file could not be created.');
    } finally {
      setExporting(false);
    }
  };

  const downloadCv = async (application: Application) => {
    if (!application.cv_file_path) return;
    setDownloadingId(application.id);
    try {
      await downloadCvFile(application.cv_file_path, application.cv_file_name || `${application.name}-cv`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'CV could not be downloaded.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{t('admin.applications.title')}</h2>
        <button onClick={exportExcel} disabled={apps.length === 0 || exporting} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download Excel
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
      ) : apps.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">{t('admin.applications.empty')}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">{t('admin.applications.applicant')}</th>
                <th className="px-5 py-3">{t('admin.applications.job')}</th>
                <th className="px-5 py-3">{t('contact.phoneLabel')}</th>
                <th className="px-5 py-3">{t('admin.applications.resume')}</th>
                <th className="px-5 py-3">{t('admin.applications.date')}</th>
                <th className="px-5 py-3 text-right">{t('admin.applications.delete')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">{a.name}</p>
                    <p className="text-xs text-slate-500">{a.email}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{a.job?.title || '—'}</td>
                  <td className="px-5 py-3 text-slate-600">{a.phone || '—'}</td>
                  <td className="px-5 py-3">
                    {a.cv_file_path ? (
                      <div className="flex flex-col items-start gap-1.5">
                        <button onClick={() => downloadCv(a)} disabled={downloadingId === a.id} className="inline-flex items-center gap-1 text-emerald-700 hover:underline disabled:opacity-60">
                          {downloadingId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                          Download CV
                        </button>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => remove(a.id)} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
