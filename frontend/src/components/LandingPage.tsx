import React from 'react';
import { Shield, Sparkles, Calendar, BookOpen, GraduationCap, Users, FileCheck, ArrowRight, Compass, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CISLogo from './CISLogo';
import LanguageSwitcher from './LanguageSwitcher';

interface LandingPageProps {
  onStartLogin: () => void;
  onExploreDesignSystem: () => void;
}

export default function LandingPage({ onStartLogin, onExploreDesignSystem }: LandingPageProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-50/50 min-h-screen flex flex-col font-sans" id="landing-page-root">
      
      {/* Sleek Department Header */}
      <header className="bg-white border-b border-slate-100 py-3.5 px-6 sticky top-0 z-45 backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <CISLogo size="lg" />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={onExploreDesignSystem}
              className="px-3.5 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-xl transition-all cursor-pointer hidden sm:block"
            >
              {t('explore_ds')}
            </button>
            <button
              onClick={onStartLogin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              {t('portal_access')}
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Banner */}
      <div className="relative bg-white overflow-hidden border-b border-slate-100 py-20 px-6">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" style={{ backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              <GraduationCap className="h-4 w-4" />
              {t('official_portal')}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none font-sans">
              CIS Cooperative <br />
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('portal_title')}
              </span>
            </h1>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xl">
              {t('landing_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onStartLogin}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-100 transition-all active:scale-95 cursor-pointer"
              >
                {t('start_matching')}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onExploreDesignSystem}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-sm rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                {t('explore_ds')}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-square bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
              {/* Background accent ring */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 border-4 border-white/10 rounded-full" />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                  <Award className="h-6 w-6 text-blue-200" />
                </div>
                <span className="text-xs font-mono text-blue-100 uppercase bg-blue-500/20 px-2.5 py-1 rounded-lg">
                  {t('academic_year')}
                </span>
              </div>

              <div className="relative z-10 space-y-4">
                <p className="text-lg md:text-2xl font-semibold tracking-tight leading-snug">
                  {t('hero_quote')}
                </p>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs text-blue-100 font-mono">
                  <span>{t('cis_dept')}</span>
                  <span>{t('verified_inst')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-50 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center">
            <span className="block text-3xl font-extrabold text-blue-600">{t('stats_1')}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{t('stats_1_lbl')}</span>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center">
            <span className="block text-3xl font-extrabold text-blue-600">{t('stats_2')}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{t('stats_2_lbl')}</span>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center">
            <span className="block text-3xl font-extrabold text-blue-600">{t('stats_3')}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{t('stats_3_lbl')}</span>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-center">
            <span className="block text-3xl font-extrabold text-blue-600">{t('stats_4')}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{t('stats_4_lbl')}</span>
          </div>
        </div>
      </div>

      {/* About Cooperative Education */}
      <div className="max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 text-left space-y-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
            <Compass className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            {t('cwie_paradigm_title')}
          </h2>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
            {t('cwie_paradigm_desc')}
          </p>
          <ul className="space-y-2 text-xs md:text-sm text-slate-600 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {t('cwie_bullet_1')}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {t('cwie_bullet_2')}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {t('cwie_bullet_3')}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-slate-800 text-sm">{t('for_students')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('for_students_desc')}
            </p>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-2">
            <Users className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-slate-800 text-sm">{t('for_advisors')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('for_advisors_desc')}
            </p>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-slate-800 text-sm">{t('for_supervisors')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('for_supervisors_desc')}
            </p>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-2">
            <FileCheck className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-slate-800 text-sm">{t('for_staff')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('for_staff_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* University branded footer */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <div className="mb-2">
              <CISLogo size="md" />
            </div>
            <p className="text-xs text-slate-400">
              {t('footer_subtitle')}
            </p>
          </div>
          <div className="flex gap-4 text-xs text-slate-500 font-medium">
            <button onClick={onStartLogin} className="hover:text-blue-600 transition-colors cursor-pointer">{t('portal_access')}</button>
            <button onClick={onExploreDesignSystem} className="hover:text-blue-600 transition-colors cursor-pointer">{t('design_guidelines')}</button>
            <a href="https://mail.google.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">{t('staff_email')}</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-50 text-center text-[11px] text-slate-400 font-mono">
          {t('footer_copyright')}
        </div>
      </footer>

    </div>
  );
}

// Helper checkbox icon
function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
