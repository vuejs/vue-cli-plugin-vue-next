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

  const defaultObject = root
    .find(j.ExportDefaultDeclaration)
    .at(0)
    .find(j.ObjectExpression)
    .at(0)

  let oldEmits = emits
  let emitsProperty = defaultObject.find(j.ObjectProperty, {
    key: {
      type: 'Identifier',
      name: 'emits'
    }
  })
  if (emitsProperty.length > 0) {
    oldEmits = emitsProperty
      .at(0)
      .get()
      .node.value.elements.map(el => el.value)

    let hasChange = false
    for (const el of emits) {
      if (!oldEmits.includes(el)) {
        oldEmits.push(el)
        hasChange = true
      }
    }
    if (!hasChange) {
      return
    }
    emitsProperty.remove()
  }

  defaultObject.replaceWith(({ node }) => {
    node.properties.unshift(
      j.objectProperty(
        j.identifier('emits'),
        j.arrayExpression(oldEmits.map(el => j.stringLiteral(el)))
      )
    )
    return node
  })
}
