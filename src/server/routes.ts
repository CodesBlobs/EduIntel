import { getSQL } from './db'
import type { IncomingMessage, ServerResponse } from 'node:http'

// ── Utility ─────────────────────────────────────────────────────
function json(res: ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

function error(res: ServerResponse, msg: string, status = 400) {
  json(res, { error: msg }, status)
}

async function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: Buffer) => (body += chunk.toString()))
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

// ── Route handler ───────────────────────────────────────────────
export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  const path = url.pathname
  const method = req.method?.toUpperCase() || 'GET'
  const sql = getSQL()

  try {
    // ═══════════════════════════════════════════════════════════
    // STUDENTS
    // ═══════════════════════════════════════════════════════════

    // GET /api/students
    if (path === '/api/students' && method === 'GET') {
      const rows = await sql`
        SELECT * FROM students ORDER BY created_at DESC
      `
      return json(res, rows), true
    }

    // POST /api/students
    if (path === '/api/students' && method === 'POST') {
      const body = await readBody(req)
      const name = (body.name as string) || 'New Student'
      const cohortKey = (body.cohort_key as string) || 'year5'
      const handedness = (body.handedness as string) || 'right'

      const [student] = await sql`
        INSERT INTO students (name, cohort_key, handedness)
        VALUES (${name}, ${cohortKey}, ${handedness})
        RETURNING *
      `

      // Create default preferences for the new student
      await sql`
        INSERT INTO user_preferences (student_id)
        VALUES (${student.id})
      `

      // Create empty clinical notes
      await sql`
        INSERT INTO clinical_notes (student_id, content_html)
        VALUES (${student.id}, '')
      `

      // Create default audit snapshot
      const defaultChecked = {
        grip_tripod: false, pressure_light: false, paper_tilt: false,
        anticlockwise: false, size_zones: false, baseline_sit: false,
        word_spacing: false, cursive_joins: false, clean_edits: false,
        paragraph_gap: false,
      }
      await sql`
        INSERT INTO audit_snapshots (student_id, checked_items)
        VALUES (${student.id}, ${JSON.stringify(defaultChecked)})
      `

      return json(res, student, 201), true
    }

    // DELETE /api/students/:id
    const studentDeleteMatch = path.match(/^\/api\/students\/([^/]+)$/)
    if (studentDeleteMatch && method === 'DELETE') {
      const studentId = studentDeleteMatch[1]
      await sql`DELETE FROM students WHERE id = ${studentId}`
      return json(res, { deleted: true }), true
    }

    // PATCH /api/students/:id
    const studentPatchMatch = path.match(/^\/api\/students\/([^/]+)$/)
    if (studentPatchMatch && method === 'PATCH') {
      const studentId = studentPatchMatch[1]
      const body = await readBody(req)
      const [updated] = await sql`
        UPDATE students
        SET
          name       = COALESCE(${(body.name as string) ?? null}, name),
          cohort_key = COALESCE(${(body.cohort_key as string) ?? null}, cohort_key),
          handedness = COALESCE(${(body.handedness as string) ?? null}, handedness),
          updated_at = now()
        WHERE id = ${studentId}
        RETURNING *
      `
      if (!updated) return error(res, 'Student not found', 404), true
      return json(res, updated), true
    }

    // ═══════════════════════════════════════════════════════════
    // DIAGNOSTIC ATTEMPTS
    // ═══════════════════════════════════════════════════════════

    // GET /api/students/:id/attempts
    const attemptsGetMatch = path.match(/^\/api\/students\/([^/]+)\/attempts$/)
    if (attemptsGetMatch && method === 'GET') {
      const studentId = attemptsGetMatch[1]
      const rows = await sql`
        SELECT * FROM diagnostic_attempts
        WHERE student_id = ${studentId}
        ORDER BY created_at DESC
      `
      return json(res, rows), true
    }

    // POST /api/students/:id/attempts
    const attemptsPostMatch = path.match(/^\/api\/students\/([^/]+)\/attempts$/)
    if (attemptsPostMatch && method === 'POST') {
      const studentId = attemptsPostMatch[1]
      const b = await readBody(req)
      const [attempt] = await sql`
        INSERT INTO diagnostic_attempts (
          student_id, student_label, cohort_key, test_set_key,
          duration_min, unit, raw_count, illegible_count, fatigue,
          net_lpm, net_wpm, gross_wpm, projected_30min_words, status
        ) VALUES (
          ${studentId},
          ${(b.student_label as string) || ''},
          ${(b.cohort_key as string) || 'year5'},
          ${(b.test_set_key as string) || 'setA'},
          ${Number(b.duration_min) || 1},
          ${(b.unit as string) || 'letters'},
          ${Number(b.raw_count) || 0},
          ${Number(b.illegible_count) || 0},
          ${(b.fatigue as string) || 'none'},
          ${Number(b.net_lpm) || 0},
          ${Number(b.net_wpm) || 0},
          ${Number(b.gross_wpm) || 0},
          ${Number(b.projected_30min_words) || 0},
          ${(b.status as string) || 'below'}
        )
        RETURNING *
      `
      return json(res, attempt, 201), true
    }

    // DELETE /api/attempts/:id
    const attemptDeleteMatch = path.match(/^\/api\/attempts\/([^/]+)$/)
    if (attemptDeleteMatch && method === 'DELETE') {
      const attemptId = attemptDeleteMatch[1]
      await sql`DELETE FROM diagnostic_attempts WHERE id = ${attemptId}`
      return json(res, { deleted: true }), true
    }

    // ═══════════════════════════════════════════════════════════
    // AUDIT SNAPSHOTS
    // ═══════════════════════════════════════════════════════════

    // GET /api/students/:id/audit  (latest snapshot)
    const auditGetMatch = path.match(/^\/api\/students\/([^/]+)\/audit$/)
    if (auditGetMatch && method === 'GET') {
      const studentId = auditGetMatch[1]
      const [latest] = await sql`
        SELECT * FROM audit_snapshots
        WHERE student_id = ${studentId}
        ORDER BY created_at DESC
        LIMIT 1
      `
      return json(res, latest || { checked_items: {} }), true
    }

    // PUT /api/students/:id/audit  (upsert latest)
    const auditPutMatch = path.match(/^\/api\/students\/([^/]+)\/audit$/)
    if (auditPutMatch && (method === 'PUT' || method === 'POST')) {
      const studentId = auditPutMatch[1]
      const b = await readBody(req)
      const checkedItems = b.checked_items || {}

      // Get the most recent snapshot for this student
      const [existing] = await sql`
        SELECT id FROM audit_snapshots
        WHERE student_id = ${studentId}
        ORDER BY created_at DESC
        LIMIT 1
      `

      let result
      if (existing) {
        // Update existing snapshot
        ;[result] = await sql`
          UPDATE audit_snapshots
          SET checked_items = ${JSON.stringify(checkedItems)},
              created_at = now()
          WHERE id = ${existing.id}
          RETURNING *
        `
      } else {
        // Create new snapshot
        ;[result] = await sql`
          INSERT INTO audit_snapshots (student_id, checked_items)
          VALUES (${studentId}, ${JSON.stringify(checkedItems)})
          RETURNING *
        `
      }

      return json(res, result), true
    }

    // POST /api/students/:id/audit/snapshot  (create historical snapshot)
    const auditSnapshotMatch = path.match(/^\/api\/students\/([^/]+)\/audit\/snapshot$/)
    if (auditSnapshotMatch && method === 'POST') {
      const studentId = auditSnapshotMatch[1]
      const b = await readBody(req)
      const [snapshot] = await sql`
        INSERT INTO audit_snapshots (student_id, checked_items)
        VALUES (${studentId}, ${JSON.stringify(b.checked_items || {})})
        RETURNING *
      `
      return json(res, snapshot, 201), true
    }

    // GET /api/students/:id/audit/history
    const auditHistoryMatch = path.match(/^\/api\/students\/([^/]+)\/audit\/history$/)
    if (auditHistoryMatch && method === 'GET') {
      const studentId = auditHistoryMatch[1]
      const rows = await sql`
        SELECT * FROM audit_snapshots
        WHERE student_id = ${studentId}
        ORDER BY created_at DESC
        LIMIT 50
      `
      return json(res, rows), true
    }

    // ═══════════════════════════════════════════════════════════
    // CLINICAL NOTES
    // ═══════════════════════════════════════════════════════════

    // GET /api/students/:id/notes
    const notesGetMatch = path.match(/^\/api\/students\/([^/]+)\/notes$/)
    if (notesGetMatch && method === 'GET') {
      const studentId = notesGetMatch[1]
      const [note] = await sql`
        SELECT * FROM clinical_notes
        WHERE student_id = ${studentId}
        ORDER BY updated_at DESC
        LIMIT 1
      `
      return json(res, note || { content_html: '' }), true
    }

    // PUT /api/students/:id/notes
    const notesPutMatch = path.match(/^\/api\/students\/([^/]+)\/notes$/)
    if (notesPutMatch && (method === 'PUT' || method === 'POST')) {
      const studentId = notesPutMatch[1]
      const b = await readBody(req)
      const contentHtml = (b.content_html as string) || ''

      const [existing] = await sql`
        SELECT id FROM clinical_notes
        WHERE student_id = ${studentId}
        ORDER BY updated_at DESC
        LIMIT 1
      `

      let result
      if (existing) {
        ;[result] = await sql`
          UPDATE clinical_notes
          SET content_html = ${contentHtml}, updated_at = now()
          WHERE id = ${existing.id}
          RETURNING *
        `
      } else {
        ;[result] = await sql`
          INSERT INTO clinical_notes (student_id, content_html)
          VALUES (${studentId}, ${contentHtml})
          RETURNING *
        `
      }

      return json(res, result), true
    }

    // ═══════════════════════════════════════════════════════════
    // USER PREFERENCES
    // ═══════════════════════════════════════════════════════════

    // GET /api/students/:id/preferences
    const prefsGetMatch = path.match(/^\/api\/students\/([^/]+)\/preferences$/)
    if (prefsGetMatch && method === 'GET') {
      const studentId = prefsGetMatch[1]
      const [prefs] = await sql`
        SELECT * FROM user_preferences WHERE student_id = ${studentId}
      `
      return json(res, prefs || {}), true
    }

    // PUT /api/students/:id/preferences
    const prefsPutMatch = path.match(/^\/api\/students\/([^/]+)\/preferences$/)
    if (prefsPutMatch && (method === 'PUT' || method === 'PATCH')) {
      const studentId = prefsPutMatch[1]
      const b = await readBody(req)

      // Upsert preferences
      const [result] = await sql`
        INSERT INTO user_preferences (
          student_id, selected_cohort, active_set_key,
          selected_method_category, selected_symptom, show_dotted_thirds,
          updated_at
        ) VALUES (
          ${studentId},
          ${(b.selected_cohort as string) || 'year5'},
          ${(b.active_set_key as string) || 'setA'},
          ${(b.selected_method_category as string) || 'ALL'},
          ${(b.selected_symptom as string) || 'heavy_pressure'},
          ${b.show_dotted_thirds !== undefined ? Boolean(b.show_dotted_thirds) : true},
          now()
        )
        ON CONFLICT (student_id) DO UPDATE SET
          selected_cohort          = COALESCE(${(b.selected_cohort as string) ?? null}, user_preferences.selected_cohort),
          active_set_key           = COALESCE(${(b.active_set_key as string) ?? null}, user_preferences.active_set_key),
          selected_method_category = COALESCE(${(b.selected_method_category as string) ?? null}, user_preferences.selected_method_category),
          selected_symptom         = COALESCE(${(b.selected_symptom as string) ?? null}, user_preferences.selected_symptom),
          show_dotted_thirds       = COALESCE(${b.show_dotted_thirds !== undefined ? Boolean(b.show_dotted_thirds) : null}, user_preferences.show_dotted_thirds),
          updated_at               = now()
        RETURNING *
      `
      return json(res, result), true
    }

    // ═══════════════════════════════════════════════════════════
    // HEALTH CHECK
    // ═══════════════════════════════════════════════════════════
    if (path === '/api/health' && method === 'GET') {
      const [{ now }] = await sql`SELECT now()`
      return json(res, { status: 'ok', db_time: now }), true
    }

    // Not an API route we handle
    return false
  } catch (err) {
    console.error('[API Error]', err)
    error(res, (err as Error).message || 'Internal server error', 500)
    return true
  }
}

