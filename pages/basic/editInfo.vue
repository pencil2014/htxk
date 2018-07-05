<template>
  <div class='edit-user-info'  >
    <heading grade="1">编辑资料</heading>
      <cellbox  class='head'>
        <cell-item  class='head-img' >
          <div class='img' :style="{backgroundImage:`url(${imageUrl || defaultHead})`}"></div>
        </cell-item>
        <cell-item class='set-head-img' >

          <el-upload
            class="upload-demo"
            action="http://dev.oooseed.com/api/manage/personal/update/icon"
            :show-file-list='false'
            :before-upload="beforeAvatarUpload"
            :on-success='imgUploadAuccess'
            >
            <el-button size="small" type="primary">设置头像</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
          </el-upload>

        </cell-item>
      </cellbox>

      <el-form  label-position="right"  ref="form" :model="form" label-width="95px">
        <el-form-item label="用户昵称："
          prop="nickName"
          :rules="[
            {required: true, message: '请输入用户昵称'},
            {min: 1, max:38, message: '昵称（1 ~ 38 个字符）'}
          ]"
        >
          <!-- 不知道哪里允许的38个字符 -->
          <el-input v-model="form.nickName" placeholder="取个好听的名字吧~"></el-input>
        </el-form-item>
        <el-form-item label="认证类型：">
          <img v-if="pcImgTxtUrl" :src='pcImgTxtUrl' alt="认证后得到的图片"/>
          <div v-else>
            <span>未认证</span>
            <el-button>去认证</el-button>
          </div>
        </el-form-item>
        <el-form-item label="个性签名：" 
          prop="signature"
          :rules="[
            {required: true, message: '个性签名不能为空'},
            {min: 1, max: 40, message: '个性签名（1 ~ 40 个字符）'}
          ]" >
          <x-input :maxlength='40'  v-model="form.signature" placeholder="设置个性签名吧~"></x-input>
        </el-form-item>

        <el-form-item label="联系邮箱：" 
          prop="email"
        >
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item
          label="所在地："
          prop="city"
          :rules="[
            {required: false, message: '所在地不能为空'}
          ]"
        >
          <address-cascader v-model="address"/>
        </el-form-item>

        <div v-if='authType === 1'>
          <div class='personal-title'>个人身份资料</div>
          <div class="divider"></div>
          <el-form-item label="性别："
            prop="sex"
            :rules="[
              {required: false, message: '请选择性别'}
            ]">
            <el-radio-group v-model="form.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="年龄："
            prop="userAge"
            :rules="[
              {required: false, message: '年龄不能为空'},
              {type: 'number', message: '年龄必须为数字值'},
              {min: 0, max: 99, type: 'number', message: '年龄范围 0~99'}
            ]"
          >
            <el-input v-model.number="form.userAge" placeholder="年龄范围为 0~99"></el-input>
            周岁
          </el-form-item>

          <el-form-item label="身高："
            prop="height"
            :rules="[
              {required: false, message: '身高不能为空'},
              {type: 'number', message: '身高必须为数字值'},
              {min: 120, max: 250, type: 'number', message: '身高范围 120~250'}
            ]"
          >
            <el-input v-model.number="form.height" placeholder="身高范围为 120~250"></el-input>
            厘米
          </el-form-item>
          <el-form-item label="体重："
            prop="weight"
            :rules="[
              {required: false, message: '体重不能为空'},
              {type: 'number', message: '体重必须为数字值'},
              {min: 40, max: 250, type: 'number', message: '体重范围 40~250'}
            ]"
          >
            <el-input v-model.number="form.weight" placeholder="体重范围为 40~250"></el-input>
            公斤
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="onSubmit()">提交修改</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>

  </div>
</template>

<script>
import api from 'api/user'
import {form} from 'utils/mixins'
import AddressCascader from '@/pages/components/AddressCascader'
import defaultHead from 'static/images/default_photo.jpg'
import ElUpload from 'element/Upload'
import XInput from 'components/XInput'

export default {
  mixins: [form],
  layout: 'manage',
  components: {AddressCascader, ElUpload, XInput},
  computed: {
    address: {
      // get () {
      //   return this.form.prov ? [this.form.prov, this.form.city, this.form.dist] : []
      // },
      // set (value) {
      //   this.form.prov = value[0]
      //   this.form.city = value[1]
      //   this.form.dist = value[2]
      // }
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
    return {
      form: {
        nickName: '',
        signature: '',
        email: '',
        address: '',
        province: '',
        city: '',
        area: '',
        sex: '', // 0男 1女
        userAge: '',
        height: '',
        weight: ''
      },
      defaultHead: defaultHead,
      imageUrl: '',
      pcImgTxtUrl: '',
      authType: '' // 用户类型 1个人 2组织'
    }
  },
  mounted () {
    api.getEditUserInfo()
      .then((res) => {
        if (res) {
          let userInfoExt = res.data.userInfoExt
          let userInfo = res.data.userInfo
          this.form = {
            nickName: userInfo.nickName,
            signature: userInfo.sign,
            email: userInfo.email,
            province: userInfoExt.areaProv,
            city: userInfoExt.areaCity,
            area: userInfoExt.areaDist,
            sex: userInfo.sex.toString(),
            userAge: userInfoExt.userAge,
            height: userInfoExt.height,
            weight: userInfoExt.weight
          }
          this.imageUrl = userInfo.iconUrl // 用户头像
          this.pcImgTxtUrl = res.data.personalUserVO.ipAuthCate.pcImgTxtUrl // 认证图标
          this.authType = userInfo.authType // 用户类型 1个人 2组织'
        }
      })
  },
  methods: {
    onSubmit () {
      console.log('this.form', this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          api.updateUserInfo(
            this.form
          )
        } else {
          // this.$message.warning('error submit!!')
          return false
        }
      })
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JP(E)G / PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    imgUploadAuccess (response, file, fileList) {
      if (response.result === '0') {
        this.imageUrl = response.data.iconFileUrl
      } else {
        this.$message.error(response.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/styles/var';
  .edit-user-info{
    padding:60px;
    .head{
      margin-bottom:38px;
    }
    .head-img{
      height:100px;
      width:120px;
      .img{
        height:100px;
        width:100px;
        overflow:hidden;
        border-radius:100%;
        background-repeat: no-repeat;
        background-position:center center;
        background-size: cover;
      }

    }
    .set-head-img {
      vertical-align:middle;
    }
    .personal-title{
      position:relative;
      background:#fff;
      width:100px;
      bottom: -10px;
      font-weight:600;
    }
    
  }
</style>

<style lang="scss">
  @import '~assets/styles/var';
</style>
