<template>
    <div class="express-delivery">
       <!--发货地址-->
        <section class="section">
            <el-row class="title">
                <el-col :span="4">发货地址</el-col>
            </el-row>
            
            <div class="address-content" style="width:600px;border:1px solid #e5e5e5;margin-top:15px;"  v-if="deliveryAddressEntity.contact">
                <el-row class="item name">
                    <el-col :span="8">{{deliveryAddressEntity.contact}}</el-col>
                    <el-col :span="4" :offset="11" style="text-align:right">
                        <i class="icon iconfontmod" @click="getExpressAddressDetail(deliveryAddressEntity.id,'编辑发货地址')">&#xe64e;</i>
                    </el-col>
                </el-row>
                <el-row class="item">
                    <el-col>地区：{{deliveryAddressEntity.area.split(':')[0]}}</el-col>
                </el-row>
                <el-row class="item">
                    <el-col>地址：{{deliveryAddressEntity.address}}</el-col>
                </el-row>
                <el-row class="item">
                    <el-col>手机：{{deliveryAddressEntity.mobile}}</el-col>
                </el-row>
                <el-row class="item">
                    <el-col>电话：{{deliveryAddressEntity.telphone}}</el-col>
                </el-row>
            </div>
            <div class="add-address-content"  v-if="!deliveryAddressEntity.contact">
                <i class="iconfontmod" @click="popDeliveryDialog">&#xe655;</i>
            </div>
        </section>
        <!--退货地址-->
        <section class="section last">
            <el-row class="title">
                <el-col :span="4">退货地址</el-col>
            </el-row>
            
            <div class="address-content"  v-if="returnAddressEntity.contact" style="width:600px;border:1px solid #e5e5e5;margin-top:15px;">
                <el-row class="item name">
                    <el-col :span="8">{{returnAddressEntity.contact}}</el-col>
                    <el-col :span="4" :offset="11" style="text-align:right">
                        <i class="icon iconfontmod" @click="getExpressAddressDetail(returnAddressEntity.id,'编辑退货地址')">&#xe64e;</i>
                    </el-col>
                </el-row>
                <el-row class="item">
                    <el-col>地区：{{returnAddressEntity.area.split(':')[0]}}</el-col>
                </el-row>
                <el-row class="item">
                    <el-col>地址：{{returnAddressEntity.address}}</el-col>
                </el-row>
                <el-row class="item">
                    <el-col>手机：{{returnAddressEntity.mobile}}</el-col>
                </el-row>
                <el-row class="item">
                    <el-col>电话：{{returnAddressEntity.telphone}}</el-col>
                </el-row>
            </div>
            <div class="add-address-content"  v-if="!returnAddressEntity.contact">
                <i class="iconfontmod" @click="popReturnDialog">&#xe655;</i>
            </div>
        </section>
        <!--发货地址/退货地址弹出框-->
        <section v-if="addressDialogVisible">
            <el-dialog
            :title="addressDialogTitle"
            :visible.sync="addressDialogVisible"
            :before-close="handleClose"
            size="small">
                <el-form :rules="addressRules" ref="ruleForm" :model="dialogAddressEntity" label-width="100px" label-position="left" class="form">
                    <el-row :span="24" :gutter="10">
                        <el-col :span="20">
                            <el-form-item label="联系人" prop="contact" required>
                                <el-input v-model="dialogAddressEntity.contact" placeholder="请输入联系人"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" :gutter="10" class="cascade">
                        <el-col :span="24">
                            <el-form-item label="所在地区" required>
                                <el-select placeholder="请选择省" v-model="dialogAddressEntity.selectProvinceId" @change="changeProvince(dialogAddressEntity.selectProvinceId)">
                                    <el-option v-for="item in provinceList" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select placeholder="请选择市" v-model="dialogAddressEntity.selectCityId" @change="changeCity(dialogAddressEntity.selectCityId)">
                                    <el-option v-for="item in cityList" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select placeholder="请选择区" v-model="dialogAddressEntity.selectDistrictId" @change="changeDistrict(dialogAddressEntity.selectDistrictId)">
                                    <el-option v-for="item in districtList" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item prop="address">
                                <el-input v-model="dialogAddressEntity.address" placeholder="请输入详细地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" :gutter="10">
                        <el-col :span="20">
                            <el-form-item label="邮政编码" prop="postalCode" required>
                                <el-input v-model="dialogAddressEntity.postalCode" placeholder="请输入邮政编码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" :gutter="10">
                        <el-col :span="10">
                            <el-form-item label="电话号码" prop="telphone">
                                <el-input v-model="dialogAddressEntity.telphone" placeholder="请输入区号-电话号码"></el-input>
                                
                            </el-form-item>
                        </el-col>
                        <!-- <div style="float: left; height: 36px; line-height: 36px; padding: 0px 20px;">——</div>
                        <el-col :span="8" class="phone">
                            <el-form-item prop="telphone">
                                <el-input v-model="dialogAddressEntity.telphone" placeholder="请输入电话号码"></el-input>
                                
                            </el-form-item>
                        </el-col> -->
                    </el-row>
                    <el-row :span="24" :gutter="10">
                        <el-col :span="10">
                            <el-form-item label="手机号" prop="mobile">
                                <el-input v-model="dialogAddressEntity.mobile" placeholder="请输入手机号"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" :gutter="10">
                        <el-col :span="20">
                            <el-form-item label="备注" prop="remark">
                                <el-input type="textarea" :rows="2" v-model="dialogAddressEntity.remark"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" :gutter="10">
                        <el-col :span="20">
                            <el-form-item>
                                温馨提示：手机号码和电话号码必选其一
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6" :offset="16">
                            <el-button type="primary" @click="addOrUpdateExpressAddress('ruleForm')" class="confirm-btn">确 定</el-button>
                            <el-button @click="handleClose" class="cancel-btn">取 消</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                
            </el-dialog>
        </section>
        
        
    </div>
