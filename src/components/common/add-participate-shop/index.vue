<template>
	<el-dialog title="添加参与门店" :close-on-click-modal="false" size="large" custom-class="mod-pop" top="10%" :visible.sync="isShow">
		<Search :bus="popBus" :comData="comData"></Search>
		<SearchTable :bus="popBus" :popSels="sels" :comData="comData"></SearchTable>
		<div class="mod-pop-btn">
			<el-button @click="isShow=false">取消</el-button>	
			<el-button type="primary" @click="onSubmit">确定</el-button>	
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
				comData:{
					onlineOffline:[
						{
							name: '全部',
							value: ''
						},
						{
							name: '线上',
							value: 'online'
						},
						{
							name: '线下',
							value: 'offline'
						}
					],
					businessTypeCode:[{
						name: '全部',
						value: ''
					}],
					businessTypeCodeSelected: '',
					onlineOfflineSelected: ''
				},
				popBus: new Vue(),
				isShow:false,
				sels:[]
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
				if((!this.sels || this.sels.length==0)){
					this.$message.error('至少选择一个店铺!');	
					return false;
				}
				this.bus.$emit('part-shop/submit', this.sels);
				this.isShow = false;
			}
		},
		mounted(){
			var self = this;
			this.bus.$on('index/addShop', function(obj){
				self.isShow = obj.flag;
				self.sels= obj.sels;
				self.popBus.$emit('loaded',{sels:obj.sels});
			});
			this.popBus.$on('part-shop/table/cols', function(sels){
				self.sels = sels;
			});
			//channel
			// this.$ajax.post('http://shopmanage.yunhou.com/api/active/get_channel',{}).then(function(res){
			// 	self.comData.onlineOffline=res.data;
			// 	if(res.data && res.data.length!=0){
			// 		self.comData.onlineOfflineSelected=res.data[0].value;
			// 	}
			// });	
			//
			this.$ajax.post('http://shopmanage.yunhou.com/api/Businesstype/allType',{}).then(function(res){
				self.comData.businessTypeCode = self.comData.businessTypeCode.concat(res.data);
				// if(res.data && res.data.length!=0){
				// 	self.comData.businessTypeCodeSelected=res.data[0].value;
				// }
			});	
		}
	}
</script>
