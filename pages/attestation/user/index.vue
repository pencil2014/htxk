<template>
  <div class="content">
    <e-heading grade="1">用户认证</e-heading>
    <!-- {{info.authStatus + '>>>>>>authStatus：认证状态 0: 未认证，1：认证中，2：未通过，3：已通过'}} -->
    <att-state :data = "info" v-if="info && (info.authStatus == 1 || info.authStatus == 2 || info.authStatus == 4)"></att-state>
    <att-info type="user" :data = "info" 
      v-if="info.authType &&　info.authStatus != 2 &&　info.authStatus != 4"
      personHref="/attestation/user/personal/details"
      orgHref="/attestation/user/organization/details"></att-info>
    <p class="attTitle" v-if="info.authStatus == 0 || info.authStatus == 2">选择认证类型</p>
    <p class="attTitle" v-else-if="info.authStatus == 3 || info.authStatus == 4">重新认证</p>
    <el-row v-if="info.authType && info.authStatus != 1">
      <el-col :span="8" 
        v-if="(info.authType == 1 || (userSection.authType == 1 && info.authType == 2 && info.authStatus == 2))
        && !(info.nameAuthStatus == 1 && userSection.authType == 2)">
        <nuxt-link to="/attestation/user/personal">
          <att-type-item type="userPerson"></att-type-item>
        </nuxt-link>
      </el-col>
      <el-col :span="8" 
        v-if="(info.authType == 2 || (info.authType == 1 && info.nameAuthStatus == 0)) 
        && !(info.nameAuthStatus == 1 && userSection.authType == 1)">
        <nuxt-link to="/attestation/user/organization">
          <att-type-item type="userOrg" authCateId="1000"></att-type-item>
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from 'api/attestation'
  import AttInfo from '../components/AttInfo'
  import AttTypeItem from '../components/AttTypeItem'
  import AttState from '../components/AttState'
  import { mapState } from 'vuex'
  export default {
    layout: 'manage',
    components: {
      AttInfo,
      AttTypeItem,
      AttState
    },
    data () {
      return {
        info: {}
      }
    },
    computed: {
      ...mapState({
        userSection: state => state.user.session
      })
    },
    created () {
      this.getUserPersonDetail()
    },
    methods: {
      getUserPersonDetail () {
        api.getUserPersonDetail({}, {contexts: this, successMsg: 'none'}).then(res => {
          this.info = res.data || undefined
          // console.log(this.info)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .attTitle{
    font-size: 18px;
    margin-top: 60px;
    margin-bottom: 15px;
  }
</style>
