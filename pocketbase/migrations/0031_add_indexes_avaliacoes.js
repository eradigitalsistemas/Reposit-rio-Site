migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')
    col.addIndex('idx_avaliacoes_psico_status', false, 'status', '')
    col.addIndex('idx_avaliacoes_psico_cnpj', false, 'cnpj', '')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')
    col.removeIndex('idx_avaliacoes_psico_status')
    col.removeIndex('idx_avaliacoes_psico_cnpj')
    app.save(col)
  },
)
