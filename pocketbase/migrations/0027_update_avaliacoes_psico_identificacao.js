migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')

    if (!col.fields.getByName('empresa')) {
      col.fields.add(new TextField({ name: 'empresa' }))
    }
    if (!col.fields.getByName('departamento')) {
      col.fields.add(new TextField({ name: 'departamento' }))
    }
    if (!col.fields.getByName('cargo')) {
      col.fields.add(new TextField({ name: 'cargo' }))
    }
    if (!col.fields.getByName('tempo_empresa')) {
      col.fields.add(new NumberField({ name: 'tempo_empresa' }))
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')
    col.fields.removeByName('empresa')
    col.fields.removeByName('departamento')
    col.fields.removeByName('cargo')
    col.fields.removeByName('tempo_empresa')
    app.save(col)
  },
)
