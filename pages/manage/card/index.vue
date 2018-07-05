<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/card/' }">我的内容</el-breadcrumb-item>
      <el-breadcrumb-item>我的服务</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面内容 -->
    <div class="content">
      <!-- 页面标题 -->
      <!-- 提示框 -->
      <el-popover
        ref="popover"
        placement="bottom-start"
        title=""
        width="500"
        trigger="hover"
       >
       <div class="views">
          <p>当您在我们平台进行任何服务购买后，求苗将会全程跟踪服务。以达到用户对我们的服务商品在购买、使用、售后过程中，得到最佳的体验。</p>
          <p>您可以通过服务卡进行平台服务消费的便捷操作：</p>
          <p>服务对比，商品购买，服务跟踪，服务评价，服务管理，数据统计。</p>
          <p>感谢每一位选择使用求苗服务的用户！</p>
        </div>
      </el-popover>
      <div class="divider">
        <e-heading grade="1">我的服务卡 <small v-show="cards.total">（共{{cards.total}}张）</small><span v-popover:popover><i class="iconfont icon">&#xe690;</i></span></e-heading>
      </div>
      <div class="search">
        <el-form v-bind="getFormProps()" :inline="true" class="order-list-search">
          <el-form-item label="名称：">
            <el-input size="small" class="search-input" v-model="query.cardName" placeholder="请输入服务卡名称"></el-input>
          </el-form-item>
          <el-form-item label="有效期:" class="select-time">
            <el-date-picker
              size="small"
              v-model="dateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              placeholder="选择日期范围"
              range-separator="~">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select size="small" v-model="query.statu" placeholder="请选择" >
                <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label=" 类 型：">
            <el-select size="small" v-model="query.type" placeholder="请选择" >
                <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
          <el-button size="small" type="success" native-type="submit" class="search-btn">搜索</el-button>
        </el-form>
      </div>
      <div v-loading="loading"></div>
      <div class="card-list" v-if="cards.total">
        <div v-for="(item,index) in cards.list" :class="['card-item', (item.state === 1 || item.state === 2 || item.state === 3) ? 'active' : 'fail']" :key="index" @click="goInfo(item)">
          <p class="img">
            <e-img :size='[196, 196]' :src="item.cardImgUrl " alt="item.title" :class="{'gray': (item.state === 4 || item.state === 5 || item.state === 6)}"></e-img>
          </p>
          <p class="title">{{item.cardName}}</p>
          <div class="info">
            <p class="left">
              <span :class="['icon', {'white': item.busType === 0}, {'blue': item.busType === 1},  {'orange': item.busType === 2}, {'black': item.busType === 3},]"><i class="iconfont">&#xe683;</i></span>
              <span class="value" v-if="item.usageCount||item.usageCount===0">{{item.usageCount}}{{item.usageUnit}}</span>
            </p>
            <span class="time" v-if="item.recently">最近添加</span>
          </div>
          <div :class="['status', {'noactive': item.state === 1}, {'available': (item.state === 2 || item.state === 3)}, {'unavailable': (item.state === 4 || item.state === 5 || item.state === 6)}]">
            {{item.state | formatStatus}}
          </div>
          
        </div>
      </div>
      <!-- 没有数据 -->
      <e-placeholder text="没有相关服务卡数据!"  v-else></e-placeholder>
      <!-- 分页组件 -->
        <el-pagination
            layout='prev, pager, next, jumper, total'
            v-bind="getPaginationProps(cards)"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          >
        </el-pagination>
    </div>
  </div>
