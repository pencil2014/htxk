/**
 * 是否有使用记录 1
 * 是否注册全局组件 0
 */
import Upload from 'element-ui/lib/upload'
import tools from 'utils/tools'

Upload.props.action.required = false
Upload.props.action.default = '/api/upload/image'
Upload.props.headers = {
  type: Object,
  default () {
    return process.browser ? tools.getHeaders() : {}
  }
}
export default Upload
