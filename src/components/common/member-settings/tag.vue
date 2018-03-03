<template>
	<div class="mod-tag">
		<el-form-item label="性别" prop="userTags.gender.queryValue">
			<el-radio-group v-model="form.userTags.gender.queryValue">
				<el-radio label="男">男</el-radio>
				<el-radio label="女">女</el-radio>
				<el-radio label="null">不限</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="年龄" >
			<el-col :span="7">
				<el-form-item prop="userTags.age.queryStartValue" :rules="[{validator: $validate.positiveInteger}]">
					<el-input v-model="form.userTags.age.queryStartValue" placeholder="请输入年龄" @change="clearAge()"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="1" class="line">-</el-col>
			<el-col :span="7">
				<el-form-item prop="userTags.age.queryEndValue" :rules="[{validator: $validate.positiveInteger},{validator: validate.ages}]">
					<el-input v-model="form.userTags.age.queryEndValue" placeholder="请输入年龄"></el-input>
				</el-form-item>
			</el-col>
		</el-form-item>
		<div>
			<el-form-item label="品类偏好" prop="userTags.class_value.queryValue">
				<el-checkbox-group v-model="form.userTags.class_value.queryValue">
					<el-checkbox v-for="(item, index) in select.class_value" :label="item.outCateId" :key="item.outCateId">{{ item.catbackName }}</el-checkbox>
					<a @click="onAddClassPrefer" class="icon-add" href="javascript:void(0)"><i class="iconfont iconfontmod">&#xe81f;</i>添加</a>
				</el-checkbox-group>
			</el-form-item>
		</div>
		<el-form-item label="购物金额" >
			<el-col :span="7">
				<el-form-item prop="userTags.amt.queryStartValue" :rules="[{validator: $validate.positiveFloat}]">
					<el-input v-model="form.userTags.amt.queryStartValue" placeholder="请输入金额" @change="clearPrice()"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="1" class="line">-</el-col>
			<el-col :span="7">
				<el-form-item prop="userTags.amt.queryEndValue" :rules="[{validator: $validate.positiveFloat},{validator: validate.amounts}]">
					<el-input v-model="form.userTags.amt.queryEndValue" placeholder="请输入金额"></el-input>
				</el-form-item>
			</el-col>
		</el-form-item>
		<el-form-item label="生命周期" prop="userTags.loyalty.queryValue">
			<el-checkbox-group v-model="form.userTags.loyalty.queryValue">
				<el-checkbox v-for="(item, index) in select.loyalty" :label="item.value" :key="item.value">{{ item.name }}</el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="促销敏感度" prop="userTags.promo.queryValue">
			<el-radio-group v-model="form.userTags.promo.queryValue">
				<el-radio label="1">低</el-radio>
				<el-radio label="2">中</el-radio>
				<el-radio label="3">高</el-radio>
				<el-radio label="0">近一年无消费</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="购物时段" prop="userTags.seghour.queryValue">
			<el-checkbox-group v-model="form.userTags.seghour.queryValue">
				<el-checkbox v-for="(item, index) in select.seghour" :label="item.value" :key="item.value">{{ item.name }}</el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="节庆敏感度" prop="userTags.festival.queryValue">
			<el-radio-group v-model="form.userTags.festival.queryValue">
				<!-- <el-radio label="0">未知</el-radio> -->
				<el-radio label="1">低</el-radio>
				<el-radio label="2">中</el-radio>
				<el-radio label="3">高</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="周末购物敏感度" prop="userTags.weekend.queryValue">
			<el-checkbox-group v-model="form.userTags.weekend.queryValue">
				<el-checkbox v-for="(item, index) in select.weekend" :label="item.value" :key="item.value">{{ item.name }}</el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="星座" prop="userTags.const.queryValue">
			<el-checkbox-group v-model="form.userTags.const.queryValue">
				<el-checkbox v-for="(item, index) in select.const" :label="item.name.toString()" :key="item.value">{{ item.name }}</el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="最后一次购物时间" >
			<div class="f-l">
				<el-form-item prop="userTags.lst_shopping.queryStartValue">
					<el-date-picker
						v-model="form.userTags.lst_shopping.queryStartValue"
						type="date"
						placeholder="请选择时间" :picker-options="queryStartValueOpt" @change="formatDate">
					</el-date-picker>
				</el-form-item>
			</div>
			<div class="line">-</div>
			<div class="f-l">
				<el-form-item prop="userTags.lst_shopping.queryEndValue">
					<el-date-picker
						v-model="form.userTags.lst_shopping.queryEndValue"
						type="date"
						placeholder="请选择时间" :picker-options="queryEndValueOpt" @change="formatDate">
					</el-date-picker>
				</el-form-item>
			</div>
		</el-form-item>
		<el-form-item label="品牌偏好" prop="userTags.brand_value.queryValue">
			<el-checkbox-group v-model="form.userTags.brand_value.queryValue">
				<el-checkbox v-for="(item, index) in select.brand_value" :label="item.outBrandId" :key="item.outBrandId">{{ item.brandName }}</el-checkbox>
				<a @click="onAddBrand" class="icon-add" href="javascript:void(0)"><i class="iconfont iconfontmod">&#xe81f;</i>添加</a>
			</el-checkbox-group>
		</el-form-item>
		<AddCategory :bus="popBus"></AddCategory>
		<AddBrand :bus="popBus"></AddBrand>
	</div>
