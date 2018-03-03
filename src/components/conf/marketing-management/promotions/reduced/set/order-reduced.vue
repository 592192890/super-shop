<template>
	<!-- 满额立减 begin -->
	<div class="mod-block mod-set">
		<div :class="isView?'block-mask':''">
			<div class="mod-search mod-search-list">
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
			<el-form label-width="0px"  class="mod-offer-content" ref="form" :model="form">
				<div class="degree">
					<el-button @click="addXyPrice" :disabled="form.rule.items.length==5||form.rule.isOverlying">添加层级</el-button>
					<span class="error-msg">最多添加5个层级</span>
				</div>
				<el-form-item v-for="(item, index) in form.rule.items" :key="index" class="mod-item" v-if="!(index!=0 && form.rule.isOverlying)">
					<div class="text f-l">满</div>
					<div class="f-l" style="width: 100px">
						<el-form-item :prop="'rule.items.' + index + '.value'" :rules="[{validator: $validate.required}, {validator: $validate.positiveFloat}]">
							<el-input v-model.number="item.value" class="num-box" @blur="formatPrevPrice(item)"></el-input>
						</el-form-item>
					</div>
					<div class="text f-l">元减</div>
					<div class="f-l" style="width: 100px">
						<el-form-item :prop="'rule.items.' + index + '.mljValue'" :rules="[
							{validator: $validate.required}, {validator: $validate.positiveFloat}, {validator: $validate.compare, max:item.value, message:'必须小于前面的价格'}
							]">
							<el-input v-model.number="item.mljValue" class="num-box" @blur="formatPrice(item)"></el-input>
						</el-form-item>
					</div>
					<div class="text f-l">元</div>
					<div class="f-l" v-if="index==0" style="margin-left:70px;">
						<div class="f-l" >
							<el-checkbox v-model="form.rule.isOverlying">叠加满减</el-checkbox>
						</div>
						<div class="f-l" style="margin-left:70px;" v-if="form.rule.isOverlying">
							<div class="text f-l">最高减</div>	
							<div class="f-l" style="width: 100px">
								<el-form-item :prop="'highestMljValue'" :rules="[{validator: $validate.positiveFloat}]">
									<el-input v-model.number="form.rule.highestMljValue" @blur="formatMaxReduction"></el-input>
								</el-form-item>
							</div>
							<div class="text f-l">元</div>
						</div>
					</div>
					<div class="text f-r">
						<el-button type="text" class="num-box" v-if="index!=0" @click="delXyPrice(index)">删除</el-button>
					</div>
				</el-form-item>
				<div class="error-msg" v-if="!form.rule.isOverlying">{{ xyPriceErrorMsg }}</div>
			</el-form>
		</div>
		<el-col :span="24" class="mod-toolbar">
			<el-button type="primary" @click="onSubmit" :disabled="form.rule.items.length==0" v-if="!isView">提交活动</el-button>
			<el-button @click="onCancel">返回上一步</el-button>
		</el-col>
	</div>
	<!-- 满额立减 end -->
