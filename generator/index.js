module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      vue: '^3.0.0-alpha.4'
    },
    devDependencies: {
      '@vue/compiler-sfc': '^3.0.0-alpha.4',
      // remove the vue-template-compiler
      'vue-template-compiler': null
    }
  },
  {
    prune: true
  })

  api.transformScript(api.entryFile, require('./codemods/rfc09-global-api'))
}
