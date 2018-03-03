<template>
    <div class="mod-block" v-loading="loading">
			<el-form ref="form" :model="form" label-width="140px">
				<div :class="isView?'block-mask':''">
					<el-form-item label="活动名称" prop="name" :rules="[{validator: $validate.required}, {validator: $validate.activityName}]" required>
						<el-col :span="15"><el-input v-model="form.name" placeholder="最多可输入20个字符"></el-input></el-col>
					</el-form-item>
					<div class="clearfix">
						<el-form-item label="活动描述" prop="info" :rules="[{validator: $validate.desc}]">
							<el-col :span="15"><el-input v-model="form.info" placeholder="对活动的补充说明,此项可不填,如用作广告词，建议最多输入20个字符" ></el-input></el-col>
							<!-- <el-col :span="5" class="tips">此处为对活动的补充说明</el-col> -->
						</el-form-item>
					</div>
					<el-form-item label="活动类型" prop="actType" required>
						<el-col :span="7">
							<el-select v-model="form.actType" style="width:100%;">
								<el-option v-for="(item, index) in select.actType" :key="item.value" :label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</el-col>
					</el-form-item>
					<el-form-item label="活动时间段" required :rules="[{type: 'array',  required: true, message: '请选择活动时间段'}]" prop="activityTimeIntervals">
						<TimeSlot :bus="bus" :only="false" :timesAr="form.activityTimeIntervals"></TimeSlot>
					</el-form-item>
				</div>
				<!-- exclude begin -->
				<el-form-item label="排除条件:" prop="excludes" v-if="form.actType == 2">
					<div class="mod-member" v-loading="excludesLoading">
						<div class="member-item mod-inner">
							<div :class="isView?'block-mask':''">
								<h3>
									<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAll">全部</el-checkbox>
								</h3>
								<el-checkbox-group v-model="form.excludes" @change="handleCheckedChange"  class="inner">
									<el-checkbox  v-for="item, index in select.excludes" :key="item.value" :value="item.value" :label="item.value">{{ item.name }}</el-checkbox>
								</el-checkbox-group>
							</div>
						</div>
					</div>
				</el-form-item>
				<!-- exclude end -->
				<div :class="isView?'block-mask':''">

					<el-form-item label="会员设置" prop="resource" :rules="[{required: true, message: '请选择会员设置' }]">
						<el-radio-group v-model="form.resource" @change="resourceChange">
							<el-radio label="1">所有用户</el-radio>
							<el-radio label="2">注册会员</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="" v-if="form.resource == 2" :rules="[{validator: validate.registeredMember}]" prop="registeredMember">
						<div class="mod-member mod-member-level">
							<!-- userGrades begin -->
							<div class="member-item">
								<h3>按会员等级设置</h3>
								<el-checkbox-group v-model="form.userGrades" class="inner">
									<el-checkbox v-for="(item, index) in select.userGrades"  :label="item.value.toString()" :key="item.value">{{ item.name }}</el-checkbox>
								</el-checkbox-group>
							</div>
							<!-- userGrades end -->
							<!-- userTags begin -->
							<!-- <div class="member-item"> -->
								<!-- <h3>按会员标签设置</h3> -->
								<!-- <el-checkbox-group v-model="form.userTags" class="inner"> -->
									<!-- <el-checkbox v-for="(item, index) in select.userTags"  :label="item.value" :key="item.value">{{ item.name }}</el-checkbox> -->
								<!-- </el-checkbox-group> -->
							<!-- </div> -->
							<!-- userTags end -->
						</div>
					</el-form-item>
					<el-form-item label="参与渠道" prop="channel" :rules="[{type: 'array',  required: true, message: '请选择参与渠道'}]">
						<el-checkbox-group v-model="form.channel">
							<el-checkbox v-for="(item, index) in select.channel"  :label="item.value" :key="item.value">{{ item.name }}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="参与店铺" prop="shopIds" required  :rules="[{type: 'array',  required: true, message: '请选择参与店铺'}]">
						<a href="javascript:void(0)" class="icon-add" @click="addPartShop"><i class="iconfont iconfontmod">&#xe81f;</i>添加店铺</a>
						<span>已选择了{{ form.shopIds.length }}个店铺</span>
					</el-form-item>
					<div class="mod-part-goods clearfix">
						<el-form-item label="参与商品:" prop="goods" required v-if="form.actType == 2"  :rules="[{required: true, message: '请选择参与商品' }]" >
							<el-radio-group v-model="form.goods">
								<el-radio label="1">全部商品</el-radio>
								<el-radio label="2">部分商品</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="" required  :rules="[{validator: validate.productsSels}]"  prop="productsSels" v-if="form.goods==2" label-width="12px">
							<a href="javascript:void(0)" class="icon-add" @click="addGoods"><i class="iconfont iconfontmod">&#xe81f;</i>添加参与的商品</a>
							<!-- <span>已选择了{{ productsSelsLen }}个商品</span> -->
							<span v-if="productsSelsLen!=0">已选择了商品</span>
						</el-form-item>
					</div>
					<el-form-item label="是否启用" prop="enable" required>
						<el-switch v-model="form.enable" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否">
						</el-switch>
					</el-form-item>
				</div>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">{{ !isView?'保存并':''}}进入下一步</el-button>
					<el-button @click="onCancel">返回</el-button>
				</el-form-item>
			</el-form>
		<addPartShop  :bus="bus"></addPartShop>
		<addPartGoods :bus="bus"></addPartGoods>
    </div>
