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
				<el-form-item label="活动类型:" prop="actType">
					<el-select v-model="form.actType">
						<el-option v-for="item, index in select.actType" :key="item.value" :label="item.name"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动时间段" required :rules="[{type: 'array',  required: true, message: '请选择活动时间段'}]" prop="activityTimeIntervals">
					<TimeSlot :bus="bus" :only="true" :timesAr="form.activityTimeIntervals"></TimeSlot>
				</el-form-item>
				<el-form-item label="付尾款开始时间:" required v-if='form.actType==2'>
					<el-col :span="11">
						<el-form-item prop="depositParam.retainageStartTime" :rules="[{required: true, message: '请选择付尾款开始时间'}]">
							<el-date-picker type="datetime" placeholder="请选择付尾款开始时间" v-model="form.depositParam.retainageStartTime" style="width: 100%;" :picker-options="retainageStartTimeOptions" @change="onDepositChange"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="付尾款结束时间:" required v-if='form.actType==2'>
					<el-col :span="11">
						<el-form-item prop="depositParam.retainageEndTime" :rules="[{required: true, message: '请选择付尾款结束时间'}]">
							<el-date-picker type="datetime" placeholder="请选择付尾款结束时间" v-model="form.depositParam.retainageEndTime" style="width: 100%;" :picker-options="retainageEndTimeOptions" @change="onDepositChange"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-form-item>
        <el-form-item label="发货/自提时间" required :rules="[{validator: ztTimeValidate}]" prop="selfZtTime">
          <el-col :span="7">
            <el-date-picker type="date" placeholder="请选择开始时间" v-model="form.selfZtTime[0].effectStartTime" style="width: 100%;" :picker-options="effectStartTimeOptions" @change="ztTimeOnChange"></el-date-picker>
          </el-col>
          <el-col :span="1" class="line">-</el-col>
          <el-col :span="7">
            <el-date-picker type="date" placeholder="请选择结束时间" v-model="form.selfZtTime[0].effectEndTime" style="width: 100%;" :picker-options="effectEndTimeOptions" @change="ztTimeOnChange"></el-date-picker>
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
	import util from '@/assets/js/util'
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
				select:{
					userGrades:[],
					userTags:[],
					actType: [{
						name: '全款预售',
						value: 3
					}, {
						name: '定金预售',
						value: 2
					}],
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
					selfZtTime:[{
            effectStartTime: '',
            effectEndTime: ''
          }],
					depositParam: {
						retainageStartTime: '',
						retainageEndTime: ''
					},
					isFreeDelivery: true,
					//
					enable: true,
					shopIds:[],
					actType: 3,
					isUpdate: true
				},
				retainageStartTimeOptions: {
					disabledDate(time) {
						return (time.getTime() < self.form.activityTimeIntervals[0].effectEndTime - 3600 * 1000 * 24 * 1);
					}
				},
				retainageEndTimeOptions: {
					disabledDate(time) {
						return (time.getTime() < self.form.depositParam.retainageStartTime - 3600 * 1000 * 24 * 1);
					}
				},
        effectStartTimeOptions: {
          disabledDate(time) {
            self.form.selfZtTime[0].effectEndTime = '';
            return false;
          }
        },
        effectEndTimeOptions: {
          disabledDate(time) {
            return (time.getTime() <= self.form.selfZtTime[0].effectStartTime);
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
			onDepositChange(){
				this.form.depositParam.retainageStartTime = this.formatDate().depositParam.retainageStartTime;
				this.form.depositParam.retainageEndTime = this.formatDate().depositParam.retainageEndTime;
			},
			formatDate(){
				var obj = {};
				Object.assign(obj, this.form);
				if(typeof obj.depositParam.retainageStartTime == 'object'){
					obj.depositParam.retainageStartTime = obj.depositParam.retainageStartTime.getTime();
				}
				if(typeof obj.depositParam.retainageEndTime == 'object'){
					obj.depositParam.retainageEndTime = obj.depositParam.retainageEndTime.getTime();
				}
				return obj;
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
			presaleTimeValid(){
				let startTime = this.form.depositParam.retainageStartTime;
				let endTime = this.form.depositParam.retainageEndTime;
				let flag = true;
				if(startTime && endTime && startTime>endTime){
					flag = false;
					this.$message({
						message: '付尾款的开始时间必须小于付尾款结束时间',
						type: 'error'
					});
					return false;
				}
				if(startTime && endTime && (startTime<this.form.activityTimeIntervals[0].effectEndTime || endTime<this.form.activityTimeIntervals[0].effectEndTime)){
					flag = false;
					this.$message({
						message: '付尾款的开始时间和结束时间都不能小于活动的结束时间',
						type: 'error'
					});
					return false;
				}
				return flag;
			},
			onSubmit(){
				let self = this;
				let idStr = this.id?'?id='+this.id:'';
				let setRouter = null, actType = this.form.actType;
				if(actType==3){
					setRouter = 'full-goods';
				}
				if(actType==2){
					setRouter = 'deposit-goods';
				}
				self.setActTypeName();
				this.$refs['form'].validate((valid) => {
					if(valid && self.presaleTimeValid()){
						sessionStorage.setItem('active-add',JSON.stringify(this.form));
						self.$router.push('/marketing-management/promotions/presale/@' + setRouter + idStr);
					}
				});
			},
			onCancel(){
				this.$router.go(-1);
			},
      ztTimeValidate(rule, value, callback) {
        var activityTimeIntervals = this.form.activityTimeIntervals;
        var effectStartTime = value[0].effectStartTime;
        var effectEndTime = value[0].effectEndTime;

        if(!effectStartTime || !effectEndTime) callback(new Error('请选择发货/自提时间段'))
        // 全款预售发货/自提开始时间必须大于活动结束时间
        if(this.form.actType == 3) {
          if(!activityTimeIntervals.length) {
            callback(new Error('请先选择活动时间段'))
            return;
          }
          if(effectStartTime < new Date(activityTimeIntervals[0].effectEndTime).getTime()) {
            callback(new Error('发货/自提开始时间必须大于活动结束时间'))
          }
        }
        // 定金预售发货/自提开始时间必须大于付尾款结束时间
        if(this.form.actType == 2) {
          var retainageEndTime = this.form.depositParam.retainageEndTime
          if(!retainageEndTime) {
            callback(new Error('请先选择付尾款结束时间'))
            return;
          }
          if(effectStartTime < new Date(retainageEndTime).getTime()) {
            callback(new Error('发货/自提开始时间必须大于付尾款结束时间'))
          }
        }
        callback()
      },
      formatZtDate(){
        var obj = {};
        Object.assign(obj, this.form.selfZtTime[0]);
        if(typeof obj.effectStartTime == 'object'){
          obj.effectStartTime = obj.effectStartTime.getTime();
        }
        if(typeof obj.effectEndTime == 'object'){
          obj.effectEndTime = obj.effectEndTime.getTime();
        }
        return obj;
      },
      ztTimeOnChange(){
        var formData = this.formatZtDate();
        var effectStartTime = formData.effectStartTime;
        var effectEndTime = formData.effectEndTime;
        this.form.selfZtTime[0].effectStartTime = effectStartTime
        this.form.selfZtTime[0].effectEndTime = effectEndTime
        this.$refs['form'].validateField('selfZtTime');
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
					// 接口返回的自提时间字段修改成form中对应的字段
					this.form.selfZtTime[0].effectStartTime = res.data.activity.sendTime;
					this.form.selfZtTime[0].effectEndTime = res.data.activity.sendEndTime - 24*60*(60-1)*1000;
          delete this.form.sendTime;
          delete this.form.sendEndTime;
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
<style lang="scss">
	.mod-member {
		border:1px dashed #bfccda;
		border-radius:4px;
		overflow:hidden;
		padding:10px 30px 20px;
		background:#fbfbfb;
		float:left;
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
	}
	.tips {
		line-height:35px;
		margin-left:20px;
		font-size:12px;
	}
</style>
