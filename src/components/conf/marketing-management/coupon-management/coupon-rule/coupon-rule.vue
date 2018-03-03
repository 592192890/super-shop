<template>
	<div class="page-view" v-loading="listLoading" style="padding-bottom: 70px">
		<el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
				<el-form-item label="活动名称">
					<el-input v-model="formInline.activeName" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="所属部门">
					<el-select v-model="formInline.belong" placeholder="选择部门">
					<el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="优惠券名称">
					<el-input v-model="formInline.cpnsName" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="审核状态">
					<el-select v-model="formInline.activeStatus" placeholder="选择状态">
					<el-option v-for="(option,index) in options.option4" :label="option" :value="index" :key="option[0]"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规则编码">
					<el-input v-model="formInline.ruleCode" placeholder="请输入ID"></el-input>
				</el-form-item>
				<el-form-item label="DM档期编码">
					<el-input v-model="formInline.DMcode" placeholder="请输入编码"></el-input>
				</el-form-item>
				<el-form-item label="开始时间" prop="startDate">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formDate.startDate"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="endDate">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formDate.endDate"></el-date-picker>
				</el-form-item>
				<el-form-item class="btn-area">
					<div class="reset-btn">
						<el-button size="large" @click="onReset">重置</el-button>
					</div>
					<div class="add-btn" v-if="addNewName">
						<el-button v-if="buttonArr.indexOf('bt-add')!=-1" class="add" size="large" @click="linkToAdd">{{addNewName}}</el-button>
					</div>
					<div class="search-btn">
						<el-button type="primary" size="large" @click="onSearch">搜索</el-button>
					</div>
				</el-form-item>
		</el-form>
		<!-- 列表 -->
		<el-table :data="tableData" style="width: 100%">
			<!-- <el-table-column type="selection" width="60px"></el-table-column> -->
			<el-table-column label="活动名称" width="200px" :show-overflow-tooltip="true">
				<template scope="scope">
					<el-button class="first-col-btn" type="text" v-if="isBtnDisabledName[scope.$index] || !btnShow[0]" @click="view([scope.$index])">{{ scope.row.ruleName }}</el-button>
					<el-button class="first-col-btn" type="text" v-if="!isBtnDisabledName[scope.$index] && btnShow[0]" @click="editor([scope.$index])">{{ scope.row.ruleName }}</el-button>
				</template>
			</el-table-column>
			<el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]" :width="width[index]"></el-table-column>
			<el-table-column label="操作" v-if="tableData.length && operations" width="200px" fixed="right">
				<template scope="scope">
					<el-button type="text" v-if="btnShow[index]" :disabled="isBtnDisabled[scope.$index][index]" v-for="(operation,index) in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="mod-toolbar">
			<!-- <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
			:page-size="20" :total="total" style="float:right;" :current-page="currentPage">
			</el-pagination> -->
			<el-pagination
			style="float:right;"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10, 20, 30, 40]"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total">
			</el-pagination>
		</el-col>
	</div>
</template>

