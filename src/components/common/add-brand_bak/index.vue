<template>
	<el-dialog title="添加品牌" :close-on-click-modal="false" size="small" custom-class="mod-pop" top="10%" :visible.sync="isShow">
		<Search :bus=bus></Search>
		<SearchTable :bus="bus" :popSels="popSels"></SearchTable>
		<div class="mod-pop-btn">
			<el-button @click="isShow=false">取消</el-button>	
			<el-button type="primary" @click="onSubmit">确定</el-button>	
		</div>
	</el-dialog>
</template>
<script>
	import Search from './search.vue'
	import SearchTable from './table.vue'
	export default {
		props:['bus'],
		data(){
			return {
				isShow:false,
				sels:[],
				popSels:[]
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
					this.$message.error('至少选择一个品牌!');	
					return false;
				}
				this.bus.$emit('add/table/submit', this.sels);
				this.isShow = false;
			}
		},
		mounted(){
			var self = this;
			this.bus.$on('brand', function(obj){
				self.isShow = obj.flag;
				self.popSels= obj.sels;
			});
			this.bus.$on('table/cols', function(sels){
				self.sels = sels;
			});
		}
	}
</script>
