<template>
  <div class="bbs-menu-content">
    <ul  class="bbs-menu">
      <li>
        <nuxt-link target='_blank' style='display:block;' :to="{ path: '/community/list/my' }" >
          <i class="icon iconfont icon-quanzfl" ></i>
          <h3>圈子分类</h3>
        </nuxt-link>
      </li>
      <!-- 我的圈子 我创建的 + 我关注的 -->
      <li class="select-menu"  :class="{'active': myMenu}"
        @mouseenter='MyMenuMouseenter()'
        @mouseleave='MyMenuMouseleave()'
      >
        <i class="icon iconfont icon-geren" ></i>
        <h3>我的圈子</h3>
      </li>

      <!-- 圈子是所有类目 -->
      <li class="select-menu"  :class="{'active':currentMenuId === index}"
        v-for='(item, index) in menuDetailList' :key='index' 
        @mouseenter='MenuMouseenter(index)'
        @mouseleave='MenuMouseleave(index)'
      >
        <i class="icon iconfont" :class='typeToIcon[item.type]'></i>
        <h3>{{item.name}}</h3>
      </li>
    </ul>

    <!-- 我的圈子的二级菜单 - 未登录 -->
    <div  class="sub-menu clearfix"  v-if='!isLogin'
      style='top:0;height:250px; text-align:center;padding-top: 110px;'
      :style="{ display: myMenu ? 'block': 'none'}"
      @mouseenter='MySubMenuMouseenter()'
      @mouseleave='MySubMenuMouseleave()'
    >
      <span class="link" @click="toLogin">登录</span>
      <span style='margin-left: 10px;'>查看我的圈子</span>
    </div>

    <!-- 我的圈子的二级菜单 - 登录了，且有相关圈子 -->
    <div class="sub-menu clearfix"
      style='top:0'
      :style="{display: myMenu ? 'block': 'none'}"
      v-if='isLogin && my_menu && my_menu.list && my_menu.list.length > 0'
      @mouseenter='MySubMenuMouseenter()'
      @mouseleave='MySubMenuMouseleave()'
    >
      <dl  class="fl"  :title='item.circleName'
        v-for='(item, index) in my_menu.list' :key='index' v-if='index < 8'  >
        <nuxt-link target='_blank' :to='"/community/circle/" + item.circleId'     style='display:block;'>
          <dt class="img">
            <e-avatar :size='[38, 38]'  :src='item.icon' />
          </dt>
          <dd class="bbs-name">
            <div class='name'>
              <span class="name-text">{{item.circleName}}</span>
              <i class="icon iconfont" v-if='item.isHot == 2' >&#xe697;</i>
            </div>
            <div class="bbs-num">帖子: {{item.feedCount || 0}}</div>
          </dd>
        </nuxt-link>
      </dl>
      <nuxt-link target='_blank' class="link fr"    v-if='my_menu.total > 8'  
        :to="{ path: '/community/list/my' }" >
        查看全部圈子 >
      </nuxt-link>
    </div>

    <!-- 我的圈子的二级菜单 - 登录了，没有相关圈子 - 推荐圈子 -->
    <div class="sub-menu batch-circle"  
      style='top:0'
      :style="{display: myMenu ? 'block': 'none'}"
      v-if='isLogin && my_menu && my_menu.list && my_menu.list.length < 1 && feedCircle'
      @mouseenter='MySubMenuMouseenter()'
      @mouseleave='MySubMenuMouseleave()' >
      <h3 class="suggest-title">
        您还没有关注的圈子，推荐关注：
      </h3>
      <el-form  label-position="right"   ref="form"  :model="form" 
        v-bind="getFormProps({labelWidth:'112px'})"  >
        <el-form-item   label-width="0px"  prop="checkedCircleId"
          :rules="[{required: false, message: '请选择您感兴趣的圈子'}]"  >
          <el-checkbox-group  v-model="form.checkedCircleId">
            <el-row :gutter="40">
              <el-col :span="6" v-for='(item, index) in feedCircle.list' :key='index'  >
                <el-checkbox  :label="item.circleId" >
                  <dl  class="fl"  :title='item.circleName' >
                    <nuxt-link target='_blank' :to='"/community/circle/" + item.circleId'  style='display:inline-block;'>
                      <dt class="img">
                        <e-avatar :size='[38, 38]'  :src='item.icon' />
                      </dt>
                    </nuxt-link>
                    <dd class="bbs-name">
                      <div class='name'>
                        <nuxt-link target='_blank' :to='"/community/circle/" + item.circleId'  style='display:inline-block;'>
                          <span class="name-text">{{item.circleName}}</span>
                          <i class="icon iconfont" v-if='item.isHot == 2' >&#xe697;</i>
                        </nuxt-link>
                      </div>
                      <nuxt-link target='_blank' :to='"/community/circle/" + item.circleId'  
                        style='display:inline-block; vertical-align: top;'>
                        <div class="bbs-num">帖子: {{item.feedCount || 0}}</div>
                      </nuxt-link>
                    </dd>
                  </dl>
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="sub-btn right-button" label-width="0px">
          <el-button type="primary" native-type="submit" :loading="loading"  
          :disabled="form.checkedCircleId && form.checkedCircleId.length > 0 ? false : true"  >确定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 圈子是所有类目 的 二级菜单 -->
    <div  class="sub-menu clearfix"
      v-if='menuDetailList.length > 1'
      :style="{display: currentMenuId === indexs ? 'block': 'none', top: top + 'px'}"
      v-for='(items, indexs) in menuDetailList' :key='indexs'
      @mouseenter='SubMenuMouseenter(indexs)'
      @mouseleave='SubMenuMouseleave(indexs)' >
      <dl  class="fl"  :title='item.circleName'
        v-if='items.modules'
        v-for='(item, index) in items.modules' :key='index'>
        <nuxt-link target='_blank' :to='"/community/circle/" + item.circleId'  style='display:block;'>
          <dt class="img">
            <e-avatar :size='[38, 38]'  :src='item.icon' />
          </dt>
          <dd class="bbs-name">
            <div class='name'>
              <span class="name-text">{{item.circleName}}</span>
              <i class="icon iconfont" v-if='item.isHot == 2' >&#xe697;</i>
            </div>
            <div class="bbs-num">帖子: {{item.feedCount || 0}}</div>
          </dd>
        </nuxt-link>
      </dl>
      <nuxt-link target='_blank' class="link fr" v-if='items.total > 8' 
        :to="{ path: '/community/list/' + items.describe, query: {type: items.type}}">
        查看全部圈子 >
      </nuxt-link>
    </div>

  </div>
