<template>
  <div class="singup-form">
    <el-form ref="form" v-bind="getFormProps()" :model="form">
      <el-form-item label="姓名：" prop="name" :rules="[
          { required: true, message: '请填写真实姓名'},
          Object.assign({trigger: 'blur'}, validator.rule.userName)
        ]">
        <el-input :maxlength="10" v-model.trim="form.name" placeholder="请填写真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="sex" v-if="isSex" :rules="[
          { required: true, message: '请选择真实的性别'},
        ]">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="证件号码" prop="idNo" v-if="isIdNo" :rules="[
          { required: true, message: '请输入有效证件号码'},
          Object.assign({trigger: 'blur', validator: validator.rule.idNo})
        ]">
        <e-identity :maxlength="30" style="width: 54%" :select-value.sync="form.idType" v-model="form.idNo" />
      </el-form-item>
      <el-form-item label="出生日期：" prop="birthday" v-if="isBirthday" :rules="[
          { required: true, message: '请选择出生日期'}
        ]">
        <el-date-picker
          :editable="true"
          v-model="form.birthday"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="监护人手机：" prop="parentMobile" :rules="[
          { required: true, message: '请输入手机号'},
          Object.assign({trigger: 'blur'}, validator.rule.mobile)
        ]">
          <el-input v-model="form.parentMobile" :maxlength="11" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="国籍：" prop="nationality" v-if="isNationality" :rules="[
          { required: true, message: '请选择国籍'},
        ]">
        <el-select v-model="form.nationality" placeholder="请选择国籍" style="width: 54%" filterable>
          <el-option v-for="item in countryList" :key="item.id" :value="item.countryCode" :label="item.countryChineseName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="籍贯：" prop="origin" v-if="isOrigin" :rules="[
          { required: true, message: '请填写学员的籍贯'}
        ]">
        <e-address-cascader v-model="form.origin" :label.sync="form.addressLabel" :grade="2" placeholder="请选择籍贯"/>
      </el-form-item>
      <el-form-item label="电子邮件：" prop="email" v-if="isEmail" :rules="[
          { required: true, message: '请填写学员的电子邮件'}
        ]">
        <el-input :maxlength="100" v-model.trim="form.email" placeholder="请填写学员的电子邮件"></el-input>
      </el-form-item>
      <el-form-item label="民族：" prop="nation" v-if="form.nationality === '100000' && isNation" :rules="[
          { required: true, message: '请填写学员的民族'}
        ]">
        <el-input :maxlength="200" v-model.trim="form.nation" placeholder="请填写学员的民族"></el-input>
      </el-form-item>
      <el-form-item label="身高：" prop="height" v-if="isHeight" :rules="[
          { required: true, message: '请填写学员的身高'},
          Object.assign({validator: checkNum, trigger: 'blur'})
        ]">
        <el-input-number :max="999" v-model="form.height" placeholder="请填写学员的身高" >
          <template slot="append">CM</template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="体重：" prop="weight" v-if="isWeight" :rules="[
          { required: true, message: '请填写学员的体重'},
          Object.assign({validator: checkNum, trigger: 'blur'})
        ]">
        <el-input-number :max="999" :bit="0.01" v-model="form.weight" placeholder="请填写学员的体重"  >
          <template slot="append">KG</template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="运动项目：" prop="sportItem" v-if="isSportItem" :rules="[
          { required: true, message: '请填写学员的运动项目'}
        ]">
        <el-input :maxlength="200" v-model.trim="form.sportItem" placeholder="请填写学员的运动项目"></el-input>
      </el-form-item>
      <el-form-item label="专业特点：" prop="trait" v-if="isTrait" :rules="[
          { required: true, message: '请填写学员的专业特点或特色'}
        ]">
        <el-input :maxlength="200" v-model.trim="form.trait" placeholder="请填写学员的专业特点或特色"></el-input>
      </el-form-item>
      <el-form-item label="所获奖项：" prop="awardsItem" v-if="isAwardsItem" :rules="[
          { required: true, message: '请填写学员所获得的奖项'}
        ]">
        <el-input :maxlength="200" v-model.trim="form.awardsItem" placeholder="请填写学员所获得的奖项"></el-input>
      </el-form-item>
      <el-form-item label="监护人姓名： " prop="parentName"  v-if="isParentName" :rules="[
          { required: true, message: '请填写真实姓名'},
          Object.assign({trigger: 'blur'}, validator.rule.userName)
        ]">
        <el-input :maxlength="10" v-model="form.parentName" placeholder="请填写真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="家庭住址：" prop="address" v-if="isAddress" :rules="[
          { required: true, message: '请输入您的详细地址'}
        ]">
        <el-input :maxlength="300" v-model="form.address" placeholder="请输入您的详细地址"></el-input>
      </el-form-item>
      <el-form-item label="就读学校：" prop="school" v-if="isSchool" :rules="[
          { required: true, message: '请填写学员就读学校'}
        ]">
        <el-input :maxlength="200" v-model.trim="form.school" placeholder="请填写学员就读学校"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark" v-if="isRemark" :rules="[
          { required: true, message: '请输入备注信息'}
        ]">
        <el-input :maxlength="300" v-model.trim="form.remark" placeholder="请输入备注信息"></el-input>
      </el-form-item>
      <el-form-item>
        <div :class="{show_cancel: showCancel, unshow_cancel: !showCancel}">
          <el-button type="normal" @click="handleCancel" v-if="showCancel || isEdit">取消</el-button>
          <el-button type="primary" @click="handleAddSave" v-if="!isEdit">保存并添加</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { form } from 'utils/mixins'