</template>
<style lang="scss" scoped>
	.mod-block{
		background: none;
		padding: 0 30px 0 30px;
	}
	.mod-search{
		background-color: #fff;
		padding: 20px;
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
	.mod-offer-content {
		overflow:hidden;
		.error-msg {
			color:red;
		}
		.text {
			line-height:38px;	
			text-align:center;
			margin:0px 5px;
		}	
		.degree {
			padding:20px 0px 20px;	
			border-top:1px solid #f3f5f7;
		}	
		.mod-item {
			background:#fcfcfc;	
			border-radius:4px;
			padding:25px 30px;
			margin-bottom:10px;
		}
	}
</style>
<script>
	import Permission from '@/assets/js/permission-util.js';
	export default {
		props:['popData'],
		data(){
			return{
				select:{
					activeType: [{},{
						label: '商品满减',
						value: '1'
					}, {
						label: '订单满减',
						value: '2'
					}],
				},
				xyPriceErrorMsg:'',
				form:{
					rule: {
						highestMljValue:'',
						isOverlying:false,
						items:[{value:'', mljValue:''}]
					},
					isUpdate: true
				},
				id:this.$route.query.id||'',
				activeType:'1',
				activity: '',
				actName: '',
				actTypeName: ''
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
			vXyPrice(){
				if(this.form.rule.isOverlying){
					return true;	
				}
				var flag = true;
				var ar = this.form.rule.items;
				var self = this;
				self.xyPriceErrorMsg = ''; 
				for(var i=0;i<ar.length;i++){
					let item = ar[i];	
					let index = i;
					if(ar.length>1 && index>0){
						let prev = ar[index-1];	
						if((prev.value>item.value)||(prev.mljValue>item.mljValue)){
							flag = false;
							self.xyPriceErrorMsg = '第'+(index+1)+'行数据错误,价格应递增';
							break;
						}
					}
				}
				return flag;
			},
			formatPrevPrice(item){
				item.value = Number(parseFloat(item.value).toFixed(2));	
			},
			formatPrice(item){
				item.mljValue = Number(parseFloat(item.mljValue).toFixed(2));	
			},
			formatMaxReduction(){
				if(this.form.rule.highestMljValue!='' && /^\d+(\.\d+)?$/.test(this.form.rule.highestMljValue)){
					this.form.rule.highestMljValue = parseFloat(this.form.rule.highestMljValue).toFixed(2);	
				}
			},
			delXyPrice(index){
				this.$confirm('确定删除这条数据么?',{type:'warning'}).then((res)=>{
					if(res){
						if(this.form.rule.items.length!=1){
							this.form.rule.items.splice(index, 1);	
							this.xyPriceErrorMsg = '';
						}
					}
				}).catch(() => {});;
			},
			delAr(ar){
				if(ar.length>0){
					for(var i=1;i<ar.length;i++){
						ar.splice(i, 1);	
					}	
				}	
			},
			addXyPrice(){
				if(this.form.rule.items.length<5){
					this.$refs['form'].validate((valid) => {
						if(valid && this.vXyPrice() && !this.form.rule.isOverlying){
							this.form.rule.items.push({value:'', mljValue:'', _v:false});	
						}
					});
				}
			},
			onCancel(){
				this.$router.go(-1);	
			},
			onSubmit(){
				let url = ''
				let rule = {}
				
				this.$refs['form'].validate((valid) => {
					if(valid && this.vXyPrice()){
						if(this.form.rule.isOverlying){
							this.delAr(this.form.rule.items);
						}
						if(this.id){
							url = this.$apiUrl.marketing.updateActive
						}else{
							url = this.$apiUrl.marketing.addActive
						}
						let opts = {
							activity: sessionStorage.getItem('active-add'),
							params:JSON.stringify(this.form),
							saveRedisTable:false
						}
						this.$ajax.post(url, opts).then(res =>
						{
							if(res.error){
								this.$message.error(res.msg)
								return
							}
							this.$message.success('配置成功');
							this.$router.push('/marketing-management/promotions/reduced/list');
						});
					}
				});
			},
			//设置活动信息
			setActMsg(){
				this.activity = JSON.parse(sessionStorage.getItem('active-add'));
				if(this.activity){
					this.actName = this.activity.name;
					this.actTypeName = this.activity.actTypeName;
				}
			}
		},
		created(){
			let obj = {}
			if(this.$route.query){
				this.id = this.$route.query.id
			}
			this.setActMsg();
			// if(sessionStorage.getItem('active-add')){
			// 	this.form = Object.assign(this.form, JSON.parse(sessionStorage.getItem('active-add')));
			// }
			if(this.id && this.id.length!=0){
				this.$ajax.post(this.$apiUrl.marketing.getActiveInfo,{id:this.id,saveRedisTable:false}).then((res)=>{
					// this.form.items = res.data.params.rule.items
					// this.form.highestMljValue = res.data.params.rule.highestMljValue
					// this.form.isOverlying = res.data.params.rule.isOverlying
					this.form = Object.assign(this.form, res.data.params);
				});
			}
			
		}
	}
</script>
