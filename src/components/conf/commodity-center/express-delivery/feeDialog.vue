<template>
    <div class="fee-template">
        <el-dialog
            :title="type"
            :visible.sync="subFeeDialogVisible"
            :before-close="handleWrapClose"
            size="large">
            <el-form :rules="feeRules" ref="ruleForm" :model="formEntity" label-width="100px" label-position="left" class="form">
                <el-row :span="24" :gutter="10">
                    <el-col :span="10">
                        <el-form-item label="模板类型" required>
                            <el-select v-model="formEntity.type" :disabled="disabledTemplate" placeholder="请选择类型">
                                <el-option
                                    v-for="item in typeList"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24" :gutter="10">
                    <el-col :span="10">
                        <el-form-item label="模板名称" required prop="title">
                            <el-input v-model="formEntity.title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24" :gutter="10">
                    <el-col :span="20">
                        <el-form-item label="是否启用" required>
                            <el-radio-group v-model="formEntity.disabled">
                                <el-radio :label="false">启用</el-radio>
                                <el-radio :label="true">关闭</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24" :gutter="10">
                    <el-col :span="10">
                        <el-form-item label="运费说明">
                            <el-input v-model="formEntity.description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--配送表单-->  
                <div class="fee-template">
                    <el-row :gutter="10" class="table-header">
                        <el-col :span="7" v-if="formEntity.type==0">
                            <div class="cell">配送地区</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="cell">首重(kg)</div>
                        </el-col>
                        <el-col :span="3" v-if="formEntity.type==3">
                            <div class="cell">首公里</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="cell">首费(元)</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="cell">续重(kg)</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="cell">续费(元)</div>
                        </el-col>
                        <el-col :span="3"  v-if="formEntity.type==3">
                            <div class="cell">续公里</div>
                        </el-col>
                        <el-col :span="3"  v-if="formEntity.type==3">
                            <div class="cell">续费(元)</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="cell">操作</div>
                        </el-col>
                    </el-row>
                    <el-row class="cancel-fee" :class="{'first':index==0}" :gutter="10" v-for="(item,index) in formEntity.shopTransportConfigList" :key="item.id" style="margin-bottom:5px;">
                        <el-col :span="7" v-if="formEntity.type==0" style="height:36px">
                            <cascader-select4 :index="index" :type="cascaderType" :circleItem="item.area" v-on:returnCascaderArr="getCascaderArr"></cascader-select4>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item
                                :prop="'shopTransportConfigList.' + index + '.firstUnit'"
                                :rules="[
                                    { required: true, message: '请输入首重', trigger: 'change' },
                                    { validator:$validate.threeDecimalNumber}
                                ]">
                                <el-input v-model="item.firstUnit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" v-if="formEntity.type==3">
                            <el-form-item
                                :prop="'shopTransportConfigList.' + index + '.firstDistance'"
                                :rules="[
                                    { required: true, message: '请输入首公里', trigger: 'change' },
                                    { validator:$validate.threeDecimalNumber}
                                ]">
                                <el-input v-model="item.firstDistance"></el-input>
                            </el-form-item>
                            
                        </el-col>
                        <el-col :span="3">
                            <el-form-item
                                :prop="'shopTransportConfigList.' + index + '.firstPrice'"
                                :rules="[
                                    { required: true, message: '请输入首费', trigger: 'change' },
                                    { validator:$validate.twoDecimalNumber}
                                ]">
                                <el-input v-model="item.firstPrice"></el-input>
                            </el-form-item>
                            
                        </el-col>
                        <el-col :span="3">
                            <el-form-item
                                :prop="'shopTransportConfigList.' + index + '.continueUnit'"
                                :rules="[
                                    { required: true, message: '请输入续重', trigger: 'change' },
                                    { validator:$validate.threeDecimalNumber}
                                ]">
                                <el-input v-model="item.continueUnit"></el-input>
                            </el-form-item>
                            
                        </el-col>
                        <el-col :span="3">
                            <el-form-item
                                :prop="'shopTransportConfigList.' + index + '.continuePrice'"
                                :rules="[
                                    { required: true, message: '请输入续费', trigger: 'change' },
                                    { validator:$validate.twoDecimalNumber}
                                ]">
                                <el-input v-model="item.continuePrice"></el-input>
                            </el-form-item>
                            
                        </el-col>
                        <el-col :span="3" v-if="formEntity.type==3">
                            <el-form-item
                                :prop="'shopTransportConfigList.' + index + '.continueDistance'"
                                :rules="[
                                    { required: true, message: '请输入公里', trigger: 'change' },
                                    { validator:$validate.threeDecimalNumber}
                                ]">
                                <el-input v-model="item.continueDistance"></el-input>
                            </el-form-item>
                            
                        </el-col>
                        <el-col :span="3" v-if="formEntity.type==3">
                             <el-form-item
                                :prop="'shopTransportConfigList.' + index + '.continueDistancePrice'"
                                :rules="[
                                    { required: true, message: '请输入续费', trigger: 'change' },
                                    { validator:$validate.twoDecimalNumber}
                                ]">
                                <el-input v-model="item.continueDistancePrice"></el-input>
                            </el-form-item>
                            
                        </el-col>
                        <el-col :span="3">
                            <span class="delete-btn" @click="handleDelete(index)" v-if="formEntity.shopTransportConfigList.length>1">删除</span>
                            <span class="cancelFee-btn" @click="handleFreeFreight(item,index)">免运费设置</span>
                        </el-col>
                    </el-row>
                    <el-row style="color:#3dc8f6;margin-top:10px;margin-bottom:10px;">
                        <i class="icon iconfontmod" style="cursor:pointer" @click="addTableData">&#xe655;</i>
                    </el-row>
                </div>
                <el-row style="text-align:right">
                    <el-button type="primary" @click="submitForm('ruleForm')" class="confirm-btn">确 定</el-button>
                    <el-button class="cancel-btn" @click="handleWrapClose">取消</el-button>
                </el-row>
            </el-form>
            
        </el-dialog>
       <!--免运费模板设置-->
        <section v-if="cancelFeeDialogVisible">
            <el-dialog
                title="免运费模板设置"
                :visible.sync="cancelFeeDialogVisible"
                :before-close="handleClose"
                size="small">
                <el-form :model="freightAmountItemArr" ref="cancelFeeValidateForm" label-width="100px" label-position="left" class="form cancel-fee">
                    <el-row :gutter="10"  class="table-header">
                        <el-col :span="6">
                            <div class="cell">免运费金额(元)</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="cell">免运费重量(kg)</div>
                        </el-col>
                        <el-col :span="6" v-if="formEntity.type==3">
                            <div class="cell">免运费公里</div>
                        </el-col>
                        <el-col :span="8" v-if="formEntity.type==0">
                            <div class="cell" style="line-height:20px">免去的运费<br>(非必填，非空则为按重量免邮)</div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell">操作</div>
                        </el-col>
                    </el-row>
                    <el-row class="custom-row" :class="{'first':index==0}" :gutter="10" v-for="(item,index) in freightAmountItemArr.arr" :key="index">
                        <el-col :span="6">
                            <el-form-item
                                :prop="'arr.' + index + '.money'"
                                :rules="[
                                    { required: true, message: '不能为空', trigger: 'change' },
                                    { validator:$validate.twoDecimalNumber}
                                ]">
                                <el-input v-model="item.money"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                :prop="'arr.' + index + '.weight'"
                                :rules="[
                                    { required: true, message: '不能为空', trigger: 'change' },
                                    { validator:$validate.threeDecimalNumber}
                                ]">
                                <el-input v-model="item.weight"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="formEntity.type==3">
                            <el-form-item
                                :prop="'arr.' + index + '.distance'"
                                :rules="[
                                    { required: true, message: '不能为空', trigger: 'change' },
                                    { validator:$validate.threeDecimalNumber}
                                ]">
                                <el-input v-model="item.distance"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="formEntity.type==0">
                            <el-form-item
                                :prop="'arr.' + index + '.freeMoney'"
                                :rules="[
                                    
                                    { validator:$validate.twoDecimalNumber}
                                ]">
                                <el-input v-model="item.freeMoney"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <span class="delete-btn" @click="handleDeleteFeeSet(index)" >删除</span>
                        </el-col>
                    </el-row>
                    <el-row style="color:#3dc8f6;margin-top:10px;margin-bottom:10px;">
                        <i class="icon iconfontmod" style="cursor:pointer" @click="addFeeSetTableData">&#xe655;</i>
                    </el-row>
                    <el-row style="text-align:right">
                        <el-button type="primary" @click="comfirmSetFee('cancelFeeValidateForm')" class="confirm-btn">确 定</el-button>
                        <el-button @click="handleClose" class="cancel-btn">取消</el-button>
                    </el-row>
                    
                </el-form>
                
            </el-dialog>
        </section>
        
    </div>
