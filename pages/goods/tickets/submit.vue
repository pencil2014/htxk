<template>
  <div>
      <div class="content">
        <div class="divider">
          <e-heading grade="1">确认订单</e-heading>
        </div>

        <div class="table" v-loading="loading" element-loading-text="拼命加载中">
          <el-table
            v-if='tableData.length > 0'
            :data="tableData"
            row-class-name="tabs"
            style="width: 100%">
            <el-table-column
              align="name"
              label="服务名称"
              >
              <template slot-scope="scope">
                <e-cellbox>
                  <e-cell-item class="img-box" >
                    <e-img :size='[80,80]' :alt=' scope.row.name' :src=' scope.row.goodsImgUrl'  />
                  </e-cell-item>
                  <e-cell-item class="goods-info">
                    <span class="title">{{scope.row.name}}</span>
                    <!-- <p class="extmap"><span v-for="(item,key,index) in scope.row.extMap" :key="index">{{item | formatExt(key)}}</span></p> -->
                    <p class="extmap">
                      <span>{{scope.row.extMap.playTime | formatDate('yyyy-MM-dd HH:mm')}}</span> / <span>{{scope.row.extMap.position}}</span>
                    </p>
                  </e-cell-item>
                </e-cellbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="business"
              label="商家"
              align="center font-style"
              width="180">
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价（元）"
              align="center unit-price"
              width="146">
              <template slot-scope="scope">
                {{scope.row.price | formatMoney}}
              </template>
            </el-table-column>
            <el-table-column
              prop="num"
              label="数量"
              align="center font-style"
              width="130">
            </el-table-column>
            <el-table-column
              label="总计（元）"
              align="center total-price"
              width="160"
              >
              <template slot-scope="scope">
                {{(scope.row.num * scope.row.price) | formatMoney}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 优惠券 -->
        <div class="coupon">
          <coupon v-if="goodsInfo" :selectCoupon='selectCoupon' :price='goodsInfo.price' :total='buyNum'  @setCoupon='setCoupon'/>
        </div>
        <!-- 取票方式 -->
        <div class="ticeket">
          <div class="divider">
            取票方式
          </div>
          <el-radio-group v-model="getTicket" class="radioGroup" v-if="goodsInfo">
            <el-radio :label="item" v-for="(item,index) in goodsInfo.ticket.obtainTypeValues" :key="index">{{item | formatObtainType}}</el-radio>
            <!-- <el-radio :label="471111">比赛当天取票</el-radio>
            <el-radio :label="471113">官方售票点取票</el-radio>
            <el-radio :label="471112">邮寄门票（价格含邮费）</el-radio> -->
          </el-radio-group>
          <el-form ref="form" :model="form" label-width="80px" size="mini" class="form">
            <el-form-item label="姓名" 
              prop="name"
              :rules="[
                { required: true, message: '姓名不能为空'},
                { min:2, max:25, message: '姓名长度为2-25个字符'}
              ]">
              <el-input v-model.trim="form.name"   :maxlength="25" placeholder="请输入真实姓名" size="small" style="width:300px"  />
            </el-form-item>
            <el-form-item label="手机号" 
              prop="phone"
              :rules="[
                { required: true, message: '手机号不能为空'},
                { min:11, max:11, message: '手机号长度为11位数字'},
                { pattern: /^1[3456789]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
              ]">
              <el-input v-model.trim="form.phone"  :maxlength="11" placeholder="请输入手机号" size="small" style="width:300px" />
            </el-form-item>
            <el-form-item label="详细地址" 
              prop="address"
              v-if="getTicket==='471112'"
              :rules="[
                { required: true, message: '详细地址不能为空'},
                { min:1, max:120, message: '详细地址长度为1-120个字符'},
              ]">
              <el-input v-model.trim="form.address"  type="textarea" :rows="2" :maxlength="120" placeholder="请输入详细地址" size="small" style="width:300px" />
            </el-form-item>
            <div v-if="goodsInfo">
              <el-form-item label="身份证号" 
                prop="idcard"
                v-if="goodsInfo.ticket.needIdNo"
                :rules="[
                  { required: true, message: '身份证号不能为空'},
                  { min:15, max:18, message: '身份证号长度为15-18位'},
                  { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证输入不正确' }
                ]">
                <el-input v-model.trim="form.idcard"  :maxlength="18" placeholder="请输入身份证号" size="small" style="width:300px" />
              </el-form-item>
            </div>
            
          </el-form>
        </div>
        <!-- 价格 -->
        <div class='price-box' v-if="goodsInfo">
          <e-cellbox>
            <e-cell-item ></e-cell-item>
            <e-cell-item >商品总额：</e-cell-item>
            <e-cell-item>{{orderAtherInfo.totalPrice.price  | formatMoney}}</e-cell-item>
          </e-cellbox>
          <e-cellbox>
            <e-cell-item ></e-cell-item>
            <e-cell-item >运费：</e-cell-item>
            <e-cell-item>{{orderAtherInfo.expenses.price  | formatMoney}}</e-cell-item>
          </e-cellbox>
          <e-cellbox>
            <e-cell-item ></e-cell-item>
            <e-cell-item >服务费：</e-cell-item>
            <e-cell-item>{{orderAtherInfo.service.price  | formatMoney}}</e-cell-item>
          </e-cellbox>
          <e-cellbox v-show="selectCoupon">
            <e-cell-item ></e-cell-item>
            <e-cell-item >优惠券：</e-cell-item>
            <e-cell-item>-{{orderAtherInfo.couponValue.price | formatMoney}}</e-cell-item> 
          </e-cellbox>
          <e-cellbox class='total-money-box'>
            <e-cell-item ></e-cell-item>
            <e-cell-item >应付总额：</e-cell-item>
            <e-cell-item class='total-money'>{{orderAtherInfo.total.price  | formatMoney}}</e-cell-item>
          </e-cellbox>
        </div>
        <div class="submit">
          <el-button type="primary" size="large" @click='orderAction' v-if="disableBtn">提交订单</el-button>
          <el-button type="primary" :loading="!disableBtn" v-else>正在提交订单</el-button>
        </div>
      </div>
      <!-- 优惠券领取弹框 -->
      <el-dialog
        title="温馨提示"
        :visible.sync="couponDialog"
        size="small">
        <div class="suc">
          <span class="success" v-if="couponSuccess===1"><i class="iconfont">&#xe91c;</i>恭喜您已经领取了<b>{{couponInfo.couponName}}</b>优惠券！</span>
          <span class="success" v-if="couponSuccess===2">您已经领取了<b>{{couponInfo.couponName}}</b>优惠券，请勿重复领取！</span>
          <span class="time">使用时间：{{couponInfo.startTime | formatTime}} ~ {{couponInfo.endTime | formatTime}}</span>
          <p class="tips">查看我已领取的优惠券：<a href="javascript:;" @click="goCoupon">我的优惠券</a></p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button  type="primary" @click="couponDialog = false">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import api from 'api/ticket_card'
