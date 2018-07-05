<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage/publish/article' }">我的发布</el-breadcrumb-item>
      <el-breadcrumb-item>发布资讯</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="divider">
        <e-heading grade="1">资讯编辑</e-heading>
      </div>
      
      <div class="form">
      <!-- { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' } -->
        <el-form ref="form" v-bind="getFormProps({labelWidth:'80px'})">
          <el-form-item label="标题" 
            prop="title"
            :rules="[
              { required: true, message: '标题不能为空', trigger: 'blur'},
              { min:8, max:24, message: '标题长度为8-24个字符', trigger: 'blur'}
             ]">
            <el-input v-model.trim="form.title"  :maxlength="24" placeholder="请输入标题" style="width:600px"  number-word />
          </el-form-item>
          <el-form-item label="资讯详情"
            prop="text"
            :rules="[
            { required: true, message: '请输入资讯详情'},
            { min:10, max: 10000, message: '资讯详情的长度为10-10000个字符', trigger: 'blur'}
            ]">
            <e-editor v-if="$route.query.articleId&&form.content || !$route.query.articleId" v-model="form.content" :text.sync="form.text" :maxlength="10000" @change="$refs.form.validateField('text')" />
          </el-form-item>
          <el-form-item label="摘要"
            prop="summary"
            :rules="[
              {required: true, whitespace: true, message: '请输入摘要'},
              { min: 1, max: 120, message: '摘要的长度为1-120个字符', trigger: 'blur'}
            ]">
            <el-input type="textarea" :maxlength="120" v-model.trim="form.summary" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入摘要"></el-input>
          </el-form-item>
          <el-form-item label="封面"
          >
            <!-- <span class="photo" v-for="(item, index) in coverArr" :key="index">
              <img :src="item" alt="">
              <i class="iconfont" @click="deleteImg(index)">&#xe754;</i>
            </span> -->
            <!-- <span class="plusBtn" @click="showDialogCover" v-show="coverArr.length < 3"><i class="el-icon-plus"></i></span> -->
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
             <img v-for="(item, index) in imgArr" :key="index" :src="item" alt="" @click="setCover(item)" :class="{'active': selectImgArr.includes(item)}">
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
          size="large">
          <div class="views">
            <h2 class="title">{{form.title}}</h2>
            <p class="time">{{value1 | formatTime}}</p>
            <p class="summary"><b>摘要：</b>{{form.summary}}</p>
            <div class="cnt" v-html="form.content"></div>  <!-- v-html="form.content" -->
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button  type="primary" @click="dialogView = false">确认</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import api from 'api/publish'
import {form} from 'utils/mixins'
import EEditor from '@e-ui/Editor'
import ElDatePicker from '@element-ui/DatePicker'
import EImgGroupUpload from '@e-ui/ImgGroupUpload'
export default {
  mixins: [form],
  layout: 'manage',
  components: {
    EEditor,
    ElDatePicker,
    EImgGroupUpload
  },
  methods: {
    // 发布资讯
    submit () {
      this.form.publishStatus = 1
      this.saveArticleData()
    },
    // 获取发布详情的图片
    getPhotos () {
      let imgArr = []
      if (this.form.content) {
        let arr = this.form.content.match(/<img[^>]+>/img)
        if (arr) {
          for (var val of arr) {
            val.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
              imgArr.push(capture)
            })
          }
        }
      }
      if (imgArr.length) {
        this.imgArr = imgArr
      }
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
    // 格式化时间为 yyyy-MM-dd HH:mm:ss
    formatTimes (date) {
      let year = date.getFullYear()
      let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return `${year}-${month}-${day} ${h}:${m}:${s}`
    },
    // 获取资讯数据
    getArticleData () {
      api.articleData({articleId: this.form.articleId}, {successMsg: 'none'}).then((res) => {
        if (res.data.articleVo) {
          let data = res.data.articleVo
          this.form.title = data.title
          this.form.content = data.content
          this.form.text = data.content.replace(/<[^>]+>/g, '')
          this.form.summary = data.summary
          this.form.cateId = data.cateId
          this.coverArr = data.coverUrl
          this.form.labels = data.tagCodeArray.split(',')
        }
      })
    },
    // 获取图片相对地址
    getUrlPath (url) {
      let rule = url.indexOf('/f/') > -1 ? '/f/' : '/fv/'
      return url.slice(url.indexOf(rule))
    },
    // 保存资讯数据
    saveArticleData () {
      // 检测是否选择封面图片
      this.getPhotos()
      if (this.imgArr.length > 0 && this.coverArr.length < 1) {
        this.$message.error('请选择封面图片!')
        return
      }
      // 检测标签个数
      if (this.form.labels.length < 1 || this.form.labels.length > 3) {
        this.$message.error('标签数为1~3个，请重新选择!')
        return
      }
      // 获取图片相对地址
      let imgUrl = this.coverArr.map((value) => {
        return this.getUrlPath(value)
      })
      // 格式化时间
      let time = ''
      if (this.value1) {
        time = this.formatTimes(this.value1)
      }
      api.articleSave({
        articleId: this.form.articleId,
        cateId: this.form.cateId,
        content: this.form.content,
        summary: this.form.summary,
        covers: imgUrl.length > 0 ? ',' + imgUrl.join(',') : '',
        labels: this.form.labels.join(','),
        plainPublishTime: time,
        publishStatus: this.form.publishStatus,
        title: this.form.title
      }, {context: this, successMsg: 'none'}).then((res) => {
        this.dialogSuccess = true
      })
    },
    // 显示封面
    showDialogCover () {
      this.getPhotos()
      if (this.imgArr.length) {
        this.selectImgArr = [...this.coverArr]
        this.dialogCover = true
      } else {
        this.$message.error('资讯详情没有上传图片无法选择封面!')
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
      this.coverArr = [...this.selectImgArr]
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
      this.form.publishStatus = 0
      this.saveArticleData()
    },
    // 存草稿
    showDraft () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.publishStatus = 3
          this.saveArticleData()
        }
      })
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
        text: '',
        title: '',
        content: '',
        summary: '',
        covers: '',
        plainPublishTime: '',
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
      imgArr: [],
      coverArr: [],
      dialogCover: false,
      dialogSuccess: false,
      dialogTime: false,
      dialogView: false,
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  mounted () {
    if (this.$route.query.articleId) {
      this.form.articleId = this.$route.query.articleId || ''
      this.getArticleData()
    }
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
 
 .content {
  .form {
    padding:20px 0 ;
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
        border: 1px solid $border-color-base;
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
      border: 1px dotted #ccc;
      i {
        font-size: 20px;
      }
    }
    .el-checkbox {
      min-width: 110px;
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
    text-align: center;
    font-size: 12px;
    .title {
      font-size: 16px;
    }
    .time {
      color: $color-sub;
      padding: 5px;
    }
    .summary {
      text-align: left;
      background-color: $color-background-base;
      padding: 5px 10px;
      margin-top: 10px;
    }
    .cnt {
      text-align: left;
      padding:15px 0;
      font-size: 14px;
      max-height: 400px;
      overflow-x: hidden;
      overflow-y: scroll;
      line-height: 1.5;
    }
  }
 }
</style>