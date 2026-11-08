import { CohortKey, TestSetKey } from '@/data/handwritingData'

export type LandingStyleKey =
  | 'classic'
  | 'duolingo'
  | 'notion'
  | 'monday'
  | 'linear'
  | 'mathspace'

export interface StyleOption {
  key: LandingStyleKey
  label: string
  sublabel: string
  icon: string
  themeColor: string
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    key: 'classic',
    label: 'Classic',
    sublabel: 'Default NSW Lab',
    icon: '✨',
    themeColor: '#191918',
  },
  {
    key: 'duolingo',
    label: 'Duolingo',
    sublabel: 'Bold Gamified',
    icon: '🦉',
    themeColor: '#58CC02',
  },
  {
    key: 'notion',
    label: 'Notion',
    sublabel: 'Document-First',
    icon: '📝',
    themeColor: '#37352F',
  },
  {
    key: 'monday',
    label: 'Monday.com',
    sublabel: 'Work-OS Board',
    icon: '📊',
    themeColor: '#6161FF',
  },
  {
    key: 'linear',
    label: 'Linear',
    sublabel: 'Dark Product',
    icon: '⚡',
    themeColor: '#5E6AD2',
  },
  {
    key: 'mathspace',
    label: 'Mathspace',
    sublabel: 'Clean Edtech',
    icon: '📐',
    themeColor: '#0D6EFD',
  },
]

export interface VariantHeroProps {
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

