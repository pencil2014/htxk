<template>
  <el-cascader
    class="address-cascader"
    ref="cascader"
    v-bind="$props"
    :options="optionsTree"
    @change="handleChange" />
</template>

<script>
  // import axios from 'axios'
  import {Cascader} from 'element'
  import data from 'static/area.json'
  export default {
    props: {
      ...Cascader.props,
      grade: {
        type: Number,
        default: 3
      },
      options: {
        type: Array,
        required: false
      }
    },
    data () {
      return {
        optionsTree: []
      }
    },
    mounted () {
      let result = []
      this.$areaJson = data
      data.province.forEach(p => {
        let city = []
        if (data.city[p.areaId] && this.grade > 1) {
          data.city[p.areaId].forEach(c => {
            let area = []
            if (data.area[c.areaId] && this.grade > 2) {
              data.area[c.areaId].forEach(a => {
                a.parentId === c.areaId && area.push({
                  value: a.areaId,
                  label: a.title
                })
              })
            }
            let cityObject = {
              value: c.areaId,
              label: c.title
            }
            if (this.grade > 2 && area.length) {
              cityObject.children = area
            }
            city.push(cityObject)
          })
        }
        result.push({
          value: p.areaId,
          label: p.title,
          children: this.grade > 1 ? city : null
        })
      })
      this.optionsTree = result
    },
    methods: {
      handleChange (value) {
        this.$emit('change', value).$emit('input', value)
        this.$emit('update:label', this.getLabel(value))
      },
      getLabel (value) {
        let result = []
        value.forEach((item, index) => {
          if (index === 0) {
            data.province.forEach(p => {
              p.areaId === item && result.push(p.title)
            })
          }
          if (index === 1 && data.city[value[0]]) {
            data.city[value[0]].forEach(c => {
              c.areaId === item && result.push(c.title)
            })
          }
          if (index === 2 && data.area[value[1]]) {
            data.area[value[1]].forEach(a => {
              a.areaId === item && result.push(a.title)
            })
          }
        })
        return result
      }
    },
    destroyed () {
      this.$areaJson = null
    }
  }
</script>

<style lang="scss">
  @import '~styles/var.scss';
</style>
