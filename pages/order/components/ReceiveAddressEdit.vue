<template>
  <el-form v-bind="getFormProps({labelWidth:'100px'})" ref="form">
    <el-form-item 
      label="姓名"
      prop="consignee"
      :rules="[
        { required: true, message: '姓名不能为空'}
      ]">
      <el-input v-model="form.consignee" v-focus/>
    </el-form-item>
    <el-form-item
      label="手机号码"
      prop="mobile"
      :rules="[
        { required: true, message: '手机号码不能为空'},
        validator.rule.mobile
      ]"
     >
      <el-input v-model="form.mobile"/>
    </el-form-item>
    <el-form-item
      label="所在地区"
      prop="city"
      :rules="[
        { required: true, message: '所在地区不能为空'}
      ]"
    >
      <e-address-cascader v-model="address"/>
    </el-form-item>
    <el-form-item
      label="详细地址"
      prop="detailAddress"
      :rules="[
        { required: true, message: '详细地址不能为空'}
      ]"
    >
      <el-input style="width:100%" type="textarea" v-model="form.detailAddress"/>
    </el-form-item>
    <el-form-item label="" style="margin-top:-10px">
      <el-checkbox v-model="form.isDefaultAddress">设置默认收货地址</el-checkbox>
    </el-form-item>
    <div class="el-dialog__buttons tc">
      <el-button native-type="submit" type="primary" :loading="loading">确认</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-form>
</template>
<script type="text/javascript">
  import userApi from 'api/user'
  import {form} from 'utils/mixins'
  import EAddressCascader from '@e-ui/AddressCascader'
  import validator from 'utils/validator'
  export default {
    components: {EAddressCascader},
    mixins: [form],
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      address: {
        get () {
          return this.form.prov ? [this.form.prov, this.form.city, this.form.dist] : []
        },
        set (value) {
          this.form.prov = value[0]
          this.form.city = value[1]
          if (value[2]) {
            this.form.dist = value[2]
          } else {
            delete this.form.dist
          }
        }
      }
    },
    watch: {
      data (value) {
        this.form = Object.assign({}, value)
      }
    },
    data () {
      return {
        loading: false,
        form: Object.assign({}, this.data),
        validator
      }
    },
    methods: {
      submit () {
        let data = Object.assign({}, this.form)
        data.isDefaultAddress = data.isDefaultAddress ? 1 : 0
        userApi.editReceiveAddress(data, {context: this}).then((data) => {
          this.$emit('success')
        })
      },
      handleCancel () {
        this.$emit('cancel')
      }
    }
  }
</script>
<style type="text/css" lang="scss">
  
 
</style>
