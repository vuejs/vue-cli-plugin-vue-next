/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function createAppMount(context) {
  const { j, root } = context

  // new Vue(...).$mount()
  const mountCalls = root.find(j.ExpressionStatement, {
    expression: {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'NewExpression',
          callee: {
            type: 'Identifier',
            name: 'Vue'
          }
        },
        property: { type: 'Identifier', name: '$mount' }
      }
    }
  })

  if (!mountCalls.length) {
    return
  }

  const addImport = require('../utils/add-import')
  addImport(context, { imported: 'createApp' }, 'vue')

  const rootProps = mountCalls.at(0).get().node.expression.callee.object
    .arguments
  mountCalls.insertBefore(
    j.variableDeclaration('const', [
      j.variableDeclarator(
        j.identifier('app'),
        j.callExpression(j.identifier('createApp'), rootProps)
      )
    ])
  )

  const args = mountCalls.at(0).get().node.expression.arguments
  mountCalls.insertBefore(
    j.expressionStatement(
      j.callExpression(
        j.memberExpression(j.identifier('app'), j.identifier('mount'), false),
        args
      )
    )
  )

  mountCalls.remove()
}
