<template>
  <div v-if="goods_detail">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>服务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content detail">
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
                {{price | formatMoney}}
              </div>
              <div v-if="selectedItems.length < groups">
                {{minPrice | formatMoney}}
                <span v-if='maxPrice > minPrice' >
                  - {{maxPrice | noPreformatMoney}}
                </span>
              </div>
            </e-cell-item>
          </e-cellbox>
          <div class="coupon-box" v-if="couponList.length > 0">
            <e-cellbox class="table-row-height coupon" v-for="(item,index) in couponList" :key="index">
               <e-cell-item class="coupon-lab">优惠：</e-cell-item>
               <e-cell-item class="coupon-cnt">
                 <b>满即减</b>
                 <span>{{item.couponName}}</span>
                 <el-button type="link" @click="getCoupon(item,index)">领券</el-button>
               </e-cell-item>
            </e-cellbox>
          </div>
          

          <div class='sku-box' :class="{ 'not-selected-all-sku': notSelectedAllSku }" >

            <div class='error-tip'  v-if='notSelectedAllSku && selectedItems.length < groups' >选择规格和数量</div>

            <i  class="icon iconfont icon-htmal5icon21"  v-show='notSelectedAllSku' @click='iconCloseSkuWarnAction' ></i>
            <e-cellbox class="selectItems table-row-height small" style="display:table-row" v-if='goods_detail.attributeList' v-for="(items,indexs) in goods_detail.attributeList" :key="items.attrCode">
              <e-cell-item class="select-title select-line-padding" :class="{ 'not-selected-sku': notSelectedAllSku &&  !(items.selectedItem)}">{{(items.attrName || '')+"："}}</e-cell-item>
              <e-cell-item  class='radio-select select-line-padding'>
                <el-radio-group class="checker-plain small" :value="items.selectedItem" @input="handleChange(items, indexs, $event)">
                  <el-radio 
                    v-for="(item,index)  in items.attributeValueList"
                    :label="item.attrCode"
                    :key="index"
                    :disabled="forbiddenSelectItems.indexOf(item.attrCode) !== -1">
                      {{item.attrValueName}}
                  </el-radio>
                </el-radio-group>
              </e-cell-item>
            </e-cellbox>
            <e-cellbox class='num'  style="display:table-row "  v-if='goods_detail.totalStock > 0' >
              <e-cell-item class="select-title" >数量：</e-cell-item>
              <e-cell-item class='num-change'>
                <el-input-number :controls="true" class="input-number-primary"  size="small"   v-if="selectedItems.length == groups"
                  v-model="currentNum" 
                  :min="0" 
                  :max="matchedStock.buyTimesLimit == 0 ? (matchedStock.stock || 0) : (matchedStock.buyTimesLimit || 0)"
                ></el-input-number>
                <el-input-number :controls="true" class="input-number-primary"  size="small"  v-if="selectedItems.length < groups"
                  v-model="currentNum" 
                  :min="0" 
                  :max="goods_detail.totalStock"
                ></el-input-number>
                <span class="weak small" v-if="selectedItems.length === groups && groups > 0">{{matchedStock.buyTimesLimit == 0 ? `(库存${matchedStock.stock || 0}件)` : `(库存${matchedStock.stock}件, 限购${matchedStock.buyTimesLimit}件)`}}</span>
                <span class="weak small" v-if="selectedItems.length < groups || groups === 0">{{`(库存${goods_detail.totalStock}件)`}}</span>
              </e-cell-item>
            </e-cellbox>
            <e-cellbox  style="display:table-row" >
              <e-cell-item class="select-title" ></e-cell-item>
              <e-cell-item>
                <el-button size="large" class="buy-btn" type="primary"   @click='buyAction' v-if='goods_detail.status == 0 && goods_detail.totalStock > 0'>
                  立即购买
                </el-button>
                <el-button size="large" class="buy-btn" type="primary" disabled v-if='goods_detail.status == 0 && goods_detail.totalStock == 0'>
                  已售罄
                </el-button>
                <el-button size="large" class="buy-btn" type="primary" disabled v-if='goods_detail.status == 1'>
                  已下架
                </el-button>
              </e-cell-item>
            </e-cellbox>
            <e-cellbox  style="display:table-row" >
              <e-cell-item class="select-title" ></e-cell-item>
              <e-cell-item class='share-box'>
                <div @mouseenter='shareMouseenterAction'  @mouseleave='shareMouseleaveAction'  >
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
                </div>
                <div class="collect-link" @click='collectLinkAction' v-bind:class="{ active: isActive}">
                  <i class="icon iconfont icon-shoucang"></i>  收藏
                </div>
              </e-cell-item>
            </e-cellbox>
          </div>
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

      <el-dialog
        title="温馨提示"
        :visible="appCodeVisible"
        size="tiny"
        :before-close="beforeCloseAction"
      >
        <div class="appurl-box">
          <div class='tip-title'>
            <i class="icon iconfont icon-tixing-copy"></i>
            该商品暂不支持电脑端购买，请扫码二维码使用求苗APP购买
          </div>
          <img src="/_nuxt/img/wechat.9f76c6e.jpg" width="150px" alt="">
          <ul>
            <li>扫描上方二维码下载求苗APP</li>
            <li>登录后即刻购买</li>
          </ul>
        </div>
      </el-dialog>
      
      <el-dialog title="登录" custom-class="login-dialog" :visible.sync="loginDialog" >
        <x-login :dialog="true" @handleClose="handleClose" />
      </el-dialog>

      <!-- 优惠券领取弹框 -->
      <el-dialog
        title="温馨提示"
        :visible.sync="couponDialog"
        size="small">
        <div class="suc">
        <!-- 满{{couponInfo.useValue | noPreformatMoney}}减{{couponInfo.couponValue | noPreformatMoney}}元 -->
          <span class="success" v-if="couponSuccess===1"><i class="iconfont">&#xe91c;</i>恭喜您已经领取了<b>{{couponInfo.couponName}}</b>优惠券！</span>
          <span class="success" v-if="couponSuccess===2">您已经领取了<b>{{couponInfo.couponName}}</b>优惠券，请勿重复领取！</span>
          <span class="time">使用时间：{{couponInfo.startTime | formatTime}} ~ {{couponInfo.endTime | formatTime}}</span>
          <p class="tips">查看我已领取的优惠券：<a href="javascript:;" @click="goCoupon">我的优惠券</a></p>
        </div>
        <!-- <div v-else>
          <span class="err"><i class="iconfont">&#xe754;</i>优惠券领取失败！</span>
        </div> -->
        <span slot="footer" class="dialog-footer">
          <el-button  type="primary" @click="couponDialog = false">确定</el-button>
        </span>
      </el-dialog>


    </div>
  </div>
