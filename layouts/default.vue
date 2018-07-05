<template>
  <ssr>
    <e-layout class="layout-default">
      <x-header slot="header" :layout="['small','sub']"/>
      <div slot="body" class="layout-body">
        <nuxt/>
      </div>
    </e-layout>
  </ssr>
</template>
<style lang="scss">
  .layout{
    &-body{
      min-height:480px;
    }
    &-default{
      background:#ebf0f5;
      .el-breadcrumb{
        width:1200px;
      }
      .content{
        box-sizing: border-box;
        padding:60px;
        background:#fff;
        margin:20px auto;
        width:1200px;
        min-height:600px;
        .heading-1{
          margin-top:0;
        }
      }
    }
  }
</style>

