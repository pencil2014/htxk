<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>服务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content detail" v-if="goods_detail">
      <e-cellbox class="top" >
        <e-cell-item  class="top-picture" >
          <detail-swiper v-if="goods_detail && goods_detail.imgList" :goodsName='goods_detail.goodsName' :banner-list='goods_detail.imgList'></detail-swiper>
        </e-cell-item>

        <e-cell-item class="top-info">
          <h1>{{goods_detail.goodsName}}</h1>
          <p class="weak" v-if='goods_detail.remarks'>{{goods_detail.remarks }}</p> 

          <e-cellbox class="table-row-height price">
            <e-cell-item class="price-lab">服务价格：</e-cell-item>
            <e-cell-item class="price">
              <div v-if="selectedItems.length === groups">
                {{salePrice | formatMoney}}
                <span class="market-price">{{price | formatMoney}}</span>
              </div>
              <div v-if="selectedItems.length < groups">
                {{minPrice | formatMoney}}
                <span v-if='maxPrice > minPrice' >
                  - {{maxPrice | noPreformatMoney}}
                </span>
              </div>
            </e-cell-item>
          </e-cellbox>
          <coupon :list="couponList" />
          <sku-select @selectedItemsAction='selectedItemsAction' @selectedSkuList="selectedSkuList"   />
          <e-cellbox  style="display:table-row" >
            <e-cell-item class="select-title" ></e-cell-item>
            <e-cell-item class='share-box'>
              <share-detail :detail="shareData" />
              <collect :detail="goods_detail" />
            </e-cell-item>
          </e-cellbox>
        </e-cell-item>
      </e-cellbox>

      <div class="main">
        <el-tabs v-model="activeName" class="large">
          <el-tab-pane label="图文详情" name="first">
            <div class="lab" v-if='goods_detail.baseSkuist'>
              <el-row class='detail-table' v-for="(items, indexs) in goods_detail.baseSkuist"    :key="indexs">
                <el-col class='detail-table-item' :span="12" v-for="(item, index) in items"  :key="index">
                  <span >{{item.nameText}}：</span>
                  <span >{{item.valueTexts}}</span>
                </el-col>
              </el-row>
            </div>
            <!-- <div class="rich-text" v-html="goods_detail.descPc" ></div> -->
            <div class="rich-text" v-html="goods_detail.descApp" ></div>
          </el-tab-pane>
          <el-tab-pane label="相关信息" name="second">
            <e-cellbox class="info-list " v-for="(item, index) in goods_detail.extInfoList"   v-if="item.valueTexts[0]" :key="index">
              <span >{{item.nameText+"："}}</span>
              <span >{{item.valueTexts[0]}}</span>
            </e-cellbox>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import api from 'api/goods'
import DetailSwiper from '../components/DetailSwiper'
import SkuSelect from '../components/SkuSelect'
import coupon from '../components/Coupon'
import shareDetail from '../components/ShareDetail'
import collect from '../components/Collect'
import { mapGetters } from 'vuex'

