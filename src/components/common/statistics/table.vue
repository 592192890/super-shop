<template>
	<div>
		<div  class="mod-search-table">
			<el-table :data="form.list" style="width: 100%" v-loading="listLoading" >
				<el-table-column prop="goodsName" label="商品名称">
				</el-table-column>
				<el-table-column prop="bn" label="SKU编码">
				</el-table-column>
				<el-table-column prop="specName" label="规格">
				</el-table-column>
				<el-table-column prop="shopName" label="店铺名称">
				</el-table-column>
				<el-table-column prop="saleNum" label="销售量">
				</el-table-column>
				<el-table-column prop="saleMoney" label="销售金额">
				</el-table-column>
			</el-table>
		</div>
	<div class="mod-toolbar">
		<el-pagination v-if="form.list" layout="prev, pager, next" @current-change="handleCurrentChange"
		:page-size="form.pageSize" :total="form.total" :current-page.sync="form.currentPage">
		</el-pagination>
	</div>
</div>
</template>
<script>
	export default {
		props:['bus', 'comData', 'popData'],
		data(){
			return {
				listLoading:true,
				form: {
					currentPage: 1,
					total: 0,
					pageSize: 10,
					list: []
				}
			}
		},
		methods:
		{
			//part select
			handleCurrentChange(val)
			{
				this.form.currentPage = val;
				this.getData();
			},
			getData()
			{
				var self = this;
				var opt = {
					currentPage: self.form.currentPage, 
					id: self.popData.sels.id, 
					pageSize: self.form.pageSize
				};
				self.listLoading = true;
				self.$ajax.post(self.$apiUrl.marketing.statistic,opt
				).then((res) =>
				{
					this.form = Object.assign(this.form, res.data);
					self.listLoading = false;
				});
			}
		},
		watch:{
			comData(){
				var self = this;
				this.form = Object.assign(this.form, this.comData);
				self.listLoading = false;
			}	
		}
	}
</script>
<style lang="scss" scoped>
.mod-toolbar{
	min-height: 50px;
}
</style>
