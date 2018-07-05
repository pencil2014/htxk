<template>
  <div class='report-box'>
    <el-button type="text" @click="dialogFormVisible = true" class="report-button">
      <i class="icon iconfont icon-jubao"></i>
      举报
    </el-button>

    <el-dialog title="举报" size="large" :visible.sync="dialogFormVisible">
      <div class="divider"></div>
      <div class='form-box'>
        <el-form ref="form"  
          v-bind="getFormProps({labelWidth:'100px'})"
          :rules='rules'
          :model="form"  
        >
          <el-form-item label="举报原因：" 
            prop="reportReason"  
          >
            <el-radio-group v-model="form.reportReason">
              <el-radio label="淫秽色情"></el-radio>
              <el-radio label="涉嫌欺诈"></el-radio>
              <el-radio label="人身攻击"></el-radio>
              <el-radio label="营销广告"></el-radio>
              <el-radio label="其他"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="其他原因："
            class="bg-gray otherReason-box"
            prop="otherReason"
          >
            <el-input 
              class='textarea-box'
              type="textarea"
              resize='none'
              :maxlength='200' 
              v-model="form.otherReason" 
              number-word />
          </el-form-item>
          <el-form-item class="upload-img" label="上传截图:" >
            <e-img-group-upload  :size='1024 * 1024'   v-model="form.imgs"  :limit='1'  />
          </el-form-item>
          <el-form-item class='verification-code' label="验证码:"
            prop="verificationCode" >
            <!-- 图形验证码的获取接口 -->
            <e-img-code ref="form.verificationCode" v-model="form.verificationCode" action="/manage/sms/generateValidateCode" :params="{type: 11}" style="width:300px" />
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
import {form} from 'utils/mixins'
import EImgGroupUpload from '@e-ui/ImgGroupUpload'
import EImgCode from '@e-ui/ImgCode'

export default {
  mixins: [form],
  layout: 'manage',
  components: {
    EImgGroupUpload,
    EImgCode
  },
  data () {
    return {
      dialogFormVisible: false,
      loading: false, // 必需要返回loading
      form: {
        reportReason: '',
        otherReason: '',
        imgs: [],
        verificationCode: ''
      },
      rules: {
        reportReason: [{required: true, message: '请选择举报原因'}],
        otherReason: [
          {required: true, message: '欢迎提出您在使用过程中遇到的问题或宝贵意见。'},
          {min: 5, max: 200, message: '感谢您的反馈（5 ~ 200 个字符）'}
        ],
        imgs: [],
        verificationCode: [{required: true, message: '请输入验证码'}]
      }
    }
  },
  mounted () {
  },
  methods: {
    submit () {
      api.List(JSON.stringify(this.form), {context: this, successMsg: '举报成功！'})
        .then((res) => {
          this.dialogFormVisible = false
          this.$refs.form.resetFields()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~styles/var';
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
  @import '~styles/var';
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
