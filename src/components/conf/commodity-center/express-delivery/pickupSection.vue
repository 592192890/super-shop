<template>
    <div>
        <!--自提模板-->
        <section class="section">
            <el-row class="title">
                <el-col :span="4">自提模板</el-col>
                <el-col :span="4" :offset="16">
                    <el-button class="primary big-btn" @click="popAddDialog">新增自提模板</el-button>
                </el-col>
            </el-row>
            
            <el-table :data="pickUpList" highlight-current-row style="width: 100%;">
                <el-table-column prop="id" label="排序" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="title" label="模板名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="disabledName" label="状态" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="140">
                    <template scope="scope">
                        <span class="edit-btn" @click="popEditDialog(scope.$index, scope.row)">编辑</span>
                        <span class="delete-btn" @click="handleDelete(scope.$index, scope.row)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </section>

         <!--自提模板弹出框-->
        <section v-if="pickDialogVisible">
            <el-dialog
                :title="pickUpDialogType"
                :visible.sync="pickDialogVisible"
                size="large">
                <el-form :rules="pickRules" ref="ruleForm" :model="pickEntity" label-width="120px" label-position="left" class="form">
                    <el-row :span="24" :gutter="10">
                        <el-col :span="10">
                            <el-form-item label="模板名称" required prop="title">
                                <el-input v-model="pickEntity.title"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" :gutter="10">
                        <el-col :span="10">
                            <el-form-item label="是否启用" required>
                                <el-radio-group v-model="pickEntity.disabled">
                                    <el-radio :label="false">启用</el-radio>
                                    <el-radio :label="true">关闭</el-radio>
                                </el-radio-group>
                                    
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" :gutter="10">
                        <el-col :span="20">
                            <el-form-item label="自提时间">
                                <el-checkbox v-model="pickEntity.needZtTime"></el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" :gutter="10">
                        <el-col :span="20">
                            <el-form-item label="关联自提点">
                                <el-checkbox style="margin-left:25px" v-model="isSelectedAll" @change="selectAll">全选</el-checkbox>
                                <el-tree
                                    :data="treeData"
                                    show-checkbox
                                    node-key="id"
                                    ref="tree"
                                    highlight-current
                                    @check-change="handleCheckChange"
                                    :props="defaultProps">
                                </el-tree>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" :gutter="10">
                        <el-col :span="20">
                            <el-form-item label="已关联自提点" required>
                                <div style="display:inline-block;color:#3dc8f6;padding-left:20px" v-for="item in selfPickupSiteIdList" :key="item.id">
                                    {{item.name}}
                                    <i class="iconfontmod" style="padding-left:5px;color:#ff4949;cursor:pointer" @click="deleteSelectedPickUp(item.id)">&#xe60d;</i>
                                    
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm('ruleForm')" class="confirm-btn">确 定</el-button>
                    <el-button @click="pickDialogVisible=false" class="cancel-btn">取 消</el-button>
                </span>
               
            </el-dialog>
            
        </section>
        
        
    </div>
