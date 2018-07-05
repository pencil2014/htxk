<template>
  <div class="exchange">
    <div class="form divider">
      <el-form ref="form" v-bind="getFormProps({labelWidth:'100px'})">
        <el-form-item label="输入兑换码" 
          prop="code"
          :rules="[
            { required: true, message: '兑换码不能为空', trigger: 'blur'}
           ]">
          <el-input v-model.trim="form.code"   placeholder="请输入兑换码" ></el-input>
        </el-form-item>
        <el-form-item label="图形验证码" 
          prop="imgcode"
          :rules="[
            { required: true, message: '验证码不能为空', trigger: 'blur'}
           ]">
           <e-img-code ref="imgcode" v-model="form.imgcode" action="/manage/sms/generateValidateCode" :params="{type: 11}" style="width:300px" />
        </el-form-item>
        <el-form-item label="">
          <el-button  type="primary"  native-type="submit" :loading="loading" class="btn">兑换</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tips">
      <b>操作提示：</b>
      <p>1、请输入已获得的优惠券兑换码领取优惠券券</p>
      <p>2、领取优惠券后可以在购买商品下单时选择符合使用条件的优惠券抵扣订单金额</p>
    </div>
  </div>
</template>
<script>
import api from 'api/coupon'
import {form} from 'utils/mixins'
import EImgCode from '@e-ui/ImgCode'
export default {
  mixins: [form],
  components: {
    EImgCode
  },
  methods: {
    // 提交兑换码
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.exchangeCode()
          this.$refs.imgcode.refresh()
        }
      })
    },
    // 领取兑换码
    exchangeCode () {
      api.exchangeCoupon({
        exchangeCode: this.form.code,
        validateCode: this.form.imgcode
      }, {successMsg: 'none', errorMsg: 'none'})
        .then((res) => {
          this.$message.success('优惠券兑换成功！')
          this.form.code = ''
          this.form.imgcode = ''
          this.$emit('exchangSuc')
        })
    }
  },
  data () {
    return {
      form: {
        code: '',
        imgcode: '',
        codeKey: ''
      },
      loading: false
    }
  }
}
</script>
<style lang="scss" scoped>
 
.exchange {
  .form {
    padding-bottom: 30px;
  }
  margin-top: 30px;
  .tips {
    font-size: 12px;
    padding-top: 20px;
    color: $color-sub;
    margin-bottom: 20px;
    b {
      display: block;
      margin-bottom: 10px;
    }
    p {
      line-height: 2.5;
    }
  }
  .btn {
    margin-top: 15px;
  }
}  
</style>