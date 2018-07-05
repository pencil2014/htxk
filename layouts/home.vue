<template>
  <ssr>
    <e-layout>
      <x-header slot="header" :layout="['small','nav']"/>
      <div slot="body" class="layout-body">
        <nuxt/>
      </div>
    </e-layout>
  </ssr>
</template>

<style lang="scss">
  .layout-body{
    min-height:500px;
  }
</style>

