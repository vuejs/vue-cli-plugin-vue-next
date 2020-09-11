/**
 * Remove `Vue.use()` calls
 * Per current design, `Vue.use` is replaced by `app.use`.
 * But in library implementations like `vue-router` and `vuex`,
 * the new `app.use` does not reuse the same argument passed to `Vue.use()`,
 * but expects instantiated instances that are used to pass to the root components instead.
 * So we now expect the migration to be done in the `root-prop-to-use` transformation,
 * and the `Vue.use` statements can be just abandoned.
 * @param {Object} context
 * @param {import('jscodeshift').JSCodeshift} context.j
 * @param {ReturnType<import('jscodeshift').Core>} context.root
 */
module.exports = function removeVueUse({ j, root }) {
  const vueUseCalls = root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: {
        name: 'Vue'
      },
      property: {
        name: 'use'
      }
    }
  })

  const removablePlugins = ['VueRouter', 'Vuex']
  const removableUseCalls = vueUseCalls.filter(({ node }) => {
    if (j.Identifier.check(node.arguments[0])) {
      const plugin = node.arguments[0].name
      if (removablePlugins.includes(plugin)) {
        return true
      }
    }

    return false
  })

  removableUseCalls.remove()
}
