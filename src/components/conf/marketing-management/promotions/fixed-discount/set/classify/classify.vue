<template>
    <div class="mod-block mod-set">
    	<div :class="isView?'block-mask':''">
	    	<div class="mod-search">
		    	<el-row type="flex">
					<el-col>
						<span class="mod-tags">
							<label>活动名称：</label>	
							<span>{{actName}}</span>
						</span>
						<span class="mod-tags">
							<label>活动类型：</label>	
							<span>{{actTypeName}}</span>		
						</span>
					</el-col>
				</el-row>
			</div>
			
			<el-row type="flex" class="mod-tips" justify="space-between" align="middle">
				<el-col :span="5">
					<el-row type="flex" justify="space-between">
						<el-col :span="12">
							<el-button size="small" @click="addPartClass">添加分类</el-button>
						</el-col>
						<el-col :span="12">
							<el-button size="small" @click="importGoods">导入分类折扣</el-button>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="8" class="tips-text">
					<i class="el-icon-warning icon"></i>折扣率中请输入0~100之间，输入85表示价格*85%
				</el-col>
			</el-row>
	        <el-form ref="form" :model="form" class="mod-form" v-if="form.tableData.length">
	            <el-table ref="goodsTable" :data="form.tableData" style="width: 100%" v-loading="form.listLoading" :row-key="getKey">
				    <el-table-column label="序号" type="index" width="80">
					</el-table-column>
				    <el-table-column prop="name" label="分类名称" show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column prop="upCatePath" label="上级分类" show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column prop="discount" label="折扣率" width="150">
				    	<template scope="scope">
				    		<el-row type="flex" align="middle">
				    			<el-col :span="20">
				    				<el-form-item :prop="'tableData.'+scope.$index+'.discount'"
				    				:rules="[
				    				{type:'number', required:true, message:'请输入折扣率'},
			                		{type:'number', min:0.01, max:100, message:'需大于0小于100'}]">
				    					<el-input v-model.number="scope.row.discount" size="small" @blur="dataFilter(scope.$index, form.tableData)"></el-input>
				    				</el-form-item>
				    			</el-col>
				    			<el-col :span="2" :offset="2">%</el-col>
				    		</el-row>
				    	</template>
				    </el-table-column>
				    <el-table-column label="操作" width="80">
				    	<template scope="scope">
				    		<el-button type="text" @click.native.prevent="del(scope.$index, scope.row)">删除</el-button>
				    	</template>
				    </el-table-column>
				</el-table>
	        </el-form>
		</div>
	  	<el-row type="flex" justify="space-between" align="middle" class="mod-page">
	  		<el-col :span="9">
		  		<el-col :span="8">
				   	<el-button @click="historyBack">返回上一步</el-button>
			    </el-col>
			    <el-col :span="8" v-if="!isView">
				   	<el-button type="primary" @click="submitForm('form')" :disabled="form.tableData.length==0">提交活动</el-button>
			    </el-col>
		    </el-col>
	  		<el-col v-if="form.tableData.length" style="width:auto" v-loading="form.listLoading">
			    <el-pagination ref="pagination"
			    	@click.native="handleCurrentChange"
			    	@keyup.enter.native="handleCurrentChange"
					@size-change="handleSizeChange"
					:current-page.sync="form.currentPage"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="form.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="form.total">
			    </el-pagination>
		    </el-col>
	  	</el-row>
		<addPartClass :bus="bus"></addPartClass>
		<ImportGoods :bus="bus"></ImportGoods>
    </div>
