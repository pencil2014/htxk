/**
 * 是否有使用记录 0
 * 是否注册全局组件 0
 * 是否已改为E-UI组件引用 0
 */
import FileUpload from 'e-ui/lib/FileUpload'
import Upload from '@element-ui/Upload'
import tools from 'utils/tools'

FileUpload.props.action.required = false
FileUpload.props.action.default = '/api/upload/image'
FileUpload.props.headers = {
  type: Object,
  default () {
    return process.browser ? tools.getHeaders() : {}
  }
}

// FileUpload.props = Object.assign(FileUpload.props, Upload.props)

FileUpload.components['Upload'] = Upload

export default FileUpload
