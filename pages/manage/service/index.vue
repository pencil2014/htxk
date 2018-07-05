<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/service/list' }">售后/退款</el-breadcrumb-item>
      <el-breadcrumb-item>申请售后</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content refund-box">
      <div class="divider">
        <e-heading grade="1">申请售后 <span class="refund-info-link"><i class="icon iconfont icon-tixing-copy"></i><nuxt-link :to="{path: '/manage/service/info?orderNumber=' + this.$route.query.orderNumber + '&skuCode=' + this.$route.query.skuCode}" style="padding-left:8px">退款说明</nuxt-link></span></e-heading>
      </div>
      <div class="form-list el-form-item ">
        <label class="el-form-item__label list-name">退款商品</label>
        <e-cellbox top :gutter="20" >
            <e-cell-item class="goods-li">
              <img class="" :src='refundsInfo.imgUrl' title=""  width="60" height="60">
            </e-cell-item>
            <e-cell-item>
                <div class="goods-li-name">
                <strong>{{refundsInfo.goodsName}}</strong>
                <div class="goods-li-num">￥ {{refundsInfo.salePrice | noPreformatMoney}}<span>x {{refundsInfo.quantity}}</span></div>
              </div>
            </e-cell-item>
        </e-cellbox>
      </div>
      <div class="form-list el-form-item is-required">
        <label class="el-form-item__label">退款金额</label>
        <span class="refund-num">￥ {{refundsInfo.refundAmount | noPreformatMoney}}</span>
      </div>
      <div class="form">
        <el-form ref="form" v-bind="getFormProps({labelWidth:'80px'})" >
          <el-form-item label="退款原因" prop="cause"
            :rules="[
              {required: true, message: '请选择退款原因'}
            ]">
            <el-select size="small" v-model="form.cause" placeholder="请选择退款原因" style="width: 500px;">
                <el-option v-for="item in causeList" :key="item.refundReasonCode" :label="item.refundReasonDesc" :value="item.refundReasonCode" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述" 
            prop="title"
            :rules="[
              { min:0, max:500, message: '问题描述长度为不能超过500个字符', trigger: 'blur'}
             ]">
             <el-input type="textarea" v-model.trim="form.question" :autosize="{ minRows: 5, maxRows: 6}" :maxlength="500" style="width: 500px;" placeholder="请输入问题描述" number-word></el-input>
          </el-form-item>
           <el-form-item label ="上传凭证">
            <e-img-group-upload @success="handleSuccess" v-model="form.certificate" :size="1024 * 1024 * 3" :limit="3" class="club_upload"/>
          </el-form-item>
          <div class="action">
            <el-button  type="primary"  native-type="submit">提交</el-button>
          </div>
        </el-form>
      </div>
      <!-- 弹出框确认-->
      <el-dialog title="温馨提示" :visible.sync="dialogVisible" class="cancel_order_box">
          <p class="dialog-txt"> <i class="icon iconfont icon-icon11-copy"></i> 售后申请提交成功！</p>
          <span slot="footer" class="dialog-footer">
            <nuxt-link :to="{path: '/manage/service/detail?refundNumber=' + refundNumber}" class="wallet-link"><el-button type="primary" style="margin-left:20px">查看记录</el-button></nuxt-link>
          </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import api from 'api/aftersales'
import {form} from 'utils/mixins'
import EImgGroupUpload from '@e-ui/ImgGroupUpload'
export default {
  mixins: [form],
  layout: 'manage',
  components: {
    EImgGroupUpload
  },
  data () {
    return {
      // 订单状态
      causeList: '',
      refundNumber: '',
      refundsInfo: {
        imgUrl: '',
        goodsName: '',
        quantity: ''
      },
      query: '',
      orderNumber: '',
      dialogVisible: false,
      skuCode: '',
      form: {
        cause: '',
        question: '',
        certificate: []
      }
    }
  },
  methods: {
    // 上传凭证
    handleSuccess (url) {
      this.form.certificate = url
    },
    // 发布资讯
    submit () {
      this.saveRefundData()
    },
    // 退款申请
    saveRefundData () {
      // 检测退款原因
      if (!this.form.cause) {
        this.$message.error('请选择退款原因!')
        return false
      }
      this.submitSaveRefundInfo()
    },
    // 提交退款申请
    submitSaveRefundInfo () {
      api.saveRefundsInfo({
        orderNumber: this.$route.query.orderNumber,
        skuCode: this.$route.query.skuCode,
        refundReasonCode: this.form.cause,
        desc: this.form.question,
        // 上传多张图片默认为数组，转为字符串提交数据
        imgs: this.form.certificate.join(',')
      }).then((res) => {
        if (res.data) {
          this.dialogVisible = true
          this.refundNumber = res.data.refundNumber
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 获取退款申请原因
    getRefundsReasonInfo () {
      api.getReasonList(this.query)
        .then((res) => {
          this.causeList = res.data
        })
      api.getRefundsInfo({orderNumber: this.orderNumber, skuCode: this.skuCode})
        .then((res) => {
          this.refundsInfo = res.data
        })
    }
  },
  created () {
    this.orderNumber = this.$route.query.orderNumber
    this.skuCode = this.$route.query.skuCode
    if (!this.$route.query.orderNumber) {
      // 若url没有订单编号，将跳转到订单列表，进行售后申请
      this.$router.push('/manage/order')
    }
  },
  mounted () {
    // 获取退款原因，退款商品信息
    this.getRefundsReasonInfo()
  }
}
</script>
<style lang="scss" scoped>
 
  .dialog-txt{
    text-align: center;
    font-size: 18px;
    .icon-icon11-copy{
      color: #50d39a;
      font-size: 32px;
      vertical-align: middle;
    }
  }
  .refund-box {
    .refund-info-link {
      font-weight: normal;
      float: right;
      color: #50d39a;
      font-size: 14px;
    }
    .cellbox{
      display: block !important;
    }
    .list-name{
      padding-left: 10px;
    }
    .form-list{
      margin-top:20px
    }
    .action{
      padding-left: 80px
    }
    .refund-num{
      padding-top: 6px;
      display: inline-block;
      color: #fc6f00;
      font-weight: 700;
    }
    .goods-li{
      width: 60px;
      height: 60px;
    }
    .goods-li-num{
      span {
        padding-left: 100px;
      }
    }
  }
</style>