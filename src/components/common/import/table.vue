<template>
	<div>
		<div  class="mod-search-table">
			<el-table :data="tableData" style="width: 100%" v-loading="listLoading" >
				<el-table-column prop="c1" label="商品名称">
				</el-table-column>
				<el-table-column prop="c2" label="商品编码">
				</el-table-column>
				<el-table-column prop="c3" label="店铺名称">
				</el-table-column>
				<el-table-column prop="c4" label="销售量">
				</el-table-column>
				<el-table-column prop="c5" label="销售金额">
				</el-table-column>
			</el-table>
		</div>
	<div class="mod-toolbar">
		<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
		:page-size="20" :total="total" :current-page.sync="page">
		</el-pagination>
	</div>
</div>
</template>
<script>
	export default {
		props:['bus', 'comData'],
		data(){
			return {
				formData:{},
				listLoading:true,
				tableData: [],
				checked:{},
				page: 1,
				total: 0
			}
		},
		methods:
		{
			//part select
			handleCurrentChange(val)
			{
				this.page = val;
				this.getData();
			},
			getData()
			{
				var self = this;
				var opt = Object.assign({page: self.page}, this.formData||{});
				self.listLoading = true;
				self.$ajax.post('http://t.com/table',opt
				).then((res) =>
				{
					self.total = res.data.total;
					self.tableData = res.data.tableData;
					self.listLoading = false;
				});
			}
		},
		created()
		{
			var self = this;
			this.formData = this.comData;
			this.getData();
		}
	}
</script>
