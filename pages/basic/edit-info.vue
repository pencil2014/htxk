<template>
  <div>
    <!-- <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item  :to="{ path: '/manage/activity' }" >个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>编辑资料</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class='edit-user-info  content'  >
      <e-heading grade="1">编辑资料</e-heading>
      <div class="divider"></div>
      <e-cellbox  class='head'>
        <e-cell-item  class='head-img' >
          <div class='img' :style="{backgroundImage:`url(${imageUrl || defaultHead})`}"></div>
        </e-cell-item>
        <e-cell-item class='set-head-img' >
          <!-- <e-img-upload @success="handleSuccess"  :size='1024 * 1024 * 10'  action='/manage/personal/update/icon'  >
            <el-button type="link">设置头像</el-button>
          </img-upload> -->
          <!-- <cropper 
            text="设置头像"
            url="/manage/personal/update/icon"
            :width="300"
            :height="300"
            @cropSuccess="cropSuccess"
            @cropFail="cropFail"
          ></cropper> -->
          <el-button type="link" @click="dialogCoupon=true">设置头像</el-button>
          <div class="weak">头像大小不超过5M</div>
        </e-cell-item>
      </e-cellbox>

      <el-form  label-position="right"   ref="form"  :rules="rules"  :model="form" 
       v-bind="getFormProps({labelWidth:'112px'})"
      >


        <el-form-item label="用户昵称：" 
          prop="nickName">
          <el-input 
          v-model="form.nickName" 
          :disabled="authType === 2 && (authStatus === 1 || authStatus === 3)"
          placeholder="取个好听的名字吧~"></el-input>
        </el-form-item>

        <!-- 
          userInfo:
          authType // 用户类型 1个人 2组织'   ——————  认证组织IP,不能修改昵称
          authStatus // 审核状态：0：未认证；1：已认证；

          ipAuthApplyVO：
          authStatus // 审核状态：1：认证中；2：未通过；3：已通过；4：未认证 ,
         -->
        <el-form-item label="认证类型：">
          <img  v-if="authStatus === 3 && pcImgTxtUrl" :src='pcImgTxtUrl' alt="认证类型图标加载失败~"/>
          <div v-else-if="authStatus === 1"  >
            <span class="not-auth-text">认证中</span>
          </div>
          <div v-else  >
            <span class="not-auth-text">未认证</span>
            <!-- <direct class="link-color" :handleText="'去认证'" /> -->
            <nuxt-link to="/attestation/user">去认证</nuxt-link>
          </div>
        </el-form-item>


        <el-form-item label="个性签名：" 
          prop="signature"
       >
          <el-input :maxlength='22'  v-model="form.signature" placeholder="设置个性签名吧~" number-word />
        </el-form-item>

        <el-form-item label="联系邮箱：" 
          prop="contactWayEmail"
        >
          <el-input v-model="form.contactWayEmail" placeholder="来绑定邮箱吧"></el-input>
        </el-form-item>

        <el-form-item
          label="所在地："
          prop="city"
          :rules="[
            {required: false, message: '所在地不能为空'}
          ]"
        >
          <e-address-cascader v-model="address"/>
        </el-form-item>

        <div class="auth-type" v-if='authType === 1'>
          <div class="divider "></div>
          <div class='personal-title'>个人身份资料</div>

          <el-form-item label="性别："
            prop="sex"
            :rules="[
              {required: false, message: '请选择性别'}
            ]">
            <el-radio-group v-model="form.sex">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="年龄："
            prop="userAge">
            <el-input v-model="form.userAge" placeholder="年龄范围为 0~99"></el-input>
            周岁
          </el-form-item>

          <el-form-item label="身高："
            prop="height"
          >
            <el-input v-model="form.height" placeholder="身高范围为 120~250"></el-input>
            厘米
          </el-form-item>

          <el-form-item label="体重："
            prop="weight"
          >
            <el-input v-model="form.weight" placeholder="体重范围为 40~250"></el-input>
            公斤
          </el-form-item>
        </div>
        <el-form-item class="sub-btn" label-width="0px">
          <el-button type="primary"  native-type="submit" :loading="loading"  >保存修改</el-button>
          <!-- <el-button native-type="reset" >取消-重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 提交成功 -->
    <el-dialog
      title="头像设置"
      :visible.sync="dialogCoupon"
      size="large">
      <cropper ref="cropper" @uploadSucess="handleSuccess" />
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="uploadCropper">确认</el-button>
        <el-button @click="cancleCropper">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from 'api/user'
