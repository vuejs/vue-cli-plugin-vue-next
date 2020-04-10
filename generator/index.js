const fs = require('fs')
const path = require('path')

module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      vue: '^3.0.0-alpha.11'
    },
    devDependencies: {
      '@vue/compiler-sfc': '^3.0.0-alpha.11',
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
    api.exitLog('See the documentation at https://github.com/vuejs/vuex/tree/4.0')
  }

  if (api.hasPlugin('router') || api.generator.pkg.dependencies['router']) {
    api.extendPackage({
      dependencies: {
        'vue-router': '^4.0.0-alpha.4'
      }
    })

    api.exitLog('Installed vue-router 4.0.')
    api.exitLog('See the documentation at https://github.com/vuejs/vue-router-next')
    
    // Notes:
    // * Catch all routes (`/*`) must now be defined using a parameter with a custom regex: `/:catchAll(.*)`
    // * `keep-alive` is not yet supported
    // * Partial support of per-component navigation guards. No `beforeRouteEnter`
  }

  const globalApiTransform = require('./codemods/global-api')
  api.transformScript(api.entryFile, globalApiTransform)

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
        return path.relative(api.resolve('.'), p)
      }
    }
  }
  
  const routerPath = resolveFile('src/router')
  console.log(routerPath)
  if (routerPath) {
    api.transformScript(routerPath, globalApiTransform)
    api.transformScript(routerPath, require('./codemods/router'))
  }

  const storePath = resolveFile('src/store')
  if (storePath) {
    api.transformScript(storePath, globalApiTransform)
    api.transformScript(storePath, require('./codemods/vuex'))
  }
}
