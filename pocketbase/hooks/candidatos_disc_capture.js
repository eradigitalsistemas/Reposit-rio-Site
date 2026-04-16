onRecordCreateRequest((e) => {
  const body = e.requestInfo().body || {}
  if (body.disc && typeof body.disc === 'object') {
    const discResultado = e.record.get('disc_resultado') || {}
    for (const key in body.disc) {
      discResultado[key] = body.disc[key]
    }
    e.record.set('disc_resultado', discResultado)
  }
  e.next()
}, 'candidatos')

onRecordUpdateRequest((e) => {
  const body = e.requestInfo().body || {}
  if (body.disc && typeof body.disc === 'object') {
    const discResultado = e.record.get('disc_resultado') || {}
    for (const key in body.disc) {
      discResultado[key] = body.disc[key]
    }
    e.record.set('disc_resultado', discResultado)
  }
  e.next()
}, 'candidatos')
