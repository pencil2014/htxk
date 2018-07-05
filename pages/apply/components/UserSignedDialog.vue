<template>
  <el-dialog
    class="success-dialog"
    size="tiny"
    title="用户已报名"
    :visible.sync="visible">
    <el-scrollbar  wrap-class="sign-scroll">
      <div class="mb20" v-for="user in data" :key="user.phone">
        <p>手机号：{{user.phone}}</p>
        <p>证件号：{{user.idNo}}</p>
      </div>
    </el-scrollbar>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: []
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.mb20{
  margin-bottom: 20px;
}
</style>
<style>
.sign-scroll{
  max-height: 450px;
  overflow-y: scroll;
}
.success-dialog .el-dialog{
    width: 440px;
  }
</style>
