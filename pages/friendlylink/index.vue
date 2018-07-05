<template>
  <div class="content">
    <e-heading grade="1">友情链接</e-heading>
    <ul class="friend-link">
      <li>
        <a target="_blank" href="http://live.13322.com">
          <img src="/images/friend/13322.png" alt="一比分" />
        </a>
      </li>
      <li>
        <a target="_blank" href="http://dj.13322.com">
          <img src="/images/friend/dj.png" alt="乐盈电竞" />
        </a>
      </li>
      <li>
        <a target="_blank" href="https://www.71chat.com/">
          <img src="/images/friend/71chat.png" alt="七讯" />
        </a>
      </li>
      <li>
        <a target="_blank" href="http://lawyer.hao13322.com/">
          <img src="/images/friend/lawyer.png" alt="华海律正" />
        </a>
      </li>
      <li>
        <nuxt-link to="../partner/huanqiu">
          <img src="/images/friend/huanqiu.png" alt="环球求苗" />
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="../partner/people">
          <img src="/images/friend/people.png" alt="人民求苗" />
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>
<style lang="scss" scoped>
  .friend-link{
    margin-right:-15px;
    margin-left:-15px;
    overflow:hidden;
    li{
      width: 340px;
      height: 160px;
      border: solid 1px #e5e5e5;
      line-height:160px;
      text-align:center;
      float:left;
      margin:15px;
    }
  }
</style>
