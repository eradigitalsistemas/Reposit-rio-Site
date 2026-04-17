onRecordAfterCreateSuccess((e) => {
  const record = e.record
  const email = record.getString('email')
  const empresa = record.getString('empresa')
  const telefone = record.getString('telefone')
  const dataContato = record.getString('data_contato')
  const nome = record.getString('nome') || 'Cliente'

  const resendApiKey = $secrets.get('RESEND_API_KEY')
  if (!resendApiKey) {
    console.log('RESEND_API_KEY not set, skipping ERP emails')
    return e.next()
  }

  const fromEmail = 'comercial@areradigital.com.br'

  // 1. Send confirmation to user
  const userHtml = `
    <h2>Olá, ${nome}!</h2>
    <p>Recebemos o seu interesse em nossa solução de ERP.</p>
    <p>Nossa equipe comercial entrará em contato em breve para agendar uma demonstração.</p>
    <br/>
    <p>Atenciosamente,<br/>Equipe Aera Digital</p>
  `

  $http.send({
    url: 'https://api.resend.com/emails',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + resendApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Aera Digital <' + fromEmail + '>',
      to: [email],
      subject: 'Recebemos sua solicitação de análise de ERP',
      html: userHtml,
    }),
    timeout: 15,
  })

  // 2. Send notification to commercial team
  const comercialHtml = `
    <h2>Novo Lead de ERP</h2>
    <p>Um novo lead demonstrou interesse em Sistemas ERP.</p>
    <ul>
      <li><strong>Nome:</strong> ${nome}</li>
      <li><strong>Empresa:</strong> ${empresa}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Telefone:</strong> ${telefone}</li>
      <li><strong>Data de Contato:</strong> ${dataContato}</li>
    </ul>
  `

  $http.send({
    url: 'https://api.resend.com/emails',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + resendApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Aera Digital System <' + fromEmail + '>',
      to: ['comercial@areradigital.com.br'],
      subject: 'Novo Lead ERP - ' + empresa,
      html: comercialHtml,
    }),
    timeout: 15,
  })

  return e.next()
}, 'leads_erp')
