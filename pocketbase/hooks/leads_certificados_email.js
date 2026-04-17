onRecordAfterCreateSuccess((e) => {
  const record = e.record
  const email = record.getString('email')
  const nome = record.getString('nome') || 'Interessado'
  const telefone = record.getString('telefone') || 'Não informado'
  const empresa = record.getString('empresa') || 'Não informada'
  const tipoCertificado = record.getString('tipo_certificado') || 'Não especificado'

  const apiKey = $secrets.get('RESEND_API_KEY')
  if (!apiKey) {
    console.log('RESEND_API_KEY not set, skipping email for leads_certificados:', record.id)
    return e.next()
  }

  // Email to Lead
  const leadHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Olá, ${nome}!</h2>
      <p style="color: #555; line-height: 1.5;">Recebemos o seu interesse em nossos certificados profissionais (${tipoCertificado}).</p>
      <p style="color: #555; line-height: 1.5;">Nossa equipe comercial entrará em contato em breve para fornecer mais detalhes e ajudar no que for preciso.</p>
      <p style="color: #555; line-height: 1.5; margin-top: 30px;">Atenciosamente,<br><strong>Equipe Era Digital</strong></p>
    </div>
  `

  const leadPayload = {
    from: 'Era Digital <comercial@areradigital.com.br>',
    to: [email],
    subject: 'Recebemos seu interesse em certificação - Era Digital',
    html: leadHtml,
  }

  // Email to Commercial Team
  const comercialHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Novo Lead de Certificado</h2>
      <p style="color: #555; line-height: 1.5;">Um novo lead demonstrou interesse em certificados profissionais através do site.</p>
      <ul style="color: #555; line-height: 1.8; background: #f9f9f9; padding: 20px; border-radius: 8px; list-style: none; margin: 0; padding-left: 0;">
        <li style="margin-bottom: 10px;"><strong>Nome:</strong> ${nome}</li>
        <li style="margin-bottom: 10px;"><strong>E-mail:</strong> ${email}</li>
        <li style="margin-bottom: 10px;"><strong>Telefone:</strong> ${telefone}</li>
        <li style="margin-bottom: 10px;"><strong>Empresa:</strong> ${empresa}</li>
        <li style="margin-bottom: 10px;"><strong>Certificado de Interesse:</strong> ${tipoCertificado}</li>
      </ul>
    </div>
  `

  const comercialPayload = {
    from: 'Era Digital Site <comercial@areradigital.com.br>',
    to: ['comercial@aeradigital.com.br'],
    subject: 'Novo Lead de Certificado: ' + nome,
    html: comercialHtml,
  }

  try {
    const resComercial = $http.send({
      url: 'https://api.resend.com/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify(comercialPayload),
      timeout: 15,
    })

    const resLead = $http.send({
      url: 'https://api.resend.com/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify(leadPayload),
      timeout: 15,
    })

    const leadOk = resLead.statusCode >= 200 && resLead.statusCode < 300
    const comercialOk = resComercial.statusCode >= 200 && resComercial.statusCode < 300

    if (!leadOk) {
      console.log('Failed to send lead email:', resLead.raw)
    }
    if (!comercialOk) {
      console.log('Failed to send comercial email:', resComercial.raw)
    }

    if (leadOk || comercialOk) {
      const updateRecord = $app.findRecordById('leads_certificados', record.id)
      updateRecord.set('email_sent', true)
      $app.saveNoValidate(updateRecord)
    }
  } catch (err) {
    console.log('Error sending leads_certificados emails:', err)
  }

  return e.next()
}, 'leads_certificados')
