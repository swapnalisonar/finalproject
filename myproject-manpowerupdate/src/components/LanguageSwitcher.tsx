import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('hi') ? 'hi' : 'en';

  const change = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-0.5 text-xs font-medium">
      <Globe className="ml-1.5 h-3.5 w-3.5 text-slate-500" />
      <button
        onClick={() => change('en')}
        className={`rounded-full px-2.5 py-1 transition ${
          current === 'en'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 hover:text-blue-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => change('hi')}
        className={`rounded-full px-2.5 py-1 transition ${
          current === 'hi'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 hover:text-blue-600'
        }`}
      >
        हिं
      </button>
    </div>
  );
}
