/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function addEmitDeclaration(context) {
  const { j, root } = context

  // this.$emit('xxx') => emits: ['xxx']
  const this$emits = root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: { type: 'ThisExpression' },
      property: {
        type: 'Identifier',
        name: '$emit'
      }
    }
  })

  const emits = []
  for (let i = 0; i < this$emits.length; i++) {
    const arg = this$emits.at(i).get().node.arguments[0]
    if (arg.type === 'StringLiteral') {
      emits.push(arg.value)
    }
  }

  if (emits.length === 0) {
    return
  }

  const properties = root
    .find(j.ExportDefaultDeclaration)
    .at(0)
    .find(j.ObjectExpression)
    .at(0)

  properties.replaceWith(nodePath => {
    nodePath.node.properties.unshift(
      j.objectProperty(
        j.identifier('emits'),
        j.arrayExpression(emits.map(el => j.stringLiteral(el)))
      )
    )
    return nodePath.node
  })
}
