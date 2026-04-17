migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('candidatos')

    // Increase limits significantly for text fields
    if (col.fields.getByName('resumo_profissional')) {
      col.fields.add(new TextField({ name: 'resumo_profissional', max: 10000000 }))
    }
    if (col.fields.getByName('endereco')) {
      col.fields.add(new TextField({ name: 'endereco', max: 10000000 }))
    }
    if (col.fields.getByName('curriculo_url')) {
      col.fields.add(new TextField({ name: 'curriculo_url', max: 10000000 }))
    }
    if (col.fields.getByName('foto_url')) {
      col.fields.add(new TextField({ name: 'foto_url', max: 10000000 }))
    }

    // Increase limits significantly for JSON fields
    if (col.fields.getByName('formacoes')) {
      col.fields.add(new JSONField({ name: 'formacoes', maxSize: 10000000 }))
    }
    if (col.fields.getByName('experiencias')) {
      col.fields.add(new JSONField({ name: 'experiencias', maxSize: 10000000 }))
    }
    if (col.fields.getByName('disc_resultado')) {
      col.fields.add(new JSONField({ name: 'disc_resultado', maxSize: 10000000 }))
    }
    if (col.fields.getByName('soft_skills')) {
      col.fields.add(new JSONField({ name: 'soft_skills', maxSize: 10000000 }))
    }
    if (col.fields.getByName('hard_skills')) {
      col.fields.add(new JSONField({ name: 'hard_skills', maxSize: 10000000 }))
    }
    if (col.fields.getByName('cursos_adicionais')) {
      col.fields.add(new JSONField({ name: 'cursos_adicionais', maxSize: 10000000 }))
    }
    if (col.fields.getByName('idiomas')) {
      col.fields.add(new JSONField({ name: 'idiomas', maxSize: 10000000 }))
    }

    app.save(col)
  },
  (app) => {
    // Revert not strictly necessary as we are just expanding limits
  },
)
