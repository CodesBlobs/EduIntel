import { useState, useEffect, useRef } from 'react'
import { useLabStore } from '@/store/useLabStore'
import { TEST_SETS, TestSetKey, COHORT_NORMS, CohortKey, FatigueLevel } from '@/data/handwritingData'
import { useClinicalNormsQuery } from '@/hooks/useClinicalNormsQuery'
import { useAttempts, useCreateAttempt, useDeleteAttempt } from '@/hooks/useBackendQueries'
import { trackTestStarted, trackTestCompleted } from '@/lib/analytics'

export function useTestEngine() {
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
    setReportModalOpen,
  } = useLabStore()

  const activeSet = TEST_SETS[activeSetKey]
  const cohortNorm = COHORT_NORMS[selectedCohort]

  // Timer state
  const [timerRemainingSec, setTimerRemainingSec] = useState<number>(activeSet.durationSec)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
  const [timerFinished, setTimerFinished] = useState<boolean>(false)
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false)
  const [justSavedLog, setJustSavedLog] = useState<boolean>(false)

  // Evaluation input form values
  const [rawCount, setRawCount] = useState<number>(activeSet.defaultRaw)
  const [illegibleCount, setIllegibleCount] = useState<number>(1)
  const [fatigue, setFatigue] = useState<FatigueLevel>('mild')
  const [studentLabel, setStudentLabel] = useState<string>('Current Session')

  // Real backend queries
  const { data: dbAttempts = [], isLoading: loadingAttempts } = useAttempts(activeStudentId)
  const createAttemptMut = useCreateAttempt()
  const deleteAttemptMut = useDeleteAttempt(activeStudentId)

  // Norm analysis
  const { data: analysis } = useClinicalNormsQuery({
    cohortKey: selectedCohort,
    testSetKey: activeSetKey,
    durationMin: activeSet.durationMin,
    unit: activeSet.defaultUnit,
    rawCount: Number(rawCount) || 0,
    illegibleCount: Number(illegibleCount) || 0,
    fatigue: fatigue || 'none',
  })

  // Timer interval
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

  // Sync latest eval to global store
  useEffect(() => {
    if (!analysis) return
    updateLatestEval({
      studentLabel: studentLabel || 'Current Session',
      durationMin: activeSet.durationMin,
      unit: activeSet.defaultUnit,
      rawCount: Number(rawCount) || 0,
      illegibleCount: Number(illegibleCount) || 0,
      fatigue: fatigue,
      netLpm: analysis.netLpm,
      netWpm: analysis.netWpm,
      grossWpm: analysis.grossWpm,
      projected30MinWords: analysis.projected30MinWords,
      status: analysis.status,
    })
  }, [analysis, studentLabel, activeSet.durationMin, activeSet.defaultUnit, rawCount, illegibleCount, fatigue, updateLatestEval])

  const selectTestSet = (key: TestSetKey) => {
    const next = TEST_SETS[key]
    setActiveSetKey(key)
    setIsTimerRunning(false)
    setTimerFinished(false)
    setTimerRemainingSec(next.durationSec)
    setRawCount(next.defaultRaw)
  }

  const startTimer = () => {
    if (timerRemainingSec <= 0) {
      setTimerRemainingSec(activeSet.durationSec)
      setTimerFinished(false)
    }
    setIsTimerRunning(true)
    trackTestStarted(activeSetKey, selectedCohort)
  }

  const pauseTimer = () => setIsTimerRunning(false)

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimerFinished(false)
    setTimerRemainingSec(activeSet.durationSec)
  }

  const copyPromptText = async () => {
    try {
      await navigator.clipboard.writeText(activeSet.promptText)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    } catch {
      // ignore
    }
  }

  const submitAttempt = () => {
    if (!analysis) return
    createAttemptMut.mutate(
      {
        studentId: activeStudentId,
        data: {
          student_label: studentLabel.trim() || `${activeSet.shortTitle} (${cohortNorm.shortName})`,
          cohort_key: selectedCohort,
          test_set_key: activeSetKey,
          duration_min: activeSet.durationMin,
          unit: activeSet.defaultUnit,
          raw_count: rawCount,
          illegible_count: illegibleCount,
          fatigue: fatigue,
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
          setTimeout(() => setJustSavedLog(false), 3000)
          trackTestCompleted({
            testSetKey: activeSetKey,
            cohortKey: selectedCohort,
            netLpm: Math.round(analysis.netLpm),
            netWpm: Number(analysis.netWpm.toFixed(1)),
            status: analysis.status,
          })
        },
      }
    )
  }

  // Format mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

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
    unit: a.unit as 'words' | 'letters',
    rawCount: Number(a.raw_count),
    illegibleCount: Number(a.illegible_count),
    fatigue: a.fatigue as FatigueLevel,
    netLpm: Math.round(Number(a.net_lpm)),
    netWpm: Number(Number(a.net_wpm).toFixed(1)),
    grossWpm: Number(Number(a.gross_wpm).toFixed(1)),
    projected30MinWords: a.projected_30min_words,
    status: a.status as 'exceeds' | 'developing' | 'below',
  }))

  return {
    activeStudentId,
    selectedCohort,
    setSelectedCohort,
    activeSetKey,
    selectTestSet,
    activeSet,
    cohortNorm,
    handedness,
    setHandedness,
    showDottedThirds,
    setShowDottedThirds,
    timerRemainingSec,
    isTimerRunning,
    timerFinished,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    rawCount,
    setRawCount,
    illegibleCount,
    setIllegibleCount,
    fatigue,
    setFatigue,
    studentLabel,
    setStudentLabel,
    analysis,
    submitAttempt,
    isSubmittingAttempt: createAttemptMut.isPending,
    justSavedLog,
    savedAttempts,
    loadingAttempts,
    deleteAttempt: (id: string) => deleteAttemptMut.mutate(id),
    copiedPrompt,
    copyPromptText,
    openReportModal: () => setReportModalOpen(true),
  }
}