</template>
<script>
    import Util from '@/assets/js/util.js'
    export default {
        data(){
            var isPostCode=(rule, value, callback) => {
                if (!/^[1-9][0-9]{5}$/.test(value)) {

                    return callback(new Error('请输入正确的邮政编码'));

                }
                return callback();
            }
            var isPhoneNumber=(rule, value, callback) => {
                if (!value || value.trim() == '') {
                return callback();
                }
                if (!/^(\d{3,4}-)?\d{7,8}$/.test(value)) {

                return callback(new Error('请输入正确的电话号码'));

                }
                return callback();
            }
            return {
                provinceList:[],
                cityList:[],
                districtList:[],
                indexProvince:0,
                indexCity:0,
                indexDistrict:0,
                ruleForm:{
                    contact:'',
                    address:'',
                    postalCode:'',
                    telphone:'',
                    mobile:'',
                    remark:''
                },
                addressRules:{
                    contact:[
                        {required:true,min:2,max:50,message:'2-50个字符',trigger: 'change'}
                    ],
                    address:[
                        {required:true,min:2,max:50,message:'只能输入2-50位的字符',trigger: 'change'}
                    ],
                    postalCode:[
                        {validator:isPostCode,trigger: 'change'}
                    ],
                    telphone:[
                        {validator:isPhoneNumber,trigger: 'change'}
                    ],
                    mobile:[
                        {validator:Util.validateForm.isMobileNumber}
                    ],
                    remark:[
                        {min:0,max:255,message:'备注只能输入0-255位的字符',trigger: 'change'}
                    ]
                },
                

                addressDialogTitle:"增加收货地址",
                deliveryAddressEntity:{},
                returnAddressEntity:{},

                dialogAddressEntity:{
                    selectProvinceId:'',
                    selectCityId:"",
                    selectDistrictId:'',
                    area:{
                        province:{
                            id:'',
                            name:''
                        },
                        city:{
                            id:'',
                            name:''
                        },
                        district:{
                            id:'',
                            name:''
                        }
                    }
                },
               
                addressDialogVisible:false,

            }
        },
        methods:{
            handleClose(){
                this.dialogAddressEntity={
                    selectProvinceId:'',
                    selectCityId:"",
                    selectDistrictId:'',
                    area:{
                        province:{
                            id:'',
                            name:''
                        },
                        city:{
                            id:'',
                            name:''
                        },
                        district:{
                            id:'',
                            name:''
                        }
                    }
                }
                this.addressDialogVisible=false;
            },
            popReturnDialog(){
                this.addressDialogVisible=true
                this.addressDialogTitle="增加退货地址";
                this.dialogAddressEntity={
                    selectProvinceId:'',
                    selectCityId:"",
                    selectDistrictId:'',
                    area:{
                        province:{
                            id:'',
                            name:''
                        },
                        city:{
                            id:'',
                            name:''
                        },
                        district:{
                            id:'',
                            name:''
                        }
                    }
                }
                //大于1就行
                this.indexProvince=2;
                this.indexCity=2;
                this.indexDistrict=2;
            },
            popDeliveryDialog(){
                this.addressDialogVisible=true
                this.addressDialogTitle="增加发货地址"
                this.dialogAddressEntity={
                    selectProvinceId:'',
                    selectCityId:"",
                    selectDistrictId:'',
                    area:{
                        province:{
                            id:'',
                            name:''
                        },
                        city:{
                            id:'',
                            name:''
                        },
                        district:{
                            id:'',
                            name:''
                        }
                    }
                }
                //大于1就行
                this.indexProvince=2;
                this.indexCity=2;
                this.indexDistrict=2;
            },
            changeProvince(id){
                this.indexProvince++

                if(this.indexProvince == 1) return
                if(id){
                    this.provinceList.forEach(v=>{
                        if(v.id==id){
                            this.dialogAddressEntity.area.province.id=v.id;
                            this.dialogAddressEntity.area.province.name=v.name;
                        }
                    })
                    
                    this.dialogAddressEntity.selectCityId="";
                    this.dialogAddressEntity.selectDistrictId="";
                    this.getCityList(id);
                }
                
            },
            changeCity(id){
                this.indexCity++
                if(this.indexCity == 1) return
                if(id){
                    this.cityList.forEach(v=>{
                        if(v.id==id){
                            this.dialogAddressEntity.area.city.id=v.id;
                            this.dialogAddressEntity.area.city.name=v.name;
                        }
                    })

                    this.dialogAddressEntity.selectDistrictId="";
                    this.getDistrictList(id);
                }
                
            },
            changeDistrict(id){
                this.indexDistrict++
                if(this.indexDistrict == 1) return
                if(id){
                    this.districtList.forEach(v=>{
                        if(v.id==id){
                            this.dialogAddressEntity.area.district.id=v.id;
                            this.dialogAddressEntity.area.district.name=v.name;
                        }
                    })
                }
            },
            getExpressAddressList(){
                var url=this.$apiUrl.getExpressAddressListUrl;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        res.data.forEach(v=>{
                            if(v.addressType==1){
                                this.deliveryAddressEntity=v
                            }else{
                                this.returnAddressEntity=v
                            }
                            
                        })
                    }
                })
            },
            getExpressAddressDetail(id,type){

                this.addressDialogTitle=type;
                
                this.addressDialogVisible=true;

                var url=this.$apiUrl.getExpressAddressDetailUrl+"?id="+id;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        this.indexProvince = 0
                        this.indexCity = 0
                        this.indexDistrict = 0
                        // res.data.addressType==1为发货地址
                        this.dialogAddressEntity.selectProvinceId=parseInt(res.data.area.province.id);
                        this.dialogAddressEntity.selectCityId=parseInt(res.data.area.city.id);
                        this.dialogAddressEntity.selectDistrictId=parseInt(res.data.area.district.id);


                        this.dialogAddressEntity=Object.assign({},this.dialogAddressEntity,res.data);

                        

                        //获取省市区
                        this.getCityList(this.dialogAddressEntity.selectProvinceId);
                        this.getDistrictList(this.dialogAddressEntity.selectCityId);
                    }
                })
            },
            beforeSubmit(){
                //判断地址是否都填写了
                var area=this.dialogAddressEntity.area;
                if(!area.province.id||!area.city.id||!area.province.id){
                    this.$message({
                        type:'warning',
                        message:'所在地区必填'
                    })
                    return false;
                }
                //判断手机号和电话号码是否填写了其中至少一个
                if(!this.dialogAddressEntity.mobile&&!this.dialogAddressEntity.telphone){
                    this.$message({
                        type:'warning',
                        message:'手机号码和电话号码必选其一'
                    })
                    return false;
                }
                return true;
            },
            addOrUpdateExpressAddress(formName){
                if(!this.beforeSubmit()){
                    return false;
                }
                this.$refs[formName].validate((valid) => {     
                    if(valid){
                        
                        if(this.addressDialogTitle=="编辑发货地址"){
                            var data=Object.assign({},this.dialogAddressEntity);
                            data.area=JSON.stringify(data.area);
                            data.addressType=1;

                            this.updateExpressAddress(data);

                        }else if(this.addressDialogTitle=="增加发货地址"){

                            var data=Object.assign({},this.dialogAddressEntity);
                            data.area=JSON.stringify(data.area);
                            data.addressType=1;

                            this.addExpressAddress(data)

                        }else if(this.addressDialogTitle=="编辑退货地址"){
                            var data=Object.assign({},this.dialogAddressEntity);
                            data.area=JSON.stringify(data.area);
                            data.addressType=2;

                            this.updateExpressAddress(data);

                        }else if(this.addressDialogTitle=="增加退货地址"){
                            var data=Object.assign({},this.dialogAddressEntity);
                            data.area=JSON.stringify(data.area);
                            data.addressType=2;

                            this.addExpressAddress(data)

                        }

                        
                    }else{

                    }
                })
                
                
            },
            addExpressAddress(data){

                var url=this.$apiUrl.addExpressAddressUrl;
                var params=data;

            
                this.$ajax.post(url,params).then(res=>{
                    if(res.error==0){
                        this.$message({
                            type:'success',
                            message:'新增成功！'
                        })
                        this.addressDialogVisible=false;
                        this.getExpressAddressList();
                    }
                })
            },
            updateExpressAddress(data){
                var url=this.$apiUrl.updateExpressAddressUrl;
                var params=data;

                this.$ajax.post(url,params).then(res=>{
                    if(res.error==0){
                        this.$message({
                            type:'success',
                            message:'修改成功！'
                        })
                        this.addressDialogVisible=false;
                        this.getExpressAddressList();
                    }
                })
            },
            getProvinceList(){
                var url=this.$apiUrl.getCascaderAddressUrl;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        this.provinceList=res.data.list
                    }
                })
            },
            getCityList(id){
                var url=this.$apiUrl.getCascaderAddressUrl+"?parentId="+id;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        this.cityList=res.data.list
                    }
                })
            },
            getDistrictList(id){
                var url=this.$apiUrl.getCascaderAddressUrl+"?parentId="+id;
                this.$ajax.get(url).then(res=>{
                    if(res.error==0){
                        this.districtList=res.data.list
                    }
                })
            }
        },
        mounted(){
            //获得发货地址和退货地址列表
            this.getExpressAddressList();

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
    .cell{
        height:40px;
        line-height:40px;
    }
    .add-address-content{
        width:340px;
        height:200px;
        position:relative;
        border:1px solid #e5e5e5;
        margin-top:15px;
        i{
            margin-left: 136px;
            text-align: center;
            line-height: 200px;
            font-size: 68px;
            color: #cccccc;
            cursor:pointer;
        }
    }
</style>
<style>
.express-delivery .cascade .el-select input{
    width:140px!important;
}
.express-delivery .phone .el-form-item__content{
    margin-left:0px!important;
}
</style>