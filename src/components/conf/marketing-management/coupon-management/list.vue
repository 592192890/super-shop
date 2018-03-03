<template>
	<div class="mod-search-table">
    <el-table :data="tableData" style="width: 100%" v-loading="listLoading">
		<el-table-column type="selection" width="60px"></el-table-column>
		<el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]" :width="width[index]"></el-table-column>
		<el-table-column label="操作" v-if="operations" width="200px" fixed="right">
			<template scope="scope">
				<el-button type="text" :disabled="isBtnDisabled" v-for="operation in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
			</template>
		</el-table-column>
    </el-table>
	<el-col :span="24" class="mod-toolbar">
		<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
		:page-size="20" :total="total" style="float:right;" :current-page="currentPage">
		</el-pagination>
	</el-col>
	<el-dialog title="统计" :visible.sync="dialogStatisticsVisible">
		<statistics-Dialog></statistics-Dialog>
	</el-dialog>
</div>
</template>
<script>
import statisticsDialog from './coupon-definition/statistics-dialog.vue'
	export default {
		components:{
			statisticsDialog
		},
		data(){
			return {
				isBtnDisabled:false,
				listLoading:true,
				currentPage: 1,
				sels: [],
				tableData: [],
				page: 1,
				total: 0,
				lableNames:"",//列表标题数组集合
				props:"",//请求响应参数数组集合
				operations:"",//操作列，操作能力数组集合
				dialogStatisticsVisible:false,
				index:"",//当前操作的列表行索引，
			}
		},
		methods:
		{
			handleCurrentChange(val)
			{
				this.page = val;
				this.getData();
			},
			getData()
			{
				let self = this;
				self.currentPage = self.page;
				self.listLoading = true;
				self.$ajax.post('http://t.com/marketing-management/coupon-management/list',
				{
					page: self.page
				}).then((res) =>
				{
					self.total = res.data.total;
					self.tableData = res.data.tableData;
					self.listLoading = false;
				});
			},
			whichType(type,index)
			{
				var self = this;
		
				switch(type){
					case "编辑":
						self.editor(index);
						break;
					case "统计":
						self.statistics(index);
						break;
					case "删除":
						self.del(index);
						break;
				}
				
				},
			//统计
			statistics(index)
			{
				this.dialogStatisticsVisible=true;

			},
			//编辑
			editor()
			{
				this.$router.push({name:'修改'});
			},
			//删除
			del()
			{

			},
		},
		mounted()
		{
			this.getData();
			this.lableNames = this.$store.state.list.lableNames;
			this.props = this.$store.state.list.props;
			this.operations = this.$store.state.list.operations;
			this.operationsEvent = this.$store.state.list.operationsEvent;
			// console.log(operation.bindEvent);
		}

	}
</script>
<style lang="scss" scoped>
.mod-search-table{
	margin-top:20px;
}
</style>


