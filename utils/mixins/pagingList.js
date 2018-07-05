export default {
  props: {
    history: { // 列表分页是否产生历史记录
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: '努力加载中'
    }
  },
  methods: {
    initial () { // 初始化
      this.$paginationProps = {} // 分页props
      this.$nextTick(() => {
        this.fetch(this.query) // 第二个表示是初始时调用
        this.handleSubmit()
        this.openLoading()
      })
    },
    getQuery (query) { // 获取请求参数
      if (!this.$initQuery && query) { // 保存初始化查询对象
        this.$initQuery = Object.assign({}, query)
      }
      return Object.assign({page: 1, rows: 15}, this.$route.query, query)
    },
    getPaginationProps (data) { // 获取分页默认props
      if (data && data.total && this.query) {
        let query = this.query
        let rows = query.rows ? Number(query.rows) : 15
        let page = query.page ? Number(query.page) : 1
        this.$paginationProps = {
          style: {
            display: data.total > rows || data.total > 15 ? '' : 'none'
          },
          pageSize: rows,
          currentPage: page,
          total: data.total
        }
        return this.$paginationProps
      } else {
        return {
          ...this.$paginationProps,
          style: {
            display: 'none'
          }
        }
      }
    },
    handleCurrentChange (value) { // 修改页数事件
      if (value != this.query.page && !this.$sizeChangeTimer) { //eslint-disable-line
        let query = Object.assign({}, this.query, {page: value})
        this.updateRoute && this.updateRoute(query)
        let node = this.$el.querySelector('.el-pagination')
        if (node) { // 阻止频繁点击
          node.style.pointerEvents = 'none'
          setTimeout(() => {
            node.style.pointerEvents = ''
          }, 1000)
        }
      }
    },
    handleSizeChange (value) { // 修改分页条数事件
      this.$sizeChangeTimer = true // 避免页数修改后当前页Change事件重复触发
      setTimeout(() => {
        this.$sizeChangeTimer = false
      }, 500)
      let query = Object.assign({}, this.query, {page: 1, rows: value})
      this.updateRoute && this.updateRoute(query)
    },
    updateRoute (query) { // 更新URL地址
      if (this.history) {
        let _query = Object.assign({page: 1, rows: 15}, query)
        for (let name in _query) { // 清除 值为null|undefined
          if (_query[name] === null || _query[name] === undefined || _query[name] === '') {
            delete _query[name]
          }
        }
        this.query = _query
        this.$router.push({path: this.$route.path, query: _query})
      } else {
        this.openLoading()
        this.query = query
        this.fetch({...query})
      }
    },
    submit (query = this.query) { // 提交表单
      this.updateRoute(query)
    },
    handleSubmit () { // 表单提交事件
      let node = this.$el.querySelector('.form-search') // 获取列表筛选表单
      if (node) {
        node.onsubmit = (e) => {
          e.stopPropagation()
          e.preventDefault()
          this.query.page = 1
          this.updateRoute(this.query)
        }
      }
    },
    openLoading () { // 开启加载效果
      if (!this.history && !this.$beforeUpdateTimer) {
        let node = this.$el.querySelector('.el-pagination')
        if (node) {
          node.parentNode.style.position = 'relative'
          this.$loadingInstance = this.$loading({ // 实例化loading对象
            target: node.parentNode,
            fullscreen: false,
            text: this.loadingText
          })
        }
      }
    },
    closeLoading () { // 结束加载效果
      this.$beforeUpdateTimer && clearTimeout(this.$beforeUpdateTimer)
      this.$beforeUpdateTimer = setTimeout(() => {
        if (!this.history && this.$loadingInstance) { // 结束loading效果
          this.$loadingInstance.close()
          this.$loadingInstance = null
        }
        this.$beforeUpdateTimer = null
      }, 200)
    },
    getFormProps (props) { // 获取默认表单props
      return Object.assign({
        class: 'form-search',
        novalidate: 'novalidate'
      }, props)
    },
    fetch () {} // 需要被重写， 初始化会执行，路由参数变化也会执行
  },
  beforeRouteUpdate (to, from, next) { // 监听route地址变化
    if (to.path === from.path) {
      this.$routeUpdateTimer && clearTimeout(this.$routeUpdateTimer)
      this.$routeUpdateTimer = setTimeout(() => {
        this.fetch(this.query)
      }, 100)
    }
    next()
  },
  beforeMount () {
    this.initial()
  },
  beforeUpdate () {
    this.closeLoading()
  },
  updated () {
    if (this.history) {
      !this.$store.state.loading && this.scrollIntoView && this.scrollIntoView()
    } else {
      this.$beforeUpdateTimer = null
      this.scrollIntoView()
    }
  }
}