</template>
<script>
	import Vue from 'vue'
	import addPartClass from '@/components/common/add-classify/index.vue'
	import ImportGoods from '@/components/common/import/index.vue'
	import util from '@/assets/js/util'
	import Permission from '@/assets/js/permission-util.js';
	export default {
		components:{ addPartClass, ImportGoods },
		data(){
			var self = this;
			return {
				bus: new Vue(),
				form:{
					tableData: [],
					isSuperpose: true,
					number: '',
					sels:[],
					listLoading: false,
					currentPage: 1,
					currPage: 1,
					total: 0,
					pageSize: 10,
					tableId: '',
					isUpdate: true
				},
				activeType: 0,
				activity: '',
				actName: '',
				actTypeName: '',
				id: this.$route.query.id,
				isPage: false
			}
		},
		computed:{
			isView(){
				var matched = this.$router.currentRoute.matched;
				var list = matched[matched.length-2].path+'/list';
				var ar = Permission.button(list, this.$router.options.routes)||[];
				return !(ar.indexOf('bt-edit')>-1 && this.form.isUpdate);
			}
		},
		methods:{
			//导入商品
			importGoods(){
				let data = {
					flag: true,
					actData: this.activity,
					tableId: this.form.tableId,
					sels: this.form.tableData,
					type: 'id'
				}
				this.bus.$emit('import', data);
			},
			//添加商品
			addPartClass(){
				this.bus.$emit('addClassify', {flag:true, sels:this.form.tableData, tableId: this.form.tableId, shopIds: this.activity?this.activity.shopIds:[]});
			},
			//分页事件触发
			handleCurrentChange(e){
				let self = this;
				self.form.listLoading = true;
				// if(e.target.parentNode.className.indexOf('disabled') != '-1' && self.isPage){
				// 	this.$refs.pagination.handleCurrentChange(this.form.currPage);
				// 	self.isPage = true;
				// 	return false;
				// }
				this.$refs['form'].validate((valid) => {
					if (valid) {
						self.onAddGoods(false, {data:self.form.tableData, key:'id'}, self.getRedistable);
					} else {
						self.form.listLoading = false;
						this.$refs.pagination.handleCurrentChange(this.form.currPage);
						return false;
					}
				});
			},
			//每页显示条数改变触发
			handleSizeChange(pageSize){
				this.form.pageSize = pageSize;
				this.getRedistable();
			},
			//删除数据
			del(index, row){
				var self = this;
				this.$confirm('确定删除这条数据么?',{type:'warning'}).then((res)=>{
					if(res){
						self.onAddGoods(false, {data:self.form.tableData, key:'id'}, function(){
							self.$ajax.post(self.$apiUrl.marketing.deleteRedisData,{dataId: row.id, tableId: self.form.tableId}).then((rst)=>{
								if(rst.error == 0){
									self.$message.success('删除成功!');
									self.getRedistable();
								}
							});	
						});
					}
				}).catch(() => {});
			},
			//获取key
			getKey(row){
				return row.goodsid;
			},
			//返回上一步
			historyBack(){
				let self = this;
				sessionStorage.setItem('active-set-classify', JSON.stringify(self.$data.form));
				this.$router.go(-1);
			},
			//活动提交
			submitForm(formName) {
				let self = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						self.onAddGoods(false, {data:self.form.tableData, key:'id'}, function(){
							let opt = {
								activity: JSON.stringify(self.activity),
								params: JSON.stringify({
									isSuperpose: self.form.isSuperpose,
									number: self.form.number,
									tableId: self.form.tableId
								})
							}
							let ajaxUrl = self.id ? self.$apiUrl.marketing.updateActive : self.$apiUrl.marketing.addActive
							self.$ajax.post(ajaxUrl, opt).then(function(res){
								if(res.error==0){
									self.$message.success('活动设置成功');
									var matched = self.$router.currentRoute.matched;
									self.$router.push(matched[matched.length-2].path);
								}
							});
						});
						
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//数据过滤
			dataFilter(index, rows){
				if(typeof(rows[index].discount) == 'number'){
					rows[index].discount = parseFloat(rows[index].discount.toFixed(2));
				}else{
					rows[index].discount = '';
				}

			},
			//获取临时表数据
			getRedistable(){
				let self = this;
				let getOpt = {
					currentPage: self.form.currentPage,
					pageSize: self.form.pageSize,
					tableId: self.form.tableId
				}
				if(!getOpt.tableId) return
				self.$ajax.post(self.$apiUrl.marketing.getRedistable, getOpt).then(function(res){
					self.form.total = res.data.totalRow;
					self.form.prevPage = Number(res.data.currentPage);
					self.form.currentPage = Number(res.data.currentPage);
					self.form.currPage = Number(res.data.currentPage);
					self.form.tableData = util.array.toArray(res.data.listData);
					self.form.listLoading = false;
				});
			},
			//获取临时表ID
			getRedistableId(){
				let self = this;
				let tableId = sessionStorage.getItem('classify-tableId');
				let opt = {
					actType: self.activity.actType
				}
				!tableId && self.$ajax.post(self.$apiUrl.marketing.getRedistableId, {tableInfo: JSON.stringify(opt)}).then(function(res){
					self.form.tableId = res.data;
					sessionStorage.setItem('classify-tableId', res.data);
				});
			},
			//设置活动信息
			setActMsg(){
				this.activity = JSON.parse(sessionStorage.getItem('active-add'));
				if(this.activity){
					this.actName = this.activity.name;
					this.actTypeName = this.activity.actTypeName;
				}
			},
			//更新临时表数据，emptyFlag true 覆盖，flase 更新
			onAddGoods(emptyFlag, obj, callback){
				let self = this;
				let productArr = util.array.toObject(obj.data, obj.key, obj.transform);
				let opt = {
					tableId: self.form.tableId,
					datas: JSON.stringify(productArr),
					ifEmptyOld: emptyFlag
				}
				self.$ajax.post(self.$apiUrl.marketing.redistableAdd, opt).then(function(res){
					let getOpt = {
						currentPage: 1,
						pageSize: self.form.pageSize,
						tableId: self.form.tableId
					}
					// self.getRedistable();
				}).then(function(){
					self.form.listLoading = false;
					callback && callback();
				});
			}
		},
		mounted(){
			let self = this;
			// self.onAddGoods();
			this.form.tableId = sessionStorage.getItem('classify-tableId');
			self.setActMsg();
			self.getRedistableId();

			this.bus.$on('classify/submit', function(sels){
				self.onAddGoods(true, {data:sels, key:'catbackId', transform:{name: 'catbackName', upCatePath: 'catbackPathName', id: 'catbackId'}}, self.getRedistable)
			});

			this.bus.$on('import/success', function(){
				self.getRedistable();
			});

			self.form.listLoading = true;
			if(sessionStorage.getItem('active-set-classify')){
				self.$data.form = JSON.parse(sessionStorage.getItem('active-set-classify'));
				self.form.currPage = self.form.currentPage;
				self.form.listLoading = false;
				return false;
			}
			if(self.id){
				self.form.listLoading = false;
				self.$ajax.post(self.$apiUrl.marketing.getActiveInfo,
				{
					id: self.id
				}).then((res) =>
				{
					if(self.activity.actType == res.data.activity.actType){
						self.form = Object.assign(self.form, res.data.params);
						self.getRedistable();
					}
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	.mod-search{
		background-color: #fff;
		padding: 20px;
	}
	.mod-block{
		background-color: #f2f6f9;
		padding: 0;
	}
	.mod-tags{
		font-size: 14px;
		margin-right: 20px;
		label{
			color: #666;
		}
		span{
			color: #333;
		}
	}
	.mod-add-goods{
		margin-top: 20px;
	}
	.mod-tips{
		margin: 20px 0;
		.tips-text{
			color: #999;
		}
		.icon{
			margin-right: 5px;
		}
	}
	.mod-form{
		margin-top: 5px;
	}
	.mod-page{
		margin: 20px 0;
	}
	.mod-sub{
		text-align: center;
	}
	.el-form-item{
		margin-bottom: 0;
	}
</style>
<style lang="scss">
	.mod-set{
		.el-form-item__error{
			position: relative;
			margin-bottom: 5px;
			text-align: left;
		}
		.el-table tr{
			height: 55px;
		}
	}
</style>
