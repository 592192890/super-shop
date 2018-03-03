<template>
    <div class="search-dialog">
        <el-dialog title="选择SPU" :visible.sync="isShow" size="small" :before-close="beforeCloseDialog">
            <el-form :model="searchEntity" label-width="80px" label-position="left" class="form">
                <el-row :span="24" :gutter="10">
                    <el-col :span="10">
                        <el-form-item label="商品名称">
                            <el-input v-model="searchEntity.spuName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="商品编码">
                            <el-input v-model="searchEntity.spuBn"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" @click="search(1)">搜索</el-button>
                    </el-col>
                </el-row>
                
                
            </el-form>
            <el-table :data="formEntity"  v-loading="listLoading" highlight-current-row>
                <el-table-column label="选择" show-overflow-tooltip>
                    <template scope="scope">
                            <el-radio class="radio" v-model="selectedProductId" :label="scope.row.spuId"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column property="spuBn" label="商品编码" show-overflow-tooltip></el-table-column>
                <el-table-column property="spuName" label="商品名称" show-overflow-tooltip></el-table-column>
                
            </el-table>
            <el-row style="margin-top:20px">
                <el-col :span="24">
                    <el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:left;" :current-page="currentPage">
                    </el-pagination>
                </el-col>
                
            </el-row>
            <el-row>
                <el-col :span="6" style="float:right">
                    <el-button @click="confirmSelectedSpu" class="confirm-btn">确定</el-button>
                    <el-button @click="beforeCloseDialog">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="tipsDialogVisible"
            size="tiny">
            <span>请选择一个店铺！</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="tipsDialogVisible=false" class="confirm-btn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>
<script>
    // var PAGE_SIZE=20;
    export default {
        props:['isShow','backCateId'],
        data(){
            return {
                listLoading:true,
                isShowDialog:this.isShow,
                tipsDialogVisible:false,
                currentPage:1,
                total:0,
                pageSize:20,
                selectedProductId:'',
                searchEntity:{
                },
                formEntity:[]
            }
        },
        methods:{
            search:function(index){
                this.listLoading=true;

                var url=this.$apiUrl.getMountedSPUListUrl;
                var params=Object.assign({},{
                    currentPage:index||1,
                    pageSize:this.pageSize,
                    catbackId:this.backCateId
                },this.searchEntity)
                this.$ajax.get(url,params).then(res=>{
                    if(res.error==0){
                        this.formEntity=res.data.list;
                        this.listLoading=false;
                        this.currentPage=res.data.pageInfo.currentPage;
                        this.total=res.data.pageInfo.totalRow;
                    }
                })
            },
            confirmSelectedSpu:function(){
                if(!this.selectedProductId){
                    this.tipsDialogVisible=true;
                }else{
                    var spuId=this.selectedProductId;
                    for(var i=0;i<this.formEntity.length;i++){
                        var item=this.formEntity[i];
                        if(item.spuId==spuId){
                            this.$emit('passSelectSpu',item)
                            break;
                        }
                    }
                }
            },
            handleCurrentChange:function(index){
                this.search(index);
            },
            beforeCloseDialog:function(){
                this.$emit('watchDialog',false)
            }
        },
        mounted(){
            this.search();

        }
        
    }
</script>
<style scoped>
    .confirm-btn{
        background-color:#33bbab;
        color:#ffffff;
        border:none;
    }
</style>
<style>
    .search-dialog .el-radio__label{
        display:none;
    }
</style>