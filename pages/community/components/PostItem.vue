<template>
  <div class="item-style-04">
    <nuxt-link target='_blank'   :to='"/community/detail/" + ItemData.feedId' style='display:block;' >
      <h4 :title='ItemData.title' >{{ItemData.title}}</h4>
      <ul class="img-box"  v-if='ItemData && ItemData.feedContentRespVOS && ItemData.feedContentRespVOS.length > 0 '>
        <li v-for='(item, index) in ItemData.feedContentRespVOS' v-if='index < 4'  :key='index'>
          <e-img  :size='[160, 100]' :alt='ItemData.title'  v-if='item.coverVO' :src='item.coverVO.imgUrl'  />
        </li>
      </ul>
    </nuxt-link>


    <e-cellbox  class="info-num">
      <e-cell-item class="info">
        <ul class="info-ul">
          <li class='nickName' :title='ItemData.nickName'>{{ItemData.nickName}}</li>
          <li>{{ItemData.publishTime | formatTime}}</li>
          <li>
            <i class="icon iconfont icon-yanjing"></i>
            {{ItemData.clickCount || 0}}
          </li>
          <li>
            <i class="icon iconfont icon-zankongxingai"></i>
            {{ItemData.diggCount || 0}}</li>
        </ul>
      </e-cell-item>

      <e-cell-item class="num">
        <nuxt-link target='_blank' class="logo-name"   :to='"/community/circle/" + ItemData.circleId' >
          <i class="img">
            <e-avatar :size='[30, 30]'  :src='ItemData.circleIconUrl' />
          </i>
          <span class="name" :title="ItemData.circleName">{{ItemData.circleName}}</span>
        </nuxt-link>
      </e-cell-item>
    </e-cellbox>

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
  
  .item-style-04{
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
    h4{
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 66px;
      overflow:hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
      &:hover{
        color:$color-primary;
      }
    }

    .img-box li{
      display:inline-block;
      width: 160px;
      height: 100px;
      overflow: hidden;
      margin-left: 10px;
      text-align: center;
      background: #e5e5e5;
      &:nth-child(1){
        margin-left: 0;
      } 
    }

   .info-ul{
      li{
        display:inline-block;
        vertical-align: middle;
        margin-left: 40px;
        color:$color-sub;
        &:nth-child(1){
          margin-left: 0;
          color:$color-black-base;
        }
      }
      .nickName{
        max-width: 80px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
      }
    }
    .info-num .cell-item{
      vertical-align: middle;
    }
    .num{
      text-align: right;
    }
    .logo-name{
      display: inline-block;
      vertical-align: middle;
      color: $color-sub;
      &:hover{
        color:$color-primary;
        .img{
          border-color: $color-primary;
        }
      }
      i{
        box-sizing: content-box;
        display: inline-block;
        vertical-align: middle;
        height: 28px;
        width: 28px;
        border: 1px solid rgba(255,255,255,1);
        border-radius: 100%;
      }
    }
    .img{
      overflow: hidden;
      background-size: cover;
      background-repeat:no-repeat;
      background-position: center center;
      margin-right: 10px;

    }
    .name{
      width: 70px;
      overflow:hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
      display: inline-block;
      vertical-align: middle;
      text-align: left;
    }
  }
</style>