</template>
<script>
import api from 'api/card'
import { pagingList } from 'utils/mixins'
import ElPagination from '@element-ui/Pagination'
import ElPopover from '@element-ui/Popover'
import ElDatePicker from '@element-ui/DatePicker'
export default {
  mixins: [pagingList],
  layout: 'manage',
  components: {
    ElDatePicker,
    ElPagination,
    ElPopover
  },
  methods: {
    // 获取数据
    fetch (query) {
      api.cardList(query)
        .then((res) => {
          this.cards = res.data
          this.loading = false
        })
    },
    // 进入服务卡详情
    goInfo (item) {
      if (item.currentStepUrl) {
        this.$router.push(item.currentStepUrl)
      } else {
        this.$router.push(`/manage/card/detail?cardNo=${item.cardNo}`)
      }
    }
  },
  filters: {
    formatStatus (value) {
      let status = {
        1: '未激活',
        2: '可使用',
        3: '已完成',
        4: '不可用',
        5: '已终止'
      }
      return status[value]
    }
  },
  computed: {
    loadmore () {
      return this.cards.list.length < this.cards.total
    },
    dateRange: {
      set (value) {
        if (!value) {
          this.query.beginTime = ''
          this.query.endTime = ''
          return
        }
        this.dateRangeMid = value
        this.query.beginTime = value[0] ? new Date(value[0]).getTime() : ''
        this.query.endTime = value[1] ? new Date(value[1]).getTime() + 86400000 - 1 : ''
      },
      get () {
        return this.dateRangeMid
      }
    }
  },
  data () {
    return {
      query: this.getQuery({
        rows: 32,
        statu: ''
      }),
      cards: {},
      pickerOptions: {
        // disabledDate (time) {
        //   return time.getTime() > Date.now()
        // }
      },
      dateRangeMid: [],
      status: [{label: '全部', value: 'all'}, {label: '未激活', value: '1'}, {label: '可使用', value: '2'}, {label: '已完成', value: '3'}, {label: '不可用', value: '4'}, {label: '已终止', value: '5'}, {label: '已冻结', value: '6'}],
      types: [{label: '全部', value: 'all'}, {label: '赛事', value: '1'}, {label: '培训', value: '2'}, {label: '票务', value: '3'}, {label: '其他', value: '0'}],
      loading: true
    }
  },
  mounted () {
    if (this.$route.query.beginTime && this.$route.query.endTime) {
      this.dateRangeMid = [new Date(this.$route.query.beginTime - 0), new Date(this.$route.query.endTime - 0)]
    }
  }
}
</script>
<style lang="scss" scoped>

.el-popover {
  .views {
    padding: 2px 5px 0;
    p {
      padding-bottom: 5px;
    }
  }
}
.content {
  .heading-1 {
    margin-bottom: 15px;
    small {
      font-size: 12px;
    }
    .icon {
      color: $color-sub;
      font-weight: lighter;
      cursor: pointer;
    }
  }
  .search {
    margin: 15px 0;
    .el-select{ 
      width: 220px;
    }
    .el-form-item { 
      margin-bottom: 10px;
      margin-right: 20px;
    }
    .search-btn {
      min-width: 100px;
    }
  }
  .card-list {
    .card-item {
      display: inline-block;
      width: 196px;
      margin-right: 15px;
      border: 1px solid $border-color-base;
      overflow: hidden;
      position: relative;
      padding-bottom: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      &:nth-child(4n+4) {
          margin-right: 0;
        }
      .img {
        position: relative;
        .gray {
          -webkit-filter: grayscale(1); /* Webkit */  
          filter: gray; /* IE6-9 */    
          filter: grayscale(1); /* W3C */ 
        }
      }
      .title {
        padding: 5px;
        line-height: 25px;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
      }
      .info{
        padding: 0 5px;
        font-size: 12px;
        height: 30px;
        line-height: 30px;
        position: relative;
        .value {
          color: #fa0000;
          display: inline-block;
        }
        .icon {
          vertical-align: middle;
          display: inline-block;
          i {
            font-size: 1.8rem;
            margin-right: 5px;
          }
          &.white {
            color: #cecccd;
          }
          &.blue {
            color: #2774cc;
          }
          &.orange {
            color: #d38619;
          }
          &.black {
            color: #43768f;
          }
        }
        .time {
          color: $color-sub;
          position: absolute;
          bottom: 5px;
          right: 5px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
        }
      }
      .status {
        position: absolute;
        font-size: 12px;
        color: $color-white;
        width: 100px; 
        height: 30px;
        right: -30px;
        top: 5px;
        line-height: 30px; 
        text-align: center;
        transform: rotate(45deg);
        &.available {
          background-color: #70d77b;
        }
        &.unavailable {
          background-color: #c1c1c1;
        }
        &.noactive {
          background-color: #e94141;
        }
      }
      &:hover {
        border-color: #24c881;
        background-color: $color-background-sub;
        opacity: 0.9;
      }
      
    }
    .fail {
      color: $color-sub;
      .info {
        .value {
          color: $color-sub;
        }
      }
      .img {
        .time {
          background-color: $color-sub;
        }
      }
      &:hover {
        border-color: $color-divider;
      }
    }
  }
  .more-btn {
    text-align: center;
    margin-top: 20px;
    button {
      padding: 10px 30px;
      color: $color-black-base;
      &:hover {
        color: $color-link;
      }
    }
  }
}

</style>