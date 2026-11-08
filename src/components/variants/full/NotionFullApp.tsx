import React, { useState } from 'react'
import {
  FileText,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Tag,
  Calendar,
  CheckSquare,
  BarChart2,
  Share2,
  Star,
  MoreHorizontal,
  Copy,
  Check,
  Plus,
  BookOpen,
} from 'lucide-react'
import { useTestEngine } from '@/hooks/useTestEngine'
import { TEST_SETS, TestSetKey } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const NotionFullApp: React.FC = () => {
  const engine = useTestEngine()
  const [protocolToggle, setProtocolToggle] = useState(false)
  const [criteriaToggle, setCriteriaToggle] = useState(false)

  const cohorts = [
    { key: 'year3' as const, label: 'Stage 2 Primary (Yr 3–4)' },
    { key: 'year5' as const, label: 'Stage 3 Priority (Yr 5–6)' },
    { key: 'year7' as const, label: 'Junior Secondary (Yr 7–9)' },
  ]

  const testSets: { key: TestSetKey; label: string }[] = [
    { key: 'setA', label: '1. Alphabet Recall (60s)' },
    { key: 'setB', label: '2. 3-Min Pangram Sprint (180s)' },
    { key: 'setC', label: '3. Near-Point Copy (120s)' },
    { key: 'setD', label: '4. 10-Min Free Write (600s)' },
  ]

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#37352F] font-sans pb-32">
      {/* Notion Top Breadcrumbs Bar */}
      <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#EAE9E4] px-4 sm:px-8 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-[#787774]">
          <div className="flex items-center gap-1.5 truncate">
            <span>Workspace</span>
            <span>/</span>
            <span>NSW Department of Education</span>
            <span>/</span>
            <span className="text-[#37352F] font-medium flex items-center gap-1 truncate">
              <span>📄</span>
              <span>HandwritingReadiness_2028.spec</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={engine.openReportModal}
              className="px-2.5 py-1 rounded hover:bg-[#EAE9E4] text-[#37352F] font-medium transition-colors cursor-pointer"
            >
              Print Report
            </button>
            <button type="button" className="p-1 hover:bg-[#EAE9E4] rounded transition-colors text-[#787774]">
              <Star className="w-3.5 h-3.5" />
            </button>
            <button type="button" className="p-1 hover:bg-[#EAE9E4] rounded transition-colors text-[#787774]">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Notion Document Page Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-10 space-y-8">
        {/* Page Icon & Notion Heading */}
        <div className="space-y-4">
          <div className="text-5xl select-none">📝</div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191918]">
            NSW Handwriting Readiness &amp; NAPLAN 2028 Protocol
          </h1>
          <p className="text-sm text-[#787774] leading-relaxed">
            Standardised assessment database measuring cursive transcription speed, pencil grip fatigue, and exam handwriting legibility under Wallen, Bonney &amp; Lennox protocols.
          </p>
        </div>

        {/* Notion Properties Database Block */}
        <div className="border border-[#EAE9E4] rounded-xl overflow-hidden bg-white text-xs divide-y divide-[#EAE9E4]">
          <div className="flex items-center py-2.5 px-4 justify-between">
            <div className="flex items-center gap-2 text-[#9B9A97] w-40">
              <Tag className="w-3.5 h-3.5" />
              <span>Target Cohort</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cohorts.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => engine.setSelectedCohort(c.key)}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer',
                    engine.selectedCohort === c.key
                      ? 'bg-[#E3E2DE] text-[#37352F] font-semibold'
                      : 'bg-[#F4F3EF] text-[#787774] hover:bg-[#EAE9E4]'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center py-2.5 px-4 justify-between">
            <div className="flex items-center gap-2 text-[#9B9A97] w-40">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Protocol Test Set</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {testSets.map((ts) => (
                <button
                  key={ts.key}
                  type="button"
                  onClick={() => engine.selectTestSet(ts.key)}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer',
                    engine.activeSetKey === ts.key
                      ? 'bg-[#D3E5EF] text-[#183347] font-semibold'
                      : 'bg-[#F4F3EF] text-[#787774] hover:bg-[#EAE9E4]'
                  )}
                >
                  {ts.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center py-2.5 px-4 justify-between">
            <div className="flex items-center gap-2 text-[#9B9A97] w-40">
              <Calendar className="w-3.5 h-3.5" />
              <span>Benchmark Target</span>
            </div>
            <span className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              {engine.cohortNorm.targetLpm} LPM (~{engine.cohortNorm.copyWpmMax} WPM)
            </span>
          </div>
        </div>

        {/* Notion Callout Block */}
        <div className="p-4 rounded-xl bg-[#F7F6F3] border border-[#EAE9E4] flex items-start gap-3 text-xs leading-relaxed text-[#37352F]">
          <span className="text-xl shrink-0">💡</span>
          <div>
            <strong>Policy Context:</strong> NSW Ministerial reform calls for the return to pen-and-paper NAPLAN writing tests by 2028. This document standardises the assessment of letter formation, spacing, and motor stamina across NSW syllabus Stages 1–5.
          </div>
        </div>

        {/* Notion Collapsible Toggles */}
        <div className="space-y-2 text-xs">
          <div className="border border-[#EAE9E4] rounded-lg p-3 bg-white">
            <button
              type="button"
              onClick={() => setProtocolToggle(!protocolToggle)}
              className="flex items-center gap-2 w-full text-left font-medium text-[#37352F] cursor-pointer"
            >
              {protocolToggle ? <ChevronDown className="w-4 h-4 text-[#9B9A97]" /> : <ChevronRight className="w-4 h-4 text-[#9B9A97]" />}
              <span>▶ Administration Instructions &amp; Timing Rules</span>
            </button>
            {protocolToggle && (
              <div className="mt-2.5 pl-6 pr-2 text-[#787774] space-y-1.5 leading-relaxed">
                <p>
                  Place the pangram prompt directly in front of the student. Instruct them to copy continuously onto lined third paper without erasing. Cross-outs are permitted with a single strike-through.
                </p>
                <p className="font-mono text-[11px] text-[#37352F]">
                  Formula: Net LPM = (Raw Count − Illegible Errors) ÷ Duration (min)
                </p>
              </div>
            )}
          </div>

          <div className="border border-[#EAE9E4] rounded-lg p-3 bg-white">
            <button
              type="button"
              onClick={() => setCriteriaToggle(!criteriaToggle)}
              className="flex items-center gap-2 w-full text-left font-medium text-[#37352F] cursor-pointer"
            >
              {criteriaToggle ? <ChevronDown className="w-4 h-4 text-[#9B9A97]" /> : <ChevronRight className="w-4 h-4 text-[#9B9A97]" />}
              <span>▶ 10-Point NSW Foundation Style Cursive Join Criteria</span>
            </button>
            {criteriaToggle && (
              <div className="mt-2.5 pl-6 pr-2 text-[#787774] space-y-1 leading-relaxed">
                <p>1. Slope: consistent 10–15° forward slant.</p>
                <p>2. Joins: diagonal ascender joins to l, t, k, h; horizontal joins from o, v, w.</p>
                <p>3. Proportion: ascenders 2x body height, descenders 1.5x body height on dotted thirds.</p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Notion Embedded Test Console */}
        <div className="border border-[#EAE9E4] rounded-2xl bg-white p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#EAE9E4] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">⏱️</span>
              <span className="font-bold text-sm text-[#191918]">Active Assessment Stopwatch</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold text-[#191918] bg-[#F4F3EF] px-3 py-1 rounded-lg">
                {engine.formatTime(engine.timerRemainingSec)}
              </span>

              {!engine.isTimerRunning ? (
                <button
                  type="button"
                  onClick={engine.startTimer}
                  className="px-3.5 py-1.5 rounded-lg bg-[#2E2E2E] text-white hover:bg-[#191918] text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={engine.pauseTimer}
                  className="px-3.5 py-1.5 rounded-lg bg-[#EAE9E4] text-[#37352F] hover:bg-[#E3E2DE] text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
              )}
              <button
                type="button"
                onClick={engine.resetTimer}
                className="px-2 py-1.5 text-xs text-[#787774] hover:text-[#37352F] cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Prompt Quote Block */}
          <div className="border-l-2 border-[#191918] pl-4 py-1 italic font-serif text-base text-[#191918]">
            "{engine.activeSet.promptText}"
          </div>

          {/* Minimalist Notion Scoring Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
            <div className="p-3 rounded-lg border border-[#EAE9E4] bg-[#FBFBFA]">
              <span className="text-[#9B9A97] block mb-1">Letters Written</span>
              <input
                type="number"
                value={engine.rawCount}
                onChange={(e) => engine.setRawCount(Number(e.target.value) || 0)}
                className="w-full font-mono text-lg font-bold text-[#191918] bg-transparent focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-lg border border-[#EAE9E4] bg-[#FBFBFA]">
              <span className="text-[#9B9A97] block mb-1">Errors / Illegible</span>
              <input
                type="number"
                value={engine.illegibleCount}
                onChange={(e) => engine.setIllegibleCount(Number(e.target.value) || 0)}
                className="w-full font-mono text-lg font-bold text-rose-700 bg-transparent focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-lg border border-[#EAE9E4] bg-[#FBFBFA]">
              <span className="text-[#9B9A97] block mb-1">Calculated Net LPM</span>
              <div className="font-mono text-lg font-bold text-[#191918]">
                {engine.analysis ? `${Math.round(engine.analysis.netLpm)} LPM` : '—'}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={engine.submitAttempt}
              disabled={engine.isSubmittingAttempt}
              className="px-4 py-2 rounded-lg bg-[#2E2E2E] hover:bg-[#191918] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{engine.justSavedLog ? '✓ Saved to Database' : 'Record Attempt in Database'}</span>
            </button>
          </div>
        </div>

        {/* Notion Database Table of Recorded Attempts */}
        {engine.savedAttempts.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#9B9A97] uppercase tracking-wider flex items-center gap-1.5">
              <span>📊</span>
              <span>Attempts Database (Neon Postgres)</span>
            </div>
            <div className="border border-[#EAE9E4] rounded-xl overflow-hidden bg-white text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F7F6F3] text-[#787774] border-b border-[#EAE9E4]">
                  <tr>
                    <th className="py-2 px-3 font-medium">Session Name</th>
                    <th className="py-2 px-3 font-medium">Cohort</th>
                    <th className="py-2 px-3 font-medium">Speed</th>
                    <th className="py-2 px-3 font-medium">Status</th>
                    <th className="py-2 px-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE9E4]">
                  {engine.savedAttempts.map((a) => (
                    <tr key={a.id} className="hover:bg-[#FBFBFA]">
                      <td className="py-2.5 px-3 font-medium text-[#191918]">{a.studentLabel}</td>
                      <td className="py-2.5 px-3 text-[#787774]">{a.cohortKey}</td>
                      <td className="py-2.5 px-3 font-mono font-medium">{a.netLpm} LPM</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-[#37352F]">
                          {a.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#9B9A97]">{a.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
