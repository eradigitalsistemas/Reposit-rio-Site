migrate(
  (app) => {
    const collection = new Collection({
      name: 'leads_erp',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'email', type: 'email', required: true },
        { name: 'empresa', type: 'text' },
        { name: 'telefone', type: 'text' },
        { name: 'data_contato', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('leads_erp')
    app.delete(collection)
  },
)
