<template>
	<div>
		<div  class="mod-search-table">
			<el-table :data="tableData" style="width: 100%" v-loading="listLoading" @select="selsChange" ref="elTable" @select-all="selsChangeAll">
				<el-table-column type="selection" width="100">
				</el-table-column>
				<el-table-column prop="shopName" label="店铺名称">
				</el-table-column>
				<el-table-column prop="shopMdCode" label="店铺编码">
				</el-table-column>
				<!-- <el-table-column prop="c1" label="店铺地址"> -->
				<!-- </el-table-column> -->
				<el-table-column prop="onlineOfflineName" label="所属渠道">
				</el-table-column>
				<el-table-column prop="businessTypeName" label="业态">
				</el-table-column>
			</el-table>
		</div>
	<div class="mod-toolbar">
		<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
		:page-size="pageSize" :total="total" :current-page.sync="page">
		</el-pagination>
	</div>
</div>
</template>
<script>
	export default {
		props:['bus', 'comData', 'popSels'],
		data(){
			return {
				formData:{},
				listLoading:true,
				tableData: [],
				shopSels:this.popSels,
				sels:[],
				checked:{},
				pageSize:10,
				page: 1,
				total: 0
			}
		},
		methods:
		{
			getIds(sels){
				var ar = [];
				for(var key in sels){
					ar.push(key);	
				}	
				return ar;
			},
			//part select
			selsChange(sels, row)
			{
				(this.sels[row.id])?(delete this.sels[row.id]):(this.sels[row.id] = row);
				this.bus.$emit('part-shop/table/cols', this.getIds(this.sels));
			},
			//select all
			selsChangeAll(sels){
				this.tableData.forEach(item=>{
					if(sels.length==0){
						this.sels[item.id] && (delete this.sels[item.id]);	
					}else{
						this.sels[item.id] = item;
					}
				})	
				this.bus.$emit('part-shop/table/cols', this.getIds(this.sels));
			},
			handleCurrentChange(val)
			{
				this.page = val;
				this.getData();
			},
			selectedOption(){
				var rows = this.tableData;
				var selectedRows = this.sels;
				if(rows && rows.length!=0){
					rows.forEach(row => {
						 if(selectedRows && selectedRows[row.id]){
							 this.checked[row.id] = row;
							 if(this.$refs.elTable){
							 this.$refs.elTable.toggleRowSelection(row);
							 }
						 } 
					});	 
				}
			},
			getData()
			{
				var self = this;
				var opt = Object.assign({pageSize:self.pageSize, currentPage: self.page, businessTypeCodeSelected: '', onlineOfflineSelected: ''}, this.formData||{});
				self.listLoading = true;
				self.$ajax.post('http://shopmanage.yunhou.com/api/Xeshop/index',opt
				).then((res) =>
				{
					self.total = res.data.totalRow;
					self.tableData = res.data.list;
					self.listLoading = false;
				});
			},
			changeSels(){
				var obj  = {};	
				this.shopSels.forEach(item => {
					obj[item] = {id:item};	
				});
				this.sels = obj;
			}
		},
		created()
		{
			var self = this;
			self.getData();
			self.changeSels();
			self.selectedOption();
			//
			this.bus.$on('part-shop/search', function(obj){
				self.formData = obj;
				(self.page == 1)?self.getData():(self.page = 1);
			});
			this.bus.$on('loaded', function(obj){
				self.shopSels = obj.sels;
				self.checked = {};
			  self.$refs.elTable && self.$refs.elTable.clearSelection();
				self.changeSels();
				self.selectedOption();
			});
		},
		updated(){
			this.selectedOption();
		}

	}
</script>
