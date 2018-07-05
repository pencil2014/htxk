<template>
  <div id="uploader" class="wu-example">
    <!--用来存放文件信息-->
    <div id="thelist" class="uploader-list"></div>
    <div class="btns">
        <div id="picker"></div>
        <el-button type="primary" class="uploadBtn" @click="upload">上传视频</el-button>
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
      default: 5242880 // 5M
    },
    fileAccept: {
      type: String,
      default: 'mp4'
    }
  },
  data () {
    return {
      uuid: '',
      uploader: ''
    }
  },
  methods: {
    // 上传文件
    upload () {
      document.querySelector('.webuploader-element-invisible').click()
    },
    // 生成uuid
    getUuid () {
      var len = 32
      // 32长度
      var radix = 16
      // 16进制
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
      var uuid = []
      var i
      radix = radix || chars.length
      if (len) {
        for (i = 0; i < len; i++) {
          uuid[i] = chars[0 | Math.random() * radix]
        }
      } else {
        var r
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
          }
        }
      }
      return this.getDateStr() + uuid.join('')
    },
    getDateStr () {
      var now = new Date()
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      var day = now.getDate()
      var hh = now.getHours()
      var mm = now.getMinutes()
      var ss = now.getSeconds()
      var clock = year
      if (month < 10) clock += '0'
      clock += month
      if (day < 10) clock += '0'
      clock += day
      if (hh < 10) clock += '0'
      clock += hh
      if (mm < 10) clock += '0'
      clock += mm
      if (ss < 10) clock += '0'
      clock += ss
      return clock
    },
    merge (file) {
      var $ = require('jquery')
      var _this = this
      $.ajax({
        type: 'POST',
        url: '/upload/merge?time=' + new Date().getTime(),
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
    },
    // 初始化
    init () {
      var WebUploader = require('webuploader')
      this.uploader = WebUploader.create({
        server: '/upload/video?time=' + new Date().getTime(),
        // 选完文件后，是否自动上传。
        auto: true,
        // swf文件路径
        swf: '/static/webuploader/Uploader.swf',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
          'id': '#picker',
          'multiple': false
        },
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
      })
      this.uploader.on('fileQueued', (file) => {
        this.uuid = this.getUuid()
        this.uploader.option('formData', {'uuid': this.uuid})
        this.uploader.upload()
        this.$emit('changeUpload', file)
      })
      this.uploader.on('uploadAccept', (file, response) => {
        // console.log(file)
        // console.log(response)
      })
      this.uploader.on('uploadProgress', (file, percentage) => {
        this.$emit('uploadProgress', percentage)
      })
      this.uploader.on('uploadSuccess', (file) => {
        if (file.size > 5242880) { // 大于5MB的需要去服务器合并文件
          this.merge(file)
        }
      })
      this.uploader.on('uploadError', (file) => {
        this.$emit('uploadError', file)
      })
      this.uploader.on('uploadComplete', (file) => {
        this.$emit('uploadComplete', file)
        this.uploader.reset()
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