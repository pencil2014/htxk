const path = require('path');
const resolve = path.resolve;
const resourceVersion = '1.0.0'

module.exports = {
  env: {
    protocol: process.env.NODE_ENV == 'production' ? 'https:' : 'http:'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '求苗_体育赛事_体育门票_体育培训_体育赞助_体育消费服务平台',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keywords', name: 'keywords', content: '体育,求苗,体育赛事,体育培训,体育门票,体育报名,体育资讯,体育视频' },
      { hid: 'description', name: 'description', content: '求苗体育聚集各类体育产业IP，包含但不限于体育赛事报名、体育票务、体育培训、体育旅游、体育赞助、体育用品等各大板块，实现多种资源的聚合与互通的体育消费和资源服务互联网体育交易平台。' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '/styles/iconfont/iconfont.css?v=' + resourceVersion },
      { rel: 'stylesheet', type: 'text/css', href: '/styles/index.css?v=' + resourceVersion + '.0' },
      { rel: 'stylesheet', type: 'text/css', href: '/styles/components.css?v=' + resourceVersion }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  // loading: { color: '#24c881', height: '2px' },
  loading: '~/components/Loading.vue',
  plugins: [
    '~main.js',
    {src: '~plugins/baidu.js', ssr: false}
  ],
  render: {
    bundleRenderer: {
      cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      shouldPrefetch (file, type) { // 资源预加载控制
        let _file = file.replace(/\//g, '_')
        if (/^(layouts_|pages_news_|pages_video_|pages_community_)/.test(_file)) {
          return true
        } else if (file.indexOf('pages_goods_detail')>-1 || file.indexOf('pages_goods__type')>-1) {
          return true
        }
        return false
      }
    },
    resourceHints: true
  },
  router: {
    fallback: true,
    extendRoutes (routes) {
      return routes.filter((item) => {
        if (item.path.indexOf('components') > -1) {
          return false
        }
        if (item.path.indexOf('styles') > -1) {
          return false
        }
        return true
      })
    },
    middleware: 'global',
    scrollBehavior (to, from, savedPosition) {
      let _position = {}
      // savedPosition 只有在 popstate 导航（如按浏览器的返回按钮）时可以获取。
      if (savedPosition) {
        _position = savedPosition
      } else if (to.path === from.path || to.name === from.name) {
        return null
      } else {
        let position = {}
        // 目标页面子组件少于两个
        if (to.matched.length < 2) {
          // 滚动至页面顶部
          position = { x: 0, y: 0 }
        } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
          // 如果目标页面子组件中存在配置了scrollToTop为true
          position = { x: 0, y: 0 }
        }
        // 如果目标页面的url有锚点,  则滚动至锚点所在的位置
        if (to.hash) {
          position = { selector: to.hash }
        }
        _position = position
      }
      return new Promise((resolve, reject) => {
        window.$nuxt.loaded = () => {
          resolve(_position)
        }
      })
    }
  },
  /*
  ** Build configuration
  */
  build: {
    // dll: true,
    vendor: [
      '@element-ui',
      '@e-ui'
    ],
    /*
    ** Run ESLINT on save
    */
    extend (config, { isDev, isClient }) {
      config.resolve.alias['fetch'] = path.join(__dirname, 'utils/fetch.js')
      config.resolve.alias['api'] = path.join(__dirname, 'api')
      config.resolve.alias['layouts'] = path.join(__dirname, 'layouts')
      config.resolve.alias['components'] = path.join(__dirname, 'components')
      config.resolve.alias['utils'] = path.join(__dirname, 'utils')
      config.resolve.alias['static'] = path.join(__dirname, 'static')
      config.resolve.alias['directive'] = path.join(__dirname, 'directive')
      config.resolve.alias['filters'] = path.join(__dirname, 'filters')
      config.resolve.alias['styles'] = path.join(__dirname, 'assets/styles')
      config.resolve.alias['element'] = path.join(__dirname, 'plugins/element-ui')
      config.resolve.alias['@element-ui'] = path.join(__dirname, 'plugins/element-ui')
      config.resolve.alias['e-ui'] = path.join(__dirname, 'node_modules/h666888')
      config.resolve.alias['@e-ui'] = path.join(__dirname, 'plugins/e-ui')
      config.resolve.alias['areaJSON'] = path.join(__dirname, 'static/area.json')
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      /*
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      config.plugins.push(
        new BundleAnalyzerPlugin({
          openAnalyzer: true
        })
      )
      */
      /**
      *全局引入scss文件
      */
      const sassResourcesLoader = {
        loader: 'sass-resources-loader',
        options: {
          resources: [
           'assets/styles/var.scss'
          ]
        }
      }
      // 遍历nuxt定义的loader配置，向里面添加新的配置。  
      config.module.rules.forEach((rule) => {
        if (rule.test.toString() === '/\\.vue$/') {
          rule.options.loaders.sass.push(sassResourcesLoader)
          rule.options.loaders.scss.push(sassResourcesLoader)
        }
        if (['/\\.sass$/', '/\\.scss$/'].indexOf(rule.test.toString()) !== -1) {
          rule.use.push(sassResourcesLoader)
        }
      })
    },
    postcss: [
      require('autoprefixer')({
        browsers: ['last 3 versions']
      })
    ]
  }
}
