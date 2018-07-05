<template>
    <div>
        <x-header logo="/images/pc_logo.png" title="账号激活"></x-header>
        <wrapper>
            <div class="actiev">
                <h3 class="register_stepbox">
                  <ul class="step_container">
                  <li class="menu_step" v-for="item in steps" v-bind:class="{active:step>=item.value,current:step==item.value}" :key="item.value">
                      <span class="number">{{item.id}}</span>
                      <span class="text">{{item.label}}</span>
                  </li>
                  </ul>
                </h3>
                <div class="from_cont">
                  <router-view v-model="step"></router-view>
                </div>
            </div>          
        </wrapper>
        <x-footer :type="1"></x-footer>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        step: 1,
        steps: [
          {id: 1, value: 1, label: '验证手机'},
          {id: 2, value: 2, label: '填写资料'},
          {id: 3, value: 3, label: '激活完成'}
        ]
      }
    }
  }
</script>

<style lang="scss">
  
  .register_stepbox{
    border-bottom: 2px solid #f2f2f2;
    font-weight: normal;
    .step_container{
        width: 610px;
        margin: 0 auto;
        .menu_step{
            display: inline-block;
            vertical-align: middle;
            padding: 10px 20px;
            margin: 0 14px;
            margin-bottom: -2px;
            font-size: 18px;
            .number{
                color:#fff;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: #bbb;
                font-size: 12px;
                display: inline-block;
                text-align: center;
                line-height: 15px;
                vertical-align:middle;
            }
            .text{
                color:#bbb;
            }
            &.active{                    
                color: $color-primary;
                .number{
                    background-color:$color-primary;
                }
                .text{
                    color:$color-primary;
                }
            }
            &.current{
                border-bottom: 2px solid $color-primary;
            }
        }
    }
  }
  .actiev{
      .from_cont{
        padding:50px 226px 0;
      }
      width: 800px;
      padding: 50px 0 100px 0;
      background: #fff;
      margin: 100px auto 100px;
      .rdm-code{
          text-align: right
      }
      .el-button--primary{
          margin-bottom:15px;
      }
      .tips {
          color: $color-warning;
          font-size: 12px;
          margin-bottom: 15px;
      }
      .icon {
          width: 14px;
          height: 14px;
          display: inline-block;
          background-size: contain;
          background-position: left center;
          &.icon-xs {
              width: 40px;
              height: 40px;
          }
      }
      .lbl {
          color: $color-black-base;
          margin-bottom: 10px;
          display: block;
      }
      .regex {
          font-size: 12px;
          position: absolute;
          color: $color-sub;
          width: 120%;
          top: 41px;
      }
      .agreement {
          font-size: 12px;
          color: $color-sub;
      }
      .pwd {
          margin-bottom: 30px;
      }
      .title {
          font-size: 30px;
          line-height: 32px;
          padding-left: 44px;
          text-align: center;
          width: 100%;
      }
      .full-width {
          width: 100%;
          &.sure-btn {
              margin-top: 30px;
          }
      }
  }
</style>
