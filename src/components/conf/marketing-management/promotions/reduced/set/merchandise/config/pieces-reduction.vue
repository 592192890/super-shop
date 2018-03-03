<template>
	<!-- 满额立减 begin -->
	<div v-if="popData.offerContent=='2'">
		<el-form label-width="0px"  class="mod-offer-content" ref="form" :model="form">
		<div class="degree">
			<el-button size="small" @click="addXyPrice" :disabled="form.xyPrice.length==5||form.isOverlying">添加层级</el-button>
			<span class="error-msg">最多添加5个层级</span>
		</div>
		<el-form-item v-for="(item, index) in form.xyPrice" :key="index" class="mod-item" v-if="!(index!=0 && form.isOverlying)">
			<div class="text f-l">满</div>
			<div class="f-l" style="width: 100px">
				<el-form-item :prop="'xyPrice.' + index + '.value'" :rules="[{validator: $validate.required}, {validator: $validate.positiveInteger}]">
					<el-input v-model.number="item.value" size="small" class="num-box"></el-input>
				</el-form-item>
			</div>
			<div class="text f-l">件减</div>
			<div class="f-l" style="width: 100px">
				<el-form-item :prop="'xyPrice.' + index + '.mljValue'" :rules="[
					{validator: $validate.required}, {validator: $validate.positiveFloat}, {validator: $validate.compare, max:item.value*popData.maxActStock, message:'必须小于数量*销售价'}
					]">
					<el-input v-model.number="item.mljValue" size="small" class="num-box" @blur="formatPrice(item)"></el-input>
				</el-form-item>
			</div>
			<div class="text f-l">元</div>
			<div class="f-l" v-if="index==0" style="margin-left:20px;">
				<div class="f-l" >
					<el-checkbox v-model="form.isOverlying">是否叠加</el-checkbox>
				</div>
				<div class="f-l" style="margin-left:20px;" v-if="form.isOverlying">
					<div class="text f-l">最高减</div>	
					<div class="f-l" style="width: 100px">
						<el-form-item :prop="'highestMljValue'" :rules="[{validator: $validate.positiveFloat}]">
							<el-input size="small" v-model="form.highestMljValue" @blur="formatMaxReduction"></el-input>
						</el-form-item>
					</div>
				</div>
			</div>
			<div class="text f-r">
				<el-button type="text" size="small" @click="delXyPrice(index)" class="num-box" v-if="index!=0">删除</el-button>
			</div>
		</el-form-item>
		<div class="error-msg" v-if="!form.isOverlying">{{ xyPriceErrorMsg }}</div>
		</el-form>
		<div class="mod-pop-btn">
				<el-button type="primary" @click="onSubmit" v-if="!isView">提交</el-button>
		</div>
	</div>
	<!-- 满额立减 end -->
</template>
<style lang="scss" scoped>
	.mod-offer-content {
		overflow:hidden;
		.error-msg {
			color:red;
		}
		.text {
			line-height:38px;	
			text-align:center;
			margin:0px 5px;
		}	
		.degree {
			padding:20px 0px 20px;	
			border-top:1px solid #f3f5f7;
			margin-top:10px;
		}	
		.mod-item {
			background:#fcfcfc;	
			border:1px solid #f3f5f7;
			border-radius:4px;
			padding:15px 5px;
			margin-bottom:10px;
		}
	}
</style>
<script>
	export default {
		props:['bus', 'popData', 'isView'],
		data(){
			return{
				xyPriceErrorMsg:'',
				form:{
					highestMljValue:'',
					isOverlying:false,
					// xyPrice:[{quantity:1, price:1}]
					xyPrice:[{value:1, mljValue:1}]
				}	
			}	
		},
		methods:{
			vXyPrice(){
				if(this.popData.offerContent!='2'||this.form.isOverlying){
					return true;	
				}
				var flag = true;
				var ar = this.form.xyPrice;
				var self = this;
				self.xyPriceErrorMsg = ''; 
				for(var i=0;i<ar.length;i++){
					let item = ar[i];	
					let index = i;
					if(ar.length>1 && index>0){
						let prev = ar[index-1];	
						if((!(prev.value<item.value))||(!(prev.mljValue<item.mljValue))){
							flag = false;
							self.xyPriceErrorMsg = '第'+(index+1)+'行数据错误,件数和价格应递增';
							break;
						}
					}
				}
				return flag;
			},
			formatPrice(item){
				if(item.mljValue.length!=0){
					item.mljValue = parseFloat(item.mljValue).toFixed(2);	
				}
			},
			formatMaxReduction(){
				if(this.form.highestMljValue!='' && /^\d+(\.\d+)?$/.test(this.form.highestMljValue)){
					this.form.highestMljValue = Number(parseFloat(this.form.highestMljValue).toFixed(2));	
				}
			},
			delXyPrice(index){
				if(this.form.xyPrice.length!=1){
					this.form.xyPrice.splice(index, 1);	
					this.xyPriceErrorMsg = '';
				}
			},
			delAr(ar){
				if(ar.length>0){
					for(var i=1;i<ar.length;i++){
						ar.splice(i, 1);	
					}	
				}	
			},
			addXyPrice(){
				if(this.form.xyPrice.length<5){
					this.$refs['form'].validate((valid) => {
						if(valid && this.vXyPrice() && !this.form.isOverlying){
							this.form.xyPrice.push({value:'', mljValue:''});	
						}
					});
				}
			},
			onSubmit(){
				this.$refs['form'].validate((valid) => {
					if(valid && this.vXyPrice()){
						let data = {
							type: this.popData.offerContent,
							highestMljValue: this.form.highestMljValue,
							isOverlying: this.form.isOverlying,
							items: this.form.xyPrice
						}
						this.bus.$emit('pieces-reduction/success', data);
					}
				});
			},
			getPopData(){
				if(this.popData.offerContent=='2'){
					this.form.highestMljValue = this.popData.rules?this.popData.rules.highestMljValue:'';
					this.form.isOverlying = this.popData.rules?this.popData.rules.isOverlying:false;
					this.form.xyPrice = this.popData.rules?this.popData.rules.items:[{value:'', mljValue:''}];
				}else{
					this.form.highestMljValue = '';
					this.form.isOverlying = false;
					this.form.xyPrice = [{value:'', mljValue:''}];	
				}
			}
		},
		mounted(){
			this.getPopData();
		},
		watch:{
			popData(){
				this.getPopData();
			}
		}
	}
</script>
