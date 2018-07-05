<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods', query: {goodsCategoryCode: 'V11'}}">赛事购买</el-breadcrumb-item>
      <el-breadcrumb-item>{{setTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content" v-loading="loading">
      <e-heading grade="1">{{setTitle}} <span v-if="clubList.length" style="font-size:12px;color:#333;font-weight:normal;">我创建的俱乐部</span></e-heading>
      <!--创建俱乐部-->
      <div class="create_club" v-if="!clubList.length">
        <el-form v-bind="getFormProps()" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="俱乐部名称："
          prop="name"
          :rules="[
          { required: true,  message: '请填写真是俱乐部名称'},
          { min: 4,  max: 20, message: '俱乐部名称长度在4-20个字符', trigger: 'blur'}
          ]">
              <el-input v-model="form.name" placeholder="请输入俱乐部名称" :maxlength="20" number-word/>
          </el-form-item>
          <el-form-item label="俱乐部头像："
          prop="imageUrl"
          style="margin-bottom:10px;">
            <e-img-upload @success="handleSuccess" v-model="form.imageUrl" :size="1024 * 1024 * 3" class="club_upload"/>
            <div class="el-upload__tip">
              请上传一张图片作为俱乐部头像<br>
              只能上传jpg/png文件，且不超过3M
            </div>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="isAgree">同意《<router-link to="/apply/agreement?stuta=service" class="link" target="_blank">组织服务协议</router-link>》</el-checkbox>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" :disabled="!isAgree" @click="handleSubmit()" :loading="btnloading">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--选择俱乐部-->
      <div class="select_club" v-else>
        <el-radio-group v-model="clubSelect" class="club_radio">
          <el-row>
            <el-col :span="8" v-for="item in clubList" :key="item.orgUserId" class="club_lsitcint"><el-radio :label="item.orgUserId"><e-img :src="item.iconUrl" class="club_pic"/>{{item.groupName}}</el-radio></el-col>
          </el-row>
        </el-radio-group>
        <div class="sub_btn">
           <el-button type="primary" @click="handleSelectSubmit()" :loading="btnloading">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import applyApi from 'api/apply'
import {form} from 'utils/mixins'
import EImgUpload from '@e-ui/ImgUpload'
export default {
  mixins: [form],
  components: {
    EImgUpload
  },
  beforeCreate () {
    applyApi.applyApi({
      pageNum: 1,
      pageSize: 1000
    }).then((res) => {
      this.clubList = res.data.list
      let scope = this
      setTimeout(function () {
        scope.loading = false
      }, 300)
    })
  },
  computed: {
    setTitle: function () {
      return this.clubList.length ? '选择俱乐部' : '创建俱乐部'
    }
  },
  data () {
    let checkImg = (rule, value, callback) => {
      if (this.form.imageUrl === '') {
        callback(new Error('请上传俱乐部头像'))
      } else {
        callback()
      }
    }
    return {
      isAgree: false,
      loading: true,
      btnloading: false,
      clubSelect: '',
      clubList: [],
      rules: {
        imageUrl: [
          {required: true, message: '请上传俱乐部头像'},
          {validator: checkImg, trigger: 'blur'}
        ]
      },
      form: {
        name: '',
        imageUrl: ''
      }
    }
  },
  methods: {
    handleSubmit () { // 创建俱乐部
      this.$refs['form'].validate((valid) => {
        if (valid) {
          applyApi.createClub({
            groupName: this.form.name,
            groupLogo: this.form.imageUrl,
            orderNumber: this.$route.query.orderNumber
          }, {
            context: this,
            successMsg: '创建俱乐部成功！'
          }).then((res) => {
            let scope = this
            setTimeout(function () {
              scope.linkPage(res.data.free)
            }, 2000)
          })
        } else {
          return false
        }
      })
    },
    handleSelectSubmit () { // 选择俱乐部并提交
      applyApi.selectClub({
        orgUserId: this.clubSelect,
        orderNumber: this.$route.query.orderNumber
      }, {context: this}).then((res) => {
        this.linkPage(res.data.free)
      })
    },
    linkPage (free) {
      let toUrl = free ? '/order/success' : '/order/created'
      this.$router.push({
        path: toUrl,
        query: {
          orderNumber: this.$route.query.orderNumber
        }
      })
    },
    handleSuccess (url) { // 上传头像
      this.form.imageUrl = url
    }
  }
}
</script>

<style lang="scss">
.create_club{
  width:55%;
  .club_upload{
    position: relative;
    width:135px;
    height:135px;
    margin:10px 0;
  }
  .el-upload__tip{
    position: absolute;
    top:45px;
    left:160px;
    line-height: 22px;
  }
}
.select_club{
  padding-top:30px;
  .club_radio{
    width:100%;
    .club_lsitcint{
      margin-bottom: 35px;
    }
  }
  .club_pic{
    width:50px;
    height:50px;
    border-radius: 50%;
    margin-right:15px;
  }
  .sub_btn{
    margin:100px 0;
    text-align: center;
  }
}
</style>
