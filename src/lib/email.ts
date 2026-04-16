import pb from '@/lib/pocketbase/client'

export async function sendEmailWithRetry(payload: any, retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await pb.send('/backend/v1/email-dispatcher', {
        method: 'POST',
        body: payload,
      })
      return
    } catch (err) {
      if (i === retries - 1) throw err
      // Wait before retrying (exponential backoff)
      await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, i)))
    }
  }
}
