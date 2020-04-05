// specifier should be in the form of `Vue` or `{ imported: 'h' }` or `{ imported: 'h', local: 'createElement' }`
module.exports = function addImport(context, specifier, source) {
  const { j, root } = context

  const isDefaultImport = typeof specifier === 'string'
  const localName = isDefaultImport
    ? specifier
    : specifier.local || specifier.imported

  const duplicate = root.find(j.ImportDeclaration, {
    specifiers: arr => arr.some(s => s.local.name === localName),
    source: {
      value: source
    }
  })
  if (duplicate.length) {
    return
  }

  let newImportSpecifier
  if (isDefaultImport) {
    newImportSpecifier = j.importDefaultSpecifier(j.identifier(specifier))
  } else {
    newImportSpecifier = j.importSpecifier(
      j.identifier(specifier.imported),
      j.identifier(specifier.local || specifier.imported)
    )
  }

  const matchedDecl = root.find(j.ImportDeclaration, {
    source: {
      value: source
    }
  })
  if (matchedDecl.length) {
    // add new specifier to the existing import declaration
    matchedDecl.get(0).node.specifiers.push(newImportSpecifier)
  } else {
    const newImportDecl = j.importDeclaration(
      [newImportSpecifier],
      j.stringLiteral(source)
    )

    const lastImportDecl = root.find(j.ImportDeclaration).at(-1)
    if (lastImportDecl.length) {
      // add the new import declaration after all other import declarations
      lastImportDecl.insertAfter(newImportDecl)
    } else {
      // add new import declaration at the beginning of the file
      root.get().node.program.body.unshift(newImportDecl)
    }
  }

  return root
}
