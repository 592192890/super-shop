<template>
	<div class="mod-select-item">
		<h3>排除商品</h3>
		<div class="item-bd ">
			<select multiple="multiple" ref="select" v-if="sels.length!=0">
				<option v-for="(item, index) in sels" :value="item.bn" :index="index">{{ item.productName }}</option>
			</select>
			<div v-if="sels.length==0" class="no-data">没有数据</div>
		</div>
		<div class="item-ft">
			<el-button @click="add"  type="small">添加商品</el-button>	
			<el-button @click="importGoods" type="small">导入商品</el-button>	
			<el-button @click="del" :disabled="sels.length==0" type="small">删除商品</el-button>	
		</div>
		<Add :bus="popBus"></Add>
		<ImportGoods :bus="popBus"></ImportGoods>
	</div>
</template>
<script>
	import Add from '@/components/common/add-product/index.vue';
	import ImportGoods from '@/components/common/import/index.vue';
	import Vue from 'vue'
	export default {
		props:['bus', 'popData'],
		components:{Add, ImportGoods},
		data(){
			return {
				popBus:new Vue(),
				checked:true,
				sels:[]
			}
		},
		methods:{
			add(){
				this.popBus.$emit('add',{flag:true, sels:this.sels});	
			},
			importGoods(){
				this.popBus.$emit('import',{url:'http://shopmanage.yunhou.com/api/product/parse_excelpro', downloadUrl:'http://shopmanage.yunhou.com/api/product/dowload_pro_exceltemp'});	
			},
			del(){
				var self = this;
				var ar = this.getSelectedOpt();
				for(var i=ar.length-1;i>-1;i--){
					this.sels.splice(ar[i], 1);	
				}
				self.bus.$emit('exclude/getIds', self.sels);
			},
			getSelectedOpt(){
				if(!this.$refs['select']){
					return [];	
				}
				var ar = [];
				var opts =this.$refs['select'].options; 	
				for(var i=0;i<opts.length;i++){
					if(opts[i].selected){
						ar.push(opts[i].index);
					}	
				}
				return ar;
			},
			unique(arr){
				var hash = {};
				var ar = [];
				ar = arr.reduce(function(item, next) {
					hash[next.bn] ? '' : hash[next.bn] = true && item.push(next);
					return item
				}, []);
				return ar;
			},
			setIds(){
				this.bus.$emit('exclude/getIds', {ids:this.sels});
			}
		},
		mounted(){
			var self = this;
			if(this.popData) {
				this.sels = this.popData
			}; 
			this.popBus.$on('index/add/table/submit', function(obj){
				self.sels = self.unique([].concat(self.sels, obj));
				self.setIds();
			});
			this.popBus.$on('import/success', function(obj){
				self.sels = self.unique([].concat(self.sels, obj));
				self.setIds();
			});
		}	
	}
</script>