<script>
import Permission from '@/assets/js/permission-util.js';
export default {
    data() {
		//结束时间大于开始时间验证
        var validateEndDate = (rule, value, callback) => {
            if (this.formDate.startDate && this.formDate.endDate && (Date.parse(this.formDate.startDate)>=Date.parse(this.formDate.endDate))) {
                callback(new Error('时间需晚于起始时间'));
            }else{
                callback();
            }
		}
		//开始时间小于结束时间验证
        var validateStartDate = (rule, value, callback) => {
            if (this.formDate.startDate && this.formDate.endDate && (Date.parse(this.formDate.startDate)>=Date.parse(this.formDate.endDate))) {
                callback(new Error('时间需早于结束时间'));
            }else{
                callback();
            }
        }
		//列表请求参数
		var param={
			currentPage:1,	//当前页码	number	
			department:"",	//所属部门(发券方)	string	@mock=超市
			effect:"",	//状态0,禁止(待发布),1,激活(已发布)	number	@mock=1
			effectEndTime:"",	//用券规则有效结束时间	string	@mock=2019-09-25 00:00:00
			effectStartTime:"",	//用券规则有效开始时间	string	@mock=2019-09-25 00:00:00
			name:"",	//用券规则名	string	
			pageSize:20,	//页大小	number	
			ruleId:"",	//优惠券用券规则编码	number	@mock=3252123
			ruleName:"",	//规则名称	string	@mock=梅溪新天地全场购物送200券
			name:"",
			dmCode:"",
		};
     	return {
			btnShow:[],
			buttonArr:[],
			pageSize:20,
			rules: {
                startDate: [
                    { validator: validateStartDate, trigger: 'change' }
                ],
                endDate: [
                    { validator: validateEndDate, trigger: 'change'}
                ],
            },


			departmentData:[],//全部业态
			param,
			formInline: {
				activeName: '',
				belong: '',
				activeStatus: '',
				ruleCode: '',
				cpnsName:"",
				DMcode:"",
			},
			formDate:{
				startDate:"",
				endDate:"",
			},
			options: {
				option1: "",
				option2: [
					"超市",
					"百货",
					"电器",
					"珠宝",
					"置业",
				],
				option3: "",
				option4: [
					"待发布",
					"已发布",
				],
				option5: "",
			},
			addNewName: '新增用券规则',
			labelPosition:"top",
		



			// 列表
			isBtnDisabled:[],//操作列按钮禁用
			isBtnDisabledName:[],//名称列按钮禁用
			listLoading:true,
			currentPage: 1,
			sels: [],
			tableData: [],
			page: 1,
			total: 0,
			lableNames: [
				// "活动名称",
				"促销编码",
				"DM档期编码",
				"所属部门",
				"开始时间",
				"结束时间",
				"活动状态",
				"审核状态",
			],//列表标题数组集合
			//列宽
			width:[
				// "200",
				"200",
				"150",
				"150",
				"250",
				"250",
				"150",
				"150",
			],
			//请求响应参数名
			props: [
				// "ruleName",
				"ruleId",
				"dmCode",
				"departmentName",
				"effectStartTime",
				"effectEndTime",
				"statusName",
				"effectName",
			],//请求响应参数数组集合
			operations: [
				"编辑",
				"删除",
				"发布"
			],//操作列，操作能力数组集合
			index:"",//当前操作的列表行索引，
		}
	},
	mounted()
	{	
		this.buttonArr=Permission.button(this.$route.path,this.$router.options.routes);
		// for (var index = 0; index < this.operations.length; index++) {
		// 	buttonArr.indexOf('bt-')!=1
			
		// }
		
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
		this.getData();
		// this.getData(this.param);
	},
	methods: {
		// isNameCol(row, column, cell, event){
		// },
        onSearch() {
			var self = this;
			self.param = {
				currentPage:1,	//当前页码	number	
				department:self.formInline.belong,	//所属部门(发券方)	string	@mock=超市
				effect:self.formInline.activeStatus,	//状态0,禁止(待发布),1,激活(已发布)	number	@mock=1
				effectEndTime:Date.parse(self.formDate.endDate),	//用券规则有效结束时间	string	@mock=2019-09-25 00:00:00
				effectStartTime:Date.parse(self.formDate.startDate),	//用券规则有效开始时间	string	@mock=2019-09-25 00:00:00
				pageSize:this.pageSize,	//页大小	number	
				ruleId:parseInt(self.formInline.ruleCode),	//优惠券用券规则编码	number	@mock=3252123
				ruleName:self.formInline.activeName,	//规则名称	string	@mock=梅溪新天地全场购物送200券
				name:self.formInline.cpnsName, //优惠券名称
				dmCode:self.formInline.DMcode,
			}
			self.getData();
		},
		linkToAdd(){
			sessionStorage.clear();
			this.$store.commit('mutationsResetCouponRule');
			this.$router.push({name:'用券规则配置'});
		},
		onReset(){
			this.formInline.activeName = '';
			this.formInline.belong = '';
			this.formInline.activeStatus = '';
			this.formInline.ruleCode = '';
			this.formDate.startDate = '';
			this.formDate.endDate = '';
			this.formInline.cpnsName = '';
			this.formInline.DMcode = '';
			this.onSearch();
		},
		handleSizeChange(val){
			this.pageSize = val;
			this.param.pageSize=this.pageSize;
			this.getData();
		},
		// 列表
		handleCurrentChange(val)
		{

			this.param.currentPage = val;
			this.getData();
		},
		//请求列表数据
		getData()
		{
			let self = this;
			self.currentPage = self.param.currentPage;
			self.listLoading = true;
			self.$ajax.post(self.$apiUrl.coupon.ruleList,self.param
			).then((res) =>
			{
				if (res.error !== 0) {
					self.$message({
					message: res.msg,
					type: 'error'
				});
				}
				self.total = res.data.totalRow;
				self.tableData = res.data.list;
				self.listLoading = false;
				self.forbidHandle();
			})
		},
		//判断审核状态，已发布禁用“编辑”“发布”功能   判断权限，显示隐藏按钮
		forbidHandle()
		{	
			this.btnShow = [];//翻页即清空栈数据
			this.isBtnDisabled = [];//翻页即清空栈数据
			this.isBtnDisabledName = [];
			var tableData = this.tableData;
			var length = tableData.length;

			for (var index = 0; index < length; index++) {
				var colData = tableData[index];
				var checkStatus = colData.effect;
				var able=[true,true,true];
				var disable=[false,false,false];
				if (checkStatus == 1) {
					this.isBtnDisabled.push(able);
					this.isBtnDisabledName.push(able[0])
				}else{
					this.isBtnDisabled.push(disable);
					this.isBtnDisabledName.push(disable[0]);
				}
				
			}
			if (this.buttonArr.indexOf('bt-edit')!=-1) {
				this.btnShow.push(true);
			}else{
				this.btnShow.push(false);
			}
			if (this.buttonArr.indexOf('bt-delete')!=-1) {
				this.btnShow.push(true);
			}else{
				this.btnShow.push(false);
			}
			if (this.buttonArr.indexOf('bt-publish')!=-1) {
				this.btnShow.push(true);
			}else{
				this.btnShow.push(false);
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
			var self= this;
			self.$confirm('请再次核实需要发布的用券规则，促销活动一旦发布规则不能修改！', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
			}).then(() => {
				//发送删除请求，重新渲染列表
				self.$ajax.post(
					self.$apiUrl.coupon.releaseCouponrule,
				{
					id:self.tableData[index].id
				}).then((res) =>
				{
					if (res.error !== 0) {
						self.$message({
						message: res.msg,
						type: 'error'
						});
						return false;
					}
					self.getData();
					self.$message({
						type: 'success',
						message: '发布成功!'
					});
				}).catch((res)=>{
					self.$message({
						message: res.msg,
						type: 'error'
					});
				});
			}).catch(() => {
			self.$message({
				type: 'info',
				message: '已取消发布'
			});          
			});
		},
		//编辑
		editor(index)
		{
			sessionStorage.clear();
			var id = this.tableData[index].id;
			this.$store.commit('mutationsToEditorEnterCouponRule',id);
			// sessionStorage.setItem("isEditorEnter",true)
			this.$router.push({name:'用券规则配置'});
		},
		//删除
		del(index)
		{
			
			var self= this;
			self.$confirm('删除该条数据, 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
			}).then(() => {
				//发送删除请求，重新渲染列表
				self.$ajax.post(
					self.$apiUrl.coupon.deleteCouponrule,
				{
					id:self.tableData[index].id
				}).then((res) =>
				{
					if (res.error !== 0) {
						self.$message({
						message: res.msg,
						type: 'error'
						});
						return false;
					}
					self.getData();
					self.$message({
						message: '删除成功!',
						type: 'success'
					});
				}).catch((res)=>{
					self.$message({
						message: res.msg,
						type: 'error'
					});
				});
			}).catch(() => {
			self.$message({
				type: 'info',
				message: '已取消删除'
			});          
			});
			
		},
		//查看
		view(index){
			sessionStorage.clear();
			var id = this.tableData[index].id;
			this.$store.commit('mutationsToEditorEnterCouponRule',id);
			sessionStorage.setItem("isView",true);
			this.$router.push({name:'用券规则配置'});
		},
    }
}
</script>
<style lang="scss" scoped>
.el-form{
	position: relative;
	background-color: #fff;
	padding: 20px 20px;
	margin-bottom: 20px;
	.el-form-item{
		text-align: right;
		width: 320px;
		// margin:0 20px 22px;
		.el-input{
			width: 213px;
		}
		.el-select{
			width: 213px;
		}
	}
}
.add-new{
	height:100px;
	line-height: 100px;
}
// .search-btn{
//     position: absolute;
//     right:140px;
//     bottom:0;
// }
.btn-area{
    // position: absolute;
	display: block;
	width: 304px!important;
	z-index: 0;
	// float: right;
    // right:0;
    // bottom:0;
	margin-bottom:0;
	.search-btn{
		float: right;
	}
	.reset-btn{
		float: right;
		margin-left: 8px;
	}
	.add-btn{
		float: right;
		margin-left: 8px;
		.add{
			background-color: #52cfaa;
			color:#fff;
			border-color: #fff;
			&:hover,&:active{
				opacity: .8;
			}
		}
	}
}
.first-col-btn{
	color:#666;
}
</style>


