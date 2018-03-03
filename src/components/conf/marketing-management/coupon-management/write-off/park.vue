<template>
	<div class="page-view" v-loading="listLoading" style="padding-bottom: 70px">
		<el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
				<el-form-item label="优惠券名称">
					<el-input v-model="formInline.cpnsName" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="业态">
					<el-select v-model="formInline.department" placeholder="选择业态">
					<el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="option[0]"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="门店ID">
					<el-input v-model="formInline.shopId" placeholder="请输入名称"></el-input>
				</el-form-item> -->
				<el-form-item label="优惠券状态">
					<el-select v-model="formInline.statusExt" placeholder="选择状态">
					<el-option v-for="(option,index) in options.option4" :label="option" :value="index" :key="option[0]"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="优惠券编码">
					<el-input v-model="formInline.cpnsId" placeholder="请输入编码"></el-input>
				</el-form-item>
				<el-form-item label="领取时间" class="pick-time">
					<el-form-item class="inline" prop="receiveStartTime">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.receiveStartTime"></el-date-picker>
					</el-form-item>
					<span class="line">-</span>
					<el-form-item class="inline" prop="receiveEndTime">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.receiveEndTime"></el-date-picker>
					</el-form-item>
				</el-form-item>
				<el-form-item label="兑换时间" class="pick-time">
					<el-form-item class="inline" prop="exchangeStartTime">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.exchangeStartTime"></el-date-picker>
					</el-form-item>
					<span class="line">-</span>
					<el-form-item class="inline" prop="exchangeEndTime">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.exchangeEndTime"></el-date-picker>
					</el-form-item>
				</el-form-item>
				<el-form-item class="btn-area">
					<div class="reset-btn">
						<el-button size="large" @click="onReset">重置</el-button>
					</div>
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
			<!-- <el-table-column type="selection" width="60px"></el-table-column> -->
			<el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]" :width="width[index]" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="操作" v-if="operations" width="200px" fixed="right">
				<template scope="scope">
					<el-button type="text" :disabled="isBtnDisabled" v-for="operation in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
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
export default {
    data() {
		//领取结束时间大于开始时间验证
        var receiveEndTime = (rule, value, callback) => {
            if (this.formInline.receiveStartTime && this.formInline.receiveEndTime && (Date.parse(this.formInline.receiveStartTime)>=Date.parse(this.formInline.receiveEndTime))) {
                callback(new Error('时间需晚于起始时间'));
            }else{
                callback();
            }
		}
		//领取开始时间小于结束时间验证
        var receiveStartTime = (rule, value, callback) => {
            if (this.formInline.receiveStartTime && this.formInline.receiveEndTime && (Date.parse(this.formInline.receiveStartTime)>=Date.parse(this.formInline.receiveEndTime))) {
                callback(new Error('时间需早于结束时间'));
            }else{
                callback();
            }
		}
		//兑换结束时间大于开始时间验证
        var exchangeEndTime = (rule, value, callback) => {
            if (this.formInline.exchangeStartTime && this.formInline.exchangeEndTime && (Date.parse(this.formInline.exchangeStartTime)>=Date.parse(this.formInline.exchangeEndTime))) {
                callback(new Error('时间需晚于起始时间'));
            }else{
                callback();
            }
		}
		//兑换开始时间小于结束时间验证
        var exchangeStartTime = (rule, value, callback) => {
            if (this.formInline.exchangeStartTime && this.formInline.exchangeEndTime && (Date.parse(this.formInline.exchangeStartTime)>=Date.parse(this.formInline.exchangeEndTime))) {
                callback(new Error('时间需早于结束时间'));
            }else{
                callback();
            }
        }
		//列表请求参数
		var param={
			couponCode:"",	//优惠券编码	number	
			cpnsName:"",		//优惠券名称	string	
			currentPage:1,		//当前页	number	默认为1
			department:"",		//业态	string	
			exchangeEndTime:"",		//兑换结束时间	number	
			exchangeStartTime:"",		//兑换开始时间	number	
			pageSize:20,		//每页条数	number	默认为20
			receiveEndTime:"",		//领取结束时间	number	
			receiveStartTime:"",		//领取开始时间	number	
			statusExt:"",		//状态	number	0进行中, 1过期
		};
		return {
			pageSize:20,
			rules: {
                receiveStartTime: [
                    { validator: receiveStartTime, trigger: 'change' }
                ],
                receiveEndTime: [
                    { validator: receiveEndTime, trigger: 'change'}
				],
				exchangeStartTime: [
                    { validator: exchangeStartTime, trigger: 'change' }
                ],
                exchangeEndTime: [
                    { validator: exchangeEndTime, trigger: 'change'}
                ],
            },
			param,
			formInline: {
				cpnsName: '',
				department: '',
				shopId: '',
				statusExt: '',
				cpnsId: '',
				receiveStartTime: '',
				receiveEndTime: '',
				exchangeStartTime: '',
				exchangeEndTime: '',
			},
			options: {
				option1: "",
				option2: [
					"超市",
					"百货",
					"家电",
					"母婴",
				],
				option3: "",
				option4: [
					"已过期",
					"进行中"
				],
				option5: "",
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
			departmentData:[],
			lableNames: [
				"优惠券名称",
				"优惠券编码",
				"业态",
				"会员ID",
				"优惠券状态",
				"领取时间",
				"使用时间",
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
			],
			//请求响应参数名
			props: [
				"cpnsName",
				"couponCode",
				"departmentName",
				"mobile",
				"statusExt",
				"createTime",
				"time",
			],//请求响应参数数组集合
			operations: "",//操作列，操作能力数组集合
			index:"",//当前操作的列表行索引，
		}
	},
	mounted()
	{
		//获取当前所有业务线
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
				couponCode:parseInt(self.formInline.cpnsId),	//优惠券id	number	
				cpnsName:self.formInline.cpnsName,		//优惠券名称	string	
				currentPage:1,		//当前页	number	默认为1
				department:self.formInline.department,		//业态	string	
				exchangeEndTime:Date.parse(self.formInline.exchangeEndTime),		//兑换结束时间	number	
				exchangeStartTime:Date.parse(self.formInline.exchangeStartTime),		//兑换开始时间	number	
				pageSize:self.pageSize,		//每页条数	number	默认为20
				receiveEndTime:Date.parse(self.formInline.receiveEndTime),		//领取结束时间	number	
				receiveStartTime:Date.parse(self.formInline.receiveStartTime),		//领取开始时间	number	
				statusExt:self.formInline.statusExt,		//状态	number	0进行中, 1过期
			}
			self.getData();
		},
		linkToAdd(){
			this.$router.push({name:'新增优惠券定义'});
		},
		onReset(){
			this.formInline.cpnsName = '';
			this.formInline.department = '';
			this.formInline.statusExt = '';
			this.formInline.cpnsId = '';
			this.formInline.receiveStartTime = '';
			this.formInline.receiveEndTime = '';
			this.formInline.exchangeStartTime = '';
			this.formInline.exchangeEndTime = '';
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
		getData()
		{
			let self = this;
			self.currentPage = self.param.currentPage;
			self.listLoading = true;
			self.$ajax.post(self.$apiUrl.coupon.parking,self.param
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
			}).catch((res)=>{
				self.$message({
					message: res.msg,
					type: 'error'
				});
			});
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
.pick-time{
	width: 546px!important;
}
.btn-area{
    display: block;
	width: 180px!important;
	z-index: 0;
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
.inline{
	display: inline-block;
	width:auto!important;
	margin-right: 0;
}
</style>

