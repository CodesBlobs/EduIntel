import React from 'react'
import { motion } from 'motion/react'
import {
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  CheckCircle2,
  FileCheck2,
  Users,
  Compass,
  Award,
} from 'lucide-react'
import {
  COHORT_NORMS,
  CohortKey,
  TEST_SETS,
  TestSetKey,
} from '@/data/handwritingData'
import { Badge, Button } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

export type SimplifiedYearGroup = 'year3' | 'year5' | 'year7'

export interface HeroImmediateAssessmentProps {
  selectedCohort: CohortKey
  onSelectCohort: (cohort: CohortKey) => void
  activeSetKey: TestSetKey
  onSelectTestSet: (setKey: TestSetKey) => void
  onStartAssessment: () => void
  savedAttemptsCount: number
  latestAttempt?: {
    studentLabel: string
    netLpm: number
    netWpm: number
    status: 'exceeds' | 'developing' | 'below'
  }
  onOpenReport: () => void
}

// Map the 3 primary plan.md year groups to recommended test set
const RECOMMENDATION_MAP: Record<
  SimplifiedYearGroup,
  {
    recommendedSet: TestSetKey
    label: string
    sublabel: string
    badge: string
    normDescription: string
    speedTarget: string
  }
> = {
  year3: {
    recommendedSet: 'setB',
    label: 'Year 3–4',
    sublabel: 'Stage 2 Primary · Paper NAPLAN',
    badge: 'Stage 2 Benchmark',
    normDescription: 'Tests full 26-letter pangram with diagonal joins under timed load.',
    speedTarget: 'Min: 44 LPM · Target: 55 LPM (~9–11 WPM)',
  },
  year5: {
    recommendedSet: 'setB',
    label: 'Year 5–6',
    sublabel: '2028 Paper Transition Cohort',
    badge: '★ 2028 Priority',
    normDescription: 'Standard Australian HST 3-minute sprint testing joined cursive stamina.',
    speedTarget: 'Min: 60 LPM · Target: 75 LPM (~12–15 WPM)',
  },
  year7: {
    recommendedSet: 'setD',
    label: 'Year 7–9',
    sublabel: 'Secondary & Pre-HSC Exam Endurance',
    badge: 'Secondary Stamina',
    normDescription: '10-minute persuasive free write drafting stamina without hand cramp.',
    speedTarget: 'Min: 80–100 LPM · Target: 98–120 LPM (~18–24 WPM)',
  },
}

