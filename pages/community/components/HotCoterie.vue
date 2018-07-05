<template>
  <div class="hot-content">
    <div class='title' >
      <h3>热门圈子</h3>
    </div>

    <ul class="item">
      <li 
        v-if='index < 6'
        v-for='(item, index) in hotList' :key='index' >
        <e-cellbox  class="hot-circle-item">
          <e-cell-item class="img">
            <nuxt-link target='_blank' :to='"/community/circle/" + item.circleId' style='display:block;' >
              <div >
                <e-avatar :size='[40, 40]'  :src='item.icon' />
              </div>
            </nuxt-link>
          </e-cell-item>

          <e-cell-item class="info">
            <nuxt-link target='_blank' :to='"/community/circle/" + item.circleId' style='display:block;' >
              <div class="name" :title='item.circleName' >{{item.circleName}}</div>
            </nuxt-link>
          </e-cell-item>
        </e-cellbox>

      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    hotList: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style lang="scss"  scoped>

.hot-content{
  margin-bottom: 20px;
  padding:20px; 
  background: $color-white;
  width:260px;

  .title{
    border-bottom: 2px solid #e5e5e5;
    h3{
      position: relative;
      top: 2px;
      display: inline-block;
      font-weight: 400;
      font-size: 20px;
      line-height: 20px;
      color: $color-black;
      padding-bottom: 10px;
      border-bottom: 2px solid $color-primary;
    }
  }
  .item{
    .hot-circle-item{
      &:hover{
        .img div{
          border-color: $color-primary;
        }
        .info{
          color:$color-primary;
        }
      }
    }
    li{
      padding: 20px 0;
      border-top:1px solid #e5e5e5;
      &::nth-child(1) {
        border-top:1px solid rgba(255,255,255,1);
      }
    }
  }
  .img{
    height: 40px;
    width: 50px;
    div{
      height: 40px;
      width: 40px;
      border: 2px solid rgba(255,255,255,1);
      border-radius: 100%;
      overflow: hidden;
      background-size: cover;
      background-repeat:no-repeat;
      background-position: center center;
    }
  }
  .info{
    vertical-align: middle;
    div{
      max-width: 170px;
      float: left;
      overflow:hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
    }
  }
}
</style>
