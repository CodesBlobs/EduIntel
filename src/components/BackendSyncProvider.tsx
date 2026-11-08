import React, { useEffect, useCallback, useRef } from 'react'
import { useLabStore } from '@/store/useLabStore'
import {
  useStudents,
  useAttempts,
  useAudit,
  useNotes,
  usePreferences,
  useCreateAttempt,
  useDeleteAttempt,
  useSaveAudit,
  useSaveNotes,
  useSavePreferences,
  useCreateStudent,
} from '@/hooks/useBackendQueries'
import type { CohortKey, MethodCategory, SymptomKey, TestSetKey } from '@/data/handwritingData'
import type { DbAttempt } from '@/lib/api'

/**
 * BackendSyncProvider loads data from Neon Postgres on mount
 * and syncs changes back to the database.
 * Wrap your app content inside this provider.
 */
export const BackendSyncProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const store = useLabStore()
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const initialLoadDone = useRef(false)

  const studentId = store.activeStudentId

  // ── Queries ──
  const { data: students } = useStudents()
  const { data: attempts } = useAttempts(studentId)
  const { data: audit } = useAudit(studentId)
  const { data: notes } = useNotes(studentId)
  const { data: preferences } = usePreferences(studentId)

  // ── Mutations ──
  const createAttemptMut = useCreateAttempt()
  const deleteAttemptMut = useDeleteAttempt(studentId)
  const saveAuditMut = useSaveAudit()
  const saveNotesMut = useSaveNotes()
  const savePrefsMut = useSavePreferences()
  const createStudentMut = useCreateStudent()

  // ── Initial load: hydrate store from backend data ──
  useEffect(() => {
    if (initialLoadDone.current) return
    if (!students) return

    // If no students exist, create a default one
    if (students.length === 0) {
      createStudentMut.mutate(
        { name: 'My Student', cohort_key: 'year5', handedness: 'right' },
        {
          onSuccess: (student) => {
            store.setActiveStudentId(student.id)
          },
        }
      )
      return
    }

    // Verify the active student exists
    const exists = students.find((s) => s.id === studentId)
    if (!exists) {
      store.setActiveStudentId(students[0].id)
    }

    initialLoadDone.current = true
  }, [students, studentId])

  // Hydrate audit from backend
  useEffect(() => {
    if (audit?.checked_items) {
      store.setAuditCheckedMap(audit.checked_items)
    }
  }, [audit])

  // Hydrate notes from backend
  useEffect(() => {
    if (notes?.content_html !== undefined) {
      store.setClinicalNotesHtml(notes.content_html)
    }
  }, [notes])

  // Hydrate preferences from backend
  useEffect(() => {
    if (preferences?.selected_cohort) {
      store.setSelectedCohort(preferences.selected_cohort as CohortKey)
      store.setActiveSetKey((preferences.active_set_key || 'setA') as TestSetKey)
      store.setSelectedMethodCategory(
        (preferences.selected_method_category || 'ALL') as MethodCategory
      )
      store.setSelectedSymptom(
        (preferences.selected_symptom || 'heavy_pressure') as SymptomKey
      )
      store.setShowDottedThirds(preferences.show_dotted_thirds ?? true)
    }
  }, [preferences])

  // ── Debounced sync helpers ──
  const debouncedSync = useCallback(
    (key: string, fn: () => void, delayMs = 800) => {
      if (debounceTimers.current[key]) {
        clearTimeout(debounceTimers.current[key])
      }
      debounceTimers.current[key] = setTimeout(fn, delayMs)
    },
    []
  )

  // ── Expose save functions via global context ──
  // (We use a simpler approach: attach to window for the store actions to call)

  useEffect(() => {
    const w = window as unknown as {
      __backendSync: {
        saveAttempt: (data: Omit<DbAttempt, 'id' | 'student_id' | 'created_at'>) => Promise<DbAttempt>
        deleteAttempt: (id: string) => void
        saveAudit: (checkedItems: Record<string, boolean>) => void
        saveNotes: (html: string) => void
        savePreferences: (prefs: Record<string, unknown>) => void
      }
    }

    w.__backendSync = {
      saveAttempt: (data) => {
        return new Promise((resolve, reject) => {
          createAttemptMut.mutate(
            { studentId, data },
            { onSuccess: resolve, onError: reject }
          )
        })
      },
      deleteAttempt: (id) => {
        deleteAttemptMut.mutate(id)
      },
      saveAudit: (checkedItems) => {
        debouncedSync('audit', () => {
          saveAuditMut.mutate({ studentId, checkedItems })
        })
      },
      saveNotes: (html) => {
        debouncedSync('notes', () => {
          saveNotesMut.mutate({ studentId, contentHtml: html })
        }, 1500)
      },
      savePreferences: (prefs) => {
        debouncedSync('prefs', () => {
          savePrefsMut.mutate({ studentId, prefs })
        })
      },
    }

    return () => {
      // Cleanup timers
      Object.values(debounceTimers.current).forEach(clearTimeout)
    }
  }, [studentId, createAttemptMut, deleteAttemptMut, saveAuditMut, saveNotesMut, savePrefsMut, debouncedSync])

  return <>{children}</>
}

export interface BackendSyncContext {
  saveAttempt: (data: Omit<DbAttempt, 'id' | 'student_id' | 'created_at'>) => Promise<DbAttempt>
  deleteAttempt: (id: string) => void
  saveAudit: (checkedItems: Record<string, boolean>) => void
  saveNotes: (html: string) => void
  savePreferences: (prefs: Record<string, unknown>) => void
}

// ── Helper to get backend sync functions from anywhere ──
export function getBackendSync(): BackendSyncContext | undefined {
  return (window as unknown as { __backendSync?: BackendSyncContext }).__backendSync
}

