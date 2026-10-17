import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function LanguageSwitcher({ className = '', onNotify }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith('th') ? 'th' : 'en';

  return (
    <div className={`flex items-center bg-slate-100/80 border border-slate-200/50 rounded-xl p-0.5 shadow-xs shrink-0 ${className}`}>
      <button
        type="button"
        onClick={async () => {
          if (language !== 'en') {
            await i18n.changeLanguage('en');
            localStorage.setItem('cwie_language', 'en');
            
            if (onNotify) {
              onNotify(i18n.t('switch_lang'), 'success');
            }
          }
        }}
   
        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer select-none ${
          language === 'en' 
            ? 'bg-blue-600 text-white shadow-xs' 
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={async () => {
          if (language !== 'th') {
            await i18n.changeLanguage('th');
            localStorage.setItem('cwie_language', 'th');
        
            if (onNotify) {
              onNotify(t('switch_lang'), 'success');
            }
          }
        }}
        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer select-none ${
          language === 'th' 
            ? 'bg-blue-600 text-white shadow-xs' 
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        TH
      </button>
    </div>
  );
}
