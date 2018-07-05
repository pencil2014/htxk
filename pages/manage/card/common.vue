<template>
  <div class="common-card">
    <div class="status">
      <div class="noactive" v-if="cardStatus === 1">
        <p class="icon"><i class="iconfont">&#xe91c;</i></p>
        <p class="text">服务未激活</p>
      </div>
      <div class="success" v-if="cardStatus === 2">
        <p class="icon"><i class="iconfont">&#xe91c;</i></p>
        <p class="text">服务已完成</p>
      </div>
      <div class="fail" v-if="cardStatus === 3">
        <p class="icon"><i class="iconfont">&#xe754;</i></p>
        <p class="text">服务已终止</p>
      </div>
      <p class="server" @click="showChat"><!-- <i class="iconfont">&#xe675;</i> -->联系客服</p>
    </div>
    
    
    <div class="similar">
      <div class="divider">
        <e-heading grade="1">同类商品推荐</e-heading>
      </div>
      <div class="itembox" v-if="items && items.length > 0">
        <div class="item" v-for="(item,index) in items" :key="index" @click="gogoods(item)">
          <e-img :size='[196, 196]' :src="item.imgs" :alt="item.goodsName"></e-img>
          <p class="title" :title="item.goodsName">{{item.goodsName}}</p>
          <p class="price">{{item.minPrice | formatMoney}}</p>
        </div>
      </div>
      <!-- 没有数据 -->
      <e-placeholder text="没有同类商品推荐数据!"  v-else></e-placeholder>
    </div>
  </div>
</template>

<script>
import api from 'api/card'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    state: {
      type: Number,
      default: 1
    }
  },
  computed: {
    cardStatus () {
      if (this.state === 1) {
        return 1
      } else if (this.state === 2 || this.state === 3) {
        return 2
      } else {
        return 3
      }
    }
  },
  methods: {
    // 获取数据
    getGoods () {
      api.goods({cardNo: this.id, page: 1, rows: 8})
        .then((res) => {
          this.items = res.data.list
        })
    },
    // 客服
    showChat () {
      let url = 'https://www.71chat.com/scsf/core/styleConfig.visitorView.do?cmpcd=106282'
      let name = '华体星空'
      let iWidth = '1000'
      let iHeight = '600'
      let iTop = (window.screen.availHeight - 30 - iHeight) / 2
      let iLeft = (window.screen.availWidth - 10 - iWidth) / 2
      window.open(url, name, 'width=' + iWidth + ', height=' + iHeight + ',top=' + iTop + ',left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
    },
    // 去商品详情
    gogoods (item) {
      // let routeData = this.$router.resolve(`/goods/detail/${item.goodsCode}`)
      let routeData = this.$router.resolve(item.nextStepUrl)
      window.open(routeData.href, '_blank')
    }
  },
  data () {
    return {
      status: 1,
      items: []
    }
  },
  mounted () {
    this.getGoods()
  }
}
</script>

<style lang="scss" scoped>

.common-card {
  position: relative;
  padding-top: 40px;
  .server {
      color: #3983e5;
      cursor: pointer;
      i {
        font-size: 18px;
        vertical-align: middle;
      }
    }
  .status {
    text-align: center;
    .icon {
      line-height: 80px;
      height: 80px;
      i {
        font-size: 80px;
      }
    }
    .text {
      font-size: 18px;
      padding-top: 10px;
    }
    .noactive {
      i {
        color: #d38619;
      }
    }
    .success {
      i {
        color: #24c881;
      }
    }
    .fail {
      i {
        color: #ff4948;
      }
    }
  }
  .similar {
    margin-top: 60px;
    .itembox {
      padding: 10px 0;
      overflow-y: hidden;
      .item {
        margin: 10px 15px 10px 0;
        float: left;
        width: 196px;
        cursor: pointer;
        &:nth-child(4n+4) {
          margin-right: 0;
        }
        p {
          overflow: hidden;
          white-space: nowrap;
          text-overflow:ellipsis;
        }
        .title {
          line-height: 30px;
        }
        .price {
          font-weight: 700;
          font-size: 18px;
          color: #ff6b07;
        }
      }
    }
  }
}
</style>