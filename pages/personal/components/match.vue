<template>
  <div class="personal-list user-match-box">
      <ul class="user-match-list" v-if="matchInfo && matchInfo.list && matchInfo.list.length>0">
        <li v-for='(matchList, index) in matchInfo.list' :key="index" :item='matchList'>
            <nuxt-link :to="'/personal/'+matchList.userId" target="_blank">
              <div class="match-logo"> <e-img :src="matchList.logoUrl" :size='[122, 122]'/></div>
            </nuxt-link>
            <div class="match-infor"> 
                <nuxt-link :to="'/match/detail?matchId='+ matchList.id" target="_blank">
                    <h2 class="title">{{matchList.matchName}}</h2>
                    <dl class="details-box"> 
                        <dt class="list type"> <span>运动类型：</span> <span class="text">{{matchList.matchTypeName}}</span> </dt> 
                        <dt class="list position"> <span>所在地区：</span> <span class="text">{{matchList.matchName}}</span> </dt> 
                        <dt class="list time"> <span>比赛日期：</span> <span class="text">{{matchList.showMatchTime}}</span> </dt> 
                        <dt class="list cost"> <span>报名费用：</span> <span class="text">{{matchList.showSignCost}}	</span> </dt> 
                    </dl>
                </nuxt-link>
              </div>
              <div class="match-btn" v-if='matchList.status == items.value' v-for="(items, index) in matchStatus" :key="index">
                <a href="javascript:void(0)" :class="items.style">
                    <span>
                        {{items.label}}
                    </span>
                </a>
                <div class="text">{{matchList.showSignTime}}</div></div> 
          </li>
      </ul>
       <e-placeholder v-else text="暂时没有赛事"/>
       <el-pagination
            v-bind="getPaginationProps(matchInfo)"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="5"
          >
        </el-pagination>
  </div>
</template>

<script type="text/javascript">
import { pagingList } from 'utils/mixins'
import ElPagination from '@element-ui/Pagination'
import { mapGetters } from 'vuex'
export default {
  mixins: [pagingList],
  components: {
    ElPagination
  },
  computed: {
    ...mapGetters({
      matchInfo: 'personal/match'
    })
  },
  data () {
    return {
      matchStatus: [
        {label: '预热中', value: '3', style: 'btn_pre'},
        {label: '报名中', value: '4', style: 'btn_ing'},
        {label: '报名截止', value: '5', style: 'btn_end'},
        {label: '进行中', value: '6', style: 'btn_success'},
        {label: '已结束', value: '7', style: 'btn_end'}
      ],
      // this.query分页调用
      query: this.getQuery({
        page: this.$route.query.page,
        rows: this.$route.query.rows || 5,
        type: '3',
        shared: '0',
        fans: '0'
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.user-match-box{
  .user-match-list{
    li {
      padding: 30px 0;
      font-size: 0;
      border-bottom: 1px solid #e5e5e5;
    }
    .match-logo {
      width: 122px;
      height: 122px;
      border-radius: 50%;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
    }
    .match-logo img {
        width: 100%;
        height: 100%;
    }
    .match-infor {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        width: 484px;
        margin-left: 30px;
        .title{
          font-size: 20px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
        }
    }
    .details-box {
      margin-top: 15px;
      .list {
        padding: 6px 0;
        font-size: 12px;
        color: #666;
      }
    }
    .btn_ing {
      background: #01a87c;
    }
    .btn_end {
      background: #bbb;
    }
    .btn_fail {
      background: #fc6f00;
    }
    .btn_success {
      background: #89d035;
    }
    .match-btn {
      vertical-align: top;
      float: right;
      margin-top: 6px;
      font-size: 12px;
      text-align: right;
      .text {
        margin-top: 10px;
      }
      a {
        padding: 6px 20px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        border-radius: 3px;
      }
    }
  }
}
</style>

