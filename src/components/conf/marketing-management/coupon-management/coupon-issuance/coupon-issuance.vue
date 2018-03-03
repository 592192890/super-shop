<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" label-position="left">
        <el-form-item label="优惠券定义编码" required>
            <span>{{hasChosenCouponId[0]}}</span>
        </el-form-item>
        <el-form-item label="选择优惠券" prop="chooseCoupon">
            <el-button @click="dialogSelectCoupon">选择优惠券</el-button>
            <div class="coupon-inf" v-for="(name,index) in hasChosenCouponNames" :key="index">
                <span>{{name}}</span><el-button class="text-btn" type="text" @click="dialogSelectCoupon(index)">更换</el-button>
            </div>
        </el-form-item>
        <el-form-item label="单个会员发放数量" prop="number">
            <el-col :span="7">
            <el-input v-model="ruleForm.number"  placeholder="请输入数量"></el-input><span class="des">张</span>
            </el-col>
        </el-form-item>
        <el-form-item label="会员名单" prop="addMode">
            <el-radio-group v-model="ruleForm.addMode" @change="chooseAddMode">
                <el-radio label="2">手动添加</el-radio>
                <el-form-item prop="memberlist" v-if="memberlistShow">
                    <el-input 
                    class="textarea"
                    type="textarea" 
                    :rows="3"
                    v-model="ruleForm.memberlist" 
                    placeholder="请添加会员手机号码，批量操作时，请以双斜杠（//）进行分割">
                    </el-input>
                </el-form-item>
                <el-radio label="1" class="file">批量导入</el-radio>
                <el-form-item prop="fileName" v-if="fileNameShow">
                    <el-upload
                    class="upload-demo"
                    action="http://shopmanage.yunhou.com/api/coupon/grant_parse_excel"
                    :with-credentials="true"
                    :data="uploadData"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :show-file-list="false"
                    >
                    <el-input class="input-area" v-model="ruleForm.fileName"  placeholder="点击选择文件" icon="search"></el-input>
                    <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                    <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过2M</div>
                    </el-upload>
                    <!-- <el-button @click="exportCsv2" type="text">下载模板</el-button> -->
                    <a href="http://shopmanage.yunhou.com/api/coupon/grant_downloadExcel" class="download-mod">下载模板</a>
                </el-form-item>
                <el-radio label="3" class="file">按会员标签发券</el-radio>
            </el-radio-group>
        </el-form-item>
				<div>
					<MemberSettings :tagStatus="[false, false, false]" :bus="bus" :opt="ruleForm" :hiddenTab="true" :tagShow="tagShow"></MemberSettings>	
				</div>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>

        </el-form>
        <!-- 选择优惠券弹窗 -->
        <el-dialog
        title="选择优惠券"
        class="mod-pop"
        :visible.sync="dialogCouponVisible"
        size="large"
        :before-close="handleClose">
            <!-- 表单 -->
            <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
                <el-form-item label="所属部门">
                    <el-select v-model="formInline.department" placeholder="请选择部门">
                        <el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠券名称">
                    <el-input v-model="formInline.couponName" placeholder="请输入名称"></el-input>
                </el-form-item>
            
                <el-form-item class="btn-area">
                    <div class="reset-btn">
                        <el-button size="large" @click="onReset">重置</el-button>
                    </div>
                    <div class="search-btn">
                        <el-button type="primary" size="large" @click="onSearch">搜索</el-button>
                    </div>
				</el-form-item>
            </el-form>
            <!-- 列表 -->
            <div class="mod-search-table">
            <el-table :data="tableData" style="width: 100%" v-loading="listLoading" @selection-change="handleSelectionChange"  ref="elTable">
                <el-table-column type="selection" width="60px"></el-table-column>
                <el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]" :width="width[index]"></el-table-column>
                <!-- <el-table-column label="操作" v-if="operations" width="200px" fixed="right">
                    <template scope="scope">
                        <el-button type="text" :disabled="isBtnDisabled[scope.$index][index]" v-for="(operation,index) in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            </div>
            <el-col :span="24" class="mod-toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                :page-size="20" :total="total" style="float:right;" :current-page="currentPage">
                </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click="chooseCouponClose">取 消</el-button>
                <el-button type="primary" @click="chooseCouponSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Vue from 'vue'
