import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Briefcase, FileText, Mail, Building2, LogOut, Users } from 'lucide-react';
import { logout } from '@/lib/auth';
import JobsTab from './JobsTab';
import ApplicationsTab from './ApplicationsTab';
import ContactsTab from './ContactsTab';
import CompanyTab from './CompanyTab';
import PartnersTab from './PartnersTab';

type Tab = 'jobs' | 'applications' | 'contacts' | 'partners' | 'company';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('jobs');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'jobs', label: t('admin.dashboard.jobs'), icon: Briefcase },
    { id: 'applications', label: t('admin.dashboard.applications'), icon: FileText },
    { id: 'contacts', label: t('admin.dashboard.contacts'), icon: Mail },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'company', label: t('admin.dashboard.company'), icon: Building2 },
  ];

  const onLogout = async () => {
    await logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Briefcase className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-slate-900">{t('admin.dashboard.title')}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            <LogOut className="h-4 w-4" /> {t('admin.dashboard.logout')}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside>
            <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 lg:flex-col">
              {tabs.map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    tab === tb.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <tb.icon className="h-4 w-4" /> {tb.label}
                </button>
              ))}
            </nav>
          </aside>

          <div>
            {tab === 'jobs' && <JobsTab />}
            {tab === 'applications' && <ApplicationsTab />}
            {tab === 'contacts' && <ContactsTab />}
            {tab === 'partners' && <PartnersTab />}
            {tab === 'company' && <CompanyTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
