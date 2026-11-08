import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

const DATABASE_URL =
  'postgresql://neondb_owner:npg_Fduf69UBCZWH@ep-withered-water-a75eee6f-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require'

let _sql: NeonQueryFunction<false, false> | null = null

export function getSQL(): NeonQueryFunction<false, false> {
  if (!_sql) {
    _sql = neon(DATABASE_URL)
  }
  return _sql
}

