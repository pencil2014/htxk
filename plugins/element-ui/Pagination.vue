<template>
  <div>
    <pagination v-bind="$props" v-on="$listeners" />
    <div style="display:none">
      <a v-for="item in getPages()" :href="getHref(item)">{{item}}</a>
    </div>
  </div>
</template>
<script>
  import Pagination from 'element-ui/lib/pagination'
  Pagination.props.layout.default = 'prev, pager, next, sizes, jumper, total'
  Pagination.props.pageSizes.default = () => {
    return [15, 20, 30, 40, 50]
  }
  export default {
    props: Pagination.props,
    components: {
      Pagination
    },
    methods: {
      getPages () {
        let result = []
        let $props = this.$props
        let currentPage = $props.currentPage ? Number($props.currentPage) : 1
        let pageSize = $props.pageSize ? Number($props.pageSize) : 15
        let total = $props.total ? Number($props.total) : 0
        if (currentPage && pageSize && total) {
          for (let i = currentPage; i <= Math.ceil(total / pageSize); i++) {
            result.length < 10 && result.push(i)
          }
        }
        return result
      },
      getHref (item) {
        if (this.$route.fullPath.indexOf('page=') > -1) {
          return this.$route.fullPath.replace(`page=${this.$props.currentPage}`, `page=${item}`)
        } else {
          return this.$route.fullPath + '?page=' + item
        }
      }
    }
  }
</script>
