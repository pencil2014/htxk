import Vue from 'vue'
import Layout from 'e-ui/lib/Layout'
import Placeholder from './Placeholder'
import Heading from 'e-ui/lib/Heading'
import Img from 'e-ui/lib/Img'
import ImgMatch from 'e-ui/lib/ImgMatch'
import PreviewBox from 'e-ui/lib/PreviewBox'
import Text from 'e-ui/lib/Text'
import Avatar from 'e-ui/lib/Avatar'
import {Cellbox, CellItem} from 'e-ui/lib/cellbox'
import QrCode from 'e-ui/lib/QrCode'

import filters from 'filters'

// 图像组件 剪裁功能扩展
let imgCutProps = {
  size: {
    type: Array,
    default () {
      return []
    }
  },
  cutType: {
    type: Number,
    default: 2
  }
}
// 需要添加剪裁功能props的组件
let combineCutCompImgArr = [ImgMatch, Avatar]
let combineCutPropsImgArr = [ImgMatch, Avatar, Img]
combineCutPropsImgArr.forEach(item => {
  item.props.size = imgCutProps.size
  item.props.cutType = imgCutProps.cutType
})
combineCutCompImgArr.forEach(item => {
  item.components['EImg'] = Img
})

Img.computed.mySrc = function () {
  return this.src ? filters.formatPicture(this.src, this.cutType, this.size) : this.defaultSrc
  // return this.defaultSrc
}

// 修改组件引用的默认图片地址
// EImg组件默认值 及 用来判断组件默认值处理 类似Acatar传过来的不应视为defaultSrc
let imgDefaultSrc = '/images/default_goods.svg'
Img.props.defaultSrc.default = imgDefaultSrc
ImgMatch.props.defaultSrc.default = '/images/default/match.png'
Avatar.props.defaultSrc.default = '/images/default/avatar.png'
Placeholder.props.src.default = '/images/default/placeholder.png'
// 通过混合加入图片处理
let imgMixins = {
  mounted: function () {
    if (this.size.length && !this.src && this.defaultSrc === imgDefaultSrc) {
      this.setDefaultBG()
    }
  }
}
// 组件不设定mixins时，结构会报错
Img.mixins = Img.mixins ? [...Img.mixins, imgMixins] : [imgMixins]
Img.methods.setDefaultBG = function () {
  let [width, height] = this.size
  this.$el.style.width = width + 'px'
  this.$el.style.height = height + 'px'
  this.$el.style.backgroundColor = '#eee'
}
Img.methods.handleError = function (e) {
  if (this.$el.src.indexOf(this.defaultSrc) === -1) {
    this.$el.setAttribute('error-src', this.$el.src)
    this.$el.src = this.defaultSrc
    this.$emit('error', e)
    this.setDefaultBG()
  }
}
const components = [
  Layout,
  Heading,
  Img,
  Avatar,
  ImgMatch,
  Cellbox,
  CellItem,
  PreviewBox,
  Text,
  Placeholder,
  QrCode
]

const install = function (Vue, opts = {}) {
  for (let item of components) {
    item && item.componentName && Vue.component(item.componentName, item)
  }
}
install(Vue)

export {
  install,
  Layout,
  Heading,
  Img,
  Avatar,
  ImgMatch,
  Cellbox,
  CellItem,
  PreviewBox,
  Text,
  Placeholder,
  QrCode
}
