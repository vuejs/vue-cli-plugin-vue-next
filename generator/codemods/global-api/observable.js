/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function createAppMount(context) {
  const { j, root } = context

  // Vue.observable(state)
  const observableCalls = root.find(j.CallExpression, n => {
    return (
      n.callee.type === 'MemberExpression' &&
      n.callee.property.name === 'observable' &&
      n.callee.object.name === 'Vue'
    )
  })

  if (!observableCalls.length) {
    return
  }

  const addImport = require('../utils/add-import')
  addImport(context, { imported: 'reactive' }, 'vue')

  observableCalls.replaceWith(({ node }) => {
    const el = node.arguments[0]

    return j.callExpression(j.identifier('reactive'), [el])
  })
}
