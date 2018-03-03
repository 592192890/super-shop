<template>
	<div v-if="isShow">
		<el-dialog title="导入商品" :close-on-click-modal="false" custom-class="mod-pop" top="30%" :visible.sync="isShow" size="tiny" :modal="false">
			<Upload :bus="popBus" :comData="comData" :popData="popData"></Upload>
			<slot name="table"></slot>
		</el-dialog>
		<div class="v-modal" style="z-index: 1;"></div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Upload from './upload.vue'
	import util from '@/assets/js/util'
	export default {
		props:['bus'],
		data(){
			return {
				popBus: new Vue(),
				isShow:false,
				sels:[],
				comData:[],
				popData: '',
				defaultPopData: {
					flag: true,
					actData: {
						actType: '',
						toolId: '',
						tableId: ''
					},
					tableId: '',
					url: '',
					downloadUrl: ''
				}
			}
		},
		components:{ Upload },
		mounted(){
			var self = this;
			this.bus.$on('import', function(obj){
				let data = Object.assign(self.defaultPopData, obj);
				self.isShow = data.flag;
				self.comData= data.sels;
				if(data.tableId){
					if(data.sels.length){
						let productArr = util.array.toObject(obj.sels, obj.type);
						self.$ajax.post(self.$apiUrl.marketing.redistableAdd, {tableId: data.tableId, datas: JSON.stringify(productArr)});
					}else{
						self.$ajax.post(self.$apiUrl.marketing.emptyRedisTable, {tableId: data.tableId});
					}
				}
				self.popData = data;
			});
			this.popBus.$on('import/upload/success', function(data){
				self.isShow = false;	
				self.bus.$emit('import/success', data)
			});	
		}
	}
</script>
