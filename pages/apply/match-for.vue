<template>
    <div>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods', query: {goodsCategoryCode: 'V11'}}">赛事购买</el-breadcrumb-item>
        <el-breadcrumb-item>参赛信息</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="relative content">
        <e-heading v-if="list.length" grade="1">添加报名成员</e-heading>
        <p v-if="list.length">已选{{multipleSelection.length}}人</p>
        <div class="membership">
          <div v-if="list.length">
            <el-table
              class="member-table"
              ref="multipleTable"
              :data="list"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="姓名"
                width="160">
                <template slot-scope="scope">{{ scope.row.commingName }}</template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="性别"
                width="120">
                <template slot-scope="scope">{{ scope.row.sex== 1 ? '男':  '女'}}</template>
              </el-table-column>
              <el-table-column
                prop="idNo"
                width="196"
                label="证件号"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="linkPhone"
                label="联系电话"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" class="link" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                  <el-button type="text" class="link" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="check-agree">
              <el-col :span="16" >
                <el-checkbox v-model="isAgree">同意《<router-link to="/apply/agreement" class="link" target="_blank">赛事报名协议</router-link>》</el-checkbox>
              </el-col>
            </el-row>
            <div class="divider"></div>
            <br/>
            <div class="btn-wrapper center">
              <el-button  @click="handleAdd()">继续添加</el-button>
              <el-button type="primary" :disabled="!(isAgree && multipleSelection.length)" @click="handleSubmit()">提交信息</el-button>
            </div>
          </div>


          <div v-else class="sign-for center placeholder" >
            <img  src="/images/sign/add_sign.jpg">
            <p class="no-person">暂无赛事联系人，快去添加吧！</p>
            <el-button type="primary" size="large" @click="handleAdd()">添加报名人</el-button>
          </div>
        </div>


        <!--添加报名者弹框-->
        <el-dialog
          v-show="dialogVisible"
          class="sign-dialog"
          :visible.sync="dialogVisible"
          :title="'添加报名人'"
          size="small">
          <el-scrollbar wrap-class="signfrom-scroll">
            <el-form :model="form" label="活动区域" :rules="rules" ref="form" label-width="90px">
              <el-form-item label="姓名"
                prop="commingName"
                :rules="[
                { required: true,  message: '请填写真实姓名'},
                Object.assign({}, validator.rule.username)
                ]">
                <el-input class="form-ctrl" v-model.trim="form.commingName" :maxlength="10" placeholder="请填写真实姓名">
                </el-input>
              </el-form-item>
              <el-form-item label="性别"
                class="tal"
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
                <el-input class="form-ctrl" v-model.trim="form.idNo" :maxlength="30" placeholder="请输入证件号码">
                </el-input>
              </el-form-item>
              <el-form-item label="手机号码"
                prop="linkPhone"
                :rules="[
                  { required: true,  message: '请输入手机号码'},
                  Object.assign({}, validator.rule.mobile, {trigger:'blur'})
                  ]">
                <el-input class="form-ctrl" v-model.trim="form.linkPhone" :maxlength="11" placeholder="请输入手机号码">
                </el-input>
              </el-form-item>
              <el-form-item label="出生日期"
                prop="birthday"
                :rules="{ required: true,  message: '请选择出生日期'}">
                <el-date-picker
                  class="form-ctrl"
                  v-model="form.birthday"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions0">
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
                    class="form-ctrl"
                    v-if="item.showModel==1"
                    v-model="item.value"
                    :placeholder="`请选择${item.fieldText}`"
                    @change="value => (item.valueText = value) && $refs.form.validateField(`${'extFields'}.${index}.value`)">
                    <el-option v-for="item in item.listData" :key="item.value" :label="item.text" :value="item.text" />
                  </el-select>
                  <el-input
                    v-else
                    class="form-ctrl"
                    v-model.trim="item.value"
                    :maxlength="item.maxlength"
                    :placeholder="`请输入${item.fieldText}`"
                    @change="value => item.valueText = value">
                  </el-input>
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSave">保 存</el-button>
          </span>
        </el-dialog>

        <!--已报名用户列表-->
        <user-signed-dialog
          :visible.sync="signVisible"
          :data="signedUser"
          @close="signVisible=false">
        </user-signed-dialog>
        <!--报名成功弹框-->
        <success-dialog
          :visible="successVisible"
          :orderNumber="$route.query.orderNumber"
          :hasFee="hasFee"
          :lottery="lottery"
          @cancel="gotoDetail"
          @close="gotoDetail">
        </success-dialog>
      </div>
    </div>
