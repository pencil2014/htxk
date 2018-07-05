<template>
  <el-tabs v-model="couponStatus" >
    <el-tab-pane label="我的优惠券" name="1">
      <div class="coupon-list-box" v-if="couponList.length > 0">
        <div class="list">
          <div v-for="(item, index) in couponList" :class="['list-item', selectCoupon.codeId === item.codeId ? 'select' : 'active']" @click="setCoupon(item)" :key="index">
            <p class="name" :title="item.couponName">{{item.couponName}}</p>
            <p class="price"><b>￥{{item.couponValue | formatCouponValue}}</b></p>
            <p class="condition" v-if="!item.useValue">无限制</p>
            <p class="condition" v-else>满{{item.useValue | formatCouponValue}}元可用</p>
            <ul class="info">
              <li class="plat">• 适用平台：{{item.deviceType | formatDeviceType}}</li>
                <li class="validity">• 有效期至：{{item.startTime | formatTime}} ~ {{item.endTime | formatTime}}</li>
            </ul>
            <div :class="['status', (item.tag === 1 || item.tag === 6 || item.tag === 7) ? 'active' : 'fail', {red: item.tag === 7}]">
              {{item.tag | formatStatus}}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="nodata">
        <i class="iconfont">&#xe91d;</i>暂时没有可用优惠券！
      </div>
    </el-tab-pane>
    <el-tab-pane label="领取优惠券" name="2">
      <div class="exchange">
        <div class="coupon-item">
          <label>输入兑换码</label>
          <el-input  v-model.trim="couponCode"  placeholder="请输入兑换码" ></el-input>
        </div>
        <div class="coupon-item">
          <label>图形验证码</label>
          <e-img-code ref="imgcode" v-model="imgCode" action="/manage/sms/generateValidateCode" :params="{type: 11}" style="width:300px" />
        </div>
        <div class="coupon-item">
          <el-button  type="primary" class="btn" @click="getCoupon">兑换</el-button>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script type="text/javascript">
import api from 'api/order'
import EImgCode from '@e-ui/ImgCode'

export default {
  components: {
    EImgCode
  },
  props: {
    selectCoupon: {
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      couponStatus: '1', // 优惠券tab
      couponList: [], // 可领优惠券
      couponCode: '', // 兑换码
      imgCode: '', // 图形验证码
      couponBtnStatus: false // 防止重复提交
    }
  },
  mounted () {
    this.getCouponList()
  },
  methods: {
    // 获取优惠券列表
    getCouponList () {
      let total = this.price * this.total
      api.couponList({
        totalAmount: total,
        page: 1,
        rows: 100
      }, {successMsg: 'none'}).then((res) => {
        this.couponList = res.data.list
      })
    },
    // 选择优惠券
    setCoupon (item) {
      this.$emit('setCoupon', item)
    },
    // 兑换优惠券
    getCoupon () {
      if (this.couponBtnStatus) {
        return false
      }
      if (!this.couponCode) {
        this.$message.error('兑换码不能为空！')
        return false
      }
      if (!this.imgCode) {
        this.$message.error('图形验证码不能为空！')
        return false
      }
      this.couponBtnStatus = true // 防止重复提交
      api.exchangeCoupon({
        exchangeCode: this.couponCode,
        validateCode: this.imgCode
      })
        .then((res) => {
          this.$refs.imgcode.refresh() // 刷新验证码
          this.$message.success('优惠券兑换成功！')
          this.getCouponList()
          this.couponBtnStatus = false
          this.couponCode = ''
          this.imgCode = ''
        }).catch(() => {
          this.couponBtnStatus = false
          this.$refs.imgcode.refresh() // 刷新验证码
        })
    }
  },
  filters: {
    formatTime (val) {
      return val.split(' ')[0]
    },
    formatCouponValue (val) {
      return val ? (val / 100) : ''
    },
    formatStatus (val) {
      let status = {
        1: '未使用',
        2: '已使用',
        4: '已过期',
        5: '已作废',
        6: '最新',
        7: '将过期'
      }
      return status[val]
    },
    formatUseScope (val) {
      let status = {
        1: '全场通用',
        2: '指定商品',
        3: '指定分类'
      }
      return status[val]
    },
    formatDeviceType (val) {
      let text = ''
      switch (val) {
        case 1:
          text = 'PC'
          break
        case 2:
          text = 'Android'
          break
        case 3:
          text = 'IOS'
          break
        case 4:
          text = 'H5'
          break
        case '2,3':
          text = 'APP'
          break
        case '2,3,4':
          text = '移动端'
          break
        default:
          text = '全平台'
          break
      }
      return text
    }
  }
}
</script>

<style  lang="scss" scoped>

.coupon {
  margin-top: 20px;
  .coupon-list-box {
    overflow-x: hidden;
    margin-top: 10px;
    height: auto;
    max-height: 350px;
    overflow-y: auto;
    .list-item {
      display: inline-block;
      width: 250px;
      height: 250px;
      margin:0 15px 10px 0;
      position: relative;
      overflow: hidden;
      text-align: center;
      cursor: pointer;
      p, li {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      &:nth-child(4n+4) {
      margin-right: 0;
    }
      &.active {
        background: url('/images/coupon/active.png') no-repeat left top;
        background-size:cover;
      }
      &.select {
        background: url('/images/coupon/select.png') no-repeat left top;
        background-size:cover;
      }
      .status {
        position: absolute;
        font-size: 12px;
        color: $color-white;
        width: 80px; 
        height: 80px;
        right: -42px;
        top: -42px;
        line-height: 135px; 
        text-align: center;
        transform: rotate(45deg);
        &.active {
          background-color: #fd7b13;
        }
        &.fail {
          background-color: #dcdcdc;
        }
        &.red {
          background-color: #F92A34;
        }
      }
      .name {
        text-align: center;
        color: #FAA24D;
        padding: 30px 25px 0 25px;
        line-height: 1.5;
      }
      .price {
        font-size: 16px;
        font-weight: bold;
        height: 60px;
        line-height: 60px;
        b {
          font-size: 40px;
        }
      }
      .condition {
        font-size: 12px;
        color: $color-black-base;
        line-height: 1.5;
      }
      ul {
        padding: 40px 10px 10px 10px;
        font-size: 12px;
        line-height: 1.5;
        li {
          text-align: left;
          color: $color-black-base;
        }
      }
    }
  }
  .exchange {
    padding-top: 20px;
    .coupon-item {
      margin-bottom: 20px;
      label {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        width: 100px;
        &:before {
          content: '*';
          color: #ff4949;
          margin-right: 4px;
        }
      }
      .el-input {
        display: inline-block;
        width: 300px;
      }
      .img-code {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .btn {
      margin-left: 100px;
    }
  }
}
</style>

<style lang="scss">

.coupon {
  .nodata {
    text-align: center;
    color: $color-sub;
    font-size: 12px;
    i {
      margin-right: 5px;
    }
  }
}
</style>