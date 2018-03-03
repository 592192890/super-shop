<template>
	<div class="page-view" v-loading="listLoading" style="padding-bottom: 70px">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="优惠券名称">
				<el-input v-model="formInline.name" placeholder="请输入名称"></el-input>
			</el-form-item>
			<el-form-item label="类型">
				<el-select v-model="formInline.type" placeholder="选择种类">
				<el-option v-for="(option,index) in options.option2" :label="option" :value="index+1" :key="option[0]"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="所属部门">
				<el-select v-model="formInline.department" placeholder="请选择">
				<!-- <el-option v-for="(option,index) in options.option3" :label="option" :value="index" :key="option[0]"></el-option> -->
				<el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态">
				<el-select v-model="formInline.effect" placeholder="请选择">
				<el-option v-for="(option,index) in options.option4" :label="option" :value="index" :key="option[0]"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="优惠券编码">
				<el-input v-model="formInline.cpnsId" placeholder="优惠券定义编码"></el-input>
			</el-form-item>
			<el-form-item label="有效期">
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
			<!-- <el-table-column type="selection" width="60px"></el-table-column> -->
			<el-table-column label="优惠券名称" width="200px" :show-overflow-tooltip="true">
				<template scope="scope">
					<el-button class="first-col-btn" type="text" v-if="!btnShow[0]" @click="view([scope.$index])">{{ scope.row.name }}</el-button>
					<el-button class="first-col-btn" type="text" v-if="btnShow[0]" @click="editor([scope.$index])">{{ scope.row.name }}</el-button>
				</template>
			</el-table-column>
			<el-table-column label="优惠券定义编码" prop="cpnsId" width="250px"></el-table-column>
			<el-table-column label="类型" prop="typeText" width="150px"></el-table-column>
			<el-table-column label="金额" width="150px">
				<template scope="scope">
					<span class="first-col-btn" type="text">{{scope.row[priceProp[scope.$index]] | addUnits(priceProp[scope.$index])}}</span>
				</template>
			</el-table-column>
			<el-table-column label="有效时间" prop="expireTime" width="350px"></el-table-column>
			<el-table-column label="状态" prop="effectText" width="150px"></el-table-column>
			<el-table-column label="所属部门" prop="departmentName" width="150px"></el-table-column>
			<el-table-column label="操作" v-if="tableData.length && operations" width="200px" fixed="right">
				<template scope="scope">
					<el-button type="text" v-if="btnShow[index]" :disabled="isBtnDisabled" v-for="(operation,index) in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
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
		<el-dialog class="statistics" title="统计" :visible.sync="dialogStatisticsVisible">
			<statistics-Dialog :statisticsData="statisticsData"></statistics-Dialog>
		</el-dialog>
	</div>
</template>

<script>
import statisticsDialog from './statistics-dialog.vue'
import Permission from '@/assets/js/permission-util.js';
export default {
	components:{
		statisticsDialog
	},
    data() {
		
		//列表请求参数
		var param={
			currentPage:1,
			pageSize:20,
			cpnsId:"",//优惠券定义编码	number	@mock=1000000866
			createTime:"",	//优惠券创建时间	string	@mock=1504169476000
			// department:"",	//所属部门id	number	@mock=1
			effect:"",	//是否有效	number	1失效 , 0有效
			expireTime:"",	//优惠券有效时间	number	@mock=1504169476000
			name:"",	//优惠券名称	string	@mock=新人礼包5元券
			type:"",	//优惠券类型	number	1,满减券 2,满折券 3,停车券 4,现金券 5,升值券 6,免单券
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
				type: '',
				department: '',
				effect: '',
				cpnsId: '',
				expireTime: '',
			},
			options: {
				option1: "",
				option2: [
					"满减券",
					"满折券",
					"停车券",
					"升值券",
					"免单券",
					"现金券",
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
			addNewName: '新增优惠券',
			



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
				"编辑",
				"统计"
			],//操作列，操作能力数组集合
			dialogStatisticsVisible:false,
			index:"",//当前操作的列表行索引，
			statisticsData:{
				couponName:"",//当前操作列优惠券名称
				validTime:"",//当前操作列有效时间
				startTime:"",//当前行的开始时间
				endTime:"",//当前行的结束时间
				maxNum:"",//发行总量
				grantNum:"",//已发放数量

				
			}
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
	},
	methods: {
        onSearch() {
			var self = this;
			self.param = {
				currentPage:1,
				pageSize:self.pageSize,
				cpnsId:parseInt(this.formInline.cpnsId),//优惠券定义编码	number	@mock=1000000866
				createTime:Date.parse(this.formInline.expireTime[0]),	//优惠券创建时间	string	@mock=1504169476000
				department:this.formInline.department,	//所属部门id	number	@mock=1
				effect:parseInt(this.formInline.effect),	//是否有效	number	1失效 , 0有效
				expireTime:Date.parse(this.formInline.expireTime[1]),	//优惠券有效时间	number	@mock=1504169476000
				name:this.formInline.name,	//优惠券名称	string	@mock=新人礼包5元券
				type:parseInt(this.formInline.type),	//优惠券类型	number	1,满减券 2,满折券 3,停车券 4,现金券 5,升值券 6,免单券
			}
			self.getData();
		},
		linkToAdd(){
			this.$router.push({name:'新增优惠券定义'});
			
		},
		onReset(){
			this.formInline.name = '';
			this.formInline.type = '';
			this.formInline.department = '';
			this.formInline.effect = '';
			this.formInline.cpnsId = '';
			this.formInline.expireTime = '';
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
				if(data[i].type == 5){//是免单券
					this.priceProp.push("freeCondAmount")
				}else if(data[i].type == 4){//是升值券
					this.priceProp.push("revalue")
				}else if(data[i].type == 2){//是满折券
					this.priceProp.push("discountText")
				}else{//其他类型券
					this.priceProp.push("amount")
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
				case "统计":
					self.statistics(index);
					break;
				case "删除":
					self.del(index);
					break;
			}
			
		},
		//统计
		statistics(index)
		{	
			var cpnsId = this.tableData[index].cpnsId;
			//获取当前行统计数据
			this.$ajax.post(this.$apiUrl.coupon.grantStatistics,{cpnsId:cpnsId}
			).then((res) =>
			{
				if (res.error !== 0) {
					this.$message({
					message: res.msg,
					type: 'error'
					});
				}
				var data = res.data;
				//统计当前行的优惠券名称
				this.statisticsData.couponName = data.name;
				//统计当前行的开始时间
				this.statisticsData.startTime = data.createTime;
				//统计当前行的结束时间
				this.statisticsData.endTime = data.expireTime;
				//最大数量
				this.statisticsData.maxNum = data.maxNum;
				//已发放数量
				this.statisticsData.grantNum = data.grantNum;
				this.dialogStatisticsVisible=true;
			})
			
			
		},
		//编辑
		editor(index)
		{	
			sessionStorage.clear();
			//获取当前行的所属部门、优惠券类型、优惠券金额
			var colData = this.tableData[index];
			sessionStorage.setItem('id',colData.id);
			this.$router.push({name:'修改'});
		},
		//删除
		del()
		{
			
		},
		//查看
		view(index){
			sessionStorage.clear();
			//获取当前行的所属部门、优惠券类型、优惠券金额
			var colData = this.tableData[index];
			sessionStorage.setItem('id',colData.id);
			sessionStorage.setItem('isView',true);
			this.$router.push({name:'修改'});
		}
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
	width: 280px!important;
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

