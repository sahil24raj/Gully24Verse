'use client';

import React from 'react';
import Link from 'next/link';
import { MastiverseLogo } from '@/components/MastiverseLogo';
import { soundFx } from '@/lib/audio';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  Mail,
  ExternalLink
} from 'lucide-react';

export interface TableOfContentsItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  category: 'Legal' | 'Company' | 'Support' | 'Compliance';
  lastUpdated?: string;
  tableOfContents?: TableOfContentsItem[];
  requiresOwnerInput?: boolean;
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  subtitle,
  category,
  lastUpdated = 'November 2026',
  tableOfContents = [],
  requiresOwnerInput = true,
  children
}) => {
  return (
    <div className="w-full min-h-screen bg-[#080B14] text-slate-200 select-none py-8 sm:py-12 px-4 sm:px-8 xl:px-14 relative overflow-hidden">
      {/* Background ambient neon glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-6 flex-wrap">
          <Link
            href="/"
            onClick={() => soundFx.playClick()}
            className="hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-amber-400 font-mono uppercase text-xs tracking-wider">{category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-none">{title}</span>
        </div>

        {/* Header Block */}
        <div className="bg-gradient-to-r from-black/80 via-black/60 to-black/40 border border-white/10 rounded-3xl p-6 sm:p-10 mb-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Mastiverse Official Documentation • {category}</span>
          </div>

          <h1 className="font-['Russo_One',sans-serif] text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-tight mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            {title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">
            {subtitle}
          </p>

          <div className="flex items-center gap-4 mt-6 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Effective Date / Last Updated: {lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <span>🇮🇳 Applicable Jurisdiction: India</span>
            </div>
          </div>

          {requiresOwnerInput && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <strong className="text-amber-300">Compliance Notice:</strong> This document outlines Mastiverse&apos;s legal and operational practices for Indian jurisdiction. Certain bracketed terms (such as registered entity names or official grievance officer emails) are configurable placeholders awaiting final confirmation. Consult an Indian legal advisor before commercial deployment.
              </div>
            </div>
          )}
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-3 flex flex-col gap-8 bg-[#0D111E]/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-xl text-slate-300 leading-relaxed font-body">
            {children}

            {/* Document Footer Callout */}
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md overflow-hidden border border-amber-500/50 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/sr24plus-logo.jpg" alt="SR24Plus Logo" className="w-full h-full object-cover" />
                </div>
                <span>Platform Owner / Creator:</span>
                <a
                  href="https://sr24plus.base44.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1"
                >
                  SR24Plus <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Legal &amp; Grievance Redressal:</span>
                <span className="text-slate-200 font-mono">support@mastiverse.in</span>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Table of Contents Box */}
            {tableOfContents.length > 0 && (
              <div className="bg-[#0D111E]/90 border border-white/10 rounded-2xl p-5 sticky top-24 backdrop-blur-md shadow-lg">
                <h3 className="font-['Russo_One',sans-serif] text-sm text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>Quick Directory</span>
                </h3>
                <nav className="flex flex-col gap-1.5 text-xs">
                  {tableOfContents.map((item, idx) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors flex items-center gap-2 group"
                    >
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-amber-400">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="truncate">{item.title}</span>
                    </a>
                  ))}
                </nav>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Need Help?</h4>
                  <Link
                    href="/contact"
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold text-center transition-colors block"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            )}

            {/* Trust & Safe Gaming Badge */}
            <div className="bg-black/50 border border-white/5 rounded-2xl p-5 text-xs text-slate-400 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="text-amber-400">🎮</span>
                <span>Mastiverse Fair Play</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Mastiverse is a zero-download desi browser gaming platform. We do not support real-money wagering, predatory betting, or unlicensed gambling.
              </p>
              <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-white/5">
                Built with ❤️ by SR24Plus
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LegalPageLayout;
