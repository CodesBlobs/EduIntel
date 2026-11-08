import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Compass,
  Grid,
  Copy,
  Check,
  BookmarkPlus,
  Trash2,
  Sparkles,
  Clock,
  ExternalLink,
  FileCheck2,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts'
import {
  COHORT_NORMS,
  CohortKey,
  FatigueLevel,
  TEST_SETS,
  TestSetKey,
} from '@/data/handwritingData'
import { useLabStore } from '@/store/useLabStore'
import { useClinicalNormsQuery } from '@/hooks/useClinicalNormsQuery'
import { useAttempts, useCreateAttempt, useDeleteAttempt } from '@/hooks/useBackendQueries'
import { Badge, Button, Card, Input, Select } from '@/components/ui/primitives'
import { RichNotesEditor } from '@/components/RichNotesEditor'
import { HeroImmediateAssessment } from '@/components/HeroImmediateAssessment'
import { trackTestStarted, trackTestCompleted } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const evalFormSchema = z.object({
  studentLabel: z.string().max(50).optional(),
  durationMin: z.number().min(0.5, 'Min 0.5 min').max(40, 'Max 40 min'),
  unit: z.enum(['words', 'letters']),
  rawCount: z.number().min(1, 'Enter at least 1').max(3000, 'Max 3000'),
  illegibleCount: z.number().min(0, 'Min 0').max(500, 'Max 500'),
  fatigue: z.enum(['none', 'mild', 'severe']),
})

