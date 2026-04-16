routerAdd('POST', '/backend/v1/resume/generate', (e) => {
  const body = e.requestInfo().body || {}

  if (!body.personal || !body.personal.email) {
    return e.badRequestError('O campo de e-mail é obrigatório.')
  }

  try {
    let lead
    try {
      lead = $app.findFirstRecordByData('leads', 'email', body.personal.email)
    } catch (_) {
      const collection = $app.findCollectionByNameOrId('leads')
      lead = new Record(collection)
      lead.set('email', body.personal.email)
    }

    lead.set('nome', body.personal.nome || '')
    lead.set('telefone', body.personal.telefone || '')
    lead.set('estagio', 'Currículo Recebido')

    $app.save(lead)

    return e.json(200, {
      success: true,
      message: 'Currículo gerado e enviado com sucesso.',
      leadId: lead.id,
    })
  } catch (err) {
    console.log('Error processing resume:', err)
    return e.internalServerError('Erro ao processar o currículo no servidor.')
  }
})
