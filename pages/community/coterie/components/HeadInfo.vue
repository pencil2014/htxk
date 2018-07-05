<template>
  <div class="coterie-info" v-if='coterieData'>
    <div class="clearfix">
      <div class="index fl">
        <!-- <div  class="img" :style="{backgroundImage: 'url(' + coterieData.icon + ')'}"></div> -->
        <dt class="img">
          <avatar :size='[100, 100]'  :src='coterieData.icon' />
        </dt>
      </div>
      <div class="info fl">
        <div >
          <h2 :title="coterieData.circleName">
            {{coterieData.circleName}}
          </h2>
          <el-button type="primary"  size="small" 
            @click='join(coterieData.circleId)'
            v-if='coterieData.joinStatus != 1 && !isMine'>
            <i class="icon iconfont" >&#xe661;</i>
            加入
          </el-button>

          <button 
            class="is-followed"
            size="small" 
            @mouseenter='followedMouseenter()'
            @mouseleave='followedMouseleave()'
            @click='quit(coterieData.circleId)'
            v-if='coterieData.joinStatus == 1 && !isMine'
          >
            {{followedBtnText || '已加入圈子'}}
          </button>

          <el-button type="text"  size="small" class="fr" @click='operateInApp' 
          v-if='isMine'>
            <i class="icon iconfont" >&#xe6bc;</i>
            成员管理
          </el-button>
        </div>

        <div class="hot-num">
          <span>帖子：{{coterieData.feedCount}}</span>
          <span>成员：{{coterieData.members}}</span>
        </div>
        <div class="introduce">
          {{coterieData.summarize}}
          <!-- 编辑功能这一期还没有 -->
          <!-- <i class="icon iconfont" >&#xe64f;</i> -->
        </div>
      </div>
    
      <div class="time-share fr">
        <ol class="fl">
          <li :title="coterieData.createUserName">创建人：{{coterieData.createUserName}}</li>
          <li>创建时间：{{coterieData.createTime | formatDate('yyyy-MM-dd')}}</li>
        </ol>

        <div class='fr share-box'   @mouseenter='shareMouseenterAction'  @mouseleave='shareMouseleaveAction'  >
          <div class="show-icon">
            <i class="icon iconfont share-icon">&#xe601;</i>
              分享
            <i class="icon iconfont icon-directionbottom row"  v-show='!shareShow'></i>
            <i class="icon iconfont icon-fangxiangshang row"  v-show='shareShow'></i>
          </div>
          <transition name="fade">
            <div  v-show='shareShow' class="bdsharebuttonbox" >
              <a  class="bds_qzone icon iconfont icon-QQkongjian" data-cmd="qzone" title="分享到QQ空间"></a>
              <a  class="bds_sqq icon iconfont icon-qq" data-cmd="sqq" title="分享到QQ好友"></a>
              <a  class="bds_weixin icon iconfont icon-weixin" data-cmd="weixin" title="分享到微信"></a>
              <a  class="bds_tsina icon iconfont icon-xinlang" data-cmd="tsina" title="分享到新浪微博"></a>
            </div>
          </transition>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import api from 'api/community'
