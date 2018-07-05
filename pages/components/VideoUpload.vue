<template>
  <div class="video-upload">
    <!--用来存放文件信息-->
    <div class="video-upload-button">
        <div class="video-upload-picker"></div>
        <template v-if="$slots.default">
          <slot></slot>
        </template>
        <el-button v-else type="primary" class="uploadBtn"  @click="handleUpload">上传视频</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: Number,
      default: 2147483648 // 2G
    },
    chunkSize: {
      type: Number,
      default: 2097152 // 2M
    },
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      uuid: ''
    }
  },
  methods: {
    // 上传文件
    handleUpload () {
      this.$el.querySelector('.webuploader-element-invisible').click()
    },
    // 生成uuid
    getUuid () {
      let len = 32
      // 32长度
      let radix = 16
      // 16进制
      let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
      let uuid = []
      let i
      // radix = radix || chars.length
      // if (len) {
      //   for (i = 0; i < len; i++) {
      //     uuid[i] = chars[0 | Math.random() * radix]
      //   }
      // } else {
      //   let r
      //   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      //   uuid[14] = '4'
      //   for (i = 0; i < 36; i++) {
      //     if (!uuid[i]) {
      //       r = 0 | Math.random() * 16
      //       uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      //     }
      //   }
      // }
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | Math.random() * radix]
      }
      return this.getDateStr() + uuid.join('')
    },
    getDateStr () {
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let day = now.getDate()
      let hh = now.getHours()
      let mm = now.getMinutes()
      let ss = now.getSeconds()
      let clock = year
      if (month < 10) {
        clock += '0'
      }
      clock += month
      if (day < 10) {
        clock += '0'
      }
      clock += day
      if (hh < 10) {
        clock += '0'
      }
      clock += hh
      if (mm < 10) {
        clock += '0'
      }
      clock += mm
      if (ss < 10) {
        clock += '0'
      }
      clock += ss
      return clock
    },
    merge (file) {
      let _this = this
      require.ensure([], (r) => {
        let $ = require('jquery')
        $.ajax({
          type: 'POST',
          url: '/api/upload/merge?time=' + new Date().getTime(),
          data: {
            uuid: this.uuid,
            ext: file.ext,
            size: file.size
          },
          dataType: 'json',
          timeout: 20000,
          success: function (data) {
            if (data.status === 0 || data.status === '0') {
              _this.$emit('uploadSuccess', data)
            } else {
              _this.$emit('uploadError', data)
            }
          },
          error: function (request) {
            _this.$emit('uploadError', request)
          }
        })
      })
    },
    // 初始化
    init () {
      require.ensure([], (r) => {
        let WebUploader = require('webuploader')
        let options = Object.assign({
          server: '/api/upload/video?time=' + new Date().getTime(),
          // 选完文件后，是否自动上传。
          auto: true,
          // swf文件路径
          swf: '/static/webuploader/Uploader.swf',
          // 选择文件的按钮。可选。
          // 内部根据当前运行是创建，可能是input元素，也可能是flash.
          pick: this.$el.querySelector('.video-upload-picker'),
          // 只允许选择视频。
          accept: {
            title: 'Video',
            extensions: 'mp4',
            mimeTypes: 'video/mpeg,video/3gpp,video/x-msvideo,video/isivideo,video/mp4'
          },
          // [默认值：false] 是否要分片处理大文件上传
          chunked: true,
          // [默认值：5242880] 如果要分片，分多大一片？ 默认大小为5M.
          chunkSize: this.chunkSize,
          // [默认值：2] 如果某个分片由于网络问题出错，允许自动重传多少次？
          chunkRetry: 2,
          // [默认值：3] 上传并发数。允许同时最大上传进程数。
          threads: 3,
          // 验证文件总数量, 超出则不允许加入队列。
          fileNumLimit: 1,
          // 验证文件总大小是否超出限制, 超出则不允许加入队列。
          fileSizeLimit: this.size, // 2G
          // {int} [可选] [默认值：undefined] 验证单个文件大小是否超出限制, 超出则不允许加入队列。
          fileSingleSizeLimit: this.size // 2G
        }, this.options)
        this.$uploader = WebUploader.create(options)
        this.$uploader.on('fileQueued', (file) => {
          this.uuid = this.getUuid()
          this.$uploader.option('formData', {'uuid': this.uuid})
          this.$uploader.upload()
          this.$emit('changeUpload', file)
        })
        this.$uploader.on('uploadAccept', (file, response) => {
          // console.log(file)
          // console.log(response)
          if (file.chunks === 1) {
            this.$emit('uploadSuccess', response)
          }
        })
        this.$uploader.on('uploadProgress', (file, percentage) => {
          this.$emit('uploadProgress', percentage)
        })
        this.$uploader.on('uploadSuccess', (file) => {
          if (file.size > this.chunkSize) {
            this.merge(file)
          }
        })
        this.$uploader.on('uploadError', (file) => {
          this.$emit('uploadError', file)
        })
        this.$uploader.on('uploadComplete', (file) => {
          this.$emit('uploadComplete', file)
          this.$uploader.reset()
        })
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style scoped>
.uploadBtn {
  margin-top: 35px !important;
}
</style>