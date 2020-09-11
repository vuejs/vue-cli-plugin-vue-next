const chalk = require('chalk')

module.exports = (api, options) => {
  try {
    api.assertVersion('< 4.5.0')
  } catch (e) {
    console.warn(chalk.red(`Vue CLI now supports Vue 3 by default.`))
    console.warn(chalk.red(`vue-cli-plugin-vue-next is no longer needed, please remove it from the dependencies.`))
    return
  }

  const vueLoaderCacheConfig = api.genCacheConfig('vue-loader', {
    'vue-loader': require('vue-loader/package.json').version,
    '@vue/compiler-sfc': require('@vue/compiler-sfc/package.json').version
  })

  api.chainWebpack(config => {
    config.resolve.alias
      .set(
        'vue$',
        options.runtimeCompiler
          ? 'vue/dist/vue.esm-bundler.js'
          : 'vue/dist/vue.runtime.esm-bundler.js'
      )

    config.module
      .rule('vue')
        .test(/\.vue$/)
        .use('vue-loader')
          .loader(require.resolve('vue-loader'))
          .options(vueLoaderCacheConfig)
    
    config
      .plugin('vue-loader')
      .use(require('vue-loader').VueLoaderPlugin)
  })
}
