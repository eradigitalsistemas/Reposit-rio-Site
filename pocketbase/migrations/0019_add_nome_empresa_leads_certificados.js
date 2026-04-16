migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('leads_certificados')
    if (!col.fields.getByName('nome')) {
      col.fields.add(new TextField({ name: 'nome' }))
    }
    if (!col.fields.getByName('empresa')) {
      col.fields.add(new TextField({ name: 'empresa' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('leads_certificados')
    col.fields.removeByName('nome')
    col.fields.removeByName('empresa')
    app.save(col)
  },
)
