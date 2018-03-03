<template>
	<div class="page-view" v-loading="listLoading" style="padding-bottom: 70px">
		<el-form :inline="true" :model="formInline" :rules="rules" class="demo-form-inline">
				<el-form-item label="门店id">
					<el-input v-model="formInline.storeName" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="所属部门">
					<el-select v-model="formInline.department" placeholder="请选择">
					<!-- <el-option v-for="(option,index) in options.option2" :label="option" :value="option" :key="option[0]"></el-option> -->
					<el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开始时间" prop="startDate">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.startDate"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="endDate">
					<el-date-picker type="datetime" placeholder="请选择" v-model="formInline.endDate"></el-date-picker>
				</el-form-item>
				<el-form-item label="活动状态">
					<el-select v-model="formInline.activeStatus" placeholder="请选择">
					<el-option v-for="(option,index) in options.option3" :label="option" :value="index" :key="option[0]"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动编码">
					<el-input v-model="formInline.activeCode" placeholder="请输入ID"></el-input>
				</el-form-item>
				<el-form-item label="活动名称">
					<el-input v-model="formInline.activeName" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item class="btn-area">
					<div class="reset-btn">
						<el-button size="large" @click="onReset">重置</el-button>
					</div>
					<div class="add-btn" v-if="addNewName">
						<el-button v-if="buttonArr.indexOf('bt-add')!=-1" class="add" size="large" @click="linkToAdd">{{addNewName}}</el-button>
					</div>
					<div class="search-btn">
						<el-button type="primary" size="large" @click="onSearch">搜索</el-button>
					</div>
				</el-form-item>
		</el-form>
		<!-- 列表 -->
		<el-table :data="tableData" style="width: 100%">
			<!-- <el-table-column type="index" width="60px"></el-table-column> -->
			<el-table-column label="活动名称" width="200px" :show-overflow-tooltip="true"> 
				<template scope="scope">
					<el-button class="first-col-btn" type="text" v-if="isBtnDisabledName[scope.$index] || !btnShow[0]" @click="view([scope.$index])">{{ scope.row.name }}</el-button>
					<el-button class="first-col-btn" type="text" v-if="!isBtnDisabledName[scope.$index] && btnShow[0]" @click="editor([scope.$index])">{{ scope.row.name }}</el-button>
				</template>
			</el-table-column>
			<el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]" :width="width[index]"></el-table-column>
			<el-table-column label="操作" v-if="tableData.length && operations" width="200px" fixed="right">
				<template scope="scope">
					<el-button type="text" v-if="btnShow[index]" :disabled="isBtnDisabled[scope.$index][index]" v-for="(operation,index) in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
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
	</div>
</template>

<script>
import Permission from '@/assets/js/permission-util.js';
export default {
    data() {
		//结束时间大于开始时间验证
        var validateEndDate = (rule, value, callback) => {
            if (this.formInline.startDate && this.formInline.endDate && (Date.parse(this.formInline.startDate)>=Date.parse(this.formInline.endDate))) {
                callback(new Error('时间需晚于起始时间'));
            }else{
                callback();
            }
		}
		//开始时间小于结束时间验证
        var validateStartDate = (rule, value, callback) => {
            if (this.formInline.startDate && this.formInline.endDate && (Date.parse(this.formInline.startDate)>=Date.parse(this.formInline.endDate))) {
                callback(new Error('时间需早于结束时间'));
            }else{
                callback();
            }
        }
		var param = {
			currentPage:1,	//当前页	number	
			department:"",	//所属部门(发券方)	string	
			effect:"",	//活动状态(0未发布，1已发布)	number	
			endTime:"",	//活动区段结束时间	number	
			issueId:"",	//发券活动编码	number	
			name:"",	//发券活动名称	string	
			pageSize:20,	//每页大小	number	
			shopId:"",	//门店id	number	
			startTime:"",	//活动区段开始时间	number
		};
		return {
			pageSize:20,
			btnShow:[],
			buttonArr:[],
			rules: {
                startDate: [
                    { validator: validateStartDate, trigger: 'change' }
                ],
                endDate: [
                    { validator: validateEndDate, trigger: 'change'}
                ],
            },
			departmentData:[],//全部业态
			param,
			formInline: {
				storeName: '',
				department: '',
				startDate: '',
				endDate: '',
				activeStatus: '',
				activeCode: '',
				activeName: '',
			},
			options: {
				option2: [
					"超市",
					"百货",
					"电器",
					"珠宝",
					"置业",
				],
				option3: [
					"未发布",
					"已发布",
				],
			},
			addNewName: '新增发券活动',
			labelPosition:"top",
			



			// 列表
			isBtnDisabled:[],//操作列按钮禁用
			isBtnDisabledName:[],//名称列按钮禁用
			listLoading:true,
			currentPage: 1,
			sels: [],
			tableData: [],
			page: 1,
			total: 0,
			lableNames: [
				// "活动名称",
				"活动编码",
				"所属部门",
				"开始时间",
				"结束时间",
				"活动状态",
				"已发数量",
				"状态"
			],//列表标题数组集合
			//列宽
			width:[
				// "200",
				"150",
				"100",
				"250",
				"250",
				"100",
				"100",
			],
			//请求响应参数名
			props: [
				// "name",
				"issueId",
				"departmentName",
				"startTime",
				"endTime",
				"status",
				"times",
				"effectName",
			],//请求响应参数数组集合
			operations: [
				"编辑",
				"删除",
				"发布"
			],//操作列，操作能力数组集合
			index:"",//当前操作的列表行索引，
		}
	},
	mounted()
	{
		this.buttonArr=Permission.button(this.$route.path,this.$router.options.routes);
		//获取当前所有业态
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
				currentPage:1,	//当前页	number	
				department:self.formInline.department,	//所属部门(发券方)	string	
				effect:self.formInline.activeStatus,	//活动状态(0未发布，1已发布)	number	
				endTime:Date.parse(self.formInline.endDate),	//活动区段结束时间	number	
				issueId:self.formInline.activeCode,	//发券活动编码	number	
				name:self.formInline.activeName,	//发券活动名称	string	
				pageSize:self.pageSize,	//每页大小	number	
				shopId:self.formInline.storeName,	//门店id	number	
				startTime:Date.parse(self.formInline.startDate),	//活动区段开始时间	number
			}
			self.getData();
		},
		linkToAdd(){
			sessionStorage.clear();
			this.$store.commit('mutationsReset');
			this.$router.push({name:'发券活动配置'});
		},
		onReset(){
			this.formInline.storeName = '';
			this.formInline.department = '';
			this.formInline.startDate = '';
			this.formInline.endDate = '';
			this.formInline.activeStatus = '';
			this.formInline.activeCode = '';
			this.formInline.activeName = '';
			this.onSearch();
		},
		handleSizeChange(val){
			this.pageSize = val;
			this.param.pageSize=this.pageSize;
			this.getData();
		},
