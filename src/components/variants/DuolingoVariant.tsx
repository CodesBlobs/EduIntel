import React from 'react'
import { motion } from 'motion/react'
import {
  Flame,
  Zap,
  Play,
  Trophy,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { VariantHeroProps } from './types'
import { COHORT_NORMS, TEST_SETS } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const DuolingoVariant: React.FC<VariantHeroProps> = ({
  selectedCohort,
  onSelectCohort,
  activeSetKey,
  onSelectTestSet,
  onStartAssessment,
  savedAttemptsCount,
  latestAttempt,
  onOpenReport,
}) => {
  const steps = [
    {
      setKey: 'setA' as const,
      name: 'Alphabet Recall',
      time: '60s',
      status: 'completed',
      color: 'bg-[#58CC02] border-[#46A302]',
      icon: '🔤',
    },
    {
      setKey: 'setB' as const,
      name: '3-Min HST Pangram Sprint',
      time: '180s',
      status: 'current',
      color: 'bg-[#FF9600] border-[#CC7800]',
      icon: '⚡',
    },
    {
      setKey: 'setC' as const,
      name: 'Near-Point Copy',
      time: '120s',
      status: 'upcoming',
      color: 'bg-[#1CB0F6] border-[#1899D6]',
      icon: '🎯',
    },
    {
      setKey: 'setD' as const,
      name: 'NAPLAN 10-Min Free Write',
      time: '10m',
      status: 'locked',
      color: 'bg-[#CE82FF] border-[#A855F7]',
      icon: '🏆',
    },
  ]

  const cohorts = [
    { key: 'year3' as const, label: 'Year 3–4', xp: '+50 XP', level: 'Stage 2 Primary' },
    { key: 'year5' as const, label: 'Year 5–6', xp: '+100 XP', level: '2028 Priority' },
    { key: 'year7' as const, label: 'Year 7–9', xp: '+150 XP', level: 'Secondary Stamina' },
  ]

  return (
    <div className="bg-[#58CC02]/10 border-2 border-[#58CC02]/30 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden text-stone-900">
      {/* Playful Floating Gamified Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#58CC02] text-white font-extrabold text-xs tracking-wider flex items-center gap-1.5 shadow-sm">
            <span>🦉</span>
            <span>NAPLAN MASTERY PATH</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FF9600]/20 text-[#CC7800] border border-[#FF9600]/40 font-bold text-xs flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-current text-[#FF9600]" />
            <span>3-Day Streak</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-black">
          <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
            <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>{savedAttemptsCount > 0 ? `${savedAttemptsCount * 50} XP` : '150 XP Available'}</span>
          </div>
          {savedAttemptsCount > 0 && (
            <button
              type="button"
              onClick={onOpenReport}
              className="text-[#58CC02] hover:text-[#46A302] font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>View Trophies &amp; Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Headline & Mascot Callout */}
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
        <div className="text-4xl sm:text-5xl font-black tracking-tight text-stone-900">
          Level up your handwriting before NAPLAN 2028! 🚀
        </div>
        <p className="text-stone-600 text-sm sm:text-base font-medium">
          Choose your grade level, crush your 3-minute handwriting sprint, and beat the clinical speed benchmark!
        </p>
      </div>

      {/* Year-Level Selector Styled as Big Tactile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto mb-8">
        {cohorts.map((c) => {
          const isSelected = selectedCohort === c.key
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onSelectCohort(c.key)}
              className={cn(
                'relative p-4 rounded-2xl border-2 text-center transition-all cursor-pointer font-black',
                'border-b-4 active:border-b-2 active:translate-y-0.5',
                isSelected
                  ? 'bg-white border-[#58CC02] text-[#58CC02] shadow-md -translate-y-0.5'
                  : 'bg-white/70 border-stone-200 text-stone-700 hover:bg-white hover:border-stone-300'
              )}
            >
              <div className="text-xs text-stone-400 font-semibold">{c.level}</div>
              <div className="text-lg font-black">{c.label}</div>
              <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {c.xp}
              </div>
            </button>
          )
        })}
      </div>

      {/* Learning-Path Zigzag Stepper */}
      <div className="max-w-3xl mx-auto mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-[#58CC02]/20">
        <div className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
          <span>Diagnostic Quest Map</span>
          <span className="text-[#58CC02]">Active: {TEST_SETS[activeSetKey].shortTitle}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((st) => {
            const isCurrent = activeSetKey === st.setKey
            return (
              <button
                key={st.setKey}
                type="button"
                onClick={() => onSelectTestSet(st.setKey)}
                className={cn(
                  'p-3 rounded-xl border-2 text-left transition-all cursor-pointer',
                  isCurrent
                    ? 'border-[#FF9600] bg-orange-50/70 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                )}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-lg">{st.icon}</span>
                  <span className="font-mono text-[11px] font-bold text-stone-500">{st.time}</span>
                </div>
                <div className="font-bold text-xs text-stone-900 truncate">{st.name}</div>
                {isCurrent && (
                  <div className="mt-1 text-[10px] font-extrabold text-[#CC7800] uppercase">
                    ⭐ Target Quest
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Big Chunky 3D Duolingo CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
        <button
          type="button"
          onClick={onStartAssessment}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#58CC02] border-b-4 border-[#46A302] hover:bg-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black text-base uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>START QUEST NOW</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {latestAttempt && (
          <div className="text-xs text-stone-600 text-center sm:text-left">
            <span className="font-bold text-stone-800">Last Score:</span>{' '}
            <span className="font-mono font-bold text-[#58CC02]">{latestAttempt.netLpm} LPM</span> ({latestAttempt.status})
          </div>
        )}
      </div>
    </div>
  )
}
