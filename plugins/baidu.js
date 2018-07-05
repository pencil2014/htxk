export default ({ app: { router }, store }) => {
  /*
  ** 每次路由变更时进行pv统计
  */
  router.afterEach((to, from) => {
    /*
    ** 告诉 baidu统计 增加一个 PV
    */
    process.browser && window._hmt && window._hmt.push(['_trackPageview', to.path])
  })
}
