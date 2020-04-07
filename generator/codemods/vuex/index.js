const addImport = require('../utils/add-import')
const removeExtraneousImport = require('../utils/remove-extraneous-import')

// new Store() -> createStore()
/** @type {import('jscodeshift').Transform} */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  const context = { j, root }

  const vuexImportDecls = root.find(j.ImportDeclaration, {
    source: {
      value: 'vuex'
    }
  })

  const importedVuex = vuexImportDecls.find(j.ImportDefaultSpecifier)
  const importedStore = vuexImportDecls.find(j.ImportSpecifier, {
    imported: {
      name: 'Store'
    }
  })

  if (importedVuex.length) {
    const localVuex = importedVuex.get(0).node.local.name
    const newVuexDotStore = root.find(j.NewExpression, {
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: localVuex
        },
        property: {
          name: 'Store'
        }
      }
    })

    newVuexDotStore.replaceWith(({ node }) => {
      return j.callExpression(
        j.memberExpression(
          j.identifier(localVuex),
          j.identifier('createStore')
        ),
        node.arguments
      )
    })
  }

  if (importedStore.length) {
    const localStore = importedStore.get(0).node.local.name
    const newStore = root.find(j.NewExpression, {
      callee: {
        type: 'Identifier',
        name: localStore
      }
    })

    addImport(context, { imported: 'createStore' }, 'vuex')
    newStore.replaceWith(({ node }) => {
      return j.callExpression(j.identifier('createStore'), node.arguments)
    })
    removeExtraneousImport(context, localStore)
  }

  return root.toSource({ lineTerminator: '\n' })
}

module.exports.parser = 'babylon'
