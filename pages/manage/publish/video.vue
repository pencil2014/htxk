<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/publish/article' }">我的发布</el-breadcrumb-item>
      <el-breadcrumb-item>发布视频</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="divider">
        <e-heading grade="1">视频编辑</e-heading>
      </div>
       <el-form ref="form" v-bind="getFormProps({labelWidth:'80px'})" class="form" >
          <el-form-item label="视频:" :rules="[{ required: true, message: '视频不能为空'}]" >
            <div :class="['upvideo-btn',{'active-default':!viewForm}]" >
              <i class="icon iconfont icon-shipin" v-if="!viewForm"></i>
              <!-- <e-file-upload action="/upload/video" 
                :maxfileSize="2048" class="upload-video" 
                v-model="form.path" 
                fileAccept='.mp4' 
                :on-change="changeUpload" 
                :file-list="fileList"
                @success="uplodFileSuc" 
                @update:fileList="removeFile"
                @exception="uplodFileErr"
                >
                  <el-button v-show="!viewForm || showUpdateBtn">上传视频</el-button>
                </e-file-upload> -->
                <videoUpload
                v-show="!viewForm || showUpdateBtn"
                  @changeUpload= "changeUpload"
                  @uploadProgress = "uploadProgress"
                  @uploadSuccess = "uploadSuccess"
                  @uploadError = "uploadError"
                ></videoUpload>
                <div class="uploadFiles" v-if="file">
                  <p class="filebox">{{file.name}} <i class="el-icon-circle-close" v-show="!showProgress" @click="removeFile"></i></p>
                  <el-progress :percentage="percentage" v-show="showProgress"></el-progress>
                </div>
                
            </div>
          </el-form-item>
        <div v-show="viewForm">
          <el-form-item label="预览:" v-if="form.path">
            <video :src="form.path" class="video"  controls="controls">
              您的浏览器不支持视频预览，请使用最新的Chrome或者Firefox浏览器打开。
            </video>
          </el-form-item>
          <el-form-item label="标题:"
            prop="videoName" 
            :rules="[
              { required: true, message: '标题不能为空'},
              { min:8, max:40, message: '标题长度为8-40个字符', trigger: 'blur'}
            ]">
            <el-input v-model.trim="form.videoName"  :maxlength="40" placeholder="请输入标题" style="width:600px"  number-word />
          </el-form-item>
          <el-form-item label="介绍:"
            prop="intro"
            :rules="[
              { required: true, message: '请输入介绍'},
              { min:10, max: 2000, message: '介绍的长度为10-2000个字符', trigger: 'blur'}
            ]">
            <el-input type="textarea" v-model.trim="form.intro" :autosize="{ minRows: 4, maxRows: 6}" :maxlength="2000" placeholder="请输入介绍"></el-input>
          </el-form-item>
          <el-form-item label="分类:"
            prop="cateId"
            :rules="[
              {required: true, message: '请选择分类'}
            ]">
            <el-cascader
              v-model="form.cateId"
              :options="categoryList"
              @active-item-change="handleCateIdChange"
              :props="props"
            ></el-cascader>
          </el-form-item>
         <el-form-item label ="上传封面" 
          :rules="[{required: true, message: '请上传封面'}]" 
          prop="videoCover"
          >
            <e-img-upload @success="handleSuccess" v-model="form.videoCover" :size="1024 * 1024 * 3"  class="club_upload"/>
          </el-form-item>
          <el-form-item label="标签" 
            prop="labels"
            :rules="[
              {required: true, message: '标签不能为空'}
             ]">
             <el-checkbox-group 
              v-model="form.labels"
              :min="1"
              :max="3"
              >
              <el-checkbox 
                :label="item.tagCode" 
                v-for="item in labelList" 
                :key="item.id">{{item.tagName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <div class="action send-video-btn">
            <el-button type="primary" native-type="submit" :loading="loading">发布</el-button>
          </div>
        </div>
      </el-form>
      
      <div class="tips">
        <p>点击上传视频，即表示您已同意 <el-button type='link' @click="dialogVisible = true">《视频上传协议》</el-button>，请勿上传未经授权的他人作品，以及色情，反动等违法视频</p>
        <p>视频大小：不得超过2G</p>
        <p>视频格式：MP4</p>
      </div>
      <!-- 《视频上传协议》 -->
      <el-dialog
        title="协议"
        :visible.sync="dialogVisible"
        size="large">
        <div class="argument">
          <h3>求苗视频上传协议</h3>
          <div class="cnt">
            用户在进行视频上传时勾选“同意上传协议”即表示您与求苗达成协议，完全接受本协议项下全部条款，求苗为深圳华体星空体育文化有限公司注册商标，除本协议另有规定外，任何人未经我公司许可不得以任何形式擅自使用，协议内容如下：<br/>
            1 您承诺对您所上传的视频拥有完整著作权或已获得合法授权，未侵犯任何第三方之合法权益。<br/>
            2 用户需保证其上传节目不得违反国家广播电影电视总局的相关法律规定，包括但不限于《互联网视听节目服务管理规定》（广电总局、信息产业部令第56号）等，其上传节目应当符合法律、行政法规、部门规章的规定，上传节目不得含有以下内容：<br/>
            2.1 反对宪法确定的基本原则的；<br/>
            2.2 危害国家统一、主权和领土完整的；<br/>
            2.3 泄露国家秘密、危害国家安全或者损害国家荣誉和利益的；<br/>
            2.4 煽动民族仇恨、民族歧视，破坏民族团结，或者侵害民族风俗、习惯的；<br/>
            2.5 扰乱社会秩序，破坏社会稳定的；<br/>
            2.6 诱导未成年人违法犯罪和渲染暴力、色情、赌博、恐怖活动的；<br/>
            2.7 侮辱或者诽谤他人，侵害公民个人隐私等他人合法权益的；<br/>
            2.8 危害社会公德，损害民族优秀文化传统的；<br/>
            2.9 有关法律、行政法规和国家规定禁止的其他内容。<br/>
            3 如用户提供的上传节目中含有以上违反政策法律法规的信息或者内容的，由用户直接承担以上导致的一切不利后果，因此给求苗造成不利后果的，用户应负责消除影响，并且赔偿一切损失。同时求苗平台删除您上传的节目,并有权暂停或终止您使用网络服务的权利。<br/>
            4 您将对因您的上传行为导致的纠纷承担全部法律责任。<br/>
            5 您上传的视频在求苗平台发布后，即被视为允许求苗在求苗平台以及求苗其他平台和与求苗合作推广的渠道上使用和推荐该视频,不得要求求苗支付该笔费用。<br/>
            6 求苗有权修改本协议的任何条款，一旦本协议的内容发生变动，求苗将会通过适当方式向您提示修改内容。如果您不同意求苗对本协议相关条款所做的修改，您有权停止使用网络服务。如果您继续使用网络服务，则视为您接受求苗对本协议相关条款所做的修改。<br/>
            7 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。<br/>
            8 本协议自用户钩选“同意上传协议”时立即生效。<br/>
            9 因本协议规定产生纠纷,向深圳华体星空体育文化有限公司所在地法院提起诉讼。<br/>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 提交成功 -->
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogSuccess"
      size="small">
      <span class="success"><i class="iconfont">&#xe91c;</i>发布成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="dialogSuccess = false">留在此页</el-button>
        <el-button @click="goList">去查看</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from 'api/publish'
import {form} from 'utils/mixins'
import ElCascader from '@element-ui/Cascader'
import ElUpload from '@element-ui/Upload'
import ELProgress from '@element-ui/Progress'
// import EFileUpload from '@e-ui/FileUpload'
import EImgUpload from '@e-ui/ImgUpload'
import VideoUpload from '../../components/VideoUpload'
export default {
  mixins: [form],
  layout: 'manage',
  components: {
    ElUpload,
    ElCascader,
    // EFileUpload,
    EImgUpload,
    VideoUpload,
    ELProgress
  },
  methods: {
    // 发布资讯
    submit () {
      this.saveVideoData()
    },
    // 上传视频时
    changeUpload (file) {
      this.showUpdateBtn = false
      this.viewForm = true
      this.showProgress = true
      this.file = file
    },
    // 上传进度
    uploadProgress (percentage) {
      this.percentage = parseInt(percentage * 100, 10)
    },
    // 视频上传成功后
    uploadSuccess (data) {
      this.form.fileId = data.fileId
      this.showUpdateBtn = false
      this.showProgress = false
      this.form.path = data.url
    },
    // 上传失败
    uploadError () {
      this.$message.error('文件上传失败!')
      this.showUpdateBtn = true
      this.file = ''
    },
    // 删除文件
    removeFile () {
      this.$confirm('此操作将删除该视频, 是否继续?', '提示', {type: 'warning'}).then(() => {
        this.showUpdateBtn = true
        this.file = ''
        this.form.path = ''
      }).catch(() => {})
    },
    // 获取资讯数据
    getVideoData () {
      api.videoCategoryF({videoId: this.form.videoId}, {successMsg: 'none'}).then((res) => {
        if (res.data.videoVo) {
          let data = res.data.videoVo
          this.form.videoName = data.videoName
          this.form.intro = data.intro
          if (data.imgUrl.indexOf('_') > -1) {
            let url = data.imgUrl.split('_')
            this.form.videoCover = url[0] + '.' + url[1].split('.')[1]
          } else {
            this.form.videoCover = data.imgUrl
          }
          // this.form.videoCover = data.imgUrl
          this.form.path = data.videoUrl
          this.file = {name: data.videoName, url: data.videoUrl}
          this.form.videoTime = data.playTime
          this.form.videoSize = data.size
          this.form.fileId = data.fileId
          this.form.labels = data.tagIdList.split(',')
          this.viewForm = true
          this.showProgress = false
        }
      })
    },
    // 获取图片相对地址
    getUrlPath (url) {
      let rule = url.indexOf('/f/') > -1 ? '/f/' : '/fv/'
      return url.slice(url.indexOf(rule))
    },
    // 保存资讯数据
    saveVideoData () {
      // 检测视频
      if (!this.form.path) {
        this.$message.error('请上传视频!')
        return
      }
      // 检测封面图片
      if (!this.form.videoCover) {
        this.$message.error('请上传封面图片!')
        return
      }
      // 检测标签个数
      if (this.form.labels.length < 1 || this.form.labels.length > 3) {
        this.$message.error('标签数为1~3个，请重新选择!')
        return
      }
      let path = this.getUrlPath(this.form.path)
      let videoCover = this.getUrlPath(this.form.videoCover).replace('/fv/', '/f/')
      api.videoSave({
        videoName: this.form.videoName,
        intro: this.form.intro,
        path: path,
        cateFirst: 1,
        cateId: this.form.cateId[1],
        videoCover: videoCover,
        videoSize: this.form.videoSize,
        videoTime: this.form.videoTime,
        fileId: this.form.fileId,
        videoId: this.form.videoId,
        labels: this.form.labels.join(',')
      }, {successMsg: 'none'}).then((res) => {
        this.dialogSuccess = true
      })
    },
    // 上传封面
    handleSuccess (url) {
      this.form.videoCover = url
    },
    // 获取下拉框的值
    handleCateIdChange (value) {
      api.videoCategoryS({parentId: value[0]}, {successMsg: 'none'}).then((res) => {
        let child = res.data
        let arr = []
        child.forEach((ele, index) => {
          let val = ele.cateId
          let label = ele.cateName
          arr.push({
            value: val,
            label: label
          })
        })
        this.categoryList.forEach((ele, index) => {
          if (ele.value === value[0]) {
            this.categoryList[index].children = arr
          }
        })
      })
    },
    // 获取选择标签值
    getVideoLabels () {
      api.articleLabels({}, {successMsg: 'none'}).then((res) => {
        this.labelList = res.data.tags
      })
    },
    // 获取视频一级分类
    getVideoCategoryF () {
      api.videoCategoryF({}, {successMsg: 'none'}).then((res) => {
        let arr = []
        res.data.categoryList.forEach((item) => {
          let value = item.cateId
          let label = item.cateName
          let children = []
          arr.push({
            value,
            label,
            children
          })
        })
        this.categoryList = arr
      })
    },
    // 进入视频列表
    goList () {
      this.$router.push('/manage/content/videos')
    }
  },
  data () {
    return {
      showUpdateBtn: false,
      form: {
        videoId: 0,
        cateId: [],
        fileId: 0,
        intro: '',
        labels: [],
        path: '',
        videoCover: '',
        videoName: '',
        videoSize: 0,
        videoTime: ''
      },
      labelList: [],
      categoryList: [],
      props: {
        value: 'value',
        children: 'children'
      },
      file: '',
      percentage: 0,
      showProgress: true,
      viewForm: false,
      dialogVisible: false,
      loading: false,
      dialogSuccess: false
    }
  },
  mounted () {
    // 获取标签
    this.getVideoLabels()
    // 获取分类
    this.getVideoCategoryF()
    // 获取编辑内容
    if (this.$route.query.videoId) {
      this.form.videoId = this.$route.query.videoId
      this.getVideoData()
    }
  }
}
</script>
<style lang="scss" scoped>
 
  .active-default{
      padding: 185px 0 185px;
      margin-top: 0 !important;
      text-align: center;
  }
 .upvideo-btn{
    margin-top: -40px;
    .iconfont{
      font-size: 82px;
      color: #ccc;
    }
    .el-button{
      margin-top: 30px;
      background: #24c881;
      color: #fff;
      border: none;
      padding: 12px 20px;
    }
 }
 .form {
    padding:20px 0 ;
    .uploadFiles {
      margin-top: 40px;
      width: 600px;
      .filebox {
        background-color: #f5f7fa;
        padding: 0 10px;
        position: relative;
        i {
          position: absolute;
          color: #ccc;
          cursor: pointer;
          top: 10px;
          right: 10px;
        }
        &:hover{
          color: #409eff;
          
          i {
            color: #409eff;
          }
        }
      }
    }
    .video {
      width: 600px;
      margin-top: 15px;
      max-height: 400px;
    }
    .photo {
      display: inline-block;
      height: 90px;
      vertical-align: top;
      position: relative;
      margin-right: 15px;
      img {
        max-width: 160px;
        height: 90px;
        vertical-align: middle;
        opacity: 0.8;
      }
      i {
        position: absolute;
        right: -5px;
        top: -15px;
        color: $color-primary;
        font-size: 18px;
        cursor: pointer;
        &:hover {
          color: #1fb775;
        }
      }
    }
    .el-checkbox {
      min-width: 110px;
    }
  }
  .img-box {
    padding-top: 5px;
    img {
      max-height: 90px;
      max-width: 160px;
      margin: 0 5px 5px 0;
    }
  }
  .action {
    text-align: left;
    margin: 10px 0 40px 80px;
  }
  button.el-button--large{
    padding: 12px 35px;
  }
  .tips {
    color: $color-sub;
    font-size: 12px;
    border-top:1px solid $border-color-base;
    padding-top: 10px;
    margin-top: 30px;
    vertical-align: middle;
    button {
      vertical-align: middle;
    }
  }
  .argument {
    font-size: 12px;
    h3 {
      text-align: center;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .cnt {
      max-height: 400px;
      overflow-y: scroll;
      line-height: 1.5rem;
      p {
        padding-bottom: 10px;
      }
    }
  }
  .success {
    display: block;
    text-align: center;
    font-size: 16px;
    i {
      font-size: 40px;
      color: $color-primary;
      margin-right: 5px;
       vertical-align: middle;
    }
  }
  .warning {
    i {
      color: $color-warning;
    }
  }
</style>