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
						<TimeSlot :bus="bus" :only="false" :timesAr="form.activityTimeIntervals"></TimeSlot>
					</el-form-item>

					<el-form-item label="会员设置" prop="resource" :rules="[{required: true, message: '请选择会员设置' }]">
						<el-radio-group v-model="form.resource" @change="resourceChange">
							<el-radio label="1">所有用户</el-radio>
							<el-radio label="2">注册会员</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="" v-if="form.resource == 2" :rules="[{validator: validate.registeredMember}]" prop="registeredMember">
						<div class="mod-member">
							<!-- userGrades begin -->
							<div class="member-item">
								<h3>按会员等级设置</h3>
								<el-checkbox-group v-model="form.userGrades" class="inner">
									<el-checkbox v-for="(item, index) in select.userGrades"  :label="item.value.toString()" :key="item.value">{{ item.name }}</el-checkbox>
								</el-checkbox-group>
							</div>
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
						if(this.form.userGrades.length==0 ){
							callback(new Error('会员等级至少选择一个'));
						}
						callback();
					}
				},
				select:{
					userGrades:[],
					channel:[]
				},
				id:this.$route.query.id,
				form:{
					toolId:19000,
					toolCode:'ump_order_comb',
					params:'',
					name:'',
					resource:'',
					registeredMember:[],
					userGrades:[],
					channel:[],
					activityTimeIntervals:[],
					memberLimitNum:'',
					numOfOrder:'',
					payTimeLimit:'',
					joinCart:'1',
					freeShipping:'0',
					enable: true,
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
			resourceChange(){
				if(this.form.resource==1){
					this.form.userGrades = [];	
				}
			},
			addPartShop(){
				this.bus.$emit('index/addShop', {flag:true, sels:this.form.shopIds});	
			},
			onSubmit(){
				let self = this, setRouter = null;
					setRouter = 'goods';
				this.$refs['form'].validate((valid) => {
					if(valid){
						sessionStorage.setItem('active-add',JSON.stringify(this.form));
						if(this.id){
							this.$router.push('/marketing-management/promotions/combind/@'+setRouter+'?id='+this.id);
						}else{
							this.$router.push('/marketing-management/promotions/combind/@'+setRouter);
						}	
					}
				});
			},
			onCancel(){
				this.$router.push('/marketing-management/promotions/combind/list');	
			}
		},
		created(){
			let self = this;
			let arr = []
			this.$ajax.post(this.$apiUrl.marketing.getMemberList,{}).then((res)=>{
				self.select.userGrades = res.data;
			});
			this.$ajax.post(this.$apiUrl.marketing.getAllChannels,{}).then((res)=>{
				self.select.channel = res.data;
			});
			this.bus.$on('part-shop/submit', function(sels){
				self.form.shopIds= sels; 
				self.$refs['form'].validateField('shopIds');
			});		
			this.bus.$on('timeSlot/change', function(times){
				self.form.activityTimeIntervals= times;
				self.$refs['form'].validateField('activityTimeIntervals');
			})
			if(sessionStorage.getItem('active-add')){
				this.form = Object.assign(this.form, JSON.parse(sessionStorage.getItem('active-add')));
				self.loading = false;
			}else if(self.id && self.id.length!=0){
					this.$ajax.post(this.$apiUrl.marketing.getActiveInfo, {id:this.id, saveRedisTable:false}).then(res =>
					{
						if(res.error){
							this.$message.error(res.msg)
							return
						}
						this.form = Object.assign(this.form, res.data.activity);	
						if(res.data.activity.userGrades.length>0){
							this.form.resource = "2"
						}else{
							this.form.resource = "1"
						}
						self.loading = false;
					});
			}
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
