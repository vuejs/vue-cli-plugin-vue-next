/** @type {import('jscodeshift').Transform} */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  const context = { j, root }

  require('./create-app-mount')(context)
  require('./root-option-to-use')(context, 'store')
  require('./root-option-to-use')(context, 'router')
  require('./remove-trivial-root')(context)
  require('./remove-production-tip')(context)
  require('./remove-vue-use')(context)
  require('./remove-contextual-h')(context)

  // remove extraneous imports
  removeExtraneousImport(context, 'Vue')
  removeExtraneousImport(context, 'Vuex')
  removeExtraneousImport(context, 'VueRouter')

  return root.toSource({ lineTerminator: '\n' })
}

/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
function removeExtraneousImport({ root, j }, name) {
  const localUsages = root.find(j.Identifier, { name })
  if (localUsages.length === 1) {
    const importDecl = localUsages.closest(j.ImportDeclaration)
    
    if (!importDecl.length) {
      return
    }

    if (importDecl.get(0).node.specifiers.length === 1) {
      importDecl.remove()
    } else {
      localUsages.closest(j.ImportSpecifier).remove()
      localUsages.closest(j.ImportDefaultSpecifier).remove()
    }
  }
}
