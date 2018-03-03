<template>
	<el-dialog title="设置商品满减" :close-on-click-modal="false" size="small" custom-class="mod-pop" top="10%" :visible.sync="isShow">
    	<div :class="isView?'block-mask':''">
			<div class="mod-config">
				<h3 class="title">{{ form.name }}</h3>
				<p class="info">
					<span><i>销售价：</i>{{ form.price }}</span>
					<span><i>成本价：</i>{{ form.cost }}</span>
				</p>
				<el-form label-width="0px">
					<el-form-item>
						<el-radio-group v-model="form.offerContent">
							<el-radio label="1">满额立减</el-radio>
							<el-radio label="2">满件立减</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<MoneyReduction :bus="popBus" :popData="form" :isView="isView"></MoneyReduction>
				<PiecesReduction :bus="popBus" :popData="form" :isView="isView"></PiecesReduction>
			</div>
		</div>
	</el-dialog>
</template>
<style lang="scss" scoped>
	.mod-pop-search .el-form--inline .el-form-item, .mod-search-list .el-form--inline .el-form-item {
		width:260px;	
	}
	.mod-config {
		margin-bottom:60px;
		.title {
			margin-bottom:10px;
		}
		.info {
			margin-bottom:10px;	
			span:nth-child(2) {
				margin-left:30px;
			}
			i {
				font-style:normal;
				color:#a1a1a1;
			}
		}
		.el-form-item {
			margin-bottom:0px;
		}
	}
</style>
<script>
	import Vue from 'vue'
	import MoneyReduction from './money-reduction.vue'
	import PiecesReduction from './pieces-reduction.vue'
	export default {
		components:{MoneyReduction, PiecesReduction},
		props:['bus', 'isView'],
		data(){
			return {
				popBus:new Vue(),
				ar:['money-reduction','pieces-reduction'],
				actTypeName:'',
				form:{
					offerContent:'1',
				},
				index: '',
				isShow:false	
			}
		},
		mounted(){
			var self = this;
			this.bus.$on('table/config', function(obj){
				self.actTypeName = obj.actTypeName;
				self.index = obj.index;
				self.isShow = obj.flag;	
				self.form.offerContent = obj.sels.rules?obj.sels.rules.type.toString():'1';
				self.form.rules &&	(self.form.rules = false);
				// console.log(self.form.rules);
				self.form = Object.assign({}, self.form, obj.sels);
			});	
			var ar = this.ar;
			for(var i=0;i<ar.length;i++){
				this.popBus.$on(ar[i]+'/success',function(obj){
					self.isShow=false;	
					self.bus.$emit('config/success', {data:obj, index:self.index});
				})
			}
		}	
	}
</script>
