<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/coupon' }">我的优惠券</el-breadcrumb-item>
      <el-breadcrumb-item>我的优惠券</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="divider">
        <e-heading grade="1">我的优惠券</e-heading>
      </div>
      <!-- tab切换 -->
      <div class="tab-box coupon">
        <el-tabs v-model="tabStatus" @tab-click="getCoupon" class="tab">
          <el-tab-pane label="我的优惠券" name="1">
            <!-- 优惠券状态切换 -->
            <div class="coupon-status">
              <a href="javascript:;" v-for="(item, index) in statusArr" @click="changeStatus(item.val)" :class="{'active': query.couponStatus === item.val}" :key="index">{{item.text}}</a>
            </div>
            <!-- 优惠券列表 -->
            <div class="coupon-list-box" v-if="data.total">
              <div class="list">
                <div v-for="(item,index) in data.list" :class="['list-item', (item.tag === 1 || item.tag === 6 || item.tag === 7) ? 'active' : 'fail']" :key="index">
                  <p class="name" :title="item.couponName">{{item.couponName}}</p>
                  <p class="price"><b>￥{{item.couponValue | formatCouponValue}}</b></p>
                  <p class="condition" v-if="!item.useValue">无限制</p>
                  <p class="condition" v-else>满{{item.useValue | formatCouponValue}}元可用</p>
                  <ul class="info">
                    <li class="plat">• 适用平台：{{item.deviceType | formatDeviceType}}</li>
                    <li class="validity">• 有效期至：{{item.startTime | formatTime}} ~ {{item.endTime | formatTime}}</li>
                    <li class="description" :title ="item.description">• 详细说明：{{item.description}}</li>
                  </ul>
                  <div :class="['status', (item.tag === 1 || item.tag === 6 || item.tag === 7) ? 'active' : 'fail', {red: item.tag === 7}]">
                    {{item.tag | formatStatus}}
                  </div>
                </div>
              </div>
              
              <!-- 分页组件 -->
              <el-pagination
                  layout='total, prev, pager, next, jumper'
                  v-bind="getPaginationProps(data)"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                >
              </el-pagination>
            </div>
            <!-- 没有数据 -->
            <e-placeholder text="没有相关优惠券信息!"  v-else></e-placeholder>
          </el-tab-pane>
          <!-- 兑换优惠券 -->
          <el-tab-pane label="领取优惠券" name="2">
            <exchange @exchangSuc="exchangSuc" />
          </el-tab-pane>
        </el-tabs>
        <el-button type="link" class="explain-btn small" @click="goExplain">优惠券说明</el-button>
      </div>
            
    </div>
  </div>
</template>
<script>
import api from 'api/coupon'
import { pagingList } from 'utils/mixins'
import ElPagination from '@element-ui/Pagination'
import Exchange from './exchange'
export default {
  mixins: [pagingList],
  layout: 'manage',
  components: {
    ElPagination,
    Exchange
  },
  methods: {
    // 获取优惠券列表
    fetch (query) {
      api.couponList(query)
        .then((res) => {
          this.data = res.data
        })
    },
    // 切换优惠券状态
    changeStatus (status) {
      this.query.couponStatus = status
      this.fetch(this.query)
    },
    // 进入优惠券说明页
    goExplain () {
      this.$router.push('/manage/coupon/explain')
    },
    // 优惠券兑换成功
    exchangSuc () {
      this.exchangeStatus = true
    },
    // tab切换
    getCoupon () {
      if (this.tabStatus === '1' && this.exchangeStatus) {
        this.handleCurrentChange(1)
        this.fetch({
          page: 1,
          rows: 15,
          couponStatus: this.query.couponStatus
        })
        this.exchangeStatus = false
      }
    }
  },
  filters: {
    formatCouponValue (val) {
      return val ? (val / 100) : ''
    },
    formatTime (val) {
      return val.split(' ')[0]
    },
    formatStatus (val) {
      let status = {
        1: '未使用',
        2: '已使用',
        4: '已过期',
        5: '已作废',
        6: '新到',
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
  },
  data () {
    return {
      statusArr: [
        {val: '', text: '全部'},
        {val: 1, text: '未使用'},
        {val: 2, text: '已使用'},
        {val: 3, text: '已过期'}
      ],
      query: this.getQuery({
        couponStatus: ''
      }),
      data: {
        list: [],
        total: 0
      },
      tabStatus: '1',
      exchangeStatus: false
    }
  }
}
</script>
<style lang="scss" scoped>
 
.content {
  .tab-box {
    position: relative;
    .tab{
      padding-top: 5px;
    }
    .explain-btn {
      position: absolute;
      right: 0;
      top: 20px;
    }
    .coupon-status {
      background-color: $color-background-sub;
      padding: 5px 0;
      a {
        display: inline-block;
        width: 100px; 
        text-align: center;
        color: $color-black-base;
        &.active {
          color: $color-black;
          font-weight: bold;
        }
      }
    }
    .coupon-list-box {
      overflow-x: hidden;
      .list-item {
        display: inline-block;
        width: 265px;
        height: 250px;
        margin:20px 20px 0 0;
        position: relative;
        overflow: hidden;
        text-align: center;
        p, li {
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        &:nth-child(3n+3) {
          margin-right: 0;
        }
        &.active {
          background: url('/images/coupon/active.png') no-repeat left top;
          background-size:cover;
        }
        &.fail {
          background: url('/images/coupon/fail.png') no-repeat left top;
          background-size:cover;
          .name {
            color: $color-black-base;
          }
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
        }
        ul {
          padding: 30px 10px 10px 10px;
          font-size: 12px;
          li {
            text-align: left;
            color: $color-black-base;
          }
        }
      }
    }
  }
}
</style>