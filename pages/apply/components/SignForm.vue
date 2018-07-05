<template>
  <el-form class="sign-form" v-bind="getFormProps()" ref="form" label-width="100px">
    <el-form-item label="姓名" 
      prop="commingName"
      :rules="[
      { required: true,  message: '请填写真实姓名'},
      Object.assign({}, validator.rule.username)
      ]">
      <el-input class="normal-input" v-model="form.commingName" :maxlength="10" placeholder="请填写真实姓名">
      </el-input>
    </el-form-item>
    <el-form-item label="性别"
      style="text-align:left;"
      prop="sex"
      :rules="{ required: true,  message: '请选择性别'}">
      <el-radio v-for="item in genderList" class="radio" v-model="form.sex" :label="item.value" :key="item.value">
        {{item.label}}
      </el-radio>
    </el-form-item>
    <el-form-item label="证件号码"
      prop="idNo"
      :rules="[{ required: true,  message: '请输入真实有效证件号码'},
              Object.assign({}, validator.rule.idNo, {trigger:'blur'})
      ]">
      <el-input class="normal-input"  v-model="form.idNo" :maxlength="30" placeholder="请输入证件号码">
      </el-input>
    </el-form-item>
    <el-form-item label="手机号码"
      prop="linkPhone"
      :rules="[
        { required: true,  message: '请输入手机号码'},
        Object.assign({}, validator.rule.mobile,{trigger:'blur'})
        ]">
      <el-input class="normal-input" @blur="checkPhone()" v-model="form.linkPhone" :maxlength="11" placeholder="请输入手机号码">
      </el-input>
    </el-form-item>
    <el-form-item label="出生日期"
      prop="birthday"
      :rules="{ required: true,  message: '请选择出生日期'}">
      <el-date-picker
        class="normal-input"
        v-model="form.birthday"
        type="date"
        placeholder="选择日期"
        :picker-options="pickerOption">
      </el-date-picker>
    </el-form-item>
    <el-form-item 
      v-for="(item, index) in form.extFields" :key="item.fieldText"
      :label="item.fieldText"
      :prop="`${'extFields'}.${index}.value`"
      :rules="[
        { required: item.isRequired,  message: `请${item.showModel==1?'选择':'输入'}${item.fieldText}`},
        checkCode
        ]">
        <el-select
          class="normal-input"
          v-if="item.showModel==1"
          v-model="item.value"
          :placeholder="`请选择${item.fieldText}`"
          @change="value => item.valueText = value">
          <el-option v-for="item in item.listData" :key="item.value" :label="item.text" :value="item.text" />
        </el-select>
        <el-input 
          v-else
          class="normal-input"
          v-model.trim="item.value"
          :maxlength="item.maxlength"
          :placeholder="`请输入${item.fieldText}`"
          @change="value => item.valueText = value">
        </el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="isAgree">同意《<router-link to="/apply/agreement" class="link" target="_blank">赛事报名协议</router-link>》</el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" size="large" class="large-submit" :loading="loading" :disabled="!isAgree">提交</el-button>
    </el-form-item>
    <slot></slot>
  </el-form>
</template>

<script>
import validator from 'utils/validator'
import ElDatePicker from '@element-ui/DatePicker'
import {form} from 'utils/mixins'
export default {
  props: {
    formData: {
      type: Object
    },
    agreeVisible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean
    },
    pickerOption: {
      type: Object
    }
  },
  mixins: [form],
  components: {
    ElDatePicker
  },
  data () {
    var checkStr = (rule, value, callback) => {
      if (!/^[\u4e00-\u9fa5a-zA-Z0-9@]*$/.test(value)) {
        callback(new Error('只能输入中英文、数字、@符号'))
      } else {
        callback()
      }
    }
    return {
      isAgree: false,
      checkCode: { validator: checkStr, trigger: 'blur' },
      form: this.formData,
      genderList: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ],
      validator,
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.form)
    },
    checkPhone () {
      this.$emit('checkPhone', this.form.linkPhone)
    }
  }
}
</script>

<style scoped lang="scss">
.form-item{
  text-align: left;
}
.normal-input{
  width: 462px;
}
</style>
