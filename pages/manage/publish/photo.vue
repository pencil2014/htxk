<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/publish/article' }">我的发布</el-breadcrumb-item>
      <el-breadcrumb-item>发布组图</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="divider">
        <e-heading grade="1">组图编辑</e-heading>
      </div>
      <el-form ref="form" v-bind="getFormProps({labelWidth:'80px'})" class="form">
        <el-form-item label="标题" 
          prop="title" 
          :rules="[
            { required: true, message: '标题不能为空', trigger: 'blur'},
            { min:8, max:30, message: '标题长度为8-30个字符', trigger: 'blur'}
           ]">
           <el-input v-model.trim="form.title"  :maxlength="30" placeholder="请输入标题" style="width:600px"  number-word />
        </el-form-item>
        <el-form-item label="图片"
          :rules="[{ required: true, message: '图片不能为空'}]"
        >
          <div class="img-box img-scroll">
            <img-group-mark  v-model="matchImagesList" class="uploadimg" :width="230" :height="300">
              <template slot-scope="scope">
                 <el-input type="textarea" :minlength="5" :maxlength="120" v-model.trim="scope.item.text"  placeholder="请输入字图注" ></el-input>
              </template>
            </img-group-mark> 
          </div>
        </el-form-item>
        <el-form-item label="封面"
          :rules="[{required: true, message: '请选择封面'}]"
          >
            <!-- <span class="photo" v-for="(item, index) in coverArr" :key="index">
              <img :src="item.src" alt="">
              <i class="iconfont" @click="deleteImg(index)">&#xe754;</i>
            </span>
            <span class="plusBtn" @click="showDialogCover" v-show="coverArr.length < 3"><i class="el-icon-plus"></i></span> -->
            <e-img-group-upload v-model="coverArr" @add="showDialogCover"/>
        </el-form-item>
        <el-form-item label="分类"
            prop="cateId"
            :rules="[
              {required: true, message: '请选择分类'}
            ]">
            <el-select v-model="form.cateId" placeholder="请选择分类" >
                <el-option
                  v-for="item in categoryList"
                  :key="item.cateId"
                  :label="item.cateName"
                  :value="item.cateId">
                </el-option>
            </el-select>
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
          <div class="divider"></div>
          <div class="action">
          <el-button  type="primary"  native-type="submit" :loading="loading">发布</el-button>
          <el-button @click="showTime">定时发布</el-button>
          <el-button @click="showDraft">存草稿</el-button>
          <el-button @click="showView">预览</el-button>
      </div>
      </el-form>
      
      <!-- 选择封面 -->
        <el-dialog 
          title="选择封面"
          :visible.sync="dialogCover"
          size="large">
          <span class="weak mt">请从正文使用过的图片中选择封面(最多只能选3张图片)</span>
          <div class="img-box">
             <img v-for="(item, index) in matchImagesList" :src="item.src" alt="" @click="setCover(item.src)" :class="{'active': selectImgArr.includes(item.src)}" :key="index">
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancleCover">取 消</el-button>
            <el-button type="primary" @click="selectCover">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 提交成功 -->
        <el-dialog
          title="温馨提示"
          :visible.sync="dialogSuccess"
          size="small">
          <span class="success"><i class="iconfont">&#xe91c;</i>保存成功！</span>
          <span slot="footer" class="dialog-footer">
            <el-button  type="primary" @click="dialogSuccess = false">留在此页</el-button>
            <el-button @click="goList">去查看</el-button>
          </span>
        </el-dialog>
        <!-- 定时发布 -->
        <el-dialog
          title="选择时间"
          :visible.sync="dialogTime"
          size="tiny">
          选择发布时间：
          <el-date-picker
            v-model="value1"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions0"
            placeholder="选择日期时间">
          </el-date-picker>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancleTime">取 消</el-button>
            <el-button type="primary" @click="saveTime">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 预览 -->
        <el-dialog
          title="预览"
          :visible.sync="dialogView"
          size="small">
          <div class="views">
            <el-carousel :interval="5000" arrow="always" indicator-position="none" :autoplay="false">
              <el-carousel-item v-for="(item, index) in matchImagesList" :key="index" >
                <img :src="item.src" alt="">
                <h3>{{ item.text }}</h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-dialog>
    </div>
  </div> 
