<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" label-position="left">
        <div :class="{ mask: isView }">
        <el-form-item label="发放规则编码" required>
            <span>{{ruleId}}</span>
        </el-form-item>
        <el-form-item label="发放规则名称" prop="ruleName">
            <el-col :span="7">
            <el-input v-model="ruleForm.ruleName"  placeholder="请输入名称"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="选择优惠券" prop="chooseCoupon">
            <el-button @click="dialogSelectCoupon">选择优惠券</el-button>
            <div class="coupon-inf" v-for="(name,index) in hasChosenCouponNames" :key="index">
                <span>{{name}}</span><el-button class="text-btn" type="text" @click="dialogSelectCoupon(index)">更换</el-button>
            </div>
        </el-form-item>
        </div>
        <el-form-item label="发放条件" prop="chooseCondition">
            <el-button @click="cacheExistingRecord" v-if="!isView">添加条件</el-button>
            <div class="ues-rule" v-for="(list,index) in ruleItemList" :key="index" v-if="ruleItemList">
                <span class="rule-name">{{list.itemName}}</span>
                <el-button class="text-btn" type="text" @click="conditionModify(index)" v-if="!isView">修改</el-button>
                <el-button class="text-btn" type="text" @click="conditionDel(index)" v-if="!isView">删除</el-button>
                <el-button class="text-btn" type="text" @click="conditionModify(index)" v-if="isView">查看</el-button>
            </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" v-if="!isView">提交</el-button>
            <el-button @click="resetForm('ruleForm')" v-if="!isView">取消</el-button>
            <el-button @click="resetForm('ruleForm')" v-if="isView">返回</el-button>
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
            <el-table :data="tableData" style="width: 100%" v-loading="listLoading" @selection-change="handleSelectionChange" ref="elTable">
                <el-table-column type="selection" width="60px"></el-table-column>
                <el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]" :width="width[index]"></el-table-column>
                <el-table-column label="操作" v-if="operations" width="200px" fixed="right">
                    <template scope="scope">
                        <el-button type="text" :disabled="isBtnDisabled[scope.$index][index]" v-for="(operation,index) in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
                    </template>
                </el-table-column>
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
import formSearch from '../form-search.vue'
import list from '../list.vue'
export default {
    components:{
		formSearch,list
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
        //选择条件验证
        var validateChooseCondition = (rule, value, callback) => {
            if (this.ruleItemList.length==0) {
                callback(new Error('你还未添加条件'));
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
        return {
            isView:false,
            param,
            departmentData:[],//全部业态
            form:{
                resource:"",
                type:"",
            },
            ruleForm: {
            
            },
            rules: {
                chooseCoupon:[
                    { required: true, validator: validateChooseCoupon, trigger: 'change' }
                ],
                chooseCondition:[
                    { required: true, validator: validateChooseCondition, trigger: 'change' }
                ],
                ruleName: [
                    { required: true, min:0, max: 30, message: '优惠券名称不能为空，最多可输入30个字符，不能输入特殊符号', trigger: 'blur' },
                    {pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, message:'不能输入特殊符号'}
                ],
            },
            dialogCouponVisible:false,
            //选择优惠券（已经被选择的优惠券名称）
            hasChosenCouponNames:[],
            //选择优惠券（新选择优惠券）
            newChosenCouponNames:[],
            //选择优惠券ID（已经被选择的优惠券ID）
            hasChosenCouponId:[],
            //选择优惠券ID（新选择优惠券ID）
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


            ruleId:"",//用券规则编码
            //请求数据，条件信息
            ruleItemList:[],
            //是否是修改状态下进入组件
            isModifyEnter:false,
        };
    },
    mounted(){
        //判断是否查看详情
        if(sessionStorage.getItem("isView")){
            this.isView = true;
        }
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
        //判断当前进入目的，是否以规则修改目的进入
        if(this.$store.state.voucherActivities.enterRule.isModifyEnterRule){
            var index = this.$store.state.voucherActivities.enterRule.index;//当前修改的规则位置
            //判断是否在条件修改完成提交后进入
            if(this.$store.state.voucherActivities.enterCondition.isModifyFinish){
                //数组方法
                //获取条件信息
                if (JSON.parse(sessionStorage.getItem("ruleItemList"))) {
                    this.ruleItemList = JSON.parse(sessionStorage.getItem("ruleItemList"));
                }else{
                    this.ruleItemList = []
                }
             }else if(!JSON.parse(sessionStorage.getItem("ruleItemList"))){//没有修改过条件
                    //获取全部规则信息
                    if (JSON.parse(sessionStorage.getItem("ruleList"))) {
                        var ruleList = JSON.parse(sessionStorage.getItem("ruleList"));
                        var ruleFormStatus =  ruleList[index];//当前表单状态
                        this.ruleItemList = ruleFormStatus.ruleItemList;
                        this.hasChosenCouponId.push(ruleFormStatus.cpnsId);	//优惠券方案ID	number	@mock=8888888
                        this.ruleId=ruleFormStatus.ruleId,	//发券规则编码	number	@mock=5165165
                        this.ruleForm.ruleName=ruleFormStatus.ruleName;	//规则名称	string	@mock=梅溪新天地全场购物送200券
                        this.hasChosenCouponNames.push(ruleFormStatus.cpnsName);
                    }else{
                        this.$message({
                        message: '警告，当前的表单数据可能载入出错，请您提交前检查一遍',
                        type: 'warning'
                        });
                    }
             }else{
                if (JSON.parse(sessionStorage.getItem("ruleList"))) {//修改过条件，但是没有提交，而是返回了规则配置页面
                    var ruleList = JSON.parse(sessionStorage.getItem("ruleList"));
                    var ruleFormStatus =  ruleList[index];//当前表单状态
                    this.ruleItemList = JSON.parse(sessionStorage.getItem("ruleItemList"));
                    this.hasChosenCouponId.push(ruleFormStatus.cpnsId);	//优惠券方案ID	number	@mock=8888888
                    this.ruleId=ruleFormStatus.ruleId,	//发券规则编码	number	@mock=5165165
                    this.ruleForm.ruleName=ruleFormStatus.ruleName;	//规则名称	string	@mock=梅溪新天地全场购物送200券
                    this.hasChosenCouponNames.push(ruleFormStatus.cpnsName);
                }else{
                    this.$message({
                    message: '警告，当前的表单数据可能载入出错，请您提交前检查一遍',
                    type: 'warning'
                    });
                }
             }
        }else{
            //以新增规则目的进入
            //数组方法
            //获取条件信息
            if (JSON.parse(sessionStorage.getItem("ruleItemList"))) {
                this.ruleItemList = JSON.parse(sessionStorage.getItem("ruleItemList"));
            }else{
                this.ruleItemList = []
            }
        };
        //获取表单上次进行中的状态
        var ruleFormStatus = this.$store.state.voucherActivities.ruleFormStatus;
        if (ruleFormStatus) {
            this.hasChosenCouponId=ruleFormStatus.cpnsId;	//优惠券方案ID	number	@mock=8888888
            this.ruleId=ruleFormStatus.ruleId,	//发券规则编码	number	@mock=5165165
            this.ruleForm.ruleName=ruleFormStatus.ruleName;	//规则名称	string	@mock=梅溪新天地全场购物送200券
            this.hasChosenCouponNames= ruleFormStatus.hasChosenCouponNames;
        } 
        if (!this.ruleId) {
             //获取规则编码
            this.$ajax.post(this.$apiUrl.coupon.createCouponId,{couponKey:"couponIssueRule_"}
			).then((res) =>
			{
				if (res.error !== 0) {
					this.$message({
					message: res.msg,
					type: 'error'
                    });
                    return false;
                }
                this.ruleId = res.data;
			})            
        }
    },
    methods: {
        submitForm(formName) {
            if(this.$store.state.voucherActivities.isEditorEnter){
                var createTime="",
                updateTime=Date.parse(new Date());
            }else{
                var createTime=Date.parse(new Date()),
                updateTime="";
            }
            var ruleListData = {	//发放规则	array<object>	
                    cpnsId:this.hasChosenCouponId[0],	//优惠券方案ID	number	@mock=8888888
                    cpnsName:this.hasChosenCouponNames[0],
                    createTime:createTime,	//创建时间	number	@mock=1504169476000
                    issueId:sessionStorage.getItem("activityId"),	//发券活动编码	number	@mock=1000000868
                    ruleId:this.ruleId,	//发券规则编码	number	@mock=5165165
                    ruleItemList:this.ruleItemList,	//使用规则	array<object>	
                    ruleName:this.ruleForm.ruleName,	//规则名称	string	@mock=梅溪新天地全场购物送200券
                    updateTime:updateTime, //更新时间	string	@mock=10354861553561
            };
            
            this.$refs[formName].validate((valid) => {
            if (valid) {
                var ruleList = [];
                if (JSON.parse(sessionStorage.getItem("ruleList"))) {
                    var cookieRuleList = JSON.parse(sessionStorage.getItem("ruleList"));
                    for (var index = 0; index < cookieRuleList.length; index++) {//遍历当前所有条件，推入数组中
                        var element = cookieRuleList[index];
                        ruleList.push(cookieRuleList[index]);
                    }
                }
                
                //判断当前是新增提交或修改提交
                if(this.$store.state.voucherActivities.enterRule.isModifyEnterRule){//修改提交
                    var index = this.$store.state.voucherActivities.enterRule.index;//当前修改的规则位置
                    this.$store.commit('mutationsToSubmitModifyRule', index);
                    ruleList.splice(index,1,ruleListData);//将本次修改数据替换到原有规则位置
                }else{//新增提交
                    ruleList.push(ruleListData);//将本次新增数据推入数组栈中
                }
                if (ruleList.length>0) {
                    sessionStorage.setItem("ruleList",JSON.stringify(ruleList));//更新当前所建立的条件
                }      
                sessionStorage.removeItem("ruleItemList");
                this.$router.push({name:'发券活动配置'});
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {
            if(this.isView){
                this.$refs[formName].resetFields();
                this.$store.commit('mutationsToBackModifyRule');
                this.$router.push({name:'发券活动配置'});
            }else{
                this.$confirm('放弃填写?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs[formName].resetFields();
                    this.$store.commit('mutationsToBackModifyRule');
                    this.$router.push({name:'发券活动配置'});
                });
            }
            
        },
        //图片上传限制
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
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
		//判断审核状态，已发布禁用“编辑”“发布”功能
		forbidHandle()
		{	
			this.isBtnDisabled = [];//翻页即清空栈数据
			var tableData = this.tableData;
			var length = tableData.length;

			for (var index = 0; index < length; index++) {
				var colData = tableData[index];
				var checkStatus = colData.rule.checkStatus;
				var able=[true,false,true];
				var disable=[false,false,false];
				if (checkStatus == "已发布") {
					this.isBtnDisabled.push(able);
				}else{
					this.isBtnDisabled.push(disable);
				}
			}
		},
		whichType(type,index)
		{
			var self = this;
			switch(type){
				case "编辑":
					self.editor(index);
					break;
				case "发布":
					self.release(index);
					break;
				case "删除":
					self.del(index);
					break;
			}
			
		},
		//发布
		release(index)
		{
			
		},
		//编辑
		editor()
		{
			this.$router.push({name:'编辑'});
		},
		//删除
		del()
		{

        },

        //点击添加条件时，管理当前页面已填写的表单
        cacheExistingRecord(){
            //条件最多只能添加五条
            if (this.ruleItemList.length == 5 || this.ruleItemList.length > 5) {   
                this.$message({
					message: "最多允许添加5个条件",
					type: 'warning'
                });
                return false;
            }
            var ruleFormDate = {	//发放规则	array<object>	
                cpnsId:this.hasChosenCouponId,	//优惠券方案ID	number	@mock=8888888
                ruleId:this.ruleId,	//发券规则编码	number	@mock=5165165
                ruleName:this.ruleForm.ruleName,	//规则名称	string	@mock=梅溪新天地全场购物送200券
                hasChosenCouponNames:this.hasChosenCouponNames,
            };
            //记录当前状态
            this.$store.commit('mutationsToRecordStatusRule', ruleFormDate);
            if (this.ruleItemList.length!==0) {
                sessionStorage.setItem("ruleItemList",JSON.stringify(this.ruleItemList));//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            }else{
                sessionStorage.removeItem("ruleItemList");//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            }
            //单独存储当前规则编码，（直接获取sessionStorage的ruleItemList条件信息，或者当前表单状态里的规则编码，可能不是当前实时的）
            sessionStorage.setItem("ruleId",this.ruleId);
            this.$router.push({name:'发放条件设置'});
            
        },
        //条件修改
        conditionModify(index){
            var ruleFormDate = {	//发放规则	array<object>	
                cpnsId:this.hasChosenCouponId,	//优惠券方案ID	number	@mock=8888888
                ruleId:this.ruleId,	//发券规则编码	number	@mock=5165165
                ruleName:this.ruleForm.ruleName,	//规则名称	string	@mock=梅溪新天地全场购物送200券
                hasChosenCouponNames:this.hasChosenCouponNames,
            };
            //记录当前状态
            this.$store.commit('mutationsToRecordStatusRule', ruleFormDate);
            // this.$store.commit('mutationsToClearStatusCondition');
            this.$store.commit('mutationsToModifyCondition', index);
            if (this.ruleItemList!==0) {
                sessionStorage.setItem("ruleItemList",JSON.stringify(this.ruleItemList));//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            }else{
                sessionStorage.removeItem("ruleItemList");//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            }
            //单独存储当前规则编码，（直接获取sessionStorage的ruleItemList条件信息，或者当前表单状态里的规则编码，可能不是当前实时的）
            sessionStorage.setItem("ruleId",this.ruleId);
            this.$router.push({name:'发放条件设置'});
        },
        //条件删除
        conditionDel(index){
            this.$confirm('删除该条件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.ruleItemList.splice(index,1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })
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
.rule-name{
    margin-right:30px
}
.el-form{
    background-color: #fff;
    padding: 30px;
}
.el-radio{
    display: block;
    width: auto;
    margin-left: 0;
}
.el-radio + .el-radio{
    display: inline-block;
}
.el-checkbox{
    width: 120px;
}
.inline{
    display: inline-block;
}
.inline + .inline{
    margin-left: 15px;
}
.lineTwo{
    margin-left:0;
}

.box-card{
    width: 800px;
}
.margin-bottome{
    margin-bottom: 22px;
}





.fade-enter-active, .fade-leave-active {
    transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.el-form{
	background-color: #fff;
	padding: 20px;
}
.issue{
	width: 70%
}
.des{
    position: absolute;
    color:#999;
    margin-left:10px;
    font-size:8px;
    bottom:0;
}
.textarea{
    left:400px;
}
.upload{
    left:178px;
}
.el-textarea{
    width: 400px;
}
.box-card{
	width: 500px;
	margin:0 0 20px 150px;
		.discount{
			width: 100px;
			padding: 0 5px;
		}
		.div{
			margin-top:20px;
			.price{
				width: 100px;
				margin:0 5px;
			}
		}
		.pick-date{
			margin-top:20px;
			.date{
				width: 150px;
			}
		}
		.lable{
			display: inline-block;
			width: 110px;
		}
}
.txt{
	padding-left: 10px;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
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
.mask{
    z-index: 99;
    pointer-events: none;
}
// .mod-search-table{
//     border:1px solid #f3f5f7;
//     tr{
//         border:1px solid #f3f5f7!important;
//     }
// }
</style>


