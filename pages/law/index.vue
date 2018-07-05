<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>免责声明</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面内容 -->
    <div class="content">
      <h1>免责声明</h1>
      <p>1、用户明确同意其使用本站网络服务所存在的风险及一切后果将完全由用户本人承担，求苗对此不承担任何责任。</p>
      <p>2、求苗无法保证网络服务一定能满足用户的要求，也不保证网络服务的及时性、安全性、准确性,用户不得以此为由要求本站索赔,本站不承担任何责任。</p>
      <p>3、求苗不保证为方便用户而设置的外部链接的准确性和完整性，同时，对于该等外部链接指向的不由本站实际控制的任何网页上的内容，本站不承担任何责任。</p>
      <p>4、虽对于因不可抗力或求苗不能控制的原因造成的网络服务中断或其它缺陷，本站不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。</p>
      <p>5、对于求苗向用户提供的下列产品或者服务的质量缺陷本身及其引发的任何损失，本站无需承担任何责任：</p>
      <div class="subtext">
        <p>(1)本站向用户免费提供的各项网络服务；</p>
        <p>(2)本站向用户赠送的任何产品或者服务。</p>
      </div>
      
      <p>6、求苗有权于任何时间暂时或永久修改或终止本服务(或其任何部分)，而无论其通知与否，本站对用户和任何第三人均无需承担任何责任。</p>
      <p>7、因用户原因造成本站损失的,用户不仅赔偿损失,而且赔偿因损失所产生的诉讼费、律师费、公证费、保全费等一切费用。</p>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'default',
  data () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>

.content {
  h1 {
    text-align: center;
    font-size: 24px;
    padding-bottom: 40px;
    font-weight: normal;
    color: $color-black;
  }
  p {
    font-size: 14px;
    color: $color-black-base;
    padding: 5px 0;
    line-height: 25px;
  }
  .subtext {
    p {
      text-indent: 1.5em;
    }
  }
}
</style>