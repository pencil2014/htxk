<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/goods/ticket' }">服务列表</el-breadcrumb-item>
      <el-breadcrumb-item>票务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content detail">
      <e-cellbox class="box top" >
        <e-cell-item class="ticketImg">
          <detail-swiper v-if="goodsInfo.imgList" :goodsName='goodsInfo.name' :banner-list='goodsInfo.imgList'></detail-swiper>
        </e-cell-item>
        <e-cell-item class="ticketInfo">
          <div class="goodsInfo">
            <h1>{{goodsInfo.name}}【{{goodsInfo.cateName}}】</h1>
            <p class="weak times">
              <span v-if="goodsInfo.endDateTime">时间： {{goodsInfo.startDateTime | formatDate('yyyy-MM-dd')}} ~  {{goodsInfo.endDateTime | formatDate('yyyy-MM-dd')}}</span>
              <span v-else>时间： {{goodsInfo.startDateTime | formatDate('yyyy-MM-dd ww HH:mm')}}</span>
              <span v-if="goodsInfo.address">地点：{{goodsInfo.address.join(' ')}}</span>
            </p>
            <div class="price-lab">
              <b>{{goodsInfo.minPrice | formatMoney}}</b>
              <b v-if="goodsInfo.minPrice !== goodsInfo.maxPrice"> ~ {{goodsInfo.maxPrice | noPreformatMoney}}</b>
              <span v-if="marketPrice">{{marketPrice | formatMoney}}</span>
            </div>
            <div class="ticketBox">
              <ul class="skuitem" v-if="goodsInfo.skuDetailList">
                <li v-for="(item,index) in goodsInfo.skuDetailList" :key="index"  :class="[{'active': selectSkuIndex===index},{'disabled': item.buyStatus===0},{'hover': hoverIndex===index}]" @click="selectSku(index)" @mouseover="hoverIndex=index" @mouseout="hoverIndex=''">
                  <p class="title"><b>{{item.price | formatMoney}}</b> 
                    <!-- <span v-for="(x,key,index) in item.extMap" :key="index">{{x | formatExt(key)}}</span> -->
                    <span>{{item.extMap.playTime  | formatDate('yyyy-MM-dd HH:mm')}}</span>
                    <span :title="item.extMap.position">{{item.extMap.position}}</span>
                  </p>
                  <span class="weak" >购买时间：{{item.buyBeginTime | formatTimes}} ~ {{item.buyEndTime | formatTimes}}</span>
                </li>
              </ul>
              <e-cellbox class='num'  style="display:table-row ">
                <e-cell-item class="select-title" >数量：</e-cell-item>
                <e-cell-item class='num-change'>
                  <el-input-number :controls="true" class="input-number-primary"  size="small"
                    v-model="currentNum" 
                    :min="1" 
                    :max="buyLimit"
                  ></el-input-number>
                  <span class="weak small" v-if="goodsInfo.skuDetailList && selectSkuIndex !== ''">（库存{{goodsInfo.skuDetailList[selectSkuIndex].stock}}件,  {{goodsInfo.skuDetailList[selectSkuIndex].buyTimesLimit | formatLimit}}）</span>
                </e-cell-item>
              </e-cellbox>
              <e-cellbox  style="display:table-row" >
                <e-cell-item class="select-title" ></e-cell-item>
                <e-cell-item>
                  <el-button size="large" class="buy-btn" type="primary"   @click='buyAction' v-if="goodsInfo.status===2">
                    立即购买
                  </el-button>
                  <el-button size="large" class="buy-btn" type="primary"   @click='notBuy' v-else plain disabled>
                    {{goodsInfo.status | formatStatus}}
                  </el-button>
                </e-cell-item>
              </e-cellbox>
            </div>
          </div>
          <div class='share-box'>
            <share-detail :detail="shareData" />
            <!-- <div @mouseenter='shareMouseenterAction'  @mouseleave='shareMouseleaveAction'  >
              <div style="margin-left:16px;" class="share-list">
                <i class="icon iconfont icon-fenxiang"></i>
                  分享到
                <i class="icon iconfont icon-directionbottom row"  v-show='!shareShow'></i>
                <i class="icon iconfont icon-fangxiangshang row"  v-show='shareShow'></i>
              </div>
              <transition name="fade">
                <div  v-show='shareShow' class="bdsharebuttonbox" style='margin-left:16px;' >
                  <a  class="bds_qzone icon iconfont icon-QQkongjian" data-cmd="qzone" title="分享到QQ空间"></a>
                  <a  class="bds_sqq icon iconfont icon-qq" data-cmd="sqq" title="分享到QQ好友"></a>
                  <a  class="bds_weixin icon iconfont icon-weixin" data-cmd="weixin" title="分享到微信"></a>
                  <a  class="bds_tsina icon iconfont icon-xinlang" data-cmd="tsina" title="分享到新浪微博"></a>
                </div>
              </transition>
            </div> -->
            <div class="collect-link" @click='collectLinkAction' :class="{ 'active': goodsInfo.favorited}">
              <i class="icon iconfont icon-shoucang"></i>  <span v-if="goodsInfo.favorited">已收藏</span><span v-else>收藏</span><span> ({{goodsInfo.favoritedCount | formatCount}}) </span>
            </div>
          </div>
        </e-cell-item>
      </e-cellbox>
      <div class="tabBox">
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="图文详情" name="first"  class="info">
            <p v-if="goodsInfo.obtainTypes" class="obtainTypes">实体票/取票方式：{{goodsInfo.obtainTypes.join('，')}}</p>
            <div class="cnt" v-html="goodsInfo.description"></div>
          </el-tab-pane>
          <el-tab-pane label="常见问题" name="second" class="question">
            <b> 一、付款时效提醒：</b>
            <p>购票下单成功后需在15分钟内完成支付，未支付成功的订单，系统将在下单15分钟后自动取消，所选商品库存将自动释放后重新点亮，大家可及时刷新购票页面进行购买。</p>
            <b>二、售前提示：</b>
            <p>1.为避免快递配送不能及时送达，演出距开场时间少于3天时不提供【快递配送】服务，请您谅解！ 您可以选择电子票或在线支付后自取纸质票。</p>
            <p>2.体育赛事票类商品，开票时间一般为比赛开始前二到四周，您可先收藏，正式开票后会第一时间短信通知您，请注意接收。</p>
            <p>3.关于选座，最终票品座位视项目主办方及场馆情况而定，正式开票后票务方将根据用户付款先后顺序依次配票，可能存在票品不足不能为您配票的风险，如最终未能配票，求苗承诺全额退款，但不承担其他损失。</p>
            <b>三、退/换货说明：</b>
            <p>1.不可抗力情况支持退/换票 因不可抗力因素导致演出取消或延期，求苗会主动与您确认退票事宜，不收取任何手续费。</p>
            <p>办理退、换货的要求：</p>
            <p>（1）符合退、换货时间规定（依据：主办方通知的因演出取消/延期安排的退票时间、转场时间段）；</p>
            <p>（2）需将票品完好无损退回；</p>
            <p>（3）如开发票，需将发票完好无损退回；</p>
            <p> 2.非不可抗力不支持退/换票 因个人特殊情况无法按时观看，暂不支持退/换票，为观众带来不便，敬请谅解！</p>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 登陆弹框 -->
    <el-dialog title="登录" custom-class="login-dialog" :visible.sync="loginDialog" >
      <x-login :dialog="true" @handleClose="handleClose" />
    </el-dialog>
  </div>
