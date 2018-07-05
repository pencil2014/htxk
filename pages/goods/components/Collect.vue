<template>
  <div class="collect-link" @click='collectLinkAction' :class="{ active: isActive}">
    <i class="icon iconfont icon-shoucang"></i>
    收藏
  </div>
</template>
<script>
  import api from 'api/goods'
  import Vue from 'vue'
  export default {
    props: {
      detail: {
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        isFavorite: '',
        isActive: ''
      }
    },
    watch: {
      '$store.state.user.session' (value) {
        this.isFavoriteStatus(true)
      }
    },
    methods: {
      // 判断当前收藏是否登录
      collectLinkAction () {
        let userId = this.$store.state.user.session.userId || ''
        if (userId.length < 3) {
          Vue.component('XLogin', function (resolve) {
            require(['@/pages/member/components/XLogin'], resolve)
          })
          this.$set(this.$store.state, 'loginDialog', true)
          return false
        } else {
          this.isFavoriteStatus()
        }
      },
      // 成功收藏
      collectAction () {
        api.goodsCollectConfirm({
          favoriteType: '3',
          bizId: this.detail.goodsCode
        })
          .then((res) => {
            if (res) {
              this.isFavorite = 1
              this.isActive = true
            }
          })
      },
      // 取消收藏
      delCollectAction () {
        api.delGoodsCollect({
          favoriteType: '3',
          bizId: this.detail.goodsCode
        })
          .then((res) => {
            if (res) {
              this.isFavorite = 0
              this.isActive = false
            }
          })
      },
      // 获取收藏状态  start 为是否获取渲染收藏状态
      isFavoriteStatus (start) {
        api.goodsDetailsData({
          goodsCode: this.detail.goodsCode
        })
          .then((res) => {
            if (res) {
              this.isFavorite = res.data.isFavorite
              if (start) { // 更新收藏状态
                if (this.isFavorite === 1) {
                  this.isActive = true
                } else {
                  this.isActive = false
                }
              } else { // 用户点击收藏按钮
                if (this.isFavorite === 1) {
                  this.delCollectAction()
                } else {
                  this.collectAction()
                }
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  
  .collect-link{
    margin-top: 8px;
    display: inline-block;
    cursor: pointer;
    color: #ccc;
    .icon-shoucang {
      color: #ccc;
    }
    &.active{
      color: $color-primary;
      .icon-shoucang {
        color: $color-primary;
      }
    }
  }
</style>