<template>
  <div>
    <div>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods', query: {goodsCategoryCode: 'V11'}}">赛事购买</el-breadcrumb-item>
        <el-breadcrumb-item>参赛信息</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content">
        <e-heading grade="1" style="margin-bottom:50px;">请填写参赛信息</e-heading>

        <sign-form :form-data="form" ref="form"
          :loading="loading"
          :pickerOption="pickerOptions0"
          @submit="submit">
        </sign-form>
        <!-- 提交成功弹框-->
        <success-dialog
          :visible="dialogVisible"
          :orderNumber="$route.query.orderNumber"
          :hasFee="hasFee"
          :lottery="lottery"
          @cancel="gotoDetail"
          @close="gotoDetail">
        </success-dialog>
        <!--发送验证码弹框-->
        <el-dialog
          class="success-dialog"
          size="tiny"
          title="获取手机验证码"
          top="30%"
          :visible.sync="msgVisible">
          <p>已向您的手机号{{form.linkPhone}}发送了验证码，请输入</p>
          <el-row>
            <el-col :span="15">
              <el-input v-model="msgCode" :maxlength="6">
              </el-input>
            </el-col>
            <el-col :span="4" :offset="1">
              <el-button @click="sendMsg()" :disabled="sending">
                  {{ sending ? second + '秒': '重新发送' }}
              </el-button>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button  @click="msgVisible=false">取消</el-button>
            <el-button type="primary"  @click="checkMsg">确定</el-button>
          </span>
        </el-dialog>
        <!--已报名用户列表-->
        <user-signed-dialog
          :visible.sync="signVisible"
          :data="signedUser"
          @close="signVisible=false">
        </user-signed-dialog>
      </div>
    </div>
  </div>

</template>

