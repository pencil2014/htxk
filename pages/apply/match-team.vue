<template>
    <div>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods', query: {goodsCategoryCode: 'V11'}}">赛事购买</el-breadcrumb-item>
        <el-breadcrumb-item>参赛信息</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="relative content">
        <e-heading grade="1">{{list.length > 1 ? '报名-团体赛' : '报名-' + getTeamName(list[0].type)}} <span class="small_tiltips">(报名成功将发短信至参赛人手机)</span></e-heading>
        <div class="membership">
          <div class="team_list" v-for="(item,index) in list" :key="index">
            <h5 v-if="list.length > 1">第{{teamNumCode[index]}}场（{{getTeamName(item.type)}}）</h5>
            <div v-for="(value,editIndex) in item.type.length" :key="editIndex">
              <p v-if="item.data[editIndex]" class="team_showls">
                <span style="width:300px;"><i class="icon iconfont" :style="{color: item.data[editIndex].sex === 1 ? '#24c881' : '#EE669F'}">&#xe605;</i>&nbsp;&nbsp;{{item.data[editIndex].commingName}}</span>
                <span style="width:80px;">{{item.data[editIndex].sex === 1 ? '男' : '女'}}</span>
                <span style="width:560px;">{{item.data[editIndex].linkPhone}}</span>
                <span>
                  <el-button type="link" @click="handleEdit(index, editIndex)">编 辑</el-button>
                  <el-button type="link" @click="handleDelete(index, editIndex)">删 除</el-button>
                </span>
              </p>
              <p class="add_team" v-else><el-button type="link" icon="plus" @click="handleAdd(index, editIndex)">添加参赛人</el-button></p>
            </div>
          </div>
          <el-row class="check-agree">
            <el-col :span="16" >
              <el-checkbox v-model="isAgree">同意《<router-link to="/apply/agreement" class="link" target="_blank">赛事报名协议</router-link>》</el-checkbox>
            </el-col>
          </el-row>
          <br>
          <div class="btn-wrapper center">
            <el-button type="primary" :disabled="!(isAgree && isSubmit)" @click="handleSubmit()">提交报名</el-button>
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

      </div>
    </div>
</template>

<script>
import api from 'api/apply'
import ElDatePicker from '@element-ui/DatePicker'
import validator from 'utils/validator'
import {cloneObj, parseTime} from 'utils'

