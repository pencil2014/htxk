import Vue from 'vue'
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted (el) {
    // 聚焦元素
    if (/^(input||textarea)$/i.test(el.nodeName)) {
      el.focus()
    } else {
      let node = el.querySelector('input,textarea')
      node && node.focus()
    }
  }
})

// 注册一个全局自定义指令 `v-login`
Vue.directive('login', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding, vnode) {
    el.addEventListener('click', () => {
      let session = window.$nuxt.$store.state.user.session
      if (session && session.userId && session.userId.length && session.userId.length > 3) {
        vnode.data.on.loginclick && vnode.data.on.loginclick()
      } else {
        window.$nuxt.$login().then(() => {
          vnode.data.on.loginclick && vnode.data.on.loginclick()
        })
      }
    })
  }
})

if (process.browser) {
  window.onNuxtReady(() => { // nuxt初始化完成
    let login = () => { // 登录弹框
      return new Promise((resolve, reject) => {
        require.ensure([], (r) => {
          let XLogin = require('@/pages/member/components/XLogin').default
          let node = document.createElement('div')
          document.body.appendChild(node)
          new Vue({ // eslint-disable-line
            router: window.$nuxt.$router,
            store: window.$nuxt.$store,
            components: {
              XLogin
            },
            el: node,
            data () {
              return {
                visible: true
              }
            },
            watch: {
              visible (value) {
                if (!value) {
                  this.toDestroy()
                }
              },
              $route () {
                this.toDestroy()
              }
            },
            render (h) {
              return <el-dialog title="登录" custom-class="login-dialog" visible={this.visible} {...{on: {'update:visible': this.handleClose}}}>
                <XLogin dialog={true} onHandleClose={this.handleClose} onLogin={this.handleLogin} />
              </el-dialog>
            },
            destroyed () {
              this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
            },
            methods: {
              toDestroy () {
                this.$nextTick(() => {
                  this.$destroy()
                })
              },
              handleClose (...arg) {
                this.visible = false
              },
              handleLogin () {
                this.$nextTick(() => {
                  this.visible = false
                  resolve()
                })
              }
            }
          })
        })
      })
    }
    window.$nuxt.$login = login
  })
}
