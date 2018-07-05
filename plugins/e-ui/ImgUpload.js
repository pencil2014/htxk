import ImgUpload from 'e-ui/lib/ImgUpload'
import tools from 'utils/tools'
import api from 'api'

ImgUpload.props.headers = {
  type: Object,
  default () {
    return process.browser ? tools.getHeaders() : {}
  }
}
ImgUpload.props.action.default = '/upload/image'
ImgUpload.props.action.required = false

// 上传成功方法需要对数据做处理
// 再走公共的方法
let successFun = ImgUpload.methods.handleSuccess
ImgUpload.methods.handleSuccess = function (res) {
  this.loading = false
  if (typeof res === 'string') {
    res = JSON.parse(res)
  }
  if (!res.result) {
    res = {result: '0', data: res}
  }
  this.afterSuccess(res)
}
ImgUpload.methods.afterSuccess = successFun

// 图片裁剪后上传到后台
ImgUpload.methods.uploadCropImage = function (image) {
  var self = this
  self.loading = true
  api.uploadCropper({upfile: image}, {successMsg: '图片裁剪成功！'}).then(function (res) {
    self.loading = false
    self.handleSuccess(res)
  }).catch(function () {
    self.loading = false
  })
}

export default ImgUpload
