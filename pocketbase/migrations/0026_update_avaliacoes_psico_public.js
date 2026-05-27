migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')

    // Update create rule to public
    col.createRule = ''

    // Make user_id optional
    const userIdField = col.fields.getByName('user_id')
    if (userIdField) {
      userIdField.required = false
    }

    // Add guest fields
    if (!col.fields.getByName('nome')) {
      col.fields.add(new TextField({ name: 'nome' }))
    }
    if (!col.fields.getByName('email')) {
      col.fields.add(new EmailField({ name: 'email' }))
    }
    if (!col.fields.getByName('telefone')) {
      col.fields.add(new TextField({ name: 'telefone' }))
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')

    col.createRule = "@request.auth.id != ''"

    const userIdField = col.fields.getByName('user_id')
    if (userIdField) {
      userIdField.required = true
    }

    col.fields.removeByName('nome')
    col.fields.removeByName('email')
    col.fields.removeByName('telefone')

    app.save(col)
  },
)