</template>
<script>
import cascaderSelect4 from '@/components/common/cascaderSelect4'
var tempFreightAmountItem={};//备份免运费设置对象
export default {
    components:{
        cascaderSelect4
    },
    props:['feeEntity','feeDialogVisible','type'],
    data(){
        return {
            feeDialogType:this.type,
            cascaderType:'add',//判断四级菜单是新增还是编辑
            disabledTemplate:false,
            formEntity:{
                type:0,
                disabled:false,
                shopTransportConfigList:[{}],
                title:''
            },
            freightAmountItemArr:{},
            subFeeDialogVisible:this.feeDialogVisible,
            cancelFeeDialogVisible:false,
            cancelFeeformEntity:{},
            radio:'',
            checked:'',
            typeList:[
                {id:0,value:'全国配送'},
                {id:3,value:'本地配送'}
            ],
            ruleForm:{
                title:''
            },
            feeRules:{
                title:[
                    {required:true,min:2,max:50,message:'2-50个字符'}
                ]
            },
        }
    },
    methods:{
        //确定免运费设置
        comfirmSetFee(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    
                    var index=this.freightAmountItemArr.index;
                    var arr=this.freightAmountItemArr.arr;

                    this.formEntity.shopTransportConfigList[index].freightAmountList=arr;

                    this.cancelFeeDialogVisible=false;
                    
                    
                } else {
                    
                    return false;
                }
            });
            
        },
        //免运费设置
        addFeeSetTableData(){
            this.freightAmountItemArr.arr.push({
            })
        },
        //免运费设置
        handleDeleteFeeSet(index){
            
            this.freightAmountItemArr.arr=this.freightAmountItemArr.arr.filter((v,i)=>{
                return i!=index
            })
           
        },
        handleDelete(index){
            this.formEntity.shopTransportConfigList=this.formEntity.shopTransportConfigList.filter((v,i)=>{
                return i!=index;
            })
        },
        
        addTableData(){
            var obj={
                area:'',
                areaName:''
            }
            this.formEntity.shopTransportConfigList.push(obj)
        },
        //得到省市区
        getCascaderArr:function(result){
            if(!result){
                return;
            }
            var address=result.address;
            var index=result.index;

            //如果没有选择完整的省市区，需要在后面加一个|close
            if(address.street){
                this.formEntity.shopTransportConfigList[index].areaName=address.province.name+","+address.city.name+","+address.district.name+","+address.street.name;
                this.formEntity.shopTransportConfigList[index].area=address.province.id+","+address.city.id+","+address.district.id+","+address.street.id;
            }else if(address.district){
                this.formEntity.shopTransportConfigList[index].areaName=address.province.name+","+address.city.name+","+address.district.name;
                this.formEntity.shopTransportConfigList[index].area=address.province.id+","+address.city.id+","+address.district.id+"|close";
            }else if(address.city){
                this.formEntity.shopTransportConfigList[index].areaName=address.province.name+","+address.city.name;
                this.formEntity.shopTransportConfigList[index].area=address.province.id+","+address.city.id+"|close";
            }else if(address.province){
                this.formEntity.shopTransportConfigList[index].areaName=address.province.name;
                this.formEntity.shopTransportConfigList[index].area=address.province.id+"|close";
            }
            
            
            
            
        },
        handleFreeFreight(item,index){
           
            this.freightAmountItemArr={
                index:index,
                arr:item.freightAmountList||[
                    {}
                ]
            }

            //备份免运费设置对象，以防用户修改了改对象后，点击取消按钮，然后再次进入该对话框，这时数据会改变
            tempFreightAmountItem=JSON.parse(JSON.stringify(this.freightAmountItemArr));

            
            this.cancelFeeDialogVisible=true;
        },
        handleWrapClose(){
            this.subFeeDialogVisible=false;
            this.$emit('isShow',false)
        },
        handleClose(){
            //一旦点击取消按钮，免运费对话框里面的对象需要还原，模拟从数据库中重新读取
            var index=tempFreightAmountItem.index;
            
            this.formEntity.shopTransportConfigList[index].freightAmountList=tempFreightAmountItem.arr;

            
            this.cancelFeeDialogVisible=false;
        },
        submitForm(formName){
            this.$refs[formName].validate((valid) => {     
                if(valid){
                    var params=Object.assign({},this.formEntity)
                    
                    
                    for(var i=0;i<params.shopTransportConfigList.length;i++){
                        var item=params.shopTransportConfigList[i];
                        
                        //判断更新时，四级地址是否更新了，如果没更新，需要将area和areaName还原成后端接口返回的格式（都是操蛋的后端接口格式不一致造成的，我也懒得管了）
                        //全国配送不需要地址
                        if(params.type!=3){
                            if(!item.area){
                                this.$message({
                                    type:'warning',
                                    message:'请输入配送地区！'
                                })
                                return;
                            }
                            if(item.area&&item.area.province){
                                item.area=item.tempArea;
                                item.areaName=item.tempAreaName
                            }
                        }
                    }
                    params.shopTransportConfigList.forEach(v=>{
                        if(!v.freightAmountList){
                            v.freightAmountList=[]
                        }else{
                            if(v.freightAmountList.length==1&&!v.freightAmountList[0].money){
                                v.freightAmountList=[];
                            }
                        }
                        
                    })
                    params.shopTransportConfigList=JSON.stringify(params.shopTransportConfigList)

                    var tips="";
                    if(this.feeDialogType=='增加运费模板'){
                        var url=this.$apiUrl.addFeeUrl;
                        
                        tips='增加运费模板成功！';
                    }else{
                        var url=this.$apiUrl.updateFeeUrl;

                        tips='修改运费模板成功！';
                    }

                    

                    this.$ajax.post(url,params).then(res=>{
                        if(res.error==0){
                            this.$message({
                                type:'success',
                                message:tips
                            })
                            this.subFeeDialogVisible=false;
                            this.$emit('isShow',false)
                        }
                    })
                    
                }else{
                    
                    return false;
                }
            })
            
            

            
        }
    },
    mounted(){
        
        if(this.type.indexOf('增加')!=-1){
            this.cascaderType="add"
        }else{
            var obj=this.feeEntity;
            this.formEntity=Object.assign({},this.formEntity,obj);
            this.cascaderType="edit"
        }

        //判断当前用户是哪种业态
        //如果是超市业态（002），只能本地配送
        //如果是百货业态（001）和其他第三方业态，只能是全国配送
        var businessTypeCode=localStorage.getItem('currentUserBussinessTypeCode')

        if(businessTypeCode=='002'){
            this.formEntity.type=3;
            this.disabledTemplate=true;
        }else{
            this.formEntity.type=0;
            this.disabledTemplate=true;
        }
    }
}
</script>
<style scoped lang="scss">
.fee-template{
    .table-header{
        background-color:#f3f5f7;
        
    }
    
    .cell{
        height:40px;
        line-height:40px;
    }
    .cancel-btn{
        background-color:#fff;
        color:#333;
        border:1px solid #e5e5e5;
    }
    .delete-btn{
        color:#ff4949;
        cursor:pointer;
        line-height:36px;
    }
    .cancelFee-btn{
        cursor:pointer;
        color:#3dc8f6;
        line-height:36px;
    }
}
.cancel-fee.first{
    margin-top:22px!important;
}
.custom-row{
    margin-top:5px;
    margin-bottom:5px;
    &.first{
        margin-top:22px!important;
    }
}
</style>
<style>
.fee-template .cancel-fee .el-form-item__content{
    margin-left:0px!important;
}
.fee-template .delevery-address .el-form-item__error{
    top:36px!important;
}
</style>