<template>
	<div class="page-view" v-loading="listLoading" style="padding-bottom: 70px">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="优惠券名称">
				<el-input v-model="formInline.name" placeholder="请输入名称"></el-input>
			</el-form-item>
			<el-form-item label="优惠券状态">
				<el-select v-model="formInline.status" placeholder="选择状态">
				<el-option v-for="(option,index) in options.option2" :label="option" :value="index" :key="option[0]"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="优惠券ID">
				<el-input v-model="formInline.cpnsId" placeholder="请输入ID"></el-input>
			</el-form-item>
			<el-form-item label="发放时间">
				<el-date-picker type="datetimerange" placeholder="请选择时间范围" v-model="formInline.expireTime"></el-date-picker>
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
			<el-table-column label="优惠券名称" :show-overflow-tooltip="true">
				<template scope="scope">
					<!-- <el-button class="first-col-btn" type="text" v-if="!btnShow[0]" @click="view([scope.$index])">{{ scope.row.cpnsName }}</el-button> -->
					<el-button class="first-col-btn" type="text" :disabled="priceProp[scope.$index]" @click="editor([scope.$index])">{{ scope.row.cpnsName }}</el-button>
				</template>
			</el-table-column>
			<el-table-column label="优惠券ID" prop="cpnsId"></el-table-column>
			<el-table-column label="发放时间" prop="createTime"></el-table-column>
			<el-table-column label="发放状态" prop="statusName"></el-table-column>
			<el-table-column label="操作" v-if="tableData.length && operations" width="200px" fixed="right">
				<template scope="scope">
					<!-- <el-button type="text" v-if="priceProp[index]" :disabled="isBtnDisabled" v-for="(operation,index) in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button> -->
					<el-button type="text" :disabled="priceProp[scope.$index]" v-for="(operation,index) in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="mod-toolbar">
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
		
		//列表请求参数
		var param={
			currentPage:1,
			pageSize:20,
			cpnsId:"",	//优惠券id	number	@mock=8888888
			cpnsName:"",	//优惠券名称	string	
			endQueryTime:"",	//时间戳	number	
			startQueryTime:"", //时间戳	number	
			status:"",	//发放状态，0，未发放 1，已发放	string	@mock=10
		};
		return {
			priceProp:[],
			pageSize:20,
			btnShow:[],
			buttonArr:[],
			departmentData:[],//全部业态
			param,
			formInline: {
				name: '',
				status: '',
				department: '',
				effect: '',
				cpnsId: '',
				expireTime: '',
			},
			options: {
				option1: "",
				option2: [
					"未发放",
					"已发放",
					"发放中",
				],
				option3: [
					"百货",
					"超市",
					"电器",
					"置业",
					"便利",
					"珠宝",
				],
				option4: [
					"过期",
					"有效"
				],
				option5: "",
			},
			addNewName: '新增优惠券发放',
			



			// 列表
			isBtnDisabled:false,
			listLoading:false,
			currentPage: 1,
			sels: [],
			tableData: [],
			page: 1,
			total: 0,
			lableNames: [
				"优惠券定义编码",
				"类型",
				"金额",
				"有效时间",
				"状态",
				"所属部门",
			],//列表标题数组集合
			//请求响应参数名
			props: [
				"cpnsId",
				"typeText",
				"amount",
				"expireTime",
				"effectText",
				"departmentName",
			],//请求响应参数数组集合
			//列宽
			width:[
				"200",
				"150",
				"150",
				"350",
				"150",
				"150",
			],
			operations: [
				"查看",
			],//操作列，操作能力数组集合
			dialogStatisticsVisible:false,
			index:"",//当前操作的列表行索引，
			// statisticsData:{
			// 	couponName:"",//当前操作列优惠券名称
			// 	validTime:"",//当前操作列有效时间
			// 	startTime:"",//当前行的开始时间
			// 	endTime:"",//当前行的结束时间
			// 	maxNum:"",//发行总量
			// 	grantNum:"",//已发放数量

				
			// }
		}
	},
	filters: {
    addUnits: function (value,type) {
    	if(type !== "discountText"){//满折券不用加单位
			if (!value) {
				return "";
			}
			return value+"元";
		}else{
			return value;
		}
      	
    }
  },
	mounted()
	{
		this.buttonArr=Permission.button(this.$route.path,this.$router.options.routes);
		this.getData();
	},
	methods: {
        onSearch() {
			var self = this;
			self.param = {
				currentPage:1,
				pageSize:self.pageSize,
				cpnsId:parseInt(this.formInline.cpnsId),	//优惠券id	number	@mock=8888888
				cpnsName:this.formInline.name,	//优惠券名称	string	
				endQueryTime:Date.parse(this.formInline.expireTime[1]),	//时间戳	number	
				startQueryTime:Date.parse(this.formInline.expireTime[0]), //时间戳	number	
				status:this.formInline.status,	//发放状态，0，未发放 1，已发放	string	@mock=10
			}
			console.log(self.param)
			self.getData();
		},
		linkToAdd(){
			this.$router.push({name:'新增优惠券发放'});
			
		},
		onReset(){
			this.formInline.name = '';
			this.formInline.cpnsId = '';
			this.formInline.expireTime = [];
			this.formInline.status = "";
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
			self.$ajax.post(self.$apiUrl.coupon.grantByHandlist,self.param
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
				console.log(self.tableData)
				self.listLoading = false;
				self.forbidHandle();
			})
		},
		//判断审核状态，已发布禁用“编辑”“发布”功能   判断权限，显示隐藏按钮
		forbidHandle()
		{	
			this.btnShow = [];//翻页即清空栈数据
			if (this.buttonArr.indexOf('bt-edit')!=-1) {
				this.btnShow.push(true);
			}else{
				this.btnShow.push(false);
			}
			this.btnShow.push(true);
			this.priceProp=[];
			var data = this.tableData;
			for (var i = 0; i < data.length; i++) {
				if(data[i].status == 0){//是未发放状态
					this.priceProp.push(true)
				}else{//其他类型券
					this.priceProp.push(false)
				}
				
			}
			console.log(this.priceProp)
		},
		whichType(type,index)
		{
			var self = this;
			switch(type){
				case "查看":
					self.editor(index);
					break;
				// case "统计":
				// 	self.statistics(index);
				// 	break;
				// case "删除":
				// 	self.del(index);
				// 	break;
			}
			
		},
		//统计
		// statistics(index)
		// {	
		// 	var cpnsId = this.tableData[index].cpnsId;
		// 	//获取当前行统计数据
		// 	// this.$ajax.post(this.$apiUrl.coupon.grantStatistics,{cpnsId:cpnsId}
		// 	// ).then((res) =>
		// 	// {
		// 	// 	if (res.error !== 0) {
		// 	// 		this.$message({
		// 	// 		message: res.msg,
		// 	// 		type: 'error'
		// 	// 		});
		// 	// 	}
		// 	// 	var data = res.data;
		// 	// 	//统计当前行的优惠券名称
		// 	// 	this.statisticsData.couponName = data.name;
		// 	// 	//统计当前行的开始时间
		// 	// 	this.statisticsData.startTime = data.createTime;
		// 	// 	//统计当前行的结束时间
		// 	// 	this.statisticsData.endTime = data.expireTime;
		// 	// 	//最大数量
		// 	// 	this.statisticsData.maxNum = data.maxNum;
		// 	// 	//已发放数量
		// 	// 	this.statisticsData.grantNum = data.grantNum;
		// 	// 	this.dialogStatisticsVisible=true;
		// 	// })
			
			
		// },
		//查看
		editor(index)
		{	
			sessionStorage.clear();
			//获取当前行的所属部门、优惠券类型、优惠券金额
			var colData = this.tableData[index];
			sessionStorage.setItem('batchId',colData.batchId);
			this.$router.push({name:'发放结果页'});
		},
		// //删除
		// del()
		// {
			
		// },
		// //查看
		// view(index){
		// 	sessionStorage.clear();
		// 	//获取当前行的所属部门、优惠券类型、优惠券金额
		// 	var colData = this.tableData[index];
		// 	sessionStorage.setItem('id',colData.id);
		// 	sessionStorage.setItem('isView',true);
		// 	this.$router.push({name:'修改'});
		// }
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
.btn-area{
    // position: absolute;
	display:block;
	width: 330px!important;
	z-index: 0;
	// float: right;
    // right:0;
    // bottom:0;
	margin-bottom: 0;
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
.statistics{
	width: 1600px;
}
</style>

