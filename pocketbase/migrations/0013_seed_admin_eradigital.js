migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'admin@eradigital.com.br')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('admin@eradigital.com.br')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Admin Era Digital')
    record.set('telefone', '11999999999') // Non-zero value required if field is numeric
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'admin@eradigital.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
