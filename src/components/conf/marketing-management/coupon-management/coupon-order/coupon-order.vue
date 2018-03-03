<template>
	<div class="page-view" v-loading="listLoading" style="padding-bottom: 70px">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="优惠券名称">
					<el-input v-model="formInline.value1" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="formInline.value2" placeholder="选择类型">
					<el-option v-for="(option,index) in options.option2" :label="option" :value="index" :key="option[0]"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="业态">
					<el-select v-model="formInline.value3" placeholder="选择业态">
					<el-option v-for="(option,index) in options.option3" :label="option" :value="index" :key="option[0]"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="门店名称">
					<el-input v-model="formInline.value4" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="订单状态">
					<el-select v-model="formInline.value5" placeholder="选择状态">
					<el-option v-for="(option,index) in options.option5" :label="option" :value="index" :key="option[0]"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="优惠券编码">
					<el-input v-model="formInline.value8" placeholder="请输入ID"></el-input>
				</el-form-item>
				<el-form-item label="下单会员">
					<el-input v-model="formInline.value9" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item label="下单时间" class="pick-time">
					<el-col :span="10">
					<el-date-picker type="date" placeholder="请选择" v-model="formDate.date1" style="width: 100%;"></el-date-picker>
					</el-col>
					<el-col class="line" :span="1">-</el-col>
					<el-col :span="10">
					<el-date-picker type="date" placeholder="请选择" v-model="formDate.date2" style="width: 100%;"></el-date-picker>
					</el-col>
				</el-form-item>
				<el-form-item class="btn-area">
					<div class="add-btn" v-if="addNewName">
						<el-button class="add" size="large" @click="linkToAdd">{{addNewName}}</el-button>
					</div>
					<div class="search-btn">
						<el-button type="primary" size="large" @click="onSearch">搜索</el-button>
					</div>
				</el-form-item>
		</el-form>
		<!-- 列表 -->
		<el-table :data="tableData" style="width: 100%">
			<el-table-column type="selection" width="60px"></el-table-column>
			<el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]" :width="width[index]"></el-table-column>
			<el-table-column label="操作" v-if="operations" width="200px" fixed="right">
				<template scope="scope">
					<el-button type="text" :disabled="isBtnDisabled" v-for="operation in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="mod-toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
			:page-size="20" :total="total" style="float:right;" :current-page="currentPage">
			</el-pagination>
		</el-col>
	</div>
</template>

<script>
export default {
    data() {
		//列表请求参数
		// var param={
		// 	// cpnsId:"",	//优惠券id	number	
		// 	// cpnsName:"",		//优惠券名称	string	
		// 	// currentPage:1,		//当前页	number	默认为1
		// 	// department:"",		//业态	string	
		// 	// exchangeEndTime:"",		//兑换结束时间	number	
		// 	// exchangeStartTime:"",		//兑换开始时间	number	
		// 	// pageSize:"",		//每页条数	number	默认为20
		// 	// receiveEndTime:"",		//领取结束时间	number	
		// 	// receiveStartTime:"",		//领取开始时间	number	
		// 	// statusExt:"",		//状态	number	0进行中, 1过期
		// };
		return {
			// param,
			formInline: {
			value1: '',
			value2: '',
			value3: '',
			value4: '',
			value5: '',
			//   value6: '',
			//   value7: '',
			value8: '',
			value9: '',
			},
			formDate:{
				date1:"",
				date2:"",
				date3:"",
				date4:""
			},
			options: {
				option1: "",
				option2: [
					"满减券",
					"满折券",
					"停车券",
					"升值券",
					"免单券",
				],
				option3: [
					"超市",
					"百货",
					"家电",
					"母婴",
				],
				option4: "",
				option5: [
					"已付款",
					"已退款",
					"退款中"
				],
			},
			addNewName: '',
			labelPosition:"top",
			



			// 列表
			isBtnDisabled:false,
			listLoading:true,
			currentPage: 1,
			sels: [],
			tableData: [],
			page: 1,
			total: 0,
			lableNames: [
				"优惠券名称",
				"优惠券编码",
				"类型",
				"优惠券价格",
				"优惠券状态",
				"所属门店",
				"下单时间",
				"订单金额",
				"下单会员",
				"支付方式",
				"订单状态",
				"退款金额",
			],//列表标题数组集合
			//列宽
			width:[
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
			],
			//请求响应参数名
			props: [
				"order.name",
				"order.code",
				"order.type",
				"order.price",
				"order.status",
				"order.stroe",
				"order.time",
				"order.orderPrice",
				"order.people",
				"order.pay",
				"order.orderStatus",
				"order.backPrice",
			],//请求响应参数数组集合
			operations: "",//操作列，操作能力数组集合
			dialogStatisticsVisible:false,
			index:"",//当前操作的列表行索引，
		}
	},
	mounted()
	{
		this.getData();
		// this.getData(this.param);
	},
	methods: {
        onSearch() {
			var self = this;
			self.getData();
		},
		linkToAdd(){
			this.$router.push({name:'新增优惠券定义'});
		},


		// 列表
		handleCurrentChange(val)
		{
			this.page = val;
			this.getData();
			// this.param.currentPage = val;
			// this.getData(this.param);
		},
		//请求mock数据
		getData()
		{
			let self = this;
			self.currentPage = self.page;
			self.listLoading = true;
			self.$ajax.post('http://t.com/marketing-management/coupon-management/list',
			{
				page: self.page
			}).then((res) =>
			{
				self.total = res.data.total;
				self.tableData = res.data.tableData;
				self.listLoading = false;
			});
		},
		//请求列表数据
		// getData(param)
		// {
		// 	console.log(param);
		// 	let self = this;
		// 	self.currentPage = self.param.currentPage;
		// 	self.listLoading = true;
		// 	self.$ajax.post('http://shopmanage.yunhou.com/api/Coupon/verification',param
		// 	).then((res) =>
		// 	{
		// 		if (res.error !== 0) {
		// 			self.$message({
		// 			message: res.msg,
		// 			type: 'error'
		// 		});
		// 		}
		// 		self.total = res.data.totalPage;
		// 		self.tableData = res.data.list;
		// 		self.listLoading = false;
		// 	}).catch((res)=>{
		// 		self.$message({
		// 			message: res.msg,
		// 			type: 'error'
		// 		});
		// 		console.log("res erro!");
		// 	});
		// },
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
			this.dialogStatisticsVisible=true;
		
		},
		//编辑
		editor()
		{
			this.$router.push({name:'修改'});
		},
		//删除
		del()
		{

		},
    }
}
</script>
<style lang="scss" scoped>
.el-form{
	position: relative;
	background-color: #fff;
	padding: 20px 20px 0;
	margin-bottom: 10px;
	.el-form-item{
		text-align: right;
		width: 320px;
		// margin:0 20px 22px;
		.el-input{
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
.pick-time{
	width: 535px!important;
}
.btn-area{
    position: absolute;
	display: inline-block;
	width: 250px!important;
	z-index: 0;
	// float: right;
    right:0;
    bottom:0;
	.search-btn{
		float: right;
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
</style>


