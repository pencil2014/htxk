<template>
  <div class='content' >
    <e-heading grade="1">实名认证</e-heading>
    <att-info type="name" :data = "info" 
      personHref="/attestation/name/person/details"
      orgHref="/attestation/name/org/details"></att-info>
    <div v-if="info && info.authStatus != 1">
      <p class="attTitle">选择认证类型</p>
      <el-row>
        <el-col :span="8" v-if="info.authType == 1">
          <div  @click="orgTo('person')">
            <att-type-item type="namePerson"></att-type-item>
          </div>
        </el-col>
        <el-col :span="8" v-if="info.authType == 2">
          <div @click="orgTo('org')">
            <att-type-item type="nameOrg" @click="orgTo"></att-type-item>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import api from 'api/attestation'
  import AttInfo from '../components/AttInfo'
  import AttTypeItem from '../components/AttTypeItem'
  import AttState from '../components/AttState'
  export default {
    layout: 'manage',
    components: {
      AttInfo,
      AttTypeItem,
      AttState
    },
    data () {
      return {
        info: undefined
      }
    },
    created () {
      this.getNameDetail()
    },
    methods: {
      getNameDetail () {
        api.getNameDetail({}, {contexts: this, successMsg: 'none'}).then(res => {
          this.info = res.data || undefined
        })
      },
      orgTo (type) {
        let path = ''
        let editHref = ''
        if (type === 'person') {
          path = '/attestation/name/person'
          editHref = '/attestation/user/personal/message?edit=1'
        } else if (type === 'org') {
          path = '/attestation/name/org'
          editHref = '/attestation/user/organization/message?edit=1'
        }
        if (this.info && this.info.reAuth === 1) {
          this.$router.push({path: path})
        } else if (this.info && this.info.reAuth === 0) {
          this.$confirm('请您先完善用户认证资料，再来做实名认证！', '提示', {
            confirmButtonText: '去完善',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$router.push({path: editHref})
          }).catch(() => {
          })
        }
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
