const addImport = require('../utils/add-import')
const removeExtraneousImport = require('../utils/remove-extraneous-import')

/** @type {import('jscodeshift').Transform} */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  const context = { j, root }

  // new Router() -> createRouter()
  const routerImportDecls = root.find(j.ImportDeclaration, {
    source: {
      value: 'vue-router'
    }
  })

  const importedVueRouter = routerImportDecls.find(j.ImportDefaultSpecifier)
  if (importedVueRouter.length) {
    const localVueRouter = importedVueRouter.get(0).node.local.name

    const newVueRouter = root.find(j.NewExpression, {
      callee: {
        type: 'Identifier',
        name: localVueRouter
      }
    })

    addImport(context, { imported: 'createRouter' }, 'vue-router')
    newVueRouter.replaceWith(({ node }) => {
      // mode: 'history' -> history: createWebHistory(), etc
      node.arguments[0].properties = node.arguments[0].properties.map(p => {
        if (p.key.name === 'mode') {
          const mode = p.value.value
          let initializer
          if (mode === 'hash') {
            initializer = 'createWebHashHistory'
          } else if (mode === 'history') {
            initializer = 'createWebHistory'
          } else if (mode === 'abstract') {
            initializer = 'createMemoryHistory'
          } else {
            console.error(
              `mode must be one of 'hash', 'history', or 'abstract'`
            )
            return p
          }

          addImport(context, { imported: initializer }, 'vue-router')
          return j.objectProperty(
            j.identifier('history'),
            j.callExpression(j.identifier(initializer), [])
          )
        }

        return p
      })

      return j.callExpression(j.identifier('createRouter'), node.arguments)
    })
    removeExtraneousImport(context, localVueRouter)
  }

  return root.toSource({ lineTerminator: '\n' })
}

module.exports.parser = 'babylon'