export const HeroImmediateAssessment: React.FC<HeroImmediateAssessmentProps> = ({
  selectedCohort,
  onSelectCohort,
  activeSetKey,
  onSelectTestSet,
  onStartAssessment,
  savedAttemptsCount,
  latestAttempt,
  onOpenReport,
}) => {
  // Normalize cohort to one of the 3 primary segments
  const activeYearGroup: SimplifiedYearGroup =
    selectedCohort === 'year2' || selectedCohort === 'year3'
      ? 'year3'
      : selectedCohort === 'year5'
        ? 'year5'
        : 'year7'

  const currentRecommendation = RECOMMENDATION_MAP[activeYearGroup]
  const recommendedSet = TEST_SETS[currentRecommendation.recommendedSet]
  const isReturningUser = savedAttemptsCount > 0

  const handleYearChange = (group: SimplifiedYearGroup) => {
    onSelectCohort(group)
    // Pre-select the recommended test set for this year group
    onSelectTestSet(RECOMMENDATION_MAP[group].recommendedSet)
  }

  const handleLaunchRecommended = () => {
    onSelectTestSet(currentRecommendation.recommendedSet)
    onStartAssessment()
  }

  return (
    <section
      aria-label="Handwriting Assessment Launchpad"
      className="rounded-3xl border border-[#EAE8E1] bg-white p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-100/35 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-7">
        {/* RETURNING USER BANNER */}
        {isReturningUser && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#E2E0D8] text-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="font-semibold text-[#191918]">Welcome back!</span>{' '}
                <span className="text-[#575653]">
                  You have logged{' '}
                  <strong className="text-[#191918]">{savedAttemptsCount}</strong>{' '}
                  assessment{savedAttemptsCount > 1 ? 's' : ''} saved to this student&apos;s profile.
                </span>
                {latestAttempt && (
                  <span className="ml-2 inline-flex items-center gap-1 font-mono text-[11px] px-1.5 py-0.2 rounded bg-white border border-[#E2E0D8]">
                    Latest: {latestAttempt.netLpm} LPM ({latestAttempt.netWpm} WPM)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenReport}
                className="text-xs h-7 px-2.5 text-[#575653] hover:text-[#191918]"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-amber-700" />
                View Report
              </Button>
            </div>
          </motion.div>
        )}

        {/* HERO TITLE & SUBTEXT */}
        <div className="text-center sm:text-left space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F3EF] text-[#575653] text-xs font-medium border border-black/[0.05]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>NSW Foundation Style &amp; Australian Clinical Norms</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-[#191918] border border-black/[0.06]">
              Instant Guest Access
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-semibold tracking-tight text-[#191918] leading-[1.18]">
            Ready for the return to handwriting?
          </h1>

          <p className="text-[#575653] text-sm sm:text-base leading-relaxed">
            Measure your handwriting speed, legibility and writing fluency with standardised Australian assessments. Take your first diagnostic test in under 3 minutes.
          </p>
        </div>

        {/* STEP 1: CLEAN SEGMENTED YEAR SELECTOR */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#191918] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              Step 1: Select Your Child&apos;s Year Level
            </span>
            <span className="text-[11px] text-[#8A8884] font-mono">
              Calibrates norm thresholds
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-[#F4F3EF] border border-black/[0.04]">
            {(['year3', 'year5', 'year7'] as SimplifiedYearGroup[]).map((group) => {
              const item = RECOMMENDATION_MAP[group]
              const isSelected = activeYearGroup === group
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => handleYearChange(group)}
                  className={cn(
                    'relative p-3.5 rounded-xl text-left transition-all cursor-pointer select-none border',
                    isSelected
                      ? 'bg-white text-[#191918] border-[#191918]/20 shadow-xs'
                      : 'bg-transparent text-[#575653] border-transparent hover:bg-white/60 hover:text-[#191918]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm tracking-tight">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-medium px-2 py-0.5 rounded-full border',
                        isSelected
                          ? group === 'year5'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-white/70 text-[#8A8884] border-black/[0.05]'
                      )}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-[#686763] mt-1 line-clamp-1">
                    {item.sublabel}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* STEP 2: RECOMMENDED ASSESSMENT PREVIEW & IMMEDIATE CTA */}
        <div className="rounded-2xl border-2 border-amber-500/30 bg-[#FAF9F5] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE8E1] pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-900 border border-amber-500/25">
                Recommended First Assessment for {currentRecommendation.label}
              </span>
              <span className="text-xs font-mono text-[#686763] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {recommendedSet.durationMin} Min ({recommendedSet.durationSec}s)
              </span>
            </div>

            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {currentRecommendation.speedTarget}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-8 space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#191918]">
                {recommendedSet.title}
              </h2>
              <p className="text-xs sm:text-[13px] text-[#575653] leading-relaxed">
                {currentRecommendation.normDescription} {recommendedSet.purpose}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-[#686763]">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  No sign-up required (Guest Ready)
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Instant WPM &amp; Percentile Result
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="md:col-span-4 flex flex-col items-stretch sm:items-end justify-center">
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={handleLaunchRecommended}
                className="w-full sm:w-auto text-sm px-6 py-3 h-auto font-semibold rounded-xl bg-[#191918] hover:bg-[#2F2F2D] text-white shadow-md hover:shadow-lg transition-all group cursor-pointer"
              >
                <span>Start Your Assessment</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
              <span className="text-[11px] text-[#8A8884] text-center sm:text-right mt-2">
                Takes ~{recommendedSet.durationMin} minutes with lined paper
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