/* 正式数据 */
		// // 列表
		handleCurrentChange(val)
		{
			this.param.currentPage = val;
			this.getData();
		},

		getData()
		{
			let self = this;
			self.currentPage = self.param.currentPage;
			self.listLoading = true;
			self.$ajax.post(self.$apiUrl.coupon.grantList,self.param
			).then((res) =>
			{
				if (res.error !== 0) {
					self.$message({
					message: res.msg,
					type: 'error'
				});
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
			this.isBtnDisabledName = [];
			var tableData = this.tableData;
			var length = tableData.length;

			for (var index = 0; index < length; index++) {
				var colData = tableData[index];
				var checkStatus = colData.effect;
				var able=[true,true,true];
				var disable=[false,false,false];
				if (checkStatus == 1) {
					this.isBtnDisabled.push(able);
					this.isBtnDisabledName.push(able[0]);
				}else{
					this.isBtnDisabled.push(disable);
					this.isBtnDisabledName.push(disable[0]);
				}
			}
			if (this.buttonArr.indexOf('bt-edit')!=-1) {
				this.btnShow.push(true);
			}else{
				this.btnShow.push(false);
			}
			if (this.buttonArr.indexOf('bt-delete')!=-1) {
				this.btnShow.push(true);
			}else{
				this.btnShow.push(false);
			}
			if (this.buttonArr.indexOf('bt-publish')!=-1) {
				this.btnShow.push(true);
			}else{
				this.btnShow.push(false);
			}
		},
		whichType(type,index)
		{
			var self = this;
			switch(type){
				case "编辑":
					self.editor(index);
					break;
				case "发布":
					self.statistics(index);
					break;
				case "删除":
					self.del(index);
					break;
			}
			
			},
		//发布
		statistics(index)
		{
			var self= this;
			self.$confirm('正式发布该活动, 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
			}).then(() => {
				//发送删除请求，重新渲染列表
				self.$ajax.post(
					self.$apiUrl.coupon.grantRelease,
				{
					id:self.tableData[index].id
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
						message: '发布成功!'
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
				message: '已取消发布'
			});          
			});

		},
		//编辑
		editor(index)
		{
			sessionStorage.clear();
			var id = this.tableData[index].id;
			this.$store.commit('mutationsToEditorEnter',id);
			// sessionStorage.setItem("isEditorEnter",true)
			this.$router.push({name:'发券活动配置'});
		},
		//删除
		del(index)
		{
			var self= this;
			self.$confirm('删除该条数据, 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
			}).then(() => {
				//发送删除请求，重新渲染列表
				self.$ajax.post(
					self.$apiUrl.coupon.grantDelete,
				{
					id:self.tableData[index].id
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
						message: '删除成功!',
						type: 'success'
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
				message: '已取消删除'
			});          
			});
		},

		//查看详情
		view(index){
			sessionStorage.clear();
			var id = this.tableData[index].id;
			this.$store.commit('mutationsToEditorEnter',id);
			sessionStorage.setItem("isView",true)
			this.$router.push({name:'发券活动配置'});
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
		// margin:0 20px 22px;
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
.btn-area{
    // position: absolute;
	display: block;
	width: 300px!important;
	z-index: 0;
	// float: right;
    // right:0;
    // bottom:0;
	margin-bottom:0;
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
.first-col-btn{
	color:#666;
}
</style>
