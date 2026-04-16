import { supabase } from '@/lib/supabase/client'

export async function sendEmailWithRetry(payload: any, retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase.functions.invoke('RESEND_API_KEY', {
        body: payload,
      })
      if (error) throw error
      return
    } catch (err) {
      if (i === retries - 1) throw err
      // Wait before retrying (exponential backoff)
      await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, i)))
    }
  }
}
