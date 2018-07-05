<template>
    <div class="content">
        <wrapper>
            <div class="signup">
                <nuxt-child/>
            </div>
        </wrapper>
    </div>
</template>

<script>
  export default {}
</script>

<style  lang="scss">
  @import '~assets/styles/var.scss';
  .signup{
      width: 800px;
      padding: 80px 226px 50px;
      background: #fff;
      margin: 100px auto 100px;
      .rdm-code{
          text-align: right
      }
      .el-button--primary{
          margin-bottom:15px;
      }
      .tips {
          color: $orange;
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
          color: $six-color;
          margin-bottom: 10px;
          display: block;
      }
      .regex {
          font-size: 12px;
          position: absolute;
          color: $sub-color;
          width: 120%;
          top: 41px;
      }
      .agreement {
          font-size: 12px;
          color: $sub-color;
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
  .link {
      color: $link;
  }
  .link {
      cursor: pointer;
  }
  .have-accout {
      text-align: center;
      margin-top: 70px;
      color: $sub-color;
  }
  .jump_btn{
    text-align: center;
  }
  .is-disabled{
    color: #ccc;
  }
  .cbx {
      margin-right: 5px;
  }

  .main-color {
      color: $primary-color;
  }

  .link {
      color: $link;
  }


  .have-accout {
      text-align: center;
      margin-top: 70px;
      color: $sub-color;
  }
  .popover {
      padding: 7px 10px;
      text-align: center;
      position: absolute;
      top: 30px;
      right: -58px;
      z-index: 1060;
      width: 340px;
      max-width: 350px;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.42857143;
      white-space: normal;
      background-color: #fff9ef;
      background-clip: padding-box;
      border: 1px solid #f1e784;
      border-radius: 3px;
      color: $orange;
      & > .arrow {
          border-width: 11px;
          &:after {
              content: "";
              border-width: 10px;
          }
      }
      &.bottom {
          & > .arrow {
              top: -11px;
              left: 10%;
              margin-left: -11px;
              border-top-width: 0;
              border-bottom-color: #f1e784;
              &:after {
                  top: 1px;
                  margin-left: -10px;
                  content: " ";
                  border-top-width: 0;
                  border-bottom-color: #fff;
              }
          }
      }
  }

  .popover > .arrow, .popover > .arrow:after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
  }
</style>
