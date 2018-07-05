<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/group/' }">我的组织</el-breadcrumb-item>
      <el-breadcrumb-item>组织服务协议</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <!-- 页面标题 -->
      <div class="divider">
        <e-heading grade="1">组织服务协议</e-heading>
      </div>
      <div class="argument">
        <div class="paragraph">
          <h3 class="subTitle">1.【组织群的注意事项】</h3>
          <p>群主、创始 人、群管理 员仅有依约使 用群、管理 群的权利 。群主、创始 人除可以按照求苗的规则以 无偿 方式，将 自 己的创始 人身份及管理 员相应对群的管理 权限转移给其他组织群成员之外，群主、创始 人不 得有偿或 无偿以借 用、租 用、转让或售卖等任何 方式将 自 己的创始 人身份及管理 员相应对群的管理 权限转移给其他组织群群成员或其他任何 人，否则，求苗有权采取收回组织群，中 止或终 止对群的使 用、管理 及相关服务等措施。</p>
          <p>群成员仅有依约使 用群的权利 。</p>
          <p>除上述明确的群主、创始 人、群管理 员和群成员享有的权利 之外，组织群的所有权及其他全部权利 归求苗所有。</p>
          <p>对组织群命名时，群名称不 得含有违反国家法律 法规、公序良俗、社会公德以及侵犯他 人合法权益等的内容，否则，群将 无法创建成功或创建成功后，求苗有权采取收回群，中 止或终 止对群的使 用、管理 及相关服务等措施。因您发布含有违反国家法律 法规、公序良俗、社会公德以及侵犯他 人合法权益的内容 而引发的争议或产 生的责任，由您负责解决或承担。</p>
        </div>
        <div class="paragraph">
          <h3 class="subTitle">2.【第三 方产品和服务】</h3>
          <p>本服务可能包含第三 方提供的产品或服务。当您使 用第三 方提供的产品或服务时，您应该认真阅读第三 方发布的相关的协议或规则并遵守协议或规则。</p>
          <p>如您在使 用第三 方产品或服务时发 生任何纠纷的，请您与第三 方直接联系，求苗不 承担任何责任，但因举证需要求苗协助的，求苗将根据实际情况依法提供必要的协助。</p>
          <p>您在使 用第三 方的产品或服务时仍应遵守本群的规定并不 得存在有损于求苗的 行 为，不 得发布有损于求苗利 益的信息，不 得影响求苗的声誉，否则求苗将有权将您清除出组织群并保留 追究您法律 责任的权利 。</p>
        </div>
        <div class="paragraph">
          <h3 class="subTitle">3.【数据的存储】</h3>
          <p>您可根据实际需求，存储或者删除您在本服务的相关数据，数据的存储或者删除由您自主操作，求苗不对您在本服务中相关数据的删除或者存储失败负责。</p>
          <p>求苗可根据实际情况自行决定在服务器上对您在本服务中的数据的最长储存期限、为单个用户分配的最大使用空间等。您可根据自己的需要自行备份本服务中的相关数据。</p>
          <p>如果您的服务被终止或者取消，求苗可以从服务器上永久地删除您的数据。服务终止或者取消后，求苗没有义务向您返还数据。</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'manage',
  data () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.argument {
  padding-top: 10px;
  .paragraph {
    margin-bottom: 15px;
    .subTitle {
      padding: 10px 0 10px;
    }
    p {
      margin-bottom: 10px;
    }
  }
  
}
  
</style>