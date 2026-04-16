migrate(
  (app) => {
    const collection = new Collection({
      name: 'candidatos',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'nome', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'telefone', type: 'text' },
        { name: 'formacoes', type: 'json' },
        { name: 'experiencias', type: 'json' },
        { name: 'curriculo_url', type: 'text' },
        { name: 'disc_respondido', type: 'bool' },
        { name: 'disc_resultado', type: 'json' },
        { name: 'status', type: 'text' },
        { name: 'origem', type: 'text' },
        { name: 'empresa_id', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_candidatos_email ON candidatos (email)',
        'CREATE INDEX idx_candidatos_status ON candidatos (status)',
        'CREATE INDEX idx_candidatos_empresa ON candidatos (empresa_id)',
      ],
    })

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('candidatos')
    app.delete(collection)
  },
)
