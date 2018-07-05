<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/wallet' }">钱包中心</el-breadcrumb-item>
          <el-breadcrumb-item>我的银行卡</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content wallet-box">
            <e-heading grade="1" class="message-title">我的银行卡</e-heading>
            <div class="card-box" v-if="cardInfoList">
                 <div class="my-card" v-for="(items, index) in cardInfoList" :key="index" v-show="isCard == 1" @mouseover="isDelBind = 1" @mouseout="isDelBind = 0">
                    <div class="my-card-title">
                        <span class="bind-logo">{{items.platformInfo}}</span><span class="end-num">尾号：{{items.devicesCode | getCardEndNum(items.devicesCode)}} </span>
                        <i class="icon-bind">{{items.mediumInfo}}</i>
                    </div>
                    <div class="my-card-info">
                        <p>持卡人姓名：{{items.identityName}}</p>
                        <p>手机号：{{items.phone}}</p>
                    </div>
                    <div class="del-bind" @click="deBindCardLink" v-show="isDelBind == 1">解绑</div>
                </div>
                <nuxt-link :to="{path:'/manage/wallet/bindact'}" v-show="isCard == 0">
                    <div class="my-card add-card">
                        <p><i class="icon iconfont icon-tianjia"></i></p>
                        <p>绑定银行卡，请点击绑定</p>
                    </div>
                </nuxt-link>
                <!-- 弹出框 -->
                <el-dialog title="温馨提示" :visible.sync="dialogVisible" >
                    <p class="dialog-txt" v-show="active == 1"><i class="icon iconfont icon-tixing-copy" ></i> 您确定解绑当前提现账号吗？</p>        
                    <div slot="footer" class="dialog-footer" v-show="active == 1">
                      <el-button @click="dialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="delBindCard()">去解绑</el-button>
                    </div>
                    <el-form :model="delBindkeyFrom" :rules="rules1" class="pay-from" ref="delBindkeyFrom" label-width="100px" v-show="active == 2" onsubmit="return false">
                        <p class="dialog-txt">为了您的资金安全,需要验证您的账户信息</p>
                        <el-form-item label="支付密码 :" prop="paykey">
                          <el-input v-model="delBindkeyFrom.paykey" type="password" @keyup.native.enter="delBindCardSubmit('delBindkeyFrom')"></el-input>
                        </el-form-item>
                        <div class="dialog-footer">
                          <el-button type="primary" @click="delBindCardSubmit('delBindkeyFrom')">确定</el-button>
                        </div>
                    </el-form>
                </el-dialog>
            </div>
        </div>
  </div>
</template>
<script>
import api from 'api/wallet'
import md5 from 'js-md5'
export default {
  layout: 'manage',
  data () {
    return {
      isCard: 0,
      dialogVisible: false,
      isDelBind: 0,
      cardInfoList: {},
      active: 1,
      delBindkeyFrom: {
        bindPlatformId: '',
        paykey: ''
      },
      cardInfo: {
        name: '',
        phone: '',
        endNum: ''
      },
      rules1: {
        paykey: [
          {required: true, message: '支付密码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 下一步控制
    next () {
      if (this.active++ > 2) {
        this.active = 1
      }
    },
    // 获取银行卡信息
    getCreditCardInfo () {
      api.getCardInfo({
      }).then((res) => {
        if (res.data) {
          this.isCard = 1
          this.cardInfoList = res.data
          // 当前仅支持一张卡,后期若多张卡，此接口需要调整
          this.delBindkeyFrom.bindPlatformId = res.data[0].bindPlatformId
        }
        console.log('bind info is ssuccess：', res)
      }).catch((ERR) => {
      })
    },
    deBindCardLink () {
      this.dialogVisible = true
    },
    delBindCard () {
      this.next()
    },
    delBindCardSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.unbindSubmit({
            bindPlatformId: this.delBindkeyFrom.bindPlatformId,
            transPwd: md5(this.delBindkeyFrom.paykey)
          }).then((res) => {
            if (res.data) {
              this.dialogVisible = false
              this.$router.push('/manage/wallet/card?v=new')
            }
          })
        } else {
          return false
        }
      })
    }
  },
  filters: {
    // 格式化银行卡尾号
    getCardEndNum ($num) {
      if ($num) {
        return $num.substr(-4, 4)
      }
    }
  },
  mounted () {
    this.getCreditCardInfo()
  }
}
</script>
<style lang="scss" scoped>
  
  .wallet-box{
    position: relative;
    .card-box{
        clear: both;
        overflow: hidden;
        .bind-logo{
          margin-right: 30px;
        }
        .iconfont{
            font-size: 24px;
        };
        .end-num{
          font-weight: bold
        }
        .icon-bind{
          background: #5ca2e7;
          color: #fff;
          font-size: 12px;
          font-style: normal;
          padding: 2px;
          margin-left: 5px;
        }
        .dialog-txt{
          margin-bottom: 20px;
        }
        .dialog-footer{
          text-align: center
        }
        .icon-tixing-copy{
          color: #fd6f01;
          vertical-align: middle;
          font-size: 32px;
          margin-right: 10px;
        }
        .my-card{
        position: relative;
        width: 280px;
        height: 135px;
        border: 1px solid #f6f6f6;
        float: left;
        margin-right: 30px;
        margin-bottom: 30px;
          .my-card-title{
              padding: 0 20px;
              background: #fcfcfc;
              height: 60px;
              line-height:  60px;
          }
          .my-card-info{
              padding: 20px;
              font-size: 12px;
              color: #696969
          }
        };
        .add-card{
          background: #fafafa;
          text-align: center;
          vertical-align: middle;
          padding: 30px 0 0 0;
          color: #959595;
          font-size: 12px;
        }
        .add-card:hover{
          border: 1px solid #b6b6b6
        }
        .del-bind{
          position: absolute;
          bottom: 10px;
          right: 20px;
          color: #696969;
          cursor: pointer;
        }
        .dialog-txt{
          text-align: center
        } 
    }
  }
</style>

