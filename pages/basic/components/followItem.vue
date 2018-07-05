<template>
  <div class='follow-item ' >
    <e-cellbox class='follow-item-cellbox'>
      <e-cell-item class='follow-item-head'>
        <a class='a-link-url' :href='"/personal/" + followData.userId'  target="_blank">
          <div class='img' :style="{backgroundImage:`url(${followData.iconUrl || defaultHead})`}" ></div>
        </a>
      </e-cell-item>
      <e-cell-item>
        <div class='follow-item-name'>
          <h3 :title='followData.nickName'>{{followData.nickName}}</h3>
          <i class="iconfont boy " v-if="followData.sex==1">&#xe678;</i>
          <i class="iconfont girl" v-else>&#xe64e;</i>
        </div>
        <e-cellbox class='follow-item-follow'>
          <e-cell-item class='follow'>
            关注：<span>{{followData.concernNum || 0}}</span>
          </e-cell-item>
          <e-cell-item  class='follower'>
            粉丝：<span>{{followData.followNum || 0}}</span>
          </e-cell-item>
        </e-cellbox>
        <p class="follow-item-addr" >
          <i class="icon iconfont icon-shape3"></i>
          <span  :title='followData.areaCityName'>{{followData.areaCityName || '该用户还没有设置地址~'}}</span>
        </p>
        <p class="follow-item-sign"  :title='followData.sign' >签名：{{followData.sign || '这家伙很懒，什么都没有留下~'}}</p>

        <div class='follow-item-state'>
          <!-- 
            isFollowed (integer, optional): 是否关注  0未关注 1已关注;
            isFollowedMe (integer, optional): 是否关注了我 0未关注 1已关注;
            operation: '', // add del
            followerId: '' // userId
          -->

          <el-button class='followed'  size="mini"  
            v-if='followData.isFollowed == 1  && followData.isFollowedMe == 0'
            @click="followAction('del', followData.userId)"
          >
            已关注
          </el-button>
          <el-button class='each-other-follow' size="mini"  
            v-if='followData.isFollowed == 1 && followData.isFollowedMe == 1'
            @click="followAction('del', followData.userId)"
          >
            相互关注
          </el-button>
          <el-button class='to-follow' size="mini" type="primary"  
            v-if='followData.isFollowed == 0'
            @click="followAction('add', followData.userId)"
          >
            关注
          </el-button>
        </div>

      </e-cell-item>
    </e-cellbox>
  </div>
</template>

<script>
export default {
  layout: 'manage',
  props: {
    followData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      defaultHead: '/images/default_photo.jpg'
    }
  },
  methods: {
    followAction (operation, userId) {
      this.$emit('followAction', {operation, userId})
    }
  }
}
</script>

<style lang="scss" scoped>

.follow-item{
  padding:20px 30px 20px 40px;
  .follow-item-head{
    width: 106px;
    .a-link-url{
      display:block;
    }
    .img{
      border-radius: 100%;
      height: 80px;
      width:80px;
      overflow:hidden;
      background-size: cover;
      background-repeat:no-repeat;
      background-position: center center;
    }
  }
  .follow-item-name{
    line-height:20px;
    margin-bottom: 14px;
    h3{
      font-size:14px;
      color:#333;
      display:inline-block;
      max-width:214px;
      overflow:hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
      margin-right:5px;
    }
    span{
      display:inline-block;
    }
    .iconfont{
      border: 1px solid #fff;
      border-radius:100%;
      font-size:14px;
      vertical-align:top;
      display: inline-block;
      background:#fff;
      &.boy{
        color:#6ab1f3;
      }
      &.girl{
        color:#f980ab;
      }
    }
  }
  .follow-item-follow{
    display:table-row;
    font-size:12px;
    line-height:12px;
    .follow{
      border-right:1px solid #ccc;
      padding-right:20px;
    }
    .follower{
      padding-left:20px;
    }
    span{
      color:#fc6f00;
      margin-left:5px;
    }
  }
  .follow-item-addr{
    margin:14px 0;
    height:12px;
    font-size:12px;
    line-height:12px;
    .iconfont{
      font-size:12px;
      color:#ccc;
      margin-right:5px;
    }
    max-width:240px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .follow-item-sign{
    height:14px;
    font-size:12px;
    line-height:12px;
    max-width:240px;
    overflow:hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    margin-bottom: 10px;
  }
  .follow-item-state{
    span{
      display:inline-block;
      padding:0 8px;
      line-height:24px;
      border-radius: 2px;
    }
  }
}
</style>
