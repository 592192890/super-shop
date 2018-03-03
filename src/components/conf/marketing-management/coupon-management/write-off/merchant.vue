<template>
	<div class="page-view" v-loading="listLoading" style="padding-bottom: 70px">
		<el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
				<el-form-item label="优惠券名称">
					<el-input v-model="formInline.cpnsName" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="业态">
					<el-select v-model="formInline.department" placeholder="选择业态">
					<el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="option[0]"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="门店ID">
					<el-input class="stroe-input" v-model="formInline.shopId" placeholder="请输入Id"></el-input><el-button @click="dialogSelectStroe">选择门店</el-button>
				</el-form-item>
				<el-form-item label="优惠券状态">
					<el-select v-model="formInline.statusExt" placeholder="选择状态">
					<el-option v-for="(option,index) in options.option4" :label="option" :value="index" :key="option[0]"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="优惠券编码">
					<el-input v-model="formInline.cpnsId" placeholder="请输入编码"></el-input>
				</el-form-item>
				<el-form-item label="领取时间" class="pick-time">
					<el-form-item class="inline" prop="receiveStartTime">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.receiveStartTime"></el-date-picker>
					</el-form-item>					
					<span class="line">-</span>
					<el-form-item class="inline" prop="receiveEndTime">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.receiveEndTime"></el-date-picker>
					</el-form-item>					
				</el-form-item>
				<el-form-item label="兑换时间" class="pick-time">
					<el-form-item class="inline" prop="exchangeStartTime">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.exchangeStartTime"></el-date-picker>
					</el-form-item>
					<span class="line">-</span>
					<el-form-item class="inline" prop="exchangeEndTime">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.exchangeEndTime"></el-date-picker>
					</el-form-item>
				</el-form-item>
				<el-form-item class="btn-area">
					<div class="reset-btn">
						<el-button size="large" @click="onReset">重置</el-button>
					</div>
					<div class="add-btn" v-if="addNewName">
						<el-button class="add" size="large" @click="linkToAdd">{{addNewName}}</el-button>
					</div>
					<div class="search-btn">
						<el-button type="primary" size="large" @click="onSearch">搜索</el-button>
					</div>
				</el-form-item>
		</el-form>
		<!-- 列表 -->
		<el-table :data="tableData" style="width: 100%">
			<!-- <el-table-column type="selection" width="60px"></el-table-column> -->
			<el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]" :width="width[index]" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column label="操作" v-if="tableData.length && operations" width="200px" fixed="right">
				<template scope="scope">
					<el-button type="text" :disabled="isBtnDisabled[scope.$index]" v-for="operation in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="mod-toolbar">
			<!-- <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
			:page-size="20" :total="total" style="float:right;" :current-page="currentPage">
			</el-pagination> -->
			<el-pagination
			style="float:right;"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10, 20, 30, 40]"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total">
			</el-pagination>
		</el-col>


		<!-- 选择店铺弹窗 -->
		<el-dialog
		title="选择店铺"
		:visible.sync="dialogStroeVisible"
		size="large"
		:before-close="handleClose">
			<!-- 表单 -->
			<el-form :inline="true" :model="formStroe" class="demo-form-inline" label-position="left">
				<el-form-item label="店铺名称">
					<el-input class="shop-name" v-model="formStroe.shopName" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="店铺编码">
					<el-input class="shop-name" v-model="formStroe.shopId" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="业态">
					<el-select v-model="formStroe.department" placeholder="请选择业态">
						<el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="btn-area">
					<div class="reset-btn">
						<el-button size="large" @click="onStroeReset">重置</el-button>
					</div>
					<div class="search-btn">
						<el-button type="primary" size="large" @click="onStroeSearch">搜索</el-button>
					</div>
				</el-form-item>
			</el-form>
			<!-- 列表 -->
			<el-table :data="stroeTableData" style="width: 100%" ref="elTable" v-loading="listLoading" @select="handleSelectionChange">
				<el-table-column type="selection" width="60px"></el-table-column>
				<el-table-column v-for="(label,index) in stroeLableNames" :key="index" :label="label" :prop="stroeProps[index]" :width="width[index]"></el-table-column>
			</el-table>
			<el-col :span="24" class="mod-toolbar">
				<el-pagination layout="prev, pager, next" @current-change="stroeHandleCurrentChange"
				:total="stroeTotal" style="float:right;" :current-page="stroeCurrentPage">
				</el-pagination>
			</el-col>
			<div slot="footer" class="dialog-footer">
				<el-button @click="chooseStroeClose">取 消</el-button>
				<el-button type="primary" @click="chooseStroeSubmit">提交</el-button>
			</div>
		</el-dialog>


	</div>
