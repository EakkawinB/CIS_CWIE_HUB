import React, { useState } from 'react';
import { Mail, Calendar, FileText, RefreshCw, CheckCircle, Clock, Link2, Info, ArrowUpRight } from 'lucide-react';
import { MOCK_EMAILS, MOCK_EVENTS, MOCK_WORKSPACE_DOCS } from '../types';

interface WorkspaceSyncProps {
  onNotify?: (message: string, type: 'success' | 'info') => void;
}

export default function WorkspaceSync({ onNotify }: WorkspaceSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('Just now');
  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [isConnected, setIsConnected] = useState(true);

  const handleSync = () => {
    setIsSyncing(true);
    if (onNotify) onNotify('Synchronizing with Google Workspace...', 'info');
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSynced(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (onNotify) onNotify('Google Workspace synchronization complete.', 'success');
    }, 1200);
  };

  const handleMarkRead = (id: string) => {
    setEmails(emails.map(email => email.id === id ? { ...email, read: true } : email));
    if (onNotify) onNotify('Email marked as read.', 'success');
  };

  return (
    <div className="space-y-6" id="workspace-sync-root">
      {/* Header and Sync Control */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-lg font-semibold text-slate-900 font-sans">Google Workspace Integration</h2>
          </div>
          <p className="text-sm text-slate-500">
            Active connection to {isConnected ? <span className="text-blue-600 font-medium">n.09305y@gmail.com</span> : 'none'}. Syncs official CWIE templates, calendar visits, and advisor mail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">Last synced: {lastSynced}</span>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 transition-colors rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Now
          </button>
        </div>
      </div>

      {/* Grid of Google Workspace Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gmail Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col h-[420px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Gmail CWIE Alerts</h3>
                <p className="text-xs text-slate-400">Incoming institutional mailbox</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
              {emails.filter(e => !e.read).length} Unread
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleMarkRead(email.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  email.read 
                    ? 'bg-slate-50/50 border-slate-100 hover:border-slate-200' 
                    : 'bg-white border-blue-100 hover:border-blue-200 shadow-sm shadow-blue-50/50'
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <span className={`text-xs font-semibold truncate max-w-[150px] ${email.read ? 'text-slate-600' : 'text-blue-700'}`}>
                    {email.sender}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{email.date}</span>
                </div>
                <h4 className={`text-xs mb-1 truncate ${email.read ? 'text-slate-700 font-normal' : 'text-slate-900 font-semibold'}`}>
                  {email.subject}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {email.snippet}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 text-center">
            <a 
              href="https://mail.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              Open Gmail Inbox
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Google Calendar Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col h-[420px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Google Calendar</h3>
                <p className="text-xs text-slate-400">Deadlines & supervision schedule</p>
              </div>
            </div>
            <span className="text-[11px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-lg">Live Synced</span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin">
            {MOCK_EVENTS.map((event) => {
              const startDate = new Date(event.start);
              const formattedTime = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
                ' at ' + startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              const colors = {
                academic: 'border-l-indigo-500 bg-indigo-50/30 text-indigo-700',
                cwie: 'border-l-blue-500 bg-blue-50/30 text-blue-700',
                exam: 'border-l-red-500 bg-red-50/30 text-red-700',
                visit: 'border-l-amber-500 bg-amber-50/30 text-amber-700',
              };

              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-xl border-l-4 border-y border-r border-slate-100 hover:shadow-sm transition-all text-left ${colors[event.type]}`}
                >
                  <h4 className="text-xs font-semibold mb-1 line-clamp-1">{event.title}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{formattedTime}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 text-center">
            <a 
              href="https://calendar.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              Open Google Calendar
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Google Docs Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col h-[420px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Google Docs & Drive</h3>
                <p className="text-xs text-slate-400">Institutional template repository</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">3 templates</span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin">
            {MOCK_WORKSPACE_DOCS.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-white border border-slate-100 hover:border-slate-200 rounded-xl flex items-center justify-between transition-all"
              >
                <div className="flex items-start gap-2.5 max-w-[80%]">
                  <FileText className="h-4.5 w-4.5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="text-left">
                    <h4 className="text-xs font-medium text-slate-800 line-clamp-1">{doc.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Last updated: {doc.lastModified}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (onNotify) onNotify(`Downloaded Google Doc: ${doc.name}`, 'success');
                  }}
                  className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors rounded-lg"
                  title="Copy Document Link"
                >
                  <Link2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-left text-[11px] text-slate-500 leading-relaxed">
                  <span className="font-semibold text-slate-700">Official Templates:</span> Double click templates to auto-populate Student ID, Academic Advisor, and Company supervisor details before editing.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 text-center">
            <a 
              href="https://drive.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              Open Google Drive
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
