<template>
    <div class="mod-search">
        <el-form :model="popForm" label-width="100px" ref="popForm" :inline="true">
            <el-form-item label="业态:" prop="businessTypeCode">
                <el-select v-model="popForm.businessTypeCode">
                    <el-option v-for="item, index in comData.businessTypeCode" :key="index" :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="店铺名称:" prop="shopName">
                <el-input v-model="popForm.shopName" placeholder="请输入店铺名称"></el-input>
            </el-form-item>
            <el-form-item label="渠道:" prop="onlineOffline">
                <el-select v-model="popForm.onlineOffline">
                    <el-option v-for="item, index in comData.onlineOffline" :key="index" :label="item.name"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="店铺编码:" prop="shopMdCodeList">
                <el-input type="textarea" v-model="popForm.shopMdCodeList" placeholder="可输入多个店铺编码批量查询，请以“，”逗号分开"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="editLoading">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
	export default {
		props:['bus', 'comData'],
		data(){
			return {
				editLoading:false,
				popForm:{
					businessTypeCode:this.comData.businessTypeCodeSelected,
					shopName:'',
					onlineOffline:this.comData.onlineOfflineSelected,
					shopMdCodeList:''
				}
			}
		},
		methods:{
			onSubmit(){
				this.bus.$emit('part-shop/search', this.popForm);
			}	
		},
		mounted(){
			var self = this;
		}
	}
</script>
