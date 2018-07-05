<template>
  <div class="content-details">
    <e-heading grade="1">查看资料</e-heading>
    <div class="statusinfo">
      <p>当前认证状态： <strong>{{form.nameAuthStatus == '1' ? '已认证':'未认证'}}</strong></p>
    </div>
    <e-heading grade="2">认证资料</e-heading>
    <div class="details-con">
      <el-row>
        <el-form label-width="150px">
          <el-form-item label="持卡人姓名：">
            <p>{{form.idName}}</p>
          </el-form-item>
          <el-form-item label="身份证号：">
            <p>{{form.idNo}}</p>
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
        api.getNamePersonDetail('', {context: this, successMsg: 'none'}).then((json) => {
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
