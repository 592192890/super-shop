<template>
  <div class="mod-search">
    <el-popover
      ref="classifyPop"
      placement="right"
      width="400"
      trigger="click"
      v-model="popVisible">
      <el-tree
        :data="classifyTree"
        :props="defaultProps"
        node-key="catbackId"
        empty-text="正在加载..."
        ref="classify"
        show-checkbox>
      </el-tree>
      <el-row type="flex" justify="end" class="mod-classify-btn">
        <el-col :span="3"><div><el-button size="mini" @click="popVisible=false">取消</el-button></div></el-col>
        <el-col :span="3"><div><el-button type="primary" size="mini" @click="getCheckedNodes">确定</el-button></div></el-col>
      </el-row>
    </el-popover>
    <el-form :model="popForm" label-width="100px" ref="popForm" :inline="true">
      <el-form-item label="商品分类:" prop="classify">
        <el-input v-model="classifyName" v-popover:classifyPop @focus="getClassify()"></el-input>
        <input type="hidden" v-model="popForm.backcatId" />
      </el-form-item>

      <el-form-item label="品牌名称:" prop="brandId">
        <!-- <el-input v-model="popForm.brand" placeholder="请输入品牌名称"></el-input> -->
        <el-select
          v-model="popForm.brandId"
          filterable
          remote
          placeholder="请输入关键词"
          loading-text="正在检索..."
          no-data-text="暂无数据"
          :remote-method="remoteMethod"
          :loading="brandLoading">
          <el-option
            v-for="item in brandSels"
            :key="item.brandId"
            :label="item.brandName"
            :value="item.brandId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索条件" prop="type">
        <el-select v-model="popForm.type" placeholder="请选择搜索条件">
          <el-option v-for="(item, index) in selectType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称:" prop="keywords" v-if="popForm.type==3">
        <el-input v-model="popForm.keywords" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="SPU编码:" prop="keywords" v-if="popForm.type==1">
        <el-input type="textarea" v-model="popForm.keywords" placeholder="可输入多个SPU编码批量查询，请以“，”逗号分开"></el-input>
      </el-form-item>
      <el-form-item label="货品编码:" prop="keywords" v-if="popForm.type==2">
        <el-input type="textarea" v-model="popForm.keywords" placeholder="可输入多个货品编码批量查询，请以“，”逗号分开"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="editLoading" style="margin-left: 20px;">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import util from '@/assets/js/util'
  export default {
    props:['bus'],
    data(){
      return {
        editLoading:false,
        popForm:{
          backcatId: '',
          brandId: '',
          type: 3
        },
        classifyName: '',
        popVisible:false,
        classifyTree:[],
        defaultProps: {
          children: 'children',
          label: 'catbackName'
        },
        selectType: [
          {
            label: '商品名称搜索',
            value: 3
          },
          {
            label: '货品编码搜索',
            value: 2
          },
          {
            label: 'SPU编码搜索',
            value: 1
          }
        ],
        brandSels: [],
        brandLoading: false
      }
    },
    methods:{
      getCheckedNodes(){
        let self = this,
          arr = this.$refs.classify.getCheckedNodes(),
          classifyArr = [],
          classifyNameArr = [];
        arr.forEach(function(item, index){
          classifyArr.push(item.catbackId);
          classifyNameArr.push(item.catbackName);
        });
        self.popForm.backcatId = util.array.repeatArr(classifyArr).join(',');
        self.classifyName = util.array.repeatArr(classifyNameArr).join(',');
        this.popVisible = false;
      },
      getClassify(){
        let self = this;
        if(!self.classifyTree.length){
          self.$ajax.post(self.$apiUrl.marketing.goodsClassify,{}).then(function(res){
            self.classifyTree = res.data.list;
          });
        }
      },
      remoteMethod(query){
        let self = this;
        if(!query){
          return false;
        }
        this.delay(function(){
          let opt = {
            brandName: query,
            currentPage: 1,
            pageSize: 10
          }
          self.$ajax.post(self.$apiUrl.marketing.getBrandSearch, opt).then(function(res){
            self.brandSels = res.data.list;
          })
        },300);
      },
      getFormat(){
        var self = this;
        this.$ajax.post('http://t.com/marketing-management/promotions/fixed-discount/format',{}).then(function(res){
          self.popForm.format = [].concat(self.popForm.format, res.data);
        });
      },
      onSubmit(){
        this.bus.$emit('search', this.popForm);
      },
      //监听input输入时，延时方法
      delay: (function () {
        var timer = 0;
        return function (callback, time) {
          clearTimeout(timer);
          timer = setTimeout(callback, time);
        };
      })()
    },
    mounted(){
      var self = this;
      // self.getFormat();
    }
  }
</script>
<style lang="scss" scoped>
  .mod-classify-btn{
    margin-top: 10px;
  }
  // .mod-search .el-form--inline .el-form-item{
  // 	width: auto;
  // }
</style>
