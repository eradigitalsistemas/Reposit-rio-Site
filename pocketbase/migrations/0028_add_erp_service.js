migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('services')

    try {
      app.findFirstRecordByData('services', 'title', 'Sistemas ERP')
      // already exists
    } catch (_) {
      const record = new Record(collection)
      record.set('title', 'Sistemas ERP')
      record.set(
        'description',
        'Soluções integradas de gestão empresarial para otimizar processos, aumentar a produtividade e garantir o controle total do seu negócio.',
      )
      record.set('icon_name', 'layout-dashboard')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('services', 'title', 'Sistemas ERP')
      app.delete(record)
    } catch (_) {}
  },
)
