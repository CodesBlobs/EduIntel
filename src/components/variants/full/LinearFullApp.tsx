import React, { useEffect } from 'react'
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  Activity,
  Copy,
  Check,
  ShieldCheck,
  Command,
} from 'lucide-react'
import { useTestEngine } from '@/hooks/useTestEngine'
import { TEST_SETS, TestSetKey, CohortKey } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const LinearFullApp: React.FC = () => {
  const engine = useTestEngine()

  // Keyboard shortcut listener: Space to toggle timer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (engine.isTimerRunning) {
          engine.pauseTimer()
        } else {
          engine.startTimer()
        }
      } else if (e.key === 'r' || e.key === 'R') {
        engine.resetTimer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [engine])

  const cohorts: { key: CohortKey; label: string; code: string; speed: string }[] = [
    { key: 'year3', label: 'Primary Stage 2', code: 'YR3-4', speed: '55 LPM' },
    { key: 'year5', label: 'NAPLAN Priority', code: 'YR5-6', speed: '64 LPM' },
    { key: 'year7', label: 'Secondary Endurance', code: 'YR7-9', speed: '98 LPM' },
  ]

  const testSets: { key: TestSetKey; code: string; name: string }[] = [
    { key: 'setA', code: 'HST-01', name: 'Alphabet Recall' },
    { key: 'setB', code: 'HST-02', name: '3-Min Pangram' },
    { key: 'setC', code: 'HST-03', name: 'Near-Point Copy' },
    { key: 'setD', code: 'HST-04', name: '10-Min Free Write' },
  ]

  return (
    <div className="min-h-screen bg-[#08090A] text-zinc-100 font-mono pb-32 selection:bg-indigo-500/30 selection:text-white">
      {/* Linear Ambient Glow Aura */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Command Line Header */}
      <header className="sticky top-0 z-40 bg-[#08090A]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <span className="text-white font-bold tracking-tight">HW-READINESS</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">NSW_2028_SPEC</span>
            <span className="text-zinc-600">/</span>
            <span className="text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-1.5 py-0.5 rounded text-[10px]">
              V8.2.0-STABLE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-500 text-[11px]">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>NEON_POSTGRES: ONLINE</span>
            </span>
            <button
              type="button"
              onClick={engine.openReportModal}
              className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/[0.1] text-zinc-300 text-xs transition-colors cursor-pointer"
            >
              Export Report
            </button>
          </div>
        </div>
      </header>

      {/* Linear Bento Grid Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6 relative z-10">
        {/* Row 1: Target Cohort Selector Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cohorts.map((c) => {
            const isSel = engine.selectedCohort === c.key
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => engine.setSelectedCohort(c.key)}
                className={cn(
                  'p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden',
                  isSel
                    ? 'bg-zinc-900/90 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/40'
                    : 'bg-zinc-950/50 border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:bg-zinc-900/40'
                )}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-500">{c.code}</span>
                  <span className={isSel ? 'text-indigo-400 font-bold' : 'text-zinc-400'}>{c.speed}</span>
                </div>
                <div className="font-sans font-bold text-sm text-zinc-200">{c.label}</div>
              </button>
            )
          })}
        </div>

        {/* Row 2: Bento Grid - Stopwatch Terminal (Left 7 Cols) & Diagnostic Telemetry (Right 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 7 COLS: HIGH FREQUENCY STOPWATCH & PROMPT CONSOLE */}
          <div className="lg:col-span-7 space-y-5">
            {/* Stopwatch Console Card */}
            <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">DIAGNOSTIC TIMER ENGINE</div>
                  <div className="text-sm font-sans font-bold text-zinc-200 mt-0.5">{engine.activeSet.title}</div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-white/[0.06]">
                  <Command className="w-3 h-3" />
                  <span>[Space] Toggle</span>
                </div>
              </div>

              {/* Huge Glow Readout */}
              <div className="text-center py-4">
                <div className="text-6xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {engine.formatTime(engine.timerRemainingSec)}
                </div>
                <div className="text-xs text-zinc-500 mt-2 font-mono">
                  BENCHMARK RUNNER // {engine.activeSet.durationSec}s MOTOR STAMINA LOAD
                </div>
              </div>

              {/* Stopwatch Action Controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {!engine.isTimerRunning ? (
                  <button
                    type="button"
                    onClick={engine.startTimer}
                    className="py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>EXECUTE TIMER</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={engine.pauseTimer}
                    className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>HALT TIMER</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={engine.resetTimer}
                  className="py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.1] text-zinc-300 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET [R]</span>
                </button>
              </div>
            </div>

            {/* Prompt Terminal Card */}
            <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/[0.08] pb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>PROMPT_BUFFER // NSW_FOUNDATION_STYLE</span>
                </span>
                <button
                  type="button"
                  onClick={engine.copyPromptText}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{engine.copiedPrompt ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-white/[0.06] text-sm text-zinc-200 font-sans leading-relaxed">
                "{engine.activeSet.promptText}"
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: EVALUATOR & TELEMETRY */}
          <div className="lg:col-span-5 space-y-5">
            {/* Metric Input Matrix */}
            <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>DIAGNOSTIC TELEMETRY MATRIX</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-500 text-[10px] uppercase block mb-1">
                    01 // RAW LETTERS COUNT
                  </label>
                  <input
                    type="number"
                    value={engine.rawCount}
                    onChange={(e) => engine.setRawCount(Number(e.target.value) || 0)}
                    className="w-full bg-black/60 border border-white/[0.1] rounded-lg p-2.5 font-mono text-base font-bold text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-zinc-500 text-[10px] uppercase block mb-1">
                    02 // ILLEGIBLE / MOTOR DEFECTS
                  </label>
                  <input
                    type="number"
                    value={engine.illegibleCount}
                    onChange={(e) => engine.setIllegibleCount(Number(e.target.value) || 0)}
                    className="w-full bg-black/60 border border-white/[0.1] rounded-lg p-2.5 font-mono text-base font-bold text-rose-400 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
                  <div className="text-[10px] text-indigo-400 uppercase">CALCULATED NET TRANSLATION SPEED</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {engine.analysis ? `${Math.round(engine.analysis.netLpm)} LPM` : '—'}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Benchmark: {engine.cohortNorm.targetLpm} LPM // Status: {engine.analysis?.status || 'developing'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={engine.submitAttempt}
                  disabled={engine.isSubmittingAttempt}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase cursor-pointer transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                >
                  {engine.justSavedLog ? '✓ TELEMETRY SAVED TO NEON' : 'COMMIT RUN TO DATABASE'}
                </button>
              </div>
            </div>

            {/* Previous Runs Feed */}
            {engine.savedAttempts.length > 0 && (
              <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-4 shadow-xl space-y-2 text-xs">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  PREVIOUS ATTEMPTS STREAM
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {engine.savedAttempts.slice(0, 3).map((a) => (
                    <div key={a.id} className="py-2 flex items-center justify-between text-zinc-300">
                      <div>
                        <div className="font-bold text-white">{a.studentLabel}</div>
                        <div className="text-[10px] text-zinc-500">{a.timestamp}</div>
                      </div>
                      <div className="font-bold text-indigo-400 font-mono">{a.netLpm} LPM</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
