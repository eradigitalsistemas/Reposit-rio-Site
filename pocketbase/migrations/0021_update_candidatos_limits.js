migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('candidatos')

    if (col.fields.getByName('resumo_profissional')) {
      col.fields.add(new TextField({ name: 'resumo_profissional', max: 0 }))
    }
    if (col.fields.getByName('endereco')) {
      col.fields.add(new TextField({ name: 'endereco', max: 0 }))
    }
    if (col.fields.getByName('curriculo_url')) {
      col.fields.add(new TextField({ name: 'curriculo_url', max: 0 }))
    }
    if (col.fields.getByName('foto_url')) {
      col.fields.add(new TextField({ name: 'foto_url', max: 0 }))
    }

    app.save(col)
  },
  (app) => {
    // Revert not strictly necessary as we are just removing constraints
  },
)
