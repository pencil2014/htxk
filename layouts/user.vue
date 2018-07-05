<template>
	<div class="layout">
		<x-header></x-header>
		<div slot="body" class="layout-body">
	      <nuxt/>
	    </div>
		<x-footer :login="true"></x-footer>
	</div>
</template>
<style lang="scss">
  @import '~styles/var.scss';
  .layout-body{
    min-height:500px;
  }
  html{
  	height:100%;
  }
  body{
  	height: 100%;
  	position: relative;
  }
</style>