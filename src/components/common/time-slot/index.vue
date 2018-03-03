<template>
	<div class="mod-time-slot">
		<div class="slot-hd">
			<el-col :span="7">
				<el-date-picker type="datetime" placeholder="请选择开始时间" v-model="form.effectStartTime" style="width: 100%;"  :picker-options="effectStartTimeOptions" @change="onChange"></el-date-picker>
			</el-col>
			<el-col :span="1" class="line">-</el-col>
			<el-col :span="7">
				<el-date-picker type="datetime" placeholder="请选择结束时间" v-model="form.effectEndTime" style="width: 100%;" :picker-options="effectEndTimeOptions" @change="onChange"></el-date-picker>
			</el-col>
			<el-col :span="5" v-if="!only"><a @click="onAddTime" class="icon-add" href="javascript:void(0)" style="margin-left:20px;"><i class="iconfont iconfontmod">&#xe81f;</i>增加时间段</a></el-col>
		</div>
		<!-- times begin -->
		<div v-if="this.form.times.length != 0 && !only" class="slot-bd">
			<h3>已选时间段:</h3>
			<div v-for="(item, index) in this.form.times" class="time-item">{{ item.effectStartTime | toDate }} —— {{ item.effectEndTime | toDate }}
				<a type="text" @click="onDeleteTime(index)" class="icon-del"  href="javascript:void(0)">删除</a>
			</div>
		</div>
		<!-- times end -->
	</div>
</template>
<script>
	import util from '@/assets/js/util'
	export default {
		props:['bus', 'only', 'timesAr'],
		data(){
			var self = this;
			return {
				form:{
					effectStartTime: '',
					effectEndTime: '',
					times:[]
				},
				effectStartTimeOptions: {
					disabledDate(time) {
						self.form.effectEndTime = '';
						return false;
					}		
				},
				effectEndTimeOptions: {
					disabledDate(time) {
						return (time.getTime() < self.form.effectStartTime - 3600 * 1000 * 24 * 1);
					}	  
				}
			}
		},
		methods:{
			onChange(){
				if(this.only){
					if((this.form.effectStartTime && this.form.effectStartTime!='') && (this.form.effectEndTime && this.form.effectEndTime!='')){
						this.onAddTime();	
					}else{
						this.form.times = [];	
						this.bus.$emit('timeSlot/change', this.form.times);
					}
				}
			},
			formatDate(){
				var obj = {};
				Object.assign(obj, this.form);
				if(typeof obj.effectStartTime == 'object'){
					obj.effectStartTime = obj.effectStartTime.getTime();	
				}
				if(typeof obj.effectEndTime == 'object'){
					obj.effectEndTime = obj.effectEndTime.getTime();	
				}
				if(typeof this.form.effectStartTime == 'number'){
					this.form.effectStartTime = new Date(this.form.effectStartTime);	
				}
				if(typeof this.form.effectEndTime == 'number'){
					this.form.effectEndTime = new Date(this.form.effectEndTime);	
				}
				return obj;
			},
			onAddTime(){
				var self = this;
				var formData = this.formatDate();
				var effectStartTime = formData.effectStartTime;
				var effectEndTime = formData.effectEndTime;
				var flag = (effectStartTime && effectEndTime && effectStartTime.length!=0 && effectEndTime.length!=0);
				var checkDate = function(){
					var formData = self.formatDate();
					var flag = formData.effectStartTime < formData.effectEndTime;
					if(!flag){
						self.$message({
							message: '结束时间必须大于开始时间',
							type: 'error'
						});
					}
					return flag;
				}
			//	if(this.only && this.form.times.length==1){
			//		this.$message({
			//			message: '线上限时抢购类型仅允许选择一个时间段',
			//			type: 'error'
			//		});
			//		return false;
			//	}
				if(!checkDate()){
					return false;
				}
				for(var i=0; i<this.form.times.length; i++){
					let _s = this.form.times[i]['effectStartTime'];
					let _e = this.form.times[i]['effectEndTime'];
					if(!((_s<effectStartTime && _e<effectStartTime)||(_s>effectEndTime && _e>effectEndTime)) && !this.only){
						flag = false;
						this.$message({
							message: '所选的时间段重叠，请重新选择',
							type: 'error'
						});
						break;
					}
				}	
				if(this.only && this.form.times.length!=0){
					this.form.times[0] = {
						effectStartTime: effectStartTime,
						effectEndTime: effectEndTime
					}
					this.bus.$emit('timeSlot/change', this.form.times);
					flag = false;
				}
				if(flag){
					this.form.times.push({
						effectStartTime:effectStartTime,
						effectEndTime:effectEndTime,
					});	
					if(!this.only){
						this.form.effectStartTime = '';
						this.form.effectEndTime = '';
					}
					this.bus.$emit('timeSlot/change', this.form.times);
				}
			},
			onDeleteTime(index){
				if(this.form.times.length==1){
					this.form.effectStartTime = '';
					this.form.effectEndTime = '';
				}
				this.form.times.splice(index,1);
				this.bus.$emit('timeSlot/change', this.form.times);
			},
			setTimesAr(){
				this.form.times = this.timesAr;
				var timesAr = this.form.times;
				if(this.only && timesAr.length!=0){
					this.form.effectEndTime = timesAr[0].effectEndTime;	
					this.form.effectStartTime = timesAr[0].effectStartTime;
				}
			}
		},
		filters:{
			toDate(val){
				return util.formatDate.format(new Date(val), 'yy-MM-dd hh:mm:ss ');
			}	
		},
		watch:{
			only(){
				if(this.only && this.form.times.length>0){
					this.form.times = [];
				}
			},
			timesAr(){
				this.setTimesAr();
			}
		},
		mounted(){
			this.setTimesAr();
		}
	}
</script>
<style lang="scss" scoped>
	.mod-time-slot {
		.slot-hd {
			overflow:hidden;
		}
		.slot-bd {
			font-size:14px;
			margin-top:15px;
			h3 {
				font-weight:normal;
				font-size:14px;
				line-height:20px;
				margin-bottom:5px;
			}
			.time-item {
				//margin-top:10px;	
				line-height:20px;
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
		.icon-del {
			margin-left:15px;	
			color:#34cfff;
		}
	}
</style>
