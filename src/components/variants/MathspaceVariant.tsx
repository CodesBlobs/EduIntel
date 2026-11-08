import React from 'react'
import {
  Calculator,
  Play,
  ArrowRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Award,
} from 'lucide-react'
import { VariantHeroProps } from './types'
import { COHORT_NORMS, TEST_SETS } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const MathspaceVariant: React.FC<VariantHeroProps> = ({
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
    { key: 'year3' as const, label: 'Year 3–4', standard: 'Stage 2 English (AC9E3LY08)', target: '55 LPM' },
    { key: 'year5' as const, label: 'Year 5–6', standard: 'Stage 3 Priority (AC9E5LY08)', target: '64 LPM' },
    { key: 'year7' as const, label: 'Year 7–9', standard: 'Junior Secondary (AC9E7LY08)', target: '98 LPM' },
  ]

  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 sm:p-9 shadow-sm text-slate-900 space-y-6">
      {/* Top Academic Syllabus Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-[#0D6EFD] text-white font-bold text-[11px] tracking-wide">
            MATHSPACE EDTECH STYLE
          </span>
          <span className="text-slate-500 font-medium">
            Australian Curriculum v9 &amp; NSW DoE Foundation
          </span>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Protocol: HST Wallen et al. (1996)
        </div>
      </div>

      {/* Split Hero: Worked Example Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading, Formula & Cohort Selector (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Diagnostic Handwriting &amp; Motor Load Engine
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Step-by-step clinical evaluation measuring handwriting transcription speed, cursive join mechanics, and stamina required for pen-and-paper examinations.
            </p>
          </div>

          {/* Formula Breakdown Card */}
          <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] font-mono text-xs text-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Diagnostic Calculation Formula
            </div>
            <div className="text-sm font-semibold text-[#0D6EFD]">
              Net LPM = (Total Letters − Illegible Letters) ÷ Duration (min)
            </div>
          </div>

          {/* Year Cohort Buttons */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-500">Select Curriculum Target:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {cohorts.map((c) => {
                const isSelected = selectedCohort === c.key
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => onSelectCohort(c.key)}
                    className={cn(
                      'p-2.5 rounded-xl border text-left transition-all cursor-pointer',
                      isSelected
                        ? 'bg-[#0D6EFD] border-[#0D6EFD] text-white shadow-xs'
                        : 'bg-white border-[#CBD5E1] text-slate-700 hover:border-slate-400'
                    )}
                  >
                    <div className="font-bold text-xs">{c.label}</div>
                    <div className={cn('text-[10px]', isSelected ? 'text-blue-100' : 'text-slate-500')}>
                      Target: {c.target}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onStartAssessment}
              className="px-6 py-3 rounded-xl bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Timed Assessment Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Worked Problem Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-[#CBD5E1] rounded-2xl p-5 shadow-xs space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[#0D6EFD]" />
              <span>Worked Diagnostic Example</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Target Achieved
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-bold text-slate-800">Problem:</div>
              <p className="text-slate-600 mt-0.5">
                A Year 5 student copies the 35-letter HST pangram for 3 minutes, producing 195 legible characters with 0 illegible letters.
              </p>
            </div>

            <div className="space-y-1 font-mono text-[11px] bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 text-blue-900">
              <div>Step 1: Duration = 3.0 min</div>
              <div>Step 2: Net LPM = 195 ÷ 3 = 65 LPM</div>
              <div>Step 3: Benchmark = 60–75 LPM (Normal Range)</div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span>Normative Percentile: 50th–75th</span>
              <span className="font-bold text-slate-700">Australian HST 1996</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

