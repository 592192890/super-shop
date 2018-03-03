<template>
	<div class="mod-select-item" :class="isError?'error':''">
		<h3><el-checkbox v-model="checked" name="selectGoods">选择品牌</el-checkbox><span class="error-msg" v-if="isError">品牌不能为空</span></h3>
		<div class="item-bd " :class="checked?'':'disabled'">
			<select multiple="multiple" ref="select" v-if="sels.length!=0">
				<option v-for="(item, index) in sels" :value="item.brandId" :index="index">{{ item.brandName }}</option>
			</select>
			<div v-if="sels.length==0" class="no-data">没有数据</div>
		</div>
		<div class="item-ft">
			<el-button @click="add" type="small">添加品牌</el-button>	
			<el-button @click="del" :disabled="sels.length==0" type="small">删除品牌</el-button>	
		</div>
		<Add :bus="popBus"></Add>
	</div>
</template>
<script>
	import Add from '@/components/common/add-brand/index.vue';
	import Vue from 'vue'
	export default {
		props:['bus', 'popData'],
		components:{Add},
		data(){
			return {
				type:'brand',
				popBus:new Vue(),
				checked:false,
				sels:[]
			}
		},
		computed:{
			isError(){
				let flag = this.checked && this.sels.length==0;
				this.bus.$emit('brand/validate', {isError:flag, type:this.type, checked:this.checked, ids:this.sels, index:'1'})
				return flag;	
			}
		},
		methods:{
			getIds(sels){
				var ar = [];
				for(var i=0;i<sels.length;i++){
					ar.push(sels[i]['brandId']);	
				}	
				return ar;
			},
			add(){
				this.popBus.$emit('addBrand',{flag:true, sels:this.getIds(this.sels)});	
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
					hash[next.brandId] ? '' : hash[next.brandId] = true && item.push(next);
					return item
				}, []);
				return ar;
			},
			setIds(){
				this.bus.$emit('brand/getIds', {ids:this.checked?this.sels:[], isError:this.isError, type:this.type});
			}
		},
		mounted(){
			var self = this;
			if(this.popData) {
				this.sels = this.popData
				self.checked = self.sels.length!=0;
			}; 
			this.popBus.$on('brand/submit', function(obj){
				self.sels = self.unique([].concat(self.sels, obj));
				self.setIds();
			});
		}	
	}
</script>


