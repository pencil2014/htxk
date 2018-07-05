<template>
  <div class="content-details">
    <e-heading grade="1">查看资料</e-heading>
    <div class="status-wrap">
      <p>当前认证状态： <strong>{{form.authStatus | authStatus}}</strong></p>
    </div>
    <e-heading grade="2">组织资料</e-heading>
    <div class="details-con">
      <el-row>
        <el-form label-width="150px">
          <el-form-item label="证件类型：">
            <p v-if="form.idType">{{form.idType === 1 ? '工商注册号' : '社会统一信用代码 '}}</p>
            <p v-else>--</p>
          </el-form-item>
          <el-form-item label="证件号：">
            <!-- <p>{{form.credentialNo ? form.credentialNo : '-- '}}</p> -->
            <p>{{form.credentialNo}}</p>
          </el-form-item>
          <el-form-item label="组织名称：">
            <p>{{form.companyName}}</p>
          </el-form-item>
          <el-form-item label="法人名称：">
            <p>{{form.legalPersonName}}</p>
          </el-form-item>
          <el-form-item label="组织机构代码证：">
              <img v-if="form.orgCertificateUrl" :src="form.orgCertificateUrl" alt="" />
              <p v-else>--</p>
          </el-form-item>
          <el-form-item>
            <template slot="label">企业公司营业执照/<br />事业单位法人证书/<br />团体登记证书(选填)：</template>
            <img v-if="form.businessLicenseUrl" :src="form.businessLicenseUrl" alt="" />
            <p v-else>--</p>
          </el-form-item>
          <el-form-item label="其他证明材料(选填)：">
            <img v-if="form.otherInfoUrl" :src="form.otherInfoUrl" alt="" />
            <p v-else>--</p>
          </el-form-item>
          <e-heading grade="2">运营者资料</e-heading>
          <el-form-item label="姓名：">
            <!-- <p>{{form.personName ? form.personName : '-- '}}</p>  -->
            <p>{{form.personName}}</p>
          </el-form-item>
          <el-form-item label="手机号：">
            <p>{{form.phone}}</p>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
  import api from 'api/attestation'
  export default {
    created () {
      this.details()
    },
    data () {
      return {
        form: ''
      }
    },
    methods: {
      details () {
        api.getUserOrgDetail({purpose: 0}, {context: this, successMsg: 'none'}).then((json) => {
          this.form = json.data
          console.log(this.form, 423423423)
        })
      }
    }
  }
</script>

<style lang="scss">
  
  .content-details{
    .status-wrap{
      padding:20px 30px;
      background:$color-background-sub;
    }
    .el-form-item{
      img{
        margin-right: 25px;
        width:200px;
      }
    }
  }
</style>
