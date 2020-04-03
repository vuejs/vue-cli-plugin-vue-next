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

    // if it's a simple option, like `{ render: h => h(App) }`,
    // then just use the App variable
    if (
      options.properties.length === 1 &&
      options.properties[0].key.name === 'render' &&
      options.properties[0].value.type === 'ArrowFunctionExpression' &&
      options.properties[0].value.body.type === 'CallExpression'
    ) {
      options = options.properties[0].value.body.arguments[0]
    } else {
      // replace `render: h => h(App)` with `render: () => h(App)
      // and add an `h` import
      const renderFn = options.properties.find(p => p.key.name === 'render' && p.value.type === 'ArrowFunctionExpression')
      if (renderFn) {
        const addImport = require('./utilities/add-import')
        addImport(context, { imported: 'h' }, 'vue')

        // remove the `h` parameter
        renderFn.value.params.shift()
      }
    }

    return j.callExpression(
      j.memberExpression(
        j.callExpression(j.identifier('createApp'), [options]),
        j.identifier('mount')
      ),
      [el]
    )
  })
}
