<template>
  <div class="user-item">
    <div class="user-item-photo">
      <nuxt-link :to="'/personal/'+item.userId">
        <e-avatar class="photo-img" :src="this.item.iconUrl" :size="[110,110]" :alt="item.authName"></e-avatar>
      </nuxt-link>
    </div>
    <div class="user-item-auth-icon">
       <img :src="item.pcImgtxtUrl" :alt="item.authName" height="100%" />
    </div>
    <div class="user-item-name">
      {{item.authName}}
    </div>
    <follow :item='item' :className="'big-user'" />
  </div>
</template>
<script type="text/javascript">
  import indexApi from 'api/index'
  import follow from './Follow'
  export default {
    components: {
      follow
    },
    props: {
      item: {
        type: Object
      }
    },
    data () {
      return {
      }
    },
    methods: {
      follow (item) {
        if (item.isFollowed) {
          return false
        }
        indexApi.followUser({followerId: item.userId}).then((res) => {
          if (res.result === '0') {
            this.$message('已关注')
            // item.isFollowed = true
            this.$set(item, 'isFollowed', true)
            // console.log(item)
          }
        })
      },
      handleError (src) {
        console.log(src)
      }
    }
  }
</script>
<style type="text/css" lang="scss">
  
  .user-item{
    position:relative;
    padding:30px 0;
    background:#f8f8f8;
    margin:16px 0;
    text-align:center;

    a{
      display: block;
      width:122px;
      height:122px;
      border: 1px solid #eaeaea;
      padding: 5px;
      margin: auto;
      border-radius:50%;
      img {
        border-radius:50%;
        width: 100%;
        height: 100%;
      }
    }
    &-auth-icon{
      height:14px;
      min-width:10px;
      margin-top: -15px;
      margin-bottom: 10px;
    }
    &-name{
      overflow: hidden;
      height:30px;
      line-height: 25px;
      text-overflow: ellipsis;
      margin-bottom:10px;
      max-width:200px;
      margin:0 auto;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .big-user{
      .follow{
        color: #fff;
        background-color: $color-primary;
        border: 1px solid $color-primary;
        padding: 10px;
        height:auto;
        min-width:70px;
        &.fllowed{
          cursor: default;
          color: #666;
          border-color: #c4c4c4;
          background:#fff;
        }
      }
    }
  }
</style>