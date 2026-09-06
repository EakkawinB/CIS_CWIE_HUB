import React, { useState, useEffect } from 'react';
import { 
  Palette, Type, LayoutGrid, CheckCircle2, AlertTriangle, XCircle, Clock, Search, 
  ChevronRight, Calendar as CalendarIcon, UploadCloud, ChevronLeft, RefreshCw, 
  Plus, Trash2, Mail, ExternalLink, SlidersHorizontal, BookOpen, AlertCircle
} from 'lucide-react';

interface DesignSystemProps {
  onNotify?: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function DesignSystem({ onNotify }: DesignSystemProps) {
  // State for interactive components in the design system
  const [inputText, setInputText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select an Option');
  const [progressValue, setProgressValue] = useState(65);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [fileList, setFileList] = useState<{name: string, size: string}[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-07-12');
  const [currentPage, setCurrentPage] = useState(2);

  const handleNotify = (msg: string, type: 'success' | 'info' | 'warning' | 'error') => {
    if (onNotify) {
      onNotify(msg, type);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && e.currentTarget.previousSibling) {
        (e.currentTarget.previousSibling as HTMLInputElement).focus();
        newOtp[index - 1] = '';
      } else {
        newOtp[index] = '';
      }
      setOtp(newOtp);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileList([...fileList, { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` }]);
      handleNotify(`File "${file.name}" uploaded successfully!`, 'success');
    }
  };

  return (
    <div className="space-y-12 pb-16" id="design-system-root">
      {/* Intro */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-white/15 text-blue-100 text-xs font-semibold rounded-full uppercase tracking-wider">
            Enterprise Architecture
          </span>
          <h1 className="text-3xl font-bold mt-3 font-sans tracking-tight">CIS CWIE Hub Design System</h1>
          <p className="text-blue-100 mt-2 text-sm md:text-base leading-relaxed">
            A precise, high-fidelity UI framework meticulously engineered for cooperative university operations. Inspired by linear aesthetics, structured around modern typography, generous negative space, and deep visual harmony.
          </p>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Colors & Typography */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-600" />
              Color Palette (Burgundy & Red Theme)
            </h2>
            <p className="text-xs text-slate-500 mb-4">Official KMUTNB CIS Department branding. Minimal, modern, crisp contrast ratios.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Primary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-10 bg-blue-600 rounded-lg mb-2" />
                <span className="text-xs font-semibold block text-slate-800">Primary Burgundy</span>
                <span className="text-[10px] text-slate-400 font-mono">#6B122C (blue-600)</span>
              </div>
              {/* Secondary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-10 bg-indigo-600 rounded-lg mb-2" />
                <span className="text-xs font-semibold block text-slate-800">Vibrant Red</span>
                <span className="text-[10px] text-slate-400 font-mono">#E11D48 (indigo-600)</span>
              </div>
              {/* Dark Neutral */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-10 bg-slate-900 rounded-lg mb-2" />
                <span className="text-xs font-semibold block text-slate-800">Dark Charcoal</span>
                <span className="text-[10px] text-slate-400 font-mono">#0F172A (slate-900)</span>
              </div>
              {/* Success */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-10 bg-emerald-500 rounded-lg mb-2" />
                <span className="text-xs font-semibold block text-slate-800">Success Green</span>
                <span className="text-[10px] text-slate-400 font-mono">#10B981 (emerald-500)</span>
              </div>
              {/* Warning */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-10 bg-amber-500 rounded-lg mb-2" />
                <span className="text-xs font-semibold block text-slate-800">Warning Amber</span>
                <span className="text-[10px] text-slate-400 font-mono">#F59E0B (amber-500)</span>
              </div>
              {/* Error */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-10 bg-rose-500 rounded-lg mb-2" />
                <span className="text-xs font-semibold block text-slate-800">Error Red</span>
                <span className="text-[10px] text-slate-400 font-mono">#F43F5E (rose-500)</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Type className="h-5 w-5 text-blue-600" />
              Typography System
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Heading 1 / Display</span>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">CIS CWIE Management Hub</h1>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Heading 2 / Component Title</span>
                <h2 className="text-base font-semibold text-slate-800 font-sans">Student Onboarding Analytics</h2>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Body Text</span>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Cooperative and Work-Integrated Education (CWIE) bridges academic theory with professional practice under structured industrial collaboration.
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Technical Data / Code</span>
                <p className="text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                  GET /api/v1/matching/status/STU001 - Status: 200 OK
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive Buttons & Inputs */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-blue-600" />
              Buttons & Action Controls
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleNotify('Primary action triggered', 'success')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-blue-100 active:scale-95"
              >
                Primary Button
              </button>

              <button 
                onClick={() => handleNotify('Secondary action triggered', 'info')}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-all active:scale-95"
              >
                Secondary Outline
              </button>

              <button 
                onClick={() => handleNotify('Destructive action triggered', 'error')}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-all active:scale-95"
              >
                Destructive Red
              </button>

              <button 
                disabled
                className="px-4 py-2.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed"
              >
                Disabled State
              </button>

              <button 
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Loading State
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Inputs, Select & Dropdowns</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Interactive Text Input</label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter Student Name..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs transition-colors outline-none text-slate-800"
                  />
                  {inputText && (
                    <button 
                      onClick={() => setInputText('')}
                      className="absolute right-3 top-2.5 text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Dropdown Select Menu */}
              <div className="relative">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Custom Dropdown Menu</label>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-left rounded-xl text-xs text-slate-700 flex items-center justify-between hover:bg-slate-100 transition-colors"
                >
                  <span>{selectedOption}</span>
                  <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg z-20 overflow-hidden divide-y divide-slate-50">
                    {['Computer Information Systems', 'Software Engineering', 'Information Technology'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedOption(opt);
                          setDropdownOpen(false);
                          handleNotify(`Selected option: ${opt}`, 'info');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Badges, Chips, Progress & Datepicker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Status Chips & Badges</h2>
          <p className="text-xs text-slate-500">Uniform badges used for workflow pipelines, matching status, and reports.</p>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full uppercase tracking-wider">
              Matching Status
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Confirmed
            </span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-full uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Pending Review
            </span>
            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] font-semibold rounded-full uppercase tracking-wider flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Rejected
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-900">Progress Indicators</h2>
            <span className="text-xs text-blue-600 font-mono font-bold">{progressValue}%</span>
          </div>
          <p className="text-xs text-slate-500">Linear tracking for weekly timesheets or onboarding tasks.</p>
          
          <div className="space-y-4">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressValue}%` }} 
              />
            </div>
            
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => setProgressValue(Math.max(0, progressValue - 15))}
                className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] rounded-lg"
              >
                -15%
              </button>
              <button 
                onClick={() => setProgressValue(Math.min(100, progressValue + 15))}
                className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] rounded-lg"
              >
                +15%
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-slate-900">DatePicker & Calendar</h2>
          <label className="block text-xs font-medium text-slate-700">Schedule Visits / Target Date</label>
          <div className="relative">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                handleNotify(`Date changed to: ${e.target.value}`, 'info');
              }}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs text-slate-700 outline-none"
            />
            <CalendarIcon className="absolute right-3 top-2 text-slate-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* 4. Table & Chronological Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table - takes 2 cols */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">University Design System Table</h2>
              <p className="text-xs text-slate-400">Crisp data records with navigation control & status indicators.</p>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search index..." 
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-700 outline-none focus:border-blue-500"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Curriculum</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                <tr>
                  <td className="py-3 px-3 font-medium text-slate-900">Kasidis Phromsorn</td>
                  <td className="py-3 px-3">CIS major</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '75%' }} />
                      </div>
                      <span className="text-[10px] text-slate-400">75%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-[10px]">Active</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-slate-900">Natapat Kittisukhon</td>
                  <td className="py-3 px-3">SE curriculum</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '40%' }} />
                      </div>
                      <span className="text-[10px] text-slate-400">40%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-semibold text-[10px]">Matching</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
            <span className="text-[11px] text-slate-400">Showing page 2 of 4</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </button>
              <span className="text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold">{currentPage}</span>
              <button 
                onClick={() => setCurrentPage(3)} 
                disabled={currentPage === 4}
                className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Institutional Timeline</h2>
          <p className="text-xs text-slate-500 mb-4">Milestones for CWIE approval process.</p>
          
          <div className="space-y-4 flex-1">
            <div className="relative pl-6 border-l-2 border-blue-100 pb-1">
              <div className="absolute -left-[6px] top-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
              <div className="text-xs text-slate-400 font-mono">Week 1-2 (Completed)</div>
              <h4 className="text-xs font-semibold text-slate-800">Submit Application Agreement</h4>
              <p className="text-[11px] text-slate-400">Employer confirms onboarding dates.</p>
            </div>

            <div className="relative pl-6 border-l-2 border-blue-100 pb-1">
              <div className="absolute -left-[6px] top-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
              <div className="text-xs text-slate-400 font-mono">Week 8 (Current)</div>
              <h4 className="text-xs font-semibold text-slate-800 text-blue-700">Midterm On-site Review</h4>
              <p className="text-[11px] text-slate-400">University advisor schedules company evaluation visit.</p>
            </div>

            <div className="relative pl-6 pb-1">
              <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-slate-200" />
              <div className="text-xs text-slate-400 font-mono">Week 16</div>
              <h4 className="text-xs font-semibold text-slate-500">Final Defense Examination</h4>
              <p className="text-[11px] text-slate-400">Deliver progress logs and academic presentation slides.</p>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Dialog Popups & Drag-Drop File Upload & Interactive OTP Component */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* OTP Component & Dialog Trigger */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-2">Interactive 6-Digit OTP Field</h2>
            <p className="text-xs text-slate-500 mb-4">Secured authentication input block. Fields auto-focus and validate input values.</p>
            
            <div className="space-y-4">
              <div className="flex justify-center gap-2.5">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-10 h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-600 rounded-xl text-center font-bold text-slate-800 text-base outline-none transition-colors"
                  />
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Simulating code expiration in 59s</span>
                <button 
                  onClick={() => {
                    setOtp(['', '', '', '', '', '']);
                    handleNotify('OTP code resent successfully.', 'info');
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Resend OTP
                </button>
              </div>

              <button
                onClick={() => {
                  const val = otp.join('');
                  if (val.length < 6) {
                    handleNotify('Please fill in all 6 OTP digits.', 'warning');
                  } else {
                    handleNotify(`OTP "${val}" verified. Authentication success.`, 'success');
                  }
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Verify Code
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 mb-2">Modal Dialog Box Template</h2>
              <p className="text-xs text-slate-500 mb-4">Click button below to open a simulated system confirm dialog.</p>
            </div>
            
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2.5 border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition-colors"
            >
              Launch System Dialog
            </button>

            {/* Modal Dialog Overlay */}
            {isDialogOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                <div className="bg-white border border-slate-100 rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 text-blue-600 mb-2">
                    <AlertCircle className="h-6 w-6" />
                    <h3 className="font-bold text-slate-900 text-sm">Save Final Evaluation Report?</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">
                    This will permanently record your supervision site visit and notify the system administrator. You cannot edit this after confirming.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="px-3.5 py-1.5 text-xs font-medium text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      Cancel Action
                    </button>
                    <button
                      onClick={() => {
                        setIsDialogOpen(false);
                        handleNotify('Report recorded successfully.', 'success');
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Yes, Record Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* File Upload System */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col h-full">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Standard Drag & Drop File Uploader</h2>
          <p className="text-xs text-slate-500 mb-4">Allows quick upload of Signed CWIE training agreement forms.</p>
          
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="h-9 w-9 text-slate-400 mb-2.5" />
              <span className="text-xs font-semibold text-slate-800">Drag agreement PDF here or browse</span>
              <span className="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX up to 10MB</span>
            </div>

            {/* List of files */}
            {fileList.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Uploaded Artifacts</span>
                {fileList.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-xs font-medium text-slate-700 truncate max-w-[80%]">{file.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">{file.size}</span>
                      <button 
                        onClick={() => {
                          setFileList(fileList.filter((_, i) => i !== idx));
                          handleNotify('File removed.', 'info');
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 6. Toast Notifications Drawer Simulator */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center">
        <h2 className="text-base font-semibold text-slate-900 mb-2">Simulate Live Toast Feed</h2>
        <p className="text-xs text-slate-500 mb-4">Click buttons below to trigger high-contrast, fully accessible toast feedback.</p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            onClick={() => handleNotify('Database changes saved successfully.', 'success')}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium rounded-xl border border-emerald-100 transition-colors"
          >
            Trigger Success Toast
          </button>
          <button 
            onClick={() => handleNotify('Synchronizing institutional parameters...', 'info')}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium rounded-xl border border-blue-100 transition-colors"
          >
            Trigger Info Toast
          </button>
          <button 
            onClick={() => handleNotify('Site visit schedule not confirmed yet.', 'warning')}
            className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-medium rounded-xl border border-amber-100 transition-colors"
          >
            Trigger Warning Toast
          </button>
          <button 
            onClick={() => handleNotify('Failed to verify academic record.', 'error')}
            className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium rounded-xl border border-rose-100 transition-colors"
          >
            Trigger Error Toast
          </button>
        </div>
      </div>
    </div>
  );
}