</template>

<script>
export default {
    data() {
		//领取结束时间大于开始时间验证
        var receiveEndTime = (rule, value, callback) => {
            if (this.formInline.receiveStartTime && this.formInline.receiveEndTime && (Date.parse(this.formInline.receiveStartTime)>=Date.parse(this.formInline.receiveEndTime))) {
                callback(new Error('时间需晚于起始时间'));
            }else{
                callback();
            }
		}
		//领取开始时间小于结束时间验证
        var receiveStartTime = (rule, value, callback) => {
            if (this.formInline.receiveStartTime && this.formInline.receiveEndTime && (Date.parse(this.formInline.receiveStartTime)>=Date.parse(this.formInline.receiveEndTime))) {
                callback(new Error('时间需早于结束时间'));
            }else{
                callback();
            }
		}
		//兑换结束时间大于开始时间验证
        var exchangeEndTime = (rule, value, callback) => {
            if (this.formInline.exchangeStartTime && this.formInline.exchangeEndTime && (Date.parse(this.formInline.exchangeStartTime)>=Date.parse(this.formInline.exchangeEndTime))) {
                callback(new Error('时间需晚于起始时间'));
            }else{
                callback();
            }
		}
		//兑换开始时间小于结束时间验证
        var exchangeStartTime = (rule, value, callback) => {
            if (this.formInline.exchangeStartTime && this.formInline.exchangeEndTime && (Date.parse(this.formInline.exchangeStartTime)>=Date.parse(this.formInline.exchangeEndTime))) {
                callback(new Error('时间需早于结束时间'));
            }else{
                callback();
            }
        }
		//列表请求参数
		var param={
			couponCode:"",	//优惠券编码	number	
			cpnsName:"",		//优惠券名称	string	
			currentPage:1,		//当前页	number	默认为1
			department:"",		//业态	string	
			exchangeEndTime:"",		//兑换结束时间	number	
			exchangeStartTime:"",		//兑换开始时间	number	
			pageSize:20,		//每页条数	number	默认为20
			receiveEndTime:"",		//领取结束时间	number	
			receiveStartTime:"",		//领取开始时间	number	
			shopId:"",	//店铺id
			statusExt:"",		//状态	number	0进行中, 1过期
		};
		return {
			pageSize:20,
			rules: {
                receiveStartTime: [
                    { validator: receiveStartTime, trigger: 'change' }
                ],
                receiveEndTime: [
                    { validator: receiveEndTime, trigger: 'change'}
				],
				exchangeStartTime: [
                    { validator: exchangeStartTime, trigger: 'change' }
                ],
                exchangeEndTime: [
                    { validator: exchangeEndTime, trigger: 'change'}
                ],
            },
		  	param,
			formInline: {
				cpnsName: '',
				department: '',
				shopId: '',
				statusExt: '',
				cpnsId: '',
				receiveStartTime: '',
				receiveEndTime: '',
				exchangeStartTime: '',
				exchangeEndTime: '',
			},
			options: {
				option1: "",
				option2: [
					"超市",
					"百货",
					"家电",
					"母婴",
				],
				option3: "",
				option4: [
					"进行中",
					"已过期",
				],
				option5: "",
			},
			addNewName: '',
			labelPosition:"top",
		



			// 列表
			isBtnDisabled:[],
			listLoading:true,
			currentPage: 1,
			sels: [],
			tableData: [],
			page: 1,
			total: 0,
			departmentData:[],
			lableNames: [
				"优惠券名称",
				"优惠券编码",
				// "兑换码",
				"业态",
				"发放会员",
				"优惠券状态",
				"使用门店",
				"发放时间",
				"兑换时间",
			],//列表标题数组集合
			//列宽
			width:[
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
				"200",
			],
			//请求响应参数名
			props: [
				"cpnsName",
				"code",
				"departmentName",
				"mobile",
				"statusExt",
				"shopName",
				"createTime",
				"useTime",
			],//请求响应参数数组集合
			operations: ["兑换"],//操作列，操作能力数组集合
			index:"",//当前操作的列表行索引，



			//门店
			dialogStroeVisible:false,
			stroeTableData:[],
			//弹窗表单
            formStroe:{
                shopName:'',
                shopId:'',
                department:''
            },
			stroeProps: [
				"shopMdCode",
                "shopName",
                "id",
				"businessTypeName",
			],//请求响应参数数组集合
			stroeLableNames:[
				"店铺编码",
                "店铺名称",
                "店铺ID",
				"业态",
			],
			stroeCurrentPage:1,
			stroeTotal:0,
			newChosenStroeId:[],
			hasChosenStroeId:[],
		}
		
	},
	mounted()
	{
		//获取当前所有业务线
		this.$ajax.post(this.$apiUrl.allType
		).then((res) =>
		{
			if (res.error !== 0) {
				this.$message({
				message: res.msg,
				type: 'error'
				});
			}
			var data = res.data;
			for (var index = 0; index < data.length; index++) {
				this.departmentData.push(data[index])                 
			}
		})
		this.getData();
	},
	methods: {
        onSearch() {
			var self = this;
			self.param = {
				couponCode:parseInt(self.formInline.cpnsId),	//优惠券id	number	
				cpnsName:self.formInline.cpnsName,		//优惠券名称	string	
				currentPage:1,		//当前页	number	默认为1
				department:self.formInline.department,		//业态	string	
				exchangeEndTime:Date.parse(self.formInline.exchangeEndTime),		//兑换结束时间	number	
				exchangeStartTime:Date.parse(self.formInline.exchangeStartTime),		//兑换开始时间	number	
				pageSize:self.pageSize,		//每页条数	number	默认为20
				receiveEndTime:Date.parse(self.formInline.receiveEndTime),		//领取结束时间	number	
				receiveStartTime:Date.parse(self.formInline.receiveStartTime),		//领取开始时间	number	
				shopId:parseInt(self.formInline.shopId),//门店id
				statusExt:self.formInline.statusExt,		//状态	number	0进行中, 1过期
			}
			self.getData();
		},
		linkToAdd(){
			this.$router.push({name:'新增优惠券定义'});
		},
		onReset(){
			this.formInline.cpnsName = '';
			this.formInline.department = '';
			this.formInline.shopId = '';
			this.formInline.statusExt = '';
			this.formInline.cpnsId = '';
			this.formInline.receiveStartTime = '';
			this.formInline.receiveEndTime = '';
			this.formInline.exchangeStartTime = '';
			this.formInline.exchangeEndTime = '';
			this.onSearch();
		},

		handleSizeChange(val){
			this.pageSize = val;
			this.param.pageSize=this.pageSize;
			this.getData();
		},
		// 列表
		handleCurrentChange(val)
		{
			// this.page = val;
			this.param.currentPage = val;
			this.getData();
		},
		getData()
		{
			let self = this;
			self.currentPage = self.param.currentPage;
			self.listLoading = true;
			self.$ajax.post(self.$apiUrl.coupon.business,self.param
			).then((res) =>
			{
				if (res.error !== 0) {
					self.$message({
					message: res.msg,
					type: 'error'
					});
					return false;
				}
				self.total = res.data.totalCount;
				self.tableData = res.data.list;
				self.listLoading = false;
				self.forbidHandle();
			})
		},
		//判断审核状态，已发布禁用“编辑”“发布”功能
		forbidHandle()
		{	
			this.isBtnDisabled = [];//翻页即清空栈数据
			var tableData = this.tableData;
			var length = tableData.length;

			for (var index = 0; index < length; index++) {
				var colData = tableData[index];
				var checkStatus = colData.useStatus;
				if (checkStatus == 1) {
					this.isBtnDisabled.push(false);
				}else{
					this.isBtnDisabled.push(true);
				}
			}
		},
		whichType(type,index)
		{
			var self = this;
			if (type == "兑换") {
				self.exchange(index);
			}		
		},
		//兑换
		exchange(index){
			var self= this;
			self.$confirm('兑换优惠券, 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
			}).then(() => {
				//发送兑换请求，重新渲染列表
				self.$ajax.post(
					self.$apiUrl.coupon.exchange,
				{
					code:self.tableData[index].code
				}).then((res) =>
				{
					if (res.error !== 0) {
						self.$message({
						message: res.msg,
						type: 'error'
						});
						return false;
					}
					self.getData();
					self.$message({
						type: 'success',
						message: '兑换成功!'
					});
				}).catch((res)=>{
					self.$message({
						message: res.msg,
						type: 'error'
					});
				});
			}).catch(() => {
			self.$message({
				type: 'info',
				message: '已取消兑换'
			});          
			});
		},


		//门店
		//选择店铺弹窗
        dialogSelectStroe(index){
            this.dialogStroeVisible = true;
            this.getStroeData();
        },
        //选择门店弹框关闭回调
        handleClose(done) {
            if (this.hasChosenStroeId.length) {//如果之前已经存有门店数据
                this.stroeId = [];
                sessionStorage.setItem("stroeId",JSON.stringify(this.hasChosenStroeId));
                this.stroeId = JSON.parse(sessionStorage.getItem("stroeId")); //stroeId重置为已存有的数据
                sessionStorage.removeItem("stroeId");
            }else{
                this.stroeId = [];
            }            
            this.formStroe.shopName='';
            this.formStroe.shopId='';
            this.formStroe.department=''
            done();
        },
        //店铺弹窗返回
        chooseStroeClose(){
            this.dialogStroeVisible = false;
            if (this.hasChosenStroeId.length) {//如果之前已经存有门店数据
                this.stroeId = [];
                sessionStorage.setItem("stroeId",JSON.stringify(this.hasChosenStroeId));
                this.stroeId = JSON.parse(sessionStorage.getItem("stroeId")); //stroeId重置为已存有的数据
                sessionStorage.removeItem("stroeId");
            }else{
                this.stroeId = [];
            }
            this.formStroe.shopName='';
            this.formStroe.shopId='';
            this.formStroe.department=''
        },
        // 列表
        onStroeSearch() {
            this.getStroeData();
        },
        onStroeReset(){
			this.formStroe.department = "",
            this.formStroe.shopName="",
            this.formStroe.shopId="",
			this.getStroeData();
		},
        //翻页
		stroeHandleCurrentChange(val)
		{
            this.stroeCurrentPage = val;
            this.getStroeData();
        },
		//选中某列
        handleSelectionChange(data,index)
        {   
            this.newChosenStroeId= [];     
            for (var index = 0; index < data.length; index++) {
                this.newChosenStroeId.push(data[index].id);
            }

        },
        //提交
        chooseStroeSubmit()
        {
            if (this.newChosenStroeId.length>1) {
                this.$message({
					message: "只能选择一个门店",
					type: 'error'
                });
                return false;
            }
            this.dialogStroeVisible = false;
            for (var index = 0; index < this.newChosenStroeId.length; index++) {
                // this.hasChosenStroeNames.push(this.newChosenStroeNames[index]);
                // this.hasChosenStroeNames.splice(0,1,this.newChosenStroeNames[index]);
                this.hasChosenStroeId.splice(0,1,this.newChosenStroeId[index])
            }
			this.formStroe.shopName='';
            this.formStroe.shopId='';
            this.formStroe.department='';
			this.formInline.shopId = this.hasChosenStroeId[0]
        },
        //请求列表数据
		getStroeData()
		{
            let self = this;
            var param = {
                businessTypeCode:this.formStroe.department,
                shopName:this.formStroe.shopName,
                shopMdCode:this.formStroe.shopId,
                currentPage:1,
                pageSize:10,
            }

			param.currentPage = self.stroeCurrentPage;
			self.listLoading = true;
			self.$ajax.post(this.$apiUrl.shopSearch,param
			).then((res) =>
			{
				self.stroeTotal = res.data.totalRow;
				self.stroeTableData = res.data.list;
                self.listLoading = false;
                // self.selectedOption(self.stroeId);
			});
        },


    }
}
</script>
<style lang="scss" scoped>
.el-form{
	position: relative;
	background-color: #fff;
	padding: 20px 20px;
	margin-bottom: 20px;
	.el-form-item{
		text-align: right;
		width: 320px;
		.el-input{
			width: 213px;
		}
		.el-select{
			width: 213px;
		}
	}
}
.add-new{
	height:100px;
	line-height: 100px;
}
// .search-btn{
//     position: absolute;
//     right:140px;
//     bottom:0;
// }
.pick-time{
	width: 546px!important;
}
.btn-area{
	display: block;
	width: 180px!important;
	z-index: 0;
	margin-bottom: 0;
	.search-btn{
		float: right;
	}
	.reset-btn{
		float: right;
		margin-left: 8px;
	}
	.add-btn{
		float: right;
		margin-left: 8px;
		.add{
			background-color: #52cfaa;
			color:#fff;
			border-color: #fff;
			&:hover,&:active{
				opacity: .8;
			}
		}
	}
}
.inline{
	display: inline-block;
	width:auto!important;
	margin-right: 0;
}
.stroe-input{
	width: 125px!important;
}
</style>

