import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building2, Award, Handshake, Linkedin, Mail } from 'lucide-react';
import { useCompany } from '@/lib/useCompany';
import { getPartners } from '@/lib/api';
import type { Partner } from '@/lib/types';

export default function Home() {
  const { t } = useTranslation();
  const { company } = useCompany();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    getPartners().then(setPartners).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-900/70" />

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {company?.tagline || 'Trusted Recruitment Partner'}
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              {t('hero.subtitle')}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/jobs"
                className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                {t('hero.cta')}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                {t('hero.secondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
            {[
              { icon: Users, value: '500+', label: 'Professionals Placed' },
              { icon: Building2, value: '120+', label: 'Client Companies' },
              { icon: Award, value: '15+', label: 'Years Experience' },
              { icon: Handshake, value: '98%', label: 'Retention Rate' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="mx-auto h-7 w-7 text-blue-600" />
                <p className="mt-3 text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company description */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                {t('about.title')}
              </span>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                {t('about.heading')}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate-600">
                {company?.description || t('about.body')}
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-semibold text-slate-900">{t('about.missionTitle')}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t('about.mission')}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-semibold text-slate-900">{t('about.visionTitle')}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t('about.vision')}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-1 gap-4 rounded-[28px] border border-slate-200 bg-white/80 p-3 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] backdrop-blur md:grid-cols-2">
                {[
                  {
                    src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
                    alt: 'Modern hospital with doctors and medical equipment',
                  },
                  {
                    src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
                    alt: 'Professional security guard in a corporate setting',
                  },
                  {
                    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
                    alt: 'IT office workspace with software developers and computers',
                  },
                  {
                    src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
                    alt: 'Banking and financial services team at work',
                  },
                ].map((image) => (
                  <div
                    key={image.alt}
                    className="group relative aspect-square overflow-hidden rounded-2xl shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:block">
                <p className="text-3xl font-bold text-blue-600">15+</p>
                <p className="text-sm text-slate-500">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team members */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              {t('owner.title')}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              {t('about.heading')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
              {t('about.body')}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
            {partners.map((p) => (
              <div
                key={p.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100 sm:h-60">
                  <img
                    src={p.photo_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={p.name}
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
                  <p className="text-sm font-medium text-blue-600">{p.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.bio}</p>
                  <div className="mt-4 flex gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-blue-600">
                      <Linkedin className="h-4 w-4" />
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-blue-600">
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