</template>
<script>
    export default {
        data(){
            return {
                provinceList:[],
                cityList:[],
                districtList:[],
                streetList:[],
                pickupPortList:[],
                isSelectedAll:false,//是否全选地址
                selfPickupSiteIdList:[],
                treeData: [],//树组件内容
                defaultProps: {
                    children: 'children',
                    isLeaf:'leaf',
                    label: 'name'
                },
                pickUpDialogType:'新增自提模板',
                pickUpList:[],
                pickEntity:{
                    disabled:false,
                    needZtTime:false
                },

                ruleForm:{
                    title:''
                },
                pickRules:{
                    title:[
                        {required:true,min:2,max:50,message:'2-50个字符'}
                    ]
                },
                
                pickFormEntity:{},
                pickDialogVisible:false,
                radio:'',
                checked:'',
            
            }
        },
        methods:{
            handleDelete(index,row){
                var url=this.$apiUrl.deletePickUpPortUrl;
                var idsArr=[row.id];
                var params={};
                params.idsArr=JSON.stringify(idsArr);

                this.$confirm('确定删除这条数据么?',{type:'warning'}).then((res)=>{
					if(res){
						this.$ajax.post(url,params).then((res)=>{
							if(res.error == 0){
								this.$message.success('删除成功!');
								this.getPickUpList();
							}
						});	
					}
				}).catch(() => {});
            },
            handleCheckChange(data, checked, indeterminate) {
                
                //获得所有的checked叶子节点
                this.selfPickupSiteIdList=this.$refs.tree.getCheckedNodes(true)
                
                //判断是否全选
                if(!checked){
                    this.isSelectedAll=false;
                }else{
                    this.judgeisSelectedAll();
                    
                }
            },
            judgeisSelectedAll(){
                //获得所有被选中的id
                var allSelectedKeys=this.$refs.tree.getCheckedKeys();
                for(var i=0;i<this.treeData.length;i++){
                    var item=this.treeData[i];
                    if(allSelectedKeys.indexOf(item.id)==-1){
                        this.isSelectedAll=false;
                        break;
                    }
                    if(i==this.treeData.length-1){
                        this.isSelectedAll=true;
                    }
                }
                    
            },
            popAddDialog(){
                this.isSelectedAll=false;
                this.selfPickupSiteIdList=[];

                this.pickUpDialogType="新增自提模板"
                this.pickDialogVisible=true;
                this.pickEntity={
                    disabled:false,
                    needZtTime:false
                },
                this.getRelatedPickUpPortList().then(res=>{
                    if(res.error==0){
                        this.treeData=res.data
                    }
                })
            },
            popEditDialog(index,row){
                this.isSelectedAll=false;
                this.pickUpDialogType="编辑自提模板"
                this.pickDialogVisible=true;
                Promise.all([this.getRelatedPickUpPortList(),this.getPickUpDetail(row.id)]).then(results=>{
                    if(results[0].error==0){
                        this.treeData=results[0].data
                    }
                    if(results[1].error==0){
                        this.pickEntity=results[1].data

                        var selectedPickUpIds=[];
                        this.selfPickupSiteIdList=[];
                        this.pickEntity.selfPickupSiteList.forEach(v=>{
                            selectedPickUpIds.push('a'+v.id);
                            this.selfPickupSiteIdList.push({id:'a'+v.id,name:v.name})
                        })

                        
                        //设置已选中的自提点
                        this.$refs.tree.setCheckedKeys(selectedPickUpIds,true)

                        this.judgeisSelectedAll();
                    }
                }).catch(err=>{
                    this.$message({
                        type:'error',
                        message:err
                    })
                })
                
                
            },
            deleteSelectedPickUp(id){
                var selectedLeafNodeArr=this.$refs.tree.getCheckedKeys(true);
            
                var selectedLeafNodeArr=selectedLeafNodeArr.filter(v=>{
                    return v!=id
                })

                this.$refs.tree.setCheckedKeys(selectedLeafNodeArr,true)

                //获得所有的checked叶子节点
                this.selfPickupSiteIdList=this.$refs.tree.getCheckedNodes(true)
            },
            submitForm(formName){
                this.$refs[formName].validate((valid) => {   
                    if(valid){
                        //判断是否选择了自提点
                        if(!this.selfPickupSiteIdList.length){
                            this.$message({
                                type:'warning',
                                message:'请选择自提点'
                            })
                        }else{
                            var url,tips;
                            if(this.pickUpDialogType=="新增自提模板"){
                                url=this.$apiUrl.addPickUpPortUrl;
                                tips='新增自提点成功！'
                            }else{
                                url=this.$apiUrl.updatePickUpPortUrl;
                                tips='更新自提点成功！'
                            }
                            
                            var params=Object.assign({},this.pickEntity);

                            var ids=[];
                            this.selfPickupSiteIdList.forEach(v=>{
                                ids.push(v.id.replace(/a/g,''))
                            })
                            params.selfPickupSiteIdList=JSON.stringify(ids);
                            this.$ajax.post(url,params).then(res=>{
                                if(res.error==0){
                                    this.$message({
                                        type:'success',
                                        message:tips
                                    })
                                    this.pickDialogVisible=false;
                                    this.getPickUpList();
                                }
                            })
                        }
                    }else{
                        return false;
                    }
                })
            },
            
            getPickUpList(){
                var url=this.$apiUrl.getPickUpPortListUrl;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        this.pickUpList=res.data;
                    }
                })
            },
            getPickUpDetail(id){
                var url=this.$apiUrl.getPickUpPortDetailUrl+"?id="+id;
                return this.$ajax.get(url)
            },
            updatePickUp(){
                var url=this.$apiUrl.updatePickUpPortUrl;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        this.$message({
                            type:'success',
                            message:'更新自提点成功！'
                        })
                    }
                })
            },
            addPickUp(){
                var url=this.$apiUrl.addPickUpPortUrl;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        this.$message({
                            type:'success',
                            message:'增加自提点成功！'
                        })
                    }
                })
            },
            getProvinceList(){
                var url=this.$apiUrl.getCascaderAddressUrl;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        this.provinceList=res.data.list;
                        
                       
                    }
                })
            },
            getCityList(id){
                var url=this.$apiUrl.getCascaderAddressUrl+"?parentId="+id;
                return this.$ajax.get(url)
                
            },
            getDistrictList(id){
                var url=this.$apiUrl.getCascaderAddressUrl+"?parentId="+id;
                return this.$ajax.get(url)
            },
            getStreetList(id){
                var url=this.$apiUrl.getCascaderAddressUrl+"?parentId="+id;
                return this.$ajax.get(url)
            },
            getRelatedPickUpPortList(){
                var url=this.$apiUrl.getRelatedPickUpPortUrl;
                return this.$ajax.get(url)

            },
            selectAll(){
                if(this.isSelectedAll){
                    var provinceIds=[];
                    this.treeData.forEach(v=>{
                        provinceIds.push(v.id)
                    })
                    this.$refs.tree.setCheckedKeys(provinceIds)

                    //获得所有的checked叶子节点
                    this.selfPickupSiteIdList=this.$refs.tree.getCheckedNodes(true)
                }else{
                    this.$refs.tree.setCheckedKeys([])
                    this.selfPickupSiteIdList=[];
                }

            }
        },
        mounted(){
            //获得自提点列表
            this.getPickUpList()

            //获得省
            this.getProvinceList();
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