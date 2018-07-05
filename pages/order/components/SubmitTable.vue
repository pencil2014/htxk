<template>
  <div>
    <h3>确认订单信息</h3>
    <el-table
      v-if='tableData instanceof Array && tableData && tableData.length > 0'
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="name"
        label="服务名称"
        >
        <template slot-scope="scope">
          <e-cellbox>
            <e-cell-item class="img-box" >
              <div class="img" :style="{backgroundImage: 'url(' + scope.row.name.imgUrl + ')'}"></div>
            </e-cell-item>
            <e-cell-item class="goods-info">
              <h3>{{scope.row.name.title}}</h3>
              <div>
                <span v-for='(item,index) in scope.row.name.selected' :key='item.attrCode'>
                  {{`${item.attrValueName}${index < (scope.row.name.selected.length-1) ? ' / ' : ''}`}}
                </span>
              </div>
            </e-cell-item>
          </e-cellbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="business"
        label="商家"
        align="center font-style"
        width="180">
      </el-table-column>
      <el-table-column
        prop="unitPrice"
        label="单价（元）"
        align="center unit-price"
        width="146">
        <template slot-scope="scope">
          {{scope.row.unitPrice | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column
        prop="num"
        label="数量"
        align="center font-style"
        width="130">
      </el-table-column>
      <el-table-column
        label="总计（元）"
        align="center total-price"
        width="160"
        >
        <template slot-scope="scope">
          {{(scope.row.num * scope.row.unitPrice) | formatMoney}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script type="text/javascript">
import ElTable from '@element-ui/Table'
import ElTableColumn from '@element-ui/TableColumn'
export default {
  components: {
    ElTable,
    ElTableColumn
  },
  props: {
    tableData: {
      type: Array,
      required: true
    }
  }
}
</script>
<style type="text/css" lang="scss" scoped>

.img-box{
  vertical-align: middle;
  width:80px;
  .img{
    height:80px;
    width:80px;
    background-size:cover;
    background-repeat: no-repeat;
    background-position:center center;
  }
}
.goods-info{
  vertical-align: middle;
  padding-left: 18px; 
  div span{
    font-size:14px;
    color:#999;
  }
}
h3{
  font-size: 16px;
  line-height: 16px;
  color:#666;
  padding-bottom: 20px;
  font-weight:normal;
  margin-top: 40px;
}
</style>

<style lang="scss">
.el-table__header-wrapper{
  height:40px;
  tr th div{
    background:#f5f5f5;
  }
}
.el-table th .cell{
  color: #666;
  font-weight: normal;
}
tbody{
  .el-table .cell, .el-table th>div {
    padding-left: 20px;
    padding-right: 20px;
  }
  .el-table .cell {
    padding-top: 14px;
    padding-bottom: 14px;
  }
  .font-style{
    font-size:14px;
    line-height:18px;
    color:#333;
  }
  .unit-price{
    font-size: 16px;
    color:#333;
  }
  .total-price{
    font-size: 16px;
    color:#fc6f00;
  }
}
</style>

