<template>
	<div>
		<div  class="mod-search-table">
			<el-table :data="tableData" style="width: 100%" v-loading="listLoading" @select="selsChange" ref="elTable" @select-all="selsChangeAll">
				<el-table-column type="selection" width="100">
				</el-table-column>
				<el-table-column prop="brandName" label="品牌名称">
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
	import util from '@/assets/js/util'
	export default {
		props:['bus', 'popSels', 'shopIds'],
		data(){
			return {
				formData:{},
				listLoading:true,
				tableData: [],
				sels:[],
				selsCache:[],
				checked:{},
				listLoading: true,
				page: 1,
				total: 0,
				pageSize: 10
			}
		},
		methods:
		{
			//part select
			selsChange(sels, row)
			{
				if(this.sels[row.brandId]){
					delete this.sels[row.brandId]
				}else{
					if(this.selsCache[row.brandId]){
						this.sels[row.brandId] = this.selsCache[row.brandId];
					}else{
						this.sels[row.brandId] = row
					}
				}
				this.bus.$emit('table/cols', this.sels);
			},
			//select all
			selsChangeAll(sels){
				this.tableData && this.tableData.forEach(item=>{
					if(sels.length==0){
						this.sels[item.brandId] && (delete this.sels[item.brandId]);	
					}else{
						if(this.selsCache[item.brandId]){
							this.sels[item.brandId] = this.selsCache[item.brandId];
						}else{
							this.sels[item.brandId] = item;
						}
					}
				})	
				this.bus.$emit('table/cols', this.sels);
			},
			handleCurrentChange(val)
			{
				this.page= val;
				this.getData();
			},
			selectedOption(){
				var rows = this.tableData;
				var selectedRows = this.sels;
				var self = this;
				if(rows && rows.length!=0){
					rows.forEach(row => {
						 if(selectedRows && selectedRows[row.brandId]){
							 this.checked[row.brandId] = row;
							 this.$nextTick(function() {
								 if(self.$refs.elTable){
									 self.$refs.elTable.toggleRowSelection(row);
								 }
							 });
						 } 
					 });	 
				}
			},
			getData()
			{
				var self = this;
				var opt = Object.assign({currentPage: self.page, pageSize: self.pageSize, shopIds: JSON.stringify(self.shopIds)}, this.formData||{});
				self.listLoading = true;
				self.$ajax.post('http://shopmanage.yunhou.com/api/Brand/list',opt
				).then((res) =>
				{
					self.total = res.data.totalRow;
					self.tableData = res.data.list;
					self.listLoading = false;
					self.selectedOption();
				});
			},
			changeSels(){
				var obj  = {};	
				this.popSels && this.popSels.forEach(item => {
					obj[item.brandId] = item;	
				});
				Object.assign(this.sels, obj);
				Object.assign(this.selsCache, obj);
			}
		},
		mounted()
		{
			var self = this;
			this.getData();
			this.bus.$on('search', function(obj){
				self.formData = obj;
				if(self.page== 1){
					self.getData();	
				}else{
					self.page= 1;
				}
			});
		},
		watch:{
			popSels(){
				var self = this;
				this.changeSels();
				this.getData();
			}
		}

	}
</script>
