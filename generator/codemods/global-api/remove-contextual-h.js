const addImport = require('./utilities/add-import')

/**
 * replace `render: h => h(App)` with `render: () => h(App)
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function removeContextualH (context) {
  const { j, root } = context
  
  const renderFns = (root.find(j.Property, {
    key: {
      name: 'render'
    },
    value: {
      type: 'ArrowFunctionExpression'
    }
  }))
  if (renderFns.length) {
    addImport(context, { imported: 'h' }, 'vue')
    renderFns.forEach(({ node }) => {
      node.value.params.shift()
    })
  }

  // TODO: render methods
}
