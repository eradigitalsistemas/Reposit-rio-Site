import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { z } from 'npm:zod@3.22.4'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimit.get(ip)
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 })
    return true
  }
  if (record.count >= 10) {
    return false
  }
  record.count++
  return true
}

const sanitizeHtml = (str: string) => {
  if (!str) return str
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`)
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()

    const payloadSchema = z.object({
      user_id: z.string().uuid('ID de usuário inválido'),
      email: z
        .string()
        .email('Email inválido. Formato esperado: usuario@dominio.com')
        .max(255)
        .transform(sanitizeHtml),
      nome: z
        .string()
        .min(3)
        .max(100)
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
        .transform(sanitizeHtml),
      pdf_base64: z.string().min(10, 'PDF inválido ou não fornecido'),
    })

    const parsed = payloadSchema.safeParse(body)
    if (!parsed.success) {
      const errorMsg = parsed.error.errors[0]?.message || 'Dados inválidos'
      console.warn('Validation failed:', parsed.error.errors)
      return new Response(JSON.stringify({ error: errorMsg, details: parsed.error.errors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { user_id, email, nome, pdf_base64 } = parsed.data

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Armazenar registro de envio como "pending"
    const { data: emailRecord, error: insertError } = await supabase
      .from('emails_sent')
      .insert({ user_id, email, status: 'pending' })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao inserir em emails_sent:', insertError)
    }
    const emailId = emailRecord?.id

    // Envio de Email com Retry Automático e Backoff
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_dummy_for_testing'
    let emailSent = false

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Talentos Super Era Digital <onboarding@resend.dev>',
            to: ['comercial@areradigital.com.br'],
            subject: `Novo Currículo Recebido: ${nome}`,
            html: `<p>Um novo currículo foi submetido por <strong>${nome}</strong> (${email}).</p><p>O currículo detalhado e os resultados DISC encontram-se em anexo no formato PDF.</p>`,
            attachments: [
              {
                filename: `curriculo_${nome.replace(/\s+/g, '_').toLowerCase()}.pdf`,
                content: pdf_base64,
              },
            ],
          }),
        })

        if (res.ok) {
          emailSent = true
          console.log(
            `Email enviado com sucesso para ${nome} (${email}) na tentativa ${attempt + 1}`,
          )
          break
        } else {
          console.error(`Tentativa ${attempt + 1} de envio falhou com status ${res.status}`)
        }
      } catch (err) {
        console.error(`Tentativa ${attempt + 1} falhou com erro:`, err)
      }

      if (!emailSent) {
        // Exponencial backoff: 1s, 2s
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    // Atualizar status na tabela emails_sent
    if (emailId) {
      await supabase
        .from('emails_sent')
        .update({ status: emailSent ? 'sent' : 'failed' })
        .eq('id', emailId)
    }

    if (!emailSent) {
      return new Response(JSON.stringify({ error: 'Erro ao enviar email, tente novamente' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Sincronização com o sistema interno Super Era Digital (Assíncrono Mock)
    try {
      await fetch('https://api.supereradigital.com.br/webhook/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, email, nome, status: 'processed' }),
      }).catch((err) => console.error('Erro na sinc com Super Era Digital (ignorado):', err))
    } catch (syncError) {
      console.error('Falha inesperada ao tentar sincronizar:', syncError)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Currículo processado com sucesso' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('Erro interno na função:', error)
    return new Response(JSON.stringify({ error: error.message || 'Erro interno no servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
