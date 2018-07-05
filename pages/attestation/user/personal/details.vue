<template>
  <div class="content-details">
    <e-heading grade="1">查看资料</e-heading>
    <div class="status-wrap">
      <p>当前认证状态： <strong>{{form.authStatus | authStatus}}</strong></p>
    </div>
    <e-heading grade="2">个人资料</e-heading>
    <div class="details-con">
      <el-row>
        <el-form label-width="150px">
          <el-form-item label="姓名：">
            {{form.personName}}
          </el-form-item>
          <el-form-item label="身份证号：">
            {{form.idNo}}
          </el-form-item>
          <el-form-item label="手持身份证正面照：">
            <p v-if="form.idcardUrl">
              <img :src="form.idcardUrl" alt="" />
            </p>
            <p v-else>--</p>
          </el-form-item>
          <el-form-item label="其他证明材料(选填)：">
            <p v-if="form.ortherUrl">
              <img :src="form.ortherUrl" alt="" />
            </p>
            <p v-else>--</p>
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
        api.userDetail(' ', {context: this, successMsg: 'none'}).then((json) => {
          this.form = json.data
          if (json.data.dataList[0].dataType === 2) {
            this.form.idcardUrl = json.data.dataList[0].filePath
          } else {
            this.form.ortherUrl = json.data.dataList[0].filePath
          }
          if (json.data.dataList[1].dataType === 2) {
            this.form.idcardUrl = json.data.dataList[1].filePath
          } else {
            this.form.ortherUrl = json.data.dataList[1].filePath
          }
          console.log(this.form, 333)
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
