migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')

    try {
      app.findAuthRecordByEmail('users', 'comercial@areradigital.com.br')
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('comercial@areradigital.com.br')
    record.setPassword('Raimundo1087')
    record.setVerified(true)
    record.set('name', 'Administrador Era Digital')
    record.set('telefone', '00000000000')
    app.saveNoValidate(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('users', 'comercial@areradigital.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
