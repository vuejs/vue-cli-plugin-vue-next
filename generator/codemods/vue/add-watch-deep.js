/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function addEmitDeclaration(context) {
  const { j, root } = context

  // this.$watch(...) add deep option
  const this$watches = root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: { type: 'ThisExpression' },
      property: {
        type: 'Identifier',
        name: '$watch'
      }
    }
  })

  for (let i = 0; i < this$watches.length; i++) {
    const watchFunc = this$watches.at(i)
    const deepProperty = watchFunc.find(j.ObjectProperty, {
      key: {
        type: 'Identifier',
        name: 'deep'
      }
    })
    if (deepProperty.length > 0) {
      continue
    }
    const args = watchFunc.get().node.arguments
    if (args.length < 2) {
      continue
    }
    if (args[1].type != 'ObjectExpression') {
      if (args.length < 3) {
        watchFunc.replaceWith(nodePath => {
          nodePath.node.arguments.push(j.objectExpression([]))
          return nodePath.node
        })
      }
      const target = watchFunc.find(j.ObjectExpression).at(0)
      target.replaceWith(nodePath => {
        nodePath.node.properties.push(
          j.objectProperty(j.identifier('deep'), j.booleanLiteral(true))
        )
        return nodePath.node
      })
    }
  }

  // watch: {...} add deep option
  const watchFuncs = root
    .find(j.ExportDefaultDeclaration)
    .at(0)
    .find(j.ObjectExpression)
    .at(0)
    .find(j.ObjectProperty, {
      key: {
        type: 'Identifier',
        name: 'watch'
      }
    })
    .at(0)
    .find(j.ObjectExpression)
    .at(0)
    .find(j.ObjectProperty)

  for (let i = 0; i < watchFuncs.length; i++) {
    const watchProperty = watchFuncs.at(i)
    if (!inExportDefaultLevel(watchProperty, 2)) {
      continue
    }
    const deepProperty = watchProperty.find(j.ObjectProperty, {
      key: {
        type: 'Identifier',
        name: 'deep'
      }
    })
    if (deepProperty.length > 0) {
      continue
    }

    if (watchProperty.get().node.value.type === 'ObjectExpression') {
      const target = watchProperty.find(j.ObjectExpression).at(0)
      target.replaceWith(nodePath => {
        nodePath.node.properties.push(
          j.objectProperty(j.identifier('deep'), j.booleanLiteral(true))
        )
        return nodePath.node
      })
    } else {
      watchProperty.replaceWith(nodePath => {
        nodePath.node.value = j.objectExpression([
          j.objectProperty(j.identifier('handler'), nodePath.node.value),
          j.objectProperty(j.identifier('deep'), j.booleanLiteral(true))
        ])
        return nodePath.node
      })
    }
  }
}

function getExportDefaultLevel(collection) {
  let path = collection.get()
  let level = 0
  while (path) {
    if (path.node.type === 'ExportDefaultDeclaration') {
      return level
    }
    path = path.parentPath
    level++
  }
  return -1
}

function inExportDefaultLevel(collection, level) {
  const lvl = getExportDefaultLevel(collection)
  if (level * 3 === lvl) {
    return true
  }
  return false
}
