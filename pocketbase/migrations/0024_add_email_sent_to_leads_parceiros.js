migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('leads_parceiros')
    if (!col.fields.getByName('email_sent')) {
      col.fields.add(new BoolField({ name: 'email_sent' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('leads_parceiros')
    col.fields.removeByName('email_sent')
    app.save(col)
  },
)
