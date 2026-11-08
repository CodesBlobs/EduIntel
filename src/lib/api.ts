/**
 * Direct Neon Postgres database client.
 *
 * Uses @neondatabase/serverless over HTTPS fetch, enabling instant, real-time
 * queries against your Neon Postgres database directly from the browser/client
 * without requiring proxy middleware or mock servers.
 */
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

const NEON_CONNECTION_STRING =
  'postgresql://neondb_owner:npg_Fduf69UBCZWH@ep-withered-water-a75eee6f-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require'

let _sql: NeonQueryFunction<false, false> | null = null

export function getDb(): NeonQueryFunction<false, false> {
  if (!_sql) {
    _sql = neon(NEON_CONNECTION_STRING)
  }
  return _sql
}

// ── Types ─────────────────────────────────────────────────────

export interface Student {
  id: string
  name: string
  cohort_key: string
  handedness: 'right' | 'left'
  created_at: string
  updated_at: string
}

export interface DbAttempt {
  id: string
  student_id: string
  student_label: string
  cohort_key: string
  test_set_key: string
  duration_min: number
  unit: 'words' | 'letters'
  raw_count: number
  illegible_count: number
  fatigue: 'none' | 'mild' | 'severe'
  net_lpm: number
  net_wpm: number
  gross_wpm: number
  projected_30min_words: number
  status: 'exceeds' | 'developing' | 'below'
  created_at: string
}

export interface AuditSnapshot {
  id?: string
  student_id?: string
  checked_items: Record<string, boolean>
  created_at?: string
}

export interface ClinicalNote {
  id?: string
  student_id?: string
  content_html: string
  updated_at?: string
}

export interface UserPreferences {
  student_id?: string
  selected_cohort: string
  active_set_key: string
  selected_method_category: string
  selected_symptom: string
  show_dotted_thirds: boolean
}

// ── Students ──────────────────────────────────────────────────

export async function fetchStudents(): Promise<Student[]> {
  const sql = getDb()
  const rows = await sql`
    SELECT id, name, cohort_key, handedness, created_at, updated_at
    FROM students
    ORDER BY created_at ASC
  `
  return rows as unknown as Student[]
}

export async function createStudent(data: {
  name: string
  cohort_key?: string
  handedness?: string
}): Promise<Student> {
  const sql = getDb()
  const id = `student-${Date.now()}`
  const name = data.name.trim() || 'New Student'
  const cohort = data.cohort_key || 'year5'
  const handedness = (data.handedness === 'left' ? 'left' : 'right') as 'right' | 'left'

  const [student] = await sql`
    INSERT INTO students (id, name, cohort_key, handedness)
    VALUES (${id}, ${name}, ${cohort}, ${handedness})
    RETURNING id, name, cohort_key, handedness, created_at, updated_at
  `

  // Seed default notes and audit for new student
  await sql`
    INSERT INTO clinical_notes (student_id, content_html)
    VALUES (${id}, '')
    ON CONFLICT DO NOTHING
  `
  await sql`
    INSERT INTO audit_snapshots (student_id, checked_items)
    VALUES (${id}, '{}')
    ON CONFLICT DO NOTHING
  `

  return student as unknown as Student
}

export async function updateStudent(
  id: string,
  data: Partial<Pick<Student, 'name' | 'cohort_key' | 'handedness'>>
): Promise<Student> {
  const sql = getDb()
  const [updated] = await sql`
    UPDATE students
    SET
      name       = COALESCE(${data.name ?? null}, name),
      cohort_key = COALESCE(${data.cohort_key ?? null}, cohort_key),
      handedness = COALESCE(${data.handedness ?? null}, handedness),
      updated_at = now()
    WHERE id = ${id}
    RETURNING id, name, cohort_key, handedness, created_at, updated_at
  `
  return updated as unknown as Student
}

export async function deleteStudent(id: string): Promise<void> {
  const sql = getDb()
  await sql`DELETE FROM students WHERE id = ${id}`
}

// ── Diagnostic Attempts ─────────────────────────────────────

export async function fetchAttempts(studentId: string): Promise<DbAttempt[]> {
  const sql = getDb()
  const rows = await sql`
    SELECT
      id, student_id, student_label, cohort_key, test_set_key,
      duration_min, unit, raw_count, illegible_count, fatigue,
      net_lpm, net_wpm, gross_wpm, projected_30min_words, status,
      created_at
    FROM diagnostic_attempts
    WHERE student_id = ${studentId}
    ORDER BY created_at DESC
    LIMIT 50
  `
  return rows as unknown as DbAttempt[]
}

export async function createAttempt(
  studentId: string,
  data: Omit<DbAttempt, 'id' | 'student_id' | 'created_at'>
): Promise<DbAttempt> {
  const sql = getDb()
  const id = `attempt-${Date.now()}`

  const [attempt] = await sql`
    INSERT INTO diagnostic_attempts (
      id, student_id, student_label, cohort_key, test_set_key,
      duration_min, unit, raw_count, illegible_count, fatigue,
      net_lpm, net_wpm, gross_wpm, projected_30min_words, status
    ) VALUES (
      ${id},
      ${studentId},
      ${data.student_label || ''},
      ${data.cohort_key || 'year5'},
      ${data.test_set_key || 'setA'},
      ${Number(data.duration_min) || 1},
      ${data.unit || 'letters'},
      ${Number(data.raw_count) || 0},
      ${Number(data.illegible_count) || 0},
      ${data.fatigue || 'none'},
      ${Number(data.net_lpm) || 0},
      ${Number(data.net_wpm) || 0},
      ${Number(data.gross_wpm) || 0},
      ${Number(data.projected_30min_words) || 0},
      ${data.status || 'below'}
    )
    RETURNING *
  `
  return attempt as unknown as DbAttempt
}

