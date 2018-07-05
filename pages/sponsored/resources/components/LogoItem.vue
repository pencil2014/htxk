<template>
  <e-cellbox middle class="logoitem">
    <e-cell-item>
      <img :src="url" :title="name"/>
    </e-cell-item>
  </e-cellbox>      
</template>
<script type="text/javascript">
  export default {
    props: {
      url: {
        type: String
      },
      name: {
        type: String
      }
    }
  }
</script>
<style lang="scss">
  
  .logoitem{
    border: 1px solid $border-color-base;
    margin-left: -1px;
    margin-top: -1px;
    float: left;
    width: 20%;
    height: 85px;
    text-align: center;
    img{
      width: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>