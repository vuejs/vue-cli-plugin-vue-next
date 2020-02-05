module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      vue: '^3.0.0-alpha.4'
    },
    devDependencies: {
      '@vue/compiler-sfc': '^3.0.0-alpha.4'
    }
  })

  api.transformScript(api.entryFile, require('./codemods/rfc09-global-api'))

  // TODO: uninstall vue-template-compiler (need to fix @vue/cli-service first)
}
