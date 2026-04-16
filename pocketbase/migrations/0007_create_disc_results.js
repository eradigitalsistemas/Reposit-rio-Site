migrate(
  (app) => {
    const collection = new Collection({
      name: 'disc_results',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: '',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: false,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'tipo_perfil', type: 'text', required: false },
        { name: 'pontuacao_d', type: 'number', required: false },
        { name: 'pontuacao_i', type: 'number', required: false },
        { name: 'pontuacao_s', type: 'number', required: false },
        { name: 'pontuacao_c', type: 'number', required: false },
        { name: 'data_teste', type: 'date', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('disc_results')
    app.delete(collection)
  },
)
