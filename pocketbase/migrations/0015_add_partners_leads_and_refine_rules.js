migrate(
  (app) => {
    const leadsParceiros = new Collection({
      name: 'leads_parceiros',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '',
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'nome_empresa', type: 'text' },
        { name: 'telefone', type: 'text' },
        { name: 'mensagem', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(leadsParceiros)

    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'comercial@areradigital.com.br')
    } catch (_) {
      const record = new Record(users)
      record.setEmail('comercial@areradigital.com.br')
      record.setPassword('Raimundo1087')
      record.setVerified(true)
      record.set('name', 'Admin Comercial')
      app.save(record)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('leads_parceiros')
      app.delete(col)
    } catch (_) {}

    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'comercial@areradigital.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
