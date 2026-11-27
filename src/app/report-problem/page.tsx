'use client';

import React, { useState } from 'react';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { soundFx } from '@/lib/audio';
import { Bug, Send, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ReportProblemPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'bug_report',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessTicket(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      try { soundFx.playError(); } catch {}
      return;
    }

    setLoading(true);
    try {
      soundFx.playClick();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit incident report.');

      setSuccessTicket(data.ticketId || `GV-BUG-${Date.now().toString(36).toUpperCase()}`);
      setFormData({ name: '', email: '', category: 'bug_report', subject: '', message: '' });
      try { soundFx.playCorrect(); } catch {}
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMessage(msg);
      try { soundFx.playError(); } catch {}
    } finally {
      setLoading(false);
    }
  };

  const toc = [
    { id: 'report-form', title: 'Submit Incident / Bug' },
    { id: 'triage-process', title: 'Triage & Resolution' }
  ];

  return (
    <LegalPageLayout
      title="Report a Problem or Bug"
      subtitle="Help us keep Mastiverse bug-free, balanced, and enjoyable. Report gameplay glitches, multiplayer issues, or player misconduct."
      category="Support"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      <section id="report-form" className="flex flex-col gap-6 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl text-white uppercase tracking-wide flex items-center gap-2">
          <Bug className="w-5 h-5 text-rose-400" />
          <span>Incident &amp; Bug Report Dispatch</span>
        </h2>

        {successTicket ? (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center flex flex-col items-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-white font-['Russo_One',sans-serif]">Report Filed!</h3>
              <p className="text-sm text-slate-300">
                Your incident report has been forwarded to our engineering &amp; moderation desk:
              </p>
              <span className="font-mono text-base font-bold text-amber-400 bg-black/60 px-4 py-1.5 rounded-lg border border-amber-500/30 my-2 inline-block">
                {successTicket}
              </span>
              <p className="text-xs text-slate-400">
                Critical gameplay and fair play tickets are triaged within 12 to 24 hours.
              </p>
            </div>
            <button
              onClick={() => setSuccessTicket(null)}
              className="mt-2 px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Reporter Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your gamer tag or name"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Contact Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Report Type <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="bug_report" className="bg-[#0D111E]">Technical Bug / Glitch / Black Screen</option>
                <option value="fair_play_violation" className="bg-[#0D111E]">Cheating / Speed Hack / Score Tampering</option>
                <option value="account_help" className="bg-[#0D111E]">Hostel Squad / Room Code Sync Failure</option>
                <option value="legal_inquiry" className="bg-[#0D111E]">Offensive Username or Inappropriate Content</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Summary / Game Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Turri Run collision bug on Stage 3"
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Steps to Reproduce / Incident Details <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Include browser (Chrome/Safari), device (Android/iPhone/Windows), room code, and exact steps to reproduce the issue."
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {loading ? (
                <span>Submitting to Engineers...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Incident Report</span>
                </>
              )}
            </button>
          </form>
        )}
      </section>

      <section id="triage-process" className="flex flex-col gap-3 scroll-mt-28 pt-6 border-t border-white/10 text-xs text-slate-300">
        <h2 className="font-['Russo_One',sans-serif] text-base text-white uppercase tracking-wide flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Triage &amp; Resolution Process</span>
        </h2>
        <p>
          Every report generates an automated ticket. Verified bugs are patched in continuous deployment cycles, and cheaters flagged with evidence are permanently blacklisted from national leaderboards.
        </p>
      </section>
    </LegalPageLayout>
  );
}
