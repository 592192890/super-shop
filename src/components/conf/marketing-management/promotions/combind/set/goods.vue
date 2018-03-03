<template>
    <div class="mod-block mod-set">
		<div :class="isView?'block-mask':''">
	    	<div class="mod-search">
		    	<el-row>
					<el-col :span="24">
						<div class="mod-tags">
							<label>活动名称：</label>	
							<span>{{activeName}}</span>
						</div>
					</el-col>
				</el-row>
			</div>

			<el-row type="flex" class="mod-tips" justify="space-between" align="middle">
				<el-col :span="5">
					<el-row type="flex" justify="space-between">
						<el-col :span="12">
							<el-button size="small" @click="addGroup()">添加组合</el-button>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="8" class="tips-text">
					<i class="el-icon-warning icon"></i>折扣率中请输入0~100之间，输入85表示价格*85%
				</el-col>
			</el-row>

			<el-form ref="form" :model="form" label-width="80px">
				<div class="mod-box" v-for="(item, index) in form.tableData" :key="item.type">
					<div class="desc clearfix">
						<el-button size="small" class="f-l" @click="addGoods(item, index, form.tableData)">选择商品</el-button>
						<el-button type="primary" @click="delGroup(item, index, form.tableData)" size="small" class="f-r">删除</el-button>
						<div class="desc-price f-r"><span>所选商品销售价：{{ item | countTotalPrice}}元</span><span>成本价：{{ item | countTotalCost}} 元</span></div>
					</div>
					<div class="mod-list" v-if="item.items">
						<el-row type="flex" class="mod-item" v-for="(row, i) in item.items" :key="row.id">
							<el-col :span="16" class="item-goods txt-overflow">商品{{i+1}}：{{row.goodsName}}</el-col>
							<el-col :span="8" class="item-num f-r clearfix">
								<div class="f-l num">
									<el-form-item label="数量:" :prop="'tableData.'+index+'.items.'+i+'.num'" :rules="[{validator:$validate.positiveInteger}]">
								    	<el-input type="number" @change="changePrice(row, index, form.tableData,i)" v-model.number="row.num" size="small" placeholder="请输入数量"></el-input>
								  	</el-form-item>
								</div>
								<div class="f-r del">
								<!-- <el-button type="text" @click="delGoods(form.tableData[index].data, i)">删除</el-button> -->
									<el-button @click="delGoods(row, i, form.tableData[index].items)" type="text" size="small" class="f-r">删除</el-button>
								</div>
							</el-col>
						</el-row>
					</div>

					<div class="mod-mode" v-if="item.items">
						<el-row type="flex" class="item">
							<el-col :span="6" style="margin-right:30px;">
								<el-form-item label="促销方式:">
							    	<el-select v-model="item.type">
										<el-option v-for="option in form.modeSels" :key="option.value" :label="option.label"
								:value="option.value"></el-option>
								    </el-select>
							  	</el-form-item>
						  	</el-col>
						  	<el-col :span="6">
						  		<el-row type="flex" class="mod-item">
							  		<el-col class="mode-desc" :span="7">{{item.type==3?'立减':'享受'}}:</el-col>
									<el-col>
									  	<el-form-item :prop="'tableData.'+index+'.value'" :rules="[{validator: validate.changeDiscount, item:item}]">
									    	<el-input type="number" @blur="dataFilter(item)" v-model.number="item.value"></el-input>
									  	</el-form-item>
								  	</el-col>
									<el-col class="mode-desc" :span="2">{{item.type==2?'折':'元'}}</el-col>
								</el-row>
							</el-col>
						</el-row>
					</div>
				</div>
			</el-form>
		</div>

		<el-row type="flex">
			<el-col :span="9">
		  		<el-col :span="8">
				   	<el-button @click="historyBack">返回上一步</el-button>
			    </el-col>
			    <el-col :span="8" v-if="!isView">
				   	<el-button type="primary" @click="submitForm('form')" :disabled="form.tableData.length==0">提交活动</el-button>
			    </el-col>
		    </el-col>
		</el-row>

		<addPartGoods :bus="bus"></addPartGoods>
		<ImportGoods :bus="bus"></ImportGoods>
		<el-dialog
			title="提示"
			:visible.sync="dialogVisible"
			size="tiny">
		<span>不允许删除，组合商品不能为空</span>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		</span>
		</el-dialog>
    </div>
