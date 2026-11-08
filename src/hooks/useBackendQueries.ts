import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/lib/api'
import type { DbAttempt, Student, AuditSnapshot, ClinicalNote, UserPreferences } from '@/lib/api'

// ── Active Student (stored in localStorage for simplicity) ────
const ACTIVE_STUDENT_KEY = 'hw-active-student-id'

export function getActiveStudentId(): string {
  return localStorage.getItem(ACTIVE_STUDENT_KEY) || 'default-student'
}

export function setActiveStudentId(id: string) {
  localStorage.setItem(ACTIVE_STUDENT_KEY, id)
}

// ── Query Keys ──────────────────────────────────────────────
export const queryKeys = {
  students: ['students'] as const,
  attempts: (studentId: string) => ['attempts', studentId] as const,
  audit: (studentId: string) => ['audit', studentId] as const,
  notes: (studentId: string) => ['notes', studentId] as const,
  preferences: (studentId: string) => ['preferences', studentId] as const,
  health: ['health'] as const,
}

// ── Students ────────────────────────────────────────────────

export function useStudents() {
  return useQuery({
    queryKey: queryKeys.students,
    queryFn: api.fetchStudents,
    staleTime: 30_000,
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; cohort_key?: string; handedness?: string }) =>
      api.createStudent(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.students })
    },
  })
}

export function useUpdateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Pick<Student, 'name' | 'cohort_key' | 'handedness'>>
    }) => api.updateStudent(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.students })
    },
  })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteStudent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.students })
    },
  })
}

// ── Diagnostic Attempts ─────────────────────────────────────

export function useAttempts(studentId: string) {
  return useQuery({
    queryKey: queryKeys.attempts(studentId),
    queryFn: () => api.fetchAttempts(studentId),
    enabled: !!studentId,
    staleTime: 10_000,
  })
}

export function useCreateAttempt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      studentId,
      data,
    }: {
      studentId: string
      data: Omit<DbAttempt, 'id' | 'student_id' | 'created_at'>
    }) => api.createAttempt(studentId, data),
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.attempts(variables.studentId) })
    },
  })
}

export function useDeleteAttempt(studentId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteAttempt,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.attempts(studentId) })
    },
  })
}

// ── Audit ───────────────────────────────────────────────────

export function useAudit(studentId: string) {
  return useQuery({
    queryKey: queryKeys.audit(studentId),
    queryFn: () => api.fetchAudit(studentId),
    enabled: !!studentId,
    staleTime: 10_000,
  })
}

export function useSaveAudit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      studentId,
      checkedItems,
    }: {
      studentId: string
      checkedItems: Record<string, boolean>
    }) => api.saveAudit(studentId, checkedItems),
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.audit(variables.studentId) })
    },
  })
}

// ── Clinical Notes ──────────────────────────────────────────

export function useNotes(studentId: string) {
  return useQuery({
    queryKey: queryKeys.notes(studentId),
    queryFn: () => api.fetchNotes(studentId),
    enabled: !!studentId,
    staleTime: 10_000,
  })
}

export function useSaveNotes() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      studentId,
      contentHtml,
    }: {
      studentId: string
      contentHtml: string
    }) => api.saveNotes(studentId, contentHtml),
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.notes(variables.studentId) })
    },
  })
}

// ── Preferences ─────────────────────────────────────────────

export function usePreferences(studentId: string) {
  return useQuery({
    queryKey: queryKeys.preferences(studentId),
    queryFn: () => api.fetchPreferences(studentId),
    enabled: !!studentId,
    staleTime: 30_000,
  })
}

export function useSavePreferences() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      studentId,
      prefs,
    }: {
      studentId: string
      prefs: Partial<UserPreferences>
    }) => api.savePreferences(studentId, prefs),
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.preferences(variables.studentId) })
    },
  })
}

// ── Health Check ────────────────────────────────────────────

export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: api.healthCheck,
    staleTime: 60_000,
    retry: 2,
  })
}

