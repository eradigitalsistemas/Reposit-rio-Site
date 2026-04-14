import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type, x-cron-secret, x-webhook-secret',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_dummy_key_for_testing'
const WEBHOOK_SECRET = 'super-secret-webhook-key-123'
const COMERCIAL_EMAIL = 'comercial@areradigital.com.br'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const secret = req.headers.get('x-webhook-secret')
  const isWebhook = secret === WEBHOOK_SECRET

  try {
    const body = await req.json()
    
    const emailsToSend: Array<{
      from: string;
      to: string[];
      subject: string;
      html: string;
      reply_to?: string;
      attachments?: any[];
    }> = []

    // Processamento de gatilho do banco de dados (Webhook)
    if (isWebhook && body.type === 'INSERT' && body.table) {
      const { table, record } = body
      
      let internalSubject = ''
      let internalHtml = ''
      let userSubject = ''
      let userHtml = ''

      if (table === 'leads') {
        internalSubject = `[Novo Contato] ${record.nome}`
        internalHtml = `
          <h2>Novo Contato via Site</h2>
          <p><strong>Nome:</strong> ${record.nome}</p>
          <p><strong>E-mail:</strong> ${record.email}</p>
          <p><strong>WhatsApp:</strong> ${record.telefone || 'Não informado'}</p>
          <p><strong>Empresa:</strong> ${record.empresa || 'Não informado'}</p>
          <p><strong>Estágio:</strong> ${record.estagio || 'Não informado'}</p>
          <p><strong>Observações:</strong> ${record.observacoes || 'Nenhuma'}</p>
        `
        userSubject = `Recebemos sua mensagem - Super Era Digital`
        userHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2>Olá, ${record.nome}!</h2>
            <p>Confirmamos o recebimento da sua mensagem.</p>
            <p>Nossa equipe de atendimento já foi notificada e retornará o seu contato o mais breve possível com as informações solicitadas.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe Super Era Digital</strong></p>
          </div>
        `
      } else if (table === 'leads_erp') {
        const empresaName = record.empresa || record.email
        internalSubject = `[Novo Lead ERP] Solicitação de Demonstração - ${empresaName}`
        internalHtml = `
          <h2>Nova Solicitação de Demonstração (Sistemas ERP)</h2>
          <p><strong>E-mail:</strong> ${record.email}</p>
          <p><strong>WhatsApp:</strong> ${record.telefone || 'Não informado'}</p>
          <p><strong>Empresa:</strong> ${record.empresa || 'Não informado'}</p>
          <p>Acesse o painel para mais detalhes ou entre em contato com o lead.</p>
        `
        userSubject = `Sua solicitação de demonstração ERP foi recebida`
        userHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2>Olá! Recebemos sua solicitação.</h2>
            <p>Agradecemos o seu interesse nas soluções ERP da <strong>Super Era Digital</strong>.</p>
            <p>Sua solicitação de demonstração já foi encaminhada ao nosso setor comercial. Um de nossos consultores especialistas entrará em contato em breve através do WhatsApp ou e-mail informado para agendar o melhor horário para apresentar nossa tecnologia.</p>
            <p>Enquanto isso, fique à vontade para explorar mais sobre nossas soluções em nosso site.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe Comercial - Super Era Digital</strong><br>
            <a href="https://eradigitalweb.goskip.app">eradigitalweb.goskip.app</a></p>
          </div>
        `
      } else if (table === 'leads_certificados') {
        internalSubject = `[Novo Lead] Interesse em Certificados Digitais`
        internalHtml = `
          <h2>Novo Interesse em Certificado Digital</h2>
          <p><strong>E-mail:</strong> ${record.email}</p>
          <p><strong>WhatsApp:</strong> ${record.telefone || 'Não informado'}</p>
          <p><strong>Tipo de Certificado:</strong> ${record.tipo_certificado || 'Não informado'}</p>
        `
        userSubject = `Recebemos seu interesse em Certificados Digitais`
        userHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2>Olá! Recebemos seu contato.</h2>
            <p>Obrigado por buscar a <strong>Super Era Digital</strong> para a emissão do seu Certificado Digital.</p>
            <p>Nossa equipe já recebeu seus dados e entrará em contato rapidamente para orientar sobre os próximos passos e documentos necessários para a emissão ágil e segura do seu certificado.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe de Atendimento - Super Era Digital</strong></p>
          </div>
        `
      } else if (table === 'usuarios') {
        internalSubject = `[Novo Usuário] Cadastro no Sistema`
        internalHtml = `
          <h2>Novo Cadastro Realizado</h2>
          <p><strong>Nome:</strong> ${record.nome || 'Não informado'}</p>
          <p><strong>E-mail:</strong> ${record.email}</p>
          <p><strong>Telefone:</strong> ${record.telefone || 'Não informado'}</p>
          <p><strong>Perfil:</strong> ${record.perfil}</p>
        `
        userSubject = `Bem-vindo à Super Era Digital`
        userHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2>Olá, ${record.nome || 'Usuário'}!</h2>
            <p>Seu cadastro em nosso sistema foi realizado com sucesso.</p>
            <p>Você já pode acessar sua área restrita utilizando suas credenciais.</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe Super Era Digital</strong></p>
          </div>
        `
      } else {
        return new Response(JSON.stringify({ success: true, ignored: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Adiciona o e-mail interno (notificação comercial)
      emailsToSend.push({
        from: 'Era Digital Notificações <onboarding@resend.dev>',
        to: [COMERCIAL_EMAIL],
        subject: internalSubject,
        html: internalHtml,
        reply_to: record.email
      })

      // Adiciona o e-mail para o usuário (confirmação comercial e direta)
      if (record.email && userSubject && userHtml) {
        emailsToSend.push({
          from: 'Super Era Digital <onboarding@resend.dev>',
          to: [record.email],
          subject: userSubject,
          html: userHtml
        })
      }

    } else {
      // Envio direto via API (ex: para outras Edge Functions que chamam send-notification)
      if (body.to && body.subject && body.html) {
        emailsToSend.push({
          from: body.from || 'Super Era Digital <onboarding@resend.dev>',
          to: Array.isArray(body.to) ? body.to : [body.to],
          subject: body.subject,
          html: body.html,
          reply_to: body.reply_to,
          attachments: body.attachments
        })
      } else {
        throw new Error('Payload inválido ou webhook não autorizado')
      }
    }

    const emailPromises = emailsToSend.map(async (emailPayload) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(emailPayload),
      })
      if (!res.ok) {
        const errorText = await res.text()
        console.error(`Resend API error for ${emailPayload.to}: ${res.status} - ${errorText}`)
        return { success: false, error: errorText }
      }
      return { success: true, data: await res.json() }
    })

    const results = await Promise.all(emailPromises)
    const hasError = results.some(r => !r.success)

    if (hasError) {
      throw new Error('Falha no envio de um ou mais emails')
    }

    return new Response(JSON.stringify({ success: true, count: emailsToSend.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
