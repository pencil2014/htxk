<template>
  <div class="recommend-box">
    <div class="header">
      <i class="icon"  >
        <!-- <e-img :src="headerIcon" /> -->
        <img :src="headerIcon" />
      </i>
      <span class="title">{{headerTitle}}</span>
      <span class="refresh" @click="changeStar">
        <i class="fresh-icon iconfont">&#xe60a;</i>
        <span class="text">换一批</span>
      </span>
    </div>
    <div class="recommend-content">
      <ul>
        <li v-for="(item,index) in recommendList" :key="index" v-if="index < 5">
          <nuxt-link class="photo" target="_blank"  :to="'/personal/' + item.userId" >
            <e-avatar :size="[46,46]" class="photo-img" :src="item.iconUrl" :alt="item.nickName" />
          </nuxt-link>
          <div class="info">
            <!-- 后端字段一会叫nickName，一会叫ipName -->
            <div class="name">{{item.nickName || item.ipName}}</div>
            <div class="fans">{{item.followNum || 0}}粉丝</div>
          </div>
          <div class="follow-box">
            <follow :item="item"/>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import follow from '../../components/Follow'
  export default {
    components: {
      follow
    },
    props: {
      headerIcon: {
        type: String
      },
      headerTitle: {
        type: String,
        default: '同城明星'
      },
      recommendList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      changeStar () {
        this.$emit('changeStar')
      }
    }
  }
</script>
<style lang="scss" scoped>
  
  .header{
    margin-top:10px;
    margin-bottom:19px;
    font-size:0;
    .icon{
      vertical-align:middle;
    }
    .title{
      font-size: 18px;
      font-weight: normal;
      margin-left: 10px;
      vertical-align:middle;
      display:inline-block;
      width:135px;
    }
    .refresh{
      display:inline-block;
      font-size:0;
      color:$color-sub;
      cursor:pointer;
      &:hover{
        color:$color-primary;
      }
      .fresh-icon{
        font-size:12px;
        vertical-align:middle;
        display:inline-block;
        padding-right:5px;
      }
      .text{
        font-size:12px;
        vertical-align:middle;
        display:inline-block;
      }
    }
  }
  .recommend-content{
    background: rgb(248, 248, 248);
    padding-left:10px;
    ul li{font-size:0; padding:10px 0;}
    .photo{
      // width:56px;
      width:52px;
      height:46px;
      vertical-align:middle;
      display:inline-block;
      img{
        border-radius:50%;
      }
    }
    .info{
      // width:100px;
      width:90px;
      vertical-align:middle;
      display:inline-block;
      font-size:14px;
      .name{
        width:100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: nowrap;
      }
      .fans{
        font-size:12px;
        color:$color-sub;
      }
    }
    .follow-box{
      padding-left:4px;
      vertical-align:middle;
      display:inline-block;
    }
  }
</style>