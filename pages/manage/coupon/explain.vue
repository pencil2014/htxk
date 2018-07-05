<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/coupon' }">我的优惠券</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券说明</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="divider">
        <e-heading grade="1">优惠券说明</e-heading>
      </div>
      <div class="description">
        <div class="item">
        <h3>1.优惠券的获取</h3>
        <p>通过活动赠送、客服补偿等获得(系统自动添加);</p>
        </div>
        <div class="item">
        <h3>2.优惠券使用</h3>
        <p>1）每张抵用券仅能使用一次，不找零，不退换，不兑换现金， 用券后差额不找零, 不退回；<br/>
           2）优惠券 (包括新用户券) 不能抵扣运费, 只能抵扣商品金额。特价商品不可使用优惠券, 与其他优惠不同享；<br/>
           3）每张优惠券的使用条件请查看对应优惠券的使用说明；<br/>
           4）请在有效期内使用优惠券, 未使用的优惠券过期后, 将自动作废；<br/>
           5）每个用户仅限使用1张新用户专享优惠券, 同一帐号和手机号均视为同一用户；
        </p>
        </div>
        <div class="item">
        <h3>3.优惠券失效</h3>
        <p>1）新用户券使用一张后其他新用户券失效, 取消订单后不返还；<br/>
           2）使用优惠券的订单, 若产生退货, 优惠券均不退回, 退款金额按优惠后的小计金额退款；<br/>
           3）优惠券严禁出售或转让, 如经发现并证实的, 该券将予以失效处理；
        </p>
        </div>
        <div class="item">
        <h3>4.什么是兑换码？</h3>
        <p>兑换码是用户在参与求苗一些活动或者从一些相关渠道获得的可兑换优惠券的12位代码。</p>
        </div>
        <div class="item">
        <h3>5.兑换码使用</h3>
        <p>1）进入“我的”--“我的优惠券”兑换码输入框里输入12位兑换码，点击“兑换”，提示兑换成功后，可在“我的优惠券中”查看。<br/>
           2）用户也可以在订单提交页面里，选择优惠券时，输入兑换码直接获取优惠折扣。
        </p>
        </div>
        <div class="item">
        <h3>6.兑换码失效</h3>
        <p>1）每个兑换码仅限兑换一次，兑换成功之后，就无法再使用了。<br/>
           2）兑换码一旦过期了就无法再使用或者兑换，所以以后请及时在有效期内使用，一般兑换码到期时间就是活动结束时间。
        </p>
        </div>
        <el-button  type="primary" @click="goback" class="back-btn">返回</el-button>
      </div>
      
    </div>
  </div>
</template>
<script>
export default {
  layout: 'manage',
  methods: {
    goback () {
      this.$router.push('/manage/coupon/')
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
 
.description {
  padding-top: 15px;
  .item {
    margin-bottom: 20px;
    h3 {
      color: $color-primary;
      font-size: 16px;
      font-weight: normal;
      border-bottom: 1px dashed $border-color-base;
      padding-bottom: 5px;
      margin: 10px 0;
    }
    p {
      color: $color-black-base;
      line-height: 2;
    }
  }
  .back-btn {
    margin-top: 25px;
  }
}  
</style>