import formSearch from '../form-search.vue'
import list from '../list.vue'
import saveAs from '@/assets/js/saveAs'
import MemberSettings from '@/components/common/member-settings/index.vue'
export default {
    components:{
		formSearch,list,MemberSettings
	},
    data() {
        //选择优惠券验证
        var validateChooseCoupon = (rule, value, callback) => {
            if (this.hasChosenCouponNames.length==0) {
                callback(new Error('请选择优惠券'));
            }else{
                callback();
            }
        };
        //列表请求参数
		var param={
			currentPage:1,
			pageSize:20,
			// department:"",	//所属部门id	number	@mock=1
			name:"",	//优惠券名称	string	@mock=新人礼包5元券
        };
        var uploadData={
            tableId:""
        }
        return {
						bus: new Vue(),
            fileList:[],
            uploadData,
            param,
            departmentData:[],//全部业态
            form:{
                resource:"",
                type:"",
            },
            ruleForm: {
                number:'',
                addMode:'',
                memberlist:'',
                fileName:'',
                userTags:'',
            },
            rules: {
                chooseCoupon:[
                    {required: true, validator: validateChooseCoupon}
                ],
                number:[
                    { required: true,  message:'请输入数量'},
                    { pattern:/^([1-9]\d*)$/, message:'数量需大于等于1'}
                ],
                addMode:[
                    { required: true, message: '请选择添加名单方式', trigger: 'change' }
                ],
                memberlist:[
                    { required: true, message: '请添加手机号', trigger: 'change' }
                ],
                fileName:[
                    { required: true, message: '请上传文件', trigger: 'change' }
                ],
            },
            memberlistShow:false,//手动添加框显示隐藏
            fileNameShow:false,//批量导入框显示隐藏
						tagShow:false,//按会员标签发券

            dialogCouponVisible:false,
            //选择优惠券（已经被选择的优惠券名称）
            hasChosenCouponNames:[],
            //选择优惠券（新选择优惠券）
            newChosenCouponNames:[],
            //选择优惠券id（已经被选择的优惠券id）
            hasChosenCouponId:[],
            //选择优惠券id（新选择优惠券）
            newChosenCouponId:[],
            //弹窗表单
            formInline:{
                couponName:'',
                belong:'',
                department:''

            },
            // 弹窗列表
			isBtnDisabled:[],
			listLoading:true,
			currentPage: 1,
			sels: [],
			tableData: [],
			page: 1,
			total: 0,
			lableNames: [
				"优惠券名称",
				"ID",
				"种类",
				"所属部门",
			],//列表标题数组集合
			//列宽
			width:[],
			//请求响应参数名
			props: [
				"name",
				"cpnsId",
				"typeText",
				"departmentName",
			],//请求响应参数数组集合
			operations: '',//操作列，操作能力数组集合
            index:"",//当前操作的列表行索引，
        };
    },
    mounted(){
			var self = this;
        //获取当前所有业态
        this.$ajax.post(this.$apiUrl.allType
        ).then((res) =>
        {
            if (res.error !== 0) {
                this.$message({
                message: res.msg,
                type: 'error'
                });
            }
            var data = res.data;
            for (var index = 0; index < data.length; index++) {
                this.departmentData.push(data[index])                 
            }
        })
				this.bus.$on('member-settings/change', function(obj){
					Object.assign(self.ruleForm, obj.form);
                })
    },
    methods: {
        //生成模板供下载
        // exportCsv2(){
        // //Excel打开后中文乱码添加如下字符串解决
        //     var exportContent = "\uFEFF";
        //     var blob = new Blob([exportContent+"注意：记得将文件另存为xls、xlsx格式再进行上传\n  注意：一个会员只需对应一个会员ID或者会员手机号\n会员ID,会员手机号\nXXXXX,XXXXX"],{type: "text/plain;charset=utf-8"});
        //     saveAs.saveAs(blob, "会员名单.csv");
        // },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                //请求参数
                var param={
                    actType:this.ruleForm.addMode,	//是上传还是文本框输入	string	1 上传 2文本框输入
                    cpnsId:this.hasChosenCouponId[0],	//优惠券ID	string	
                    nums:this.ruleForm.number,	//发放数量	number	
                    tableId:"",	//上传需要该参数	string	
                    users:this.ruleForm.memberlist,	//用户手机号或者siebelId，//拼接	string
                    userTags:JSON.stringify(this.ruleForm.userTags),
                }
                console.log(this.ruleForm.userTags);
                if (param.actType == "1") {
                    param.tableId = this.uploadData.tableId;
                }
                this.$ajax.post(this.$apiUrl.coupon.grantCreate,param
                ).then((res) =>
                {
                    if (res.error !== 0) {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                        return false;
                    }
                    if (res.data) {
                        this.$message({
                        message: "优惠券已发放",
                        type: 'success'
                        });
                    }
                    this.$router.push({name:'优惠券发放列表'});
                })	

            } else {
                return false;
            }
            });
            
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.$router.push({name:'优惠券发放列表'});
        },
        //添加会员
        chooseAddMode(){
            if (this.ruleForm.addMode == "2") {
                this.memberlistShow = true;
                this.fileNameShow = false;
                this.tagShow = false;
                this.ruleForm.fileName = "";
                this.ruleForm.userTags={};
            }else if(this.ruleForm.addMode == "1"){
                this.memberlistShow = false;
                this.fileNameShow = true;
                this.tagShow = false;
                this.ruleForm.memberlist = "";
                this.ruleForm.userTags={};
            }else if(this.ruleForm.addMode == "3"){
                this.memberlistShow = false;
                this.fileNameShow = false;
                this.tagShow = true;
                this.ruleForm.fileName = "";
                this.ruleForm.memberlist = "";
            }else{
                this.memberlistShow = false;
                this.fileNameShow = false;
                this.tagShow = false;
                this.ruleForm.fileName = "";
                this.ruleForm.memberlist = "";
                this.ruleForm.userTags={};
            }
        },

        //会员名单选择
        changeRadio(){
            // this.ruleForm.byHand = !this.ruleForm.byHand
            this.ruleForm.fileName = !this.ruleForm.fileName
        },
        //选择优惠券弹框渲染//更换优惠券
        dialogSelectCoupon(index){
            
            this.dialogCouponVisible = true;
            this.param = {
				currentPage:1,
				pageSize:20,
				// department:"",	//所属部门id	number	@mock=1
				name:"",	//优惠券名称	string	@mock=新人礼包5元券
			}
            this.getData();
        },
        //选择优惠券弹框关闭回调
        handleClose(done) {
            this.formInline.department = "";
            this.formInline.couponName = "";
            done();
        },
        chooseCouponClose(){
            this.dialogCouponVisible = false;
            this.formInline.department = "";
            this.formInline.couponName = "";
        },
        onSearch() {
			var self = this;
			self.param = {
				currentPage:1,
				pageSize:20,
				department:this.formInline.department,	//所属部门id	number	@mock=1
				name:this.formInline.couponName,	//优惠券名称	string	@mock=新人礼包5元券
			}
			self.getData();
		},
        onReset(){
			this.formInline.couponName = '';
			this.formInline.department = '';
			this.onSearch();
		},
        //翻页
		handleCurrentChange(val)
		{
			this.param.currentPage = val;
			this.getData();
		},
        //选中某列
        handleSelectionChange(data,index)
        {   

            this.newChosenCouponNames= [];
            this.newChosenCouponId= [];     
            for (var index = 0; index < data.length; index++) {
                this.newChosenCouponNames.push(data[index].name);
                this.newChosenCouponId.push(data[index].cpnsId);
            }

        },
        //提交
        chooseCouponSubmit()
        {
            if (this.newChosenCouponNames.length>1) {
                this.$message({
					message: "只能选择一张优惠券",
					type: 'error'
                });
                return false;
            }
            this.dialogCouponVisible = false;
            for (var index = 0; index < this.newChosenCouponNames.length; index++) {
                // this.hasChosenCouponNames.push(this.newChosenCouponNames[index]);
                this.hasChosenCouponNames.splice(0,1,this.newChosenCouponNames[index]);
                this.hasChosenCouponId.splice(0,1,this.newChosenCouponId[index])
            }
        },
		 //请求列表数据
		getData()
		{
			let self = this;
			self.currentPage = self.param.currentPage;
			self.listLoading = true;
			self.$ajax.post(self.$apiUrl.coupon.defineList,self.param
			).then((res) =>
			{
				if (res.error !== 0) {
					self.$message({
					message: res.msg,
					type: 'error'
				});
				}
				self.total = res.data.totalCount;
				self.tableData = res.data.list;
				self.listLoading = false;
                self.selectedOption(self.hasChosenCouponId[0]);
			})
        },
        //根据优惠券id，优惠券自动选择
        selectedOption(couponId){
            var self = this;
                var rows = [];
                var tableData = self.tableData;
                    var id = couponId;
                    for (var index = 0; index < tableData.length; index++) {
                        if(id == tableData[index].cpnsId){
                            rows.push(index);
                        }
                    }                    
            //列表注入数据后再设置选中
            setTimeout(function() {
                for (var index = 0; index < rows.length; index++) {
                    var row = rows[index];
                    self.$refs.elTable.toggleRowSelection(self.tableData[row]);
                }
            }, 100);    
        },
        //上传成功回调
        handleAvatarSuccess(res, file) {
            if (res.error !== 0) {
                this.$message({
                message: res.msg,
                type: 'error'
                });
                return false;
            }else{
                this.uploadData.tableId = res.data;
                this.ruleForm.fileName = file.name;
            }
        },
        //上传失败回调
        handleAvatarError(err, file){
            this.$message({
                message: "上传失败，请重试！",
                type: 'error'
            });
        },
        //文件上传限制
        beforeAvatarUpload(file) {
            const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const isXls = file.type === 'application/vnd.ms-excel';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isXlsx && !isXls) {
            this.$message.error('上传文件只能是 xls/xlsx格式！');
            }
            if (!isLt2M) {
            this.$message.error('上传文件大小不能超过 2MB!');
            }
			return (isXlsx || isXls) && isLt2M;
        },
    }
}
</script>
<style lang="scss" scoped>
.coupon-inf{
    margin-top:10px;
    padding-left:6px;  
    .text-btn{
        margin-left:30px;
    }
}
.el-form{
    background-color: #fff;
    padding: 30px;
}
.el-radio-group{
    margin-top: 7px;
}
.el-radio{
    display: block;
    width: auto;
    margin-left: 0;
}
.file{
    margin-top: 20px;
}
.des{
    position: absolute;
    margin-left:10px;
    font-size:14px;
    bottom:0;
}
.input-area{
    margin: 15px 0 0;
}
.textarea{
    // margin: 0 0 0 20px;
    margin-top: 15px;
    width: 500px;
}
.download-mod{
    color:#3dc8f6;
}
.btn-area{
    // position: absolute;
	display: block;
	width: 300px!important;
	z-index: 0;
	// float: right;
    // right:0;
    // bottom:0;
	.search-btn{
		float: right;
	}
	.reset-btn{
		float: right;
		margin-left: 8px;
	}
}
</style>


