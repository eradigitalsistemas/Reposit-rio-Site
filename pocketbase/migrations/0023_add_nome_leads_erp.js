migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('leads_erp')
    if (!col.fields.getByName('nome')) {
      col.fields.add(new TextField({ name: 'nome' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('leads_erp')
    col.fields.removeByName('nome')
    app.save(col)
  },
)
