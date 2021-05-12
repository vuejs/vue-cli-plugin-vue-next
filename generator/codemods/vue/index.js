/** @type {import('jscodeshift').Transform} */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  const context = { j, root }

  require('./add-emit-declaration')(context)
  require('./add-watch-deep')(context)
  require('./rename-lifecycle')(context)
  require('./vModel')(context)

  return root.toSource({ lineTerminator: '\n' })
}

module.exports.parser = 'babylon'
