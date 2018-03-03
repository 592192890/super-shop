<template>
	<el-dialog title="选择商品" :close-on-click-modal="false" size="large" custom-class="mod-pop" top="10%" :visible.sync="isShow" id="jSelectGoods">
		<div class="mod-goods">
			<Classification :bus="popBus" :popData="sels['category']"></Classification>
			<Brand :bus="popBus" :popData="sels['brand']"></Brand>
			<Goods :bus="popBus" :popData="sels['products']" :popShopIds="shopIds"></Goods>
			<div>
				<Exclude :bus="popBus" :popData="sels['excludeProducts']"></Exclude>	
			</div>
		</div>
		<div class="mod-pop-btn">
			<el-button @click="isShow=false" v-if="!isView">取消</el-button>
			<el-button @click="isShow=false" v-if="isView">返回</el-button>		
			<el-button type="primary" @click="onSubmit" v-if="!isView">确定</el-button>	
		</div>
	</el-dialog>
</template>
<style scoped lang="scss">
	.mod-goods {
		overflow:hidden;
		margin-bottom:50px;
	}
</style>
<script>
	import Vue from 'vue'
	import Classification from './classification.vue';
	import Brand from './brand.vue'
	import Goods from './goods.vue'
	import Exclude from './exclude.vue'
	export default {
		components:{Classification, Brand, Goods, Exclude},
		props:['bus','isView'],
		data(){
			return {
				popBus: new Vue(),
				isShow:false,
				shopSels:[],
				validMod:[],
				checkedAr:[],
				sels:{
					'category':[],
					'brand':[],
					'products':[],
					'excludeProducts':[]
				},
				shopIds: []
			}
		},
		methods:{
			onSubmit(){
				if(!(this.checkedAr.join('').indexOf('1')>-1)){
					this.$message.error('分类,品牌,商品至少选择一个!');
					document.getElementById('jSelectGoods').scrollTo(0,0);
					return false;
				}
				if(this.validMod.join('').indexOf('1')>-1){
					document.getElementById('jSelectGoods').scrollTo(0,0);
					return false;
				}
				this.bus.$emit('part-goods/submit', this.sels);
				this.isShow = false;
			}
		},
		mounted(){
			var self = this;
			function mod(){
				var ar = ['classification','brand','goods'];
				for(var i=0;i<ar.length;i++){
					self.popBus.$on(ar[i]+'/validate', function(obj){
						self.validMod[obj.index]=obj.isError?'1':'0';
						self.checkedAr[obj.index]=obj.checked?'1':'0';
						if(!obj.checked){
							self.sels[obj.type] = [];
						}else{
							self.sels[obj.type] = obj.ids;
						};
					});
				}
			}
			mod();
			this.bus.$on('index/addGoods', function(obj){
				self.isShow = obj.flag;
				if (obj.sels) {
					self.sels = obj.sels;
				}
				if(obj.shopIds.length){
					self.shopIds = obj.shopIds;
				}
			});
			//exclude
			this.popBus.$on('exclude/getIds', function(obj){
				self.sels['excludeProducts'] = obj.ids;
			});
		}
	}
</script>
