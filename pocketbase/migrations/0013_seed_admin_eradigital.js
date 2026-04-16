migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')

    try {
      app.findAuthRecordByEmail('users', 'eradigital@admin.com')
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('eradigital@admin.com')
    record.setPassword('EraDigitalAdmin')
    record.setVerified(true)
    record.set('name', 'Admin EraDigital')
    record.set('telefone', '11999999999')
    app.saveNoValidate(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('users', 'eradigital@admin.com')
      app.delete(record)
    } catch (_) {}
  },
)
