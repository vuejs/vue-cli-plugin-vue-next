/**
 * Expected to be run after the `createApp` transformation.
 * Transforms expressions like `createApp({ router })` to `createApp().use(router)`
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function rootOptionToUse(context, rootOptionName) {
  const { j, root } = context

  const appRoots = root.find(j.CallExpression, {
    callee: { name: 'createApp' },
    arguments: args =>
      args.length === 1 &&
      args[0].type === 'ObjectExpression' &&
      args[0].properties.find(p => p.key.name === rootOptionName)
  })

  appRoots.replaceWith(({ node: createAppCall }) => {
    const rootOptions = createAppCall.arguments[0]
    const propertyIndex = rootOptions.properties.findIndex(
      p => p.key.name === rootOptionName
    )
    const [{ value: pluginInstance }] = rootOptions.properties.splice(
      propertyIndex,
      1
    )

    return j.callExpression(
      j.memberExpression(
        j.callExpression(j.identifier('createApp'), [rootOptions]),
        j.identifier('use')
      ),
      [pluginInstance]
    )
  })
}
