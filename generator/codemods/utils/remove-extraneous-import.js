/**
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
function removeExtraneousImport({ root, j }, name) {
  const localUsages = root.find(j.Identifier, { name })
  if (localUsages.length === 1) {
    const importDecl = localUsages.closest(j.ImportDeclaration)
    
    if (!importDecl.length) {
      return
    }

    if (importDecl.get(0).node.specifiers.length === 1) {
      importDecl.remove()
    } else {
      localUsages.closest(j.ImportSpecifier).remove()
      localUsages.closest(j.ImportDefaultSpecifier).remove()
    }
  }
}
