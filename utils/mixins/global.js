export default {
  methods: {
    unique () { // 获取唯一ID字段串
      return Math.random().toString(36).substr(2)
    },
    scrollIntoView (node = this.$el) { // 滚动到可视区域内
      if (node.getBoundingClientRect) {
        let rect = this.$el.getBoundingClientRect()
        rect.top < 0 && this.$el.scrollIntoView && this.$el.scrollIntoView(true)
      }
    }
  }
}
