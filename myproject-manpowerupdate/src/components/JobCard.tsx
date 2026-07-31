import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Briefcase, Users, ArrowRight } from 'lucide-react';
import type { Job } from '@/lib/types';

export default function JobCard({ job }: { job: Job }) {
  const { t } = useTranslation();

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100">
      <div className="flex flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {job.type || 'Full-time'}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-900">{job.title}</h3>
        {job.company && <p className="text-sm text-slate-500">{job.company}</p>}

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
          )}
          {job.category && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> {job.category}
            </span>
          )}
          {job.vacancies != null && job.vacancies > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {job.vacancies} {t('jobs.vacancies')}
            </span>
          )}
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {job.description || ''}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          {job.salary ? (
            <span className="text-sm font-semibold text-slate-900">{job.salary}</span>
          ) : (
            <span />
          )}
          <Link
            to={`/jobs/${job.id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 transition group-hover:gap-2.5"
          >
            {t('jobs.viewDetails')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