</template>

<script>
import fetch from 'fetch'
import api from 'api/goods'
import DetailSwiper from './components/DetailSwiper'
import tools from 'utils/tools'
import XLogin from '@/pages/member/components/XLogin'
import {VuecookieGet} from 'utils/cookie.js'
import { mapState } from 'vuex'
export default {
  layout: 'primary',
  components: {
    DetailSwiper,
    XLogin
  },
  computed: {
    goods_detail: function () {
      return this.$store.state.goods.detail
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
  head () {
    if (this.goods_detail) {
      return {
        title: `${this.goods_detail.goodsName}_求苗体育`,
        meta: [
          { hid: 'description', name: 'description', content: `${this.goods_detail.descApp}`.slice(0, 120) }
        ]
      }
    }
  },
  data () {
    return {
      loginDialog: false,
      loginStatus: 1,
      shareShow: false,
      appCodeVisible: false,
      isFavorite: '',
      isActive: '',
      activeName: 'first',
      radioValueList: [], // 选中的value
      matchedStock: [], // 库存匹配结果
      currentNum: 1, // 选择商品的数量
      price: 0,
      selectedItemInfo: [], // 用于控制有切换当前行，还是其他行
      selectedItems: [], // 已选中的项，无重复
      allSelectItems: [], // 所有的选项的集合[a,b,c,d,attrCode,attrCode...]
      goodsSkuGroup: [], // 所有选项组合的集合[[a1,b3],[a4,b3],...]
      forbiddenSelectItems: [], // 禁选项列表
      groups: 1,
      maxPrice: 0,
      minPrice: 0,
      notSelectedAllSku: false, // 默认设为选择了所有的sku选项的状态，即没有错误提示
      sessionNextPage: [],
      couponList: [], // 优惠券列表
      couponInfo: {}, // 优惠券详情
      couponIndex: null, // 领取优惠券index索引
      couponSuccess: 1, // 优惠券领取成功标志
      couponDialog: false // 优惠券弹窗
    }
  },
  mounted () {
    if (this.goods_detail.length === 0) {
      return false
    }
    this.goods_detail.attributeList = this.goods_detail.attributeList ? this.goods_detail.attributeList : []
    for (let item of this.goods_detail.attributeList) { // 给每一组选项清空，以免返回时数据不再，展示的状态还在
      this.$set(item, 'selectedAttrName', '')
      this.$set(item, 'selectedItem', '')
    }
    this.groups = this.goods_detail.attributeList.length
    let priceList = [] // 价格是分，过滤器里面有把分转为元
    for (let item of this.goods_detail.skuList) {
      priceList.push(item.price)
    }
    this.maxPrice = Math.max.apply(Math, priceList)
    this.minPrice = Math.min.apply(Math, priceList)
    this.someItemChangeForbidden() // 设置禁选项，因为可能某个项和所有的都没有组合
    this.$nextTick(() => {
      window._bd_share_config = {
        'common': {
          'bdSnsKey': {'bds_tsina': '18129803273', 'popup_sqq': '468642723', 'bds_weixin': 'htxk-open@13322.com', 'bds_qzone': '468642723'},
          'bdText': this.goods_detail.goodsName,
          'bdDesc': this.goods_detail.goodsName,
          'bdMini': '2',
          'bdMiniList': false,
          'bdPic': this.goods_detail.imgList[0] ? this.goods_detail.imgList[0].goodsImgUrl : '',
          'bdStyle': '0',
          'bdSize': '16'
        },
        'share': {
          bdUrl: (location.origin || (location.protocol + '//' + location.host)) + '/share?type=product&shareId=' + this.$route.params.index + '&share=',
          searchPic: 'on'
        }
      }
      if (!window._bd_share_main) {
        this.bdInit()
      } else {
        window._bd_share_main.init()
      }
    })
    // 获取优惠券列表
    this.getCouponList()
    // 判断收藏状态
    this.isFavoriteStatus()
  },
  beforeDestroy () {
    if (document.querySelector('#bdshare_weixin_qrcode_dialog')) {
      document.querySelector('#bdshare_weixin_qrcode_dialog').remove()
      document.querySelector('#bdshare_weixin_qrcode_dialog_bg').remove()
    }
  },
  // 监听登录状态，若登录成功，监听收藏状态
  watch: {
    ...mapState({
      user: state => state.user.session
    }),
    '$store.state.user.session' (data) {
      // 监听收藏状态
      this.isFavoriteStatus()
    }
  },
  methods: {
    // 判断当前收藏是否登录
    collectLinkAction () {
      let login = VuecookieGet('htxk_token')
      if (!login) {
        this.loginDialog = true
        this.loginStatus = 3
        return false
      } else {
        let startAction = true
        this.isFavoriteStatus(startAction)
      }
    },
    // 成功收藏
    collectAction () {
      api.goodsCollectConfirm({
        favoriteType: '3',
        bizId: this.goods_detail.goodsCode
      })
        .then((res) => {
          if (res) {
            this.isFavorite = 1
            this.isActive = true
          }
        })
    },
    // 取消收藏
    delCollectAction () {
      api.delGoodsCollect({
        favoriteType: '3',
        bizId: this.goods_detail.goodsCode
      })
        .then((res) => {
          if (res) {
            this.isFavorite = 0
            this.isActive = false
          }
        })
    },
    // 获取收藏状态
    isFavoriteStatus (start) {
      api.goodsDetailsData({
        goodsCode: this.goods_detail.goodsCode
      })
        .then((res) => {
          if (res) {
            this.isFavorite = res.data.isFavorite
            if (this.isFavorite === 1) {
              // 若为1，则已经收藏，可以取消收藏；start为true,则执行收藏接口，否则，只接收状态
              if (start === true) {
                this.delCollectAction()
              } else {
                this.isActive = true
              }
            }
            if (this.isFavorite === 0) {
              // 若为0，则已经取消收藏，可以成功收藏；start为true,则执行收藏接口，否则，只接收状态
              if (start === true) {
                this.collectAction()
              } else {
                this.isActive = false
              }
            }
            if (!this.isFavorite) {
              this.isActive = false
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    shareMouseenterAction () {
      this.shareShow = true
    },
    shareMouseleaveAction () {
      this.shareShow = false
    },
    bdInit () {
      let url = '/static/api/js/share.js'
      let script = document.createElement('script')
      script.setAttribute('src', url)
      document.getElementsByTagName('head')[0].appendChild(script)
    },
    beforeCloseAction () {
      this.appCodeVisible = false
    },
    // 立即购买
    buyAction () {
      if (this.selectedItems.length < this.groups) { // 还有必选的没有选
        this.notSelectedAllSku = true
      } else if (this.currentNum === 0) {
        this.$message.error('数量不能为0')
      } else {
        if (tools.getHeaders(window.document.cookie)) {
          this.toAppOrNot()
        } else {
          this.loginStatus = 1
          this.loginDialog = true
        }
      }
    },
    toAppOrNot () {
      // 先判断是否登录
      // 拿取用户信息，拿到了才走流程，没拿到就结束，要他先登录
      api.goodsToConfirm({
        skuCode: this.matchedStock.skuCode,
        buyNum: this.currentNum
      })
        .then((res) => {
          if (res) {
            this.setNextPageSession()
            this.$router.push('/order/submit')
          }
        }).catch((error) => {
          if (Number(error.result) === 21078) { // 需要去app下载
            this.appCodeVisible = true
          } else {
            this.$message.error(error.msg)
          }
        })
    },
    handleClose () {
      this.loginDialog = false
      // 执行购买
      if (this.loginStatus === 1) {
        this.toAppOrNot()
      }
      // 执行领取优惠券
      if (this.loginStatus === 2) {
        this.getCoupon(this.couponInfo, this.couponIndex)
      }
    },
    setNextPageSession () {
      let orderTableData = {
        name: {
          imgUrl: this.goods_detail.imgList[0].goodsThumbUrl,
          title: this.goods_detail.goodsFullName,
          selected: this.selectedItemInfo
        },
        business: this.goods_detail.thirdPatternNickname,
        unitPrice: this.matchedStock.price,
        num: this.currentNum,
        matchedStock: this.matchedStock,
        goodsCode: this.goods_detail.goodsCode,
        goodsCateCode1: this.goods_detail.goodsCateCode1,
        goodsCateCode: this.goods_detail.goodsCateCode
      }
      this.sessionNextPage = [orderTableData]
      sessionStorage.setItem('sessionNextPage', JSON.stringify(this.sessionNextPage))
    },
    iconCloseSkuWarnAction () {
      this.notSelectedAllSku = false
    },
    handleChange (items, indexs, $event) {
      let item = items.attributeValueList.filter((item) => {
        return $event === item.attrCode
      })[0]
      if (this.goods_detail.attributeList[indexs].selectedItem === item.attrCode) { // 点击选中项
        this.$set(this.goods_detail.attributeList[indexs], 'selectedAttrName', '') // 同一个分组不再有选中项
        this.$set(this.goods_detail.attributeList[indexs], 'selectedItem', '')
        for (let j = 0; j < this.selectedItemInfo.length; j++) {
          if (this.selectedItemInfo[j].attrCode === item.attrCode) {
            this.selectedItemInfo.splice(j, 1)
            this.selectedItems.splice(j, 1)
            break
          }
        }
      } else { // 点击未选中的项 1、同一分组，2、不同分组 -- 点击未选中的项-----同一分组
        if (this.goods_detail.attributeList[indexs].selectedAttrName) { // 同一分组有选中项,则当前行 selectedAttrName 不为空
          this.$set(this.goods_detail.attributeList[indexs], 'selectedItem', item.attrCode)
          for (let j = 0; j < this.selectedItemInfo.length; j++) {
            if (this.selectedItemInfo[j].parentAttrCode === items.attrCode) { // 当前的code值了,需要拿取出之前的当前行的
              this.selectedItemInfo.splice(j, 1)
              this.selectedItems.splice(j, 1)
              break
            }
          }
          this.selectedItemInfo.push({attrCode: item.attrCode, parentAttrCode: items.attrCode, attrValueName: item.attrValueName})
          this.selectedItems.push(item.attrCode)
        } else { // 同一分组 没有选中项--点击未选中的项-----不同分组
          this.$set(this.goods_detail.attributeList[indexs], 'selectedAttrName', items.attrCode)
          this.$set(this.goods_detail.attributeList[indexs], 'selectedItem', item.attrCode)
          // 返回的时候下面两个已经没有值了，上面的还有值
          this.selectedItemInfo.push({attrCode: item.attrCode, parentAttrCode: items.attrCode, attrValueName: item.attrValueName})
          this.selectedItems.push(item.attrCode)
        }
      }
      this.someItemChangeForbidden()

      // 匹配找相应的对的上的价格、数量、限购数
      // 现在只能选上匹配上的 && 库存不为0,否则就是还没有选完每一组
      if (this.goods_detail) {
        for (let i = 0; i < this.goods_detail.attributeList.length; i++) {
          this.radioValueList[i] = this.goods_detail.attributeList[i].selectedItem
        }
        let radioValue = this.radioValueList.sort()
        for (let j = 0; j < this.goods_detail.skuList.length; j++) {
          let minValue = this.goods_detail.skuList[j].attrCodeList.sort()
          if (radioValue.join('') === minValue.join('')) {
            this.matchedStock = this.goods_detail.skuList[j]
            this.price = this.goods_detail.skuList[j].price
            if (this.matchedStock.stock < 1) { // 库存为0 的，当前值改为0
              this.currentNum = 0
            } else { // 库存不为0的组合，当前件数和组合的最大值比，大于组合的最大值的，当前值改为组合的最大值
              this.currentNum = this.matchedStock.buyTimesLimit > 0 ? Math.min(this.currentNum, this.matchedStock.stock, this.matchedStock.buyTimesLimit) : Math.min(this.currentNum, this.matchedStock.stock)
            }
            return
          }
        }
      }
    },
    someItemChangeForbidden () {
      // 找出每一行被其他行的已选的 - 禁选的项，求和 就是所有禁选项
      /*
        所有 库存-不为0，购买状态-可购买，有效状态-有效 的组合 -- this.goodsSkuGroup
        当前行元素集合  -- currentLineSelectItems
        当前的所有选中项 -- this.selectedItems
        去除当前行后，所有选中项 -- noCurrentLineSelectedItems（ = 当前所有选中项 - 当前行元素）
        去除当前行后，所有可能的选项 -- nowGoodsSkuGroup
        去除当前行后，当前所有可能的选项 - currentLineSelectItemsFind
        当前行被其他行禁的选项 -- this.forbiddenSelectItems
        //step
        1、遍历根据所有选项数组，即每一行，
        2、根据所有选项数组，当前行元素数组 -- 找出当前行元素集合  -- currentLineSelectItems
        3、遍历当前行元素，找出在当前选中集合中的，并删除 -- 得出去除当前行元素后的所有选中项-- noCurrentLineSelectedItems
        4、遍历所有库存不为0的组合，根据noCurrentLineSelectedItems，找出满足没有当前行的选项集合 -- 去除当前行后，所有可能的选项 -- nowGoodsSkuGroup
        5、当前行元素集合，到去除当前行后，所有可能的选项中，找当前行元素  -- 去除当前行后，当前行所有可能的选项 - currentLineSelectItemsFind
        6、当前行元素集合，减去当前行的可选项 --  当前行被其他行禁的选项 -- this.forbiddenSelectItems
        7、循环每一行都找出当前行被其他行禁选的 -- 得到所有禁选项
      */
      this.goodsSkuGroup = []
      for (let item of this.goods_detail.skuList) {
        if (item.stock > 0 && item.buyStatus === 1 && item.status === 1) { // 除去库存为0的项，buyStatus === 1 status === 1
          this.goodsSkuGroup.push(item.attrCodeList)
        }
      }

      this.forbiddenSelectItems = [] // 重新设置禁选项
      for (let i = 0; i < this.goods_detail.attributeList.length; i++) {
        let noCurrentLineSelectedItems = [].concat(this.selectedItems)
        let currentLineSelectItems = []
        for (let item of this.goods_detail.attributeList[i].attributeValueList) {
          currentLineSelectItems.push(item.attrCode)
        }
        for (let j = 0; j < noCurrentLineSelectedItems.length; j++) {
          if (currentLineSelectItems.indexOf(noCurrentLineSelectedItems[j]) > -1) {
            noCurrentLineSelectedItems.splice(j, 1)
          }
        }

        // 匹配出所有可选组合
        let nowGoodsSkuGroup = []
        for (let groupItem of this.goodsSkuGroup) {
          let notMarchFlag = false
          for (let SelectedItem of noCurrentLineSelectedItems) {
            if (groupItem.indexOf(SelectedItem) === -1) {
              notMarchFlag = true
              break
            }
          }
          if (!notMarchFlag) {
            nowGoodsSkuGroup.push(groupItem)
          }
        }

        // 找出是当前行的元素设为可选，（或没找到的设为禁选）
        let currentLineSelectItemsFind = []
        for (let SelectItem of currentLineSelectItems) {
          for (let groupItem of nowGoodsSkuGroup) {
            if (groupItem.indexOf(SelectItem) > -1) {
              currentLineSelectItemsFind.push(SelectItem)
            }
          }
        }
        currentLineSelectItemsFind = this.uniqueArrItem(currentLineSelectItemsFind)

        for (let item of currentLineSelectItems) {
          if (currentLineSelectItemsFind.indexOf(item) === -1) {
            this.forbiddenSelectItems.push(item)
          }
        }
      }
    },
    uniqueArrItem (arr) {
      let res = []
      let json = {}
      for (let i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
          res.push(arr[i])
          json[arr[i]] = 1
        }
      }
      return res
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
    },
    // 领取优惠券
    getCoupon (item, index) {
      this.couponInfo = item
      this.couponIndex = index
      let login = VuecookieGet('htxk_token')
      if (!login) {
        // this.$message.error('未登录无法领取优惠券，请先登录！')
        this.loginStatus = 2
        this.loginDialog = true
        return false
      }
      api.couponReceive({
        batchId: item.batchId
      }, {successMsg: 'none', errorMsg: 'none'}).then((res) => {
        this.couponSuccess = 1
        this.couponDialog = true
        // this.couponList.splice(index, 1)
      }).catch((err) => {
        // 已经领取弹出详情
        if (err.result === '16017' && err.msg === '已经领取过优惠券') {
          this.couponSuccess = 2
          this.couponDialog = true
          // this.couponList.splice(index, 1)
        } else {
          // 领取失败弹出错误提示
          this.$message.error(err.msg)
        }
      })
    },
    // 去优惠券页面
    goCoupon () {
      this.couponDialog = false
      this.$router.push('/manage/coupon/')
    }
  },
  filters: {
    formatTime (val) {
      return val ? val.split(' ')[0] : ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/var';
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
        height: 70px;
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
      }
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
      
      .sku-box{
        border-width:1px;
        border-style: solid;
        border-color: rgba(0,0,0,0);
        padding:10px;
        // margin-top:24px;
        position:relative;
        .error-tip{
          position:absolute;
          color: #fc6f00;
          font-weight: bolder;
          top:-12px;
          padding:0 5px;
          background:#fff;
        }
        .icon-htmal5icon21{
          position:absolute;
          top:2px;
          right:8px;
          color:#fc6f00;
        }
        .selected-all .selected-all-btn{
          width: 60px;
          height:30px;
          line-height:30px;
          text-align:center;
          background:red;
          color:#fff;
        }
        &.not-selected-all-sku{
          &:before{
            content:'';
            height:calc(100% - 148px);
            border:1px solid #fc6f00;
            position:absolute;
            left:0;
            top:0;
            width:100%;
          }
          .not-selected-sku{
            color:#fc6f00;
            font-weight: bolder;
          }
        }
      }

      .selectItems{
        height: 40px;
        line-height:12px;
        .select-line-padding{
          padding-bottom: 10px;
        }
        .radio-select{
          vertical-align: middle;
        }
      }

      .tips{
        margin-top: 5px;
        width: 500px;
        background: #f5f5f5;
        text-align: justify;
        
        padding:14px 20px 8px;
        box-sizing:border-box;
        &.actived-tips{
          margin-top: 40px;
          padding:18px 20px;
        }
        .select-tips{
          span{
            margin: 0 6px;
          }
        }
        h4{
          font-size: 18px;
          font-weight: 600px;
          line-height: 30px;
        }
        li{
          line-height: 24px;
          margin: 4px 0;
        }
      }
      .actived-tips{
        color: #fc6f00;
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
@import '~styles/var';
  .collect-link{
    margin-top: 8px;
    display: inline-block;
    cursor: pointer;
    color: #ccc;
    .icon-shoucang {
      color: #ccc;
    }
  }
  .collect-link.active{
    color: #24c881 !important;
    .icon-shoucang {
      color: #24c881 !important;
    }
  }
  .detail{
    // 百度分享样式修改
    .share-box{
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
      left: 0;
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
    .el-carousel__button {
      width: 10px;
      height: 10px;
      border-radius:100%;
      opacity: 1;
    }
    .el-carousel__indicator.is-active button {
       background-color: #fcaf16;
    }
    .el-carousel__arrow {
      width: 21px;
      height: 64px;
      border-radius: 0;
      background-color: rgba(0, 0, 0, 0.4);
      font-size: 21px;
    }
    .el-carousel__arrow--left{
      left: 0;
    } .el-carousel__arrow--right {
      right: 0;
    }
    .el-carousel__arrow i{
      transform: scale(1,1.8);
    }
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

    .err {
      display: block;
      text-align: center;
      font-size: 16px;
      i {
        font-size: 40px;
        color: #ff4949;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    
  }
</style>