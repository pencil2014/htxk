<template>
  <div>
    <!-- <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/activity' }" >个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>意见反馈</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class='content suggestion-box'  >
      <e-heading grade="1">意见反馈</e-heading>
      <div class="divider"></div>
      <div class='form-box'>
        <el-form   
        v-bind="getFormProps({labelWidth:'0px'})"
        ref="form" 
        :rules='rules'
        :model="form"  >
          <div class='suggestion-text'>为了给您提供更好的服务，我们希望收集您使用求苗时的看法或建议。感谢您的反馈！</div>
          <el-form-item label=""
            class="bg-gray content-box"
            prop="content"
          >
            <el-input 
              class='textarea-box'
              type="textarea"
              resize='none'
              :maxlength='200' 
              v-model="form.content" 
              placeholder="反馈您使用中，遇到的问题吧~"
              number-word />
          </el-form-item>
          <el-form-item class="upload-img" label="" >
            <div class="upload-img-tips">
              请添加截图或图片，若有
              <span >（只能上传jp(e)g/png文件，且每张不超过1M，6张以内）</span>
            </div>
            <e-img-group-upload :size='1024 * 1024' :imgList.sync="form.imgs"   v-model="imgvalue"  :limit='6'  />
          </el-form-item>

          <div class='tel'>联系方式（选填）</div>
          <el-form-item class='tel-num' label=""
            prop="contactWay" >
            <el-input   v-model="form.contactWay"   placeholder="请输入联系方式~"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="loading" >提交反馈</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api/user'
import {form} from 'utils/mixins'
import EImgGroupUpload from '@e-ui/ImgGroupUpload'
import validator from '@/utils/validator'

export default {
  mixins: [form],
  layout: 'manage',
  components: {
    EImgGroupUpload
  },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (value === '') { // 可以为空
        return callback()
      }
      if (value.match(validator.pattern.phone)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    return {
      loading: false, // 必需要返回loading
      imgvalue: [],
      form: {
        content: '',
        imgs: [],
        contactWay: ''
      },
      rules: {
        content: [
          {required: true, message: '请输入您使用中，遇到的问题吧~'},
          {min: 5, max: 200, message: '感谢您的反馈（5 ~ 200 个字符）'}
        ],
        imgs: [],
        contactWay: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      let subData = Object.assign({}, this.form, {
        imgs: this.form.imgs.map(k => k.path)
      })
      api.submitFeedback({param: JSON.stringify(subData)}, {context: this, successMsg: '反馈提交成功！'})
    }
  }
}
</script>

<style lang="scss" scoped>
  
  .suggestion-box{
    .form-box{
      .suggestion-text{
        padding:60px 0 20px;
        font-size:16px;
        line-height: 16px;
      }
    }
    .content-box{
      margin-bottom: 30px;
    }
    .upload-img{
      margin-bottom: 30px;
    }
    .upload-img-tips{
      height: 14px;
      line-height:14px;
      span{
        color: $color-sub;
      }
    }
    .tel{
      line-height:14px;
      margin-bottom: 10px;
    }
    .tel-num{
      margin-bottom: 24px;
    }
  }
</style>

<style lang="scss">
  
  .suggestion-box{
    textarea{
      height:150px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-input{
      width:100%;
    }
  }
</style>
