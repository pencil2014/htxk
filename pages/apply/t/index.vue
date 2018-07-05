<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/manage/card/'}">服务卡</el-breadcrumb-item>
      <el-breadcrumb-item>填写报名信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 培训服务卡 -->
    <train-card :cardInfo="$route.query.cardNo ? query_card_info : cardInfo"/>
    <div class="content train-form">
      <e-heading grade='1'>提交报名信息</e-heading>
      <!-- 报名信息 -->
      <sign-info :signupList="signupList" :courseId="courseId" :edit-id="editId" @cancel="handleCancelEdit" @save="handleSave">
        <template slot-scope="scope">
          <el-button size="small" type="link" native-type="button" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
          <el-popover
            ref="popover"
            placement="top"
            width="200"
            :value="signupList[scope.$index].showVisible">
            <p>确定要删除该报名信息吗?</p>
            <div style="text-align: right; margin-top: 10px;">
              <el-button type="normal" size="mini" @click="signupList[scope.$index].showVisible = !signupList[scope.$index].showVisible">取消</el-button>
              <el-button type="primary" size="mini" @click="handleRemove(scope.$index)">确定</el-button>
            </div>
          </el-popover>
          <el-button size="small" type="link" v-popover:popover @click="signupList[scope.$index].showVisible = !signupList[scope.$index].showVisible">删除</el-button>
        </template>
      </sign-info>
      <!-- 新增报名表单 -->
      <train-sign :courseId="courseId" :showCancel="signupList.length > 0" @cancel="handleCancel"  @addSave="handleAddSave" @save="handleSave" v-if="popupForm && courseId"/>
      <!-- 新增和提交 -->
      <el-button type="link" @click="handleAddSignUp" :disabled="disableAdd">+添加报名人</el-button>
      <div class="center button-box" >
        <el-button type="primary" @click="handleSubmit" :disabled="signupList.length == 0">提交信息</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import TrainCard from '../components/TrainCard'
import TrainSign from './components/TrainSign'
import SignInfo from './components/SignInfo'
import ElPopover from '@element-ui/Popover'
import api from 'api/train'
import { VuecookieGet } from 'utils/cookie'
import { mapGetters } from 'vuex'

export default {
  components: {
    TrainCard,
    TrainSign,
    SignInfo,
    ElPopover
  },
  computed: {
    signupList () {
      return this.$store.getters.temporary_signup_list
    },
    ...mapGetters({
      query_card_info: 'query_card_info'
    })
  },
  data () {
    return {
      editId: null,
      loading: false,
      cardInfo: {},
      courseId: '',
      disableAdd: true, // 禁用添加报名人
      popupForm: true // 弹出新增表单
    }
  },
  mounted () {
    let goodsInfo = JSON.parse(sessionStorage.getItem('sessionNextPage'))[0]
    if (this.$route.query.cardNo) {
      this.$store.dispatch('query_card_info', {cardNo: this.$route.query.cardNo}).then(_ => {
        this.cardInfo = this.$store.getters.query_card_info
      })
      api.getCourseInfo({goodsCode: goodsInfo.goodsCode}).then(res => {
        this.courseId = res.data.id
      })
    } else {
      api.createServiceCard({
        skuCode: goodsInfo.matchedStock.skuCode,
        userId: VuecookieGet('htxk_userId')
      }, {context: this, successMsg: 'none'}).then(res => {
        this.cardInfo = Object.assign({}, res.data, {courseName: goodsInfo.name.title})
        this.courseId = res.data.courseId
      })
    }
  },
  // destory () {
  //   this.$store.commit('TEMPORARY_SIGNUP_LIST', [])
  //   this.$store.commit('CARD_INFO', {})
  // },
  methods: {
    handleAddSignUp () {
      this.disableAdd = true
      this.popupForm = true
    },
    handleCancel (row, index) {
      if (Object.values(row).filter(item => { return item }).length) {
        this.$msgbox({
          title: '温馨提示',
          message: <div>
            <div>离开后信息将不保存</div>
            <div style="margin-top: 10px">确认离开？</div>
          </div>,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          showCancelButton: true,
          type: 'warning'
        }).then(res => {
          this.disableAdd = false
          this.popupForm = false
        }).catch(() => {})
      } else {
        this.disableAdd = false
        this.popupForm = false
      }
    },
    handleAddSave (row) {
      this.signupList.push(Object.assign({}, row, {
        id: this.unique(),
        showVisible: false,
        isEdit: false
      }))
    },
    handleSave (row) {
      if (!row.isEdit) {
        this.signupList.push(Object.assign({}, row, {
          id: this.unique(),
          showVisible: false, // 展示删除框
          isEdit: false // 编辑
        }))
        this.disableAdd = false
        this.popupForm = false
      } else {
        this.editId = null
        row.isEdit = false
        this.signupList.splice(row.index, 1, row)
      }
    },
    handleEdit (row) { // 编辑报名信息
      for (let i = 0; i < this.signupList.length; i++) {
        this.signupList[i].isEdit = false
      }
      row.isEdit = true
      this.editId = row.id
    },
    handleRemove (index) { // 删除报名信息
      this.signupList.splice(index, 1)
    },
    handleCancelEdit (row) { // 取消编辑报名信息
      this.editId = null
    },
    handleSubmit () {
      this.$store.commit('TEMPORARY_SIGNUP_LIST', this.signupList)
      this.$store.commit('CARD_INFO', this.cardInfo)
      this.$router.push('/apply/t/next')
    }
  }
}
</script>

<style lang="scss" scoped>
.train-form {
  .el-button--small {
    font-size: 12px;
    padding: 0 5px;
  }
}
</style>
