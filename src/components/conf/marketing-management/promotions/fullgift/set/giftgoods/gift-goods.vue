<template>
  <div v-if="isShow">
    <el-dialog title="添加商品" :close-on-click-modal="false" size="large" custom-class="mod-pop" top="10%" :visible.sync="isShow" :modal="false">
      <Search :bus="popBus"></Search>
      <SearchTable :bus="popBus" :popSels="popSels" :shopIds="shopIds"></SearchTable>
      <div class="mod-pop-btn">
        <el-button @click="isShow=false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </el-dialog>
    <div class="v-modal" style="z-index: 1;"></div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Search from './search.vue'
  import SearchTable from './table.vue'
  import util from '@/assets/js/util'
  export default {
    props:['bus'],
    data(){
      return {
        popBus:new Vue(),
        isShow:false,
        sels:[],
        popSels:[],
        tableId: '',
        shopIds: ''
      }
    },
    components:{Search, SearchTable},
    methods:{
      formatSels(){
        let ar = []
        for(let k in this.sels){
          ar.push(this.sels[k])
        }
        this.sels = ar
      },
      onSubmit(){
        //change format
        this.formatSels()
        if(!this.sels || this.sels.length==0){
          this.$message.error('至少选择一个商品!')
          return false
        }
        this.bus.$emit('addgift/submit', this.sels)
        this.isShow = false
      },
      getRedistable(){
        if(this.tableId && this.sels.length){
          let getOpt = {
            tableId: this.tableId
          }
          this.$ajax.post(this.$apiUrl.marketing.getAllRedistable, getOpt).then((res) => {
            this.popSels = util.array.toArray(res.data)
          })
        }
      }
    },
    mounted(){
      this.bus.$on('addgift', (obj) => {
        this.isShow = obj.flag
        this.sels = obj.sels
        if(obj.tableId){
          this.tableId = obj.tableId
          if(obj.sels.length){
            let productArr = util.array.toObject(obj.sels, 'bn')
            this.$ajax.post(this.$apiUrl.marketing.redistableAdd, {tableId: this.tableId, datas: JSON.stringify(productArr)}).then((res)=>{
              this.getRedistable()
            })
          }else{
            this.getRedistable()
          }
        }else{
          this.popSels= obj.sels
        }
        this.shopIds = obj.shopIds
      })
      this.popBus.$on('table/cols', (sels) => {
        this.sels = sels
      })
    }
  }
</script>
