<template>
  <transition-group tag="div" name="'flip-list'">
    <div v-for="(item, index) in signupList" :key="index">
      <div v-if="editId !== item.id" class="signup-info">
        <div class="tr">
          <!-- 编辑删除操作插槽 -->
          <slot v-bind="{row: item, $index: index}"></slot>
        </div>
        <div class="info">
          <h1 class="info-name">{{item.name}}</h1>
          <span v-if="Object.values(showPersoinfo[index]).join('').length > 0">
            <i class="iconfont">&#xe692;</i>{{Object.values(showPersoinfo[index]).filter(item => {return item}).join(' / ')}}
          </span><br>

          <span v-if="item.parentName"><i class="iconfont">&#xe67c;</i>{{item.parentName}}</span>
          <span v-if="item.parentMobile"><i class="iconfont">&#xe68a;</i>{{item.parentMobile}}</span>
          <span v-if="item.email"><i class="iconfont">&#xe92e;</i>{{item.email}}</span>
          <span v-if="item.address"><i class="iconfont">&#xe693;</i>{{item.address}}</span> <br>

          <span v-if="item.sportItem"><i class="iconfont">&#xe691;</i>{{item.sportItem}}</span> <br>
          <span v-if="item.awardsItem"><i class="iconfont">&#xe694;</i>{{item.awardsItem}}</span> <br>
          <span v-if="item.trait"><i class="iconfont">&#xe695;</i>{{item.trait}}</span> <br>
          <span v-if="item.remark"><i class="iconfont">&#xe625;</i>{{item.remark}}</span>
        </div>
      </div>
      <train-sign v-if="editId === item.id" :courseId="courseId" :editRow="Object.assign(item, {index: index})" :isEdit="item.isEdit" @cancel="handleCancel" @save="handleSave" />
    </div>
  </transition-group>
</template>

<script>
import TrainSign from './TrainSign'

export default {
  components: {
    TrainSign
  },
  props: {
    editId: String,
    signupList: {
      type: Array,
      default: function () {
        return []
      }
    },
    courseId: [Number, String]
  },
  computed: {
    showPersoinfo () {
      return this.signupList.map(item => {
        return {
          sex: item.sex === 1 ? '男' : item.sex === 2 ? '女' : '',
          birthday: item.birthday ? new Date(item.birthday).format() : '',
          weight: item.weight ? `${item.weight}KG` : '',
          height: item.height ? `${item.height}CM` : '',
          nationality: this.handleCountryCode(item.nationality),
          origin: item.addressLabel ? `${item.addressLabel[0]} ${item.addressLabel[1]}` : '',
          nation: item.nation,
          idNo: item.idNo
        }
      })
    },
    countriesList () {
      return this.$store.getters.get_item.dictCountries
    }
  },
  methods: {
    handleCountryCode (code) {
      let countryName = ''
      if (code) {
        this.countriesList.forEach(item => {
          if (code === item.countryCode) {
            countryName = item.countryChineseName
          }
        })
      }
      return countryName
    },
    handleCancel () {
      this.$emit('cancel')
    },
    handleSave (row) {
      this.$emit('save', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.signup-info {
  width: 850px;
  border: 1px dotted #ccc;
  padding: 10px 0;
  margin-bottom: 20px;
  .tr {
    padding-right: 20px!important;
  }
  .info {
    text-align: center;
    color: #666;
    font-size: 12px;
    h1 {
      font-size: 18px;
    }
    .iconfont {
      padding-right: 5px;
    }
    span {
      padding: 5px;
    } 
  }
}
</style>
