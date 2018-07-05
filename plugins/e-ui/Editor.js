import tools from 'utils/tools'

let Editor = null
export default {
  name: 'EEditor',
  props: {
    value: {
      type: String
    },
    text: {
      type: String
    },
    options: {
      type: Object,
      default () {
        return {
          imageUrlPrefix: '' // 图片路径前缀
        }
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
    },
    headers: {
      type: Function,
      default () {
        let headers = process.browser ? tools.getHeaders() : {}
        let xUserId = headers['X-SNS-UserId']
        let xTimestamp = headers['X-SNS-Timestamp']
        let xSignature = headers['X-SNS-Signature']
        let xClientType = headers['X-SNS-ClientType']
        return `&xUserId=${xUserId}&xTimestamp=${xTimestamp}&xSignature=${xSignature}&xClientType=${xClientType}`
      }
    },
    script: {
      type: Array,
      default () {
        if (process.browser) {
          let origin = location.origin
          origin = origin.indexOf('local') === -1 ? origin.replace('www.', 'org.') : 'http://org.htxk.kf'
          return [
            `${origin}/static/ueditor/ueditor.config.js`,
            `${origin}/static/ueditor/ueditor.all.js`,
            `${origin}/static/ueditor/lang/zh-cn/zh-cn.js`
          ]
        }
      }
    }
  },
  data () {
    return {
      runRender: false
    }
  },
  mounted () {
    let self = this
    require.ensure([], (r) => {
      Editor = require('e-ui/lib/Editor')
      self.runRender = true
    })
  },
  render (createElement) {
    let self = this
    let element = ['div'] // 默认渲染
    if (this.runRender && Editor) {
      element = [
        Editor.default,
        {
          props: {
            ...self._props,
            options: {
              ...self._props.options,
              serverUrl: '/resources/ueditor/jsp/controller.jsp'
            },
            getAction: function (action) {
              if (action === 'uploadimage') { // 图片上传
                return '/upload/image'
              }
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
                let formatUrl = function (url) {
                  let u = url.replace(/&&/g, '&')
                  u = u.replace(/\?&/g, '?')
                  u = u.replace(/&$/g, '')
                  u = u.replace(/&#/g, '#')
                  u = u.replace(/&+/g, '&')
                  return u
                }
                serverUrl = serverUrl + (serverUrl.indexOf('?') === -1 ? '?' : '&') + 'action=' + (actionName || '') + headersStr
                return formatUrl(serverUrl)
              } else {
                return ''
              }
            }
          },
          on: {
            input: function (value) {
              self.$emit('input', value)
            },
            'update:text' (text) {
              self.$emit('update:text', text)
            }
          }
        }
      ]
    }
    return createElement(...element)
  }
}
