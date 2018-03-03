<template>
    <div class="mod-search">
        <el-form :model="form" ref="form" label-width="100px" :inline="true">
            <el-form-item label="开始时间" prop="startDate">
                <el-date-picker type="datetime" placeholder="请输入开始时间" v-model="form.startDate"
                :picker-options="startTimeOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endDate">
                <el-date-picker type="datetime" placeholder="请输入结束时间" v-model="form.endDate" :picker-options="endTimeOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
            </el-form-item>
						<slot name="actType" :form="form" :defaultSetting="defaultSetting"></slot>
            <el-form-item label="时间状态" prop="status">
                <el-select v-model="form.status">
                    <el-option v-for="item, index in select.timeStatus" :key="item.value" :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开启状态" prop="switch">
				<el-switch v-model="form.enable" on-color="#13ce66" off-color="#ff4949" on-text="启用" off-text="禁用">
				</el-switch>
            </el-form-item>
            <el-form-item style="margin-left:22px;">
                <el-button type="primary" @click="onSubmit">搜索</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
                <el-button @click="add" v-if="buttonArr.indexOf('bt-add')!=-1">添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
	import Permission from '@/assets/js/permission-util.js';
	export default {
		props:['bus', 'defaultSetting'],
		data(){
			let self = this;
			return {
				buttonArr:[],
				select:{
					timeStatus:[
					{ label: '全部',value:'' },
					{ label: '进行中',value:1 },
					{ label: '未开始',value:0 },
					{ label: '已结束',value:99 }
					]
				},
				form:{
					actType:'',
					startDate: ((new Date()).getTime()-7*24*60*60*1000),
					endDate:((new Date()).getTime()+7*24*60*60*1000),
					name:'',
					status:'',
					enable:true
				},
				startTimeOptions: {
					disabledDate(time) {
						self.form.endDate = '';
						return false;
					}
				},
				endTimeOptions: {
					disabledDate(time) {
						//return time.getTime() < Date.now() - 8.64e7;
						return (time.getTime() < self.form.startDate - 3600 * 1000 * 24 * 1);
					}

				}

			}
		},
		methods: {
			onReset(){
				this.$refs['form'].resetFields();
				this.form.enable = true;
			},
			timeValid(){
				let flag = true;
				if(startDate>endDate){
					this.$message({
						message: '付尾款的开始时间和结束时间都不能小于活动的结束时间',
						type: 'error'
					});
					flag = false;
				}
				return flag;
			},
			onSubmit(){
				this.form.startDate = new Date(this.form.startDate).getTime();
				this.form.endDate = new Date(this.form.endDate).getTime();
				if(this.form.startDate>this.form.endDate){
					this.$message({
						message: '开始时间不能大于结束时间',
						type: 'error'
					});
					return false;
				}
				this.bus.$emit('index/search',this.form);
			},
			add(){
				sessionStorage.clear();
				this.$router.push('/marketing-management/promotions/'+ this.defaultSetting.url +'/@add');
			}
		},
		mounted(){
			this.buttonArr=Permission.button(this.$route.path,this.$router.options.routes)||[];
			this.bus.$emit('search/loaded', this.form);
		}
	}
</script>
