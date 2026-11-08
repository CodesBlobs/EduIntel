import React, { useState, useEffect } from 'react'
import { ExternalLink, X, Bell } from 'lucide-react'

const STORAGE_KEY = 'hw-announcement-dismissed-nov2026-v2'

export const TopAnnouncementBar: React.FC = () => {
  const [dismissed, setDismissed] = useState<boolean>(true) // default true to avoid flash before effect

  useEffect(() => {
    const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true'
    setDismissed(isDismissed)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (dismissed) return null

  return (
    <aside
      aria-label="Education Policy News Announcement"
      className="relative z-50 bg-[#161615] text-[#FAF9F5] border-b-2 border-amber-500/50 py-3 sm:py-3.5 px-4 sm:px-6 shadow-sm"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Notice Badge + Big Headline + Context */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
          {/* Prominent Amber Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-400 text-[#191918] uppercase tracking-wider shadow-2xs shrink-0">
            <Bell className="w-3.5 h-3.5 fill-current" />
            Policy Update
          </span>

          {/* Bold, Clear Headline */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-sm sm:text-[15px] font-semibold text-white tracking-tight leading-snug">
              NSW Government leads push for handwritten NAPLAN writing tests from 2028.
            </span>
            <span className="text-xs text-[#A8A7A1] font-normal hidden md:inline">
              (Proposed national curriculum reform · 1 Nov 2026)
            </span>
          </div>
        </div>

        {/* Right Side: Prominent Action Button + Close */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <a
            href="https://www.nsw.gov.au/ministerial-releases/new-south-wales-leads-push-for-return-to-pen-and-paper-naplan-writing-tests"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-400 text-amber-300 hover:text-[#191918] border border-amber-400/40 hover:border-amber-400 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
          >
            <span>Read announcement</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-[#A8A7A1] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss announcement"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
