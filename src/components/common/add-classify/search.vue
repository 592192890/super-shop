<template>
    <div class="mod-search">
        <el-form :model="popForm" label-width="100px" ref="popForm" :inline="true">
            <!-- <el-form-item label="分类编码:" prop="catbackId">
                <el-input v-model="popForm.catbackId" placeholder="请输入分类编码"></el-input>
            </el-form-item> -->
            <el-form-item label="分类名称:" prop="catbackName">
                <el-input v-model="popForm.catbackName" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="editLoading">搜索</el-button>
        </el-form>
    </div>
</template>
<script>
	import util from '@/assets/js/util'
	export default {
		props:['bus'],
		data(){
			return {
				editLoading:false,
				popForm:{
					// catbackId: '',
					catbackName: '',
					type: 3
				}
			}
		},
		methods:{
			onSubmit(){
				this.bus.$emit('search', this.popForm);	
			}
		},
		mounted(){
			var self = this;
		}
	}
</script>
<style lang="scss" scoped>
.mod-classify-btn{
	margin-top: 10px;
}
</style>
