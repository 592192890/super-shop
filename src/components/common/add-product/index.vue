<template>
	<div v-if="isShow">
		<el-dialog title="添加商品" :close-on-click-modal="false" size="large" custom-class="mod-pop" top="10%" :visible.sync="isShow" :modal="false">
			<Search :bus="popBus"></Search>
			<SearchTable :bus="popBus" :popSels="popSels" :shopIds="shopIds"></SearchTable>
			<div class="mod-pop-btn">
				<el-button @click="isShow=false">取消</el-button>	
				<el-button type="primary" @click="onSubmit">确定</el-button>	
			</div>
		</el-dialog>
		<div class="v-modal" style="z-index: 1;"></div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Search from './search.vue'
	import SearchTable from './table.vue'
	import util from '@/assets/js/util'
	export default {
		props:['bus'],
		data(){
			return {
				popBus:new Vue(),
				isShow:false,
				sels:[],
				popSels:[],
				tableId: '',
				shopIds: ''
			}
		},
		components:{Search, SearchTable},
		methods:{
			formatSels(){
				var ar = [];
				for(var k in this.sels){
					ar.push(this.sels[k]);	
				}	
				this.sels = ar;
			},
			onSubmit(){
				//change format;
				this.formatSels();
				if(!this.sels || this.sels.length==0){
					this.$message.error('至少选择一个商品!');	
					return false;
				}
				this.bus.$emit('index/add/table/submit', this.sels);
				this.isShow = false;
			},
			getRedistable(){
				let self = this;
				if(self.tableId ){
					let getOpt = {
						tableId: self.tableId
					}
					self.$ajax.post(self.$apiUrl.marketing.getAllRedistable, getOpt).then(function(res){
						self.popSels = util.array.toArray(res.data);
					});
				}
			}
		},
		mounted(){
			var self = this;
			this.bus.$on('add', function(obj){
				self.isShow = obj.flag;
				self.sels = obj.sels;
				if(obj.tableId){
					self.tableId = obj.tableId;
					if(obj.sels.length){
						let productArr = util.array.toObject(obj.sels, 'bn');
						self.$ajax.post(self.$apiUrl.marketing.redistableAdd, {tableId: self.tableId, datas: JSON.stringify(productArr)}).then(function(res){
							self.getRedistable();
						})
					}else{
						self.$ajax.post(self.$apiUrl.marketing.emptyRedisTable, {tableId: self.tableId});
					}
				}else{
					self.popSels= obj.sels;
				}
				self.shopIds = obj.shopIds;
			});
			this.popBus.$on('table/cols', function(sels){
				self.sels = sels;
			});
		}
	}
</script>
