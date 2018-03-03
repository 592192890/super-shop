<template>
	<div>
		<Search :bus="bus" ></Search>
		<TableOperate :bus="bus">
			<template slot="column">
		        <el-table-column prop="mobile" label="用户手机号" min-width="150" align="left" show-overflow-tooltip>
		        </el-table-column>
		        <el-table-column prop="shopName" label="消费门店" min-width="150" align="left" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="consumeTime" label="消费时间"  min-width="200" align="left">
				</el-table-column>
				<el-table-column prop="integralTime" label="积分时间" min-width="200" align="left">
				</el-table-column>
				<el-table-column prop="statusDescription" label="状态" min-width="100" align="left">
				</el-table-column>
				<el-table-column prop="consumeAmount" label="消费金额(元)" min-width="150" align="left">
				</el-table-column>
				<el-table-column prop="integralQuantity" label="积分金额(元)" align="left" min-width="150">
				</el-table-column>
			</template>
		</TableOperate>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Search from '@/components/common/integral/index.vue'
	import TableOperate from '@/components/common/integral/table.vue'
	export default {
		data(){
			return {
				bus: new Vue()
			}
		},
		components:{Search, TableOperate}
	}
</script>
