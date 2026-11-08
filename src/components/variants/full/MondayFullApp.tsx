import React, { useState } from 'react'
import {
  Kanban,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Users,
  Copy,
  Check,
  Trophy,
} from 'lucide-react'
import { useTestEngine } from '@/hooks/useTestEngine'
import { TEST_SETS, TestSetKey, CohortKey } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const MondayFullApp: React.FC = () => {
  const engine = useTestEngine()
  const [selectedGroup, setSelectedGroup] = useState<CohortKey>('year5')

  const groups: {
    key: CohortKey
    title: string
    color: string
    tasks: { id: string; name: string; setKey: TestSetKey; owner: string; status: string; statusBg: string; lpm: string }[]
  }[] = [
    {
      key: 'year3',
      title: 'Stage 2 Primary (Year 3–4)',
      color: 'border-l-[#00C875]',
      tasks: [
        { id: 'y3-1', name: 'Alphabet Recall Sprint (60s)', setKey: 'setA', owner: 'Alex M.', status: 'Done', statusBg: 'bg-[#00C875]', lpm: '48 LPM' },
        { id: 'y3-2', name: '3-Min HST Pangram Sprint', setKey: 'setB', owner: 'Alex M.', status: 'Working on it', statusBg: 'bg-[#FDAB3D]', lpm: '55 LPM' },
      ],
    },
    {
      key: 'year5',
      title: 'Stage 3 NAPLAN Transition (Year 5–6) ★ 2028 Priority',
      color: 'border-l-[#FDAB3D]',
      tasks: [
        { id: 'y5-1', name: 'HST 3-Minute Joined Cursive Sprint', setKey: 'setB', owner: 'Jordan K.', status: 'Ready to Run', statusBg: 'bg-[#6161FF]', lpm: '64 LPM' },
        { id: 'y5-2', name: 'Near-Point Copy Accuracy Test', setKey: 'setC', owner: 'Jordan K.', status: 'Needs Review', statusBg: 'bg-[#E2445C]', lpm: '52 LPM' },
      ],
    },
    {
      key: 'year7',
      title: 'Junior Secondary (Year 7–9) Exam Endurance',
      color: 'border-l-[#6161FF]',
      tasks: [
        { id: 'y7-1', name: '10-Minute Free Persuasive Drafting Sprint', setKey: 'setD', owner: 'Sam T.', status: 'In Queue', statusBg: 'bg-stone-400', lpm: '98 LPM' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-stone-900 font-sans pb-32">
      {/* Monday.com Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#D0D4E4] px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6161FF] text-white flex items-center justify-center font-black text-sm">
              M
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-stone-900 tracking-tight flex items-center gap-2">
                <span>Handwriting Readiness Board</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  NSW 2028
                </span>
              </div>
              <div className="text-[11px] text-stone-400 font-medium">Work-OS Pipeline</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={engine.openReportModal}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D4E4] hover:bg-stone-50 text-xs font-bold text-stone-700 cursor-pointer"
            >
              Export Board PDF
            </button>
            <button
              type="button"
              onClick={engine.startTimer}
              className="px-4 py-1.5 rounded-lg bg-[#0073EA] hover:bg-[#0060B9] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>+ Run Live Test</span>
            </button>
          </div>
        </div>
      </header>

      {/* Monday Board View Tabs & Filter Toolbar */}
      <div className="bg-white border-b border-[#D0D4E4] px-4 sm:px-8 py-2">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 font-bold text-stone-600">
            <span className="text-[#0073EA] border-b-2 border-[#0073EA] pb-2 cursor-pointer">
              Main Table
            </span>
            <span className="hover:text-stone-900 pb-2 cursor-pointer">Kanban View</span>
            <span className="hover:text-stone-900 pb-2 cursor-pointer">Speed Norms</span>
            <span className="hover:text-stone-900 pb-2 cursor-pointer">Activity Log</span>
          </div>

          <div className="flex items-center gap-2 text-stone-500">
            <span className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-md text-[11px]">
              <Search className="w-3 h-3" />
              <span>Search board</span>
            </span>
            <span className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-md text-[11px]">
              <Filter className="w-3 h-3" />
              <span>Filter</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Board Table */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Active Pulse Stopwatch Widget */}
        <div className="bg-white rounded-2xl border border-[#D0D4E4] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6161FF]/10 text-[#6161FF] flex items-center justify-center font-bold text-xl shrink-0">
              ⚡
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#6161FF] uppercase tracking-wider">
                Active Assessment Pulse
              </div>
              <h2 className="text-lg font-bold text-stone-900">{engine.activeSet.title}</h2>
              <p className="text-xs text-stone-500">
                Target: {engine.cohortNorm.targetLpm} LPM (~{engine.cohortNorm.copyWpmMax} WPM) for {engine.cohortNorm.shortName}
              </p>
            </div>
          </div>

          {/* Stopwatch Controls */}
          <div className="flex items-center gap-3">
            <div className="text-center font-mono text-3xl font-black text-stone-900 bg-[#F5F6F8] px-4 py-2 rounded-xl border border-[#D0D4E4]">
              {engine.formatTime(engine.timerRemainingSec)}
            </div>

            {!engine.isTimerRunning ? (
              <button
                type="button"
                onClick={engine.startTimer}
                className="px-5 py-2.5 rounded-xl bg-[#00C875] hover:bg-[#00B268] text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={engine.pauseTimer}
                className="px-5 py-2.5 rounded-xl bg-[#FDAB3D] hover:bg-[#E89828] text-white font-bold text-xs uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            )}
            <button
              type="button"
              onClick={engine.resetTimer}
              className="px-3 py-2 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Monday Prompt & Input Drawer */}
        <div className="bg-white rounded-2xl border border-[#D0D4E4] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 border-b border-[#F0F2F7] pb-3">
            <span>Student Writing Prompt (NSW Foundation Style)</span>
            <button
              type="button"
              onClick={engine.copyPromptText}
              className="text-[#0073EA] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{engine.copiedPrompt ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F6F8] border border-[#E0E3EE] font-serif text-sm text-stone-800 leading-relaxed">
            "{engine.activeSet.promptText}"
          </div>

          {/* Quick Input Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="border border-[#D0D4E4] rounded-xl p-2.5">
              <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                Letters Written
              </span>
              <input
                type="number"
                value={engine.rawCount}
                onChange={(e) => engine.setRawCount(Number(e.target.value) || 0)}
                className="w-full font-mono text-base font-bold text-stone-900 focus:outline-none"
              />
            </div>

            <div className="border border-[#D0D4E4] rounded-xl p-2.5">
              <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                Errors
              </span>
              <input
                type="number"
                value={engine.illegibleCount}
                onChange={(e) => engine.setIllegibleCount(Number(e.target.value) || 0)}
                className="w-full font-mono text-base font-bold text-rose-600 focus:outline-none"
              />
            </div>

            <div className="border border-[#D0D4E4] rounded-xl p-2.5 bg-stone-50">
              <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                Speed Result
              </span>
              <div className="font-mono text-base font-bold text-[#00C875]">
                {engine.analysis ? `${Math.round(engine.analysis.netLpm)} LPM` : '—'}
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={engine.submitAttempt}
                disabled={engine.isSubmittingAttempt}
                className="w-full py-3 rounded-xl bg-[#0073EA] hover:bg-[#0060B9] text-white font-bold text-xs uppercase shadow-sm cursor-pointer"
              >
                {engine.justSavedLog ? '✓ Saved' : 'Commit Pulse'}
              </button>
            </div>
          </div>
        </div>

        {/* Monday Multi-Group Table */}
        <div className="space-y-6">
          {groups.map((grp) => (
            <div key={grp.key} className="bg-white rounded-2xl border border-[#D0D4E4] overflow-hidden shadow-2xs">
              {/* Group Title Bar */}
              <div className={cn('p-3.5 bg-white border-l-8 flex items-center justify-between border-b border-[#D0D4E4]', grp.color)}>
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                  <span className="font-extrabold text-sm text-stone-900">{grp.title}</span>
                  <span className="text-xs text-stone-400">({grp.tasks.length} tasks)</span>
                </div>

                <button
                  type="button"
                  onClick={() => engine.setSelectedCohort(grp.key)}
                  className="text-xs font-bold text-[#0073EA] hover:underline cursor-pointer"
                >
                  Set as Active Target
                </button>
              </div>

              {/* Monday Columns */}
              <div className="divide-y divide-[#E6E9EF] text-xs">
                {grp.tasks.map((task) => (
                  <div key={task.id} className="grid grid-cols-12 items-center py-3 px-4 hover:bg-stone-50 transition-colors">
                    <div className="col-span-5 font-bold text-stone-900 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          engine.setSelectedCohort(grp.key)
                          engine.selectTestSet(task.setKey)
                        }}
                        className="hover:text-[#0073EA] text-left cursor-pointer"
                      >
                        {task.name}
                      </button>
                    </div>

                    <div className="col-span-2 text-center text-stone-500 flex items-center justify-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                        {task.owner[0]}
                      </div>
                      <span>{task.owner}</span>
                    </div>

                    <div className="col-span-3 text-center">
                      <span className={cn('px-3 py-1 rounded text-white font-bold text-[11px]', task.statusBg)}>
                        {task.status}
                      </span>
                    </div>

                    <div className="col-span-2 text-right font-mono font-bold text-stone-700">
                      {task.lpm}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
