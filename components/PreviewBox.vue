<template>
  <div @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Preview from './Preview'
  export default {
    methods: {
      handleClick (e) {
        if (/^img$/i.test(e.target.nodeName)) {
          e.preventDefault()
          e.stopPropagation()
          let list = []
          let index = 0
          Array.from(this.$el.querySelectorAll('img')).forEach((item, i) => {
            if (item === e.target) {
              index = i
            }
            list.push(item.getAttribute('data-src') || item.src)
          })
          let node = document.createElement('div')
          document.body.appendChild(node)
          new Vue({ // eslint-disable-line
            el: node,
            data: () => {
              return {
                visible: true,
                index: index,
                list: list
              }
            },
            mounted () {
              this.index = index
            },
            methods: {
              handleClose () {
                this.$destroy()
              }
            },
            render (createElement) {
              let self = this
              return createElement(Preview, {
                props: {
                  visible: this.visible,
                  index: index,
                  list: list
                },
                on: {
                  close: self.handleClose
                }
              })
            }
          })
        }
      }
    }
  }
</script>
