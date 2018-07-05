<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/order/info' }">票务购买</el-breadcrumb-item>
      <el-breadcrumb-item>填写票务人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content ticket-box">
      <e-heading grade="1">票务人信息</e-heading>
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="姓名： " prop="name" :rules="[
                { required: true, message: '请填写真实姓名'}
              ]">
          <el-input v-model="form.name" placeholder="请填写真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="证件号码： " prop="idNo" :rules="[
                { required: true, message: '请输真实的证件号'},
                Object.assign({trigger: 'blur'}, validator.rule.idNo)
              ]">
          <el-input v-model="form.idNo" placeholder="请填写证件号码"></el-input>
        </el-form-item>
        <el-form-item label="手机号码： " prop="mobile" :rules="[
              { required: true, message: '请输入有效的手机号'},
              Object.assign({trigger: 'blur'}, validator.rule.mobile)
            ]">
          <el-input v-model="form.mobile" placeholder="请填写手机号码"></el-input>
        </el-form-item>
        <el-form-item label="详细地址： " prop="address" :rules="[
            { required: true, message: '请输入您的详细地址'}
          ]">
          <el-input :minlength="10" :maxlength="300" v-model="form.address" placeholder="请填写详细地址"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="button-box">
            <el-button type="primary" native-type="submit" :loading="loading">确认提交</el-button>
            <!--<el-button type="primary" native-type="submit" :loading="loading" @click="send()">确认提交</el-button>-->
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { form } from 'utils/mixins'
  import validator from 'utils/validator'
  import api from 'api/ticket'
  export default {
    mixins: [form],
    mounted () {
      api.orderGoodsOrder({
        orderNumber: this.$route.query.orderNumber
      }).then((res) => {
        if (res) {
          this.form.name = res.data.receiptUserName
          this.form.mobile = res.data.phone
          this.form.address = res.data.address
          this.form.orderNumber = res.data.orderNumber
          this.total = res.data.total
        }
      })
    },
    data () {
      return {
        validator,
        loading: false,
        total: '',
        dialogVisible: false,
        form: {
          name: '',
          mobile: '',
          idNo: '',
          address: '',
          orderNumber: '',
          obtainType: ''
        }
      }
    },
    methods: {
      submit () {
        api.sendTicket(this.form).then((res) => {
          if (this.total > 0) {
            this.$router.push({path: '/order/created', query: {orderNumber: this.$route.query.orderNumber}})
          } else {
            this.$router.push({path: '/order/success', query: {orderNumber: this.$route.query.orderNumber}})
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  
  .ticket-box{
    min-height:700px;
    .el-form .el-input{
      width: 660px;
    }
  }
  
</style>
