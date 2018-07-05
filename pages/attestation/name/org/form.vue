<template>
  <div class="" >
    <e-heading grade="1">实名认证</e-heading>
    <el-form ref="form" label-width="150px" :rules="rules" :model="form">
      <el-form-item label="证件类型：" prop="idType" :rules="{ required: true, message: '品牌名称不能为空'}">
        <el-col :span="20">
          <el-select
            class="input-block"
            v-model="form.idType"
            placeholder="选择证件类型"
            :disabled = "true">
            <el-option
              v-for="(item, index) in idType"
              :key="index"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="证件号：" prop="credentialNo" 
        :rules="[
          { required: true, message: '请输入证件号码' },
          { min: 15, max:20, message: '请输入正确的证件号码' }
        ]">
        <el-col :span="20">
          <el-input v-model="form.credentialNo" placeholder="请输入证件号码" :disabled = "formLock"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="组织名称：" prop="companyName" 
        :rules="[
          { required: true, message: '请输入企业全称' },
          { min: 4, max:50, message: '请输入正确的企业全称' }
        ]">
        <el-col :span="20">
          <el-input v-model="form.companyName" placeholder="请输入企业全称" :disabled = "formLock"></el-input>
          <span class="tip">1、企业/政府/事业单位/媒体/学校：与《事业单位法人证书》或<br />《组织机构代码证》上名称一致</span>
        </el-col>
      </el-form-item>
      <el-form-item label="法人姓名：" prop="legalPersonName" 
        :rules="[
          { required: true, message: '请输入法人姓名'},
          { min: 2, max:40, message: '请输入2-40个字符' }
        ]">
        <el-col :span="20">
          <el-input v-model="form.legalPersonName" placeholder="请输入法人姓名" :disabled = "formLock"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="证件号：" prop="legalPersonId" 
        :rules="[
          { required: true, message: '请输入身份证号码'},
          validator.rule.idCard
        ]">
        <el-col :span="20">
          <el-input v-model="form.legalPersonId" placeholder="请输入身份证号码"></el-input>
        </el-col>
      </el-form-item>
      <div class="button-box">
        <el-button type="primary" :loading="loading" native-type="submit">确定</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
  import api from 'api/attestation'
  import validator from 'utils/validator'
  import {form} from 'utils/mixins' // 引入form mixin
  export default {
    mixins: [form],
    components: {
    },
    props: {
    },
    data () {
      return {
        validator,
        loading: false,
        formLock: false,
        form: {
          idType: 2, // 证件类型
          credentialNo: '', // 证件号
          companyName: '', // 组织名称
          legalPersonName: '', // 法人姓名
          legalPersonId: '' // 证件号
        },
        idType: [
          {
            value: 1,
            label: '工商注册号'
          },
          {
            value: 2,
            label: '社会统一信用代码'
          }
        ],
        rules: {
        }
      }
    },
    mounted () {
      api.getUserOrgDetail({purpose: 0}, {contexts: this, successMsg: 'none'}).then((res) => {
        const data = res.data || {}
        if (data.authStatus === 3) {
          this.form.idType = data.idType ? data.idType : 2
          this.form.credentialNo = data.credentialNo ? data.credentialNo : ''
          this.form.companyName = data.companyName ? data.companyName : ''
          this.form.legalPersonName = data.legalPersonName ? data.legalPersonName : ''
          this.formLock = true
        }
      })
    },
    methods: {
      submit () {
        api.realAuthOrg(this.form, {contexts: this, successMsg: 'none'}).then((res) => {
          this.$store.dispatch('user/user_all_info')
          this.$router.push({path: '/attestation/name'})
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
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
</style>
