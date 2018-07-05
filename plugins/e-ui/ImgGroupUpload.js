import ImgGroupUpload from 'e-ui/lib/ImgGroupUpload'
import EImgUpload from '@e-ui/ImgUpload'
import tools from 'utils/tools'

ImgGroupUpload.props.imgList = {
  type: Array,
  default: function () {
    return []
  }
}

ImgGroupUpload.props.headers = {
  type: Object,
  default () {
    return process.browser ? tools.getHeaders() : {}
  }
}
ImgGroupUpload.methods.handleChange = function (data) {
  if (this.myValue && !this.myDisabled) {
    this.imgList.push(data)
    this.myValue.push(data.url)
    this.change()
    this.$emit('imgList:update', this.imgList)
  }
}

ImgGroupUpload.components['EImgUpload'] = EImgUpload

export default ImgGroupUpload
