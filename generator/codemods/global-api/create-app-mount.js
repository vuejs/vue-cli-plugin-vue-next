/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function createAppMount(context) {
  const { j, root } = context

  // new Vue(...).$mount()
  const mountCalls = root.find(j.CallExpression, n => {
    return (
      n.callee.type === 'MemberExpression' &&
      n.callee.property.name === '$mount' &&
      n.callee.object.type === 'NewExpression' &&
      n.callee.object.callee.name === 'Vue'
    )
  })

  mountCalls.replaceWith(({ node }) => {
    let options = node.callee.object.arguments[0]
    const el = node.arguments[0]

    return j.callExpression(
      j.memberExpression(
        j.callExpression(j.identifier('createApp'), [options]),
        j.identifier('mount')
      ),
      [el]
    )
  })
}
