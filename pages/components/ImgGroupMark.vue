<template>
  <e-preview-box class="img-group-upload">
    <draggable v-model="myValue" class="drag">
      <transition-group>
          <div class="img-group-item" v-if="myValue" v-for="(item, index) in myValue" :key="index" :style="style">
            <button type="button">
              <img :src="item.src || item" />
            </button>
            <i @click="handleRemove(index)" class="el-icon-close"></i>
            <slot v-bind="{$index: index, item: item}"></slot>
          </div>
      </transition-group>
    </draggable>
    <e-img-upload
      v-if="!myDisabled"
      :multiple="multiple"
      :style="style"
      :size="size"
      :disabled="myDisabled"
      :validate-event="false"
      @change="handleChange"
      />
  </e-preview-box>
</template>

<script>
  import emitter from 'utils/emitter.js'
  import EImgUpload from '@e-ui/ImgUpload'
  import draggable from 'vuedraggable'
  export default {
    components: {
      EImgUpload,
      draggable
    },
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
          this.myValue.push({src: data.url, text: ''})
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
      }
    }
  }
</script>

<style lang="scss" scoped>
    // 
    

    .img-group {
      &-upload{
        margin-top:10px;
        .img-upload{
          margin-bottom:10px;
        }
        .drag {
          display: inline-block;
          vertical-align: top;
        }
      }
      &-item{
        width:250px;
        height:300px;
        display:inline-block;
        border:1px solid $border-color-base;
        overflow:hidden;
        vertical-align:top;
        margin-right:10px;
        margin-bottom:10px;
        position:relative;
        button{
          border:0;
          background:transparent;
          height:246px;
          width:100%;
          outline:none;
          vertical-align: top;
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
