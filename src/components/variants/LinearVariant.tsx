import React from 'react'
import {
  Terminal,
  Play,
  Activity,
  Layers,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { VariantHeroProps } from './types'
import { COHORT_NORMS, TEST_SETS } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const LinearVariant: React.FC<VariantHeroProps> = ({
  selectedCohort,
  onSelectCohort,
  activeSetKey,
  onSelectTestSet,
  onStartAssessment,
  savedAttemptsCount,
  latestAttempt,
  onOpenReport,
}) => {
  const cohorts = [
    { key: 'year3' as const, label: 'Stage 2 Primary', speed: '55 LPM', sub: 'Year 3–4' },
    { key: 'year5' as const, label: 'Stage 3 Priority', speed: '64 LPM', sub: 'Year 5–6' },
    { key: 'year7' as const, label: 'Junior Secondary', speed: '98 LPM', sub: 'Year 7–9' },
  ]

  return (
    <div className="bg-[#0D0E12] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-zinc-100 relative overflow-hidden">
      {/* Linear Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[220px] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Engineering Telemetry Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-zinc-800/80 pb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
            NAPLAN_2028_PROTOCOL // DIAGNOSTIC_ENGINE
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
            DB: NEON_POSTGRES
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-emerald-400">
            STATUS: ACTIVE
          </span>
        </div>
      </div>

      {/* Headline & Subhead */}
      <div className="relative z-10 max-w-2xl mb-8 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          HandwritingReadiness.
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed font-sans">
          The high-precision diagnostic benchmark for handwriting speed, joined cursive fluency, and 30-minute exam writing stamina under NSW Department of Education criteria.
        </p>
      </div>

      {/* Bento Grid: 3 Interactive Cohort Targets */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
        {cohorts.map((c) => {
          const isSelected = selectedCohort === c.key
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onSelectCohort(c.key)}
              className={cn(
                'p-4 rounded-2xl border text-left transition-all cursor-pointer font-sans relative overflow-hidden',
                isSelected
                  ? 'bg-zinc-900/90 border-indigo-500/80 text-white shadow-lg ring-1 ring-indigo-500/50'
                  : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/40 hover:border-zinc-700'
              )}
            >
              <div className="flex items-center justify-between text-xs mb-1 font-mono">
                <span className="text-zinc-500">{c.sub}</span>
                <span className={cn('font-bold', isSelected ? 'text-indigo-400' : 'text-zinc-400')}>
                  {c.speed}
                </span>
              </div>
              <div className="font-bold text-sm text-zinc-200">{c.label}</div>
              <div className="text-[11px] text-zinc-500 mt-1 font-mono">Benchmark target</div>
            </button>
          )
        })}
      </div>

      {/* Linear Precision Actions Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Active Test: {TEST_SETS[activeSetKey].shortTitle}</span>
          </span>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <span className="hidden sm:inline">HST Protocol 180s load</span>
        </div>

        <button
          type="button"
          onClick={onStartAssessment}
          className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs tracking-tight flex items-center gap-2 shadow-lg shadow-white/5 cursor-pointer transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Diagnostic Console</span>
        </button>
      </div>
    </div>
  )
}

