<template>
	<!-- xy-price begin -->
	<div v-show="popData.offerContent=='1'">
		<el-form label-width="0px"  class="mod-offer-content" ref="form" :model="form">
		<div class="degree">
			<el-button size="small" @click="addXyPrice" :disabled="form.xyPrice.length==5">添加层级</el-button>
			<span class="error-msg">最多添加5个层级</span>
		</div>
		<el-form-item v-for="(item, index) in form.xyPrice" :key="index" class="mod-item">
			<div class="text f-l">第</div>
			<div class="f-l" style="width: 100px">
				<el-form-item :prop="'xyPrice.' + index + '.num'" :rules="[{validator: $validate.required}, {validator: $validate.positiveInteger}]">
					<el-input v-model.number="item.num" size="small" class="num-box"></el-input>
				</el-form-item>
			</div>
			<div class="text f-l">件</div>
			<div class="f-l" style="width: 100px">
				<el-form-item :prop="'xyPrice.' + index + '.value'" :rules="[{validator: $validate.required}, {validator: $validate.positiveFloat}]">
					<el-input v-model.number="item.value" size="small" class="num-box" @blur="formatPrice(item)"></el-input>
				</el-form-item>
			</div>
			<div class="text f-l">元</div>
			<div class="text f-r">
				<el-button type="text" size="small" @click="delXyPrice(index)" class="num-box" v-if="index!=0">删除</el-button>
			</div>
		</el-form-item>
		<div class="error-msg">{{ xyPriceErrorMsg }}</div>
		</el-form>
		<div class="mod-pop-btn">
				<el-button type="primary" @click="onSubmit" v-if="!isView">提交</el-button>
		</div>
	</div>
	<!-- xy-price end -->
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
					xyPrice:[{num:'', value:''}]
				}	
			}	
		},
		methods:{
			vXyPrice(){
				var flag = true;
				var ar = this.form.xyPrice;
				var self = this;
				self.xyPriceErrorMsg = ''; 
				for(var i=0;i<ar.length;i++){
					let item = ar[i];	
					let index = i;
					if(Number(item.value)>(item.num*this.popData.price)){
						flag = false;
						self.xyPriceErrorMsg = '第'+(index+1)+'行数据错误,价格不能大于'+(this.popData.price);
						break;
					}
					if(ar.length>1 && index>0){
						let prev = ar[index-1];	
						if((!(Number(prev.num)<Number(item.num)))||(!(Number(prev.value)>Number(item.value)))){
							flag = false;
							self.xyPriceErrorMsg = '第'+(index+1)+'行数据错误,件数递增,价格递减';
							break;
						}
					}
				}
				return flag;
			},
			formatPrice(item){
				if(item.value.length!=0){
					item.value = parseFloat(item.value).toFixed(2);	
				}
			},
			delXyPrice(index){
				if(this.form.xyPrice.length!=1){
					this.form.xyPrice.splice(index, 1);	
					this.xyPriceErrorMsg = '';
				}
			},
			addXyPrice(){
				if(this.form.xyPrice.length<5){
					this.$refs['form'].validate((valid) => {
						if(valid && this.vXyPrice()){
							this.form.xyPrice.push({num:'', value:''});	
						}
					});
				}
			},
			onSubmit(){
				this.$refs['form'].validate((valid) => {
					if(valid && this.vXyPrice()){
						let data = {
							type: this.popData.offerContent,
							items: this.form.xyPrice
						}
						this.bus.$emit('xy-price/success', data);
					}
				});
			},
			getPopData(){
				if(this.popData.offerContent=='1'){
					this.form.xyPrice = this.popData.rule?this.popData.rule.items:[{num:'', value:''}];	
				}else{
					this.form.xyPrice = [{num:'', value:''}];	
				}
				this.xyPriceErrorMsg = '';
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
