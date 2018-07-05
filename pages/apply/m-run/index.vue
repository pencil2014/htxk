<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>服务卡</el-breadcrumb-item>
      <!--<el-breadcrumb-item>参赛信息</el-breadcrumb-item>-->
    </el-breadcrumb>


    <div class="relative content top-content">
      <el-row class="service-title">
        <el-col :span="18">
          <e-text tag="h2" class="game-title" :line-clamp="2" height="56px">
            大使馆的双方各水电费十多个东莞大使馆的双方各水电费十多个东莞大使馆的双方各水电费十多个东莞大使馆的双方各水电费十多个东莞大使馆的双方各水电费十多个东莞
          </e-text>
          <el-button class="see-product" type="primary">
            查看商品
          </el-button>
        </el-col>
        <el-col :span="6">
          <service-card
            :type="1"
            :cardNumber="'sdfs321421423'"
            :validDate="[1523178253093, 1523178253092]"
            :status="1"
          />
        </el-col>
      </el-row>
    </div>

    <div class="relative content">
      <el-row>
        <el-col :span="18">
          <e-heading  grade="1">提交报名信息</e-heading>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="primary">
            下载Excel
          </el-button>
          <p class="small tips">*批量导入前请先下载Excel模板</p>
        </el-col>
      </el-row>
      <el-form ref="form1" class="match-group-form" :model="submitForm" :rules="rules">
        <el-form-item class="first-item" prop="groupName" label="团体名称:"
          :rules="[
                { required: true,  message: '请填写团体名称'}
          ]">
          <el-input v-model="submitForm.groupName"></el-input>
        </el-form-item>
        <div class="group-item" v-for="(item,index) in group">
          <el-row class="group-title">
            <el-col :span="4" class="title-name">
              {{item.type}}({{item.unit | formatMoney}} / 人)
            </el-col>
            <el-col :span="20" class="store">
              库存({{item.store}})
            </el-col>
          </el-row>
          <div class="right">
            <el-button size="small" @click="handleImport(index)">
              批量导入
            </el-button>
          </div>
          <div v-if="item.playerList.length">

          </div>

          <div v-else class="center">
            <el-button type="link" @click="openDialog">
              +添加报名人
            </el-button>
          </div>
        </div>
      </el-form>

      <div class="center" style="margin-top:60px;">
        <el-button size="small">
          取消
        </el-button>
        <el-button size="small" type="primary" :disabled="!submitForm.groupName || !group.some(item => item.playerList.length>0)">
          提交信息
        </el-button>
      </div>
    </div>

    <el-dialog
      class="match-group-dialog"
      :visible.sync="visible"
      v-if="visible"
      @close="visible = false">
      <sign-form :form-data="form" ref="form"
        :loading="loading"
        :pickerOption="pickerOptions"
        @submit="submit">
      </sign-form>
    </el-dialog>

  </div>
</template>
<script>
import {cloneObj} from 'utils'
import api from 'api/apply'
import ServiceCard from '../../components/ServiceCard'
import SignForm from '../components/SignForm'
export default {
  components: {
    ServiceCard, SignForm
  },
  data () {
    return {
      visible: false,
      loading: false,
      pickerOptions: {
        disabledDate (time) {
          return Date.now() - 8.64e7 * 366 * (Number(self.minAge) || 7) < time.getTime() ||
          time.getTime() < Date.now() - 8.64e7 * 366 * (Number(self.maxAge) || 50)
        }
      },
      form: {
        commingName: '',
        sex: 1,
        idNo: '',
        linkPhone: '',
        birthday: '',
        extFields: []
      },
      rules: {},
      submitForm: {
        groupName: ''
      },
      group: [
        {
          type: '专业组',
          store: 100,
          unit: 280,
          playerList: []
        },
        {
          type: '业余组',
          store: 100,
          unit: 80,
          playerList: []
        },
        {
          type: '搞基组',
          store: 100,
          unit: 180,
          playerList: []
        }
      ],
      second: 60
    }
  },
  methods: {
    openDialog () {
      this.visible = true
    },
    handleImport (index) {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.game-title{
  height:56px;
  line-height: 28px;
  max-width:500px;
  font-size: 24px;
  font-weight: 500;
  color: #333;
}
.see-product{
  margin-top: 30px;
}
div.top-content{
  min-height: 200px;
  padding: 25px 60px;
}
.small.tips{
  color: #BBB;
}
.group-item{
  margin-bottom: 40px;
  .group-title{
    width: 100%;
    margin-bottom: 10px;
    line-height: 30px;
    .title-name{
      font-size: 16px;
      color: #24c881;
      border-bottom-width: 2px;
      border-bottom-style: solid;
      border-bottom-color: #24c881;
    }
    .store{
      padding-left: 10px;
      color: #666;
      line-height: 31px;
      border-bottom: 1px solid #f0f0f0;
    }
  }
}
.right{
  text-align:right;
}
</style>
<style lang="scss">
.match-group-form{
  .first-item{
    margin-bottom: 60px;
  }
  .is-error{
    .el-form-item__error{
      margin-left: 77px;
    }
  }
  .first{
    color: #24c881
  }
  .second{
    color: #38aefd;
  }
  .third{
    color: #fd6f01;
  }
}
.match-group-dialog{
  .el-dialog{
    width: 700px;
  }
}
</style>
