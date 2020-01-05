module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      vue: '^3.0.0-alpha.1'
    },
    devDependencies: {
      '@vue/compiler-sfc': '^3.0.0-alpha.1'
    }
  })

  // TODO: transformScript main.js
  api.render('./template')

  // TODO: uninstall vue-template-compiler (need to fix @vue/cli-service first)
}