import validator from 'utils/validator'
import ElDatePicker from '@element-ui/DatePicker'
import EIdentity from '@e-ui/Identity'
import EAddressCascader from '@e-ui/AddressCascader'
import {mapGetters} from 'vuex'

export default {
  mixins: [form],
  components: {
    ElDatePicker,
    EAddressCascader,
    EIdentity
  },
  props: {
    editRow: Object,
    isEdit: {
      type: Boolean,
      default: false
    },
    showCancel: Boolean,
    courseId: [Number, String]
  },
  computed: {
    ...mapGetters({
      get_item: 'get_item'
    })
  },
  data () {
    return {
      checkNum: (rule, value, callback) => {
        if (value > 0) {
          callback()
        } else {
          callback(new Error('请输入真实的数值'))
        }
      },
      validator,
      isParentName: false,
      isAddress: false,
      isRemark: false,
      isOrigin: false,
      isNation: false,
      isHeight: false,
      isWeight: false,
      isAwardsItem: false,
      isTrait: false,
      isSportItem: false,
      isSchool: false,
      isNationality: false,
      isSex: false,
      isIdNo: false,
      isBirthday: false,
      isEmail: false,
      countryList: [],
      form: {
        name: '',
        sex: '',
        nationality: '',
        idType: null,
        idNo: '',
        address: '',
        addressLabel: '',
        parentMobile: '',
        parentName: '',
        birthday: '',
        origin: [],
        height: '',
        weight: '',
        awardsItem: '',
        trait: '',
        sportItem: '',
        nation: '',
        school: '',
        remark: '',
        email: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted () {
    this.$store.dispatch('get_item', {courseId: this.courseId}).then(_ => {
      this.getSignupInfo(this.$store.getters.get_item)
    })
    if (this.isEdit) { // 编辑
      this.form.name = this.editRow.name
      this.form.parentMobile = this.editRow.parentMobile
      this.form.sex = this.editRow.sex
      this.form.idType = this.editRow.idType
      this.form.idNo = this.editRow.idNo
      this.form.birthday = this.editRow.birthday
      this.form.nationality = this.editRow.nationality
      this.form.origin = this.editRow.origin
      this.form.nation = this.editRow.nation
      this.form.height = this.editRow.height
      this.form.weight = this.editRow.weight
      this.form.address = this.editRow.address
      this.form.parentName = this.editRow.parentName
      this.form.school = this.editRow.school
      this.form.sportItem = this.editRow.sportItem
      this.form.trait = this.editRow.trait
      this.form.awardsItem = this.editRow.awardsItem
      this.form.email = this.editRow.email
      this.form.remark = this.editRow.remark
      this.form.index = this.editRow.index
      this.form.isEdit = this.isEdit
      this.form.id = this.editRow.id
    }
  },
  methods: {
    getSignupInfo (value) { // 获取动态必填项
      for (let item of value.fields) {
        if (item.fieldName === 'parentName') {
          this.isParentName = true
        } else if (item.fieldName === 'address') {
          this.isAddress = true
        } else if (item.fieldName === 'remark') {
          this.isRemark = true
        } else if (item.fieldName === 'origin') {
          this.isOrigin = true
        } else if (item.fieldName === 'nation') {
          this.isNation = true
        } else if (item.fieldName === 'height') {
          this.isHeight = true
        } else if (item.fieldName === 'weight') {
          this.isWeight = true
        } else if (item.fieldName === 'awardsItem') {
          this.isAwardsItem = true
        } else if (item.fieldName === 'trait') {
          this.isTrait = true
        } else if (item.fieldName === 'sportItem') {
          this.isSportItem = true
        } else if (item.fieldName === 'school') {
          this.isSchool = true
        } else if (item.fieldName === 'nationality') {
          this.isNationality = true
          this.countryList = value.dictCountries
        } else if (item.fieldName === 'idNo') {
          this.isIdNo = true
        } else if (item.fieldName === 'sex') {
          this.isSex = true
        } else if (item.fieldName === 'birthday') {
          this.isBirthday = true
        } else if (item.fieldName === 'email') {
          this.isEmail = true
        }
      }
    },
    handleCancel () {
      this.$emit('cancel', this.form)
    },
    handleAddSave () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('addSave', this.form)
          this.$refs.form.resetFields()
        }
      })
    },
    handleSave () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('save', this.form)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .singup-form {
    width: 850px;
    border: 1px dotted #ccc;
    padding: 30px 0 20px;
    margin-bottom: 20px;
    .el-form {
      .el-input {
        width: 380px;
      }
      .el-input-number, .el-cascader {
        width: 380px;
      }
    }
  }
  .show_cancel {
    margin-left: 25px;
  }
  .unshow_cancel {
    margin-left: 70px;
  }
</style>