</template>
<script>
	import Vue from 'vue'
	import addPartShop from '@/components/common/add-participate-shop/index.vue'
	import addPartGoods from '@/components/common/add-participate-product/index.vue'
	import TimeSlot from '@/components/common/time-slot/index.vue'
	import Permission from '@/assets/js/permission-util.js';
	export default {
		components:{ addPartShop, addPartGoods, TimeSlot },
		data(){
			var self = this;
			return {
				bus: new Vue(),
				isIndeterminate:false,
				excludeChecked:[],
				checkAll: false,
				excludesLoading:true,
				productsSelsLen:0,
				loading:(this.$route.query.id==undefined?false:true),
				//userId:JSON.parse(sessionStorage.getItem('_userInfo')).userId,
				validate:{
					registeredMember : (rule, value, callback) => {
						if(this.form.userGrades.length==0 ){
							callback(new Error('请选择会员等级'));
						}
						callback();
					},
					productsSels: (rule, value, callback) => {
						if(this.productsSelsLen == 0){
							callback(new Error('请选择参与商品'));
						}
						callback();
					}
				},
				select:{
          actType: [{
            name: '商品满赠',
            value:1
          }, {
            name: '订单满赠',
            value:2
          }],
					excludes:[],
					userGrades:[],
					userTags:[],
					channel:[]
				},
				id:this.$route.query.id,
				form:{
					toolId:'1001',
					toolCode:'ump-goods-mjz',
					excludes:[],
					goods:'1',
					productsSels:{
						brand:[],
						category:[],
						excludeProducts:[],
						products:[]
					},
				//	productsSels:{
				//		brand:[{brandId:'1',brandName:'123'}],
				//		category:[{catbackId:202800013, catbackName:'熟食'}],
				//		excludeProducts:[{bn:'2', productName:'444'}],
				//		products:[{bn:'2',productName:'444'}]
				//	},
					name:'',
					resource:'',
					registeredMember:[],
					userGrades:[],
					userTags:[],
					channel:[],
					actType:1,
					actTypeName:'',
					activityTimeIntervals:[],
					enable:true,
					shopIds:[],
					isUpdate: true
				}
			}
		},
		computed:{
			isView(){
				var matched = this.$router.currentRoute.matched;
				var list = matched[matched.length-2].path+'/list';
				var ar = Permission.button(list, this.$router.options.routes)||[];
				return !(ar.indexOf('bt-edit')>-1 && this.form.isUpdate);
			}
		},
		methods:{
			getGoodsSelsAr(){
				var ar = [];
				for(var key in this.form.productsSels){
					if(key!='excludeProducts'){ //exclude item
						ar = [].concat(ar, this.form.productsSels[key]);
					}
				}
				this.productsSelsLen = ar.length;
				return ar;
			},
			addGoods(){
				this.bus.$emit('index/addGoods', {flag:true, sels:this.form.productsSels, shopIds:this.form.shopIds});
			},
			handleCheckedChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount!=0 && checkedCount === this.excludeChecked.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.select.excludes.length;
			},
			getExcludeChecked(){
				var ar = [];
				if(this.excludeChecked.length!=0){
					this.excludeChecked.forEach((item)=>{
						ar.push(item.value);
					});
				}
				return ar;
			},
			handleCheckAll(e){
				this.excludeChecked= e.target.checked ? this.select.excludes: [];
				this.form.excludes = this.getExcludeChecked();
				this.isIndeterminate = false;
			},
			resourceChange(){
				if(this.form.resource==1){
					this.form.userGrades = [];
					this.form.userTags = [];
				}
			},
			addPartShop(){
				this.bus.$emit('index/addShop', {flag:true, sels:this.form.shopIds});
			},
			//设置活动信息
			setActTypeName(){
				let self = this;
				this.select.actType.forEach(function(item, index){
					if(item.value == self.form.actType){
						self.form.actTypeName = item.name;
					}
				});
			},
			onSubmit(){
				let self = this;
				let idStr = this.id?'?id='+this.id:'';
				let setRouter = null, actType = this.form.actType;
				if(actType==1){
					this.form.toolId ='1001'
					this.form.toolCode = 'ump-goods-mjz'
					setRouter = 'set-goods';
				}
				if(actType==2){
					this.form.toolId ='1000'
					this.form.toolCode = 'ump-order-mjz'
					setRouter = 'set-order';
				}
				if(this.form.goods==1){
					this.form.productsSels = {
						brand:[],
						category:[],
						excludeProducts:[],
						products:[]
					};
				}
				self.setActTypeName();
				this.$refs['form'].validate((valid) => {
					if(valid){
						sessionStorage.setItem('active-add',JSON.stringify(this.form));
						self.$router.push('/marketing-management/promotions/fullgift/@'+setRouter+idStr);
					}
				});
			},
			onCancel(){
				this.$router.go(-1);
			},
			getProductsSelsLen(){
				return Number(this.form.productsSels.category.length)
					+Number(this.form.productsSels.brand.length)
					+Number(this.form.productsSels.products.length)
					+Number(this.form.productsSels.excludeProducts.length);
			}
		},
		created(){
			var self = this;
			if(sessionStorage.getItem('active-add')){
				this.form = Object.assign(this.form, JSON.parse(sessionStorage.getItem('active-add')));
				this.loading = false;
			}else if(self.id && self.id.length!=0){
				this.$ajax.post('http://shopmanage.yunhou.com/api/active/info',{id:self.id}).then((res)=>{
					// res.data.activity.enable = res.data.activity.enable.toString()
					// res.data.activity.actType = res.data.activity.actType.toString()
					this.form = Object.assign(this.form, res.data.activity);
					if(this.form.userGrades.length==0){
						this.form.resource = '1';
					}else{
						this.form.resource = '2';
					}
					if(this.getProductsSelsLen()>0){
						this.form.goods = '2';
						self.getGoodsSelsAr();
					}
					this.loading = false;
				});
			}
			this.$ajax.post('http://shopmanage.yunhou.com/api/active/member_list',{}).then((res)=>{
				self.select.userGrades = res.data;
			});
			this.$ajax.post('http://shopmanage.yunhou.com/api/Active/get_active_toolids',{}).then((res)=>{
				self.select.excludes = res.data;
				self.excludesLoading = false;
			});
			this.$ajax.post('http://shopmanage.yunhou.com/api/active/get_channel',{}).then((res)=>{
				self.select.channel = res.data;
			});
			//
			this.bus.$on('part-shop/submit', function(sels){
				self.form.shopIds= sels;
				self.$refs['form'].validateField('shopIds');
			});
			this.bus.$on('timeSlot/change', function(times){
				self.form.activityTimeIntervals= times;
				self.$refs['form'].validateField('activityTimeIntervals');
			});
			this.bus.$on('part-goods/submit', function(sels){
				self.form.productsSels = sels;
				self.getGoodsSelsAr();
				self.$refs['form'].validateField('productsSels');
			});
			this.getGoodsSelsAr();
		}
	}
</script>
<style lang="scss" scoped>
	.mod-member {
		border:1px dashed #bfccda;
		border-radius:4px;
		overflow:hidden;
		padding:10px 30px 20px;
		background:#fbfbfb;
		float:left;
		overflow:hidden;
		.mod-inner{
			height:150px;
			overflow:auto;
		}
		.member-item {
			width: 240px;
			float:left;
			h3 {
				color:#646464;
				font-size:14px;
			}
			.inner {
				margin-right:10px;
				border:1px solid #f2f3f5;
				.el-checkbox {
					width:180px;
					border-bottom:1px solid #f2f3f5;
					padding:0px 15px;
					&:last-child {
						border-bottom:0px;
					}
				}
				.el-checkbox + .el-checkbox {
					margin-left:0px;
				}
			}
		}
	}
	.mod-member-level{
		//margin-left: 140px;
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
	.tips {
		line-height:35px;
		margin-left:20px;
		font-size:12px;
	}
	.mod-part-goods {
		.el-form-item {
			float:left;
		}
	}
</style>
