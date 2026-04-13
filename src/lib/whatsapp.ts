import { supabase } from '@/lib/supabase/client'

export const WHATSAPP_COMERCIAL = '558999380203'
export const WHATSAPP_SUPORTE = '558994184931'

export const trackAndOpenWhatsApp = async (phone: string, message: string, source: string) => {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  // To prevent mobile popup blockers, we must open the window synchronously
  // before the async await call, or use location.href for same-tab navigation.
  // Using window.open synchronously:
  const newWindow = window.open(url, '_blank')

  // Fallback if popup blocked
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    window.location.href = url
  }

  try {
    await supabase.from('whatsapp_clicks').insert({
      phone_number: phone,
      message,
      source,
    })
  } catch (e) {
    console.error('Failed to track whatsapp click', e)
  }
}