</template>
<script>
	import Vue from 'vue'
	import addPartGoods from '@/components/common/add-product/index.vue'
	import ImportGoods from '@/components/common/import/index.vue'
	import Permission from '@/assets/js/permission-util.js';
	export default {
		components:{ addPartGoods, ImportGoods },
		data(){
			var self = this;
			return {
				bus: new Vue(),
				form:{
					modeSels: [
						{
							label: '促销价格',
							value: 1
						},
						{
							label: '折扣',
							value: 2
						},
						{
							label: '立减',
							value: 3
						}
					],
					tableData:[],
					sels:[],
					listLoading: false,
	                currentPage: 1,
	                currPage: 1,
	                total: 0,
	                pageSize: 10,
					showHeader: false
				},
				activeName: '',
				activeClassify: '',
				isUpdate: true,
				delVisible: false,
				addData:{},
				activityId:0,
				id:0,
				dialogVisible:false,
				validate:{
					changeDiscount:(rule, value, callback) => {
						let item = rule.item
						let sum = 0
						if(item){
							let type = item.type
							let items = item.items
							if(type==3){
								items.forEach(function(val){
									sum += val.num * val.price
								})
								if(value>=sum){
									callback(new Error('输入优惠金额需大于0且小于销售价总和'));
								}
							}
							if(type==2){
								if(value<=0 || value>100){
									callback(new Error('折扣率需大于0小于等于100'));
								}
							}
							if(value<0){
								callback(new Error('不能为负数'));
							}
						}
						callback();
					}
				},
			}
		},
		computed:{
			isView(){
				var matched = this.$router.currentRoute.matched;
				var list = matched[matched.length-2].path+'/list';
				var ar = Permission.button(list, this.$router.options.routes)||[];
				return !(ar.indexOf('bt-edit')>-1 && this.isUpdate);
			}
		},
		methods:{
			addGroup(){
				let product = {
					items: [],
					type: 1,
					value: '',
					popVisible: false
				}
				this.form.tableData = [].concat(this.form.tableData, product);
			},
			importGoods(){
				this.bus.$emit('import',{flag:true, sels:''});	
			},
			addGoods(item, index, table){
				let self = this;
				let arr = []
				this.bus.$once('index/add/table/submit', function(sels){
					sels.forEach(sub=>{
						sub.name = sub.goodsName
						sub.price = sub.salePrice
						sub.num = Number(sub.storeCount) || 1
						item.items.forEach(function(val){
							if(val.bn==sub.bn){
								arr.push(val.bn)
							}
						})
					})
					arr.forEach(function(bn){
						for(let i=0; i<sels.length; i++){
							if(bn == sels[i].bn){
								sels.splice(i,1)
								continue;
							}
						}
					})
					if(sels.length&&sels.length>0){
						item.items = item.items.concat(sels)
					}
				});
				this.bus.$emit('add', {flag:true, sels:item.items, shopIds: this.addData?this.addData.shopIds:[]});	
			},
			changePrice(row,index, table, i){
				table[index].items[i] = row
				//this.form.tableData  = table
				this.form.tableData = [].concat(table);
			},
			delGroup(item, index, table){
				var self = this;
				if(table.length<=1){
					this.dialogVisible = true
					return
				}
				this.$confirm('确定删除这条数据么?',{type:'warning'}).then((res)=>{
					if(res){
						table.splice(index, 1);
					}
				}).catch(() => {});
			},
			delGoods(row, index, table){
				var self = this;
				this.$confirm('确定删除这条数据么?',{type:'warning'}).then((res)=>{
					if(res){
						table.splice(index, 1);
					}
				}).catch(() => {});
			},
			getKey(row){
				return row.goodsid;
			},
			historyBack(){
				let self = this;
				sessionStorage.setItem('active-set', JSON.stringify(self.$data.form));
				if(this.id){
					this.$router.push({path:'/marketing-management/promotions/combind/@add', query:{id:this.id}});
				}else{
					this.$router.push({path:'/marketing-management/promotions/combind/@add'});
				}
			},
			submitForm(formName) {
				let selectPro = true
				let url = ''
				let rules = []
				let params = {}
				let activityTimeIntervals = []
				this.addData.activityTimeIntervals.forEach(function(time){
					let timeInterval = {}
					timeInterval.effectStartTime = time.effectStartTime
					timeInterval.effectEndTime = time.effectEndTime
					activityTimeIntervals.push(timeInterval)
				})
				let activity = {
					activityTimeIntervals:activityTimeIntervals,
					channel:this.addData.channel||[],
					enable:this.addData.enable,
					info:this.addData.info,
					name:this.addData.name,
					shopIds:this.addData.shopIds||[],
					toolCode:this.addData.toolCode,
					toolId:this.addData.toolId,
					userGrades:this.addData.userGrades||[]
				}

				this.form.tableData.forEach(function(rule) {
					let obj = {}
					obj.items = []
					if(!rule.items||rule.items.length<1){
						selectPro = false
					}
					rule.items.forEach(function(v){
						let val = {
							bn: v.bn,
							cost:v.cost,
							goodsName:v.goodsName,
							num:v.num,
							price:v.price
						}
						obj.items.push(val)
					})
					obj.type = rule.type
					obj.value = rule.value
					rules.push(obj)
				});
				params.rules = rules

				if(!selectPro){
					this.$message.error('未选择商品，无法创建活动')
					return
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if(this.id){
							url = this.$apiUrl.marketing.updateActive
							activity.activityId = this.activityId
							activity.id = this.id
						}else{
							url = this.$apiUrl.marketing.addActive
						}
						let opts = {
							activity: JSON.stringify(activity),
							params:JSON.stringify(params),
							saveRedisTable:false
						}
						this.$ajax.post(url, opts).then(res =>
						{
							if(res.error){
								this.$message.error(res.msg)
								return
							}
							if(this.id){
								this.$message({
									message: '组合促销活动更新成功',
									type: 'success',
									duration:3000
								})
							}else{
								this.$message({
									message: '组合促销活动创建成功',
									type: 'success',
									duration:3000
								});
							}
							this.$router.push('/marketing-management/promotions/combind/list');
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			dataFilter(item){
				if(typeof(item.value) == 'number'){
					if(item.type==1){
						item.value = parseFloat(item.value).toFixed(2);
					}
				}
			}
		},
		mounted(){
			let self = this
			this.addData = JSON.parse(sessionStorage.getItem('active-add'));
			if(this.addData){
				self.activeName = this.addData.name;
			}

			self.form.listLoading = true;
			if(sessionStorage.getItem('active-set')){
				self.$data.form = JSON.parse(sessionStorage.getItem('active-set'));
				self.form.listLoading = false;
			}

			if(this.$route.query){
				this.id = this.$route.query.id
			}
			if(this.id){
				this.$ajax.post(this.$apiUrl.marketing.getActiveInfo, {id:this.id, saveRedisTable:false}).then(res =>
				{
					if(res.error){
						this.$message.error(res.msg)
						return
					}
					res.data.params.rules.forEach(function(v){
						v.type = parseInt(v.type)
					})
					this.form.tableData = res.data.params.rules;
					this.isUpdate = res.data.params.isUpdate;
					if(!this.form.tableData.length&&this.form.tableData.length<1){
						this.addGroup()
					}
					this.activityId = res.data.activity.activityId
					this.id = res.data.activity.id
				});
			}else{
				if(!this.form.tableData.length&&this.form.tableData.length<1){
					this.addGroup()
				}
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
	.mod-box{
		background-color: #fff;
		padding: 20px;
		margin-bottom: 20px;
		.desc-price{
			line-height: 30px;
			color: #5bc7a3;
			span{
				margin-right: 20px;
			}
		}
		.desc{
			margin-bottom: 20px;
		}
	}
	.mod-list{
		border: 1px solid #f3f5f7;
		border-bottom: none;
		.mod-item{
			height: 50px;
			line-height: 40px;
			border-bottom: 1px solid #f5f5f5;
			font-size: 14px;
			color: #333;
			padding: 5px 20px;
			.item-goods{
				span{
					width: 200px;
				}
			}
			.del{
				margin: 7px 0 0 20px;
				line-height: 38px;
			}
		}
	}
	.mod-mode{
		margin-top: 20px;
		.mode-desc{
			line-height: 38px;
			margin-left: 10px;
		}
	}
</style>
<style lang="scss" scoped>
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
