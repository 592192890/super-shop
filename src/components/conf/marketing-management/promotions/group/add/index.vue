<template>
    <div class="mod-block"  v-loading="loading">
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
					<el-form-item label="活动时间段" required :rules="[{type: 'array',  required: true, message: '请选择活动时间段'}]" prop="activityTimeIntervals">
						<TimeSlot :bus="bus" :only="true" :timesAr="form.activityTimeIntervals"></TimeSlot>
					</el-form-item>
					<el-form-item label="预热时间:" required>
						<el-col :span="11">
							<el-form-item prop="warmTime">
								<el-date-picker type="datetime" placeholder="请选择预热时间" v-model="form.warmTime" style="width: 100%;"  :picker-options="warmTimeOptions" @change="onChange"></el-date-picker>
							</el-form-item>
						</el-col>
					</el-form-item>
					<el-form-item label="是否包邮:" prop="isFreeDelivery">
						<el-switch v-model="form.isFreeDelivery" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否">
						</el-switch>
					</el-form-item>
					<el-form-item label="参与渠道" prop="channel" :rules="[{type: 'array',  required: true, message: '请选择参与渠道'}]">
						<el-checkbox-group v-model="form.channel">
							<el-checkbox v-for="(item, index) in select.channel" :label="item.value" :key="item.value">{{ item.name }}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="参与店铺" prop="shopIds" required  :rules="[{type: 'array',  required: true, message: '请选择参与店铺'}]">
						<a href="javascript:void(0)" class="icon-add" @click="addPartShop"><i class="iconfont iconfontmod">&#xe81f;</i>添加店铺</a>
						<span>已选择了{{ form.shopIds.length }}个店铺</span>
					</el-form-item>
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
    </div>
</template>
<script>
	import Vue from 'vue'
	import addPartShop from '@/components/common/add-participate-shop/index.vue'
	import TimeSlot from '@/components/common/time-slot/index.vue'
	import Permission from '@/assets/js/permission-util.js';
	export default {
		components:{ addPartShop, TimeSlot },
		data(){
			var self = this;
			return {
				bus: new Vue(),
				loading:(this.$route.query.id==undefined?false:true),
				//userId:JSON.parse(sessionStorage.getItem('_userInfo')).userId,
				validate:{
					registeredMember : (rule, value, callback) => {
						if(this.form.userGrades.length==0 && this.form.userTags.length==0){
							callback(new Error('会员等级至少选择一个'));
						}
						callback();
					}
				},
				select:{
					userGrades:[],
					userTags:[],
					channel:[]
				},
				id:this.$route.query.id,
				form:{
					toolId:'12000',
					toolCode:'ump-goods-groupbuy',
					name:'',
					resource:'',
					registeredMember:[],
					userGrades:[],
					userTags:[],
					channel:[],
					activityTimeIntervals:[],
					isFreeDelivery:true,
					//
					enable: true,
					shopIds:[],
					warmTime: '',
					actType: 1,
					isUpdate: true
				},
				warmTimeOptions: {
					disabledDate(time) {
						return (time.getTime() > self.form.activityTimeIntervals[0].effectStartTime);
					}
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
			resourceChange(){
				if(this.form.resource==1){
					this.form.userGrades = [];
					this.form.userTags = [];
				}
			},
			addPartShop(){
				this.bus.$emit('index/addShop', {flag:true, sels:this.form.shopIds});	
			},
			setResource(){
				if(this.form.actType==3 || this.form.actType==5){
					this.form.resource='2';	
				}else{
					this.form.resource='';	
				}
			},
			onChange(){
				this.form.warmTime = this.formatDate();
			},
			formatDate(){
				var obj = {};
				Object.assign(obj, this.form);
				if(typeof obj.warmTime == 'object'){
					obj.warmTime = obj.warmTime.getTime();	
				}
				if(typeof this.form.warmTime == 'number'){
					this.form.warmTime = new Date(this.form.warmTime);	
				}
				return obj.warmTime;
			},
			warmTimeValid(){
				let warmTime = this.form.warmTime;
				let flag = true;
				if(warmTime >= this.form.activityTimeIntervals[0].effectStartTime){
					this.$message({
						message: '预热时间必须小于活动开始时间',
						type: 'error'
					});
					flag = false;
				}
				return flag;
			},
			onSubmit(){
				let self = this;
				let idStr = this.id?'?id='+this.id:'';
				if(this.isView){
					this.$router.push('/marketing-management/promotions/group/@goods'+idStr);
					return false;
				}
				this.$refs['form'].validate((valid) => {
					if(valid && self.warmTimeValid()){
						sessionStorage.setItem('active-add',JSON.stringify(this.form));
						self.$router.push('/marketing-management/promotions/group/@goods'+idStr);
					}
				});
			},
			onCancel(){
				this.$router.go(-1);
			}
		},
		created(){
			var self = this;
			if(sessionStorage.getItem('active-add')){
				this.form = Object.assign(this.form, JSON.parse(sessionStorage.getItem('active-add')));
				self.loading = false;
			}else if(self.id && self.id.length!=0){
				this.$ajax.post('http://shopmanage.yunhou.com/api/active/info',{id:self.id}).then((res)=>{
					this.form = Object.assign(this.form, res.data.activity);	
					if(this.form.userGrades.length==0 && this.form.userTags==0){
						this.form.resource = '1';	
					}
					self.loading = false;
				});
			}
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
			})
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
		.member-item {
			width: 220px;	
			float:left;
			h3 {
				color:#646464;
				font-size:14px;
			}
			.inner {
				height:150px;
				overflow:auto;
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
</style>
