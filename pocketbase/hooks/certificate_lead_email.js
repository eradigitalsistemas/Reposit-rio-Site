onRecordAfterCreateSuccess(
  (e) => {
    const collectionName = e.collection.name
    const record = e.record

    let isCertificado = false
    let email = record.getString('email')
    let nome = 'Cliente'
    let telefone = record.getString('telefone')
    let tipoCertificado = ''

    if (collectionName === 'leads') {
      const tipo = record.getString('tipo')
      const certInterest = record.getString('certificate_interest')
      if (tipo === 'Certificado' || certInterest) {
        isCertificado = true
        nome = record.getString('nome') || 'Cliente'
        tipoCertificado = certInterest || 'Certificado Digital'
      }
    } else if (collectionName === 'leads_certificados') {
      isCertificado = true
      tipoCertificado = record.getString('tipo_certificado') || 'Certificado Digital'
    }

    if (!isCertificado || !email) {
      return e.next()
    }

    const resendApiKey = $secrets.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not found in secrets')
      return e.next()
    }

    const sendEmail = (payload) => {
      let attempts = 0
      let success = false
      while (attempts < 3 && !success) {
        attempts++
        try {
          const res = $http.send({
            url: 'https://api.resend.com/emails',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + resendApiKey,
            },
            body: JSON.stringify(payload),
            timeout: 10,
          })
          if (res.statusCode >= 200 && res.statusCode < 300) {
            success = true
            console.log('Email sent successfully to ' + payload.to[0] + ' on attempt ' + attempts)
          } else {
            console.log(
              'Resend API error to ' +
                payload.to[0] +
                ' on attempt ' +
                attempts +
                ': ' +
                res.statusCode +
                ' ' +
                res.raw,
            )
          }
        } catch (err) {
          console.log(
            'Resend HTTP request failed to ' +
              payload.to[0] +
              ' on attempt ' +
              attempts +
              ': ' +
              err,
          )
        }
      }
      return success
    }

    const clientHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Bem-vindo à Era Digital, ${nome}!</h2>
      <p>Recebemos sua solicitação para o certificado: <strong>${tipoCertificado}</strong>.</p>
      <p>Nossa equipe entrará em contato em breve para dar andamento ao seu pedido.</p>
      <p>Acesse nosso portal para mais informações: <a href="https://eradigitalweb.goskip.app">Era Digital</a></p>
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #999; text-align: center;">
        Para parar de receber estes e-mails, <a href="https://eradigitalweb.goskip.app/unsubscribe?email=${email}">cancele sua inscrição aqui</a>.
      </p>
    </div>
  `

    const clientPayload = {
      from: 'Era Digital <suporte@eradigitalweb.goskip.app>',
      to: [email],
      subject: 'Bem-vindo à Era Digital',
      html: clientHtml,
    }

    const internalHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Nova Solicitação de Certificado</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
      <p><strong>Tipo de Certificado:</strong> ${tipoCertificado}</p>
      <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
    </div>
  `

    const internalPayload = {
      from: 'Era Digital <noreply@eradigitalweb.goskip.app>',
      to: ['comercial@areradigital.com.br'],
      subject: 'Nova Solicitação de Certificado - ' + nome,
      html: internalHtml,
    }

    console.log('Starting email dispatch for certificate lead: ' + record.id)

    const clientSuccess = sendEmail(clientPayload)
    const internalSuccess = sendEmail(internalPayload)

    if (clientSuccess || internalSuccess) {
      try {
        const updatedRecord = $app.findRecordById(collectionName, record.id)
        updatedRecord.set('email_sent', true)
        $app.saveNoValidate(updatedRecord)
        console.log('Updated email_sent flag for record: ' + record.id)
      } catch (err) {
        console.log('Failed to update email_sent flag: ' + err)
      }
    } else {
      console.log('Failed to send both emails for record: ' + record.id + ' after 3 attempts.')
    }

    return e.next()
  },
  'leads',
  'leads_certificados',
)
