<template>
	<div class="page-view">
		<div class="title">优惠券发放情况表</div>
		<!-- <list class="list"></list> -->
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="已发放" name="first"></el-tab-pane>
			<el-tab-pane label="未发放" name="second"></el-tab-pane>
		</el-tabs>
		<div class="mod-search-table">
			<el-table :data="tableData" style="width: 100%" v-loading="listLoading">
				<el-table-column type="selection" width="60px"></el-table-column>
				<el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]">
				</el-table-column>
			</el-table>
				<el-col :span="24" class="mod-toolbar">
				<el-pagination
				style="float:right;"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="pageNo"
				:page-sizes="[10, 20, 30, 40]"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
				</el-pagination>
			</el-col>
		</div>
		<el-button class="btn-back" @click="backToCouponIssuance">返回</el-button>
	</div>
</template>

<script>
// import list from '../list.vue'
export default {
    data(){
		var param = {
			batchId: "",	//发放批次ID	number	@mock=21351153
			pageNo:1,	//当前页	number	@mock=1
			pageSize:20,	//页大小	number	@mock=20
			status:1,	//查询状态（0:失败结果 1：成功结果）	string	@mock=1
		}
        return{
			param,
			activeName:"first",
			isBtnDisabled:false,
			listLoading:false,
			pageNo: 1,
			sels: [],
			tableData: [],
			pageSize: 20,
			total: 0,
			lableNames: [
				"优惠券名称",
				"会员手机号码",
				"优惠券编码",
				"状态",
			],//列表标题数组集合
			//请求响应参数名
			props: [
				"cpnsName",
				"phoneNumber",
				"cpnsId",
				"message",
			],//请求响应参数数组集合
			operations: "",//操作列，操作能力数组集合
			index:"",//当前操作的列表行索引
        }
	},
	mounted()
	{
		if(sessionStorage.getItem("batchId")){
			var self =this;
			var batchId = sessionStorage.getItem("batchId");
			self.param.batchId = batchId;
			self.getData();
		}
	},
	methods:{
		handleClick(tab, event) {
			var self = this;
			console.log(tab.name);
			if (tab.name == "first") {
				self.param.status = 1;
				self.getData();
			}else if(tab.name == "second"){
				self.param.status = 0;
				self.getData();
			}
      	},
		backToCouponIssuance(){
			sessionStorage.clear();
			// this.$router.push({name:'优惠券发放'});
			this.$router.push({name:'优惠券发放列表'});
		},
		handleSizeChange(val){
			this.pageSize = val;
			this.param.pageSize=this.pageSize;
			this.getData();
		},

		// 列表
		handleCurrentChange(val)
		{
			this.param.pageNo = val;
			this.getData();
		},
		//请求列表数据
		getData()
		{
			let self = this;
			self.currentPage = self.param.currentPage;
			self.listLoading = true;
			self.$ajax.post(self.$apiUrl.coupon.grantResult,self.param
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
			})
		},
	}
}
</script>

<style lang="scss">

</style>


<style lang="scss" scoped>
.page-view{
	position: relative;
	margin-top: 30px;
}
.title{
	font-size: 20px;
	line-height: 20px;
	margin-bottom:20px;
	font-weight:bold;
}
.btn-back{
	position: absolute;
	margin-top:25px;
	left:0;
	// bottom:0
}
.mod-search-table{
	margin-top:-12px;
}
.el-tabs__header{
	margin:20px 0 0 0!important;
}
</style>