</template>

<script>
import api from 'api/community'
import tools from 'utils/tools'
import {mapGetters} from 'vuex'
import {form} from 'utils/mixins'
import Vue from 'vue'

const menuHeight = 56

export default {
  mixins: [form],
  computed: {
    ...mapGetters({
      my_menu: 'community/my_menu',
      layout_menu: 'community/layout_menu',
      feedCircle: 'community/feed_circle'
    }),
    menuDetailList () {
      return this.layout_menu
    }
  },
  mounted () {
    if (!this.layout_menu.length) {
      this.$store.dispatch('community/layout_menu')
    }
  },
  methods: {
    toLogin () {
      Vue.component('XLogin', function (resolve) {
        require(['@/pages/member/components/XLogin'], resolve)
      })
      this.$set(this.$store.state, 'loginDialog', true)
    },
    submit () {
      let ids = ''
      if (this.form.checkedCircleId) {
        this.form.checkedCircleId.forEach((item, index) => {
          if (index === 0) {
            ids += item
          } else {
            ids += ',' + item
          }
        })
      }
      api.joinCircleBatch({
        'ids': ids
      }, {
        context: this,
        successMsg: 'none'
      }).then((res) => {
        this.myMenu = false
        this.form.checkedCircleId = []
      }).catch(() => {
      })
    },
    // 圈子是所有类目 - 我的圈子
    MyMenuMouseenter () {
      this.myMenu = true // 显示隐藏我的的二级菜单
      if (tools.getHeaders(window.document.cookie)) {
        this.isLogin = true
        // 请求我的圈子
        this.$store.dispatch('community/my_menu', {page: 1, rows: 8})
        this.$store.dispatch('community/feed_circle', {page: 1, rows: 8}) // 多请求一个推荐 < 8
      } else { // 未登录，提醒登录
        this.isLogin = false
      }
    },
    MyMenuMouseleave () {
      this.myMenu = false
    },
    MySubMenuMouseenter () {
      this.myMenu = true
    },
    MySubMenuMouseleave () {
      this.myMenu = false
    },
    // 圈子是所有类目 - 普通
    MenuMouseenter (index) {
      this.currentMenuId = index
      this.top = (index + 1) * menuHeight
    },
    MenuMouseleave (index) {
      this.currentMenuId = ''
    },
    SubMenuMouseenter (index) {
      this.currentMenuId = index
    },
    SubMenuMouseleave (index) {
      this.currentMenuId = ''
    }
  },
  data () {
    return {
      page: 1,
      rows: 8,
      loading: false, // 必需要返回loading
      form: {
        checkedCircleId: [] // 选中的，推荐圈子
      },
      isLogin: false,
      currentMenuId: '',
      top: 0,
      myMenu: false,
      myMenuDetailList: [],
      typeToIcon: {
        1: 'icon-qita',
        2: 'icon-iosfootball',
        3: 'icon-06',
        4: 'icon-yumaoqiukongxin',
        5: 'icon-wangqiu1',
        6: 'icon-pingpangkongxin',
        7: 'icon-run'
      }
    }
  }
}
</script>

