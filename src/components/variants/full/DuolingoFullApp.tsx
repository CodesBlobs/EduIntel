import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Flame,
  Zap,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Target,
  Copy,
  Check,
  Award,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react'
import { useTestEngine } from '@/hooks/useTestEngine'
import { TEST_SETS, TestSetKey } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const DuolingoFullApp: React.FC = () => {
  const engine = useTestEngine()

  const questStages: { key: TestSetKey; name: string; icon: string; xp: number; desc: string }[] = [
    { key: 'setA', name: 'Alphabet Recall', icon: '🔤', xp: 50, desc: '60s recall warmup' },
    { key: 'setB', name: '3-Min HST Pangram Sprint', icon: '⚡', xp: 100, desc: 'Official Wallen test' },
    { key: 'setC', name: 'Near-Point Copy', icon: '🎯', xp: 75, desc: 'Spelling & punctuation load' },
    { key: 'setD', name: 'NAPLAN Persuasive Exam', icon: '🏆', xp: 150, desc: '10-Min endurance boss' },
    { key: 'setE', name: 'Orthographic Sprint', icon: '🚀', xp: 60, desc: '45s rapid recall' },
  ]

  const timerPct = Math.round(
    ((engine.activeSet.durationSec - engine.timerRemainingSec) / engine.activeSet.durationSec) * 100
  )

  return (
    <div className="min-h-screen bg-[#F7FBEF] text-stone-900 font-sans pb-28">
      {/* Duolingo Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-stone-200 px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Mascot Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#58CC02] border-b-4 border-[#46A302] flex items-center justify-center text-white text-xl font-black shadow-sm">
              🦉
            </div>
            <div>
              <div className="font-black text-lg tracking-tight text-[#58CC02]">
                EduDuo <span className="text-stone-400 font-normal text-xs">• NSW 2028</span>
              </div>
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Handwriting League
              </div>
            </div>
          </div>

          {/* Gamified HUD: Streak, XP, Hearts */}
          <div className="flex items-center gap-3 sm:gap-5 text-xs font-black">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-100 text-[#FF9600] border-2 border-orange-200">
              <Flame className="w-4 h-4 fill-current" />
              <span>3 DAYS</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100 text-amber-700 border-2 border-amber-200">
              <Zap className="w-4 h-4 fill-current text-amber-500" />
              <span>{engine.savedAttempts.length * 75 + 120} XP</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-100 text-rose-600 border-2 border-rose-200">
              <Heart className="w-4 h-4 fill-current text-rose-500" />
              <span>5/5</span>
            </div>

            <button
              type="button"
              onClick={engine.openReportModal}
              className="px-3.5 py-1.5 rounded-2xl bg-[#58CC02] border-b-4 border-[#46A302] hover:bg-[#46A302] text-white font-black text-xs uppercase cursor-pointer hidden md:flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Trophies</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Split into Duolingo Path (Left 4 cols) & Active Quest Arena (Right 8 cols) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT 4 COLS: DUOLINGO LEVEL PATH MAP */}
        <div className="lg:col-span-4 bg-white border-2 border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b-2 border-stone-100 pb-4">
            <div className="text-xs font-black uppercase tracking-wider text-[#58CC02] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Section 1: NSW Speed Mastery</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 mt-1">Diagnostic Quest Path</h2>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Complete each level sprint to unlock the NAPLAN 2028 Mastery Badge.
            </p>
          </div>

          {/* Stepped Level Stepping Stones */}
          <div className="space-y-3">
            {questStages.map((stage, idx) => {
              const isActive = engine.activeSetKey === stage.key
              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() => engine.selectTestSet(stage.key)}
                  className={cn(
                    'w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 relative',
                    'border-b-4 active:border-b-2 active:translate-y-0.5',
                    isActive
                      ? 'bg-emerald-50 border-[#58CC02] text-[#58CC02] shadow-sm'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-b-2 font-black',
                      isActive ? 'bg-[#58CC02] text-white border-[#46A302]' : 'bg-stone-100 text-stone-600'
                    )}
                  >
                    {stage.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-stone-900 truncate">{stage.name}</span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        +{stage.xp} XP
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 font-medium truncate">{stage.desc}</div>
                  </div>
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#58CC02] shrink-0 animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Target Grade Selector */}
          <div className="pt-4 border-t-2 border-stone-100 space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-stone-400">
              Select Your Year Division
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['year3', 'year5', 'year7'] as const).map((y) => {
                const isY = engine.selectedCohort === y
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => engine.setSelectedCohort(y)}
                    className={cn(
                      'py-2 px-1 rounded-xl border-2 text-center text-xs font-black transition-all cursor-pointer border-b-4 active:border-b-2',
                      isY
                        ? 'bg-[#1CB0F6] border-[#1899D6] text-white shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    )}
                  >
                    {y === 'year3' ? 'Yr 3–4' : y === 'year5' ? 'Yr 5–6' : 'Yr 7–9'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT 8 COLS: ACTIVE GAMIFIED QUEST ARENA */}
        <div className="lg:col-span-8 space-y-6">
          {/* Gamified Mission Card */}
          <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Quest Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-stone-100 pb-5">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#58CC02]/20 text-[#46A302] font-black text-xs uppercase tracking-wider">
                  ⭐ Current Mission
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
                  {engine.activeSet.title}
                </h1>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Target Speed: <strong className="text-stone-800">{engine.cohortNorm.targetLpm} LPM</strong> (~{engine.cohortNorm.copyWpmMax} WPM) for {engine.cohortNorm.shortName}
                </p>
              </div>

              {/* Big Chunky Gamified Stopwatch Readout */}
              <div className="flex items-center gap-3 bg-[#F7FBEF] border-2 border-[#58CC02] rounded-2xl p-3 shrink-0">
                <div className="text-center">
                  <div className="text-[10px] font-black uppercase text-stone-400">Time Left</div>
                  <div className="text-3xl font-black font-mono text-[#46A302]">
                    {engine.formatTime(engine.timerRemainingSec)}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  {!engine.isTimerRunning ? (
                    <button
                      type="button"
                      onClick={engine.startTimer}
                      className="px-4 py-2 rounded-xl bg-[#58CC02] border-b-4 border-[#46A302] hover:bg-[#46A302] text-white font-black text-xs uppercase flex items-center gap-1 cursor-pointer transition-all active:translate-y-0.5 active:border-b-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Sprint</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={engine.pauseTimer}
                      className="px-4 py-2 rounded-xl bg-[#FF9600] border-b-4 border-[#CC7800] hover:bg-[#CC7800] text-white font-black text-xs uppercase flex items-center gap-1 cursor-pointer transition-all active:translate-y-0.5 active:border-b-2"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={engine.resetTimer}
                    className="p-1 text-stone-400 hover:text-stone-700 text-center text-[10px] font-bold cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Gamified Energy Countdown Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black text-stone-500">
                <span>QUEST PROGRESS</span>
                <span>{timerPct}%</span>
              </div>
              <div className="w-full h-4 rounded-full bg-stone-100 border border-stone-200 overflow-hidden p-0.5">
                <motion.div
                  className="h-full rounded-full bg-[#58CC02]"
                  style={{ width: `${timerPct}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>

            {/* Big Lined Prompt Card with Mascot Callout */}
            <div className="bg-[#FFFDF5] border-2 border-[#EADCA6] rounded-2xl p-5 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✍️</span>
                  <span className="text-xs font-black uppercase text-amber-800">
                    Handwriting Practice Sheet
                  </span>
                </div>
                <button
                  type="button"
                  onClick={engine.copyPromptText}
                  className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-50 flex items-center gap-1 cursor-pointer"
                >
                  {engine.copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{engine.copiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              </div>

              <div className="font-serif text-lg sm:text-xl text-stone-800 leading-relaxed tracking-wide bg-white/80 p-4 rounded-xl border border-amber-200">
                "{engine.activeSet.promptText}"
              </div>

              <div className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
                <span>💡 Tip:</span>
                <span>Keep your pencil at 30° tilt. Don't erase mistakes, strike through with one line!</span>
              </div>
            </div>

            {/* Duolingo Score Check-in Arena */}
            <div className="bg-stone-50 rounded-2xl p-5 border-2 border-stone-200 space-y-4">
              <div className="font-black text-sm text-stone-900 flex items-center gap-2">
                <span>🎯</span>
                <span>Sprint Complete? Bank Your Score &amp; XP!</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border-2 border-stone-200">
                  <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                    Letters Written
                  </label>
                  <input
                    type="number"
                    value={engine.rawCount}
                    onChange={(e) => engine.setRawCount(Number(e.target.value) || 0)}
                    className="w-full font-mono font-black text-xl text-stone-900 focus:outline-none"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border-2 border-stone-200">
                  <label className="text-[11px] font-black uppercase text-stone-400 block mb-1">
                    Illegible / Errors
                  </label>
                  <input
                    type="number"
                    value={engine.illegibleCount}
                    onChange={(e) => engine.setIllegibleCount(Number(e.target.value) || 0)}
                    className="w-full font-mono font-black text-xl text-rose-600 focus:outline-none"
                  />
                </div>

                <div className="bg-white p-3 rounded-xl border-2 border-stone-200 flex flex-col justify-center">
                  <div className="text-[10px] font-black uppercase text-stone-400">Net Speed Result</div>
                  <div className="text-xl font-black text-[#58CC02] font-mono">
                    {engine.analysis ? `${Math.round(engine.analysis.netLpm)} LPM` : '—'}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 uppercase">
                    Status: {engine.analysis?.status || 'developing'}
                  </div>
                </div>
              </div>

              {/* Huge 3D "BANK XP" Button */}
              <button
                type="button"
                onClick={engine.submitAttempt}
                disabled={engine.isSubmittingAttempt}
                className="w-full py-4 rounded-2xl bg-[#58CC02] border-b-4 border-[#46A302] hover:bg-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black text-base uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Trophy className="w-5 h-5" />
                <span>{engine.justSavedLog ? '⭐ QUEST SAVED & XP BANKED!' : 'BANK MY SCORE & EARN +100 XP'}</span>
              </button>
            </div>
          </div>

          {/* Recent Quests Feed */}
          {engine.savedAttempts.length > 0 && (
            <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="font-black text-sm text-stone-900">Recent Completed Quests</div>
              <div className="divide-y divide-stone-100">
                {engine.savedAttempts.slice(0, 4).map((a) => (
                  <div key={a.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        ✓
                      </span>
                      <span className="font-bold text-stone-800">{a.studentLabel}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-stone-900">{a.netLpm} LPM</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        +75 XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