export default {
  layout: 'primary',
  components: {
    DetailSwiper,
    SkuSelect,
    coupon,
    collect,
    shareDetail
  },
  computed: {
    ...mapGetters({
      goods_detail: 'goods/detail'
    }),
    shareData () {
      return {
        bdText: this.goods_detail.goodsName,
        bdDesc: this.goods_detail.goodsName,
        bdPic: this.goods_detail.imgList[0] ? this.goods_detail.imgList[0].goodsImgUrl : '',
        shareId: this.goods_detail.goodsCode
      }
    }
  },
  async fetch (context) {
    if (!context.popStateEvent) {
      let goodsDetailData = await fetch({
        context,
        url: '/goods/detail',
        params: {'goodsCode': context.params.index}
      })
      let data = goodsDetailData.data
      if (data) {
        let resItem = []
        if (data.brandName) {
          resItem.push({nameText: '品牌：', valueTexts: data.brandName})
        }
        for (let item of data.baseInfoList) {
          if (item.nameText && item.valueTexts) {
            resItem.push({nameText: item.nameText, valueTexts: item.valueTexts[0]})
          }
        }
        let resList = []
        let arrLength = 0
        for (let i = 0; i < resItem.length; i++) {
          if (i % 2 === 1) {
            resList.push([resItem[i - 1], resItem[i]])
            arrLength += 2
          }
        }
        // 奇数个把最后一个push进去
        if (arrLength < resItem.length) {
          resList.push([resItem[resItem.length - 1]])
        }
        goodsDetailData.data.baseSkuist = resList
        context.store.commit('goods/DETAIL', {data: goodsDetailData})
      } else {
        context.redirect('/error')
      }
    }
  },
  data () {
    return {
      activeName: 'first',
      salePrice: 0,
      selectedItems: [], // 已选中的项，无重复
      groups: 1,
      maxPrice: 0,
      minPrice: 0,
      price: 0,
      couponList: [] // 优惠券列表
    }
  },
  mounted () {
    if (this.goods_detail.length === 0) {
      return false
    }
    this.goods_detail.attributeList = this.goods_detail.attributeList ? this.goods_detail.attributeList : []
    this.groups = this.goods_detail.attributeList.length
    let priceList = [] // 价格是分，过滤器里面有把分转为元
    for (let item of this.goods_detail.skuList) {
      priceList.push(item.salePrice)
    }
    this.maxPrice = Math.max.apply(Math, priceList)
    this.minPrice = Math.min.apply(Math, priceList)
    // 获取优惠券列表
    this.getCouponList()
  },
  methods: {
    // 最后匹配上的结果
    selectedSkuList (selectedSku) {
      this.salePrice = selectedSku.salePrice
      this.price = selectedSku.price
    },
    // 已选的sku列表
    selectedItemsAction (selectedItems) {
      this.selectedItems = selectedItems
    },
    // 获取可领取优惠券
    getCouponList () {
      api.couponList({
        page: 1,
        rows: 100
      })
        .then((res) => {
          this.couponList = res.data.list
        })
    }
  },
  head () {
    if (this.goods_detail) {
      return {
        title: `${this.goods_detail.goodsName}_求苗体育`,
        meta: [
          { hid: 'description', name: 'description', content: `${this.goods_detail.descApp}`.slice(0, 120) }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.share-box{
  position:relative;
}
.detail{
  .btn-margin-left-5px{
    margin-left: 5px;
  }
  word-break:break-all;
  .pointer{
    cursor:pointer;
  }
  .detail-table{
    .el-col-12{
      padding: 5px 20px 5px 0;
      text-align: justify;
      >span:nth-of-type(1){
        font-weight:800;
      }
    }
  }
  .top{
    .top-picture{
      width: 400px;
      .el-carousel{
        overflow: hidden;
      }
    }
    .top-info{
      padding-left: 40px;
      .select-title{
        text-align:right;
        width: 50px;
        line-height: 40px;
        white-space: nowrap;
        padding-right: 5px;
      }
      h1{
        color:#333;
        line-height: 40px;
        font-size: 24px;
        font-weight: normal;
        display: inline;
      }
      p{
        line-height: 24px;
      }
      .price{
        margin-top:25px;
        height: 76px;
        line-height: 70px;
        background: #f8f8f8;
        font-size: 30px;
        color: #fc6f00;
        .price-lab{
          text-align:right;
          width: 82px;
          height: 70px;
          font-size: 14px;
          color: #666;
        }
        .market-price{
          text-decoration: line-through;
          font-size: 16px;
          color: $color-sub;
          font-weight: normal;
          padding-right: 5px;
          box-sizing: border-box;
        }
      }
      .num{
        .num-change{
          vertical-align: middle;
          .input-number-primary{
            margin: 0 10px 0 0;
          }
        }
      } 
      .buy-btn{
        margin-top:25px;
        width: 140px;
      }
    }
  }
  .main{
    border-top: 58px solid rgba(255,255,255,0);
    min-height: 100%;
    .el-tab-pane{
      .lab{
        line-height: 30px;
        margin-bottom: 34px;
      }
    }
    .info-list{
      line-height: 26px;
      margin-bottom:17px;
      >span:nth-of-type(1){
        font-weight:800;
      }
    }
  }
  .frame .detail {
      padding: 0;
  }
}
</style>

<style  lang="scss" >

  .detail{
    .share-wrapper{
      padding-top: 16px;
    }
    .el-dialog--tiny {
      width: 600px;
      height: 530px;
      .el-dialog__body{
        text-align: center;
        padding: 58px 70px;
        .tip-title{
          height: 20px;
          line-height: 20px;
          font-size: 16px;
          color: #333;
          .icon-tixing-copy{
            color: $color-warning;
            font-size: 20px;
          }
        }
        img{
          width: 210px;
          height: 210px;
          margin: 56px 0 16px 0;
        }
        ul li{
          color: #999;
        }
      }
    }
    .rich-text{ // 富文本
      p{
        line-height: 36px;
        padding: 10px 0;
        text-indent:2em;
        img{
          max-width:1200px;
          margin:0 auto 30px;
          display: block;
        }
      }
    }
    .checker-plain.el-radio-group {
      margin: 0;
    }
  }
</style>