<style lang="scss"  scoped>

  .clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
  .fl{float: left;}
  .fr{float: right;}
  .bbs-menu-content{
    position: fixed;
    z-index: 15;
    width:150px;
    background:#fff;

    .bbs-menu{
      li{
        cursor:pointer;
        height: 56px;
        line-height: 56px;
        padding-left: 24px;
        border-left: 3px solid #fff;
        color:$color-black-base;
        i{
          margin-right: 12px;
        }
      }
      h3{
        display:inline-block;
        font-weight: normal;
      }
    }
    .bbs-menu .active{
      background-color:#f0fcf9;
      color: $color-primary;
      border-left-color: $color-primary;
    }
    .sub-menu{
      display: none;
      z-index: 1000;
      position: absolute;
      border: 2px solid $color-primary;
      width:770px;
      min-height: 112px;
      background: #fff;
      left: 150px;
      padding: 26px;
      dl{
        width:25%;
        height: 40px;
        margin-bottom: 40px;
        &:hover{
          .img{
            border-color: $color-primary;
          }
          .name .name-text{
            color: $color-primary;
          }
        }
      
      }
      .img{
        display:inline-block;
        height: 38px;
        width: 38px;
        border-radius: 100%;
        overflow: hidden;
        background-size: cover;
        background-repeat:no-repeat;
        background-position: center center;
        margin-right:10px;
        border: 1px solid #fff;
      }
      .bbs-name{
        display:inline-block;
        vertical-align: top;
        max-width: 120px;
        .name{
          height: 24px;
          line-height: 24px;
          margin-bottom:8px;
          .name-text{
            height: 16px;
            line-height: 14px;
            display: inline-block;
            vertical-align: bottom;
            max-width: 90px;
            overflow:hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
          }
          i{
            height: 24px;
            line-height: 24px;
            vertical-align: top;
            display: inline-block;
            font-size:24px;
            color: red;
          }
        }
      }
      .bbs-num{
        color:$color-sub;
        font-size: 12px;
        line-height:12px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
      }
    }
    // 推荐圈子时的圈子列表
    .batch-circle{
      .suggest-title{
        margin-bottom: 30px;
        font-size: 16px;
        font-weight: 400;
      }
      .bbs-name{
        display:inline-block;
        vertical-align: top;
        width: 120px;
        .name{
          
          height: 24px;
          line-height: 24px;
          margin-bottom:8px;
          .name-text{
            height: 16px;
            line-height: 14px;
            display: inline-block;
            vertical-align: bottom;
            max-width: 62px;
            overflow:hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
          }
          i{
            height: 24px;
            line-height: 24px;
            vertical-align: top;
            display: inline-block;
            font-size:24px;
            color: red;
          }
        }
      }
      .bbs-num{
        color:$color-sub;
        font-size: 12px;
        line-height:12px;
        width: 70px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
      }
    }

  }
</style>

<style lang="scss" >

.bbs-menu-content{
  .el-checkbox__input {
    float: right;
    position: absolute;
    right:20px;
    top: 20px;
  }
  .el-checkbox__label{
    margin-left: 0;
    padding-left: 0;
  }
  .right-button {
    text-align: right;
  }
}
</style>
