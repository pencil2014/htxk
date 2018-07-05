<template>
  <preview-box class="img-group-upload">
    <div class="img-group-item" v-if="myValue" v-for="(item, index) in myValue" :key="index" :style="style">
      <button type="button">
        <img :src="item" />
      </button>
      <i @click="handleRemove(index)" class="el-icon-close"></i>
    </div>
    <template v-if="!$listeners.add">
      <img-upload
        v-if="!myDisabled"
        :multiple="multiple"
        :style="style"
        :size="size"
        :disabled="myDisabled"
        :validate-event="false"
        @change="handleChange"/> 
    </template>
    <template v-else >
      <div v-if="!myDisabled" @click="handle" class="img-group-add" :style="`width:${width}px;height:${height}px;`">
        <button type="button"><i class="el-icon-plus"></i></button>
      </div>
    </template>
  </preview-box>
</template>

<script>
  import emitter from 'utils/emitter.js'
  import ImgUpload from './ImgUpload'
  export default {
    components: {ImgUpload},
    mixins: [emitter],
    props: {
      value: {
        type: Array,
        default () {
          return []
        }
      },
      multiple: {
        type: Boolean,
        default: true
      },
      showFileList: {
        type: Boolean,
        default: false
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      width: {
        type: Number,
        default: 150
      },
      height: {
        type: Number,
        default: 150
      },
      limit: {
        type: Number,
        default: 0
      },
      size: {
        type: Number
      }
    },
    computed: {
      style () {
        return {
          width: this.width + 'px',
          height: this.height + 'px'
        }
      }
    },
    watch: {
      value (value) {
        this.myDisabled = !!this.limit && (this.value.length >= this.limit || this.myValue.length >= this.limit)
        this.myValue = value
      }
    },
    data () {
      return {
        myDisabled: !!this.limit && this.value.length >= this.limit,
        myValue: this.value
      }
    },
    methods: {
      handleChange (data) {
        if (this.myValue && !this.myDisabled) {
          this.myValue.push(data.url)
          this.change()
        }
      },
      handleRemove (index) {
        this.myValue.splice(index, 1)
        this.change()
      },
      change () {
        this.$emit('change', this.myValue).$emit('input', this.myValue)
        if (this.validateEvent) { // 触发表单校验
          this.dispatch('ElFormItem', 'el.form.change', this.myValue)
          this.dispatch('ElFormItem', 'el.form.blur', this.myValue)
        }
      },
      handle () {
        this.$emit('add')
      }
    }
  }
</script>

<style lang="scss">
    // @import '~styles/var.scss';
    @import '~styles/var';
    .img-group-add {
      border: 1px dashed $border-color-base;
      display: inline-block;
      height: 100px;
      width: 100px;
      vertical-align: top;
      position: relative;
      overflow:hidden;
      &:hover {
          border-color: $color-primary;
          .el-icon-plus {
              font-size: 28px;
              color: $color-primary;
          }
      }
      box-sizing: border-box;
      button {
          border: 0;
          outline: none;
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          background: transparent;
          cursor: pointer;

          .el-icon-plus {
              font-size: 28px;
              color: #8c939d;
          }
          img {
              max-width: 100%;
              max-height: 100%;
          }
      }
    }
    .img-group {
      &-upload{
        margin-top:10px;
        .img-upload{
          margin-bottom:10px;
        }
      }
      &-item{
        width:100px;
        height:100px;
        display:inline-block;
        border:1px solid $border-color-base;
        overflow:hidden;
        vertical-align:middle;
        margin-right:10px;
        margin-bottom:10px;
        position:relative;
        button{
          border:0;
          background:transparent;
          height:100%;
          width:100%;
          outline:none;
        }
        img{
          max-width: 100%;
          max-height: 100%;
        }
        .el-icon-close{
          position:absolute;
          top: -18px;
          right: -18px;
          color:#fff;
          font-size:12px;
          cursor: pointer;
          transition:all 0.2s ease 0s;
          &:before{
            z-index: 100;
            position: absolute;
            right: 5px;
            top: 5px;
          }
          &:after{
            border:18px solid transparent;
            content:'';
            right:0;
            top:0;
            position:absolute;
            border-top-color:#999;
            border-right-color:#999;
          }
          &:hover{
            &:after{
              border-top-color:#ff4949;
              border-right-color:#ff4949;
            }
          }
        }
        &:hover{
          .el-icon-close{
            top: 0;
            right: 0;
          }
        }
      }
    }

</style>
