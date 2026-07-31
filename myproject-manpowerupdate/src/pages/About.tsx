import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Eye, Heart, CheckCircle2, Linkedin, Mail, Phone } from 'lucide-react';
import { useCompany } from '@/lib/useCompany';
import { getPartners } from '@/lib/api';
import type { Partner } from '@/lib/types';

export default function About() {
  const { t } = useTranslation();
  const { company } = useCompany();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    getPartners().then(setPartners).catch(() => {});
  }, []);

  return (
    <>
      <section className="bg-slate-900 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            {t('about.title')}
          </span>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t('about.heading')}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            {company?.description || t('about.body')}
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Target, title: t('about.missionTitle'), body: t('about.mission') },
              { icon: Eye, title: t('about.visionTitle'), body: t('about.vision') },
              { icon: Heart, title: t('about.valuesTitle'), body: t('about.values') },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team members */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              {t('owner.title')}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              {t('about.heading')}
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {partners.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden sm:h-60">
                  <img
                    src={p.photo_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
                  <p className="text-sm font-medium text-blue-600">{p.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.bio}</p>
                  {p.phone && (
                    <a
                      href={`tel:${p.phone.replace(/\s+/g, '')}`}
                      className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-blue-600"
                    >
                      <Phone className="h-4 w-4 text-blue-600" /> {p.phone}
                    </a>
                  )}
                  <div className="mt-4 flex gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:text-blue-600">
                      <Linkedin className="h-4 w-4" />
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:text-blue-600">
                      <Mail className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
