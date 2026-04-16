migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('leads_parceiros')
    col.fields.add(new TextField({ name: 'profissao_ocupacao' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('leads_parceiros')
    col.fields.removeByName('profissao_ocupacao')
    app.save(col)
  },
)
