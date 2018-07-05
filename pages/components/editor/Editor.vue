<template>
  <script :id="id" type="text/plain" class="my-ueditor"></script>
</template>

<script>
  import emitter from 'utils/emitter.js'
  import tools from 'utils/tools'
  const toolbars = {
    simple: [['undo', 'redo', 'bold', 'italic', 'underline', 'forecolor', 'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', 'removeformat', 'simpleupload', 'insertimage']]
  }
  window.CONST = {
    basePath: ''
  }
  
  export default {
    mixins: [emitter],
    props: {
      value: {
        type: String
      },
      options: {
        type: Object,
        default () {
          return {}
        }
      },
      toolbars: {
        type: [String, Array],
        default: 'simple'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      maxlength: {
        type: Number,
        default: 8000
      }
    },
    mounted () {
      if (!window.UE) {
        this.loadScript('/static/ueditor/ueditor.config.js', () => {
          this.loadScript('/static/ueditor/ueditor.all.min.js', () => {
            this.loadScript('/static/ueditor/lang/zh-cn/zh-cn.js', () => {
              this.initEditor()
            })
          })
        })
      } else {
        this.initEditor()
      }
    },
    destroyed () {
      this.$ue.destroy()
      this.$ue = null
      window.onscroll = null
    },
    data () {
      return {
        id: this.unique()
      }
    },
    watch: {
      value (value) {
        if (this.$ue && this.$ue.getContent && value !== this.$ue.getContent()) {
          this.$ue.setContent(value)
        }
      },
      disabled (value) {
        if (value) {
          this.$ue.setDisabled()
        } else {
          this.$ue.setEnabled()
        }
      }
    },
    methods: {
      initEditor () {
        let formatUrl = function (url) {
          let u = url.replace(/&&/g, '&')
          u = u.replace(/\?&/g, '?')
          u = u.replace(/&$/g, '')
          u = u.replace(/&#/g, '#')
          u = u.replace(/&+/g, '&')
          return u
        }
        window.UE.Editor.prototype.getActionUrl = function (action) {
          let headers = tools.getHeaders()
          let xUserId = headers['X-SNS-UserId']
          let xTimestamp = headers['X-SNS-Timestamp']
          let xSignature = headers['X-SNS-Signature']
          let xClientType = headers['X-SNS-ClientType']
          let headersStr = `&xUserId=${xUserId}&xTimestamp=${xTimestamp}&xSignature=${xSignature}&xClientType=${xClientType}`
          let actionName = this.getOpt(action) || action
          let imageUrl = this.getOpt('imageUrl')
          let serverUrl = this.getOpt('serverUrl')
          if (!serverUrl && imageUrl) {
            serverUrl = imageUrl.replace(/^(.*[\/]).+([\.].+)$/, '$1controller$2') //eslint-disable-line
          }
          if (serverUrl) {
            serverUrl = serverUrl + (serverUrl.indexOf('?') === -1 ? '?' : '&') + 'action=' + (actionName || '') + headersStr
            return formatUrl(serverUrl)
          } else {
            return ''
          }
        }
        this.$UEReady = false
        let options = {
          maximumWords: this.maxlength
        }
        if (this.toolbars) {
          if (typeof this.toolbars === 'string') {
            options.toolbars = toolbars[this.toolbars]
          } else {
            options.toolbars = this.toolbars
          }
        }
        this.$ue = window.UE.getEditor(this.id, options)
        this.$ue.addListener('contentChange', this.handleChange)
        this.$ue.addListener('afterExecCommand', this.handleChange)
        this.$ue.addListener('ready', this.handleReady)
      },
      handleReady () {
        this.value && this.$ue.setContent(this.value)
        this.$UEReady = true
        if (this.disabled) {
          this.$ue.setDisabled()
        }
      },
      handleChange (e) {
        if (this.$UEReady) {
          let content = this.$ue.getContent()
          let contentTxt = this.$ue.getContentTxt()
          this.$emit('input', content).$emit('change', content)
          this.$emit('update:text', contentTxt)
          if (this.validateEvent) {
            this.dispatch('ElFormItem', 'el.form.change', [contentTxt])
            this.dispatch('ElFormItem', 'el.form.blur', [contentTxt])
          }
        }
      },
      loadScript (src, fn) {
        let node = document.createElement('script')
        node.type = 'text/javascript'
        node.onload = fn
        node.src = src
        document.querySelector('head').appendChild(node)
      }
    }
  }
</script>

<style lang="scss">
  @import '~styles/var.scss';
  .my-ueditor{
    line-height:100%;
    min-height:300px;
  }
  .edui-editor{
    border-color:$border-color-base!important;
  }
  .edui-editor-toolbarbox{
    background-color: #fff
  }
  .el-form-item.is-error{
    .edui-editor{
      border-color:#ff4949!important;
    }
  }
  .edui-default .edui-editor-bottomContainer td{
    border-color:$border-color-base!important;
  }
  .edui-default .edui-editor-toolbarboxouter{
    background:#fff !important;
    box-shadow:none!important;
    border-bottom-color:$border-color-base!important;
    filter:none!important;
  }
  .edui-default .edui-editor-toolbarbox{
    box-shadow:none!important;
  }
</style>
