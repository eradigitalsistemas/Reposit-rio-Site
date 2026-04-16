migrate(
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')
    if (!leads.fields.getByName('email_sent')) {
      leads.fields.add(new BoolField({ name: 'email_sent' }))
    }
    app.save(leads)

    const leadsCert = app.findCollectionByNameOrId('leads_certificados')
    if (!leadsCert.fields.getByName('email_sent')) {
      leadsCert.fields.add(new BoolField({ name: 'email_sent' }))
    }
    app.save(leadsCert)
  },
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')
    if (leads.fields.getByName('email_sent')) {
      leads.fields.removeByName('email_sent')
    }
    app.save(leads)

    const leadsCert = app.findCollectionByNameOrId('leads_certificados')
    if (leadsCert.fields.getByName('email_sent')) {
      leadsCert.fields.removeByName('email_sent')
    }
    app.save(leadsCert)
  },
)
