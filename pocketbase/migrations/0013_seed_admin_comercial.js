migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // Idempotent: skip if user already exists
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'comercial@areradigital.com.br')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('comercial@areradigital.com.br')
    record.setPassword('Raimundo1087')
    record.setVerified(true)
    record.set('name', 'Admin Comercial')
    record.set('telefone', '11999999999') // Stored as text to match schema
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'comercial@areradigital.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
