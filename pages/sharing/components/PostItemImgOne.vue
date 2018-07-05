<template>
  <div class="item-style-one" v-if='ItemData'>
    <!-- 视频和帖子的跳转 -->
    <nuxt-link v-if='(ItemData.contentType == 30) || (ItemData.contentType == 20)' 
    :to='(ItemData.contentType == 30 ?  "/community/detail/" + ItemData.contentId : "/video/detail/" + ItemData.contentId )' 
    target='_blank'  class="img-box" >
      <div v-if='ItemData && ItemData.coverUrl && ItemData.coverUrl.length > 0 '>
        <e-img  :size='[160, 90]' :alt='ItemData.title' v-if='ItemData.coverUrl[0]' :src='ItemData.coverUrl[0].imgUrl'  />
      </div>
    </nuxt-link>

    <!-- 资讯的跳转 -->
    <a :href='ItemData.url' target='_blank'  class="img-box"  v-else  >
      <div v-if='ItemData && ItemData.coverUrl && ItemData.coverUrl.length > 0 '>
        <e-img  :size='[160, 90]' :alt='ItemData.title' v-if='ItemData.coverUrl[0]' :src='ItemData.coverUrl[0].imgUrl'  />
      </div>
    </a>

    <div class="info-num">
      <!-- 视频和帖子的跳转 -->
      <nuxt-link 
      v-if='(ItemData.contentType == 30) || (ItemData.contentType == 20)' 
      :to='(ItemData.contentType == 30 ?  "/community/detail/" + ItemData.contentId : "/video/detail/" + ItemData.contentId )' 
      target='_blank'  style='display:block;' >
        <h4 :title='ItemData.title'>{{ItemData.title}}</h4>
      </nuxt-link>
      <!-- 资讯的跳转 -->
      <a :href='ItemData.url'  target='_blank'  style='display:block;'  v-else  >
         <h4 :title='ItemData.title'>{{ItemData.title}}</h4>
      </a>

      <e-cellbox >
        <e-cell-item class="info">
          <ul class="info-ul">
            <li class='max-with80 cataName' :title='ItemData.cataName' v-if='ItemData.cataName && ItemData.contentType != 30'>
              {{ItemData.cataName}}
            </li>
            <li class='max-with80 cataName' v-if='ItemData.contentType == 30'  >帖子</li>
            <li class='max-with80' :title='item' v-for='(item, index) in ItemData.tagName' :key='index'>{{item}}</li>
            <li class="viewCount">
              <i class="icon iconfont icon-yanjing"></i>
              {{ItemData.countNum || 0}}
            </li>
          </ul>
        </e-cell-item>
      </e-cellbox>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    ItemData: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style type="text/css" lang="scss" scoped>
  
  .item-style-one{
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
    h4{
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 66px;
      margin-top: 6px;
      overflow:hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
      &:hover{
        color:$color-primary;
      }
    }
    .img-box {
      margin-top:30px;
      display:inline-block;
      width: 160px;
      height: 90px;
      overflow: hidden;
      margin-right: 20px;
      div{
        text-align: center;
        background: #e5e5e5;
        height: 100%;
      }
    }

   .info-ul{
      li{
        display:inline-block;
        vertical-align: middle;
        margin-left: 20px;
        color:$color-sub;
        &:nth-child(1){
          margin-left: 0;
        }
        &.cataName{
          color:#fd6f01;
          border: 1px solid #fd6f01;
          padding:0 5px;
          line-height: 17px;
        }
        &.viewCount{
          margin-left: 40px;
        }
      }
      .max-with80{
        max-width: 80px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
      }
    }
    .info-num{
      width: 490px;
      display: inline-block;
      vertical-align: top;
      .cell-item{
        vertical-align: middle;
      }
    } 
  }
</style>
