<template>
  <div>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/service/list' }">售后/退款</el-breadcrumb-item>
        <el-breadcrumb-item>记录详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content">
          <e-heading grade="1">记录详情</e-heading>
          <div class="service-layout">
             <div class="info-process" v-if="refundDetailList.refundStatus===1">
                <el-steps :active="active" finish-status="success" simple style="margin-top: 20px; margin-bottom:30px">
                  <el-step title="申请审核"></el-step>
                  <el-step title="进行退款" ></el-step>
                  <el-step title="处理完成" ></el-step>
                </el-steps>
              </div>
              <div class="info-process" v-if="refundDetailList.refundStatus===2">
                <el-steps :active="active" finish-status="success" simple style="margin-top: 20px; margin-bottom:30px">
                    <el-step title="申请审核"></el-step>
                    <el-step title="审核失败" ></el-step>
                </el-steps>
              </div>
              <div class="info-process" v-if="refundDetailList.refundStatus===3">
                <el-steps :active="active" finish-status="success" simple style="margin-top: 20px; margin-bottom:30px">
                  <el-step title="申请审核"></el-step>
                  <el-step title="进行退款"></el-step>
                  <el-step title="处理完成" ></el-step>
                </el-steps>
              </div>
              <div class="info-process" v-if="refundDetailList.refundStatus===4">
                <el-steps :active="active" finish-status="success" simple style="margin-top: 20px; margin-bottom:30px">
                    <el-step title="申请审核"></el-step>
                    <el-step title="进行退款" ></el-step>
                    <el-step title="处理完成"></el-step>
                </el-steps>
              </div>
              <div class="info-process" v-if="refundDetailList.refundStatus===5">
                <el-steps :active="active" finish-status="success" simple style="margin-top: 20px; margin-bottom:30px">
                    <el-step title="申请审核"></el-step>
                    <el-step title="退款失败" ></el-step>
                </el-steps>
              </div>
              <div class="detail-title"><span><b>我的退款申请</b></span></div>
              <ul class="detail-info-list">
                 <li class="info-list-one">
                   <span><b>服务单号：</b><span>{{ refundDetailList.refundNumber }}</span></span>
                   <span class="info-first"><b>退款金额：</b><span>{{ refundDetailList.refundAmount  | formatMoney }}</span></span>
                   <span class="info-first"><b>申请时间：</b><span>{{ refundDetailList.createTime }}</span></span>
                 </li>
                 <li><b>退款原因：</b><span>{{ refundDetailList.refundReasonDesc }}</span></li>
                 <li><b>问题描述：</b><span>{{ refundDetailList.refundDesc }}</span></li>
                 <li><b>上传凭证：</b>
                  <e-preview-box class="img-list">
                      <img v-for="(items, n) of refundDetailList.imgList" :key="n" :src="items" width="180" height="120"/>
                  </e-preview-box>
                 </li>
              </ul>
               <div class="detail-title" style="margin-top: 30px"><span><b>商家退款处理</b></span></div>
               <div class="detail-info-des">审核留言： {{ refundDetailList.auditOpinion }}</div>
               <nuxt-link :to="{path:'/manage/service/list'}" class="detail-info"><el-button type="primary">返回</el-button></nuxt-link>
          </div>
       </div>
  </div>
</template>
<script>
import api from 'api/aftersales'
import {ElSteps, ElStep} from '@element-ui/Steps'
export default {
  layout: 'manage',
  components: {
    ElSteps,
    ElStep
  },
  methods: {
    handleClose () {
      this.visible = false
    },
    // 获取退款订单详细信息
    getRefundDetailData () {
      api.refundsDetail({refundNumber: this.refundNumber})
        .then((res) => {
          this.refundDetailList = res.data
          if (this.refundDetailList.refundStatus === 1) {
            this.active = 1
          }
          if (this.refundDetailList.refundStatus === 2) {
            this.active = 2
          }
          if (this.refundDetailList.refundStatus === 3) {
            this.active = 2
          }
          if (this.refundDetailList.refundStatus === 4) {
            this.active = 3
          }
          if (this.refundDetailList.refundStatus === 5) {
            this.active = 2
          }
          console.log(res)
        })
    }
  },
  data () {
    return {
      active: 1,
      refundDetailList: {
        refundNumber: '',
        refundAmount: '',
        createTime: '',
        refundReasonCode: '',
        refundReasonDesc: '',
        auditOpinion: '',
        imgList: ''
      },
      refundNumber: ''
    }
  },
  created () {
    this.refundNumber = this.$route.query.refundNumber
  },
  mounted () {
    this.getRefundDetailData()
  }
}
</script>
<style lang="scss">
  
  .service-layout {
    .info-process .el-step__description.is-success{
      color: #ccc !important
    }
    .img-list {
      display: inline-block;
      vertical-align: middle
    }
    .img-list img{
      cursor: pointer;
      margin-right: 20px;
    }
    .detail-info-list{
        padding-left: 15px;
    }
    .detail-info-list li{
        padding: 10px 0;
    }
    .info-first {
        margin-left: 50px;
    }
    li.info-list-one{
        padding: 30px 0 !important;
        border-bottom: 1px solid #f2f2f2;
        margin-bottom: 10px
    }
    .detail-title{
        height: 40px;
        line-height: 40px;
        background: #f2f2f2;
        text-indent: 15px;
    }
    .detail-info-des{
        padding: 15px;
    }
    .detail-info{
        margin-left: 15px;
        margin-top: 30px;
        display: block
    }
  }
</style>
