<template>
  <div>
    <div class="uploadBtn">
      <el-button type="link">请选择图片</el-button>
      <input type="file" class="inputFile" name="image" accept="image/jpg,image/png,image/jpeg" @change="setImage" />
    </div>
    <div class="crop-box">
      <div class="crop-modal" v-show="imgSrc">
        <div class="crop-modal-inner"></div>
      </div>
      <div class="crop-out" v-show="cropImg">
        <img :src="cropImg" alt=""/>
        <p>图片预览</p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from 'api/coupon'
export default {
  props: {
    text: {
      type: String,
      default: '选择图片'
    },
    url: {
      type: String,
      default: '/manage/personal/update/iconData'
    }
  },
  data () {
    return {
      imgSrc: '',
      cropImg: '',
      uploadSattus: true
    }
  },
  components: {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let self = this
      this.$vm = new Vue({
        el: this.$el.querySelector('.crop-modal-inner'),
        render (createElement) {
          let VueCropper = require('vue-cropperjs')
          return createElement(VueCropper.default, {
            props: {
              aspectRatio: 1,
              guides: true,
              viewMode: 3,
              dragMode: 'crop',
              autoCrop: true,
              autoCropArea: 0.5,
              minContainerWidth: 250,
              minContainerHeight: 250,
              minCropBoxWidth: 80,
              minCropBoxHeight: 80,
              background: true,
              rotatable: false,
              movable: true,
              imgStyle: {'width': '100%', 'height': 'auto'},
              src: self.imgSrc,
              ready: self.cropImage,
              zoom: self.cropImage,
              cropmove: self.cropImage
            },
            ref: 'cropper'
          })
        }
      })
    },
    uploadCropper () {
      if (!this.uploadSattus) {
        this.$message.error('图片上传中，请勿重复提交！')
        return false
      }
      if (!this.imgSrc) {
        this.$message.error('请选择图片！')
        return false
      }
      if (!this.cropImg) {
        this.$message.error('请裁剪头像！')
        return false
      }
      this.uploadSattus = false
      api.uploadCropper({upfile: this.cropImg}, {successMsg: '头像设置成功！'})
        .then((res) => {
          this.$emit('uploadSucess', res.data.url)
          this.resetCropper()
          this.uploadSattus = true
        }).catch(() => {
          this.uploadSattus = true
        })
    },
    resetCropper () {
    },
    setImage (e) {
      const file = e.target.files[0]
      if (!file) {
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error('头像限制大小为5M!')
        return false
      }
      if (!file.type.includes('image/')) {
        this.$message.error('请选择一张图片!')
        return false
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.imgSrc = event.target.result
          this.$vm.$refs.cropper.replace(event.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        this.$message.error('浏览器不支持请更换chrome浏览器!')
      }
    },
    cropImage () {
      this.cropImg = this.$vm.$refs.cropper.getCroppedCanvas().toDataURL()
    },
    rotate () {
      this.$vm.$refs.cropper.rotate(90)
    }
  }
}
</script>

<style scoped lang="scss">

.uploadBtn {
  position: relative;
  cursor: pointer;
  text-align: center;
  margin-bottom: 10px;
  .inputFile {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
  }
}
.crop-box{
  width: 100%;
  min-height: 200px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  background-color: $color-background-sub;
  .crop-modal {
    display: inline-block;
    width: 60%;
    vertical-align: top;
  }
  .crop-out {
    display: inline-block;
    width: 30%;
    vertical-align: top;
    margin-left: 10%;
    text-align: center;
    font-size: 12px;
    color: $color-sub;
    img {
      border: 1px solid $border-color-base;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 10px;
    }
  }
}

</style>