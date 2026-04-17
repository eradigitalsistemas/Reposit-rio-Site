onRecordAfterCreateSuccess((e) => {
  const apiKey = $secrets.get('RESEND_API_KEY')
  if (!apiKey) {
    console.log('RESEND_API_KEY not set')
    return e.next()
  }

  const record = e.record
  const email = record.getString('email')
  const nomeEmpresa = record.getString('nome_empresa') || 'Não informado'
  const telefone = record.getString('telefone') || 'Não informado'
  const profissao = record.getString('profissao_ocupacao') || 'Não informado'
  const mensagem = record.getString('mensagem') || 'Nenhuma mensagem enviada.'

  const htmlBody = `
    <h2>Novo Parceiro Interessado - Era Digital</h2>
    <p>Olá!</p>
    <p>Recebemos uma nova solicitação de parceria. Confira os dados abaixo:</p>
    <ul>
      <li><strong>Nome da Empresa / Profissional:</strong> ${nomeEmpresa}</li>
      <li><strong>E-mail:</strong> ${email}</li>
      <li><strong>Telefone:</strong> ${telefone}</li>
      <li><strong>Profissão/Ocupação:</strong> ${profissao}</li>
      <li><strong>Mensagem:</strong> ${mensagem}</li>
    </ul>
    <p>A equipe comercial entrará em contato em breve para apresentar todas as vantagens da parceria.</p>
  `

  const res = $http.send({
    url: 'https://api.resend.com/emails',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Era Digital Comercial <comercial@areradigital.com.br>',
      to: [email, 'comercial@areradigital.com.br'],
      subject: 'Confirmação de Interesse em Parceria - Era Digital',
      html: htmlBody,
    }),
    timeout: 15,
  })

  if (res.statusCode >= 200 && res.statusCode < 300) {
    const updatedRecord = $app.findRecordById('leads_parceiros', record.id)
    updatedRecord.set('email_sent', true)
    $app.save(updatedRecord)
  } else {
    console.log('Failed to send email via Resend for leads_parceiros', res.raw)
  }

  return e.next()
}, 'leads_parceiros')