</template>

<script>
import api from 'api/apply'
import ElTable from '@element-ui/Table'
import ElTableColumn from '@element-ui/TableColumn'
import ElDatePicker from '@element-ui/DatePicker'
import validator from 'utils/validator'
import {cloneObj, parseTime} from 'utils'
import UserSignedDialog from './components/UserSignedDialog'
import SuccessDialog from './components/SuccessDialog'

export default {
  components: {
    ElTable, ElTableColumn, ElDatePicker, UserSignedDialog, SuccessDialog
  },
  created () {
    this.tempType = this.$route.query.templateType
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
    var checkStr = (rule, value, callback) => {
      if (!/^[\u4e00-\u9fa5a-zA-Z0-9@]*$/.test(value)) {
        callback(new Error('只能输入中英文、数字、@符号'))
      } else {
        callback()
      }
    }
    return {
      checkCode: { validator: checkStr, trigger: 'blur' },
      tempType: '', // 1个人 2团体 3替报名 4多人
      hasFee: false,
      lottery: false,
      successVisible: false,
      signVisible: false,
      signedUser: [],
      loading: false,
      editIndex: 0,
      validator,
      isEdit: false,
      minAge: 7,
      maxAge: 50,
      pickerOptions0: {
        disabledDate (time) {
          return Date.now() - 8.64e7 * 366 * (Number(self.minAge) || 7) < time.getTime() ||
          time.getTime() < Date.now() - 8.64e7 * 366 * (Number(self.maxAge) || 50)
        }
      },
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
      rules: {},
      list: [
      ],
      multipleSelection: [],
      isAgree: true,
      dialogVisible: false,
      form: {
        commingName: '',
        sex: 1,
        idNo: '',
        linkPhone: '',
        birthday: '',
        extFields: []
      },
      extFields: []
    }
  },
  methods: {
    gotoDetail () {
      this.successVisible = false
      this.$router.push({
        path: '/manage/order/detail',
        query: {
          orderNumber: this.$route.query.orderNumber
        }
      })
    },
    // 获取自定义报名项
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
          this.extFields = cloneObj(res.data)
          this.form.extFields = cloneObj(res.data)
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleDelete (item) {
      this.$confirm('确定要删除该报名人信息吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.list.splice(this.list.indexOf(item), 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // console.log('已取消删除')
      })
    },
    handleClose () {
      this.dialogVisible = false
    },
    resetData () {
      this.form = {
        commingName: '',
        sex: 1,
        idNo: '',
        linkPhone: '',
        birthday: '',
        extFields: cloneObj(this.extFields)
      }
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    handleEdit (index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.editIndex = index
      this.isEdit = true
      this.dialogVisible = true
    },
    handleAdd () {
      this.dialogVisible = true
      this.resetData()
      this.isEdit = false
    },
    // 添加1个报名人员
    handleSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let isExist = false // 列表中是否已存在该报名人员
          let errMsg = '报名列表中已存在该成员(手机号码，证件号不能相同)'
          let joinMsg = '该成员已报名该赛事'
          let newItem = cloneObj(this.form)
          api.validateHasSignUp({
            matchId: this.$route.query.matchId,
            phone: this.form.linkPhone,
            idNo: this.form.idNo
          }, {
            successMsg: '添加成功',
            errorMsg: ''
          }).then((res) => {
            if (res.result === '0') {
              if (this.isEdit) {
                for (let i = 0, len = this.list.length; i < len; i++) {
                  if (i !== this.editIndex) {
                    if (this.list[i].linkPhone === this.form.linkPhone || this.list[i].idNo === this.form.idNo) {
                      isExist = true
                    }
                  }
                }
                if (isExist) {
                  this.$message.error(errMsg)
                  return
                }
                this.list.splice(this.editIndex, 1, newItem)
              } else {
                for (let j = 0, jlen = this.list.length; j < jlen; j++) {
                  if (this.list[j].linkPhone === this.form.linkPhone || this.list[j].idNo === this.form.idNo) {
                    isExist = true
                  }
                }
                if (isExist) {
                  this.$message.error(errMsg)
                  return
                }
                this.list.push(newItem)
              }
              this.handleClose()
            } else {
              this.$message.error(joinMsg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 提交报名列表
    handleSubmit () {
      // console.log(this.tempType)
      this.$confirm('确定提交?', '提示', {
        type: 'warning'
      }).then(() => {
        let list = cloneObj(this.multipleSelection)
        list.forEach(item => {
          item.birthday = this.tempType === '2' ? parseTime(item.birthday, '{y}-{m}-{d}') : new Date(item.birthday).getTime()
          item.matchSignFieldReqs = item.extFields.map(field => {
            return {
              fieldText: field.fieldText,
              fieldValue: field.value.length && field.value
            }
          })
          delete item.extFields
        })
        if (this.tempType === '2') { // 团体报名
          api.saveMember({
            channelsId: Number(this.$route.query.channelsId), // 渠道ID
            deviceType: 1, // 设备类型： PC:1
            groupType: Number(this.$route.query.goodsType), // 组别
            matchId: Number(this.$route.query.matchId), // 赛事ID
            orderNumber: this.$route.query.orderNumber || '', // 订单编号
            members: list
          }).then((res) => {
            this.$router.push({path: '/apply/club', query: {orderNumber: this.$route.query.orderNumber, toUrl: res.data.total}})
          })
        } else { // 个人，多人，替报名
          api.sign({
            channelsId: Number(this.$route.query.channelsId), // 渠道ID
            deviceType: 1, // 设备类型： PC:1
            groupType: Number(this.$route.query.goodsType), // 组别
            matchId: Number(this.$route.query.matchId), // 赛事ID
            orderNumber: this.$route.query.orderNumber || '', // 订单编号
            matchSignDataReqList: list // 报名列表
          }, {errorMsg: 'none'}).then((res) => {
            this.lottery = res.data.lottery
            this.hasFee = !!res.data.total
            this.loading = false
            if (res.data.lottery) { // 摇号=》弹框
              this.successVisible = true
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
              this.signedUser = JSON.parse(err.msg)
              this.signVisible = true
            } else {
              this.$message.error(err.msg)
            }
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  
  .sign-for{
    padding: 156px 0;
     .membership{
      margin: 0px auto;
    }
    .no-person{
      font-weight: 700;
      color:$color-primary;
      font-size: 18px;
      margin:50px 0;
    }
  }
  .check-agree{
    margin-top: 20px;
  }
  .icon-edit{
    margin-right:10px;
  }
  i{
    cursor: pointer;
  }
  .form-ctrl{
    width: 98%;
  }

</style>
<style>
.dynamic-control .el-form-item__content>div,
.dynamic-control .el-form-item__content>div .el-select{
  width: 100%;
}
.tal{
  text-align:left
}
.member-table tr{
  line-height: 52px;
  height: 52px;
}
.member-table .el-table__header tr{
  height: 44px;
  line-height: 44px;
}
th.el-table .cell, .el-table th>div:first-child{
  text-overflow:initial!important;
}
.signfrom-scroll{
  overflow-y: scroll;
  max-height: 500px;
}
</style>
