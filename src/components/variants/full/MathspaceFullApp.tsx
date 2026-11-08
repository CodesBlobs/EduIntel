import React from 'react'
import {
  Calculator,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Check,
  Copy,
  GraduationCap,
  Award,
} from 'lucide-react'
import { useTestEngine } from '@/hooks/useTestEngine'
import { TEST_SETS, TestSetKey, CohortKey } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const MathspaceFullApp: React.FC = () => {
  const engine = useTestEngine()

  const cohorts: { key: CohortKey; label: string; code: string; speed: string }[] = [
    { key: 'year3', label: 'Year 3–4 (Primary)', code: 'AC9E3LY08', speed: '55 LPM' },
    { key: 'year5', label: 'Year 5–6 (Stage 3)', code: 'AC9E5LY08', speed: '64 LPM' },
    { key: 'year7', label: 'Year 7–9 (Secondary)', code: 'AC9E7LY08', speed: '98 LPM' },
  ]

  const testSets: { key: TestSetKey; label: string }[] = [
    { key: 'setA', label: 'Exercise 1: Alphabet Recall' },
    { key: 'setB', label: 'Exercise 2: 3-Min Pangram Sprint' },
    { key: 'setC', label: 'Exercise 3: Near-Point Transcription' },
    { key: 'setD', label: 'Exercise 4: 10-Min Exam Free Write' },
  ]

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-900 font-sans pb-32">
      {/* Mathspace Top Academic Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#CBD5E1] px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D6EFD] text-white flex items-center justify-center font-black text-lg shadow-xs">
              ∑
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-[#0D6EFD] flex items-center gap-2">
                <span>Mathspace</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0D6EFD]">
                  Handwriting Edtech
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Australian Curriculum v9 // NSW Foundation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={engine.openReportModal}
              className="px-3.5 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Diagnostic Assessment PDF
            </button>
            <div className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hidden sm:block">
              Wallen HST Protocol (1996)
            </div>
          </div>
        </div>
      </header>

      {/* Curriculum Breadcrumbs & Stepper */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 sm:px-8 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span>NSW English Curriculum</span>
            <span>&gt;</span>
            <span>Stage 2–3 Transcription Fluency</span>
            <span>&gt;</span>
            <span className="font-bold text-slate-800">Section 4.1 Speed &amp; Joined Cursive Benchmark</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Curriculum Norm Active</span>
          </div>
        </div>
      </div>

      {/* Main Mathspace Educational Lesson Arena */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Step Progress Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0D6EFD] font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <div className="font-bold text-slate-900">Standard Formula</div>
              <div className="text-[11px] text-slate-500">Speed (LPM) Calculation</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#0D6EFD] text-white font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <div className="font-bold text-slate-900">Timed Practice Step</div>
              <div className="text-[11px] text-[#0D6EFD] font-bold">{engine.activeSet.durationMin} Min Assessment</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <div className="font-bold text-slate-900">Step-by-Step Scoring</div>
              <div className="text-[11px] text-slate-500">Auto-Evaluated Percentile</div>
            </div>
          </div>
        </div>

        {/* Step 1: Syllabus Theory & Worked Problem Box */}
        <div className="bg-white border-2 border-[#CBD5E1] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#0D6EFD]" />
              <h2 className="text-lg font-extrabold text-slate-900">
                Worked Assessment Example &amp; Formula
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              {cohorts.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => engine.setSelectedCohort(c.key)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer',
                    engine.selectedCohort === c.key
                      ? 'bg-[#0D6EFD] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Formula Block */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
              <div className="font-bold text-[#0D6EFD] uppercase tracking-wider text-[11px]">
                Mathematical Speed Equation
              </div>
              <div className="font-mono text-base font-bold text-blue-900 bg-white p-3 rounded-lg border border-blue-200">
                \text&#123;Net LPM&#125; = \frac&#123;\text&#123;Total Letters&#125; - \text&#123;Errors&#125;&#125;&#123;\text&#123;Minutes&#125;&#125;
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Target for {engine.cohortNorm.shortName}: <strong className="text-slate-900">{engine.cohortNorm.targetLpm} Letters Per Minute</strong> (~{engine.cohortNorm.copyWpmMax} Words Per Minute).
              </p>
            </div>

            {/* Worked Example */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Sample Year 5 Clinical Norm
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div>• Time = 3.0 minutes continuous copying</div>
                <div>• Total letters copied = 195 (5.5 lines × 35 letters)</div>
                <div>• Calculation = 195 ÷ 3.0 = 65.0 LPM</div>
                <div className="font-bold text-emerald-700 font-sans">• Result: 50th–75th Percentile (Target Met)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Interactive Lined Thirds Worksheet & Stopwatch */}
        <div className="bg-white border-2 border-[#CBD5E1] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-[#0D6EFD] uppercase tracking-wider">
                Step 2: Timed Assessment Sprint
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{engine.activeSet.title}</h3>
            </div>

            {/* Academic Stopwatch */}
            <div className="flex items-center gap-3">
              <div className="font-mono text-3xl font-extrabold text-slate-900 bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-200 text-[#0D6EFD]">
                {engine.formatTime(engine.timerRemainingSec)}
              </div>

              {!engine.isTimerRunning ? (
                <button
                  type="button"
                  onClick={engine.startTimer}
                  className="px-4 py-2 rounded-xl bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Step</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={engine.pauseTimer}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              <button
                type="button"
                onClick={engine.resetTimer}
                className="px-2.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Prompt Sheet */}
          <div className="p-5 rounded-xl bg-blue-50/40 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Standardised Assessment Prompt (NSW Dotted Thirds)</span>
              <button
                type="button"
                onClick={engine.copyPromptText}
                className="text-[#0D6EFD] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{engine.copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
              </button>
            </div>
            <div className="font-serif text-lg text-slate-800 leading-relaxed bg-white p-4 rounded-lg border border-blue-100 shadow-2xs">
              "{engine.activeSet.promptText}"
            </div>
            <div className="text-[11px] text-slate-500">
              * Instruct student to copy continuously for 3 minutes without erasing. Count total letters upon timer expiration.
            </div>
          </div>

          {/* Step 3: Step-by-Step Evaluator Submission */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <div className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
              Step 3: Enter Problem Inputs
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-[#CBD5E1] bg-slate-50 space-y-1">
                <label className="font-bold text-slate-600 block text-[11px]">
                  Step A: Total Letters Written
                </label>
                <input
                  type="number"
                  value={engine.rawCount}
                  onChange={(e) => engine.setRawCount(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-[#0D6EFD]"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-[#CBD5E1] bg-slate-50 space-y-1">
                <label className="font-bold text-slate-600 block text-[11px]">
                  Step B: Subtract Illegible Errors
                </label>
                <input
                  type="number"
                  value={engine.illegibleCount}
                  onChange={(e) => engine.setIllegibleCount(Number(e.target.value) || 0)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2 font-mono text-lg font-bold text-rose-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col justify-center">
                <div className="text-[10px] font-bold text-[#0D6EFD] uppercase">
                  Step C: Calculated Net LPM
                </div>
                <div className="font-mono text-2xl font-black text-slate-900 mt-0.5">
                  {engine.analysis ? `${Math.round(engine.analysis.netLpm)} LPM` : '—'}
                </div>
                <div className="text-[10px] font-bold text-slate-600">
                  Percentile: {engine.analysis?.status || 'developing'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={engine.submitAttempt}
              disabled={engine.isSubmittingAttempt}
              className="w-full py-3.5 rounded-xl bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{engine.justSavedLog ? '✓ Solution Verified & Logged' : 'Verify & Log Solution to Assessment Database'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
