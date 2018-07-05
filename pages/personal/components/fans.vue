<template>
<div class="personal-list">
    <el-tabs v-model="activeNameShareB" @tab-click="changeTabNav" class="ac-nav">
        <el-tab-pane label="粉丝" name="0">
            <div v-if="activeNameShareB === '0'">
                <div  v-if="fansInfo && fansInfo.list && fansInfo.list.length>0">
                    <ul class="fans-list">
                        <FansList v-for='(fansList, index) in fansInfo.list' :key="index" :item='fansList'/>
                    </ul>
                  </div>
                  <e-placeholder v-else text="没有粉丝哦"/>
                  <el-pagination
                      v-bind="getPaginationProps(fansInfo)"
                      @current-change="handleCurrentChange"
                      @size-change="handleSizeChange"
                      :page-sizes="[5, 10, 15, 20]"
                      :page-size="5"
                    >
                  </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane label="关注" name="1">
           <div v-if="activeNameShareB === '1'">
                  <div class="fans-box" v-if="followInfo && followInfo.list && followInfo.list.length>0">
                    <ul>
                        <FansList v-for='(followList, index) in followInfo.list' :key="index" :item='followList'/>
                    </ul>
                  </div>
                  <e-placeholder v-else text="没有关注哦"/>
                  <el-pagination
                      v-bind="getPaginationProps(followInfo)"
                      @current-change="handleCurrentChange"
                      @size-change="handleSizeChange"
                      :page-sizes="[5, 10, 15, 20]"
                      :page-size="5"
                    >
                  </el-pagination>
           </div>
        </el-tab-pane>
      </el-tabs>
</div>
</template>
<script type="text/javascript">
import { pagingList } from 'utils/mixins'
import { mapGetters } from 'vuex'
import ElPagination from '@element-ui/Pagination'
import Follow from '../../components/Follow'
import FansList from './fansList'
export default {
  mixins: [pagingList],
  components: {
    Follow,
    ElPagination,
    FansList
  },
  computed: {
    ...mapGetters({
      fansInfo: 'personal/fans',
      followInfo: 'personal/follow'
    })
  },
  methods: {
    changeTabNav (tab, event) {
      this.query.rows = 5
      this.query.page = 1
      this.query.fans = tab.index
      this.submit()
    }
  },
  data () {
    return {
      activeNameShareB: '0',
      defaultIconUrl: '/resources/images/default_photo.jpg',
      // this.query分页调用
      query: this.getQuery({
        page: this.$route.query.page,
        rows: this.$route.query.rows || 5,
        type: '1',
        shared: '0',
        fans: this.$route.query.fans || '0'
      })
    }
  }
}
</script>


