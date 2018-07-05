<template>
  <div>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/wallet' }">钱包中心</el-breadcrumb-item>
          <el-breadcrumb-item>我的钱包</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content wallet-box">
            <e-heading grade="1" class="message-title">我的钱包</e-heading>
            <div class="wallet-btn">
              <span v-show="authType">
                <nuxt-link :to="{path:'/manage/wallet/card'}"  class="wallet-link"><el-button type="primary">银行卡</el-button></nuxt-link>
                <nuxt-link :to="{path: urlCash}" class="wallet-link">
                  <el-button type="primary" @click="cashLink">提现</el-button>
                </nuxt-link>
               </span>
              <nuxt-link :to="{path:'/manage/wallet/question'}" class="link-question">常见问题</nuxt-link>
            </div>
            <div class="pay-total" v-if="walletInfo">
                <div class="use-pay fl">
                  <p class="pay-txt">可用金额: </p> 
                  <p>
                    <span class="total-txt" v-if="walletInfo.totalMoney.length != 0">{{ walletInfo.totalMoney | noPreformatMoney}} 元</span>
                    <span v-else> -- </span>
                  </p> 

                </div>
                <div class="code-pay fl">
                  <p class="pay-txt">冻结金额: </p> 
                  <p>
                    <span class="free-txt" v-if="walletInfo.freeMoney.length != 0">{{walletInfo.freeMoney | noPreformatMoney}} 元</span>
                    <span v-else> -- </span>
                   </p>
                </div>
               
            </div>
            <div class="pay-list" v-if="walletList.list">
                 <el-table
                  :data="walletList.list"
                  style="width: 100%" class="wallet-list-table">
                  <el-table-column
                    prop="accountName"
                    label="交易标题"
                    width="280px" class="account-name"> 
                    <template slot-scope="scope">
                       <span v-if="scope.row.type == 1" class="title-icon get-m"><i class="icon iconfont icon-shou"></i></span> 
                       <span v-else class="title-icon lost-m"><i class="icon iconfont icon-zhichu"></i></span>
                       <span class="title-text">{{scope.row.accountName}} </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="createDate"
                    label="交易时间"
                    width="180px">
                  </el-table-column>
                   <el-table-column
                    prop="amountMoney"
                    label="交易金额"
                    >
                     <template slot-scope="scope">
                       <span v-if="scope.row.type == 1" class="get-m">+ {{scope.row.amountMoney | noPreformatMoney}}</span> 
                       <span v-else class="lost-m">- {{scope.row.amountMoney | noPreformatMoney}}</span> 
                    </template>
                  </el-table-column>
                   <el-table-column
                    prop="statusMessage"
                    label="交易状态">
                     <template slot-scope="scope">
                       <span class="fail-text" v-if="walletList.list.tradeType==2 && walletList.list.status==3">{{scope.row.statusMessage}}</span>
                       <span v-else>{{scope.row.statusMessage}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                 <el-pagination
                  v-bind="getPaginationProps(walletList)"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  >
                </el-pagination>
            </div>
            <!-- 弹出框 -->
            <el-dialog title="温馨提示" :visible.sync="dialogPwdVisible" >
                <p class="dialog-txt"> <i class="icon iconfont icon-tixing-copy" ></i> 请先设置支付密码</p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogPwdVisible = false">取 消</el-button>
                  <nuxt-link :to="{path: '/manage/wallet/passwd'}" class="wallet-link"><el-button type="primary" style="margin-left:20px">去设置</el-button></nuxt-link>
                </span>
            </el-dialog>
            <el-dialog title="温馨提示" :visible.sync="dialogCardVisible" >
                <p class="dialog-txt"> <i class="icon iconfont icon-tixing-copy" ></i> 请先绑定收款账号</p>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogCardVisible = false">取 消</el-button>
                  <nuxt-link :to="{path: '/manage/wallet/bindact'}" class="wallet-link"><el-button type="primary" style="margin-left:20px">去设置</el-button></nuxt-link>
                </span>
            </el-dialog>
        </div>
  </div>
</template>
<script>
import api from 'api/wallet'
import { pagingList } from 'utils/mixins'
import ElTable from '@element-ui/Table'
import ElTableColumn from '@element-ui/TableColumn'
import ElPagination from '@element-ui/Pagination'
import { VuecookieGet } from 'utils/cookie'
import { mapState } from 'vuex'
// import axios from 'axios'
export default {
  mixins: [pagingList],
  layout: 'manage',
  components: {
    ElPagination,
    ElTable,
    ElTableColumn
  },
  data () {
    return {
      query: this.getQuery({}),
      walletList: {},
      urlCash: '/manage/wallet',
      walletInfo: '',
      isOpenPwd: '',
      isTransCard: '',
      dialogPwdVisible: false,
      dialogCardVisible: false
    }
  },
  methods: {
    cashLink () {
      api.payPwd({
      }).then((res) => {
        if (res.data) {
          this.isOpenPwd = res.data.isTransPwd
          this.isTransCard = res.data.isTransCard
          console.log(this.isOpenPwd, this.isTransCard)
          if (this.isOpenPwd === 1) {
            this.dialogPwdVisible = false
            if (this.isTransCard === 1) {
              this.dialogCardVisible = false
              this.urlCash = '/manage/wallet/cash'
              this.$router.push({ path: '/manage/wallet/cash' })
            } else {
              this.dialogCardVisible = true
            }
          } else {
            this.dialogPwdVisible = true
          }
        }
      })
    },
    fetch () {
      api.getWalletList(this.query)
        .then((res) => {
          this.walletList = res.data
        })
      api.getWalletInfo(this.query)
        .then((res) => {
          this.walletInfo = res.data
          // console.log(this.walletInfo)
        })
    }
  },
  computed: {
    ...mapState({
      userSection: state => state.user.session
    }),
    // 获取是组织用户还是个人用户
    authType: function () {
      // 当为authType=1为个人用户， 并且存在手机号码，才可以提现，绑定银行卡
      return this.userSection.authType === 1 && this.userSection.phone !== undefined && this.userSection.phone !== ''
    }
  },
  mounted () {
    this.query.userId = VuecookieGet('htxk_userId')
  }
}
</script>
<style lang="scss">
  .wallet-box{
    .el-table .cell{
      padding: 20px 10px 20px 15px;
    }
  }
</style>
<style lang="scss" scoped>
  
  .wallet-box{
    position: relative;
    .icon-yanjing{
      color: #ccc;
    }
    .title-text{
      display: inline-block;
      width: 210px;
      vertical-align: middle;
    }
    .iconfont{
      font-size: 24px !important;
      vertical-align: middle
    }
    .pay-txt{
      font-size: 18px;
      color: #333;
      height: 30px;
      line-height: 30px;
    }
    .title-icon{
      margin-right: 10px;
    }
    .use-pay{
      min-width: 280px;
    }
    .total-txt,.free-txt{
      font-size: 30px;
      font-weight: bold
    }
    .total-txt{
      color: #333;
    }
    .free-txt{
      color: #999
    }
    .wallet-btn {
      position: absolute;
      top: 50px;
      right: 60px;
    }
    .wallet-btn .wallet-link{
      padding-right:  20px;
    }
    .wallet-btn .wallet-link button{
      vertical-align: middle
    }
    .fail-text{
      color: #F31B05
    }
    .get-m{
      font-size: 14px;
      color: $color-warning;
      display: inline-block
    }
    .lost-m{
      font-size: 14px;
      color: #24c881;
      display: inline-block
    }
    .link-question{
      font-size: 14px;
      color: #3C7DFF;
    }
  }
  
.pay-total{
  position: relative;
  margin: 50px 0 40px 15px;
  clear: both;
  overflow: hidden;
  .code-pay{
    margin-left: 30px;
  }
  .fl{
    float: left;
  }
}
.el-table th:first-child>div{
  padding-left: 52px !important;
}
.el-dialog{
  .icon-tixing-copy{
    color: #fd6f01;
    vertical-align: middle;
    font-size: 32px !important;
    margin-right: 10px;
  }
}

</style>

