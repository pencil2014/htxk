 <template>
    <div class="el-carousel">
        <!-- <ul class="par-menu">
            <li v-on:mouseover="setActiveItem(0,1)" :class="{active:index==0}" >赞助商</li>
            <li v-on:mouseover="setActiveItem(1,1)" :class="{active:index==1}" >项目方</li>
            <li v-on:mouseover="setActiveItem(2,1)" :class="{active:index==2}">赛事方</li>
        </ul> -->
      <el-carousel :interval="5000" arrow="always" indicator-position="outside" height="450px" ref='car'>
        <el-carousel-item v-for="(item, index) in carousel" :key="index" :label="item.label">
          <img :src='"/images/sports/sport_z_"+ (index+1) +".png"'>
        </el-carousel-item>
      </el-carousel>
    </div>
</template>
<script type="text/javascript">
export default {
  data () {
    // 以下是滑块的名字
    return {
      index: 0,
      carousel: [
        {
          label: '赞助商'
        },
        {
          label: '项目方'
        },
        {
          label: '赛事方'
        }
      ]
    }
  },
  methods: {
    // 目前还存在，当为houer状态时不能停留，在el-carousel上添加@change = "setActiveItem"
    // setActiveItem (index, m) {
    //   this.index = index
    //   if (m === 1) {
    //     this.$refs.car.setActiveItem(index)
    //   }
    // }
  }
}
</script>
<style lang="scss">
// 注意：以下是修改组件样式
  .el-carousel {
    .el-carousel__container{
      margin-top: 100px;
    }
    .el-carousel__arrow{
      top: 125px;
    }
    ul.el-carousel__indicators{
      width: 310px;
      margin: 0 auto;
      top: 0;
      position: absolute;
      li{
        width: 100px;
      }
      .el-carousel__button{
        background: #fff;
        font-size: 16px !important;
        padding: 6px 18px;
        border-radius: 15px;
        color: #333;
        opacity: 1;
      }
      .is-active .el-carousel__button{
        background: #23c270;
        color: #fff !important;
      }
    }
  } 
// .par-menu {
//     display: block;
//     overflow: hidden;
//     clear: both;
//     width: 310px;
//     margin: 0 auto;
//     padding-bottom: 60px;
// }
// .par-menu li{
//     float: left;
//     width: 100px;
//     font-size: 16px;
//     color: #333;
//     padding: 5px 8px;
//     border-radius: 8px;
// }
// .par-menu .active {
//     background: #23c270;
//     color: #fff !important;
// }
</style>