type EvalFormValues = z.infer<typeof evalFormSchema>

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const LiveTestLabView: React.FC = () => {
  const {
    activeStudentId,
    selectedCohort,
    setSelectedCohort,
    activeSetKey,
    setActiveSetKey,
    handedness,
    setHandedness,
    showDottedThirds,
    setShowDottedThirds,
    updateLatestEval,
    setActiveTab,
    setReportModalOpen,
  } = useLabStore()

  // Real backend queries via React Query
  const { data: dbAttempts = [], isLoading: loadingAttempts } = useAttempts(activeStudentId)
  const createAttemptMut = useCreateAttempt()
  const deleteAttemptMut = useDeleteAttempt(activeStudentId)

  // Map DB attempts to the view structure
  const savedAttempts = dbAttempts.map((a) => ({
    id: a.id,
    timestamp: new Date(a.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    studentLabel: a.student_label,
    cohortKey: a.cohort_key as CohortKey,
    testSetKey: a.test_set_key as TestSetKey,
    durationMin: Number(a.duration_min),
    unit: a.unit,
    rawCount: a.raw_count,
    illegibleCount: a.illegible_count,
    fatigue: a.fatigue,
    netLpm: Math.round(Number(a.net_lpm)),
    netWpm: Number(Number(a.net_wpm).toFixed(1)),
    grossWpm: Number(Number(a.gross_wpm).toFixed(1)),
    projected30MinWords: a.projected_30min_words,
    status: a.status,
  }))

  const activeSet = TEST_SETS[activeSetKey]
  const cohortNorm = COHORT_NORMS[selectedCohort]

  // Ref to test bench for immediate scroll-to-action
  const testBenchRef = React.useRef<HTMLDivElement>(null)

  // Timer state
  const [timerRemainingSec, setTimerRemainingSec] = useState<number>(
    activeSet.durationSec
  )
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
  const [timerFinished, setTimerFinished] = useState<boolean>(false)
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false)
  const [justSavedLog, setJustSavedLog] = useState<boolean>(false)

  const handleStartFromHero = () => {
    testBenchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (!isTimerRunning && timerRemainingSec > 0) {
      setIsTimerRunning(true)
    }
  }

  // React Hook Form + Zod setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EvalFormValues>({
    resolver: zodResolver(evalFormSchema),
    defaultValues: {
      studentLabel: 'Current Session',
      durationMin: activeSet.durationMin,
      unit: activeSet.defaultUnit,
      rawCount: activeSet.defaultRaw,
      illegibleCount: 1,
      fatigue: 'mild',
    },
  })

  // Sync form defaults & timer when switching among the 5 Test Sets
  const handleSelectTestSet = (setKey: TestSetKey) => {
    const nextSet = TEST_SETS[setKey]
    setActiveSetKey(setKey)
    setIsTimerRunning(false)
    setTimerFinished(false)
    setTimerRemainingSec(nextSet.durationSec)
    setValue('durationMin', nextSet.durationMin)
    setValue('unit', nextSet.defaultUnit)
    setValue('rawCount', nextSet.defaultRaw)
  }

  // Countdown Interval
  useEffect(() => {
    if (!isTimerRunning) return
    const interval = window.setInterval(() => {
      setTimerRemainingSec((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval)
          setIsTimerRunning(false)
          setTimerFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [isTimerRunning])

  const toggleTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false)
    } else {
      if (timerRemainingSec <= 0) {
        setTimerRemainingSec(activeSet.durationSec)
      }
      setTimerFinished(false)
      setIsTimerRunning(true)
      trackTestStarted(activeSetKey, selectedCohort)
    }
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimerFinished(false)
    setTimerRemainingSec(activeSet.durationSec)
  }

  // Watch live form values for instant reactive norm evaluation
  const watchedValues = watch()
  const { data: analysis } = useClinicalNormsQuery({
    cohortKey: selectedCohort,
    testSetKey: activeSetKey,
    durationMin: Number(watchedValues.durationMin) || 1,
    unit: watchedValues.unit || 'letters',
    rawCount: Number(watchedValues.rawCount) || 0,
    illegibleCount: Number(watchedValues.illegibleCount) || 0,
    fatigue: (watchedValues.fatigue as FatigueLevel) || 'none',
  })

  // Keep global store synced with latest evaluation
  useEffect(() => {
    if (!analysis) return
    updateLatestEval({
      studentLabel: watchedValues.studentLabel || 'Current Session',
      durationMin: Number(watchedValues.durationMin) || 1,
      unit: watchedValues.unit,
      rawCount: Number(watchedValues.rawCount) || 0,
      illegibleCount: Number(watchedValues.illegibleCount) || 0,
      fatigue: watchedValues.fatigue,
      netLpm: analysis.netLpm,
      netWpm: analysis.netWpm,
      grossWpm: analysis.grossWpm,
      projected30MinWords: analysis.projected30MinWords,
      status: analysis.status,
    })
  }, [
    analysis,
    watchedValues.studentLabel,
    watchedValues.durationMin,
    watchedValues.unit,
    watchedValues.rawCount,
    watchedValues.illegibleCount,
    watchedValues.fatigue,
    updateLatestEval,
  ])

  const onSubmitEval = (values: EvalFormValues) => {
    if (!analysis) return
    createAttemptMut.mutate(
      {
        studentId: activeStudentId,
        data: {
          student_label:
            values.studentLabel?.trim() ||
            `${TEST_SETS[activeSetKey].shortTitle} (${COHORT_NORMS[selectedCohort].shortName})`,
          cohort_key: selectedCohort,
          test_set_key: activeSetKey,
          duration_min: values.durationMin,
          unit: values.unit,
          raw_count: values.rawCount,
          illegible_count: values.illegibleCount,
          fatigue: values.fatigue,
          net_lpm: Math.round(analysis.netLpm),
          net_wpm: Number(analysis.netWpm.toFixed(1)),
          gross_wpm: Number(analysis.grossWpm.toFixed(1)),
          projected_30min_words: analysis.projected30MinWords,
          status: analysis.status,
        },
      },
      {
        onSuccess: () => {
          setJustSavedLog(true)
          trackTestCompleted({
            testSetKey: activeSetKey,
            cohortKey: selectedCohort,
            netLpm: Math.round(analysis.netLpm),
            netWpm: Number(analysis.netWpm.toFixed(1)),
            status: analysis.status,
          })
          window.setTimeout(() => setJustSavedLog(false), 2200)
        },
      }
    )
  }

  const copyPromptToClipboard = () => {
    navigator.clipboard?.writeText(activeSet.promptText)
    setCopiedPrompt(true)
    window.setTimeout(() => setCopiedPrompt(false), 1800)
  }

  const timerProgressPct =
    ((activeSet.durationSec - timerRemainingSec) / activeSet.durationSec) * 100

  const miniComparisonData = [
    {
      name: 'Child Net LPM',
      lpm: Math.round(analysis?.netLpm || 0),
      fill:
        analysis?.status === 'exceeds'
          ? '#059669'
          : analysis?.status === 'developing'
            ? '#d97706'
            : '#e11d48',
    },
    {
      name: 'Min Floor',
      lpm: cohortNorm.minLpm,
      fill: '#A8A29E',
    },
    {
      name: 'Target Norm',
      lpm: cohortNorm.targetLpm,
      fill: '#191918',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Action-Oriented Immediate Assessment Hero (plan.md Section 4 & 6) */}
      <HeroImmediateAssessment
        selectedCohort={selectedCohort}
        onSelectCohort={setSelectedCohort}
        activeSetKey={activeSetKey}
        onSelectTestSet={handleSelectTestSet}
        onStartAssessment={handleStartFromHero}
        savedAttemptsCount={savedAttempts.length}
        latestAttempt={
          savedAttempts[0]
            ? {
                studentLabel: savedAttempts[0].studentLabel,
                netLpm: savedAttempts[0].netLpm,
                netWpm: savedAttempts[0].netWpm,
                status: savedAttempts[0].status,
              }
            : undefined
        }
        onOpenReport={() => setReportModalOpen(true)}
      />

      {/* INTERACTIVE TEST BENCH: LEFT 7 COLS (TEST WORKSPACE) & RIGHT 5 COLS (EVALUATOR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT 7 COLS: FLOWING ASSESSMENT WORKSPACE & TIMER */}
        <div ref={testBenchRef} id="assessment-bench" className="lg:col-span-7 space-y-4">
          {/* Header & Protocol Switcher */}
          <div className="bg-white rounded-3xl border border-[#EAE8E1] p-5 sm:p-7 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EFEA] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Step 2 · Select Assessment Protocol
                </span>
                <h2 className="text-xl font-semibold tracking-tight text-[#191918] mt-0.5">
                  Standardised Handwriting Test Sets
                </h2>
              </div>
              <div className="w-full sm:w-auto min-w-[240px]">
                <Select
                  aria-label="Target Cohort"
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value as CohortKey)}
                  className="bg-[#F8F7F4] text-xs font-medium"
                >
                  <option value="year2">Year 1–2 (Stage 1 Foundation)</option>
                  <option value="year3">Year 3 (Stage 2 Paper NAPLAN)</option>
                  <option value="year5">Year 4–5 (2028 Paper Transition)</option>
                  <option value="year7">Year 6–7 (Stage 3–4 Secondary)</option>
                  <option value="year9">Year 8–9 (Stage 5 Pre-HSC)</option>
                </Select>
              </div>
            </div>

            {/* Flowing, Readable Test Set Selector (No ellipsis truncation!) */}
            <div className="flex flex-wrap sm:flex-nowrap overflow-x-auto custom-scrollbar gap-2 p-1.5 rounded-2xl bg-[#F6F5F1]">
              {(Object.keys(TEST_SETS) as TestSetKey[]).map((key) => {
                const item = TEST_SETS[key]
                const isActive = activeSetKey === key
                const isRecommended =
                  selectedCohort === 'year7' || selectedCohort === 'year9'
                    ? key === 'setD'
                    : key === 'setB'

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectTestSet(key)}
                    className={cn(
                      'flex-1 min-w-[130px] sm:min-w-0 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer select-none border',
                      isActive
                        ? 'bg-white text-[#191918] border-black/10 shadow-xs'
                        : 'bg-transparent text-[#686763] border-transparent hover:bg-white/60 hover:text-[#191918]'
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          'text-[10.5px] font-mono font-semibold',
                          isActive ? 'text-amber-800' : 'text-[#8A8884]'
                        )}
                      >
                        {item.durationMin}m ({item.durationSec}s)
                      </span>
                      {isRecommended && (
                        <span className="text-[9px] font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.2 rounded-md shrink-0">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold tracking-tight mt-1 truncate">
                      {item.shortTitle}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Test Details Header */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                  {activeSet.badge}
                </span>
                <span className="text-xs font-mono text-[#8A8884]">
                  Target: {activeSet.targetHint}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#191918] tracking-tight">
                {activeSet.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#575653] leading-relaxed">
                {activeSet.purpose}
              </p>
            </div>

            {/* Elegant Writing Prompt Sheet */}
            <div className="rounded-2xl border border-[#E4E2DC] overflow-hidden bg-white shadow-2xs">
              {/* Paper Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#F9F8F5] border-b border-[#ECEAE4]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                    Student Copy Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDottedThirds(!showDottedThirds)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
                      showDottedThirds
                        ? 'bg-white text-amber-900 border border-amber-300 shadow-2xs'
                        : 'text-[#686763] hover:text-[#191918]'
                    )}
                  >
                    <Grid className="w-3 h-3" />
                    {showDottedThirds ? 'Guidelines: On' : 'Plain Paper'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setHandedness(handedness === 'right' ? 'left' : 'right')
                    }
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-[#686763] hover:text-[#191918] hover:bg-white transition-colors cursor-pointer"
                    title="Toggle paper tilt guide"
                  >
                    <Compass className="w-3 h-3 text-indigo-600" />
                    {handedness === 'right' ? 'Tilt 30° Left ↺' : 'Tilt 30° Right ↻'}
                  </button>

                  <button
                    type="button"
                    onClick={copyPromptToClipboard}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white text-[#191918] border border-[#DCDAD2] hover:bg-[#F2F1EC] transition-colors cursor-pointer"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy Text
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Clean Readable Prompt Content */}
              <div
                className={cn(
                  'p-6 sm:p-7 min-h-[140px] transition-all select-all',
                  showDottedThirds ? 'dotted-thirds-paper' : 'bg-white'
                )}
              >
                <p className="font-serif text-lg sm:text-[20px] text-[#191918] leading-[1.85] tracking-normal font-normal">
                  {activeSet.promptText}
                </p>
              </div>

              {/* Protocol Guidance footer */}
              <div className="px-4 py-3 bg-[#FAF9F6] border-t border-[#ECEAE4] text-xs text-[#575653] leading-relaxed">
                <span className="font-semibold text-[#191918]">How to Administer: </span>
                {activeSet.instructions} {activeSet.scoringRule}
              </div>
            </div>

            {/* Integrated, Flowing Test Stopwatch Bar */}
            <div
              className={cn(
                'rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row items-center justify-between gap-4',
                timerFinished
                  ? 'bg-amber-50/80 border-amber-200 shadow-xs'
                  : isTimerRunning
                    ? 'bg-[#191918] text-white border-[#191918] shadow-md'
                    : 'bg-[#F8F7F4] border-[#E8E6DF]'
              )}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div
                  className={cn(
                    'rounded-xl px-4 py-2.5 text-center min-w-[120px] border shadow-2xs',
                    isTimerRunning
                      ? 'bg-white/10 text-white border-white/20'
                      : 'bg-white text-[#191918] border-[#E0DED7]'
                  )}
                >
                  <div
                    className={cn(
                      'text-[10px] uppercase tracking-wider font-semibold',
                      isTimerRunning ? 'text-amber-300' : 'text-[#8A8884]'
                    )}
                  >
                    Test Clock
                  </div>
                  <div className="font-mono text-3xl font-bold tracking-tight">
                    {formatTime(timerRemainingSec)}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div
                    className={cn(
                      'text-sm font-semibold flex items-center gap-1.5',
                      timerFinished
                        ? 'text-amber-950'
                        : isTimerRunning
                          ? 'text-white'
                          : 'text-[#191918]'
                    )}
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    {timerFinished
                      ? 'Time is up! Count total words or letters written and enter on right.'
                      : isTimerRunning
                        ? `Testing ${activeSet.shortTitle}... Keep writing continuously.`
                        : `Ready to time: ${activeSet.shortTitle} (${activeSet.durationMin} Min)`}
                  </div>
                  <p
                    className={cn(
                      'text-xs leading-relaxed',
                      isTimerRunning ? 'text-white/70' : 'text-[#686763]'
                    )}
                  >
                    Instruct student not to erase mistakes — use a single strike-through line.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant={isTimerRunning ? 'amber' : 'default'}
                  size="lg"
                  onClick={toggleTimer}
                  className={cn(
                    'flex-1 sm:flex-initial h-11 px-5 rounded-xl font-semibold shadow-xs transition-all cursor-pointer',
                    isTimerRunning
                      ? 'bg-amber-400 text-[#191918] hover:bg-amber-300 border-none'
                      : 'bg-[#191918] text-white hover:bg-[#2F2F2D]'
                  )}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause Timer
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      {timerRemainingSec < activeSet.durationSec && timerRemainingSec > 0
                        ? 'Resume Timer'
                        : 'Start Timer'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={resetTimer}
                  className={cn(
                    'h-11 px-3.5 rounded-xl cursor-pointer',
                    isTimerRunning
                      ? 'bg-transparent text-white border-white/30 hover:bg-white/10'
                      : 'bg-white text-[#575653] hover:text-[#191918]'
                  )}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: CLEAN LIVE EVALUATION & SCORECARD */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAE8E1] p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#ECEAE4] pb-3.5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Step 2 · Enter Child&apos;s Raw Output
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-[#191918] mt-0.5">
                Instant WPM / LPM &amp; Australian Norm Evaluator
              </h3>
            </div>
            <Button
              type="button"
              variant="soft"
              size="sm"
              onClick={() => setReportModalOpen(true)}
              title="Open Printable Clinical Readiness Summary"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-700" />
              Summary Report
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmitEval)} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="inputDurationMin"
                  className="block text-[11px] font-medium text-[#575653] mb-1"
                >
                  Test Duration (Minutes)
                </label>
                <Input
                  id="inputDurationMin"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="40"
                  {...register('durationMin', { valueAsNumber: true })}
                  className="font-mono font-semibold"
                />
                {errors.durationMin && (
                  <span className="text-[10px] text-rose-600">
                    {errors.durationMin.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="inputCountType"
                  className="block text-[11px] font-medium text-[#575653] mb-1"
                >
                  Count Unit Entered
                </label>
                <Select id="inputCountType" {...register('unit')}>
                  <option value="words">Total Words Written</option>
                  <option value="letters">Total Letters Written (LPM)</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="inputRawCount"
                  className="block text-[11px] font-medium text-[#575653] mb-1"
                >
                  Raw Words / Letters Counted
                </label>
                <Input
                  id="inputRawCount"
                  type="number"
                  min="1"
                  max="3000"
                  {...register('rawCount', { valueAsNumber: true })}
                  className="font-mono font-semibold"
                />
                {errors.rawCount && (
                  <span className="text-[10px] text-rose-600">
                    {errors.rawCount.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="inputIllegibleCount"
                  className="block text-[11px] font-medium text-[#575653] mb-1"
                >
                  Illegible / Misformed Words
                </label>
                <Input
                  id="inputIllegibleCount"
                  type="number"
                  min="0"
                  max="500"
                  {...register('illegibleCount', { valueAsNumber: true })}
                  className="font-mono font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <label
                  htmlFor="inputFatigueLevel"
                  className="block text-[11px] font-medium text-[#575653] mb-1"
                >
                  Observed Hand Cramping / Grip Pressure
                </label>
                <Select id="inputFatigueLevel" {...register('fatigue')}>
                  <option value="none">
                    Relaxed Dynamic Tripod — No wrist shaking
                  </option>
                  <option value="mild">
                    Mild finger tension / heavy page indentation
                  </option>
                  <option value="severe">
                    Thumb-wrap / fist grip; complains &quot;hand hurts&quot;
                  </option>
                </Select>
              </div>
              <div className="sm:col-span-5">
                <label
                  htmlFor="inputStudentLabel"
                  className="block text-[11px] font-medium text-[#575653] mb-1"
                >
                  Session Tag (Optional)
                </label>
                <Input
                  id="inputStudentLabel"
                  type="text"
                  placeholder="e.g. Attempt #1"
                  {...register('studentLabel')}
                  className="text-xs"
                />
              </div>
            </div>

            <Button type="submit" variant="default" size="lg" className="w-full">
              {justSavedLog ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Saved to Student Diagnostic Log
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  Compute Norm Percentile &amp; Save Attempt to Log
                </>
              )}
            </Button>
          </form>

          {/* Smooth Notion-Style Live Diagnostic Result Box */}
          {analysis && (
            <motion.div
              layout
              className={cn(
                'rounded-2xl p-4 sm:p-5 border space-y-3.5 text-xs transition-colors',
                analysis.status === 'exceeds'
                  ? 'bg-emerald-50/50 border-emerald-200/90'
                  : analysis.status === 'developing'
                    ? 'bg-amber-50/50 border-amber-200/90'
                    : 'bg-rose-50/50 border-rose-200/90'
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#191918] text-xs">
                  {analysis.status === 'exceeds' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : analysis.status === 'developing' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  {analysis.status === 'exceeds'
                    ? 'Exceeds Australian Norm (Automatic Fluency)'
                    : analysis.status === 'developing'
                      ? 'Developing Fluency (Borderline for Timed Exams)'
                      : 'Below Minimum Norm (High Cognitive Bottleneck)'}
                </span>
                <Badge
                  variant={
                    analysis.status === 'exceeds'
                      ? 'emerald'
                      : analysis.status === 'developing'
                        ? 'amber'
                        : 'rose'
                  }
                  className="font-mono"
                >
                  ~{analysis.estimatedPercentile}th Percentile · {cohortNorm.shortName}
                </Badge>
              </div>

              {/* 3-Column Telemetry Strip */}
              <div className="grid grid-cols-3 gap-2 bg-white/95 p-3 rounded-xl border border-black/[0.06] text-center shadow-2xs">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8A8884] font-medium">
                    Net Speed (LPM)
                  </div>
                  <div className="font-mono text-base sm:text-lg font-bold text-[#191918] mt-0.5">
                    {analysis.netLpm.toFixed(0)} LPM
                  </div>
                  <div className="text-[10px] font-mono text-[#575653]">
                    Norm: {cohortNorm.minLpm}–{cohortNorm.targetLpm}
                  </div>
                </div>
                <div className="border-x border-[#ECEAE4]">
                  <div className="text-[10px] uppercase tracking-wider text-[#8A8884] font-medium">
                    Net Speed (WPM)
                  </div>
                  <div className="font-mono text-base sm:text-lg font-bold text-amber-700 mt-0.5">
                    {analysis.netWpm.toFixed(1)} WPM
                  </div>
                  <div className="text-[10px] font-mono text-[#575653]">
                    Gross: {analysis.grossWpm.toFixed(1)} WPM
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8A8884] font-medium">
                    30-Min NAPLAN Est.
                  </div>
                  <div className="font-mono text-base sm:text-lg font-bold text-emerald-700 mt-0.5">
                    ~{analysis.projected30MinWords} wds
                  </div>
                  <div className="text-[10px] font-mono text-[#575653]">
                    Target: {cohortNorm.naplan30MinTarget} wds
                  </div>
                </div>
              </div>

              {/* Mini Recharts Comparison Bar */}
              <div className="bg-white/90 rounded-xl p-3 border border-black/[0.05]">
                <div className="flex items-center justify-between text-[10px] text-[#575653] mb-1">
                  <span className="font-medium">
                    Live Speed vs {cohortNorm.shortName} Australian Clinical Norms (LPM)
                  </span>
                  <span className="font-mono">
                    {analysis.gapToTargetLpm >= 0
                      ? `+${analysis.gapToTargetLpm} LPM above target`
                      : `${analysis.gapToTargetLpm} LPM to target`}
                  </span>
                </div>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={miniComparisonData}
                      layout="vertical"
                      margin={{ top: 2, right: 20, left: 0, bottom: 2 }}
                    >
                      <XAxis type="number" hide domain={[0, Math.max(130, cohortNorm.targetLpm + 20)]} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={88}
                        tick={{ fontSize: 10, fill: '#575653' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                        contentStyle={{
                          borderRadius: '10px',
                          border: '1px solid #E6E4DD',
                          fontSize: '11px',
                        }}
                        formatter={(value: unknown) => [`${value} LPM`, 'Speed']}
                      />
                      <ReferenceLine
                        x={cohortNorm.minLpm}
                        stroke="#d97706"
                        strokeDasharray="3 3"
                      />
                      <Bar dataKey="lpm" radius={[0, 6, 6, 0]} barSize={14}>
                        {miniComparisonData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Clinical Narrative Interpretation */}
              <p className="text-[#3D3C3A] leading-relaxed">
                {analysis.status === 'exceeds' ? (
                  <>
                    At{' '}
                    <strong className="font-semibold text-[#191918]">
                      {analysis.netLpm.toFixed(0)} Letters/Min ({analysis.netWpm.toFixed(1)} net WPM)
                    </strong>
                    , your child meets or exceeds the target benchmark for{' '}
                    <strong className="font-semibold text-[#191918]">{cohortNorm.label}</strong> (
                    {cohortNorm.targetLpm} LPM). Their projected 30-minute NAPLAN drafting volume is{' '}
                    <strong className="font-semibold text-[#191918]">
                      ~{analysis.projected30MinWords} words
                    </strong>{' '}
                    (Target: {cohortNorm.naplan30MinTarget} words), freeing working memory for high-modality vocabulary and complex sentence structure.
                  </>
                ) : analysis.status === 'developing' ? (
                  <>
                    At{' '}
                    <strong className="font-semibold text-[#191918]">
                      {analysis.netLpm.toFixed(0)} Letters/Min ({analysis.netWpm.toFixed(1)} net WPM)
                    </strong>
                    , your child sits inside the minimum range ({cohortNorm.minLpm}–
                    {cohortNorm.targetLpm} LPM) for{' '}
                    <strong className="font-semibold text-[#191918]">{cohortNorm.label}</strong>,
                    projecting{' '}
                    <strong className="font-semibold text-[#191918]">
                      ~{analysis.projected30MinWords} words
                    </strong>{' '}
                    in a 30-minute NAPLAN draft. Under exam stress or hand fatigue, they risk rushing their conclusion in the final 8 minutes.
                  </>
                ) : (
                  <>
                    At{' '}
                    <strong className="font-semibold text-[#191918]">
                      {analysis.netLpm.toFixed(0)} Letters/Min ({analysis.netWpm.toFixed(1)} net WPM)
                    </strong>
                    , your child is below the Australian minimum threshold ({cohortNorm.minLpm}{' '}
                    LPM) for{' '}
                    <strong className="font-semibold text-[#191918]">{cohortNorm.label}</strong>.
                    Projected 30-minute exam output is only{' '}
                    <strong className="font-semibold text-[#191918]">
                      ~{analysis.projected30MinWords} words
                    </strong>{' '}
                    (vs {cohortNorm.naplan30MinTarget} target). Transcription effort is currently consuming working memory needed for ideas and spelling.
                  </>
                )}
              </p>

              <div className="pt-2 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('view-improvement-methods')}
                  className="inline-flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 cursor-pointer"
                >
                  View Targeted Remediation Methods
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('view-legibility-audit')}
                  className="inline-flex items-center gap-1 font-medium text-[#575653] hover:text-[#191918] cursor-pointer"
                >
                  Run 10-Point Legibility Audit
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* LOWER WORKSPACE ROW: SAVED ATTEMPT LOG + TIPTAP CLINICAL OBSERVATION PAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 Cols: Longitudinal Session Log */}
        <Card className="lg:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8884]">
                Progress Tracker
              </span>
              <h3 className="text-base font-semibold text-[#191918]">
                Student Timed Diagnostic Log ({savedAttempts.length})
              </h3>
            </div>
            <Badge variant="emerald">Auto-Saved</Badge>
          </div>

          {loadingAttempts ? (
            <div className="rounded-xl border border-dashed border-[#DFDDD4] p-6 text-center text-xs text-[#8A8884]">
              Loading saved assessments...
            </div>
          ) : savedAttempts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#DFDDD4] p-6 text-center text-xs text-[#8A8884]">
              No timed test attempts logged yet. Click &quot;Compute Norm Percentile &amp; Save Attempt to Log&quot; above after running a timed sprint.
            </div>
          ) : (
            <div className="space-y-2 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
              {savedAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#ECEAE4] bg-[#FBFBFA] px-3.5 py-2.5 text-xs hover:bg-white transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#191918] truncate">
                        {attempt.studentLabel}
                      </span>
                      <Badge
                        variant={
                          attempt.status === 'exceeds'
                            ? 'emerald'
                            : attempt.status === 'developing'
                              ? 'amber'
                              : 'rose'
                        }
                      >
                        {attempt.netLpm} LPM · {attempt.netWpm} WPM
                      </Badge>
                    </div>
                    <div className="text-[11px] text-[#8A8884] font-mono">
                      {TEST_SETS[attempt.testSetKey].shortLabel} ·{' '}
                      {COHORT_NORMS[attempt.cohortKey].shortName} · Est. 30m:{' '}
                      ~{attempt.projected30MinWords} wds
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteAttemptMut.mutate(attempt.id)}
                    className="p-1.5 rounded-lg text-[#8A8884] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete log entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right 6 Cols: Tiptap Rich-Text Observation & Hybrid Writer Pad */}
        <Card className="lg:col-span-6 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Tiptap Rich-Text Clinical Journal
              </span>
              <h3 className="text-base font-semibold text-[#191918]">
                Educator / Parent Observation Notes &amp; Hybrid Scratchpad
              </h3>
            </div>
            <Badge variant="amber">Rich Text</Badge>
          </div>
          <RichNotesEditor />
        </Card>
      </div>
    </div>
  )
}
