<template>
  <div>
    <div  class="mod-search-table">
      <el-table :data="tableData" style="width: 100%" v-loading="listLoading" @select="selsChange" ref="elTable" @select-all="selsChangeAll">
        <el-table-column type="selection" width="100">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称">
        </el-table-column>
        <el-table-column prop="specName" label="规格">
        </el-table-column>
        <el-table-column prop="bn" label="SKU编码">
        </el-table-column>
        <el-table-column prop="goodsBn" label="SPU编码">
        </el-table-column>
        <el-table-column prop="backCatPath" label="所属分类">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌">
        </el-table-column>
      </el-table>
    </div>
    <div class="mod-toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                     :page-size="pageSize" :total="total" :current-page.sync="page">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import util from '@/assets/js/util'
  export default {
    props:['bus', 'popSels', 'shopIds'],
    data(){
      return {
        formData:{},
        tableData: [],
        sels:[],
        selsCache:[],
        checked:{},
        listLoading: true,
        page: 1,
        total: 0,
        pageSize: 10
      }
    },
    methods:
      {
        //part select
        selsChange(sels, row)
        {
          if(this.sels[row.bn]){
            delete this.sels[row.bn]
          }else{
            if(this.selsCache[row.bn]){
              this.sels[row.bn] = this.selsCache[row.bn];
            }else{
              this.sels[row.bn] = row
            }
          }
          this.bus.$emit('table/cols', this.sels)
        },
        //select all
        selsChangeAll(sels) {
          this.tableData && this.tableData.forEach(item=>{
            if(sels.length==0){
              this.sels[item.bn] && (delete this.sels[item.bn])
            }else{
              if(this.selsCache[item.bn]){
                this.sels[item.bn] = this.selsCache[item.bn]
              }else{
                this.sels[item.bn] = item
              }
            }
          })
          this.bus.$emit('table/cols', this.sels)
        },
        handleCurrentChange(val) {
          this.page= val
          this.getData()
        },
        selectedOption(){
          let rows = this.tableData
          // let selectedRows = this.popSels
          let selectedRows = util.array.toObject(this.popSels, 'bn')
          if(rows && rows.length!=0){
            rows.forEach(row => {
              if(selectedRows && selectedRows[row.bn]){
                this.checked[row.bn] = row
                this.$nextTick(() =>{
                  if(this.$refs.elTable){
                    this.$refs.elTable.toggleRowSelection(row)
                  }
                })
              }
            })
          }
        },
        getData() {
          let opt = Object.assign({currentPage: this.page, pageSize: this.pageSize, shopIds: JSON.stringify(this.shopIds)}, this.formData||{})
          this.listLoading = true
          this.$ajax.post(this.$apiUrl.marketing.getProductGoods,opt).then((res) => {
            this.total = res.data.totalRow
            this.tableData = res.data.list
            this.listLoading = false
            this.selectedOption()
          });
        },
        changeSels() {
          let obj  = {}
          this.popSels && this.popSels.forEach(item => {
            obj[item.bn] = item
          });
          Object.assign(this.sels, obj)
          Object.assign(this.selsCache, obj)
        }
      },
    mounted() {
      this.getData();
      // this.sels = this.popSels
      this.changeSels()
      this.bus.$on('search', obj => {
        this.formData = obj
        if(this.page== 1){
          this.getData()
        }else{
          this.page= 1
        }
      })
    },
    watch:{
      popSels(){
        this.changeSels()
        this.getData()
      }
    }
  }
</script>