import ElTable from '@element-ui/Table'
import ElTableColumn from '@element-ui/TableColumn'
import Coupon from './components/coupon'
export default {
  layout: 'default',
  components: {
    Coupon,
    ElTable,
    ElTableColumn
  },
  methods: {
    getSkuDetail () {
      api.skuDetail({
        skuCode: this.skuCode
      }).then((res) => {
        this.loading = false
        this.goodsInfo = res.data
        let item = res.data.ticket
        this.getTicket = item.obtainTypeValues && item.obtainTypeValues[0]
        this.tableData = [
          {
            name: item.name,
            goodsImgUrl: item.imgList[0].goodsImgUrl,
            business: item.sellerName,
            price: res.data.price,
            num: this.buyNum,
            extMap: res.data.extMap
          }
        ]
      })
    },
    // 点击了优惠券
    setCoupon (item) {
      this.orderAtherInfo.total.price = this.orderAtherInfo.totalPrice.price + this.orderAtherInfo.expenses.price + this.orderAtherInfo.service.price
      if (item.codeId === this.selectCoupon.codeId) {
        this.selectCoupon = ''
        this.couponValueAction()
      } else {
        this.selectCoupon = item
        this.orderAtherInfo.total.price = (this.orderAtherInfo.total.price < item.couponValue) ? 0 : (this.orderAtherInfo.total.price - item.couponValue)
        this.couponValueAction()
      }
    },
    couponValueAction () {
      let total = this.orderAtherInfo.totalPrice.price + this.orderAtherInfo.expenses.price + this.orderAtherInfo.service.price
      this.orderAtherInfo.couponValue.price = this.selectCoupon.couponValue > total ? total : this.selectCoupon.couponValue
    },
    // 领取优惠券
    getCoupon (item, index) {
      this.couponInfo = item
      this.couponIndex = index
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
    },
    creatOrder () {
      api.createOrder({
        name: this.form.name,
        mobile: this.form.phone,
        idNo: this.form.idcard,
        address: this.form.address,
        obtainType: this.getTicket,
        skuCode: this.goodsInfo.skuCode,
        couponCodeId: this.selectCoupon ? this.selectCoupon.codeId : '',
        quantity: this.buyNum
      }).then((res) => {
        let orderNumber = res.data.orderNumber
        if (this.orderAtherInfo.total.price === 0) {
          this.$router.replace({path: '/order/success', query: {orderNumber: orderNumber}})
        } else {
          this.$router.replace({path: '/order/created', query: {orderNumber: orderNumber}})
        }
      }).catch((err) => {
        this.$message.error(err.msg)
        this.disableBtn = true
      })
    },
    // 提交订单
    orderAction () {
      this.disableBtn = false
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.creatOrder()
        } else {
          this.disableBtn = true
          return false
        }
      })
    }
  },
  data () {
    return {
      loading: true,
      consigneeInfo: null,
      goodsInfo: null,
      tableData: [],
      goodsCode: '', // 商品code
      skuCode: '', // 商品Sku码
      buyNum: 0,
      orderAtherInfo: {
        totalPrice: {text: '商品总额', price: 0},
        expenses: {text: '运费', price: 0},
        service: {text: '服务费', price: 0},
        couponValue: {text: '优惠券', price: 0},
        total: {text: '应付总额', price: 0}
      },
      selectCoupon: '', // 选择的优惠券
      couponList: [], // 优惠券列表
      couponInfo: {}, // 优惠券详情
      couponIndex: null, // 领取优惠券index索引
      couponSuccess: 1, // 优惠券领取成功标志
      couponDialog: false, // 优惠券弹窗
      getTicket: '', // 取票方式
      form: {
        name: '',
        phone: '',
        address: '',
        idcard: ''
      },
      disableBtn: true
    }
  },
  mounted () {
    let data = JSON.parse(sessionStorage.getItem('buyTicketData'))
    if (data) {
      this.orderAtherInfo.totalPrice.price = Number(data.sku.price) * Number(data.buyNumber)
      this.orderAtherInfo.expenses.price = 0
      this.orderAtherInfo.service.price = 0
      this.orderAtherInfo.total.price = this.orderAtherInfo.totalPrice.price + this.orderAtherInfo.expenses.price + this.orderAtherInfo.service.price
      this.goodsCode = data.goodsCode // 商品code
      this.skuCode = data.sku.skuCode // 商品Sku码 data.sku.skuCode
      this.buyNum = data.buyNumber // 购买数量
    } else {
      this.$message.error('未获取有效的订单信息，请回到上一页刷新，并重新选择')
      this.$router.go(-1)
    }
    // 获取商品详情
    this.getSkuDetail()
  },
  filters: {
    formatExt (val, key) {
      if (key === 'playTime') {
        let index = val.lastIndexOf(':')
        return val.slice(0, index)
      } else {
        return val
      }
    },
    formatObtainType (val) {
      let type = {
        471111: '比赛当天取票',
        471112: '邮寄门票（价格含邮费）',
        471113: '官方售票点取票'
      }
      return type[val]
    }
  }
}
</script>

