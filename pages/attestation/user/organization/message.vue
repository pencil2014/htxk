<template>
  <el-row class="content-message">
    <e-heading grade="1">填写资料</e-heading>
      <el-form :model="form" ref="form" :rules="rules" label-width="150px">
        <e-heading grade="2">组织信息</e-heading>
        <el-form-item label="证件类型："
            prop="idType"
            :rules="[
              { required: true, message: '请选择证件类型' }
            ]">
          <el-col :span="16">
            <el-select v-model="form.idType" placeholder="请选择证件类型" 
              :disabled="true">
              <el-option
              v-for="(item, index) in idTypeData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="证件号："
            prop="credentialNo"
            :rules="[
              { required: true, message: '请输入证件号' },
              { min: 15, max: 20, message: '长度在 15 到 20 个字符', trigger: 'blur' }
            ]">
          <el-col :span="16">
            <el-input placeholder="请输入证件号码" v-model="form.credentialNo"
              :disabled="(form.nameAuthStatus && userSection.authType != 1 ? true : false)"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="组织名称："
          prop="companyName"
            :rules="[
              { required: true, message: '请输入组织名称' },
              { min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'blur' }
            ]">
          <el-col :span="16">
            <el-input placeholder="请输入组织名称" v-model="form.companyName" 
              :disabled="(form.nameAuthStatus && userSection.authType != 1 ? true : false)"></el-input>
            <span class="tip">1、企业/政府/事业单位/媒体/学校：与《事业单位法人证书》或<br />《组织机构代码证》上名称一致</span>
          </el-col>
        </el-form-item>
        <el-form-item label="法人姓名："
            prop="legalPersonName"
            :rules="[
              { required: true, message: '法人姓名不能为空' },
              { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
            ]">
          <el-col :span="16">
            <el-input placeholder="请输入法人姓名" v-model="form.legalPersonName" 
              :disabled="(form.nameAuthStatus && userSection.authType != 1 ? true : false)"></el-input>
          </el-col>
        </el-form-item>
        <e-heading grade="2">上传企业基本资料</e-heading>
        <el-form-item label="组织机构代证码："
            prop="orgCertificateUrl"
            :rules="[
              { required: true, message: '图片不能为空' },
            ]">
          <el-col :span="16">
            <e-img-upload v-model="form.orgCertificateUrl"></e-img-upload>
            <span class="tip">组织机构代码必需在有效期范围内。
            <br>若办理过三证合一的企业无法提供组织机构代码证，则请上传最新的法人证书</span>
          </el-col>
        </el-form-item>
        <el-form-item label="企业公司营业执照  事业单位法人证书："
            prop="businessLicenseUrl"
            :rules="[
              { required: true, message: '图片不能为空' },
            ]">
          <el-col :span="20">
            <e-img-upload v-model="form.businessLicenseUrl"></e-img-upload>
            <span class="tip">事业单位法人证书必需在有效期范围内。
            <br>若属于事业单位媒体需要上传《事业单位法人证书》，若非事业单位则需上传《营业执照》。</span>
          </el-col>
        </el-form-item>
        <el-form-item label="其他证明材料： ">
          <el-col :span="20">
            <e-img-upload v-model="form.otherInfoUrl"></e-img-upload>
            <span class="tip">非事业单位的医疗机构，请上传《医疗机构执业许可证》。</span>
          </el-col>
        </el-form-item>
        <e-heading grade="2">运营者资料</e-heading>
        <el-form-item label="运营者姓名："
            prop="personName"
            :rules="[
              { required: true, message: '运营者姓名不能为空' },
              { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
            ]">
          <el-col :span="16">
            <el-input placeholder="请输入运营人员真实姓名(与身份证上的名称一致)" v-model="form.personName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号："
          prop="phone"
          :rules="[
            { required: true, message: '手机号不能为空' },
            Object.assign({trigger: 'blur'}, validator.rule.mobile)
          ]">
          <el-col :span="16">
            <el-input placeholder="请输入运营人员手机号" v-model="form.phone"></el-input>
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
          <el-col :span="14">
            <e-sms-code inline v-model="form.verifyCode" 
              :params="{randomKey: form.codeKey, account: form.phone, type: 7, validateCode: form.imgCode, extisted: true}"
              :btn-disabled="imgCodeSuccess? false : true"/>
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
  import { mapGetters, mapState } from 'vuex'
  import ESmsCode from '@e-ui/SmsCode'
  import EImgUpload from '@e-ui/ImgUpload'
  import EImgCode from '@e-ui/ImgCode'
  import api from 'api/attestation'
  import validator from 'utils/validator'
  import userApi from 'api/user'
  import { form } from 'utils/mixins'
  export default {
    mixins: [form],
    layout: 'manage',
    components: {
      EImgUpload,
      ESmsCode,
      EImgCode
    },
    props: {
      activeChange: {
        type: Function
      }
    },
    computed: {
      ...mapGetters({
        form: 'org_form'
      }),
      ...mapState({
        userSection: state => state.user.session
      })
    },
    created () {
      this.activeChange(3)
      if (this.editId) {
        this.orgInfoFn(true)
      } else {
        this.orgInfoFn()
        this.ifChange()
      }
    },
    destroyed () {
      // 关闭时候清空vuex
      if (this.editId) {
        this.$store.commit('SET_ORG_FORM')
      }
    },
    data () {
      let self = this
      return {
        imgCodeSuccess: false,
        editId: this.$route.query.edit,
        validator,
        loading: false,
        orgInfoData: '',
        idTypeData: [{
          value: 1,
          label: '工商注册号'
        }, {
          value: 2,
          label: '社会统一信用代码'
        }],
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
        this.$router.go(-1)
      },
      submit () { // 提交表单
        let formData = Object.assign({}, this.form)
        console.log(this.form)
        api.orgInsert(formData, {content: this, successMsg: 'none'}).then((json) => {
          let status = parseInt(json.result)
          this.$router.push({path: '/attestation/user/organization/commit', query: {status: status}})
        })
      },
      orgInfoFn (edit) { // 组织信息四要素
        api.orgInfo(' ', {context: this, successMsg: 'none'}).then((json) => {
          if (json.data && json.data.authStatus === 1) {
            this.orgInfoData = json.data
            this.form.idType = json.data.idType || 2
            this.form.credentialNo = json.data.credentialNo || ''
            this.form.companyName = json.data.companyName || ''
            this.form.legalPersonName = json.data.legalPersonName || ''
            this.form.authCateId = json.data.authCateId || ''
            this.form.nameAuthStatus = 1
          } else {
            this.form.nameAuthStatus = 0
          }
          if (edit) {
            this.$store.dispatch('get_org_detail', {
              idType: json.data.idType ? json.data.idType : 2,
              credentialNo: json.data.credentialNo ? json.data.credentialNo : '',
              companyName: json.data.companyName ? json.data.companyName : '',
              legalPersonName: json.data.legalPersonName ? json.data.legalPersonName : ''
            })
          }
        })
      },
      ifChange () { // 在填写信息的过程中如果刷新了页面就要跳回到选择认证类型页
        if (!this.form.authCateId) {
          this.$router.push({path: '/attestation/user/organization/type'})
        }
      }
    }
  }
</script>

<style lang="scss">
  
  .content-message{
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
    .el-select{
      width:100%;
    }
    .tip {
      display: inline-block;
      color: #999;
      font-size: 12px;
      white-space: normal;
      width: 500px;
      line-height: 20px;
      margin-top: 5px;
      margin-bottom: 0px;
      margin-left: 10px;
    }
  }

</style>
