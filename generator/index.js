const fs = require('fs')
const path = require('path')

module.exports = (api) => {
  // need the CLI to support the `prune` option of `extendPackage`
  api.assertCliVersion('>= 4.2.3')

  api.extendPackage({
    dependencies: {
      vue: '^3.0.0-beta.1'
    },
    devDependencies: {
      '@vue/compiler-sfc': '^3.0.0-beta.1',
      // remove the vue-template-compiler
      'vue-template-compiler': null
    }
  },
  {
    prune: true
  })

  const globalAPITransform = require('./codemods/global-api')
  api.transformScript(api.entryFile, globalAPITransform)

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

  const resolveFile = (file) => {
    if (!/\.(j|t)s$/ig.test(file)) {
      file += '.js'
    }
    let resolvedPath = api.resolve(file)
    const possiblePaths = [
      resolvedPath,
      resolvedPath.replace(/\.js$/ig, '.ts'),
      path.join(resolvedPath.replace(/\.js$/ig, ''), 'index.js'),
      path.join(resolvedPath.replace(/\.js$/ig, ''), 'index.ts')
    ]
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return path.relative(api.resolve('.'), p).replace(/\\/g, '/')
      }
    }
  }

  if (api.hasPlugin('vuex') || api.generator.pkg.dependencies['vuex']) {
    api.extendPackage({
      dependencies: {
        vuex: '^4.0.0-alpha.1'
      }
    })

    api.exitLog('Installed vuex 4.0.')
    api.exitLog('Documentation available at https://github.com/vuejs/vuex/tree/4.0')

    const storePath = resolveFile('src/store')
    if (storePath) {
      api.transformScript(storePath, globalAPITransform)
      api.transformScript(storePath, require('./codemods/vuex'))
    }
  }

  if (api.hasPlugin('router') || api.generator.pkg.dependencies['router']) {
    api.extendPackage({
      dependencies: {
        'vue-router': '^4.0.0-alpha.6'
      }
    })

    api.exitLog('Installed vue-router 4.0.')
    api.exitLog('Documentation available at https://github.com/vuejs/vue-router-next')

    const routerPath = resolveFile('src/router')
    if (routerPath) {
      api.transformScript(routerPath, globalAPITransform)
      api.transformScript(routerPath, require('./codemods/router'))
    }
    
    // Notes:
    // * Catch all routes (`/*`) must now be defined using a parameter with a custom regex: `/:catchAll(.*)`
    // * `keep-alive` is not yet supported
    // * Partial support of per-component navigation guards. No `beforeRouteEnter`
  }

  if (api.hasPlugin('unit-jest') || api.hasPlugin('unit-mocha')) {
    api.extendPackage({
      devDependencies: {
        '@vue/test-utils': '^2.0.0-alpha.1'
      }
    })

    api.exitLog('Installed @vue/test-utils 2.0.')
    api.exitLog('Documentation available at https://github.com/vuejs/vue-test-utils-next')
  }
}
