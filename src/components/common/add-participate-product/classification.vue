<template>
	<div class="mod-select-item" :class="isError?'error':''">
		<h3><el-checkbox v-model="checked" name="selectGoods">选择分类</el-checkbox><span class="error-msg" v-if="isError">分类不能为空</span></h3>
		<div class="item-bd"  :class="checked?'':'disabled'"  v-loading="loading">
			<el-tree
				ref="tree"
				:data="treeData"
				show-checkbox
				node-key="catbackId"
				@check-change="checkChange"
				:props="defaultProps"
				:default-checked-keys="getIds(popData)"
				>
			</el-tree>
		</div>
	</div>
</template>
<script>
	export default {
		props:['bus','popData'],
		data(){
			return {
				type:'category',
				checked:false,
				loading:true,
				sels:[],
				defaultProps:{
					children: 'children',
					id:'catbackId',
					label: 'catbackName'
				},
				treeData:[]
			}
		},
		computed:{
			isError(){
				let flag = this.checked && this.sels.length==0;
				this.bus.$emit('classification/validate', {isError:flag, type:this.type, checked:this.checked, ids:this.sels, index:'0'})
				return flag;	
			}
		},
		methods:{
			checkChange(){
				this.sels = this.$refs.tree.getCheckedNodes(true);
				this.bus.$emit('classification/getIds',{ids:this.checked?this.sels:[], isError:this.isError, type:this.type});
			},
			getIds(data){
				var ar = [];
				if(!data){ return []; }				
				for(var i=0;i<data.length;i++){
					ar.push(data[i]['catbackId']);	
				}
				return ar;
			}
		},
		mounted(){
			var self = this;
			var popData = this.popData;
			if(popData){
				this.sels = popData;
				self.checked = self.sels.length!=0;
			}
			this.$ajax.post('http://shopmanage.yunhou.com/api/Backclassify/tree',{}).then((res)=>{
				if(res.data && res.data.list){
					this.treeData = res.data.list;
				}
				this.loading = false;
			});
		}	
	}
</script>
