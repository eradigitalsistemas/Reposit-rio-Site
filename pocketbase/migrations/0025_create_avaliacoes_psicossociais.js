migrate(
  (app) => {
    const collection = new Collection({
      name: 'avaliacoes_psicossociais',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'user_id = @request.auth.id',
      deleteRule: null,
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'respostas',
          type: 'json',
        },
        {
          name: 'status',
          type: 'text',
        },
        {
          name: 'data_conclusao',
          type: 'date',
        },
        {
          name: 'pontuacao_geral',
          type: 'number',
        },
        {
          name: 'observacoes_admin',
          type: 'text',
        },
        {
          name: 'created',
          type: 'autodate',
          onCreate: true,
          onUpdate: false,
        },
        {
          name: 'updated',
          type: 'autodate',
          onCreate: true,
          onUpdate: true,
        },
      ],
      indexes: [
        'CREATE INDEX idx_avaliacoes_psico_user_id ON avaliacoes_psicossociais (user_id)',
        'CREATE INDEX idx_avaliacoes_psico_status ON avaliacoes_psicossociais (status)',
      ],
    })

    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('avaliacoes_psicossociais')
      app.delete(collection)
    } catch (_) {
      // silently ignore if it doesn't exist
    }
  },
)
