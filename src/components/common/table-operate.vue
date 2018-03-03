<template>
	<div class="mod-search-table" v-loading="listLoading" style="padding-bottom:70px;">
		<el-table :data="ajaxData.list" style="width: 100%" @row-dblclick="dbclick">
			<slot name="column"></slot>
			<el-table-column label="操作" width="200" fixed="right" align="left" v-if="buttonArr.length!=0">
				<template scope="scope">
					<div>
						<el-button type="text" @click="enable(scope.$index, scope.row)" v-if="isStatue(scope.row)">{{scope.row.enable?'禁用':'启用'}}</el-button>
						<el-button type="text" @click="statistics(scope.row)" v-if="isStatistics(scope.row)">统计</el-button>
						<el-button type="text" @click="edit(scope.$index, scope.row)" v-if="isEdit(scope.row)" >编辑</el-button>
						<el-button type="text" @click="del(scope.$index, scope.row)" v-if="isDel(scope.row)">删除</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="mod-toolbar">
			<el-pagination ref="pagination"
				style="float:right;"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:current-page.sync="ajaxData.currentPage"
				:page-sizes="[10, 20, 30, 40]"
				:page-size="ajaxData.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="ajaxData.totalRow">
			</el-pagination>
		</el-col>
	<Statistics :bus="bus"></Statistics>
</div>
</template>
<script>
	import util from '@/assets/js/util'
	import Statistics from '@/components/common/statistics/index.vue'
	import Permission from '@/assets/js/permission-util.js';
	export default {
		props:['bus', 'defaultSetting'],
		components:{Statistics},
		data(){
			return {
				//userId:JSON.parse(sessionStorage.getItem('_userInfo')).userId,
				firstData:{},
				formData:{},
				listLoading:true,
				sels: [],
				ajaxData: {},
				buttonArr:[]
			}
		},
		methods:
		{
			isStatue(row){
				return row.status!=99 && this.buttonArr.indexOf('bt-enable')!=-1 && this.buttonArr.indexOf('bt-disbale')!=-1 && row.isCurrentUser;
			},
			isEdit(row){
				return row.status!=99 && ((row.status==0 && row.enable)||(row.status==1 && !row.enable)||(row.status==0 && !row.enable)) && this.buttonArr.indexOf('bt-edit')!=-1 && row.isCurrentUser;
			},
			isDel(row){
				return row.status==0 && this.buttonArr.indexOf('bt-delete')!=-1 && row.isCurrentUser
			},
			isStatistics(row){
				return row.status!=0 && this.buttonArr.indexOf('bt-sum')!=-1;
			},
			//operate begin
			del(index, row){
				var self = this;
				this.$confirm('确定删除这条数据么?',{type:'warning'}).then((res)=>{
					if(res){
						this.$ajax.post(self.$apiUrl.marketing.deleteAct,{id: row.id}).then((rst)=>{
							if(rst.error == 0){
								self.$message.success('删除成功!');
								self.getData();
							}
						});	
					}
				}).catch(() => {});
			},
			edit(index, row){
				sessionStorage.clear();
				this.$router.push('/marketing-management/promotions/'+ this.defaultSetting.url +'/@add?id='+row.id);
			},
			enable(index, row){
				let self = this, opt = {
					id: row.id,
					enable: row.enable?'false':'true'
				}
				self.$ajax.post(self.$apiUrl.marketing.activeStatus,opt).then((rst)=>{
					//row.id = rst.data.enable;
					if(rst.error == 0){
						row.enable = rst.data.enable;
						row.enableName = rst.data.enableName;
					}
				});	
			},
			dbclick(row){
				sessionStorage.clear();
				this.$router.push('/marketing-management/promotions/'+ this.defaultSetting.url +'/@add?id='+row.id);
			},
			statistics(row){
				this.bus.$emit('statistic', {flag:true, sels:row});	
			},
			//operate end
			//页码改变事件
			handleCurrentChange(val)
			{
				this.currentPage = val;
				this.getData();
			},
			//每页条数改变事件
			handleSizeChange(pageSize){
				this.ajaxData.pageSize = pageSize;
				this.getData();
			},
			//获取数据
			getData()
			{
				let self = this;
				self.listLoading = true;
				let opt = Object.assign({
					currentPage: self.ajaxData.currentPage || 1,
					pageSize: self.ajaxData.pageSize || 20
				}, this.firstData||{},self.formData, self.defaultSetting);
				self.$ajax.post(this.$apiUrl.marketing.activeList, opt).then((res) =>
				{
					self.ajaxData = Object.assign(res.data);
					//self.permission = Object.assign(res.data.permission, {enable:true});
					self.listLoading = false;
				});
			}
		},
		created()
		{
			var self = this;
			this.bus.$on('index/search', function(obj){
				self.formData = obj;			
				self.ajaxData.currentPage = 1
				self.getData();
			});
			this.bus.$on('search/loaded', function(data){
				self.firstData = data;
				self.getData();
			});
		},
		mounted(){
			this.buttonArr=Permission.button(this.$route.path,this.$router.options.routes)||[];
		}
	}
</script>
