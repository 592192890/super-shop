<template>
	<div>
		<div  class="mod-search-table">
			<el-table :data="tableData" style="width: 100%" v-loading="listLoading" @select="selsChange" ref="elTable" @select-all="selsChangeAll">
				<el-table-column type="selection" width="100">
				</el-table-column>
				<el-table-column prop="catbackName" label="分类名称">
				</el-table-column>
				<el-table-column prop="catbackId" label="分类ID">
				</el-table-column>
				<el-table-column prop="catbackPathName" label="上级分类">
					<template scope="scope">
						<div>{{scope.row.catbackPathName.split(',').join('>')}}</div>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="brandName" label="品牌">
				</el-table-column> -->
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
		props:['bus', 'popSels', 'opt'],
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
				if(this.sels[row.catbackId]){
					delete this.sels[row.catbackId]
				}else{
					if(this.selsCache[row.catbackId]){
						this.sels[row.catbackId] = this.selsCache[row.catbackId];
					}else{
						this.sels[row.catbackId] = row
					}
				}
				this.bus.$emit('table/cols', this.sels);
			},
			//select all
			selsChangeAll(sels){
				this.tableData && this.tableData.forEach(item=>{
					if(sels.length==0){
						this.sels[item.catbackId] && (delete this.sels[item.catbackId]);	
					}else{
						if(this.selsCache[item.catbackId]){
							this.sels[item.catbackId] = this.selsCache[item.catbackId];
						}else{
							this.sels[item.catbackId] = item;
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
						 if(selectedRows && selectedRows[row.catbackId]){
							 this.checked[row.catbackId] = row;
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
				var opt = Object.assign({currentPage: self.page, pageSize: self.pageSize, shopIds: JSON.stringify(self.shopIds)}, this.formData||{}, this.opt.ajaxData||{});
				self.listLoading = true;
				self.$ajax.post(self.$apiUrl.marketing.getClassifyList,opt
				).then((res) =>
				{
					self.total = res.data.pageInfo.totalRow;
					self.tableData = res.data.list;
					self.listLoading = false;
					self.selectedOption();
				});
			},
			changeSels(){
				var obj  = {};	
				this.popSels && this.popSels.forEach(item => {
					if(item.id){
						obj[item.id] = item;	
					}else{
						obj[item] = {catbackId: item};	
					}
				});
				Object.assign(this.sels, obj);
				Object.assign(this.selsCache, obj);
			}
		},
		mounted()
		{
			var self = this;
			this.changeSels();
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
