import { useQuery } from '@tanstack/react-query'
import {
  COHORT_NORMS,
  CohortKey,
  FatigueLevel,
  TEST_SETS,
  TestSetKey,
} from '@/data/handwritingData'

export interface EvaluatedTelemetry {
  cohortKey: CohortKey
  testSetKey: TestSetKey
  durationMin: number
  unit: 'words' | 'letters'
  rawCount: number
  illegibleCount: number
  fatigue: FatigueLevel
}

export interface ClinicalPercentileAnalysis {
  netLpm: number
  netWpm: number
  grossWpm: number
  projected30MinWords: number
  estimatedPercentile: number
  status: 'exceeds' | 'developing' | 'below'
  gapToTargetLpm: number
  fatiguePenaltyPct: number
  growthCurveData: Array<{
    stage: string
    cohortKey: CohortKey
    targetLpm: number
    minLpm: number
    riskLpm: number
    compTargetWpm: number
    studentScore?: number
  }>
}

export function computeTelemetry(input: EvaluatedTelemetry): ClinicalPercentileAnalysis {
  const norm = COHORT_NORMS[input.cohortKey]
  const testSet = TEST_SETS[input.testSetKey]
  const durationMin = Math.max(0.5, input.durationMin || 1)

  const grossWpm =
    input.unit === 'words'
      ? input.rawCount / durationMin
      : input.rawCount / 5 / durationMin

  const netWords =
    input.unit === 'words'
      ? Math.max(0, input.rawCount - input.illegibleCount)
      : Math.max(0, input.rawCount / 5 - input.illegibleCount)

  const netWpm = netWords / durationMin
  const netLpm = netWpm * 5

  let compFactor = testSet.isCopySet ? 0.72 : 0.92
  let fatiguePenaltyPct = 0
  if (input.fatigue === 'mild') {
    compFactor *= 0.9
    fatiguePenaltyPct = 10
  } else if (input.fatigue === 'severe') {
    compFactor *= 0.75
    fatiguePenaltyPct = 25
  }

  const projected30MinWords = Math.round(netWpm * 30 * compFactor)

  let status: 'exceeds' | 'developing' | 'below' = 'below'
  if (netLpm >= norm.targetLpm && input.fatigue !== 'severe') {
    status = 'exceeds'
  } else if (netLpm >= norm.minLpm) {
    status = 'developing'
  }

  // Calibrate approximate clinical percentile based on HST mean & SD distribution
  const ratio = netLpm / norm.targetLpm
  const rawPct = Math.round(Math.min(99, Math.max(4, ratio * 72)))
  const estimatedPercentile =
    input.fatigue === 'severe' ? Math.max(5, rawPct - 12) : rawPct

  const gapToTargetLpm = Math.round(netLpm - norm.targetLpm)

  const orderedKeys: CohortKey[] = ['year2', 'year3', 'year5', 'year7', 'year9']
  const growthCurveData = orderedKeys.map((k) => {
    const c = COHORT_NORMS[k]
    return {
      stage: c.shortName,
      cohortKey: k,
      targetLpm: c.targetLpm,
      minLpm: c.minLpm,
      riskLpm: c.riskLpm,
      compTargetWpm: c.compWpmTarget,
      studentScore: k === input.cohortKey ? Math.round(netLpm) : undefined,
    }
  })

  return {
    netLpm,
    netWpm,
    grossWpm,
    projected30MinWords,
    estimatedPercentile,
    status,
    gapToTargetLpm,
    fatiguePenaltyPct,
    growthCurveData,
  }
}

export function useClinicalNormsQuery(input: EvaluatedTelemetry) {
  return useQuery({
    queryKey: [
      'clinical-norms-eval',
      input.cohortKey,
      input.testSetKey,
      input.durationMin,
      input.unit,
      input.rawCount,
      input.illegibleCount,
      input.fatigue,
    ],
    queryFn: async () => {
      return computeTelemetry(input)
    },
    initialData: () => computeTelemetry(input),
    staleTime: Infinity,
  })
}
