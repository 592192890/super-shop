<template>
	<el-dialog title="统计" :close-on-click-modal="false" size="large" custom-class="mod-pop" top="10%" :visible.sync="isShow">
		<Search :bus="popBus" :comData="comData"></Search>
		<SearchTable :bus="popBus" :comData="comData" :popData="popData"></SearchTable>
		<div class="mod-pop-btn">
			<el-button @click="isShow=false">返回</el-button>	
			<el-button type="primary" @click="onSubmit">导出</el-button>	
		</div>
	</el-dialog>
</template>
<script>
	import Vue from 'vue'
	import Search from './search.vue'
	import SearchTable from './table.vue'
	export default {
		props:['bus'],
		data(){
			return {
				popBus: new Vue(),
				isShow:false,
				sels:[],
				comData:[],
				popData: '',
				currentPage: 1,
				pageSize: 20,
				id: ''
			}
		},
		components:{Search, SearchTable},
		methods:{
			onSubmit(){
				var self = this;
				location.href= self.$apiUrl.marketing.exportStatistic+'?id='+self.id;
				self.isShow = false;
			//	this.$ajax.post(self.$apiUrl.marketing.exportStatistic, {id: self.id}).then((res)=>{
			//		if(res.error == '0'){
			//			self.$message.success('导出成功!');
			//		}else{
			//			self.$message.error(res.msg||'导出失败!');
			//		}
			//		self.isShow = false;
			//	});
			},
			getData()
			{
				var self = this;
				var opt = {
					currentPage: self.currentPage, 
					id: self.id, 
					pageSize: self.pageSize
				};
				self.listLoading = true;
				self.$ajax.post(self.$apiUrl.marketing.statistic,opt
				).then((res) =>
				{
					self.comData = res.data;
					self.listLoading = false;
				});
			}
		},
		mounted(){
			var self = this;
			this.bus.$on('statistic', function(obj){
				self.isShow = obj.flag;
				self.id = obj.sels.id,
				self.popData = obj;
				self.getData();
			});
		}
	}
</script>
