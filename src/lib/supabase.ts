/**
 * Mock Supabase Client
 * Simulates network latency, data persistence in localStorage, and constraints
 * to provide a fully functional end-to-end prototype without real DB credentials.
 */

const generateId = () => Math.random().toString(36).substring(2, 15)

export const supabase = {
  from: (table: string) => ({
    insert: async (data: any | any[]) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const isArray = Array.isArray(data)
      const items = isArray ? data : [data]
      const results = []

      for (const item of items) {
        // Enforce UNIQUE constraint on users.email
        if (table === 'users') {
          const existing = localStorage.getItem(`db_user_${item.email}`)
          if (existing) {
            return {
              data: null,
              error: { message: 'Email já cadastrado', code: '23505' },
            }
          }
        }

        const record = {
          ...item,
          id: item.id || generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Save to local storage mock
        if (table === 'users') {
          localStorage.setItem(`db_user_${item.email}`, JSON.stringify(record))
        } else {
          const tableData = JSON.parse(localStorage.getItem(`db_${table}`) || '[]')
          tableData.push(record)
          localStorage.setItem(`db_${table}`, JSON.stringify(tableData))
        }

        results.push(record)
      }

      return { data: isArray ? results : results[0], error: null }
    },
  }),
}
