<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/order/submit' }">培训购买</el-breadcrumb-item>
      <el-breadcrumb-item>参赛信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="private-mine">
        <e-heading grade='1'>学员报名表</e-heading>
        <el-form ref="form" v-bind="getFormProps()">
          <el-form-item label="学员姓名：" prop="name" :rules="[
                  { required: true, message: '请填写真实姓名'},
                  Object.assign({trigger: 'blur'}, validator.rule.userName)
                ]">
            <el-input :maxlength="10" v-model.trim="form.name" placeholder="请填写真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="监护人手机：" prop="parentMobile" :rules="[
              { required: true, message: '请输入手机号'},
              Object.assign({trigger: 'blur'}, validator.rule.mobile)
            ]">
              <el-input v-model="form.parentMobile" :maxlength="11" placeholder="请输入手机号"></el-input>
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
                  Object.assign({trigger: 'blur', validator: validator.rule.isIp.validator.bind(this)})
                ]">
            <el-select v-model="form.idType" style="width: 14.5%" placeholder="证件类型">
              <el-option
                v-for="item in ipList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model="form.idNo" placeholder="请输入真实的证件号" style="width: 54.5%; margin-left: 10px"></el-input>
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
          <el-form-item label="国籍：" prop="nationality" v-if="isNationality" :rules="[
              { required: true, message: '请选择国籍'},
            ]">
            <el-select v-model="form.nationality" placeholder="请选择国籍" style="width: 70%" filterable>
              <el-option v-for="item in countryList" :key="item.id" :value="item.countryCode" :label="item.countryChineseName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="籍贯：" prop="origin" v-if="isOrigin" :rules="[
              { required: true, message: '请填写学员的籍贯'}
            ]">
            <e-address-cascader v-model="form.origin" :grade="2" placeholder="请选择籍贯"/>
          </el-form-item>
          <el-form-item label="电子邮件：" prop="email" v-if="isEmail" :rules="[
              { required: true, message: '请填写学员的电子邮件'}
            ]">
            <el-input :maxlength="100" v-model.trim="form.email" placeholder="请填写学员的电子邮件"></el-input>
          </el-form-item>
          <el-form-item label="民族：" prop="nation" v-if="form.nationality === '100000' && isNation" :rules="[
              { required: true, message: '请填写学员的民族'}
            ]">
            <el-input :maxlength="10" v-model.trim="form.nation" placeholder="请填写学员的民族"></el-input>
          </el-form-item>
          <el-form-item label="身高：" prop="height" v-if="isHeight" :rules="[
              { required: true, message: '请填写学员的身高'}
            ]">
              <el-input-number :maxlength="10" v-model="form.height" placeholder="请填写学员的身高" />
              <span style="margin-left: 5px;">CM</span>
          </el-form-item>
          <el-form-item label="体重：" prop="weight" v-if="isWeight" :rules="[
              { required: true, message: '请填写学员的体重'}
            ]">
            <el-input-number :maxlength="10" v-model="form.weight" placeholder="请填写学员的体重" />
            <span style="margin-left: 5px;">KG</span>
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
              { required: true, message: '请输入您的详细地址'},
              Object.assign({trigger: 'blur'}, validator.rule.addressLength)
            ]">
            <el-input :minlength="10" :maxlength="300" v-model="form.address" placeholder="请输入您的详细地址"></el-input>
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
            <div class="btn-box">
              <el-button type="primary" native-type="submit" :loading="loading">提交</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { form } from 'utils/mixins'
import validator from 'utils/validator'
import ElDatePicker from '@element-ui/DatePicker'
import EAddressCascader from '@e-ui/AddressCascader'
import api from 'api/train'
export default {
  mixins: [form],
  components: {
    ElDatePicker,
    EAddressCascader
  },
  data () {
    return {
      lottery: false, // 是否摇号
      hasFee: false, // 是否收费
      dialogVisible: false,
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
      loading: false,
      form: {
        name: '',
        sex: '',
        nationality: '',
        idType: 1,
        idNo: '',
        address: '',
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
      ipList: [
        {
          value: 1,
          label: '身份证'
        },
        {
          value: 2,
          label: '护照'
        },
        {
          value: 3,
          label: '其他证件'
        }
      ],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted () {
    this.getStudentInfo()
  },
  methods: {
    getStudentInfo () {
      api.studentInfo({courseId: this.$route.query.courseId}).then(res => {
        this.countryList = res.data.dictCountries
        for (let item of res.data.fields) {
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
      })
    },
    submit () {
      let data = {
        orderNumber: this.$route.query.orderNumber,
        goodsSku: this.$route.query.goodsSku,
        courseItemId: this.$route.query.courseItemId,
        courseId: this.$route.query.courseId,
        signupFee: this.$route.query.price
      }
      let birthdayDate = this.form.birthday
      delete this.form.birthday
      let infoData = Object.assign({birthday: birthdayDate ? new Date(birthdayDate).getTime() : ''}, data, this.form)
      // console.log(infoData)
      api.studentSignUp(infoData).then((res) => {
        if (this.$route.query.price === '0') {
          this.$router.push({path: '/order/success', query: {orderNumber: this.$route.query.orderNumber}})
        } else {
          this.$router.push({path: '/order/created', query: {orderNumber: this.$route.query.orderNumber}})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .private-mine {
    .el-form {
      .el-input {
        width: 660px;
      }
      .el-input-number, .el-cascader {
        width: 660px;
      }
    }
  }
  .btn-box {
    margin-left: 290px;
  }
</style>
