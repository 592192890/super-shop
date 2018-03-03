<template>
	<el-dialog title="配置商品" :close-on-click-modal="false" size="small" custom-class="mod-pop" top="10%" :visible.sync="isShow">
		<div :class="isView?'block-mask':''">
			<div class="mod-config">
				<h3 class="title">{{ form.name }}</h3>
				<p class="tips">
					<i class="el-icon-warning icon"></i>折扣率中请输入0~100之间，输入85表示价格*85%
				</p>
				<p class="info">
					<span><i>销售价：</i>{{ form.price }}</span>
					<span><i>成本价：</i>{{ form.cost }}</span>
					<span><i>参与的活动类型：</i>{{ actTypeName }}</span>
				</p>
				<el-form label-width="0px">
					<el-form-item>
						<el-radio-group v-model="form.offerContent">
							<el-radio label="1">第X件Y元</el-radio>
							<el-radio label="2">第X件Y折</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<XyPrice :bus="popBus" :popData="form" :isView="isView"></XyPrice>
				<XyDiscount :bus="popBus" :popData="form" :isView="isView"></XyDiscount>
			</div>
		</div>
	</el-dialog>
</template>
<script>
	import Vue from 'vue'
	import XyPrice from './xy-price.vue'
	import XyDiscount from './xy-discount.vue'
	export default {
		components:{XyPrice, XyDiscount},
		props:['bus', 'isView'],
		data(){
			return {
				popBus:new Vue(),
				ar:['xy-price','xy-discount'],
				actTypeName:'',
				form:{
					offerContent:'1',
					rule:false
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
				self.form.offerContent = obj.sels.rule?obj.sels.rule.type.toString():'1';
				self.form.rule &&	(self.form.rule = false);
				self.form = Object.assign({}, self.form, obj.sels);
			});	
			//
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
<style lang="scss" scoped>
	.mod-pop-search .el-form--inline .el-form-item, .mod-search-list .el-form--inline .el-form-item {
		width:260px;	
	}
	.mod-config {
		margin-bottom:60px;
		.title {
			margin-bottom:10px;
		}
		.tips{
			text-align:right;
			color:#cccccc;
			margin-bottom:5px;
		}
		.info {
			margin-bottom:10px;	
			span {
				margin-left:30px;	
				&:nth-child(1) {
					margin-left:0px;
				}
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
