import { supabase } from '@/lib/supabase/client'

export const WHATSAPP_COMERCIAL = '558999380203'
export const WHATSAPP_SUPORTE = '558994184931'

export const trackAndOpenWhatsApp = async (phone: string, message: string, source: string) => {
  try {
    await supabase.from('whatsapp_clicks').insert({
      phone_number: phone,
      message,
      source,
    })
  } catch (e) {
    console.error('Failed to track whatsapp click', e)
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
