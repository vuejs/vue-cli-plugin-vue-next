/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function createAppMount(context) {
  const { j, root } = context

  // Vue.nextTick(() => {})
  const nextTickCalls = root.find(j.CallExpression, n => {
    return (
      n.callee.type === 'MemberExpression' &&
      n.callee.property.name === 'nextTick' &&
      n.callee.object.name === 'Vue'
    )
  })

  if (!nextTickCalls.length) {
    return
  }

  const addImport = require('../utils/add-import')
  addImport(context, { imported: 'nextTick' }, 'vue')

  nextTickCalls.replaceWith(({ node }) => {
    const el = node.arguments[0]

    return j.callExpression(j.identifier('nextTick'), [el])
  })
}
