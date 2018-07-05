<template>
    <span :class="[className,handleData.isDigg ? 'active' :'']" @click="praise(handleData)">
      <i class="iconfont praise-icon-active" v-if="isComment && praiseStatus">&#xe658;</i>
      <i class="iconfont praise-icon" v-else>&#xe65c;</i>
      <span class="text">
        {{handleData.diggCount}}
      </span>
    </span>
</template>
<script>
  import bbsApi from 'api/community'
  import Vue from 'vue'
  export default {
    data () {
      return {
        control: false
      }
    },
    props: {
      handleData: {
        type: Object,
        default: {}
      },
      className: {
        type: String
      },
      isComment: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      praiseStatus () {
        return !!this.handleData.isDigg
      }
    },
    methods: {
      praise (handleData) {
        if (this.control) {
          return false
        }
        let userId = this.$store.state.user.session.userId || ''
        if (userId.length < 3) {
          Vue.component('XLogin', function (resolve) {
            require(['@/pages/member/components/XLogin'], resolve)
          })
          this.$set(this.$store.state, 'loginDialog', true)
          return false
        }
        this.control = true
        let loadData = {}
        if (this.isComment) {
          loadData = {commentId: handleData.commentId}
        } else {
          loadData = {feedId: handleData.feedId}
        }
        loadData = Object.assign(loadData, {isComment: this.isComment})
        if (handleData.isDigg) {
          bbsApi.delDiggAction(loadData, {successMsg: '取消点赞成功！'}).then((res) => {
            if (res.result === '0') {
              this.$set(handleData, 'isDigg', false)
              this.$set(handleData, 'diggCount', handleData.diggCount - 1)
              this.control = false
            }
          }).catch((e) => {
            this.control = false
          })
        } else {
          bbsApi.diggAction(loadData, {successMsg: '点赞成功！'}).then((res) => {
            if (res.result === '0') {
              this.$set(handleData, 'isDigg', true)
              this.$set(handleData, 'diggCount', handleData.diggCount + 1)
              this.control = false
            }
          }).catch((e) => {
            this.control = false
          })
        }
      }
    },
    mounted () {
    }
  }
</script>
<style lang="scss" scoped>
  
</style>