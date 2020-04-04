/** @type {import('jscodeshift').Transform} */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  // TODO: new Router() -> createRouter()
  // TODO: mode: 'history' -> history: createWebHistory()

  return root.toSource({ lineTerminator: '\n' })
}