</template>

<script>
import fetch from 'fetch'
import api from 'api/ticket_card'
import XLogin from '@/pages/member/components/XLogin'
import DetailSwiper from '../components/DetailSwiper'
import {VuecookieGet} from 'utils/cookie.js'
import shareDetail from '../components/ShareDetail'
export default {
  layout: 'primary',
  components: {
    XLogin,
    DetailSwiper,
    shareDetail
  },
  async asyncData (context) {
    let res = await fetch({
      context,
      url: '/v1/ticket/getDetail',
      params: {'goodsCode': context.params.id}
    })
    return {'goodsInfo': res.data}
  },
  data () {
    return {
      goodsCode: '',
      goodsInfo: '',
      login: false, // 登陆状态
      hoverIndex: '', // 鼠标移入显示时间
      activeName: 'first', // tab切换
      shareShow: false, // 分享显示
      currentNum: 1, // 选择商品的数量
      selectSkuIndex: '', // 选择sku索引
      loginDialog: false, // 登陆弹框
      loginStatus: 1 // 登陆后执行操作： 1为购买 2为领取优惠券 3为收藏
    }
  },
  computed: {
    buyLimit () {
      if (this.selectSkuIndex === '') {
        return 1
      }
      let index = this.selectSkuIndex
      let limit = this.goodsInfo.skuDetailList[index].buyTimesLimit
      let stock = this.goodsInfo.skuDetailList[index].stock
      return (!limit || limit > stock) ? stock : limit
    },
    marketPrice () {
      if (this.selectSkuIndex === '') {
        return ''
      }
      return this.goodsInfo.skuDetailList[this.selectSkuIndex].marketPrice
    },
    shareData () {
      return {
        bdText: `${this.goodsInfo.name}【${this.goodsInfo.cateName}】`,
        bdDesc: `${this.goodsInfo.name}【${this.goodsInfo.cateName}】_求苗体育`,
        bdPic: this.goodsInfo.imgList[0] ? this.goodsInfo.imgList[0].goodsImgUrl : '',
        shareId: this.goodsInfo.code,
        type: 'tickets'
      }
    }
  },
  filters: {
    formatStatus (val) {
      if (!val) {
        return ''
      }
      let status = {
        1: '已下架',
        2: '销售中',
        3: '预热中',
        4: '已售罄'
      }
      return status[val]
    },
    formatTimes (val) {
      if (!val) {
        return ''
      }
      return val.split(' ')[0].replace(/-/g, '/')
    },
    formatExt (val, key) {
      if (key === 'playTime') {
        let index = val.lastIndexOf(':')
        return val.slice(0, index)
      } else {
        return val
      }
    },
    formatLimit (val) {
      return !val ? '不限购' : `限购${val}件`
    },
    formatCount (val) {
      return (val - 0) > 999 ? '999+' : val
    }
  },
  mounted () {
    // 获取goodscode
    this.goodsCode = this.$route.params.id
    // 获取商品详情
    this.goodsDettail()
    // 判断登陆状态
    this.login = !!VuecookieGet('htxk_token')
    // 初始化分享
    // this.$nextTick(() => {
    //   window._bd_share_config = {
    //     'common': {
    //       'bdSnsKey': {'bds_tsina': '18129803273', 'popup_sqq': '468642723', 'bds_weixin': 'htxk-open@13322.com', 'bds_qzone': '468642723'},
    //       'bdText': this.goodsInfo.name,
    //       'bdDesc': this.goodsInfo.name,
    //       'bdMini': '2',
    //       'bdMiniList': false,
    //       'bdPic': this.goodsInfo.imgList ? this.goodsInfo.imgList[0].goodsImgUrl : '',
    //       'bdStyle': '0',
    //       'bdSize': '16'
    //     },
    //     'share': {
    //       bdUrl: (location.origin || (location.protocol + '//' + location.host)) + '/share?type=product&shareId=' + this.$route.params.id + '&share=',
    //       searchPic: 'on'
    //     }
    //   }
    //   if (!window._bd_share_main) {
    //     this.bdInit()
    //   } else {
    //     window._bd_share_main.init()
    //   }
    // })
  },
  methods: {
    // 不允许购买
    notBuy () {
      let status = {
        1: '已下架',
        2: '销售中',
        3: '预热中',
        4: '已售罄'
      }
      let text = status[this.goodsInfo.status]
      this.$message.warning(`${text}的商品不能购买！`)
    },
    // 选择sku
    selectSku (index) {
      let status = this.goodsInfo.skuDetailList[index].buyStatus
      if (status === 0) {
        this.$message.warning('该商品目前不能购买！')
        return false
      }
      this.selectSkuIndex = index
      let price = this.goodsInfo.skuDetailList[index].price
      this.goodsInfo.maxPrice = this.goodsInfo.minPrice = price
      this.currentNum = 1
    },
    // 购买商品
    buyAction () {
      this.login = !!VuecookieGet('htxk_token')
      // 检查是否登陆
      if (!this.login) {
        this.loginStatus = 1
        this.loginDialog = true
        return false
      }
      let item = this.goodsInfo.skuDetailList[this.selectSkuIndex]
      if (!item || item.buyStatus === 0) {
        this.$message.warning('请选择需要购买的商品！')
        return false
      }
      // 检查购买数量
      if (this.currentNum < 1 || this.currentNum > this.buyLimit || this.currentNum > item.stock) {
        this.$message.warning('购买的商品数量超过限制！')
        return false
      }
      let data = {
        goodsCode: this.goodsCode,
        buyNumber: this.currentNum,
        sku: this.goodsInfo.skuDetailList[this.selectSkuIndex]
      }
      window.sessionStorage.setItem('buyTicketData', JSON.stringify(data))
      this.$router.push('/goods/tickets/submit')
    },
    // 获取商品详情
    goodsDettail () {
      api.goodsDetail({
        goodsCode: this.goodsCode
      }).then((res) => {
        this.goodsInfo = res.data
      })
    },
    // 分享事件
    // shareMouseenterAction () {
    //   this.shareShow = true
    // },
    // shareMouseleaveAction () {
    //   this.shareShow = false
    // },
    // 关闭登陆弹框
    handleClose () {
      this.loginDialog = false
      this.login = true
      // 执行购买
      if (this.loginStatus === 1) {
        this.buyAction()
      }
      // 执行领取优惠券
      if (this.loginStatus === 2) {
        this.getCoupon(this.couponInfo, this.couponIndex)
      }
      // 执行收藏
      if (this.loginStatus === 3) {
        this.collectLinkAction()
      }
    },
    // 收藏
    collectLinkAction () {
      this.login = !!VuecookieGet('htxk_token')
      if (!this.login) {
        this.loginStatus = 3
        this.loginDialog = true
        return false
      }
      if (this.goodsInfo.favorited) {
        this.delCollectAction()
      } else {
        api.goodsCollectConfirm({
          favoriteType: '3',
          bizId: this.goodsCode
        }).then((res) => {
          this.goodsInfo.favorited = true
          this.goodsInfo.favoritedCount += 1
        })
      }
    },
    // 取消收藏
    delCollectAction () {
      api.delGoodsCollect({
        favoriteType: '3',
        bizId: this.goodsCode
      }).then((res) => {
        this.goodsInfo.favorited = false
        this.goodsInfo.favoritedCount -= 1
      })
    },
    // 分享初始化
    bdInit () {
      let url = '/static/api/js/share.js'
      let script = document.createElement('script')
      script.setAttribute('src', url)
      document.getElementsByTagName('head')[0].appendChild(script)
    }
  },
  head () {
    if (this.goodsInfo) {
      return {
        title: `${this.goodsInfo.name}【${this.goodsInfo.cateName}】`,
        meta: [
          { hid: 'description', name: 'description', content: `${this.goodsInfo.name}【${this.goodsInfo.cateName}】_求苗体育`.slice(0, 120) }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.content{
  min-height: 600px;
  .ticketImg {
    width: 400px;
    vertical-align: top;
    .block{
      border:1px solid #fafafa;
    }
    
  }
  .ticketInfo {
    padding-left: 40px;
    .goodsInfo{
      h1{
        color: #333;
        line-height: 40px;
        font-size: 24px;
        font-weight: normal;
        display: inline;
      }
      .weak{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .times{
        span {
          margin-right: 30px;
        }
      }
      .price-lab{
        margin-top: 25px;
        padding: 0 10px;
        height: 70px;
        line-height: 70px;
        vertical-align: middle;
        background: #f8f8f8;
        font-size: 30px;
        color: #fc6f00;
        span {
          text-decoration: line-through;
          color: #999;
          font-weight: normal;
          padding-left: 5px;
          font-size: 14px;
          vertical-align: middle;
        }
      }
      .ticketBox{
        padding: 10px 0;
        .attr {
          padding-bottom: 10px;
          span {
            display: inline-block;
            padding-right: 10px;
            color: #666;
          }
        }
        .skuitem{
          margin: 15px 0;
          overflow: hidden;
          li{
            margin-bottom: 10px;
            cursor: pointer;
            width: 45%;
            margin-right: 5%;
            float: left;
            border: 1px solid #eee;
            border-radius: 4px;
            .title{
              padding: 5px 10px 0 10px;
              line-height: 1.5;
              overflow: hidden;
              white-space: nowrap;
              text-overflow:ellipsis;
              span{
                margin-right: 10px;
              }
              b{
                color: #666;
                margin-right: 10px;
              }
            }
            .weak{
              margin-right: 10px;
              font-size: 12px;
              color: #999;
              display: block;
              // text-align: center;
              padding-left: 10px;
            }
            &.hover{
              color: #24c881;
              border-color: #24c881;
              .title,b,.weak{
                color: #24c881;
              }
            }
            &.active{
               background-color: #50d39a;
              .title,b,.weak{
                color: #fff;
              }
            }
            &.disabled{
              cursor: not-allowed;
               background-color: #ccc;
               border-color: #eee;
              .title,b{
                color: #eee;
              }
              .weak{
                color: #eee;
              }
            }
          }
        }
        .num {
          padding: 10px;
          .select-title {
            line-height: 36px;
            width: 60px;
          }
          .weak{margin-left: 50px;}
        }
        .buy-btn {
          margin: 30px 0 0 0;
          padding: 15px 40px;
          font-size: 16px;
        }
      }
    }
  }
  .tabBox {
    min-height: 500px;
    padding-bottom: 50px;
    .question{
      padding-left: 20px;
      b{
        display: block;
        line-height: 30px;
        margin-top: 10px;
      }
      p{
        line-height: 2;
        color: #666;
      }
    }
    .info {
      padding: 10px;
      .obtainTypes {
        font-weight: bold;
        margin-bottom: 10px;
      }
      .cnt{
        line-height: 1.5;
      }
    }
  }
  // 优惠券
  .coupon-box {
    max-height: 95px;
    overflow-y: auto;
    border:1px solid $border-color-base;
    padding-bottom: 10px;
    .coupon {
      margin-top: 15px;
      vertical-align: middle;
      overflow: hidden;
      .coupon-lab {
        width: 60px; 
        text-align: right;
      }
      .coupon-cnt {
        b {
          display: inline-block;
          font-weight: normal;
          padding: 0 10px;
          margin-right: 5px;
          color: #f92a34;
          border:1px solid #f92a34;
          background-color: #ffdedf;
        }
        span {
          color: $color-black-base;
        }
        button {
          vertical-align: baseline;
          margin-left: 5px;
          color: #3C7DFF;
        }
      }
    }
  }
  // 收藏
  .collect-link{
    margin-top: 8px;
    display: inline-block;
    cursor: pointer;
    color: #666;
    .icon-shoucang {
      color: #ccc;
    }
    &.active{
      color: #f59206;
      .icon-shoucang {
        color: #f59206;
      }
    }
  }
}
// 优惠券弹出框
  .suc {
    .success {
      display: block;
      text-align: center;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      i {
        font-size: 40px;
        color: $color-primary;
        margin-right: 5px;
        vertical-align: middle;
      }
      b {
        font-weight: normal;
        color: #F60808;
      }
    }
    .time, .tips {
      line-height: 2;
      display: block;
      text-align: center;
    }
    .time {
      color: $color-sub;
      font-size: 12px;
    }
    .tips {
      a {
        color: $color-link;
        margin-left: 5px;
      }
    }
  }
// 百度分享样式修改
.share-box{
  left: 50px;
  .fade-enter-active, .fade-leave-active {
    transform-origin: 0 0;
    transition: all 0.2s;
    transform: scaleY(-14px);
    height: 14px;
  }
  .fade-enter, .fade-leave-to {
    transform-origin: 0 0;
    transform: scaleY(0);
    height:0;
  }
  padding-top:8px;
  height: 70px;
  position: relative;
  div:nth-child(1){
    display:inline-block;
    vertical-align:center;
    padding-right: 20px;
    font-size: 12px;
    color:#666;
    .icon-fenxiang{
      font-size: 16px;
      color:$color-primary;
    }
    .row{
      font-size: 12px;
      margin-left:4px;
      transform:scaleY(0.5);
    }
  }
  div:nth-child(2){
    font-size: 12px;
    a:nth-child(1){
      color: #ffe033;
    }
    a:nth-child(2){
      color: #7eaeef;
    }
    a:nth-child(3){
      color: #78d37d;
    }
    a:nth-child(4){
      color: #ff7872;
    }
  }
}
.bdsharebuttonbox{
  position: absolute;
  left: 50px;
  top: 35px;
}
.bdsharebuttonbox a{
  display:block;
  float:left;
  width:20px;
  height: 20px;
  padding-left: 0;
  font-size: 20px;
  line-height: 20px;
  background:#fff;
  cursor: pointer;
  margin: 6px 6px 6px 0;
  .iconfont{
    font-size: 20px;
  }
}
</style>