<style lang="scss" scoped>

.content {
  min-height: 600px;
  padding: 40px 60px;
  .table {
    margin: 20px 0;
    overflow: hidden;
    .goods-info{
      padding-left: 10px;
      height: 80px;
      font-weight: normal;
      .title{
        display: block;
        margin-top: 20px;
      }
      .extmap{
        line-height: 20px;
        font-size: 12px;
        color: #999;
        span{
          color: #999;
        }
      }
    }
    .img-box{
      width: 80px;
    }
  }
  .ticeket{
    padding: 20px 0;
    .divider{
       line-height: 30px;
       padding-left: 10px;
    }
    .radioGroup{
      padding: 30px 10px;
      .el-radio{
        margin-right: 100px;
      }
    }
    .form{
      padding: 20px 300px;
    }
  }
  .price-box{
    padding:42px 0 36px;
    border-top:1px solid #eee;
    >div{
      padding-bottom: 10px;
    }
    // >div:nth-child(1){
    //   padding-bottom:16px;
    // }
    // >div:nth-child(2){
    //   padding-bottom:16px;
    // }
    // >div:nth-child(3){
    //   padding-bottom:22px;
    // }
    .cellbox{
      height:14px;
      line-height:14px;
      margin-bottom: 10px;
      .cell-item:nth-child(1){
        width:780px;
      }
      .cell-item:nth-child(2){
        text-align:left;
      }
      .cell-item:nth-child(3){
        text-align:right;
      }
    }
    .total-money-box{
      height:30px;
      line-height:30px;
      margin-top: 20px;
    }
    .total-money{
      font-size:26px;
      color:#fc6f00;
    }
  }
  .submit {
    border-top: 1px solid #eee;
    padding-top: 20px;
    text-align: right;
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
</style>
<style lang="scss">
.tabs {
  font-size: 14px;
  .total-price {
    color: #fc6f00;
  }
}
</style>

