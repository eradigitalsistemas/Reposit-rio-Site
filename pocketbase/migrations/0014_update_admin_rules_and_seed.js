migrate(
  (app) => {
    // Seed the admin user as requested by Acceptance Criteria
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'comercial@areradigital.com.br')
      user.setPassword('Raimundo1087')
      app.save(user)
    } catch (_) {
      const record = new Record(users)
      record.setEmail('comercial@areradigital.com.br')
      record.setPassword('Raimundo1087')
      record.setVerified(true)
      record.set('name', 'Admin Comercial')
      app.save(record)
    }

    // Update API Rules to allow authenticated users to list/view/delete, and public to create
    const collectionsToUpdate = ['candidatos', 'leads', 'leads_erp', 'leads_certificados']
    for (const name of collectionsToUpdate) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = "@request.auth.id != ''"
        col.viewRule = "@request.auth.id != ''"
        col.createRule = ''
        col.updateRule = "@request.auth.id != ''"
        col.deleteRule = "@request.auth.id != ''"
        app.save(col)
      } catch (e) {
        console.log(`Collection ${name} not found, skipping rule update.`)
      }
    }
  },
  (app) => {
    // Optional revert logic
  },
)
