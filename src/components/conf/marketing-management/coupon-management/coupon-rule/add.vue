<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" label-position="left">
        <div :class="{ mask: isView }">
        <el-form-item label="用券规则编码" required>
            <span>{{ruleId}}</span>
        </el-form-item>
        <el-form-item label="规则名称" prop="ruleName">
            <!-- <el-col :span="7"> -->
            <el-input class="coupon-name" v-model="ruleForm.ruleName"  placeholder="市场部小伙伴们输入名称谢谢"></el-input><span class="des">优惠券名称不能为空，最多可输入30个字符，不能输入特殊符号</span>
            <!-- </el-col> -->
        </el-form-item>
        <el-form-item label="DM档期编码" prop="DMcode">
            <el-input class="coupon-name" v-model="ruleForm.DMcode"  placeholder="请填写编码"></el-input><span class="des">只能为数字</span>
        </el-form-item>
        <el-form-item label="选择优惠券" prop="chooseCoupon">
            <el-button @click="dialogSelectCoupon">选择优惠券</el-button>
            <div class="coupon-inf" v-for="(name,index) in hasChosenCouponNames" :key="index">
                <span>{{name}}</span><el-button class="text-btn" type="text" @click="dialogSelectCoupon(index)">更换</el-button>
            </div>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
            <el-select v-model="ruleForm.department" placeholder="请选择部门">
                <el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="使用有效时间" required>
            <!-- <el-col :span="5"> -->
            <el-form-item prop="startDate"  class="line">
            <el-date-picker type="datetime" placeholder="请选择" v-model="ruleForm.startDate"></el-date-picker>
            </el-form-item>
            <!-- </el-col> -->
            <span class="line">-</span>
            <!-- <el-col :span="5"> -->
            <el-form-item prop="endDate"  class="line">
            <el-date-picker type="datetime" placeholder="请选择" v-model="ruleForm.endDate"></el-date-picker>
            </el-form-item>
            <!-- </el-col> -->
        </el-form-item>
        </div>
        <el-form-item label="使用规则" prop="useRule">
            <div class="ues-rule" v-if="ruleListNames.length" v-for="(name,index) in ruleListNames" :key="index">
                <span class="rule-name">{{name}}</span>
                <el-button class="text-btn" type="text" @click="ruleModify(index)" v-if="!isView">修改</el-button>
                <el-button class="text-btn" type="text" @click="ruleDel(index)" v-if="!isView">删除</el-button>
                <el-button class="text-btn" type="text" @click="ruleModify(index)" v-if="isView">查看</el-button>
            </div>
            <el-button @click="cacheExistingRecord" v-if="!isView">添加规则</el-button>
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
        //添加规则验证
        var validateUseRule = (rule, value, callback) => {
            if (this.ruleList.length==0) {
                callback(new Error('请添加使用规则'));
            }else{
                callback();
            }
        };
        //结束时间大于开始时间验证
        var validateEndDate = (rule, value, callback) => {
            if (Date.parse(this.ruleForm.startDate)>=Date.parse(this.ruleForm.endDate)) {
                callback(new Error('时间需晚于起始时间'));
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
            ruleId:"",//用券规则编码
            ruleForm: {
                DMcode:"",
                ruleName:'',
                department:'',
                startDate:new Date(),
                endDate:new Date((Date.parse(new Date())/1000+7*3600*24)*1000),
            },
            rules: {
                ruleName: [
                    { required: true, min:0, max: 30, message: '优惠券名称不能为空，最多可输入30个字符，不能输入特殊符号', trigger: 'blur' },
                    {pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, message:'不能输入特殊符号'}
                ],
                department:[
                    { required: true, message: '请选择部门', trigger: 'change' }
                ],
                startDate: [
                    { required: true,type: 'date',  message: '请选择日期', trigger: 'change' }
                ],
                endDate: [
                    { required: true,type: 'date',  message: '请选择日期', trigger: 'change' },
                    { required: true, validator: validateEndDate, trigger: 'change'}
                ],
                chooseCoupon:[
                    { required: true, validator: validateChooseCoupon, trigger: 'change' }
                ],
                useRule:[
                    { required: true, validator: validateUseRule, trigger: 'change' }
                ],
                DMcode:[
                    { required: true, message: '请输入编码', trigger: 'change' },
                    {pattern:/^[0-9]+$/, message:'只能输入数字'}
                ],
            },
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


            //请求数据 规则
            ruleList:[],
            //规则名称数组
            ruleListNames:[],
            id:"",
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
        if (!this.$store.state.couponRule.isEditorEnter) {
            /* 进入来源：用户新增用券规则 */
            //获取全部规则信息
            if (JSON.parse(sessionStorage.getItem("useRuleList"))) {
                this.ruleList = JSON.parse(sessionStorage.getItem("useRuleList"));
            }else{
                this.ruleList=[]
            }
            for (var index = 0; index < this.ruleList.length; index++) {
                this.ruleListNames.push("规则" + (index+1));
            }
            //获取表单上次进行中的状态
            var activitiesFormStatus = this.$store.state.couponRule.activitiesFormStatusCouponRule;
            if (activitiesFormStatus) {
                // this.ruleId=activitiesFormStatus.ruleId,	//规则编码	number	@mock=1000000868
                this.ruleForm.ruleName=activitiesFormStatus.ruleName;	//规则名称
                this.hasChosenCouponNames=activitiesFormStatus.coupon;  //选择优惠券
                this.hasChosenCouponId=activitiesFormStatus.couponId;  //选择优惠券
                this.ruleForm.department=activitiesFormStatus.department;	//所属部门(发券方)
                this.ruleForm.startDate=activitiesFormStatus.startDate;
                this.ruleForm.endDate=activitiesFormStatus.endDate;
                this.ruleForm.DMcode=activitiesFormStatus.dmCode;
            }


            var ruleId = sessionStorage.getItem("ruleId");
            //获取用券规则编码
            if (!ruleId) {
                this.$ajax.post(this.$apiUrl.coupon.createCouponId,{couponKey:"couponRule_"}
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
                    sessionStorage.setItem("ruleId",this.ruleId);
                })
            }else{
                this.ruleId = ruleId;
            }


        }else{
            /* 进入来源：用户编辑用券规则 */
            //获取当前编辑活动的活动id
            var id = this.$store.state.couponRule.id;
            //获取当前活动配置详情
            this.$ajax.post(this.$apiUrl.coupon.getRule,{"id":id}
			).then((res) =>
			{
				if (res.error !== 0) {
					this.$message({
					message: res.msg,
					type: 'error'
                    });
                    return false;
                }
                var data = res.data
  
                //将数据注入下级所有页面
                // if (couponIssue.id!== id) {
                    this.ruleId = data.ruleId;	//发券活动编码	number	@mock=1000000868
                    sessionStorage.setItem("ruleId",this.ruleId);
                    //规则名称
                    this.ruleForm.ruleName = data.ruleName;
                    //优惠券名称
                    this.hasChosenCouponNames.push(data.cpnsName);
                    //优惠券Id
                    this.hasChosenCouponId.push(data.cpnsId);
                    //所属部门
                    this.ruleForm.department=data.department;
                    //使用有效时间
                    this.ruleForm.startDate=new Date(data.effectStartTime);//开始时间
                    this.ruleForm.endDate=new Date(data.effectEndTime);//结束时间
                    this.ruleForm.DMcode=data.dmCode;
                    this.id = data.id;

                    //规则信息注入
                    if (JSON.parse(sessionStorage.getItem("useRuleList"))) {
                        this.ruleList = JSON.parse(sessionStorage.getItem("useRuleList"));
                    }else{
                        this.ruleList = data.ruleItemList;
                    }
                    //使用规则名称渲染
                    for (var index = 0; index < this.ruleList.length; index++) {
                        this.ruleListNames.push("规则" + (index+1));
                    }
                    sessionStorage.setItem("useRuleList",JSON.stringify(this.ruleList));
			})

        }
        

        
    },
    methods: {
        submitForm(formName) {
             this.$refs[formName].validate((valid) => {
            if (valid) {
                //全部请求参数
                var	couponIssue = {
                    cpnsId:parseInt(this.hasChosenCouponId[0]),	//优惠券id	number	@mock=8888888
                    cpnsName:this.hasChosenCouponNames[0],
                    // createAccountId:"",	//创建活动者	number	
                    department:this.ruleForm.department,	//所属部门(发券方)	string	
                    effectEndTime:Date.parse(this.ruleForm.endDate),	//有效结束时间	string	@mock=2017-09-25 00:00:00
                    effectStartTime:Date.parse(this.ruleForm.startDate),	//有效开始时间	string	@mock=2017-09-25 00:00:00
                    // id:"",	//创建时不用传，更新时传此字段	number	
                    ruleId:parseInt(this.ruleId),	//优惠券用券规则编码	number	
                    ruleItemList:this.ruleList,		//array<object>	
                    ruleName:this.ruleForm.ruleName,	//优惠券用券规则编码	string
                    dmCode:this.ruleForm.DMcode,
                };
                if (this.$store.state.couponRule.isEditorEnter) {
                    /* 进入来源：用户编辑用券规则 */
                    couponIssue.id = this.id;
                }
            
                // var self = this;
                this.$ajax.post(this.$apiUrl.coupon.saveCouponrule,{"couponRule":JSON.stringify(couponIssue)}
                ).then((res) =>
                {
                    if (res.error !== 0) {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                        return false;
                    }
                    this.$message({
                    message: res.msg,
                    type: 'success'
                    })
                    sessionStorage.clear();
                    this.$store.commit('mutationsToClearStatusActivitiesFormCouponRule');
                    this.$router.push({name:'用券规则列表'});
                })
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {
            if (this.isView) {
                this.$refs[formName].resetFields();
                this.$store.commit('mutationsToClearStatusActivitiesFormCouponRule');
                sessionStorage.clear();
                this.$router.push({name:'用券规则列表'});
            }else{
                this.$confirm('放弃填写?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs[formName].resetFields();
                    this.$store.commit('mutationsToClearStatusActivitiesFormCouponRule');
                    sessionStorage.clear();
                    this.$router.push({name:'用券规则列表'});
                });
            }
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
            // if (typeof index === 'number' ) {
            //     this.hasChosenCouponNames.splice(index,1);
            // }
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
        // 列表
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
        

        //点击添加规则时，管理当前页面已填写的表单
        cacheExistingRecord(){
            //规则最多只能添加五条
            if (this.ruleListNames.length == 5 || this.ruleListNames.length > 5) {   
                this.$message({
					message: "最多允许添加5条规则",
					type: 'warning'
                });
                return false;
            } 
            var couponIssue = {
                ruleId:this.ruleId,	//规则编码	number	@mock=1000000868
                ruleName:this.ruleForm.ruleName,	//规则名称
                coupon:this.hasChosenCouponNames,  //选择优惠券
                couponId:this.hasChosenCouponId,  //选择优惠券id
                department:this.ruleForm.department,	
                startDate:this.ruleForm.startDate,
                endDate:this.ruleForm.endDate,
                dmCode:this.ruleForm.DMcode,
            };
            //记录当前状态
            this.$store.commit('mutationsToRecordStatusActivitiesCouponRule', couponIssue);
            // this.$store.commit('mutationsToClearStatusRule');
            this.$store.commit('mutationsToBackModifyRuleCouponRule');
            // if (this.ruleList.length!==0) {
            //     sessionStorage.setItem("ruleList",JSON.stringify(this.ruleList));//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            // }else{
            //     sessionStorage.removeItem("ruleList");//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            // }
            // sessionStorage.removeItem("useRuleList");
            this.$router.push({name:'使用规则配置'});
        },
        //规则修改
        ruleModify(index){
           var couponIssue = {
                ruleId:this.ruleId,	//规则编码	number	@mock=1000000868
                ruleName:this.ruleForm.ruleName,	//规则名称
                coupon:this.hasChosenCouponNames,  //选择优惠券
                couponId:this.hasChosenCouponId,  //选择优惠券id
                department:this.ruleForm.department,	//所属部门(发券方)	string	@mock=超市
                startDate:this.ruleForm.startDate,
                endDate:this.ruleForm.endDate,
                dmCode:this.ruleForm.DMcode,
            };
            //记录当前状态
            this.$store.commit('mutationsToRecordStatusActivitiesCouponRule', couponIssue);
            // this.$store.commit('mutationsToClearStatusRule');
            this.$store.commit('mutationsToModifyRuleCouponRule', index);
            this.$router.push({name:'使用规则配置'});
        },
        //规则删除
        ruleDel(index){
        //    this.$store.commit('mutationsToModifyRule', index);
            this.$confirm('删除该规则, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.ruleList.splice(index,1);
                this.ruleListNames.splice(index,1);
                if (this.ruleList.length!==0) {
                    sessionStorage.setItem("useRuleList",JSON.stringify(this.ruleList));//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
                }else{
                    sessionStorage.removeItem("useRuleList");//当前规则已经被全部删除，移除缓存该字段
                }
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

.search-btn{
    float: right;
}
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
    .el-input{
		width: 220px;
	}
	.el-select{
		width: 220px;
	}
	.coupon-name{
		width:450px;
	}
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
.line{
    display: inline-block;
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
</style>


