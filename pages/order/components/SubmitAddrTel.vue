<template>
  <div>
    <p>
      <span style='margin-right:20px;'>{{consigneeInfo.consignee}}</span>
      <span class='tel'>{{consigneeInfo.mobile | hidPhone}}</span>
    </p>
    <p>
      寄送至： 
      {{consigneeInfo.provName}}
      {{consigneeInfo.cityName}}
      {{consigneeInfo.distName}}
      {{consigneeInfo.detailAddress}}
    </p>
  </div>
</template>
<script type="text/javascript">
export default {
  props: {
    consigneeInfo: {
      type: Object,
      required: true
    }
  }
}
</script>
<style type="text/css" lang="scss" scoped>

p{
  height:14px;
  line-height:14px;
  &:nth-child(1){
    margin-bottom:8px;
    height:16px;
    line-height:16px;
    font-size:16px;
    .tel{
      font-size:14px;
    }
  }
  &:nth-child(2){
    height:12px;
    line-height:12px;
    font-size:12px;
  }
}
</style>
