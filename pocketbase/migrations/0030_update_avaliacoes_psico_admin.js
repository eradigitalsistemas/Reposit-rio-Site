migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')
    col.listRule = "@request.auth.id != ''"
    col.viewRule = "@request.auth.id != ''"
    col.updateRule = "@request.auth.id != ''"
    col.deleteRule = "@request.auth.id != ''"
    col.addIndex('idx_avaliacoes_psico_cnpj', false, 'cnpj', '')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('avaliacoes_psicossociais')
    col.listRule = 'user_id = @request.auth.id'
    col.viewRule = 'user_id = @request.auth.id'
    col.updateRule = 'user_id = @request.auth.id'
    col.deleteRule = null
    app.save(col)
  },
)
