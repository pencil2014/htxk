<template>
  <ssr>
    <e-layout class="layout-bbs">
      <x-header slot="header" :layout="['small','sub']"/>
      <div slot="body" class="layout-body">
        <el-row class="wrapper">
          <aside>
            <bbs-menu/>
          </aside>
          <article>
            <nuxt/>
          </article>
        </el-row>
      </div>
    </e-layout>
  </ssr>
</template>
<script>
import BbsMenu from '@/pages/community/components/BbsMenu'

export default {
  components: {
    BbsMenu
  }
}
</script>

<style lang="scss">
  $active-background-color:#f0fcf9;
  .layout-bbs{
    .layout-body{
      background:#ebf0f5;
      min-height:500px;
      padding:40px 0;
    }
    footer{
      margin-top:0;
    }
    aside{
      width: 150px;
      background-color: #fff;
      float:left;
    }
    article{
      min-height: 800px;
      width:1030px;
      float:right;
    }
    .el-breadcrumb{
      position: absolute;
      margin-top: -25px;
      margin-left: -170px;
    }
    .content{
      padding:60px;
      .heading-1{
        margin-top:0
      }
    }
  }
</style>

