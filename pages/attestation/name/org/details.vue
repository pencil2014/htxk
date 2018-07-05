<template>
  <div class="content-details">
    <e-heading grade="1">查看资料</e-heading>
    <div class="statusinfo">
      <p>当前认证状态： <strong>{{form.authStatus == '1' ? '已认证':'未认证'}}</strong></p>
    </div>
    <e-heading grade="2">认证资料</e-heading>
    <div class="details-con">
      <el-row>
        <el-form label-width="150px">
          <el-form-item label="证件类型：">
            <p v-if="form.idType">{{form.idType === 1 ? '工商注册号' : '社会统一信用代码 '}}</p>
            <p v-else>--</p>
          </el-form-item>
          <el-form-item label="证件号：">
            <p>{{form.credentialNo}}</p>
          </el-form-item>
          <el-form-item label="法人身份证号码：">
            <p>{{form.legalPersonId}}</p>
          </el-form-item>
          <el-form-item label="组织名称：">
            <p>{{form.companyName}}</p>
          </el-form-item>
          <el-form-item label="法人姓名：">
            <p>{{form.legalPersonName}}</p>
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
        form: {}
      }
    },
    methods: {
      details () {
        api.getNameOrgDetail('', {context: this, successMsg: 'none'}).then((json) => {
          this.form = json.data
        })
      }
    }
  }
</script>

<style lang="scss">
  
  .content-details{
    .statusinfo{
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