import {form} from 'utils/mixins'
import EAddressCascader from '@e-ui/AddressCascader'
import ElUpload from '@element-ui/Upload'
import EImgUpload from '@e-ui/ImgUpload'
import Direct from 'components/Direct'
import validator from '@/utils/validator'
import Cropper from '../components/cropper'
export default {
  mixins: [form],
  layout: 'manage',
  components: {
    EAddressCascader,
    ElUpload,
    EImgUpload,
    Direct,
    Cropper
  },
  computed: {
    address: {
      get () {
        return this.form.province ? [this.form.province, this.form.city, this.form.area] : []
      },
      set (value) {
        // 选地区后，会执行这里
        this.form.province = value[0]
        this.form.city = value[1]
        this.form.area = value[2] || ''
      }
    }
  },
  data () {
    var checkNickName = (rule, value, callback) => {
      // userInfo:
      // authType // 用户类型 1个人 2组织'   ——————  认证组织IP,不能修改昵称
      // authStatus // 审核状态：0：未认证；1：已认证；

      // ipAuthApplyVO：
      // authStatus // 审核状态：1：认证中；2：未通过；3：已通过；4：未认证 ,  // ''
      if (this.authType === 2 && (this.authStatus === 1 || this.authStatus === 3)) { // 不可以改的那些，不验证了, 以免以前的老数据有问题
        return callback()
      }
      if (value === '') { // 不可空
        callback(new Error('请输入用户昵称'))
      }
      if (value.match(validator.pattern.nickname)) {
        callback()
      } else {
        callback(new Error('昵称长4 ~ 20 个字符，由汉字、字母、数字、“_”、“、”、“.”组成')) // 请使用中英文、数字、下划线命名
      }
    }
    var checkContactWayEmail = (rule, value, callback) => {
      if (value === '') { // 可以为空
        return callback()
      }
      if (value.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ig)) {
        callback()
      } else {
        callback(new Error('请正确的输入邮箱'))
      }
    }
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value.toString().match(/^[0-9]+$/)) { // 保证进来的全是数字
        if (value < 0 || value > 99) {
          callback(new Error('允许的年龄范围为0~99'))
        } else {
          callback()
        }
      } else {
        callback(new Error('年龄请输入0~99之间的整数'))
      }
    }
    var checkHeight = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value.toString().match(/^[0-9]+$/)) { // 保证进来的全是数字
        if (value < 120 || value > 250) {
          callback(new Error('允许的身高范围为120~250'))
        } else {
          callback()
        }
      } else {
        callback(new Error('身高请输入120~250之间的整数'))
      }
    }
    var checkWeight = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value.toString().match(/^[0-9]+$/)) {
        if (value < 40 || value > 250) {
          callback(new Error('允许的体重范围为40~250'))
        } else {
          callback()
        }
      } else {
        callback(new Error('体重请输入40~250之间的整数'))
      }
    }
    return {
      loading: false, // 必需要返回loading
      form: {
        nickName: '',
        signature: '',
        contactWayEmail: '',
        address: '',
        province: '',
        city: '',
        area: '',
        sex: '', // 男1，女2， 3保密 个人主页中看
        userAge: '',
        height: '',
        weight: ''
      },
      rules: {
        nickName: [
          { validator: checkNickName, trigger: 'blur' }
        ],
        signature: [
          {required: false, message: '个性签名不能为空'},
          {min: 0, max: 22, message: '个性签名（22 个字符以内）'}
        ],
        contactWayEmail: [
          { validator: checkContactWayEmail, trigger: 'blur' }
        ],
        userAge: [
          { validator: checkAge, trigger: 'blur' }
        ],
        height: [
          { validator: checkHeight, trigger: 'blur' }
        ],
        weight: [
          { validator: checkWeight, trigger: 'blur' }
        ]
      },
      defaultHead: '/images/default_photo.jpg',
      imageUrl: '',
      pcImgTxtUrl: '',
      authType: '', // 用户类型 1个人 2组织'
      authStatus: '',
      dialogCoupon: false,
      fileCropper: ''
    }
  },
  mounted () {
    api.getEditUserInfo()
      .then((res) => {
        if (res) {
          let userInfoExt = res.data.userInfoExt
          let userInfo = res.data.userInfo
          this.form = {
            nickName: userInfo.nickName || '',
            signature: userInfo.sign || '',
            contactWayEmail: userInfo.contactWayEmail || '',
            province: userInfoExt.areaProv || '',
            city: userInfoExt.areaCity || '',
            area: userInfoExt.areaDist || '',
            sex: (userInfo.sex || '').toString(),
            userAge: userInfoExt.userAge === -1 ? '' : userInfoExt.userAge,
            height: userInfoExt.height === -1 ? '' : userInfoExt.height,
            weight: userInfoExt.weight === -1 ? '' : userInfoExt.weight
          }
          this.imageUrl = userInfo.iconUrl // 用户头像
          this.pcImgTxtUrl = res.data.personalUserVO.ipAuthCate ? res.data.personalUserVO.ipAuthCate.pcImgTxtUrl : '' // 认证图标
          this.authType = userInfo.authType // 用户类型 1个人 2组织'   ——————  认证组织IP,不能修改昵称
          // this.authStatus = userInfo.authStatus // 替补的判断状态，审核状态：0：未认证；1：已认证 ,
          this.authStatus = res.data.ipAuthApplyVO.authStatus // 审核状态：1：认证中；2：未通过；3：已通过；4：未认证 ,
        }
      })
  },
  methods: {
    submit () {
      let sendData = JSON.parse(JSON.stringify(this.form))
      if (sendData.userAge === '') {
        sendData.userAge = -1
      }
      if (sendData.height === '') {
        sendData.height = -1
      }
      if (sendData.weight === '') {
        sendData.weight = -1
      }
      api.updateUserInfo(sendData, {context: this})
        .then(() => {
          this.$store.dispatch('user/getUserInfo') // 更新头部的个人信息
          this.$store.dispatch('user/user_all_info') // 更新个人中心的个人信息
        })
    },
    handleSuccess (url) {
      this.imageUrl = url
      this.$store.dispatch('user/getUserInfo') // 更新头部的个人信息
      this.$store.dispatch('user/user_all_info') // 更新个人中心的个人信息
      this.dialogCoupon = false
    },
    uploadCropper (res) {
      this.$refs.cropper.uploadCropper()
      // if (res.result === '0') {
      //   this.imageUrl = res.data.url
      //   this.$store.dispatch('user/getUserInfo') // 更新头部的个人信息
      //   this.$store.dispatch('user/user_all_info') // 更新个人中心的个人信息
      // } else {
      //   this.$message.error('头像设置失败请重试!')
      // }
    },
    cancleCropper () {
      this.dialogCoupon = false
      this.$refs.cropper.resetCropper()
      // this.$message.error('头像设置失败请重试!')
    }
  }
}
</script>

<style lang="scss" scoped>
  
  .edit-user-info{
    .link-color{
      color:$color-link;
    }
    .head{
      margin:30px 0 60px;
    }
    .head-img{
      height:80px;
      width:120px;
      .img{
        height:80px;
        width:80px;
        overflow:hidden;
        border-radius:100%;
        background-repeat: no-repeat;
        background-position:center center;
        background-size: cover;
      }
    }
    .set-head-img {
      vertical-align:middle;
      span{
        color:$color-sub;
      }
    }
    .auth-type{
      padding-top:46px;
      position: relative;
    }
    .divider{
      margin-bottom: 60px;
    }
    .personal-title{
      font-size:16px;
      height: 16px;
      line-height: 16px;
      position:absolute;
      background:#fff;
      width:120px;
      top: 38px;
    }
    .not-auth-text{
      margin-right:40px;
    }
    .sub-btn{
      padding-top:14px;
    }
  }
</style>

<style lang="scss">
  
  .edit-user-info{
    .el-form-item {
      margin-bottom: 34px;
    }
    .el-form-item__label {
      padding-right: 30px;
    }
    .auth-type{
      .el-form-item__content>.el-input{
        width: 160px;
      }
    }
  }
</style>
