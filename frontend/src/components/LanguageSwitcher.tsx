import React from 'react';
import { useLanguage } from '../LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function LanguageSwitcher({ className = '', onNotify }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`flex items-center bg-slate-100/80 border border-slate-200/50 rounded-xl p-0.5 shadow-xs shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => {
          if (language !== 'en') {
            setLanguage('en');
            if (onNotify) {
              onNotify(t('switch_lang'), 'success');
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
        onClick={() => {
          if (language !== 'th') {
            setLanguage('th');
            if (onNotify) {
              onNotify('เปลี่ยนภาษาเป็นภาษาไทยสำเร็จ', 'success');
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
