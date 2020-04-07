/**
 * It is expected to be run after the `createApp` transformataion
 * if a root component is trivial, that is, it contains only one simple prop,
 * like `{ render: h => h(App) }`, then just use the `App` variable
 *
 * TODO: implement `remove-trivial-render`,
 * move all other rootProps to the second argument of `createApp`
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function removeTrivialRoot({ j, root }) {
  const appRoots = root.find(j.CallExpression, {
    callee: { name: 'createApp' },
    arguments: args => args.length === 1 && args[0].type === 'ObjectExpression'
  })
  appRoots.forEach(({ node: createAppCall }) => {
    const { properties } = createAppCall.arguments[0]
    if (
      properties.length === 1 &&
      properties[0].key.name === 'render' &&
      j.ArrowFunctionExpression.check(properties[0].value)
    ) {
      const renderFnBody = properties[0].value.body
      const isTrivial =
        j.CallExpression.check(renderFnBody) &&
        renderFnBody.arguments.length === 1
      if (isTrivial) {
        createAppCall.arguments[0] = renderFnBody.arguments[0]
      }
    }
  })
}