export async function deleteAttempt(attemptId: string): Promise<void> {
  const sql = getDb()
  await sql`DELETE FROM diagnostic_attempts WHERE id = ${attemptId}`
}

// ── Audit Snapshots ─────────────────────────────────────────

export async function fetchAudit(studentId: string): Promise<AuditSnapshot> {
  const sql = getDb()
  const rows = await sql`
    SELECT id, student_id, checked_items, created_at
    FROM audit_snapshots
    WHERE student_id = ${studentId}
    ORDER BY created_at DESC
    LIMIT 1
  `
  if (rows.length === 0) {
    return { checked_items: {} }
  }
  return rows[0] as unknown as AuditSnapshot
}

export async function saveAudit(
  studentId: string,
  checkedItems: Record<string, boolean>
): Promise<AuditSnapshot> {
  const sql = getDb()
  const jsonStr = JSON.stringify(checkedItems)

  const existing = await sql`
    SELECT id FROM audit_snapshots
    WHERE student_id = ${studentId}
    ORDER BY created_at DESC
    LIMIT 1
  `

  let result
  if (existing.length > 0) {
    ;[result] = await sql`
      UPDATE audit_snapshots
      SET checked_items = ${jsonStr}::jsonb, created_at = now()
      WHERE id = ${existing[0].id}
      RETURNING *
    `
  } else {
    ;[result] = await sql`
      INSERT INTO audit_snapshots (student_id, checked_items)
      VALUES (${studentId}, ${jsonStr}::jsonb)
      RETURNING *
    `
  }
  return result as unknown as AuditSnapshot
}

// ── Clinical Notes ──────────────────────────────────────────

export async function fetchNotes(studentId: string): Promise<ClinicalNote> {
  const sql = getDb()
  const rows = await sql`
    SELECT id, student_id, content_html, updated_at
    FROM clinical_notes
    WHERE student_id = ${studentId}
    ORDER BY updated_at DESC
    LIMIT 1
  `
  if (rows.length === 0) {
    return { content_html: '' }
  }
  return rows[0] as unknown as ClinicalNote
}

export async function saveNotes(
  studentId: string,
  contentHtml: string
): Promise<ClinicalNote> {
  const sql = getDb()
  const existing = await sql`
    SELECT id FROM clinical_notes
    WHERE student_id = ${studentId}
    ORDER BY updated_at DESC
    LIMIT 1
  `

  let result
  if (existing.length > 0) {
    ;[result] = await sql`
      UPDATE clinical_notes
      SET content_html = ${contentHtml}, updated_at = now()
      WHERE id = ${existing[0].id}
      RETURNING *
    `
  } else {
    ;[result] = await sql`
      INSERT INTO clinical_notes (student_id, content_html)
      VALUES (${studentId}, ${contentHtml})
      RETURNING *
    `
  }
  return result as unknown as ClinicalNote
}

// ── Preferences ─────────────────────────────────────────────

export async function fetchPreferences(studentId: string): Promise<UserPreferences> {
  const sql = getDb()
  const rows = await sql`
    SELECT * FROM user_preferences WHERE student_id = ${studentId}
  `
  if (rows.length === 0) {
    return {
      selected_cohort: 'year5',
      active_set_key: 'setA',
      selected_method_category: 'ALL',
      selected_symptom: 'heavy_pressure',
      show_dotted_thirds: true,
    }
  }
  return rows[0] as unknown as UserPreferences
}

export async function savePreferences(
  studentId: string,
  prefs: Partial<UserPreferences>
): Promise<UserPreferences> {
  const sql = getDb()
  const [result] = await sql`
    INSERT INTO user_preferences (
      student_id, selected_cohort, active_set_key,
      selected_method_category, selected_symptom, show_dotted_thirds,
      updated_at
    ) VALUES (
      ${studentId},
      ${prefs.selected_cohort || 'year5'},
      ${prefs.active_set_key || 'setA'},
      ${prefs.selected_method_category || 'ALL'},
      ${prefs.selected_symptom || 'heavy_pressure'},
      ${prefs.show_dotted_thirds !== undefined ? Boolean(prefs.show_dotted_thirds) : true},
      now()
    )
    ON CONFLICT (student_id) DO UPDATE SET
      selected_cohort          = COALESCE(${prefs.selected_cohort ?? null}, user_preferences.selected_cohort),
      active_set_key           = COALESCE(${prefs.active_set_key ?? null}, user_preferences.active_set_key),
      selected_method_category = COALESCE(${prefs.selected_method_category ?? null}, user_preferences.selected_method_category),
      selected_symptom         = COALESCE(${prefs.selected_symptom ?? null}, user_preferences.selected_symptom),
      show_dotted_thirds       = COALESCE(${prefs.show_dotted_thirds !== undefined ? Boolean(prefs.show_dotted_thirds) : null}, user_preferences.show_dotted_thirds),
      updated_at               = now()
    RETURNING *
  `
  return result as unknown as UserPreferences
}

// ── Health Check ────────────────────────────────────────────

export async function healthCheck(): Promise<{ status: string; db_time: string }> {
  const sql = getDb()
  const rows = await sql`SELECT now() as db_time`
  return { status: 'ok', db_time: String(rows[0]?.db_time || new Date().toISOString()) }
}
