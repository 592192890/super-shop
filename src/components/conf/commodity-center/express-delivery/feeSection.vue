<template>
    <div>
        <!--运费模板-->
        <section class="section" v-loading="loading">
            <el-row class="title">
                <el-col :span="4">运费模板</el-col>
                <el-col :span="4" :offset="16">
                    <el-button class="primary big-btn" @click="popAddFeeDialog">新增运费模板</el-button>
                </el-col>
            </el-row>
            
            <el-table :data="feeList" highlight-current-row style="width: 100%;">
				<el-table-column prop="id" label="排序" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="title" label="模板名称" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="disabledName" label="状态" show-overflow-tooltip>
				</el-table-column>
				<el-table-column label="操作" width="140">
					<template scope="scope">
						<span class="edit-btn" @click="popEditFeeDialog(scope.$index, scope.row)">编辑</span>
						<span class="delete-btn" @click="handleFeeDelete(scope.$index, scope.row)">删除</span>
					</template>
				</el-table-column>
			</el-table>
        </section>

        <!--运费模板弹出框-->
        <fee-dialog :feeEntity="feeEntity" :type="feeDialogType" v-if="feeDialogVisible" :feeDialogVisible="feeDialogVisible" @isShow="isShowFeeDialog"></fee-dialog>
        

    </div>
</template>
<script>
    import feeDialog from './feeDialog'
    export default {
        components:{
            feeDialog,
        },
        data(){
            return {
                feeDialogType:'增加运费模板',
                feeList:[],
                feeDialogVisible:false,
                loading:true,
                feeEntity:{
                    type:0,
                    disabled:false,
                    shopTransportConfigList:[]
                },
            }
        },
        methods:{
            popAddFeeDialog(){
                this.feeDialogType="增加运费模板";
                this.feeDialogVisible=true;
                
            },
            popEditFeeDialog(index,row){
                
                this.feeDialogType="编辑运费模板";

                var url=this.$apiUrl.getFeeDetailUrl;
                var params={
                    id:row.id
                }
                this.$ajax.get(url,params).then(res=>{
                    if(res.error==0){
                        this.feeEntity=res.data;

                        //格式化地区字符串
                        
                        var addressArr=['province','city','district','street']
                        this.feeEntity.shopTransportConfigList.forEach(v=>{
                            //如果有area，需要格式化area
                            if(v.area){
                                v.tempArea=v.area;
                                v.tempAreaName=v.areaName;
                                //格式化id
                                v.area=v.area.replace(/\|close/,'');
                                
                                var obj={};
                                v.area.split(',').forEach((v,i)=>{
                                    obj[addressArr[i]]={};
                                    obj[addressArr[i]].id=v;
                                })
                                // 格式化name

                                v.areaName.split(',').forEach((v,i)=>{
                                    obj[addressArr[i]].name=v;
                                })

                                v.area=obj;
                            }
                        })
                        this.feeDialogVisible=true;

                        
                    }
                })
                
            },
            handleFeeDelete(index,row){
                var url=this.$apiUrl.deleteFeeUrl;
                var idsArr=[row.id];
                var params={
                    idsArr:JSON.stringify(idsArr)
                }
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$ajax.post(url,params).then(res=>{
                            if(res.error==0){
                                this.getFeeList();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }
                        })
                        
                    }).catch(() => {
                            
                });

                
            },
            isShowFeeDialog(val){
                this.feeDialogVisible=val;
                this.getFeeList();
            },
            getFeeList(){
                var url=this.$apiUrl.getFeeListUrl;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        this.feeList=res.data;
                        this.loading=false;
                    }
                })
            },
        },
        mounted(){
            //获得运费列表
            this.getFeeList();
        }
    }
</script>
<style scoped lang="scss">
    .section{
        padding-bottom:20px;
        background-color:#fff;
        padding-left:30px;
        padding-right:30px;
        &.last{
            padding-bottom:36px;
        }
    }
    .title{
        font-size:18px;
        height:70px;
        line-height:70px;
        
        color:#3dc8f6;
        border-bottom:1px solid #f3f5f7
    }
    .big-btn{
        font-size:16px;
        border:1px solid #3dc8f6;
        color:#3dc8f6;
    }
    .address-content{
        .item{
            font-size:14px;
            color:#333333;
            padding:12px;
            &.name{
                font-size:18px;
                i{
                    color:#3dc8f6;
                    font-size:20px;
                    cursor:pointer;
                }
                
            }
        }
    }
    .cancel-btn{
        background-color:#fff;
        color:#333;
        border:1px solid #e5e5e5;
    }
    .edit-btn{
        color:#3dc8f6;
        cursor:pointer;
        line-height:36px;
        margin-right:10px;
    }
    .delete-btn{
        color:#ff4949;
        cursor:pointer;
        line-height:36px;
    }


</style>