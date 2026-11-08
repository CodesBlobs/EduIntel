import { create } from 'zustand'
import {
  CohortKey,
  FatigueLevel,
  INITIAL_AUDIT_ITEMS,
  MethodCategory,
  SymptomKey,
  TestSetKey,
} from '@/data/handwritingData'

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

  // ── UI Navigation ──
  activeTab: LabTabId

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
