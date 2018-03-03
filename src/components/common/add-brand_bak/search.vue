<template>
    <div class="mod-search">
        <el-form :model="popForm" label-width="100px" ref="popForm" :inline="true">
            <el-form-item label="品牌名称:" prop="brandName" class="f-l">
                <el-input v-model="popForm.brandName" placeholder="请输入品牌名称"></el-input>
            </el-form-item>
            <div class="f-l">
                <el-button type="primary" @click="onSubmit" :loading="editLoading">搜索</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
	export default {
		props:['bus'],
		data(){
			return {
				editLoading:false,
				popForm:{
					brandName: ''
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