<script>
import api from 'api/apply'
import ElDatePicker from '@element-ui/DatePicker'
import validator from 'utils/validator'
import SignForm from './components/SignForm'
import {cloneObj} from 'utils'
import UserSignedDialog from './components/UserSignedDialog'
import SuccessDialog from './components/SuccessDialog'
export default {
  components: {
    ElDatePicker, SignForm, UserSignedDialog, SuccessDialog
  },
  computed: {
    isSamePhone () { // 用户注册的手机号码和报名的手机号
      return this.form.linkPhone === this.$store.state.user.session.phone
    }
  },
  mounted () {
    this.getFields()
    this.minAge = Number(this.$route.query.minAge)
    this.maxAge = this.$route.query.minAge === this.$route.query.maxAge
      ? Number(this.$route.query.maxAge) + 1
      : Number(this.$route.query.maxAge)
  },
  data () {
    let self = this
    return {
      lottery: false, // 是否摇号
      hasFee: false, // 是否收费
      msgVisible: false, // 获取短信弹框
      dialogVisible: false, // 报名成功待摇号弹框
      signVisible: false, // 已报名用户弹框
      msgCode: '',
      signedUser: [],
      msgValidated: false,
      loading: false,
      validator,
      second: 60,
      sending: false,
      pickerOptions0: {
        disabledDate (time) {
          return Date.now() - 8.64e7 * 366 * (Number(self.minAge) || 7) < time.getTime() ||
          time.getTime() < Date.now() - 8.64e7 * 366 * (Number(self.maxAge) || 50)
        }
      },
      isAgree: 0,
      minAge: 7,
      maxAge: 50,
      form: {
        commingName: '',
        sex: 1,
        idNo: '',
        linkPhone: '',
        birthday: '',
        extFields: []
      },
      genderList: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 0
        }
      ],
      rules: {},
      extFieldList: [] // 自定义报名项
    }
  },
  methods: {
    submit () {
      if (!this.isSamePhone && !this.msgValidated) {
        this.msgVisible = true
        this.sendMsg()
        return
      }
      this.loading = true
      let f = cloneObj(this.form)
      f.matchSignFieldReqs = this.form.extFields.map(item => {
        return {
          fieldText: item.fieldText,
          fieldValue: item.value.length && item.value
        }
      })
      let signUserList = []
      f.birthday = new Date(f.birthday).getTime()
      delete f.extFields
      signUserList.push(f)
      api.sign({
        channelsId: Number(this.$route.query.channelsId), // 渠道ID
        deviceType: 1, // 设备类型： PC:1
        groupType: Number(this.$route.query.goodsType), // 组别
        matchId: Number(this.$route.query.matchId), // 赛事ID
        orderNumber: this.$route.query.orderNumber, // 订单编号
        matchSignDataReqList: signUserList // 报名列表
      }, {errorMsg: 'none'}).then((res) => {
        this.lottery = res.data.lottery
        this.hasFee = !!res.data.total
        this.loading = false
        if (res.data.lottery) { // 摇号=》弹框
          this.dialogVisible = true
        } else { // 否则跳转订单支付页或者 支付成功页
          let toUrl = res.data.total ? '/order/created' : '/order/success'
          this.$router.push({
            path: toUrl,
            query: {
              orderNumber: this.$route.query.orderNumber
            }
          })
        }
      }).catch((err) => {
        if (err.result === '9067') { // 用户已报名
          if (err.msg === '报名信息已存在') {
            this.$message.error(err.msg)
          } else {
            this.signedUser = JSON.parse(err.msg)
            this.signVisible = true
          }
        } else {
          this.$message.error(err.msg)
        }
        this.loading = false
      })
    },
    getFields () {
      api.matchSignFileds({matchId: this.$route.query.matchId}).then((res) => {
        if (res.data) {
          res.data.forEach(item => {
            item.isRequired = 1
            item.showModel = item.fieldType === 1 ? 2 : 1
            item.valueText = ''
            item.value = ''
            if (item.fieldType === 2) {
              item.dataType = 3
              item.selectedValue = 0
              item.listData = JSON.parse(item.fieldValues)
              if (item.listData.length) {
                item.listData.forEach((op, index) => {
                  op.value = index
                })
              }
            } else {
              item.maxlength = 50
            }
          })
          this.form.extFields = res.data
        }
      })
    },
    gotoDetail () {
      this.dialogVisible = false
      this.$router.push({
        path: '/manage/order/detail',
        query: {
          orderNumber: this.$route.query.orderNumber
        }
      })
    },
    timeOut () {
      let _this = this
      if (_this.second > 0) {
        setTimeout(function () {
          _this.second--
          _this.timeOut(this.second)
        }, 1000)
      } else {
        this.sending = false
        this.second = 60
      }
    },
    sendMsg () { // 发送短信验证码
      this.sending = true
      api.sendMsg({
        phone: this.form.linkPhone,
        matchId: this.$route.query.matchId,
        channelId: this.$route.query.channelsId
      }).then((res) => {
        this.timeOut()
      })
    },
    checkMsg () { // 校验验证码
      api.checkPhoneMsg({
        account: this.form.linkPhone,
        validateCode: this.msgCode,
        type: 6
      }).then((res) => {
        if (res.data) {
          this.$message({
            message: '验证通过',
            type: 'success'
          })
          this.msgValidated = true
          this.msgVisible = false
        } else {
          this.$message.error('验证码错误！')
        }
      }).catch((res) => {
        if (res.data) {
          this.$message({
            message: '验证通过',
            type: 'success'
          })
          this.msgValidated = true
          this.msgVisible = false
        } else {
          this.$message.error('验证码错误！')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  

  .content-box{
    margin: 0 auto;
    h1{
      font-size: 24px;
      color:#333;
    }
  }
  .large-submit{
    width:110px;
    height: 40px;
  }
  .normal-input{
    width:462px!important;
  }
  .msg-content{
    width:300px;
    margin: 0 auto;
  }
  .iconfont.success{
    color:#24c881;
    font-size:50px;
  }
</style>
<style lang="scss">
  .sign-form .form-item .el-input,
  .sign-form .form-item .el-select{
    width: 462px;
  }
  .success-dialog .el-dialog{
    width: 440px;
  }
  .success-text{
    font-size: 14px;
    padding-top:10px;
    text-align: left;
    p{
      color: #666;
    }
    .success-title{
      color: #24c881;
      font-size: 16px;
    }
  }
</style>
