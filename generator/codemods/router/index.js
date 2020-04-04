/** @type {import('jscodeshift').Transform} */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  // TODO: Vue.use(router) might be in either`router/index.js` or `main.js`

  return root.toSource({ lineTerminator: '\n' })
}