import tools from 'utils/tools'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      coterieData: 'community/circle_detail'
    }),
    isMine () {
      return this.coterieData.createUserId === this.$store.state.user.session.userId
    }
  },
  watch: {
    '$store.state.user.session' (data) {
      this.$store.dispatch('community/circle_detail', {'circleId': this.coterieData.circleId})
    }
  },
  data () {
    return {
      followedBtnText: '已加入圈子',
      shareShow: false
    }
  },
  beforeDestroy () {
    if (document.querySelector('#bdshare_weixin_qrcode_dialog')) {
      document.querySelector('#bdshare_weixin_qrcode_dialog').remove()
      document.querySelector('#bdshare_weixin_qrcode_dialog_bg').remove()
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!window._bd_share_main) {
        this.bdInit()
      } else {
        window._bd_share_main.init()
      }
    })
  },
  methods: {
    operateInApp () {
      this.$alert('使用该功能，需下载APP', '提示', {
        confirmButtonText: '确定',
        callback: action => {
        }
      })
    },
    followedMouseenter () {
      this.followedBtnText = '退出圈子'
    },
    followedMouseleave () {
      this.followedBtnText = '已加入圈子'
    },
    join (circleId) {
      if (tools.getHeaders(window.document.cookie)) {
        api.joinCircle({
          'circleId': circleId
        }, {
          context: this,
          successMsg: 'none'
        }).then((res) => {
          if (Number(res.result) === 0) {
            this.coterieData.joinStatus = 1
          }
        }).catch(() => {
        })
      } else {
        this.$set(this.$store.state, 'loginDialog', true)
      }
    },
    quit (circleId) {
      // 发请求告诉后台退出圈子
      if (tools.getHeaders(window.document.cookie)) {
        api.quitCircle({
          circleId: circleId
        }, {
          context: this,
          successMsg: 'none'
        }).then((res) => {
          if (Number(res.result) === 0) {
            this.coterieData.joinStatus = 2
          }
        }).catch(() => {})
      } else {
        this.$set(this.$store.state, 'loginDialog', true)
      }
    },
    shareMouseenterAction () {
      this.shareShow = true
    },
    shareMouseleaveAction () {
      this.shareShow = false
    },
    bdInit () {
      window._bd_share_config = {
        'common': {
          'bdSnsKey': {'bds_tsina': '18129803273', 'popup_sqq': '468642723', 'bds_weixin': 'htxk-open@13322.com', 'bds_qzone': '468642723'},
          'bdText': `来自求苗圈子“${this.coterieData ? this.coterieData.circleName : ''}”`,
          'bdDesc': `${this.coterieData && this.coterieData.summarize ? this.coterieData.summarize : '一个懂体育更懂你的圈子'}`,
          'bdMini': '2',
          'bdMiniList': false,
          'bdPic': `${this.coterieData ? this.coterieData.icon : ''}`,
          'bdStyle': '0',
          'bdSize': '16'
        },
        image: [{
          tag: 'share_1',
          viewType: 'list',
          viewPos: 'top',
          viewColor: 'black',
          viewSize: '16',
          viewList: ['qzone', 'tsina', 'huaban', 'tqq', 'renren']
        }],
        'share': {
          bdUrl: (location.origin || (location.protocol + '//' + location.host)) + '/share?type=coterie&shareId=' + this.coterieData.circleId + '&share='
        }
      }
      let url = '/static/api/js/share.js'
      let script = document.createElement('script')
      script.setAttribute('src', url)
      document.getElementsByTagName('head')[0].appendChild(script)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/var';
.coterie{
  .coterie-info{
    padding: 40px;
    .index{
      width:130px;
    }
    .info{
      border-right: 1px solid #efefef;
      width:530px;
      >div{
        width:510px;
        button{
          font-size: 16px;
        }
      }
      h2{
        display: inline-block;
        font-size: 24px;
        line-height: 38px;
        font-weight: normal;
        max-width:320px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        margin-right: 14px;
      }
      .hot-num{
        margin:30px 0;
        span{
          font-size: 16px;
          line-height: 16px;
          color: $color-sub;
          margin-left: 50px;
          &:nth-child(1){
            margin-left: 0;
          }
        }
      }
      .introduce{
        text-align:justify;
        word-break: break-all;
      }
    }
    .is-followed{
      padding: 10px;
      border:none;
      background: $color-sub;
      border-radius: 3px;
      line-height: 16px;
      vertical-align: top;
      color:#fff;
      min-width: 102px;
      outline:none;
      &:hover{
        background: $color-primary;
      }
    }
    .time-share{
      width: 290px;
      >ol{
        margin-left:20px; 
        width:160px;
        li:nth-child(1){
          overflow:hidden;
          white-space: nowrap;
          text-overflow:ellipsis;
        }
      }
      >div{
        text-align: right;
        width:98px;
        .show-icon{
          .share-icon{
            color:$color-primary;
          }
        }
      }
    }
  }
  .img{
    width: 100px;
    height: 100px;
    border-radius: 100%;
    overflow: hidden;
    background-size: cover;
    background-repeat:no-repeat;
    background-position: center center;
  }
}
</style>

<style lang="scss">
.coterie{
  // 百度分享样式修改
  .share-box{
    .fade-enter-active, .fade-leave-active {
      transform-origin: 0 0;
      transition: all 0.2s;
      transform: scaleY(-14px);
      height: 14px;
    }
    .fade-enter, .fade-leave-to {
      transform-origin: 0 0;
      transform: scaleY(0);
      height:0;
    }
    div:nth-child(1){
      display:inline-block;
      vertical-align:center;
      font-size: 12px;
      color:#666;
      .icon-fenxiang{
        font-size: 16px;
      }
      .row{
        font-size: 12px;
        margin-left:4px;
        transform:scaleY(0.5);
      }
    }
    
    div:nth-child(2){
      font-size: 20px;
      color: #fff;
      a:nth-child(1){
        color: #ffe033;
      }
      a:nth-child(2){
        color: #7eaeef;
      }
      a:nth-child(3){
        color: #78d37d;
      }
      a:nth-child(4){
        color: #ff7872;
      }
    }

    .bdsharebuttonbox a{
      display:block;
      float:left;
      width:20px;
      height: 20px;
      padding-left: 0;
      font-size: 20px;
      line-height: 20px;
      background:#fff;
      cursor: pointer;
      margin: 6px 6px 6px 0;
      &:nth-child(4){
        margin-right:0;
      }
      .iconfont{
        font-size: 20px;
      }
    }

  }
}
</style>
