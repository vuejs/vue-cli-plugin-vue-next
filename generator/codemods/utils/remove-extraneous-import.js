/**
 * Note:
 * here we don't completely remove the import declaration statement
 * if all import specifiers are removed.
 * For example, `import Vue from 'vue'`,
 * if `Vue` is unused, the statement would become `import 'vue'`.
 * It is because we are not sure if the module contains any side effects.
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function removeExtraneousImport({ root, j }, name) {
  const isPathEqual = (path1, path2) => {
    return (
      path1.node.start === path2.node.start && path1.node.end === path2.node.end
    )
  }
  /**
   * @param {import('jscodeshift').ASTPath} path
   */
  function filterAndRemoveImports(path) {
    const usages = j(path)
      .closestScope()
      .find(j.Identifier, { name })
      // Ignore the specifier
      .filter(identifierPath => {
        const parent = identifierPath.parent.node
        return (
          !j.ImportDefaultSpecifier.check(parent) &&
          !j.ImportSpecifier.check(parent)
        )
      })
      // Ignore properties in MemberExpressions
      .filter(identifierPath => {
        const parent = identifierPath.parent.node
        return !(
          j.MemberExpression.check(parent) &&
          parent.property === identifierPath.node
        )
      })

    if (!usages.length) {
      j(path).remove()
    }
  }

  root
    .find(j.ImportSpecifier, {
      local: {
        name
      }
    })
    .filter(filterAndRemoveImports)

  root
    .find(j.ImportDefaultSpecifier, {
      local: {
        name
      }
    })
    .filter(filterAndRemoveImports)
}
