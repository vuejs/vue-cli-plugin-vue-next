/** @type {import('jscodeshift').Transform} */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  const context = { j, root }

  const addImport = require('./utilities/add-import')
  addImport(context, { imported: 'createApp' }, 'vue')

  require('./create-app-mount')(context)
  require('./vuex')(context)
  require('./router')(context)
  require('./remove-trivial-root')(context)
  require('./remove-production-tip')(context)
  require('./remove-contextual-h')(context)

  // remove extraneous Vue import
  const localVueUsages = root.find(j.Identifier, { name: 'Vue' })
  if (localVueUsages.length === 1) {
    localVueUsages.closest(j.ImportDefaultSpecifier).remove()
  }

  return root.toSource({ lineTerminator: '\n' })
}
