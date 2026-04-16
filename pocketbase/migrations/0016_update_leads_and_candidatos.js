migrate(
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')
    leads.fields.add(new TextField({ name: 'tipo' }))
    leads.fields.add(new TextField({ name: 'empresa' }))
    leads.fields.add(new TextField({ name: 'mensagem' }))
    app.save(leads)

    const candidatos = app.findCollectionByNameOrId('candidatos')
    candidatos.fields.add(new TextField({ name: 'endereco' }))
    candidatos.fields.add(new DateField({ name: 'data_nascimento' }))
    app.save(candidatos)
  },
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')
    leads.fields.removeByName('tipo')
    leads.fields.removeByName('empresa')
    leads.fields.removeByName('mensagem')
    app.save(leads)

    const candidatos = app.findCollectionByNameOrId('candidatos')
    candidatos.fields.removeByName('endereco')
    candidatos.fields.removeByName('data_nascimento')
    app.save(candidatos)
  },
)
