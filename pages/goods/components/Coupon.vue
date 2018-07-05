<template>
  <div class="coupon-box" v-if="list && list.length > 0">
    <e-cellbox class="table-row-height coupon" v-for="(item,index) in list" :key="index">
       <e-cell-item class="coupon-lab">优惠：</e-cell-item>
       <e-cell-item class="coupon-cnt">
         <b>满即减</b>
         <span>{{item.couponName}}</span>
         <el-button type="link" @click="getCoupon(item,index)">领券</el-button>
       </e-cell-item>
    </e-cellbox>
    <!-- 优惠券领取弹框 -->
    <el-dialog
      title="温馨提示"
      :visible.sync="couponDialog"
      size="small">
      <div class="suc">
      <!-- 满{{couponInfo.useValue | noPreformatMoney}}减{{couponInfo.couponValue | noPreformatMoney}}元 -->
        <span class="success" v-if="couponSuccess===1"><i class="iconfont">&#xe91c;</i>恭喜您已经领取了<b>{{couponInfo.couponName}}</b>优惠券！</span>
        <span class="success" v-if="couponSuccess===2">您已经领取了<b>{{couponInfo.couponName}}</b>优惠券，请勿重复领取！</span>
        <span class="time">使用时间：{{couponInfo.startTime | formatTime}} ~ {{couponInfo.endTime | formatTime}}</span>
        <p class="tips">查看我已领取的优惠券：<a href="javascript:;" @click="goCoupon">我的优惠券</a></p>
      </div>
      <!-- <div v-else>
        <span class="err"><i class="iconfont">&#xe754;</i>优惠券领取失败！</span>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="couponDialog = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from 'api/goods'
  import Vue from 'vue'
  export default {
    props: {
      list: {
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        couponInfo: {}, // 优惠券详情
        couponIndex: -1, // 领取优惠券index索引
        couponSuccess: 1, // 优惠券领取成功标志
        couponDialog: false // 优惠券弹窗
      }
    },
    filters: {
      formatTime (val) {
        return val ? val.split(' ')[0] : ''
      }
    },
    methods: {
      // 领取优惠券
      getCoupon (item, index) {
        let userId = this.$store.state.user.session.userId || ''
        this.couponInfo = item
        this.couponIndex = index
        if (userId.length < 3) {
          Vue.component('XLogin', function (resolve) {
            require(['@/pages/member/components/XLogin'], resolve)
          })
          this.$set(this.$store.state, 'loginDialog', true)
          return false
        }
        api.couponReceive({
          batchId: item.batchId
        }, {successMsg: 'none', errorMsg: 'none'}).then((res) => {
          this.couponSuccess = 1
          this.couponDialog = true
          // this.couponList.splice(index, 1)
        }).catch((err) => {
          // 已经领取弹出详情
          if (err.result === '16017' && err.msg === '已经领取过优惠券') {
            this.couponSuccess = 2
            this.couponDialog = true
            // this.couponList.splice(index, 1)
          } else {
            // 领取失败弹出错误提示
            this.$message.error(err.msg)
          }
        })
      },
      // 去优惠券页面
      goCoupon () {
        this.couponDialog = false
        this.$router.push('/manage/coupon/')
      }
    },
    mounted () {
      console.log(this.list)
    }
  }
</script>
<style lang="scss" scoped>

.coupon-box {
  max-height: 95px;
  overflow-y: auto;
  border:1px solid $border-color-base;
  padding-bottom: 10px;
  .coupon {
    margin-top: 15px;
    vertical-align: middle;
    overflow: hidden;
    .coupon-lab {
      width: 60px;
      text-align: right;
    }
    .coupon-cnt {
      b {
        display: inline-block;
        font-weight: normal;
        padding: 0 10px;
        margin-right: 5px;
        color: #f92a34;
        border:1px solid #f92a34;
        background-color: #ffdedf;
      }
      span {
        color: $color-black-base;
      }
      button {
        vertical-align: baseline;
        margin-left: 5px;
        color: #3C7DFF;
      }
    }
  }
}
.tips{
  margin-top: 5px;
  width: 500px;
  background: #f5f5f5;
  text-align: justify;
  
  padding:14px 20px 8px;
  box-sizing:border-box;
  &.actived-tips{
    margin-top: 40px;
    padding:18px 20px;
  }
  .select-tips{
    span{
      margin: 0 6px;
    }
  }
  h4{
    font-size: 18px;
    font-weight: 600px;
    line-height: 30px;
  }
  li{
    line-height: 24px;
    margin: 4px 0;
  }
}
.actived-tips{
  color: #fc6f00;
}
.suc {
  .success {
    display: block;
    text-align: center;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    i {
      font-size: 40px;
      color: $color-primary;
      margin-right: 5px;
      vertical-align: middle;
    }
    b {
      font-weight: normal;
      color: #F60808;
    }
  }
  .time, .tips {
    line-height: 2;
    display: block;
    text-align: center;
  }
  .time {
    color: $color-sub;
    font-size: 12px;
  }
  .tips {
    a {
      color: $color-link;
      margin-left: 5px;
    }
  }
}
.err {
  display: block;
  text-align: center;
  font-size: 16px;
  i {
    font-size: 40px;
    color: #ff4949;
    margin-right: 5px;
    vertical-align: middle;
  }
}
</style>