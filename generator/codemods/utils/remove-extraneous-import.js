/**
 * Note:
 * here we don't completely remove the import declaration statement
 * if all import specifiers are removed.
 * For example, `import foo from 'bar'`,
 * if `foo` is unused, the statement would become `import 'bar'`.
 * It is because we are not sure if the module contains any side effects.
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function removeExtraneousImport({ root, j }, name) {
  const usages = root.find(j.Identifier, { name }).filter(identifierPath => {
    const parent = identifierPath.parent.node

    // Ignore the import specifier
    if (
      j.ImportDefaultSpecifier.check(parent) ||
      j.ImportSpecifier.check(parent)
    ) {
      return false
    }

    // Ignore properties in MemberExpressions
    if (
      j.MemberExpression.check(parent) &&
      parent.property === identifierPath.node
    ) {
      return false
    }

    // Ignore keys in ObjectProperties
    if (
      j.ObjectProperty.check(parent) &&
      parent.key === identifierPath.node &&
      parent.value !== identifierPath.node
    ) {
      return false
    }

    return true
  })

  if (!usages.length) {
    let specifier = root.find(j.ImportSpecifier, {
      local: {
        name
      }
    })
    if (!specifier.length) {
      specifier = root.find(j.ImportDefaultSpecifier, {
        local: {
          name
        }
      })
    }

    if (!specifier.length) {
      return
    }

    const decl = specifier.closest(j.ImportDeclaration)
    const declNode = decl.get(0).node
    const peerSpecifiers = declNode.specifiers
    const source = declNode.source.value

    // these modules are known to have no side effects
    const safelyRemovableModules = ['vue', 'vue-router', 'vuex']
    if (
      peerSpecifiers.length === 1 &&
      safelyRemovableModules.includes(source)
    ) {
      decl.remove()
    } else {
      // otherwise, only remove the specifier
      specifier.remove()
    }
  }
}
