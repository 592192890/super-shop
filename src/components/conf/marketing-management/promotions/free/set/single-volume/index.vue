<template>
	<div class="mod-block mod-set">
    	<div :class="isView?'block-mask':''">
    		<el-form ref="form" :model="form" label-width="140px" class="mod-form">
				<div class="mod-search mod-search-list">
					<el-row type="flex" class="mod-msg">
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
					<el-form-item label="免费额度设置:" class="inline-form free-form">
						<div class="f-l text">以下商品单笔购买满</div>
						<div class="f-l input">
								<el-form-item prop="number" :rules="[
									{type:'number', required: true,  message:'请输入数量'},
									{pattern:/^\+?[1-9][0-9]*$/, message:'请输入正整数'}
									]" >
								<el-input v-model.number="form.number" type="number" id="jQuota"></el-input>
							</el-form-item>
						</div>
						<div class="f-l text"> 件时，其中最便宜单品免费</div>
						<div class="f-l allow-overlay">
							<el-checkbox v-model="form.isSuperpose" label="允许叠加" name="type"></el-checkbox>
						</div>
					</el-form-item>
				</div>
				<div class="mod-opr-btn">
					<el-button @click="addPartShop">添加商品</el-button>
					<el-button @click="importGoods">导入促销商品</el-button>
				</div>
			
			<!-- <el-form ref="form" :model="form" label-width="140px" class="mod-form" v-if="form.tableData.length"> -->
				<el-table :data="form.tableData" v-loading="form.listLoading" v-if="form.tableData.length">
					<el-table-column label="序号" type="index" width="80" align="left">
				    </el-table-column>
					<el-table-column prop="goodsName" label="商品名称" min-width="250" align="left" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="name" label="规格" min-width="250" align="left" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="bn" label="SKU编码" min-width="150" align="left" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="price" label="销售价" min-width="100" align="left" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="cost" label="成本价" min-width="100" align="left" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="操作" width="120px">
						<template scope="scope">
							<el-button type="text" @click="del(scope.$index, scope.row)">删除</el-button>
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

		<!-- <SearchTable :bus="bus"></SearchTable> -->
		<addPartGoods :bus="bus"></addPartGoods>
		<ImportGoods :bus="bus"></ImportGoods>
	</div>
</template>

<script>
	import Vue from 'vue'
	import addPartGoods from '@/components/common/add-product/index.vue'
	import ImportGoods from '@/components/common/import/index.vue'
	import util from '@/assets/js/util'
	import Permission from '@/assets/js/permission-util.js';
	export default {
		components:{ addPartGoods, ImportGoods },
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
				id: this.$route.query.id
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
					type: 'bn'
				}
				this.bus.$emit('import', data);
			},
			//添加商品
			addPartShop(){
				this.bus.$emit('add', {flag:true, sels:this.form.tableData, tableId: this.form.tableId, shopIds: this.activity?this.activity.shopIds:[]});
			},
			//分页事件触发
			handleCurrentChange(){
				let self = this;
				self.form.listLoading = true;
				this.$refs['form'].validate((valid) => {
					if (valid) {
						self.onAddGoods(false, {data:self.form.tableData, key:'bn'}, self.getRedistable);
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
						self.onAddGoods(false, {data:self.form.tableData, key:'bn'}, function(){
							self.$ajax.post(self.$apiUrl.marketing.deleteRedisData,{dataId: row.bn, tableId: self.form.tableId}).then((rst)=>{
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
				sessionStorage.setItem('active-set', JSON.stringify(self.$data.form));
				this.$router.go(-1);
			},
			//活动提交
			submitForm(formName) {
				let self = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						self.onAddGoods(false, {data:self.form.tableData, key:'bn'}, function(){
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
					self.form.currPage = res.data.currentPage;
					self.form.tableData = util.array.toArray(res.data.listData);
					self.form.listLoading = false;
				});
			},
			//获取临时表ID
			getRedistableId(){
				let self = this;
				let tableId = sessionStorage.getItem('goods-tableId');
				let opt = {
					actType: self.activity.actType
				}
				!tableId && self.$ajax.post(self.$apiUrl.marketing.getRedistableId, {tableInfo: JSON.stringify(opt)}).then(function(res){
					self.form.tableId = res.data;
					sessionStorage.setItem('goods-tableId', res.data);
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
			this.form.tableId = sessionStorage.getItem('goods-tableId');
			self.setActMsg();
			self.getRedistableId();

			this.bus.$on('index/add/table/submit', function(sels){
				self.onAddGoods(true, {data:sels, key:'bn', transform:{name: 'specName', price: 'salePrice'}}, self.getRedistable)
			});

			this.bus.$on('import/success', function(){
				self.getRedistable();
			});

			self.form.listLoading = true;
			if(sessionStorage.getItem('active-set')){
				self.$data.form = JSON.parse(sessionStorage.getItem('active-set'));
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
					self.form = Object.assign(self.form, res.data.params);
					self.getRedistable();
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mod-search{
		background-color: #fff;
		padding: 20px;
		.mod-msg{
			padding: 0 0 20px;
			border-bottom:1px solid #f3f5f7;
		}
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
<style scoped lang="scss">
	.mod-search-list {
		position:relative;
		.inline-form {
			width:auto;	
			line-height:35px;
			padding-top:20px;
			.text {
				line-height:37px;
			}
			.input {
				width:120px;
				margin:0px 5px;
				.el-form-item {
					width:120px;	
				}
			}
			.allow-overlay {
				line-height:37px;
				margin-left:35px;
			}
		} 
	}
</style>
<style lang="scss">
	.mod-set {
		.el-form-item__error{
			position: relative;
			margin-bottom: 5px;
			text-align: left;
		}
		.el-table tr{
			height: 55px;
		}
	}
	.free-form{
		label.el-form-item__label{
			padding: 11px 20px 11px 0;
		}
	}
</style>

