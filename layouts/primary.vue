<template>
  <ssr>
    <e-layout class="layout-primary">
      <x-header slot="header" :layout="['small','sub']"/>
      <div slot="body" class="layout-body">
        <nuxt/>
      </div>
    </e-layout>
  </ssr>
</template>
<style lang="scss">
  .layout{
    &-primary{
      background:#fff;
      .content{
        width: 1200px;
        margin: 20px auto;
      }
      .el-breadcrumb{
        width: 1200px;
      }
    }
  }
</style>

