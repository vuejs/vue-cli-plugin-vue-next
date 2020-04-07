/** @type {import('jscodeshift').Transform} */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  const context = { j, root }

  require('./create-app-mount')(context)
  require('./root-prop-to-use')(context, 'store')
  require('./root-prop-to-use')(context, 'router')
  require('./remove-trivial-root')(context)
  require('./remove-production-tip')(context)
  require('./remove-vue-use')(context)
  require('./remove-contextual-h')(context)

  // remove extraneous imports
  const removeExtraneousImport = require('../utils/remove-extraneous-import')
  removeExtraneousImport(context, 'Vue')
  removeExtraneousImport(context, 'Vuex')
  removeExtraneousImport(context, 'VueRouter')

  return root.toSource({ lineTerminator: '\n' })
}

module.exports.parser = 'babylon'