export default {
  components: {
    ElDatePicker
  },
  created () {
    let teamList = this.$route.query.matchOrder.split(',')
    this.tempType = this.$route.query.templateType
    teamList.forEach((item, i) => {
      this.$set(this.list, i, {
        type: item,
        data: []
      })
    })
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
      teamNumCode: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      tempType: '', // 1个人 2团体 3替报名 4多人 5网羽乒团体
      thisIndex: 1,
      signedUser: [],
      validator,
      valueIndex: 0,
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
      list: [],
      isSubmit: false,
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
    getTeamName (name) {
      let typeName = ''
      switch (name) {
        case '1':
          typeName = '男单'
          break
        case '2':
          typeName = '女单'
          break
        case '11':
          typeName = '男双'
          break
        case '22':
          typeName = '女双'
          break
        case '12':
          typeName = '混双'
          break
      }
      return typeName
    },
    gotoDetail () {
      this.$router.push({
        path: '/order/detail',
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
    getSubmit (val) {
      let submitArr = []
      val.forEach((item) => {
        if (item.data.length) {
          for (let i = 0; i < item.type.length; i++) {
            if (item.data[i]) {
              submitArr.push(true)
            } else {
              submitArr.push(false)
            }
          }
        } else {
          submitArr.push(false)
        }
      })
      if (submitArr.includes(false)) {
        this.isSubmit = false
      } else {
        this.isSubmit = true
      }
    },
    handleDelete (index, editIndex) {
      this.$confirm('确定要删除该报名人信息吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$set(this.list[index].data, editIndex, '')
        this.getSubmit(this.list)
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
    handleEdit (index, editIdenx) {
      this.form = Object.assign({}, this.list[index].data[editIdenx])
      this.thisIndex = index
      this.valueIndex = editIdenx
      this.isEdit = true
      this.dialogVisible = true
    },
    handleAdd (index, editIndex) {
      // console.log(index + '-' + editIndex)
      this.dialogVisible = true
      this.resetData()
      this.isEdit = false
      this.thisIndex = index
      this.valueIndex = editIndex
    },
    // 添加1个报名人员
    handleSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let isExist = false // 列表中是否已存在该报名人员
          let errMsg = ''
          let joinMsg = '该成员已报名该赛事'
          let newItem = cloneObj(this.form)
          api.validateHasSignUp({ // 查看是否已经报名
            matchId: this.$route.query.matchId,
            phone: this.form.linkPhone,
            idNo: this.form.idNo
          }, {
            successMsg: 'none',
            errorMsg: 'none'
          }).then((res) => {
            if (res.result === '0') {
              // 校验场次和对阵性别
              if (this.list[this.thisIndex].type === '1') { // 男单
                errMsg = this.form.sex === 1 ? '' : '参赛人员性别不符，男单赛事需要报名一名男性'
              } else if (this.list[this.thisIndex].type === '2') { // 女单
                errMsg = this.form.sex === 2 ? '' : '参赛人员性别不符，女单赛事需要报名一名女性'
              } else if (this.list[this.thisIndex].type === '11') { // 男双
                let isSex = true
                this.list[this.thisIndex].data.forEach((item) => {
                  if (item) {
                    if (item.sex === 1) {
                      isSex = true
                    } else {
                      isSex = false
                    }
                  }
                })
                errMsg = this.form.sex === 1 && isSex ? '' : '参赛人员性别不符，男双赛事需要报名两名男性'
              } else if (this.list[this.thisIndex].type === '22') { // 女双
                let isSex = true
                this.list[this.thisIndex].data.forEach((item) => {
                  if (item) {
                    if (item.sex === 2) {
                      isSex = true
                    } else {
                      isSex = false
                    }
                  }
                })
                errMsg = this.form.sex === 2 && isSex ? '' : '参赛人员性别不符，女双赛事需要报名两名女性'
              } else if (this.list[this.thisIndex].type === '12') { // 混双
                let isSex = true
                this.list[this.thisIndex].data.forEach((item, i) => {
                  if (i !== this.valueIndex) {
                    if ((this.form.sex === 2 && item.sex === 1) || (this.form.sex === 1 && item.sex === 2)) {
                      isSex = true
                    } else {
                      isSex = false
                    }
                  }
                })
                errMsg = isSex ? '' : '参赛人员性别不符,混双需要报名一男一女'
              }
              if (errMsg) {
                this.$message.error(errMsg)
                return
              } else { // 校验列表是否已存在
                if (this.isEdit) { // 是否编辑
                  for (let i = 0, len = this.list.length; i < len; i++) {
                    if (i !== this.thisIndex) {
                      this.list[i].data.forEach((item) => {
                        if (item.linkPhone === this.form.linkPhone || item.idNo === this.form.idNo) {
                          isExist = true
                        }
                      })
                    } else {
                      this.list[i].data.forEach((item, key) => {
                        if (key !== this.valueIndex) {
                          if (item.linkPhone === this.form.linkPhone || item.idNo === this.form.idNo) {
                            isExist = true
                          }
                        }
                      })
                    }
                  }
                  if (isExist) {
                    this.$message.error('报名列表中已存在该成员(手机号码，证件号不能相同)')
                    return
                  }
                } else { // 添加
                  for (let i = 0, len = this.list.length; i < len; i++) {
                    this.list[i].data.forEach((item) => {
                      if (item.linkPhone === this.form.linkPhone || item.idNo === this.form.idNo) {
                        isExist = true
                      }
                    })
                  }
                  if (isExist) {
                    this.$message.error('报名列表中已存在该成员(手机号码，证件号不能相同)')
                    return
                  }
                }
              }
              this.$set(this.list[this.thisIndex].data, this.valueIndex, newItem)
              this.getSubmit(this.list)
              this.handleClose()
            } else {
              this.$message.error(joinMsg)
            }
          }).catch((err) => {
            this.$message.error(err.msg)
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
        let list = this.list
        let newList = []
        list.forEach((item, index) => {
          item.data.forEach((value) => {
            value.playNumber = index + 1
            value.roundType = item.type
            value.birthday = this.tempType === '5' ? parseTime(value.birthday, '{y}-{m}-{d}') : new Date(value.birthday).getTime()
            value.matchSignFieldReqs = value.extFields.map(field => {
              return {
                fieldText: field.fieldText,
                fieldValue: field.value.length && field.value
              }
            })
            newList.push(value)
            // delete value.extFields
          })
        })
        if (this.tempType === '5') { // 网羽乒团体报名
          api.saveMember({
            channelsId: Number(this.$route.query.channelsId), // 渠道ID
            deviceType: 1, // 设备类型： PC:1
            groupType: Number(this.$route.query.goodsType), // 组别
            matchId: Number(this.$route.query.matchId), // 赛事ID
            orderNumber: this.$route.query.orderNumber || '', // 订单编号
            members: newList
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
            matchSignDataReqList: newList // 报名列表
          }, {errorMsg: 'none'}).then((res) => {
            let toUrl = res.data.total ? '/order/created' : '/order/success'
            this.$router.push({
              path: toUrl,
              query: {
                orderNumber: this.$route.query.orderNumber
              }
            })
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
  }
.team_list{
  h5{
    font-weight: normal;
    color:#666;
    margin-top:25px;
  }
  .team_showls{
    border:1px solid #e3e2e7;
    padding:0 25px;
    height:40px;
    line-height:38px;
    font-size: 12px;
    margin: 10px 0;
    .el-button--link{
      line-height: 38px;
    }
    span{
      float:left;
    }
  }
  .add_team{
    height:40px;
    text-align:center;
    background: #f6f6f6;
    line-height: 40px;
    margin: 10px 0;
    font-size: 12px;
    .el-button--link{
      line-height: 40px;
    }
  }
}
  .small_tiltips{
    font-size: 12px;
    color:#999;
    font-weight: normal;
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
