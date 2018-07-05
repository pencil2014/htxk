<template>
  <div class="follow-btn" >
    <button 
      class="is-followed"
      size="mini" 
      @mouseenter='followedMouseenter()'
      @mouseleave='followedMouseleave()'
      @click='joinQuit("del", item)'
      v-if='item.isFollow || item.follow || !!item.isFollowed'
    >
      {{followedBtnText || '已关注'}}
    </button>

    <el-button type="primary"  size="mini" 
      @click="joinQuit('add', item)"
      v-else >
      <i class="icon iconfont" >&#xe661;</i>
      关注
    </el-button>


  </div>
</template>

<script>
import api from 'api/news'
import tools from 'utils/tools'
import Vue from 'vue'
export default {
  props: {
    item: {}
  },
  data () {
    return {
      followedBtnText: '已关注'
    }
  },
  methods: {
    followedMouseenter () {
      this.followedBtnText = '取消关注'
    },
    followedMouseleave () {
      this.followedBtnText = '已关注'
    },
    joinQuit (option, item) {
      if (tools.getHeaders(window.document.cookie)) {
        api.followUser({
          option,
          userId: item.userId || item.ipId // 后端一会叫ipId，一会叫userId
        }, {
          context: this,
          successMsg: 'none'
        }).then((res) => {
          console.log(1)
          if (Number(res.result) === 0 && option === 'add') {
            this.item.isFollow = true // 后端一会叫isFollow，一会叫follow
            this.item.follow = true
            this.item.isFollowed = 1
          } else if (Number(res.result) === 0 && option === 'del') {
            this.item.isFollow = false
            this.item.follow = false
            this.item.isFollowed = 0
          }
        }).catch(() => {
        })
      } else {
        Vue.component('XLogin', function (resolve) {
          require(['@/pages/member/components/XLogin'], resolve)
        })
        this.$set(this.$store.state, 'loginDialog', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.follow-btn{
  .el-button--mini {
      min-width: 66px;
  }
  .is-followed{
    padding: 6px;
    border:none;
    background: $color-sub;
    border-radius: 3px;
    line-height: 16px;
    color:#fff;
    min-width: 66px;
    outline:none;
    &:hover{
      background: $color-primary;
    }
  }
}
</style>
