import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { 
  Shield, Sparkles, Calendar, BookOpen, GraduationCap, Users, FileCheck, ArrowRight, Compass, Award, 
  Building2, CheckCircle2, ChevronRight, Lock, Key, Clock, Check, Search, ShieldCheck, Bell, Megaphone, AlertCircle, FileText,
  Download, HelpCircle, ChevronDown, ExternalLink, Briefcase, TrendingUp, CheckCircle, Volume2, Sparkle
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import cisLogo from '../assets/images/61.png';
import LanguageSwitcher from './LanguageSwitcher';
import { triggerConfetti } from '../utils/confetti';

interface LandingPageProps {
  onStartLogin: () => void;
  onExploreDesignSystem: () => void;
  onQuickSelectRole?: (role: 'student' | 'advisor' | 'supervisor' | 'staff') => void;
}

export default function LandingPage({ onStartLogin, onExploreDesignSystem, onQuickSelectRole }: LandingPageProps) {
  const { t, language } = useLanguage();
  
  // Ticker announcement items
  const announcements = [
    {
      id: 1,
      tag: t('announce_urgent'),
      tagBg: 'bg-rose-500 text-white',
      text: t('announce_1_text')
    },
    {
      id: 2,
      tag: t('announce_schedule'),
      tagBg: 'bg-amber-500 text-white',
      text: t('announce_2_text')
    },
    {
      id: 3,
      tag: t('announce_prerequisite'),
      tagBg: 'bg-blue-600 text-white',
      text: t('announce_3_text')
    },
    {
      id: 4,
      tag: t('announce_documents'),
      tagBg: 'bg-emerald-600 text-white',
      text: t('announce_4_text')
    }
  ];

  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Eligibility Calculator state (Requires GPA >= 2.90 and Credits >= 85)
  const [calcGpa, setCalcGpa] = useState<number>(3.15);
  const [calcCredits, setCalcCredits] = useState<number>(92);
  const [eligibilityResult, setEligibilityResult] = useState<{ checked: boolean; isEligible: boolean } | null>(null);

  // FAQ Active State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const isEligible = calcGpa >= 2.90 && calcCredits >= 85;
    setEligibilityResult({ checked: true, isEligible });
    if (isEligible) {
      triggerConfetti();
    }
  };


  const statsData = [
    { val: t('stats_1'), lbl: t('stats_1_lbl'), detail: t('stats_detail_1') },
    { val: t('stats_2'), lbl: t('stats_2_lbl'), detail: t('stats_detail_2') },
    { val: t('stats_3'), lbl: t('stats_3_lbl'), detail: t('stats_detail_3') },
    { val: t('stats_4'), lbl: t('stats_4_lbl'), detail: t('stats_detail_4') },
  ];

  // Workflow Steps Data - using translation keys
  const getWorkflowSteps = () => [
    {
      num: '01',
      title: t('workflow_eligibility_title'),
      desc: t('workflow_eligibility'),
      icon: ShieldCheck,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      num: '02',
      title: t('workflow_matching_title'),
      desc: t('workflow_matching'),
      icon: Compass,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      num: '03',
      title: t('workflow_orientation_title'),
      desc: t('workflow_orientation'),
      icon: GraduationCap,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      num: '04',
      title: t('workflow_placement_title'),
      desc: t('workflow_placement'),
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      num: '05',
      title: t('workflow_evaluation_title'),
      desc: t('workflow_evaluation'),
      icon: FileCheck,
      color: 'bg-rose-50 text-rose-600 border-rose-200'
    },
    {
      num: '06',
      title: t('workflow_grading_title'),
      desc: t('workflow_grading'),
      icon: Award,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
  ];

  const workflowSteps = getWorkflowSteps();

  // Document Downloads
  const documentsList = [
    {
      code: 'CWIE-01',
      title: t('doc_cwie_01_title'),
      desc: t('doc_cwie_01_desc'),
      size: 'PDF • 245 KB'
    },
    {
      code: 'CWIE-02',
      title: t('doc_cwie_02_title'),
      desc: t('doc_cwie_02_desc'),
      size: 'PDF • 310 KB'
    },
    {
      code: 'CWIE-05',
      title: t('doc_cwie_05_title'),
      desc: t('doc_cwie_05_desc'),
      size: 'PDF • 420 KB'
    },
    {
      code: 'CWIE-GUIDE',
      title: t('doc_cwie_guide_title'),
      desc: t('doc_cwie_guide_desc'),
      size: 'PDF • 2.4 MB'
    }
  ];

  // FAQ Items
  const faqItems = [
    {
      q: t('faq_q1'),
      a: t('faq_a1')
    },
    {
      q: t('faq_q2'),
      a: t('faq_a2')
    },
    {
      q: t('faq_q3'),
      a: t('faq_a3')
    },
    {
      q: t('faq_q4'),
      a: t('faq_a4')
    }
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen flex flex-col font-sans" id="landing-page-root">
      
      {/* Sleek Department Header with Production Badges */}
      <header className="bg-white border-b border-slate-100 py-3.5 px-6 sticky top-0 z-45 backdrop-blur-md bg-white/95 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <img src={cisLogo} alt="CIS Logo" className="h-10 w-auto object-contain" />
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200/60 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('live_production')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStartLogin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-200 transition-all cursor-pointer flex items-center gap-2"
            >
              <Key className="h-3.5 w-3.5" />
              {t('portal_access')}
            </motion.button>
          </div>
        </div>
      </header>

      {/* TIME-SENSITIVE ANNOUNCEMENTS AUTO-UPDATED MARQUEE TICKER BANNER */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-2.5 px-4 overflow-hidden relative z-30">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          {/* Ticker Title Badge */}
          <div className="flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shrink-0 shadow-xs">
            <Megaphone className="h-3.5 w-3.5 animate-bounce" />
            <span>{t('announce_banner_title')}</span>
          </div>

          {/* Current Animated Ticker Text */}
          <div className="flex-1 overflow-hidden relative h-6 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={announcements[currentAnnouncementIndex].id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex items-center gap-2 text-xs font-medium text-slate-200 whitespace-nowrap truncate"
              >
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${announcements[currentAnnouncementIndex].tagBg}`}>
                  {announcements[currentAnnouncementIndex].tag}
                </span>
                <span className="hover:text-blue-300 transition-colors cursor-default">
                  {announcements[currentAnnouncementIndex].text}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stepper controls */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[10px] font-mono text-slate-400 border-l border-slate-800 pl-3">
            <span>{currentAnnouncementIndex + 1} / {announcements.length}</span>
            <button
              onClick={() => setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length)}
              className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 cursor-pointer"
              title="Next Announcement"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Hero Banner Section */}
      <div className="relative bg-white overflow-hidden border-b border-slate-100 py-16 px-6">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" style={{ backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Main Hero Copy & Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 text-left space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider border border-blue-100">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                {t('official_portal')}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none font-sans">
              CIS Cooperative <br />
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                {t('portal_title')}
              </span>
            </h1>

            <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xl">
              {t('landing_desc')}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onStartLogin}
                  className="relative group overflow-hidden inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-200 transition-all cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    {t('sign_in_portal')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000 ease-out" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Official University CWIE Bulletin / Announcement Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-2xl shadow-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden text-left border border-blue-800/40">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
                    <Megaphone className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {t('official_cwie_bulletin')}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md font-mono font-bold">
                  {t('latest_term_label')}
                </span>
              </div>



              {/* Announcement Content Body */}
              <div className="space-y-3 mt-1">
                <div className="flex items-start gap-2 text-blue-100 text-xs font-semibold">
                  <Bell className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-snug text-white font-bold">
                    {t('bulletin_title')}
                  </p>
                </div>

                {/* Timeline / Milestone Items */}
                <div className="space-y-1.5 text-[11px] font-mono text-slate-200">
                  <div className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="flex items-center gap-1.5 text-blue-200">
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                      {t('bulletin_orientation_label')}
                    </span>
                    <span className="font-bold text-amber-300">{t('bulletin_orientation_date')}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <span className="flex items-center gap-1.5 text-blue-200">
                      <FileText className="h-3.5 w-3.5 text-blue-400" />
                      {t('bulletin_placement_label')}
                    </span>
                    <span className="font-bold text-emerald-400">{t('bulletin_placement_date')}</span>
                  </div>
                </div>
              </div>

              {/* Verified Footer Info */}
              <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>{t('faculty_name')}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  • {t('registration_open')}
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* REVERTED PREFERRED CIS CWIE PERFORMANCE OVERVIEW */}
      <div className="bg-slate-50 py-16 px-6 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-left">
            <span className="text-[11px] font-mono text-blue-600 uppercase tracking-wider font-bold">
              {t('institutional_metrics')}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              CIS CWIE Performance Overview
            </h2>
          </div>

          {/* Cards Grid Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((st, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xs text-left space-y-2 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <span className="text-3xl font-extrabold text-slate-900 block tracking-tight font-sans">{st.val}</span>
                <span className="text-xs text-slate-800 uppercase font-bold tracking-wider block">{st.lbl}</span>
                <span className="text-[11px] text-slate-400 block leading-snug">{st.detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CWIE WORKFLOW ROADMAP (ขั้นตอนการดำเนินงานสหกิจศึกษา) */}
      <div className="bg-white py-16 px-6 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-mono text-indigo-600 uppercase tracking-wider font-bold">
              {t('workflow_roadmap_subtitle')}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {t('workflow_roadmap_title')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('workflow_roadmap_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="bg-slate-50 border border-slate-200 p-6 rounded-2xl relative space-y-3 hover:bg-white hover:shadow-md hover:border-blue-300 transition-all text-left"
                >
                  <div className="flex justify-between items-center">
                    <div className={`p-2.5 rounded-xl border ${step.color}`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-300 font-mono">{step.num}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STUDENT CWIE ELIGIBILITY CHECKER (GPA >= 2.90 AND CREDITS >= 85) */}
      <div className="bg-slate-50 border-b border-slate-200 py-16 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl text-left space-y-6 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-blue-200 text-xs font-mono rounded-full uppercase">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {t('eligibility_checker_title')}
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              {t('eligibility_checker_label')}
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed">
              {t('eligibility_checker_subtitle')}
            </p>
          </div>

          <form onSubmit={handleCheckEligibility} className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2">
            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1">{t('gpa_label')}</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="4.00" 
                value={calcGpa} 
                onChange={(e) => setCalcGpa(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 text-white p-2.5 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-400" 
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1">{t('credits_label')}</label>
              <input 
                type="number" 
                min="0" 
                max="200" 
                value={calcCredits} 
                onChange={(e) => setCalcCredits(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/20 text-white p-2.5 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-400" 
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              {t('verify_eligibility_btn')}
            </button>
          </form>

          {eligibilityResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between relative z-10 ${
                eligibilityResult.isEligible 
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200' 
                  : 'bg-rose-500/20 border-rose-400/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {eligibilityResult.isEligible ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
                <span>
                  {eligibilityResult.isEligible 
                    ? t('eligibility_pass')
                    : t('eligibility_fail')}
                </span>
              </div>
              {eligibilityResult.isEligible && (
                <button 
                  onClick={onStartLogin}
                  className="px-3 py-1.5 bg-white text-emerald-800 text-[11px] font-bold rounded-lg hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
                >
                  {t('apply_now_btn')}
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <div className="bg-slate-50 py-16 px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono text-blue-600 uppercase tracking-wider font-bold">
              {t('faq_title_label')}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {t('faq_section_title')}
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-slate-900 flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-50/50"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                      {item.q}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* University branded footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <div className="mb-2">
              <img src={cisLogo} alt="CIS Logo" className="h-8 w-auto object-contain" />
            </div>
            <p className="text-xs text-slate-400">
              {t('footer_subtitle')}
            </p>
          </div>
          <div className="flex gap-4 text-xs text-slate-500 font-medium">
            <button onClick={onStartLogin} className="hover:text-blue-600 transition-colors cursor-pointer">{t('portal_access')}</button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-100 text-center text-[11px] text-slate-400 font-mono">
          {t('footer_copyright')}
        </div>
      </footer>



    </div>
  );
}





