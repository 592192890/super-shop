<template>
	<div class="mod-member-settings">
		<el-form-item label="会员设置" prop="resource" :rules="[{required: true, message: '请选择会员设置' }]" v-if="hiddenTab==undefined">
			<el-radio-group v-model="form.resource" @change="resourceChange">
				<el-radio label="1" v-if="tagStatus[0]">所有用户</el-radio>
				<el-radio label="2" v-if="tagStatus[1]">会员等级</el-radio>
				<el-radio label="3" v-if="tagStatus[2]">会员标签</el-radio>
			</el-radio-group>
		</el-form-item>
		<div>
			<el-form-item label="" v-if="form.resource == 2" :rules="[{validator: validate.registeredMember}]" prop="registeredMember">
				<div class="mod-member">
					<!-- userGrades begin -->
					<div class="member-item">
						<!-- <h3>按会员等级设置</h3> -->
						<el-checkbox-group v-model="form.userGrades" class="inner" @change="changeUserGrades">
							<el-checkbox v-for="(item, index) in select.userGrades" :label="item.value.toString()" :key="item.value">{{ item.name }}</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
			</el-form-item>
		</div>
		<div class="mod-member mod-user-wrap" v-if="form.resource == 3">
			<Tag :bus="bus" :opt="opt"></Tag>
		</div>
	</div>
</template>
<script>
	import Tag from './tag.vue'
	export default {
		components:{ Tag },
		props:['bus', 'tagStatus', 'opt', 'hiddenTab', 'tagShow'],
		data(){
			var self = this;
			return {
				form: {
					resource:'',
					userGrades:[],
					userTags:{}	
				},
				select: {
					userGrades:[]
				},
				loading:false,
				validate:{
					registeredMember : (rule, value, callback) => {
						if(this.form.userGrades.length==0 ){
							callback(new Error('会员等级至少选择一个'));
						}
						callback();
					}
				}
			}
		},
		methods:{
			isEmpty(obj) {
				 for (var x in obj) { if (obj.hasOwnProperty(x))  return false; }
				 return true;
			},
			resourceChange(){
				if(this.form.resource==1){
					this.form.userGrades = [];
					this.form.userTags = {};
				}else if(this.form.resource==2){
					this.form.userTags = {};
				}else{
					this.form.userGrades = [];
				}
				this.bus.$emit('member-settings/change', {form: this.form});
			},
			setResource(){
				Object.assign(this.form.resource, this.opt.resource);
				Object.assign(this.form.userGrades, this.opt.userGrades);
				Object.assign(this.form.userTags, this.opt.userTags);
				//
				if(this.form.userGrades.length!=0 && this.tagStatus[1]){
					this.form.resource='2';	
				}else if(!this.isEmpty(this.form.userTags) && this.tagStatus[2]){
					this.form.resource='3';	
				}else if(this.tagStatus[0]){
					this.form.resource='1';	
				}else{
					this.form.resource='';	
				}	
			},
			changeUserGrades(){
				this.bus.$emit('member-settings/change', {form: this.form});
			}
		},
		created(){
			var self = this;	
			//
			if(!self.hiddenTab){
				this.$ajax.post('http://shopmanage.yunhou.com/api/active/member_list',{}).then((res)=>{
					self.select.userGrades = res.data;
				});
			}
			this.bus.$on('tag/change', function(obj){
				Object.assign(self.form, obj.form);	
				self.bus.$emit('member-settings/change', {form: self.form});
			});
			this.bus.$emit('member-settings/change', {form: this.form});
			this.bus.$on('member-settings/getData', function(){
				self.setResource();
			});
		},
		watch:{
			tagStatus(){
				if(!this.tagStatus[this.form.resource-1]){
					this.opt.resource = '';
				}
			},
			tagShow(){
				this.form.resource = (this.tagShow?'3':'');
			}
		}
	}
</script>
<style lang="scss" scoped>
	.mod-member-settings {
		.mod-user-wrap {
			float:none;	
			margin:0px 0px 20px 140px;
		}
	}
	.mod-member {
		border:1px dashed #bfccda;
		border-radius:4px;
		overflow:hidden;
		padding:20px 30px 20px;
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
</style>