</template>
<script>
import api from 'api/publish'
import {form} from 'utils/mixins'
import ElDatePicker from '@element-ui/DatePicker'
import EImgGroupUpload from '@e-ui/ImgGroupUpload'
import ImgGroupMark from '../../components/ImgGroupMark'
export default {
  mixins: [form],
  layout: 'manage',
  components: {
    ElDatePicker,
    EImgGroupUpload,
    ImgGroupMark
  },
  methods: {
    // 发布资讯
    submit () {
      this.form.publishStatus = 1
      this.savePhotoData()
    },
    // 获取资讯类别
    getArticleCategory () {
      api.articleCategory({}, {successMsg: 'none'}).then((res) => {
        this.categoryList = res.data
      })
    },
    // 获取资讯标签
    getArticleLabels () {
      api.articleLabels({}, {successMsg: 'none'}).then((res) => {
        this.labelList = res.data.tags
      })
    },
    // 获取资讯数据
    getArticleData () {
      api.photoData({articleId: this.form.articleId}, {successMsg: 'none'}).then((res) => {
        if (res.data.articleVo) {
          let data = res.data.articleVo
          this.form.title = data.title
          this.form.cateId = data.cateId
          this.coverArr = data.coverUrl
          this.form.labels = data.tagCodeArray.split(',')
          this.matchImagesList = JSON.parse(data.content).map((item) => {
            return {src: item.imgUrl, text: item.content}
          })
        }
      })
    },
    // 保存资讯数据
    savePhotoData () {
      if (this.matchImagesList.length < 3) {
        this.$message.error('请至少上传3张图片!')
        return
      }
      for (let i of this.matchImagesList) {
        if (!i.text || i.text.length < 5 || i.text.length > 120) {
          this.$message.error('请为每张图片添加5-120字的图注!')
          return
        }
      }
      if (!this.coverArr.length) {
        this.$message.error('请选择封面图片!')
        return
      }
      if (this.coverArr.length !== 1 && this.coverArr.length !== 3) {
        this.$message.error('封面图片为1张或者3张!')
        return
      }
      if (this.form.labels.length < 1 || this.form.labels.length > 3) {
        this.$message.error('标签数为1~3个，请重新选择!')
        return
      }
      // 获取图片相对地址
      let imgUrl = this.coverArr.map((value) => {
        return value.slice(value.indexOf('/f/'))
      })
      // 获取组图内容
      let content = this.matchImagesList.map((item) => {
        let url = item.src.slice(item.src.indexOf('/f/'))
        let text = item.text
        return `{"${url}":"${text}"}`
      })
      api.photoSave({
        articleId: this.form.articleId,
        cateId: this.form.cateId,
        content: '[' + content.join(',') + ']',
        covers: ',' + imgUrl.join(','),
        labels: this.form.labels.join(','),
        plainpublishtime: this.value1,
        publishStatus: this.form.publishStatus,
        title: this.form.title
      }, {successMsg: 'none'}).then((res) => {
        this.dialogSuccess = true
      })
    },
    // 显示封面
    showDialogCover () {
      if (this.matchImagesList.length) {
        this.selectImgArr = [...this.coverArr]
        this.dialogCover = true
      } else {
        this.$message.error('请先上传图片才能选择封面!')
      }
    },
    // 删除封面
    deleteImg (index) {
      this.coverArr.splice(index, 1)
    },
    // 选择封面
    setCover (item) {
      if (!this.selectImgArr.includes(item)) {
        if (this.selectImgArr.length < 3) {
          this.selectImgArr.push(item)
        } else {
          this.$message.error('最多只能选3张封面图片!')
        }
      } else {
        this.selectImgArr = this.selectImgArr.filter(ele => {
          return ele !== item
        })
      }
    },
    cancleCover () {
      this.selectImgArr = []
      this.dialogCover = false
    },
    selectCover () {
      this.coverArr = this.selectImgArr
      this.dialogCover = false
    },
    // 定时弹框
    showTime () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogTime = true
          this.value1 = new Date(new Date().getTime() + 5 * 60 * 1000)
        }
      })
    },
    cancleTime () {
      this.value1 = ''
      this.dialogTime = false
    },
    saveTime () {
      if (this.value1 < new Date(new Date().getTime() + 60 * 1000)) {
        this.$message.error('定时发布时间不能小于1分钟！')
        return
      }
      this.dialogTime = false
      this.submit()
    },
    // 存草稿
    showDraft () {
      this.form.publishStatus = 3
      this.savePhotoData()
    },
    // 预览
    showView () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.dialogView = true
        }
      })
    },
    // 进入资讯列表
    goList () {
      this.$router.push('/manage/content/news')
    }
  },
  watch: {
    matchImagesList () {
      let arr = this.matchImagesList.map((item) => {
        return item.src
      })
      this.coverArr.forEach((ele, index) => {
        if (!arr.includes(ele)) {
          this.coverArr.splice(index, 1)
        }
      })
    }
  },
  filters: {
    formatTime (val) {
      if (val) {
        return val.toLocaleString()
      }
      return ''
    }
  },
  data () {
    return {
      form: {
        title: '',
        covers: [],
        plainpublishtime: '',
        articleId: 0,
        cateId: '',
        labels: [],
        publishStatus: 1
      },
      loading: false,
      categoryList: [],
      labelList: [],
      value1: '',
      selectImgArr: [],
      coverArr: [],
      dialogCover: false,
      dialogSuccess: false,
      dialogTime: false,
      dialogView: false,
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      matchImagesList: []
    }
  },
  mounted () {
    // 获取资讯分类
    this.getArticleCategory()
    // 获取资讯标签
    this.getArticleLabels()
    // 获取编辑数据
    if (this.$route.query.articleId) {
      this.form.articleId = this.$route.query.articleId
      this.getArticleData()
    }
  }
}
</script>
<style lang="scss" scoped>
  
  .form .is-error .plusBtn{
      border-color:#ff4949;
    }
  .form {
    padding-top: 20px;
    .photo {
      display: inline-block;
      height: 90px;
      vertical-align: middle;
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
    .plusBtn {
      cursor: pointer;
      text-align: center;
      display: inline-block;
      width: 160px;
      height: 90px;
      line-height: 90px;
      border: 1px dashed $border-color-base;
      i {
        font-size: 20px;
      }
    }
    .el-checkbox {
      min-width: 110px;
    }
    .img-scroll {
      max-height:600px;
      overflow-y:auto;
    }
  }
  .img-box {
    padding-top: 5px;
    max-height: 200;
    overflow-y: scroll;
    img {
      height: 90px;
      max-width: 160px;
      margin: 0 5px 5px 0;
      border: 2px solid #fff;
      cursor: pointer;
    }
    img.active {
      border-color: $color-primary;
    }
  }
  .action {
      text-align: center;
      margin: 20px 0;
      padding-top: 20px;
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
  .views {
    height: 350px;
    .el-carousel {
      height: 350px;
      .el-carousel__container {
      height: 350px;
      .el-carousel__item {
        height: 350px;
        text-align: center;
        img {
          width: 100%;
          max-height: 300px;
          border: 1px solid $border-color-base;
        }
        h3 {
          height: 50px;
          font-size: 14px;
          opacity: 0.75;
          line-height: 50px;
          margin: 0;
          overflow: hidden;
          font-weight: normal;
          background-color: $color-background-base;
        }
      }
    }
    }
  }
  
  
</style>