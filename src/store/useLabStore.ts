import { create } from 'zustand'
import {
  CohortKey,
  FatigueLevel,
  INITIAL_AUDIT_ITEMS,
  MethodCategory,
  SymptomKey,
  TestSetKey,
} from '@/data/handwritingData'
import { LandingStyleKey } from '@/components/variants/types'

export function getInitialLandingStyle(): LandingStyleKey {
  if (typeof window === 'undefined') return 'classic'
  const p = new URLSearchParams(window.location.search)
  const val = (p.get('landing') || p.get('style') || '').toLowerCase().trim()
  if (val === 'duolingo' || val === 'doulinogo' || val === 'gamified') return 'duolingo'
  if (val === 'notion' || val === 'doc' || val === 'document' || val === 'doc-first') return 'notion'
  if (val === 'monday' || val === 'monday.com' || val === 'work-os') return 'monday'
  if (val === 'linear' || val === 'dark-product') return 'linear'
  if (val === 'mathspace' || val === 'edtech' || val === 'clean-edtech') return 'mathspace'
  return 'classic'
}

export type LabTabId =
  | 'view-test-lab'
  | 'view-gov-criteria'
  | 'view-legibility-audit'
  | 'view-improvement-methods'
  | 'view-tools-ergonomics'

export interface DiagnosticAttempt {
  id: string
  timestamp: string
  studentLabel: string
  cohortKey: CohortKey
  testSetKey: TestSetKey
  durationMin: number
  unit: 'words' | 'letters'
  rawCount: number
  illegibleCount: number
  fatigue: FatigueLevel
  netLpm: number
  netWpm: number
  grossWpm: number
  projected30MinWords: number
  status: 'exceeds' | 'developing' | 'below'
}

interface LabState {
  // ── Active Student ──
  activeStudentId: string

  // ── UI Navigation & Style Variant ──
  activeTab: LabTabId
  landingStyle: LandingStyleKey

  // ── Test Lab Config (synced with backend preferences) ──
  selectedCohort: CohortKey
  activeSetKey: TestSetKey
  selectedMethodCategory: MethodCategory
  selectedSymptom: SymptomKey
  handedness: 'right' | 'left'
  showDottedThirds: boolean

  // ── Audit checklist (synced with backend) ──
  auditCheckedMap: Record<string, boolean>

  // ── Latest evaluation (local, computed live from form) ──
  latestEval: {
    studentLabel: string
    durationMin: number
    unit: 'words' | 'letters'
    rawCount: number
    illegibleCount: number
    fatigue: FatigueLevel
    netLpm: number
    netWpm: number
    grossWpm: number
    projected30MinWords: number
    status: 'exceeds' | 'developing' | 'below'
  }

  // ── Clinical notes HTML (synced with backend) ──
  clinicalNotesHtml: string

  // ── UI-only state ──
  isReportModalOpen: boolean

  // ── Backend sync status ──
  isSyncing: boolean
  lastSyncError: string | null

  // ── Actions ──
  setActiveStudentId: (id: string) => void
  setActiveTab: (tab: LabTabId) => void
  setLandingStyle: (style: LandingStyleKey) => void
  setSelectedCohort: (cohort: CohortKey) => void
  setActiveSetKey: (setKey: TestSetKey) => void
  toggleAuditItem: (id: string) => void
  setAllAuditItems: (checked: boolean) => void
  setAuditCheckedMap: (map: Record<string, boolean>) => void
  setSelectedMethodCategory: (cat: MethodCategory) => void
  setSelectedSymptom: (symptom: SymptomKey) => void
  setHandedness: (hand: 'right' | 'left') => void
  setShowDottedThirds: (show: boolean) => void
  updateLatestEval: (evalData: LabState['latestEval']) => void
  setClinicalNotesHtml: (html: string) => void
  setReportModalOpen: (open: boolean) => void
  setSyncing: (syncing: boolean) => void
  setSyncError: (error: string | null) => void
}

const defaultAuditMap: Record<string, boolean> = {}
INITIAL_AUDIT_ITEMS.forEach((item) => {
  defaultAuditMap[item.id] = item.defaultChecked
})

export const useLabStore = create<LabState>()(
  (set) => ({
    activeStudentId: localStorage.getItem('hw-active-student-id') || 'default-student',
    activeTab: 'view-test-lab',
    landingStyle: getInitialLandingStyle(),
    selectedCohort: 'year5',
    activeSetKey: 'setA',
    auditCheckedMap: defaultAuditMap,
    selectedMethodCategory: 'ALL',
    selectedSymptom: 'heavy_pressure',
    handedness: 'right',
    showDottedThirds: true,
    latestEval: {
      studentLabel: '',
      durationMin: 1,
      unit: 'letters',
      rawCount: 0,
      illegibleCount: 0,
      fatigue: 'none',
      netLpm: 0,
      netWpm: 0,
      grossWpm: 0,
      projected30MinWords: 0,
      status: 'below',
    },
    clinicalNotesHtml: '',
    isReportModalOpen: false,
    isSyncing: false,
    lastSyncError: null,

    setActiveStudentId: (id) => {
      localStorage.setItem('hw-active-student-id', id)
      set({ activeStudentId: id })
    },
    setActiveTab: (activeTab) => set({ activeTab }),
    setLandingStyle: (landingStyle) => set({ landingStyle }),
    setSelectedCohort: (selectedCohort) => set({ selectedCohort }),
    setActiveSetKey: (activeSetKey) => set({ activeSetKey }),
    toggleAuditItem: (id) =>
      set((state) => ({
        auditCheckedMap: {
          ...state.auditCheckedMap,
          [id]: !state.auditCheckedMap[id],
        },
      })),
    setAllAuditItems: (checked) =>
      set(() => {
        const next: Record<string, boolean> = {}
        INITIAL_AUDIT_ITEMS.forEach((item) => {
          next[item.id] = checked
        })
        return { auditCheckedMap: next }
      }),
    setAuditCheckedMap: (auditCheckedMap) => set({ auditCheckedMap }),
    setSelectedMethodCategory: (selectedMethodCategory) =>
      set({ selectedMethodCategory }),
    setSelectedSymptom: (selectedSymptom) => set({ selectedSymptom }),
    setHandedness: (handedness) => set({ handedness }),
    setShowDottedThirds: (showDottedThirds) => set({ showDottedThirds }),
    updateLatestEval: (latestEval) => set({ latestEval }),
    setClinicalNotesHtml: (clinicalNotesHtml) => set({ clinicalNotesHtml }),
    setReportModalOpen: (isReportModalOpen) => set({ isReportModalOpen }),
    setSyncing: (isSyncing) => set({ isSyncing }),
    setSyncError: (lastSyncError) => set({ lastSyncError }),
  })
)
