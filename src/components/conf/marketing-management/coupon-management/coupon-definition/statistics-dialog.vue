<template>
	<div>
		<el-row class="statistics">
			<el-col :span="8"><span>优惠券名称：</span><span>{{name}}</span></el-col>
			<el-col :span="8"><span>开始时间：</span><span>{{time1}}</span></el-col>
			<el-col :span="8"><span>结束时间：</span><span>{{time2}}</span></el-col>
		</el-row>
		<el-row class="statistics">
			<el-col :span="8"><span>发放数量：</span><span>{{maxNum}}</span></el-col>
			<el-col :span="8"><span>已发放数量：</span><span>{{grantNum}}</span></el-col>
		</el-row>
		<!-- <el-row>
			<el-button type="info">导出</el-button>
		</el-row> -->
	</div>
</template>

<script>
export default {
	props: ['statisticsData'],
    data(){
        return{
        }
	},
	computed:{
		name:function(){
			return this.statisticsData.couponName;
		},
		time1:function(){
			return new Date(parseInt(this.statisticsData.startTime)).toLocaleString();
		},
		time2:function(){
			return new Date(parseInt(this.statisticsData.endTime)).toLocaleString();
		},
		grantNum:function(){
			return this.statisticsData.grantNum;
		},
		maxNum:function(){
			return this.statisticsData.maxNum;
		},
		
	},
}
</script>
<style lang="scss" scoped>
.el-row{
	height: 40px;
	line-height: 40px;
}
.el-button{
	float: right;
}
</style>


