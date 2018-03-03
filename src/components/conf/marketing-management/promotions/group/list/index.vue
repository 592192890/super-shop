<template>
	<div>
		<Search :bus="bus" :defaultSetting="defaultSetting" ></Search>
		<TableOperate :bus="bus" :defaultSetting="defaultSetting">
		<template slot="column">
			<el-table-column prop="name" label="活动名称" min-width="200" align="left" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="activityTimeIntervals.effectStartTime" label="开始时间"  min-width="220" align="left">
			</el-table-column>
			<el-table-column prop="activityTimeIntervals.effectEndTime" label="结束时间" min-width="220" align="left">
			</el-table-column>
			<el-table-column prop="statusName" label="时间状态" min-width="100" align="left">
			</el-table-column>
			<el-table-column prop="enableName" label="开启状态" min-width="100" align="left">
			</el-table-column>
			<el-table-column prop="createAccount" label="创建人" align="left" min-width="150">
			</el-table-column>
		</template>
		</TableOperate>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Search from '@/components/common/search.vue'
	import TableOperate from '@/components/common/table-operate.vue'
	export default {
		data(){
			return {
				bus: new Vue(),
				defaultSetting:{
					toolIds: '[12000]',
					url:'group',
					actType: 1
				},
				select: {
					activeType: [{
						name: '全部',
						value:''
					}],
					timeStatus:[
						{ label: '全部',value:'' },
						{ label: '进行中',value:1 },	
						{ label: '未开始',value:0 },	
						{ label: '已结束',value:99 }
					]
				}
			}
		},
		components:{Search, TableOperate}	
	}
</script>
