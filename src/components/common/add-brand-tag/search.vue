<template>
    <div class="mod-search">
        <el-form :model="popForm" label-width="100px" ref="popForm" :inline="true">

            <el-form-item label="品牌名称:" prop="brandName">
                <el-input v-model="popForm.brandName" placeholder="请输入品牌名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="editLoading" style="margin-left: 20px;">搜索</el-button>
            </el-form-item>
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
					brandName: '',
				},
				defaultProps: {
		          	children: 'children',
		          	label: 'catbackName'
		        },
		        selectType: [
		        	{
		        		label: '商品名称搜索',
		        		value: 3
		        	},
		        	{
		        		label: '货品编码搜索',
		        		value: 2
		        	},
		        	{
		        		label: '商品编码搜索',
		        		value: 1
		        	}
		        ],
		        brandSels: [],
		        brandLoading: false
			}
		},
		methods:{
			getCheckedNodes(){
				let self = this,
					arr = this.$refs.classify.getCheckedNodes(),
					classifyArr = [],
					classifyNameArr = [];
				arr.forEach(function(item, index){
					classifyArr.push(item.outBrandId);
					classifyNameArr.push(item.brandName);
				});
				self.popForm.backcatId = util.array.repeatArr(classifyArr).join(',');
				self.classifyName = util.array.repeatArr(classifyNameArr).join(',');
				this.popVisible = false;
			},
			getClassify(){
				let self = this;
				if(!self.classifyTree.length){
					self.$ajax.post(self.$apiUrl.marketing.goodsClassify,{}).then(function(res){
						self.classifyTree = res.data.list;
					});
				}
			},
			remoteMethod(query){
				let self = this;
				if(!query){
					return false;
				}
				this.delay(function(){
					let opt = {
						brandName: query,
						currentPage: 1,
						pageSize: 10
					}
					self.$ajax.post(self.$apiUrl.marketing.getBrandSearch, opt).then(function(res){
						self.brandSels = res.data.list;
					})
				},300);
			},
			getFormat(){
				var self = this;
				this.$ajax.post('http://t.com/marketing-management/promotions/fixed-discount/format',{}).then(function(res){
					self.popForm.format = [].concat(self.popForm.format, res.data);
				});	
			},
			onSubmit(){
				this.bus.$emit('search', this.popForm);	
			},
			//监听input输入时，延时方法
			delay: (function () {
		        var timer = 0;
		        return function (callback, time) {
		            clearTimeout(timer);
		            timer = setTimeout(callback, time);
		        };
			})()
		},
		mounted(){
			var self = this;
				// self.getFormat();
		}
	}
</script>
<style lang="scss" scoped>
.mod-classify-btn{
	margin-top: 10px;
}
// .mod-search .el-form--inline .el-form-item{
// 	width: auto;
// }
</style>
