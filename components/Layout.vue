<template>
  <div class="layout">
    <slot v-if="$slots.header" name="header"></slot>
    <x-header v-else></x-header>
    <slot name="body"></slot>
    <slot v-if="$slots.footer" name="footer"></slot>
    <x-footer v-else></x-footer>
    <slot></slot>
  </div>
</template>
<script>
export default {
  created () {
    if (process.browser) {
      let triggerEvent = (node) => { // 触发input事件
        let event = document.createEvent('HTMLEvents')
        event.initEvent('input', true, true)
        node.dispatchEvent(event)
      }
      document.addEventListener('focusout', (e) => {
        let target = e.target
        if (/^(input|textarea)$/i.test(target.nodeName) && target.value && target.getAttribute('maxLength') && target.maxLength < target.value.length) { // 异常处理
          target.value = target.value.substring(0, target.maxLength)
          if (target.dispatchEvent) {
            triggerEvent(target)
          }
        }
      }, false)
      if (document.all && /MSIE 9./i.test(navigator.appVersion)) { // ie 9兼容处理
        let $timer = null
        let handle = (e) => {
          $timer && clearTimeout($timer)
          let target = e.target
          if (target.dispatchEvent) {
            $timer = setTimeout(() => {
              triggerEvent(target)
            }, 150)
          }
        }
        document.addEventListener('keyup', handle, false)
        document.addEventListener('focusout', handle, false)
      }
    }
  }
}
</script>
<style>

</style>
