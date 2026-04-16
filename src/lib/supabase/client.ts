/**
 * Minimal Supabase REST Client
 * Uses native fetch to interact with Supabase REST API, eliminating the need
 * for the external SDK package while supporting the familiar chainable API.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

class QueryBuilder {
  private url: URL
  private headers: HeadersInit

  constructor(table: string) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Missing Supabase environment variables')
    }
    this.url = new URL(`${SUPABASE_URL || 'http://localhost'}/rest/v1/${table}`)
    this.headers = {
      apikey: SUPABASE_ANON_KEY || '',
      Authorization: `Bearer ${SUPABASE_ANON_KEY || ''}`,
    }
  }

  select(columns = '*') {
    this.url.searchParams.set('select', columns)
    return this
  }

  order(column: string, options: { ascending?: boolean } = { ascending: true }) {
    this.url.searchParams.set('order', `${column}.${options.ascending ? 'asc' : 'desc'}`)
    return this
  }

  async then(resolve: any, reject: any) {
    try {
      if (!SUPABASE_URL) throw new Error('Supabase URL not configured')
      const res = await fetch(this.url.toString(), { headers: this.headers })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }))
        throw new Error(err.message || 'Error fetching data')
      }
      resolve({ data: await res.json(), error: null })
    } catch (error: any) {
      resolve({ data: null, error })
    }
  }

  async insert(data: any | any[]) {
    try {
      if (!SUPABASE_URL) throw new Error('Supabase URL not configured')

      const res = await fetch(this.url.toString(), {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }))
        throw new Error(err.message || 'Error inserting data')
      }
      return { data: await res.json(), error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }
}

export const supabase = {
  from: (table: string) => new QueryBuilder(table),
}
