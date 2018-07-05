<template>
  <div class='report-box'>
    <el-button type="text" @click="ReportAction" class="report-button">
      <i class="iconfont">&#xe63c;</i>
      举报
    </el-button>

    <el-dialog title="举报" size="large"      
    :visible.sync="dialogFormVisible" 
    :before-close="handleClose" >
      <div class="divider"></div>
      <div class='form-box'  v-if='dialogFormVisible' >
        <el-form ref="form"  
          v-bind="getFormProps({labelWidth:'100px'})"
          :rules='rules'
          :model="form"  
        >
          <el-form-item label="举报原因：" 
            prop="causeCate"  
          >
            <el-radio-group v-model="form.causeCate">
              <el-radio label="4001">淫秽色情</el-radio>
              <el-radio label="4002">涉嫌欺诈</el-radio>
              <el-radio label="4003">人身攻击</el-radio>
              <el-radio label="4004">营销广告</el-radio>
              <el-radio label="4005">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="其他原因："  prop="cause"  >
            <el-input 
              class='textarea-box'
              type="textarea"
              resize='none'
              :maxlength='200' 
              v-model="form.cause" 
              number-word />
          </el-form-item>
          <!-- 重新初始化一次上传组件 -->
          <el-form-item class="upload-img" label="上传截图:" >
            <e-img-group-upload :size='1024 * 1024' :imgList.sync="form.shotImg" v-model="imgvalue"   :limit='1' />
          </el-form-item>
          <el-form-item class='verification-code' label="验证码:"
            prop="validateCode"  >
            <e-img-code ref="imgCode"  v-model="form.validateCode"   v-if='dialogFormVisible' action="/collect/generate/code/new" :params="{type: 11}" style="width:300px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="loading" >确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import api from 'api/news'
import tools from 'utils/tools'
import Vue from 'vue'
import {form} from 'utils/mixins'
import EImgUpload from '@e-ui/ImgUpload'
import EImgGroupUpload from '@e-ui/ImgGroupUpload'
import EImgCode from '@e-ui/ImgCode'

export default {
  mixins: [form],
  layout: 'manage',
  components: {
    EImgUpload,
    EImgGroupUpload,
    EImgCode
  },
  props: {
    tipoffType: {
      required: true
      // default: 3 // 视频是3
    },
    resId: {
      required: true
    }
  },
  watch: {
    'dialogFormVisible' (data) {
      Vue.nextTick(() => {
        data && this.$refs.imgCode.refresh()
      })
    }
  },
  data () {
    let self = this
    return {
      dialogFormVisible: false,
      loading: false, // 必需要返回loading
      imgvalue: [],
      form: {
        causeCate: '4001',
        cause: '',
        shotImg: [],
        validateCode: ''
      },
      rules: {
        causeCate: [{required: true, message: '请选择举报原因'}],
        cause: [
          {required: true, message: '欢迎提出您在使用过程中遇到的问题或宝贵意见。'},
          {min: 5, max: 200, message: '感谢您的反馈（5 ~ 200 个字符）'}
        ],
        shotImg: [], // 截图非必须
        validateCode: [
          {required: true, message: '请输入图片验证码', trigger: 'blur'},
          {min: 4, max: 4, message: '图片验证码4个字符', trigger: 'blur'},
          {
            validator (rule, value, callback) {
              if (self.form.validateCode.length === 4) {
                api.validateCode({'_time': new Date(), validateCode: self.form.validateCode}).then((res) => {
                  if (res.data) {
                    callback()
                  } else {
                    self.$refs.imgCode.refresh()
                    callback(new Error('图片验证码错误，请重新输入'))
                  }
                }).catch(() => {
                  self.$refs.imgCode.refresh()
                  callback(new Error('图片验证码错误，请重新输入'))
                })
              }
            }
          }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    submit () {
      let subData = Object.assign({'_time': new Date(), tipoffType: this.tipoffType, resId: this.resId}, this.form, {
        shotImg: (this.form.shotImg.length && this.form.shotImg[0].path) || undefined
      })
      api.tipBack(subData, {context: this, successMsg: '举报成功！'})
        .then((res) => {
          this.form = {
            causeCate: '4001',
            cause: '',
            shotImg: [],
            validateCode: ''
          }
          this.imgvalue = []
          this.$refs.form.resetFields()
          this.dialogFormVisible = false
        })
    },
    ReportAction () {
      if (tools.getHeaders(window.document.cookie)) {
        this.dialogFormVisible = true
      } else {
        Vue.component('XLogin', function (resolve) {
          require(['@/pages/member/components/XLogin'], resolve)
        })
        this.$set(this.$store.state, 'loginDialog', true)
      }
    },
    handleClose (done) {
      this.form = {
        causeCate: '4001',
        cause: '',
        shotImg: [],
        validateCode: ''
      }
      this.imgvalue = []
      this.$refs.form.resetFields()
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
  
  .report-box{
    .divider{
      margin-bottom: 22px;
    }
    .report-button{
      color: $color-sub;
      &:hover{
        color: $color-primary;
      }
    }
  }
</style>

<style lang="scss">
  
  .report-box{
    textarea{
      height:132px;
    }
    .el-form-item__content>.el-textarea {
      width: 100%;
    }
    .el-dialog__body {
      padding: 20px 40px;
    }
  }
</style>