</template>
<script>
	import Vue from 'vue'
	import AddCategory from '@/components/common/add-classify-tag/index.vue' 
	import AddBrand from '@/components/common/add-brand-tag/index.vue';
	export default {
		components:{AddCategory, AddBrand},
		props:['bus', 'opt'],
		data(){
			var self = this;
			return {
				popBus:new Vue(),
				queryStartValueOpt:{
					disabledDate(time) {
						self.form.userTags.lst_shopping.queryEndValue = '';
						return false;
					}
				},
				queryEndValueOpt: {
					disabledDate(time) {
						return (time.getTime() < (new Date(self.form.userTags.lst_shopping.queryStartValue).getTime() + 3600 * 1000 * 24 * 1));
					}	  
				},		
				validate:{
					ages: (rule, value, callback) => {
						var startV = this.form.userTags.age.queryStartValue; 
						var endV = this.form.userTags.age.queryEndValue; 
						if((startV.length!=0 && endV.length!=0) && (parseInt(startV)>=parseInt(endV))){
							callback(new Error('开始年龄应小于结束年龄'));
						}
						callback();
					},
					amounts: (rule, value, callback) => {
						if((this.form.userTags.amt.queryStartValue.length!=0 && this.form.userTags.amt.queryEndValue.length!=0) && (parseFloat(this.form.userTags.amt.queryStartValue)>=parseFloat(this.form.userTags.amt.queryEndValue))){
							callback(new Error('开始金额应小于结束金额'));
						}
						callback();
					}
				},
				select:{
					weekend:[{
						name:'低',
						value:1
					},{
						name:'中',
						value:2
					},{
						name:'高',
						value:3
					}],
					class_value:[],
					loyalty:[{
						name:'新客',
						value:1
					},{
						name:'流失顾客',
						value:2
					},{
						name:'易流失顾客',
						value:3
					},{
						name:'潜力顾客',
						value:4
					},{
						name:'优质顾客',
						value:5
					}],
					seghour:[/*{
						name:'未知',
						value:0
					},*/{
						name:'8:00-10:59',
						value:1
					},{
						name:'11:00-13:59',
						value:2
					},{
						name:'14:00-17:59',
						value:3
					},{
						name:'18:00-21:59',
						value:4
					}/*,{
						name:'异常',
						value:5
					}*/],
					const:[{
						name:'白羊座',
						value:'1'	
					},{
						name:'金牛座',
						value:'2'	
					},{
						name:'双子座',
						value:'3'	
					},{
						name:'巨蟹座',
						value:'4'	
					},{
						name:'狮子座',
						value:'5'	
					},{
						name:'处女座',
						value:'6'	
					},{
						name:'天秤座',
						value:'7'	
					},{
						name:'天蝎座',
						value:'8'	
					},{
						name:'射手座',
						value:'9'	
					},{
						name:'摩羯座',
						value:'10'	
					},{
						name:'水瓶座',
						value:'11'	
					},{
						name:'双鱼座',
						value:'12'	
					}],
					brand_value:[]	
				},
				form: {
					userTags:{
						gender:{
							queryType:1,
							queryValue:''
						},
						age:{
							queryStartValue:'',
							queryEndValue:'',
							queryType:2
						},
						class_value:{
							queryType:3,
							queryValue:[]
						},
						amt:{
							queryStartValue:'',	
							queryEndValue:'',
							queryType:2
						},
						loyalty:{
							queryType:3,
							queryValue:[]
						},
						promo:{
							queryType:1,	
							queryValue:''
						},
						seghour:{
							queryType:3,
							queryValue:[]
						},
						festival:{
							queryType:1,
							queryValue:''
						},
						weekend:{
							queryType:3,
							queryValue:[]
						},
						const:{
							queryType:3,
							queryValue:[]
						},
						lst_shopping:{
							queryType:2,
							queryStartValue:'',
							queryEndValue:''
						},
						brand_value:{
							queryType:3,
							queryValue:[]	
						}	
					}
				}	
			}	
		},
		methods:{
			clearAge(){
				this.form.userTags.age.queryEndValue = '';
			},
			clearPrice(){
				this.form.userTags.amt.queryEndValue = '';
			},
			onAddClassPrefer(){
				this.popBus.$emit('addClassify', {flag:true, sels:this.form.userTags.class_value.queryValue, ajaxData:{level:2, needBusinessTypeCode:false}});	
			},
			onAddBrand(){
				this.popBus.$emit('addBrand',{flag:true, sels:this.form.userTags.brand_value.queryValue, ajaxData:{needBusinessTypeCode:false}});	
			},
			unique(arr, id){
				var hash = {};
				var ar = [];
				ar = arr.reduce(function(item, next) {
					hash[next[id]] ? '' : hash[next[id]] = true && item.push(next);
					return item
				}, []);
				return ar;
			},
			getIds(ar, id){
				var _a = [];
				for(var i=0;i<ar.length;i++){
					_a.push(ar[i][id]);	
				}	
				return _a;
			},
			formatDate(){
				var obj = {};
				Object.assign(obj, this.form);
				if(typeof obj.userTags.lst_shopping.queryStartValue == 'object'){
					obj.userTags.lst_shopping.queryStartValue= obj.userTags.lst_shopping.queryStartValue.getTime();	
				}
				if(typeof obj.userTags.lst_shopping.queryEndValue== 'object'){
					obj.userTags.lst_shopping.queryEndValue= obj.userTags.lst_shopping.queryEndValue.getTime();	
				}
				return obj;
			}
		},
		created(){
			var self = this;
			var userTags = {};
			Object.assign(this.form.userTags, this.opt.userTags);
			userTags = this.form.userTags;
			if(self.form.userTags.class_value.queryValue.length!=0){
				this.$ajax.post('http://shopmanage.yunhou.com/api/Backclassify/getBackClassifyByIds',{backCateIds: self.form.userTags.class_value.queryValue.join(','), level:2, needBusinessTypeCode:false}).then((res)=>{
					self.select.class_value = res.data;
				});
			}
			if(self.form.userTags.brand_value.queryValue.length!=0){
				this.$ajax.post('http://shopmanage.yunhou.com/api/Brand/queryById',{outBrandId: self.form.userTags.brand_value.queryValue.join(','), needBusinessTypeCode:false}).then((res)=>{
					self.select.brand_value = res.data;
				});
			}
			if(userTags.lst_shopping.queryStartValue!=''){
				userTags.lst_shopping.queryStartValue = Number(userTags.lst_shopping.queryStartValue);	
			}
			if(userTags.lst_shopping.queryEndValue!=''){
				userTags.lst_shopping.queryEndValue = Number(userTags.lst_shopping.queryEndValue);	
			}
			this.form.resource = '3';
			this.bus.$emit('tag/change', {form: this.form});

			//class_value
			this.popBus.$on('classify/submit', function(obj){
				var ar = self.unique([].concat(self.select.class_value||[], obj), 'outCateId');
				self.select.class_value = ar;
				var ar2 = [];
				ar2 = self.unique(obj, 'outCateId');
				self.form.userTags.class_value.queryValue = self.getIds(ar2, 'outCateId');
			});

			//brand_value
			this.popBus.$on('brand/submit', function(obj){
				var ar = self.unique([].concat(self.select.brand_value||[], obj), 'outBrandId');
				self.select.brand_value = ar;
				var ar2 = [];
				ar2 = self.unique( obj, 'outBrandId');
				self.form.userTags.brand_value.queryValue = self.getIds(ar2, 'outBrandId');
			});
		}	
	}
</script>
<style lang="scss" scoped>
	.mod-tag {
		.line {
			float:left;
			width:20px;
		}
		.icon-add {
			color: #34cfff;
			line-height: 36px;
			display: inline-block;
			height: 36px;
			margin-right:10px;
			i {
				font-size:20px;	
				vertical-align: middle;
				margin-right:5px;
			}
			color:#34cfff;
		}
	}
</style>
