/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function createAppMount(context) {
  const { j, root } = context

  // Vue.version
  const versionCalls = root.find(j.MemberExpression, n => {
    return (
      n.property.name === 'version' &&
      n.object.name === 'Vue'
    )
  })

  if (!versionCalls.length) {
    return
  }

  const addImport = require('../utils/add-import')
  addImport(context, { imported: 'version' }, 'vue')

  versionCalls.replaceWith(({ node }) => {
    const property = node.property.name

    return j.identifier(property)
  })
}
