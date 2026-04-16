routerAdd('POST', '/backend/v1/email-dispatcher', (e) => {
  const body = e.requestInfo().body || {}
  const type = body.type

  const apiKey = $secrets.get('RESEND_API_KEY')
  const timestamp = new Date().toISOString()

  if (!apiKey) {
    console.log(
      `[${timestamp}] Cliente: ${body.clientEmail || body.teamEmail} | Tipo: ${type} | Status: Falha (API Key ausente)`,
    )
    return e.internalServerError('RESEND_API_KEY not configured')
  }

  let to, subject, from, html

  if (type === 'client_confirmation') {
    to = body.clientEmail
    subject = body.subject || 'Bem-vindo ao Planejador Financeiro'
    from = body.from || 'suporte@seudominio.com'

    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background-color: #0f172a; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bem-vindo ao Planejador Financeiro</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; color: #334155; line-height: 1.6;">
                    <h2 style="color: #0f172a; margin-top: 0;">Olá, ${body.clientName || 'Cliente'}!</h2>
                    <p>Recebemos sua solicitação de certificado digital com sucesso. Nossa equipe já está analisando seus dados e entrará em contato em breve.</p>
                    
                    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #0f172a; font-size: 16px;">Resumo do seu cadastro:</h3>
                      <ul style="margin: 0; padding-left: 20px;">
                        <li><strong>Nome:</strong> ${body.registrationSummary?.name || '-'}</li>
                        <li><strong>E-mail:</strong> ${body.registrationSummary?.email || '-'}</li>
                        <li><strong>Telefone:</strong> ${body.registrationSummary?.phone || '-'}</li>
                        <li><strong>Empresa:</strong> ${body.registrationSummary?.company || '-'}</li>
                      </ul>
                    </div>
                    
                    <p style="text-align: center; margin-top: 30px;">
                      <a href="${body.accessLink || '#'}" style="background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Acessar Detalhes</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">
                      Você está recebendo este e-mail pois se cadastrou em nosso sistema.<br>
                      <a href="#" style="color: #3b82f6; text-decoration: none;">Cancelar inscrição ou gerenciar preferências</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  } else if (type === 'internal_notification') {
    to = body.teamEmail
    subject = body.subject || `Nova Solicitação de Cadastro - ${body.clientData?.name || 'Cliente'}`
    from = body.from || 'sistema@seudominio.com'

    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <tr>
                  <td style="color: #334155; line-height: 1.6;">
                    <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Nova Solicitação de Certificado</h2>
                    <p>Um novo lead acabou de se cadastrar no site.</p>
                    
                    <h3 style="color: #0f172a; font-size: 16px; margin-top: 25px;">Dados do Cliente:</h3>
                    <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #f8fafc; border-radius: 6px;">
                      <tr>
                        <td width="30%"><strong>Nome:</strong></td>
                        <td>${body.clientData?.name || '-'}</td>
                      </tr>
                      <tr>
                        <td><strong>E-mail:</strong></td>
                        <td><a href="mailto:${body.clientData?.email}">${body.clientData?.email || '-'}</a></td>
                      </tr>
                      <tr>
                        <td><strong>Telefone:</strong></td>
                        <td>${body.clientData?.phone || '-'}</td>
                      </tr>
                      <tr>
                        <td><strong>Empresa:</strong></td>
                        <td>${body.clientData?.company || '-'}</td>
                      </tr>
                      <tr>
                        <td><strong>Detalhes:</strong></td>
                        <td>${body.clientData?.registrationDetails || '-'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  } else {
    console.log(
      `[${timestamp}] Cliente: Desconhecido | Tipo: ${type} | Status: Falha (Tipo inválido)`,
    )
    return e.badRequestError('Invalid email type')
  }

  const fromFormatted = from.includes('<') ? from : `Equipe <${from}>`

  const res = $http.send({
    url: 'https://api.resend.com/emails',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: fromFormatted,
      to: [to],
      subject: subject,
      html: html,
    }),
    timeout: 15,
  })

  if (res.statusCode >= 200 && res.statusCode < 300) {
    console.log(`[${timestamp}] Cliente: ${to} | Tipo: ${type} | Status: Sucesso`)
    return e.json(200, { success: true })
  } else {
    console.log(
      `[${timestamp}] Cliente: ${to} | Tipo: ${type} | Status: Falha (${res.statusCode} - ${res.raw})`,
    )
    return e.internalServerError('Failed to send email')
  }
})
