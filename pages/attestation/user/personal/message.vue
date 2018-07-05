<template>
  <el-row class="content-message">
    <e-heading grade="1">填写资料</e-heading>
      <el-form :model="form" ref="form" :rules="rules" label-width="150px">
        <el-form-item label="姓名："
            prop="personName"
            :rules="[
              { required: true, message: '姓名不能为空' },
              { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
            ]">
          <el-col :span="16">
            <el-input placeholder="请输入姓名" v-model="form.personName" :disabled="nameLock"></el-input>
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="身份证号："
            prop="idNo"
            :rules="[
              { required: true, message: '请输真实的证件号'},
              Object.assign({trigger: 'blur'}, validator.rule.idCard)
            ]">
          <el-col :span="16">
            <el-input placeholder="请输入身份证号码" v-model="form.idNo"></el-input>
          </el-col>
        </el-form-item> -->
        <el-form-item label="身份证号："
            prop="idNo"
            :rules="[
              { required: true, message: '请输真实的证件号'}
            ]">
          <el-col :span="16">
            <el-input placeholder="请输入身份证号码" v-model="form.idNo" :disabled="nameLock"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号："
          prop="phone"
          :rules="[
            { required: true, message: '手机号不能为空' },
            Object.assign({trigger: 'blur'}, validator.rule.mobile)
          ]">
          <el-col :span="16">
            <el-input placeholder="请输入手机号" v-model="form.phone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="图片验证码：" prop="imgCode">
          <el-col :span="16">
            <div class="code-box"><e-img-code ref="imgCode" :params="{type: 2}" v-model="form.imgCode" :img-key.sync="form.codeKey"/></div><span @click="$refs.imgCode.refresh()" class="changeImg">看不清？换张图</span>
          </el-col>
        </el-form-item>
        <el-form-item label="手机验证码："
            prop="verifyCode"
            :rules="[
              { required: true, message: '验证码不能为空'}
            ]">
          <el-col :span="16">
            <e-sms-code inline v-model="form.verifyCode" 
              :params="{randomKey: form.codeKey, account: form.phone, type: 11, validateCode: form.imgCode, extisted: true}"
              :btn-disabled="imgCodeSuccess? false : true"/>
          </el-col>
        </el-form-item>
        <el-form-item label="手持身份证正面照： " 
              prop="idcardUrl"
              :rules="[
                { required: true, message: '图片不能为空'},
              ]">
          <el-col :span="24">
            <span class="tip">请上传清晰的中华人民共和国居民身份证照片或扫描件，无居民身份证的内地居民可提交<br />《临时居民身份证》。外国居民，请上传《外国人居留证》或《外国人临时居留证》</span>
            <el-row :gutter="20">
              <el-col :span="6">
                <img src="/images/attestation/idcard.png" @click="handle" class="handle">
                <e-preview v-if="visible" :visible="true" :index="index" :list="banners" @close="handleClose"/>
              </el-col>
              <el-col :span="6"><e-img-upload v-model="form.idcardUrl" /></el-col>
              <el-col :span="12" class="tip">上传原件照片或者扫描件，支持<br />.jpg .jpeg .bmp .png .gif格式照片，<br />大小不超过5M</el-col>
            </el-row>
          </el-col>
        </el-form-item>
        <el-form-item label="其他证明材料(选填)： " >
          <el-col :span="20">
            <span class="tip">可以上传其它能证明个人身份的证件照片或扫描件。如工牌、学生证等。</span>
            <e-img-upload v-model="form.ortherUrl"></e-img-upload>
          </el-col>
        </el-form-item>
        <div class="button-box">
          <el-button type="default" @click="toLastStep()" v-if="!editId">上一步</el-button>
          <el-button type="primary" native-type="submit" :loading="loading">提交信息</el-button>
        </div>
      </el-form>
  </el-row>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ESmsCode from '@e-ui/SmsCode'
  import EImgCode from '@e-ui/ImgCode'
  import EImgUpload from '@e-ui/ImgUpload'
  import EPreview from '@e-ui/Preview'
  
  import validator from 'utils/validator'
  import api from 'api/attestation'
  import userApi from 'api/user'
  import { form } from 'utils/mixins'
  export default {
    mixins: [form],
    layout: 'manage',
    components: {
      EImgUpload,
      EImgCode,
      ESmsCode,
      EPreview
    },
    props: {
      activeChange: {
        type: Function
      }
    },
    computed: {
      ...mapGetters({
        form: 'user_form'
      })
    },
    mounted () {
      this.activeChange(3)
      // this.ifChange()
      if (this.editId) {
        api.getNamePersonDetail({}, {context: this, successMsg: 'none'}).then((json) => {
          if (json.data && json.data.nameAuthStatus === 1) {
            this.nameLock = true
            this.$store.dispatch('get_user_detail', {personName: json.data.idName ? json.data.idName : '', idNo: json.data.idNo ? json.data.idNo : ''})
          } else {
            this.$store.dispatch('get_user_detail')
          }
        })
      } else {
        this.ifChange()
        api.getNamePersonDetail({}, {context: this, successMsg: 'none'}).then((json) => {
          if (json.data && json.data.nameAuthStatus === 1) {
            this.form.personName = json.data.idName ? json.data.idName : ''
            this.form.idNo = json.data.idNo ? json.data.idNo : ''
            this.nameLock = true
          }
        })
      }
    },
    destroyed () {
      // 关闭时候清空vuex
      if (this.editId) {
        this.$store.commit('SET_USER_FORM')
      }
    },
    data () {
      let self = this
      return {
        index: 0,
        nameLock: false,
        visible: false,
        editId: this.$route.query.edit,
        validator,
        loading: false,
        imgCodeSuccess: false,
        banners: [
          '/images/attestation/idcard2.png'
        ],
        rules: {
          imgCode: [
            { required: true, message: '图片验证码不能为空' },
            {
              validator (rule, value, callback) {
                self.imgCodeSuccess = false
                if (value) {
                  if (value.trim()) {
                    userApi.checkImgCode({
                      randomKey: self.form.codeKey,
                      imgValidateCode: self.form.imgCode,
                      type: 2
                    }).then((res) => {
                      if (res.data) {
                        self.imgCodeSuccess = true
                        callback()
                      } else {
                        self.$refs.imgCode.refresh()
                        callback(new Error('图片验证码错误，请重新输入'))
                      }
                    }).catch((ERR) => {
                      self.$refs.imgCode.refresh()
                      callback(new Error('图片验证码错误，请重新输入'))
                    })
                  }
                } else {
                  callback(new Error('请输入图片验证码'))
                }
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      toLastStep () {
        if (this.form.ipCateIdArray.length === 3) {
          this.$router.go(-1)
        } else {
          this.$router.go(-2)
        }
      },
      handle () {
        this.visible = true
      },
      handleClose () {
        this.visible = false
      },
      submit () {
        let formdata = Object.assign({}, this.form) // 复制一个新的数据对象
        if (!this.editId) {
          formdata.ipCateId = formdata.ipCateIdArray[formdata.ipCateIdArray.length - 1].ipCateId
          delete formdata.ipCateIdArray
        }
        api.userAttest(formdata, {context: this, successMsg: 'none'}).then((json) => {
          let status = parseInt(json.result)
          this.$router.push({path: '/attestation/user/personal/commit', query: {status: status}})
        })
      },
      ifChange () { // 在填写信息的过程中如果刷新了页面就要跳回到选择认证类型页
        if (!this.form.ipCateIdArray[0].ipCateId) {
          this.$router.push({path: '/attestation/user/personal/classify/steps-1'})
        }
      }
    }
  }
</script>

<style lang="scss">
  
  .content-message{
    .handle{
      cursor: pointer;
    }
    .code-box{
      width:62%;
      float: left;
    }
    .changeImg{
      float: left;
      cursor:pointer;
      margin-left: 10px;
      color:$color-primary;
    }
    .tip {
      display: block;
      color: #999;
      font-size: 12px;
      white-space: normal;
      line-height: 20px;
      margin-bottom: 20px;
      margin-top:10px;
    }
  }

</style>
