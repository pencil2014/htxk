<template>
  <div>
    <!-- <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/activity' }" >个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>我的关注</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class='content follow-page'>
      <e-heading grade="1">我的关注</e-heading>
      <div class="divider"></div>
      <div v-if='followData && followData.length > 0'>
        <el-row    :class='{"divider": indexs < followData.length -1 }'  v-for='(items, indexs) in followData'  :key='indexs'>
          <el-col :span="12"   v-for='(item, index) in items' :key='index'  >
            <follow-item   :follow-data='item'   @click.native='followClick(indexs, index)'   @followAction='followAction'  />
          </el-col>
        </el-row>

        <el-pagination
          v-bind="getPaginationProps(paginationData)"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <e-placeholder v-else />
    </div>
  </div>
</template>

<script>
import api from 'api/user'
import followItem from './components/followItem'
import { pagingList } from 'utils/mixins'
import ElPagination from '@element-ui/Pagination'

export default {
  layout: 'manage',
  mixins: [pagingList],
  components: {
    followItem,
    ElPagination
  },
  mounted () {
    this.getFollowList()
  },
  methods: {
    getFollowList () {
      api.myFollow(
        this.query
      )
        .then((res) => {
          if (res) {
            this.paginationData = res.data
            this.originalArray = res.data.list
            this.followData = this.arrayOneToTwo(this.originalArray)
          }
        })
    },
    open2 () {
      this.$confirm('确定取消关注吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitCollectFollow()
      })
    },
    followClick (rows, columns) {
      this.followIndex = rows * 2 + columns
    },
    followAction (followData) {
      this.operation = followData.operation // add del
      this.followerId = followData.userId // userId
      if (this.operation === 'del') {
        this.open2()
      } else {
        this.submitCollectFollow()
      }
    },
    submitCollectFollow () {
      api.collectFollow({
        operation: this.operation, // add del
        followerId: this.followerId // userId
      })
        .then((res) => {
          // 关注列表中取消关注要删除该item， 粉丝的，取消关注变为 相互关注
          // if (this.operation === 'del') {
          //   // this.originalArray.splice(this.followIndex, 1)
          //   // this.followData = this.arrayOneToTwo(this.originalArray)
          // }
          setTimeout(() => {
            if (this.operation === 'del') {
              this.getFollowList() // 以免不是最后一页的，产生空缺
            }
            this.$store.dispatch('user/user_all_info') // 更新侧边栏-个人中心的个人信息
          }, 1500)
        })
    },
    arrayOneToTwo (resItem) {
      let resList = []
      let arrLength = 0
      for (let i = 0; i < resItem.length; i++) {
        if (i % 2 === 1) {
          resList.push([resItem[i - 1], resItem[i]])
          arrLength += 2
        }
      }
      if (arrLength < resItem.length) {
        resList.push([resItem[resItem.length - 1]])
      }
      //
      //
      // let array1 = []
      // let array2 = []
      // for (let item of resItem) {
      //   if (array2.length < 2) {
      //     array2.push(item)
      //   } else {
      //     array1.push(array2)
      //     array2 = []
      //   }
      // }
      // array2.length && array1.push(array2)
      // goodsDetailData.data.baseSkuist = array2
      return resList
    }
  },
  data () {
    return {
      query: this.getQuery({
        rows: this.$route.query.rows || 20
      }),
      paginationData: null,
      originalArray: [], // 结果数组-1维数组
      followData: [],
      operation: '',
      followerId: '',
      followIndex: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  
  .follow-page{
    .heading-1 {
      margin: 0 0 20px 0;
    }
    .follow-num{
      color:#999;
      font-size:12px;
      font-weight:normal;
      margin-left:10px;
    }
  }
</style>

<style lang="scss">
  
</style>
