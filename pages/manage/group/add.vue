<template>
  <div class="group-box">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/group/' }">我的组织</el-breadcrumb-item>
      <el-breadcrumb-item>创建组织</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面内容 -->
    <div class="group-cnt">
      <div class="header">
        <h3>填写组织信息</h3>
      </div>

      <!-- 创建组织 -->
      <el-form ref="form" :model="form" label-width="120px" class="form">
        <el-form-item label="上传头像">
         <el-upload
            class="avatar-uploader"
            action="http://dev.oooseed.com/api/manage/personal/update/icon"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="组织名称"
          prop="name"
          :rules="[{required: true, message: '请输入组织名称'}]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="加入组织方式"
          prop="region"
          :rules="[{required: true, message: '请选择加入组织方式'}]"
        >
          <el-select v-model="form.region" placeholder="请选择加入组织方式">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-checkbox v-model="form.isAgree">
          同意<router-link to="/manage/group/agreement" class="link" target="_blank">《组织服务协议》</router-link>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
         
    </div>
  </div>
</template>
<script>
// import api from 'api/group'
import {form} from 'utils/mixins'
import ElUpload from '@element-ui/Upload'
export default {
  mixins: [form],
  layout: 'manage',
  components: {
    ElUpload
  },
  methods: {
    handleAvatarSuccess (res, file) {
      // console.log(res, file)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // api.updateUserInfo(
          //   this.form
          // )
        } else {
          // this.$message.warning('error submit!!')
          return false
        }
      })
    }
  },
  computed: {
    // 列表数据
    groupList () {
      let group = (this.activeName === '0') ? this.joinGroupList : this.creatGroupList
      return group
    },
    // 加载更多按钮文字
    btnText  () {
      return this.loading === true ? '数据加载中' : '加载更多'
    }
  },
  data () {
    return {
      form: {
        name: '',
        region: '',
        isAgree: true
      },
      imageUrl: ''
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
  
  .group-cnt {
    padding: 15px;
    .header {
      font-size: 16px;
      text-align: center;
      height: 60px;
      border-bottom: 1px solid #f2f2f2;
      vertical-align: middle;
      position: relative;
      margin-bottom: 10px;
      h3 {
        line-height: 60px;
      }
      .alink {
        position: absolute;
        right: 0; 
        top: 15px;
        i {
          font-size: 12px;
        }
      }
    }
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>