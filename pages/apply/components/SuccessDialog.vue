<template>
  <el-dialog
    class="success-dialog"
    :visible.sync="visible"
    size="tiny"
    :title="'温馨提示'"
    @close="handleClose()">
    <div class="msg-content">
      <el-row>
        <el-col :span="4">
          <i class="iconfont success">&#xe91c;</i>
        </el-col>
        <el-col :span="19" :offset="1" class="success-text">
          <template v-if="lottery">
            <p class="success-title">信息提交成功！</p>
            <p v-if="hasFee">请等待系统摇号中签短信通知，中签后即可完成支付参赛。</p>
            <p v-else>请等待系统摇号中签短信通知</p>
          </template>
          <template v-else>
            <p class="success-title">下单成功！</p>
            <p>订单号：{{orderNumber}}</p>
            <p>订单金额：0.00元</p>
          </template>                
        </el-col>
      </el-row>
    </div> 
    <span slot="footer" class="dialog-footer">
      <el-button style="margin-right:15px;" type="primary" @click="handleCancel()">订单详情</el-button>
      <router-link to='/'>
        <el-button type="text" class="link">继续逛逛</el-button>
      </router-link>
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
    lottery: { // 是否摇号
      type: Boolean,
      default: false
    },
    hasFee: { // 是否收费
      type: Boolean,
      default: false
    },
    orderNumber: { // 订单编号
      type: String,
      default: ''
    }
  },
  methods: {
    handleCancel () {
      this.$emit('cancel')
    },
    handleClose () {
      this.$emit('close')
    }
  }

}
</script>

<style>
.msg-content{
    width:300px;
    margin: 0 auto;
  }
.iconfont.success{
  color:#24c881;
  font-size:50px;
}
</style>
