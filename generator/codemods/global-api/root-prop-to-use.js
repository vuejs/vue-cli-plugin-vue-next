/**
 * Expected to be run after the `createApp` transformation.
 * Transforms expressions like `createApp({ router })` to `createApp().use(router)`
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function rootPropToUse(context, rootPropName) {
  const { j, root } = context

  const appRoots = root.find(j.CallExpression, {
    callee: { name: 'createApp' },
    arguments: args =>
      args.length === 1 &&
      args[0].type === 'ObjectExpression' &&
      args[0].properties.find(p => p.key.name === rootPropName)
  })

  appRoots.replaceWith(({ node: createAppCall }) => {
    const rootProps = createAppCall.arguments[0]
    const propertyIndex = rootProps.properties.findIndex(
      p => p.key.name === rootPropName
    )
    const [{ value: pluginInstance }] = rootProps.properties.splice(
      propertyIndex,
      1
    )

    return j.callExpression(
      j.memberExpression(
        j.callExpression(j.identifier('createApp'), [rootProps]),
        j.identifier('use')
      ),
      [pluginInstance]
    )
  })
}
