import React from 'react'
import {
  Kanban,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Users,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { VariantHeroProps } from './types'
import { COHORT_NORMS, TEST_SETS } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const MondayVariant: React.FC<VariantHeroProps> = ({
  selectedCohort,
  onSelectCohort,
  activeSetKey,
  onSelectTestSet,
  onStartAssessment,
  savedAttemptsCount,
  latestAttempt,
  onOpenReport,
}) => {
  const pulseItems = [
    {
      id: 'p1',
      cohort: 'Year 3–4',
      cohortKey: 'year3' as const,
      task: '3-Min HST Pangram Sprint',
      target: '55 LPM (~11 WPM)',
      status: 'Done',
      statusColor: 'bg-[#00C875] text-white',
      owner: 'Stage 2 Primary',
    },
    {
      id: 'p2',
      cohort: 'Year 5–6',
      cohortKey: 'year5' as const,
      task: 'Cursive Joined Stamina (2028 Priority)',
      target: '64 LPM (~13 WPM)',
      status: 'Working on it',
      statusColor: 'bg-[#FDAB3D] text-white',
      owner: 'Stage 3 NAPLAN',
    },
    {
      id: 'p3',
      cohort: 'Year 7–9',
      cohortKey: 'year7' as const,
      task: '10-Min Free Write Exam Endurance',
      target: '98 LPM (~20 WPM)',
      status: 'Ready to Run',
      statusColor: 'bg-[#6161FF] text-white',
      owner: 'Junior Secondary',
    },
  ]

  return (
    <div className="bg-white border border-[#E6E9EF] rounded-3xl p-6 sm:p-9 shadow-sm text-stone-900 space-y-6">
      {/* Monday Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E9EF] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#6161FF] text-white flex items-center justify-center font-bold text-xs">
              M
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6161FF]">
              Work-OS Diagnostic Board
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            NSW NAPLAN 2028 Readiness Board
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartAssessment}
            className="px-5 py-2.5 rounded-xl bg-[#00C875] hover:bg-[#00B268] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Pulse Test</span>
          </button>
        </div>
      </div>

      {/* Monday Pulse Table View */}
      <div className="border border-[#E6E9EF] rounded-2xl overflow-hidden shadow-2xs">
        {/* Table Column Bar */}
        <div className="bg-[#F5F6F8] text-[11px] font-bold text-stone-500 uppercase tracking-wider grid grid-cols-12 py-3 px-4 border-b border-[#E6E9EF]">
          <div className="col-span-4 sm:col-span-3">Cohort Task</div>
          <div className="col-span-3 sm:col-span-2 text-center">Owner</div>
          <div className="col-span-3 sm:col-span-3 text-center">Clinical Target</div>
          <div className="col-span-2 sm:col-span-2 text-center">Status</div>
          <div className="hidden sm:block sm:col-span-2 text-right">Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#E6E9EF] text-xs">
          {pulseItems.map((item) => {
            const isSelected = selectedCohort === item.cohortKey
            return (
              <div
                key={item.id}
                className={cn(
                  'grid grid-cols-12 items-center py-3.5 px-4 transition-colors',
                  isSelected ? 'bg-[#F0F3FF]' : 'hover:bg-stone-50/70'
                )}
              >
                <div className="col-span-4 sm:col-span-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCohort(item.cohortKey)}
                    className="font-bold text-stone-900 hover:text-[#6161FF] text-left cursor-pointer truncate"
                  >
                    {item.cohort}
                    <div className="text-[11px] font-normal text-stone-500 truncate">{item.task}</div>
                  </button>
                </div>

                <div className="col-span-3 sm:col-span-2 text-center">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-medium">
                    {item.owner}
                  </span>
                </div>

                <div className="col-span-3 sm:col-span-3 text-center font-mono font-medium text-stone-700">
                  {item.target}
                </div>

                <div className="col-span-2 sm:col-span-2 text-center">
                  <span
                    className={cn(
                      'inline-block px-2.5 py-1 rounded-md text-[11px] font-bold truncate max-w-full',
                      item.statusColor
                    )}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="hidden sm:flex sm:col-span-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCohort(item.cohortKey)
                      onStartAssessment()
                    }}
                    className="text-[#6161FF] hover:text-[#4B4BDB] font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Run</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating Status Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        <div className="p-4 rounded-2xl bg-[#6161FF]/10 border border-[#6161FF]/20 space-y-1">
          <div className="text-[11px] font-bold text-[#6161FF] uppercase">1. Standard Speed Norms</div>
          <div className="text-sm font-bold text-stone-900">Wallen, Bonney &amp; Lennox HST</div>
          <p className="text-[11px] text-stone-600">Continuous 180s load measuring letters-per-minute.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#00C875]/10 border border-[#00C875]/20 space-y-1">
          <div className="text-[11px] font-bold text-[#00C875] uppercase">2. Legibility Audit</div>
          <div className="text-sm font-bold text-stone-900">10-Point NSW Criteria</div>
          <p className="text-[11px] text-stone-600">Letter slope, baseline consistency, and join mechanics.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FDAB3D]/10 border border-[#FDAB3D]/20 space-y-1">
          <div className="text-[11px] font-bold text-[#FDAB3D] uppercase">3. Postgres Telemetry</div>
          <div className="text-sm font-bold text-stone-900">Live Attempt Tracking</div>
          <p className="text-[11px] text-stone-600">{savedAttemptsCount} attempts stored in Neon DB.</p>
        </div>
      </div>
    </div>
  )
}

