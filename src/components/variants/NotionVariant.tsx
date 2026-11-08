import React, { useState } from 'react'
import {
  FileText,
  ChevronRight,
  ChevronDown,
  Play,
  Calendar,
  CheckSquare,
  BarChart2,
  Tag,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import { VariantHeroProps } from './types'
import { COHORT_NORMS, TEST_SETS } from '@/data/handwritingData'
import { cn } from '@/lib/utils'

export const NotionVariant: React.FC<VariantHeroProps> = ({
  selectedCohort,
  onSelectCohort,
  activeSetKey,
  onSelectTestSet,
  onStartAssessment,
  savedAttemptsCount,
  latestAttempt,
  onOpenReport,
}) => {
  const [toggle1, setToggle1] = useState(false)
  const [toggle2, setToggle2] = useState(false)

  const cohortList = [
    { key: 'year3' as const, label: 'Year 3–4', tag: 'Stage 2 Primary', speed: '55 LPM (~11 WPM)' },
    { key: 'year5' as const, label: 'Year 5–6', tag: 'Stage 3 Priority', speed: '64 LPM (~13 WPM)' },
    { key: 'year7' as const, label: 'Year 7–9', tag: 'Secondary Stamina', speed: '98 LPM (~20 WPM)' },
  ]

  return (
    <div className="bg-[#FBFBFA] border border-[#EAE9E4] rounded-2xl p-6 sm:p-9 shadow-2xs font-sans text-[#37352F] space-y-6">
      {/* Notion Document Header */}
      <div className="space-y-3">
        <div className="text-4xl">📄</div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191918]">
            NSW Handwriting Readiness Specification (2028 Return)
          </h1>
          <p className="text-sm text-[#787774]">
            Official diagnostic standard evaluating cursive joined speed, pencil posture, and exam writing stamina under Wallen, Bonney &amp; Lennox protocols.
          </p>
        </div>
      </div>

      {/* Notion Database Properties Table */}
      <div className="border border-[#EAE9E4] rounded-xl overflow-hidden text-xs bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE9E4]">
          <div className="p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#9B9A97] flex items-center gap-1.5 font-medium">
                <Tag className="w-3.5 h-3.5" />
                <span>Target Cohort</span>
              </span>
              <div className="flex items-center gap-1">
                {cohortList.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => onSelectCohort(c.key)}
                    className={cn(
                      'px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer',
                      selectedCohort === c.key
                        ? 'bg-[#E3E2DE] text-[#37352F] font-semibold'
                        : 'bg-[#F4F3EF] text-[#787774] hover:bg-[#EAE9E4]'
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9B9A97] flex items-center gap-1.5 font-medium">
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Active Test Set</span>
              </span>
              <span className="font-mono font-medium text-[#37352F]">
                {TEST_SETS[activeSetKey].shortTitle} ({TEST_SETS[activeSetKey].durationMin} min)
              </span>
            </div>
          </div>

          <div className="p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#9B9A97] flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Curriculum Style</span>
              </span>
              <span className="bg-[#DFE7EA] text-[#2E454B] px-1.5 py-0.5 rounded text-[11px] font-medium">
                NSW Foundation joined
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9B9A97] flex items-center gap-1.5 font-medium">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Database Status</span>
              </span>
              <span className="text-emerald-700 font-medium">
                {savedAttemptsCount > 0 ? `${savedAttemptsCount} attempts recorded` : 'Ready for initial run'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notion Collapsible Toggle Blocks */}
      <div className="space-y-2 text-xs">
        <div className="border border-[#EAE9E4] rounded-lg bg-white p-3">
          <button
            type="button"
            onClick={() => setToggle1(!toggle1)}
            className="flex items-center gap-2 w-full text-left font-medium text-[#37352F] hover:text-[#191918] cursor-pointer"
          >
            {toggle1 ? <ChevronDown className="w-4 h-4 text-[#9B9A97]" /> : <ChevronRight className="w-4 h-4 text-[#9B9A97]" />}
            <span>▶ Assessment Protocol: 3-Minute Australian HST Speed Sprint</span>
          </button>
          {toggle1 && (
            <div className="mt-2 pl-6 pr-2 text-[#787774] leading-relaxed space-y-1">
              <p>
                Adapted from Wallen, Bonney &amp; Lennox (1996). The student copies "The quick brown fox jumps over the lazy dog" on lined paper continuously for 180 seconds.
              </p>
              <p className="font-mono text-[11px] text-[#37352F]">
                Formula: Net LPM = (Total letters written - Illegible letters) ÷ 3 minutes
              </p>
            </div>
          )}
        </div>

        <div className="border border-[#EAE9E4] rounded-lg bg-white p-3">
          <button
            type="button"
            onClick={() => setToggle2(!toggle2)}
            className="flex items-center gap-2 w-full text-left font-medium text-[#37352F] hover:text-[#191918] cursor-pointer"
          >
            {toggle2 ? <ChevronDown className="w-4 h-4 text-[#9B9A97]" /> : <ChevronRight className="w-4 h-4 text-[#9B9A97]" />}
            <span>▶ Official NSW Department of Education Alignment Guidelines</span>
          </button>
          {toggle2 && (
            <div className="mt-2 pl-6 pr-2 text-[#787774] leading-relaxed">
              Calibrated to NSW Stage 1–5 handwriting syllabi, focusing on diagonal cursive joins, pencil grip ergonomics (dynamic tripod), and wrist posture stabilization.
            </div>
          )}
        </div>
      </div>

      {/* Notion Document Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EAE9E4]">
        <div className="flex items-center gap-2 text-xs text-[#787774]">
          <BookOpen className="w-4 h-4 text-[#9B9A97]" />
          <span>Click to launch assessment stopwatch and evaluator.</span>
        </div>

        <button
          type="button"
          onClick={onStartAssessment}
          className="px-4 py-2 rounded-lg bg-[#2E2E2E] hover:bg-[#191918] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start Assessment Protocol</span>
        </button>
      </div>
    </div>
  )
}

