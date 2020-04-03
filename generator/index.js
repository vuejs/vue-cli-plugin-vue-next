module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      vue: '^3.0.0-alpha.10'
    },
    devDependencies: {
      '@vue/compiler-sfc': '^3.0.0-alpha.10',
      // remove the vue-template-compiler
      'vue-template-compiler': null
    }
  },
  {
    prune: true
  })

  if (api.hasPlugin('eslint')) {
    api.extendPackage({
      devDependencies: {
        'eslint-plugin-vue': '^7.0.0-alpha.0'
      }
    })

    // `plugin:vue/essential` -> `plugin:vue/vue3-essential`, etc.
    const updateConfig = cfg =>
      cfg.replace(
        /plugin:vue\/(essential|recommended|strongly-recommended)/gi,
        'plugin:vue/vue3-$1'
      )

    // if the config is placed in `package.json`
    const eslintConfigInPkg = api.generator.pkg.eslintConfig
    if (eslintConfigInPkg && eslintConfigInPkg.extends) {
      eslintConfigInPkg.extends = eslintConfigInPkg.extends.map(cfg => updateConfig(cfg))
    }
    // if the config has been extracted to a standalone file
    api.render((files) => {
      for (const filename of [
        '.eslintrc.js',
        '.eslintrc.cjs',
        '.eslintrc.yaml',
        '.eslintrc.yml',
        '.eslinrc.json',
        '.eslintrc'
      ]) {
        if (files[filename]) {
          files[filename] = updateConfig(files[filename])
        }
      }
    })
  }

  if (api.hasPlugin('vuex') || api.generator.pkg.dependencies['vuex']) {
    api.extendPackage({
      dependencies: {
        vuex: '^4.0.0-alpha.1'
      }
    })

    api.exitLog('Installed vuex 4.0.')
    api.exitLog('Codemod not yet implemented, please follow the documentation at https://github.com/vuejs/vuex/tree/4.0')

    // Codemod TODOs:
    // * Remove `Vue.use(Vuex)`
    // * `new Vue({ store })` -> `app.use(store)`
    // * optional: `new Vuex.Store({})` -> `createStore({})`
  }

  if (api.hasPlugin('router') || api.generator.pkg.dependencies['router']) {
    api.extendPackage({
      dependencies: {
        'vue-router': '^4.0.0-alpha.4'
      }
    })

    api.exitLog('Installed vue-router 4.0.')
    api.exitLog('Codemod not yet implemented, please follow the documentation at https://github.com/vuejs/vue-router-next')
    
    // Codemod TODOs:
    // * Remove `Vue.use(VueRouter)`
    // * `new VueRouter({})` -> `createRouter({})`
    // * `mode`:
    //   * `mode: 'history'` -> `history: createWebHistory()`
    //   * `mode: 'hash'` -> `history: createWebHashHistory()`
    //   * `mode: 'abstract'` -> `history: createMemoryHistory()`
    // * `new Vue({ router })` -> `app.use(router)`
    // * Async component syntax migration as described in RFC0007
    // * Create the corresponding imports
    // * Remove unused imports (use ESLint for this task)

    // Others:
    // * Catch all routes (`/*`) must now be defined using a parameter with a custom regex: `/:catchAll(.*)`
    // * `keep-alive` is not yet supported
    // * Partial support of per-component navigation guards. No `beforeRouteEnter`
  }

  api.transformScript(api.entryFile, require('./codemods/rfc09-global-api'))
}
