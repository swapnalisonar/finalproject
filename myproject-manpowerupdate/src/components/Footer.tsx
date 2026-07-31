import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useCompany } from '@/lib/useCompany';

export default function Footer() {
  const { t } = useTranslation();
  const { company } = useCompany();

  const year = new Date().getFullYear();
  const name = company?.name || 'MATA RAMABAI A1 MANPOWER COMPANY';

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-slate-600 shadow-md">
                <img
                  src="/ramabai-logo.jpeg"
                  alt="Mata Ramabai logo"
                  className="h-full w-full object-cover object-center"
                />
              </span>
              <span className="text-lg font-bold text-white">{name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              {company?.tagline || t('footer.about')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.quickLinks')}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-blue-400">{t('nav.home')}</Link></li>
              <li><Link to="/about" className="hover:text-blue-400">{t('nav.about')}</Link></li>
              <li><Link to="/jobs" className="hover:text-blue-400">{t('nav.jobs')}</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.contact')}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {company?.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <span>{company.address}</span>
                </li>
              )}
              {company?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-blue-400" />
                  <span>{company.phone}</span>
                </li>
              )}
              {company?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                  <span>{company.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {year} {name}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
