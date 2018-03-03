<template>
    <div class="mod-pop-search">
        <el-form label-width="140px" ref="comData" :inline="true">
            <el-form-item label="活动名称:">
				{{ comData.actName }}
            </el-form-item>
            <el-form-item label="开始时间:">
				{{ comData.startTime | toDate }}
            </el-form-item>
            <el-form-item label="结束时间:">
				{{ comData.endTime | toDate }}
            </el-form-item>
            <el-form-item label="购买商品种类数:">
				{{ comData.productNum }}
            </el-form-item>
            <el-form-item label="购买会员数:">
				{{ comData.buyMembers }}
            </el-form-item>
            <el-form-item label="总销售数量:">
				{{ comData.totalNum}}
            </el-form-item>
            <el-form-item label="总销售金额:">
				{{ comData.totalMoney }}
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
	import util from '@/assets/js/util'
	export default {
		props:['comData'],
		filters:{
			toDate(val){
				return (val && util.formatDate.format(new Date(val), 'yy-MM-dd hh:mm:ss '));	
			}	
		}
	}
</script>
<style lang="scss" scoped>
.el-form-item{
    margin-bottom: 20px;
}
</style>
