<template>
	<div class="mod-select-item"  :class="isError?'error':''">
		<h3><el-checkbox v-model="checked" name="selectGoods" :isError="isError">选择商品</el-checkbox><span class="error-msg" v-if="isError">商品不能为空</span></h3>
		<div class="item-bd " :class="checked?'':'disabled'">
			<select multiple="multiple" ref="select" v-if="sels.length!=0">
				<option v-for="(item, index) in sels" :value="item.bn" :index="index">{{ item.productName }}</option>
			</select>
			<div v-if="sels.length==0" class="no-data">没有数据</div>
		</div>
		<div class="item-ft">
			<el-button @click="add" type="small">添加商品</el-button>	
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
		props:['bus', 'popData', 'popShopIds'],
		components:{Add, ImportGoods},
		data(){
			return {
				type:'products',
				popBus:new Vue(),
				checked:false,
				sels:[],
				shopIds: ''
			}
		},
		computed:{
			isError(){
				let flag = this.checked && this.sels.length==0;
				this.bus.$emit('goods/validate', {isError:flag, type:this.type, checked:this.checked, ids:this.sels, index:'2'})
				return flag;	
			}
		},
		methods:{
			add(){
				if(!this.shopIds.length){
					this.$message({
						type:'error',
						message:'必须先选择店铺'
	                });
	                return false;
				}
				this.popBus.$emit('add',{flag:true, sels:this.sels, shopIds: this.shopIds});	
			},
			importGoods(){
				this.popBus.$emit('import',{url:'http://shopmanage.yunhou.com/api/Product/parse_excelpro', downloadUrl:'http://shopmanage.yunhou.com/api/product/dowload_pro_exceltemp'});	
			},
			del(){
				var self = this;
				var ar = this.getSelectedOpt();
				for(var i=ar.length-1;i>-1;i--){
					this.sels.splice(ar[i], 1);	
				}
				self.setIds();
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
				this.bus.$emit('goods/getIds', {ids:this.checked?this.sels:[], type:this.type});
			}
		},
		mounted(){
			var self = this;
			if(this.popData) {
				this.sels = this.popData
				self.checked = self.sels.length!=0;
			}; 
			if(this.popShopIds){
				this.shopIds = this.popShopIds;
			}
			this.popBus.$on('index/add/table/submit', function(obj){
				self.sels = self.unique([].concat(self.sels, obj));
				self.setIds();
			});
			this.popBus.$on('import/success', function(obj){
				self.sels = self.unique([].concat(self.sels, obj));
				self.setIds();
			});
		},
		watch: {
			popShopIds(val){
				this.shopIds = this.popShopIds;
			}
		}	
	}
</script>


