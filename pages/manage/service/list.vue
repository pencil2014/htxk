<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/service/list' }">售后/退款</el-breadcrumb-item>
          <el-breadcrumb-item>申请记录</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content service-list">
            <e-heading grade="1">申请记录</e-heading>
            <el-form v-bind="getFormProps()" :inline="true" class="order-list-search">
                <el-form-item label="申请时间" class="select-time">
                  <el-date-picker size="small" v-model="date" type="date" default-value  placeholder="请选择日期" :picker-options="pickerOptions0"></el-date-picker>
                </el-form-item>
                <el-form-item label="输入搜索">
                  <el-input size="small" class="search-input" v-model="query.param" placeholder="输入商品标题或退款单号进行搜索"></el-input>
                </el-form-item>
                <el-button size="small" type="primary-plain" native-type="submit" class="search-btn">搜索</el-button>
            </el-form>
            <table border="0" class="order-table-list list-tb" width="100%">
                <thead>
                    <tr>
                      <th width="40%">商品</th>
                      <th width="15%">退款金额（元）</th>
                      <th width="15%">退款数量</th>
                      <th width="15%">审核状态</th>
                      <th width="15%">操作</th>
                    </tr>
                </thead>
              <tbody v-for="(item, n) of refundsList.list" :key="n" >
                  <tr class="sep-row" v-if="n != 0"><td colspan="5"></td></tr>
                  <tr class="tr-th">
                      <td colspan="5">
                          <span class="order-num">退款号： {{ item.refundNumber }}</span>
                          <span class="order-time">申请时间：{{ item.createTime }}</span>
                          <span class="order-shop-name">{{ item.vendorNickname }}</span>
                      </td>
                  </tr>
                  <tr class="tr-td" :id="item.id">
                      <td class="td-good-pd" >
                          <div class="good-item">
                              <div class="p-img">
                                <nuxt-link target='_blank' :to="{path:'/manage/service/detail', query:{refundNumber: item.refundNumber}}">  <e-img :src="item.imgUrl" :size="[78,78]" /></nuxt-link>
                              </div>
                              <div class="p-msg">
                                  <div class="p-name">
                                      <nuxt-link target='_blank' :to="{path:'/manage/service/detail', query:{refundNumber: item.refundNumber}}">{{ item.goodsName }}</nuxt-link>
                                      <nuxt-link target='_blank' class="link" 
                                        style="display:block;"
                                        :to="cardNextStep(item)" 
                                        v-if='item.isShow == 0'
                                       >
                                        服务卡
                                      </nuxt-link>
                                  </div>
                              </div>
                          </div>
                      </td>
                      <td  class="line-td-rl">
                          <p >{{item.payPrice | formatMoney}}</p>
                      </td>
                      <td  class="line-td-rl">{{ item.quantity }}</td>
                      <td class="line-td-rl" >
                            <p  v-for="(items, index) in refundStatusList" :key="index" v-if="item.refundStatus === items.value">{{ items.label }}</p>
                      </td>
                      <td  class="line-td-rl">
                          <p class="order-detail-link"><nuxt-link target='_blank' :to="{path:'/manage/service/detail', query:{refundNumber: item.refundNumber}}">查看</nuxt-link></p>
                      </td>
                  </tr>
              </tbody>
              <tbody v-if="refundsList.list && refundsList.list.length == 0"><tr class="no-info-list"><td colspan="6">暂无数据</td></tr></tbody>
            </table>
            <el-pagination
                v-bind="getPaginationProps(refundsList)"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
              >
            </el-pagination>
        </div>
  </div>
</template>
<script>
import api from 'api/aftersales'
import { pagingList } from 'utils/mixins'
import ElPagination from '@element-ui/Pagination'
import ElDatePicker from '@element-ui/DatePicker'
// import axios from 'axios'
export default {
  mixins: [pagingList],
  layout: 'manage',
  components: {
    ElDatePicker,
    ElPagination
  },
  methods: {
    // 服务卡下一步url
    cardNextStep (item) {
      return item.cardNextStepUrl ? item.cardNextStepUrl : `/manage/card/detail?cardNo=${item.cardNo}`
    },
    fetch () {
      this.getRefundsList(this.query)
    },
    // 确认取消订单
    handleConfirm () {
      this.dialogVisible = false
      if (this.form.cancelReasonLi.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择取消订单的原因',
          duration: 2000,
          type: 'error'
        })
      } else {
        this.cancelList(this.form.orderId, this.form.cancelReasonLi)
      }
    },
    // 获取售后退款记录
    getRefundsList () {
      api.refundsList(this.query)
        .then((res) => {
          this.refundsList = res.data
          console.log(res)
        })
    }
  },
  data () {
    return {
      query: this.getQuery({status: '', time: null}),
      dialogVisible: false,
      cancelReasonsList: '',
      // 订单状态
      refundStatusList: [
        {label: '申请审核', value: 1},
        {label: '审核失败', value: 2},
        {label: '进行退款', value: 3},
        {label: '处理完成', value: 4},
        {label: '退款失败', value: 5}
      ],
      refundsList: {
        list: ''
      },
      form: {
        name: '',
        cancelReasonLi: '',
        orderId: ''
      },
      pickerOptions0: {
        disabledDate (time) {
          // 若需要禁止以前的日期就开启
          // return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  computed: {
    // 时间格式化
    date: {
      set (value) {
        if (value) {
          this.query.time = value.getTime()
        } else {
          this.query.time = ''
        }
      },
      get () {
        return this.query.time ? new Date(this.query.time) : ''
      }
    }
  },
  mounted () {
    this.query.status = this.$route.query.status ? this.$route.query.status : ''
    if (this.$route.query.time) {
      // 转为数字赋值给data
      this.date = new Date(this.$route.query.time - 0)
    }
  }
}
</script>
<style lang="scss">
  
  @import '~assets/styles/order';
  .service-list{
    .order-detail-link{
      color: #3983e5
    }
    .order-list-search{
      float: right;
    }
    .order-num-txt{
      font-size: 12px;
    }
  }
</style>
