migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!users.fields.getByName('telefone')) {
      users.fields.add(new TextField({ name: 'telefone', required: true }))
    }
    if (!users.fields.getByName('data_nascimento')) {
      users.fields.add(new DateField({ name: 'data_nascimento' }))
    }
    if (!users.fields.getByName('endereco')) {
      users.fields.add(new TextField({ name: 'endereco' }))
    }

    users.addIndex('idx_users_created_at', false, 'created', '')

    app.save(users)

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'juniorsfco@hotmail.com')
    } catch (_) {
      const record = new Record(users)
      record.setEmail('juniorsfco@hotmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin')
      record.set('telefone', '0000000000')
      app.save(record)
    }
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    users.removeIndex('idx_users_created_at')

    if (users.fields.getByName('telefone')) {
      users.fields.removeByName('telefone')
    }
    if (users.fields.getByName('data_nascimento')) {
      users.fields.removeByName('data_nascimento')
    }
    if (users.fields.getByName('endereco')) {
      users.fields.removeByName('endereco')
    }
    app.save(users)

    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'juniorsfco@hotmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
