<template>
  <div class="star-box">
    <div class="header">
      <i class="icon">
        <!-- <e-img :src="headerIcon" /> -->
        <img src="/images/old/rising_star.png"  />
      </i>
      <span class="title">{{headerTitle}}</span>
      <span class="refresh" @click='changeSchool'>
        <i class="fresh-icon iconfont">&#xe60a;</i>
        <span class="text">换一批</span>
      </span>
    </div>
    <div class="recommend-content">
      <ul>
        <li v-for="(item,index) in recommendList" :key="index">
          <div class="photo">
            <a :href="'/personal/' + item.userId" style="display:block;" target="_blank">
              <e-avatar :size="[46,46]"  :src="item.headerUrl" :alt="item.name" />
            </a>
          </div>
          <div class="info">
            <div class="name">{{item.nickName || item.ipName}}</div>
            <div class="fans">{{item.followNum}}粉丝</div>
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
  import follow from '@/pages/components/Follow'
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
      changeSchool () {
        this.$store.dispatch('news/SCHOOL')
      }
    }
  }
</script>
<style lang="scss" scoped>

.star-box{
  padding: 20px 20px 10px 20px;
  .header{
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
      width:155px;
    }
    .refresh{
      display: inline-block;
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
    ul li{font-size:0;padding:10px 0;}
    .photo{
      width:46px;
      margin-right: 10px;
      height:46px;
      vertical-align:middle;
      display:inline-block;
      img{
        border-radius:50%;
      }
    }
    .info{
      width:110px;
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
      vertical-align:middle;
      display:inline-block;
      width:80px;
      text-align: right;
    }
  }
}
</style>