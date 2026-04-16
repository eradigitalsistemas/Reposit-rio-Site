migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('certificados')

    const seedData = [
      {
        title: 'Web Development Master',
        description: 'Complete course on modern web technologies.',
        benefits: 'Portfolio project, Mentorship',
      },
      {
        title: 'UI/UX Design Specialist',
        description: 'Advanced interface design and user experience research.',
        benefits: 'Design tools access, Community group',
      },
      {
        title: 'Cloud Architecture',
        description: 'Deploying and scaling applications in the cloud.',
        benefits: 'Certification exam voucher',
      },
    ]

    for (const item of seedData) {
      try {
        app.findFirstRecordByData('certificados', 'title', item.title)
      } catch (_) {
        const record = new Record(col)
        record.set('title', item.title)
        record.set('description', item.description)
        record.set('benefits', item.benefits)
        app.save(record)
      }
    }
  },
  (app) => {
    try {
      const records = app.findRecordsByFilter('certificados', "title != ''", '', 100, 0)
      for (const record of records) {
        app.delete(record)
      }
    } catch (_) {}
  },
)
