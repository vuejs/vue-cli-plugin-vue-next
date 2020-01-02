module.exports = (api, options) => {
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
          : '@vue/runtime-dom'
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
