'use client';

import React, { useState } from 'react';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { soundFx } from '@/lib/audio';
import {
  Send,
  Mail,
  HelpCircle,
  Bug,
  Shield,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    { id: 'general', label: 'General Inquiry / Feedback', icon: MessageSquare },
    { id: 'bug_report', label: 'Report a Bug or Game Issue', icon: Bug },
    { id: 'account_help', label: 'Account & Profile Support', icon: HelpCircle },
    { id: 'fair_play_violation', label: 'Report Cheating or Abuse', icon: Shield },
    { id: 'legal_inquiry', label: 'Legal & Privacy Grievance', icon: Mail }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessTicket(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      try {
        soundFx.playError();
      } catch {}
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

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      setSuccessTicket(data.ticketId || `GV-${Date.now().toString(36).toUpperCase()}`);
      setFormData({
        name: '',
        email: '',
        category: 'general',
        subject: '',
        message: ''
      });
      try {
        soundFx.playCorrect();
      } catch {}
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMessage(msg);
      try {
        soundFx.playError();
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const toc = [
    { id: 'contact-form', title: 'Submit Support Ticket' },
    { id: 'official-channels', title: 'Official Response Times' },
    { id: 'grievance', title: 'Statutory Grievance Officer' }
  ];

  return (
    <LegalPageLayout
      title="Contact GullyVerse Support"
      subtitle="Have an issue with a game room, bug to report, or general inquiry? Our team and automated ticketing system are here to assist."
      category="Support"
      tableOfContents={toc}
      requiresOwnerInput={false}
    >
      {/* 1. Contact Form Section */}
      <section id="contact-form" className="flex flex-col gap-6 scroll-mt-28">
        <h2 className="font-['Russo_One',sans-serif] text-xl sm:text-2xl text-white uppercase tracking-wide flex items-center gap-2.5">
          <Send className="w-5 h-5 text-amber-400" />
          <span>Send Us a Message</span>
        </h2>

        {successTicket ? (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center flex flex-col items-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-white font-['Russo_One',sans-serif]">Message Received!</h3>
              <p className="text-sm text-slate-300 max-w-md">
                Thank you for reaching out. Your support reference ticket ID is:
              </p>
              <span className="font-mono text-base font-bold text-amber-400 bg-black/60 px-4 py-1.5 rounded-lg border border-amber-500/30 my-2 inline-block">
                {successTicket}
              </span>
              <p className="text-xs text-slate-400">
                Our support team typically responds to verified inquiries within 24 to 48 business hours.
              </p>
            </div>
            <button
              onClick={() => setSuccessTicket(null)}
              className="mt-2 px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors"
            >
              Send Another Query
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
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Your Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sahil Raj"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Your Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Inquiry Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0D111E] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Subject <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your query or report"
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Detailed Message <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue, feedback, or inquiry in detail. Include room code or device details if reporting a bug."
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-y"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {loading ? (
                <span>Submitting to Dispatch...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </form>
        )}
      </section>

      {/* 2. Official Channels */}
      <section id="official-channels" className="flex flex-col gap-4 scroll-mt-28 pt-4 border-t border-white/10">
        <h2 className="font-['Russo_One',sans-serif] text-xl sm:text-2xl text-white uppercase tracking-wide flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>2. Response SLA &amp; Support Scope</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase">General Inquiries &amp; Feedback</span>
            <p className="text-xs text-slate-400">Response within 24–48 business hours.</p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1.5">
            <span className="text-xs font-bold text-rose-400 uppercase">Fair Play &amp; Security Reports</span>
            <p className="text-xs text-slate-400">Reviewed within 12–24 hours for immediate moderation.</p>
          </div>
        </div>
      </section>

      {/* 3. Statutory Grievance Redressal */}
      <section id="grievance" className="flex flex-col gap-4 scroll-mt-28 pt-4 border-t border-white/10">
        <h2 className="font-['Russo_One',sans-serif] text-xl sm:text-2xl text-white uppercase tracking-wide flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-amber-400" />
          <span>3. Statutory Grievance Redressal (India IT Rules 2021)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          In accordance with the Information Technology Act 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, users may reach out to our Grievance Officer for formal notices, copyright infringement complaints, or data protection concerns:
        </p>
        <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs space-y-1 font-mono text-slate-300">
          <div><strong className="text-white">Designation:</strong> Grievance Redressal Officer</div>
          <div><strong className="text-white">Platform:</strong> GullyVerse (SR24Plus)</div>
          <div><strong className="text-white">Email:</strong> grievance@gullyverse.com / support@gullyverse.com</div>
          <div><strong className="text-white">Jurisdiction:</strong> New Delhi, Republic of India</div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
