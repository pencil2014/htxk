<template>
  <div class="receive-address">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item,index) in list" :key="index" v-show="index < len">
        <div 
          class="receive-address-item"
          :class="{
            'receive-address-item-active':item.id == value,
            'receive-address-item-default':item.isDefaultAddress == 1
          }"
          @click="handleChange(index)">
          <h4>{{item.consignee}}</h4>
          <em>{{item.mobile}}</em>
          <p>{{item.provName}}{{item.cityName}}{{item.distName}}{{item.detailAddress}}</p>
          <div class="tr">
            <el-button type="link" @click="handleEdit($event,index)">修改</el-button>
            <el-button type="link" @click="handleDelete($event,index)">删除</el-button>
           </div>
        </div>
      </el-col>
      <el-col :span="8" v-if="list.length < 10">
        <div class="receive-address-item receive-address-add" @click="handleAdd">
          <i class="iconfont">&#xe618;</i>
          <div>
            添加收货地址
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="tr" v-if="list.length > 2">
      <el-button @click="handleShowAll" type="link" v-if="len < list.length">
        更多收货地址 <i class="iconfont" style="font-size:12px">&#xe617;</i>
      </el-button>
      <el-button @click="handleShowAll" type="link" v-else>
        收起收货地址 <i class="iconfont" style="font-size:12px">&#xe616;</i>
      </el-button>
    </div>
    <el-dialog size="small" :visible.sync="visible" title="创建收货地址" >
      <receive-address-edit v-if="visible" :data="item" @success="handleSuccess" @cancel="handleClose"/>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import userApi from 'api/user'
  import ReceiveAddressEdit from './ReceiveAddressEdit'
  import EAddressCascader from '@e-ui/AddressCascader'
  export default {
    components: {
      ReceiveAddressEdit
    },
    props: ['value'],
    data () {
      return {
        visible: false,
        item: null,
        len: 2,
        list: []
      }
    },
    mounted () {
      this.fetch()
    },
    methods: {
      fetch () {
        userApi.receiveAddress({page: 1, rows: 1000}).then((res) => {
          if (res.data && res.data.list) {
            res.data.list.forEach((item) => {
              EAddressCascader.methods.getLabel([item.prov, item.city, item.dist]).then(array => {
                item.provName = array[0]
                item.cityName = array[1]
                item.distName = array[2]
              })
            })
            this.list = res.data.list
            this.handleChange()
          }
        })
      },
      handleChange (index = 0) {
        let item = this.list[index]
        if (!item) {
          this.$emit('input', null).$emit('change', null)
        } else {
          // this.value !== item.id && this.$emit('input', item.id).$emit('change', item) // 这个修改地址id没变，会不触发事件
          this.$emit('input', item.id).$emit('change', item)
        }
      },
      handleEdit (event, index) {
        event.stopPropagation()
        let item = Object.assign({}, this.list[index])
        item.isDefaultAddress = !!item.isDefaultAddress
        this.item = item
        this.visible = true
      },
      handleDelete (event, index) {
        event.stopPropagation()
        userApi.deleteReceiveAddress({
          id: this.list[index].id
        }, {
          context: event.target,
          successMsg: '删除成功'
        }).then(() => {
          this.fetch()
        })
      },
      handleAdd () {
        this.item = null
        this.visible = true
      },
      handleSuccess () {
        this.visible = false
        this.fetch()
      },
      handleClose () {
        this.visible = false
      },
      handleShowAll () {
        if (this.len < this.list.length) {
          this.len = this.list.length
        } else {
          this.len = 2
        }
      }
    }
  }
</script>
<style type="text/css" lang="scss">
  
  .receive-address{
    &-item{
      border:1px solid $border-color-base;
      box-sizing:border-box;
      padding:15px;
      line-height:1;
      height:164px;
      margin-bottom:20px;
      position:relative;
      overflow:hidden;
      h4{
        font-size:16px;
        font-weight: normal;
      }
      em{
        font-style:normal;
        font-weight:bold;
        display:block;
        margin:18px 0 5px 0;
      }
      p{
        overflow: hidden;
        height:64px;
        line-height: 20px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      &-default{
        &:before{
          content:'默认';
          position: absolute;
          top: -6px;
          right: -23px;
          background: #ccc;
          color: #fff;
          padding: 14px 20px 6px 20px;
          transform: rotate(45deg);
          font-size: 12px;
        }
      }
      &-active{
        border-color:$color-primary;
        border-bottom-width:4px;
        &:before{
          background: $color-primary;
        }
      }
      &:hover{
        border-color:$color-primary;
        cursor: pointer;
      }
    }
    &-add{
      text-align:center;
      color:#999;
      padding-top:40px;
      .iconfont{
        font-size:50px;
        color:inherit;
        opacity:0.6;
      }
      div{
        margin-top:10px;
      }
      &:hover{
        color:$color-primary;
        border-color:$color-primary;
      }
    }
  }
</style>
