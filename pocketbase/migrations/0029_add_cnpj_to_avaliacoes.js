migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')
    if (!col.fields.getByName('cnpj')) {
      col.fields.add(new TextField({ name: 'cnpj' }))
    }
    col.addIndex('idx_avaliacoes_psico_cnpj', false, 'cnpj', '')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')
    if (col.fields.getByName('cnpj')) {
      col.fields.removeByName('cnpj')
    }
    col.removeIndex('idx_avaliacoes_psico_cnpj')
    app.save(col)
  },
)
