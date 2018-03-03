<template>
	<el-dialog
        title="导入店铺"
        class="mod-pop"
		size="small"
        :visible.sync="dialogfileImportVisible"
        :before-close="handleClose">
			<el-form :rules="rules" ref="ruleForm" :model="formInline">
				<el-form-item prop="fileName"
					v-loading="uploadLoading"
					element-loading-text="上传解析中">
					<el-upload
					v-if="!uploadOk"
					class="upload-demo"
					ref="upload"
					:action="$apiUrl.complementedImport"
					:with-credentials="true"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
					:on-change="uploadChange"
					:show-file-list="false"
					:auto-upload="false"
					>
					<el-input slot="trigger" class="input-area" v-model="formInline.fileName"  placeholder="点击选择文件" icon="search"></el-input>
					<div slot="tip" class="el-upload__tip">注意：excel文件词放在第一列，不超过5000条，单个词长度超过10会自动忽略</div>
					</el-upload>
					<el-button v-if="!uploadOk" type="primary" @click="upload('ruleForm')">上传</el-button>
					<div class="upload" v-if="uploadOk">
					<i class="el-icon-check"></i>
					<span>上传成功！</span>
					<a herf="javascript:;" @click="uploadOk = false">继续上传</a>
					</div>
					<a v-if="!uploadOk" :href="$apiUrl.templete" class="download-mod">下载模板</a>
				</el-form-item>
			</el-form>
		</el-dialog>
</template>
<script>
	export default {
		props:['bus'],
		data(){
			return {
				formInline:{
					value:"",
					fileName:''
				},
				dialogfileImportVisible:false,
				uploadOk:false,
				listLoading:false,
				currentPage: 1,
				pageSize:20,
				tableData: [],
				total: 0,
				rules:{
					fileName:[
						{ required: true, message: '请上传文件', trigger: 'change' }
					],
				},
				selectionId:[],
				uploadLoading:false,
			}
		},
		methods:{
			fileImport(){
				this.dialogfileImportVisible = true;
			},
			//导入弹窗关闭
			handleClose(done) {
				this.$refs['ruleForm'].resetFields();
				this.uploadLoading = false;
				done();
				this.shopData = false;
				this.getData();
			},
			//上传成功回调
			handleAvatarSuccess(res, file) {
				this.uploadLoading = false;
				if (res.error !== 0) {
					this.$message({
					message: res.msg,
					type: 'error'
					});
					return false;
				}else{
					this.uploadOk = true;
					this.formInline.fileName = "";
					this.bus.$emit('importShop/submit', {shopIds:res.data.shopIds});
				}
			},
			//上传失败回调
			handleAvatarError(err, file){
				this.uploadLoading = false;
				this.formInline.fileName = "";
				this.$message({
					message: "上传失败，请重试！",
					type: 'error'
				});
			},
			//文件上传限制
			beforeAvatarUpload(file) {
				console.log(file);
				const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
				const isXls = file.type === 'application/vnd.ms-excel';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isXlsx && !isXls) {
				this.$message.error('上传文件只能是 xls/xlsx格式！');
				}
				if (!isLt2M) {
				this.$message.error('上传文件大小不能超过 2MB!');
				}
				return (isXlsx || isXls) && isLt2M;
			},
			uploadChange(file){
				this.formInline.fileName = file.name;
			},
			upload(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.uploadLoading = true;
						this.$refs.upload.submit();
					} else {
						return false;
					}
				});
			}
		},
		mounted(){
			var self = this;
			self.bus.$on('importShop/dialog', function(obj){
				console.log("busON");
				self.fileImport();
			})
		}
	}
</script>
<style scoped lang="scss">
.el-dialog{
	width: 462px;
}
.mod-pop{
	.input-area{
		display: inline-block;
		width: 344px;
	}
	.el-button{
		margin-left: 10px;
		position: absolute;
		top:0;
		right:0;
	}
	a{
		color:#20a0ff;
	}
}
.add-btn{
	background-color: #33bbab;
	color:#fff;
	border-color:#33bbab
}
.upload{
	text-align: center;
	font-size:16px;
	color:#48576a;
	i{
		display: inline-block;
		width:22px;
		height: 22px;
		line-height: 24px;
		font-size:10px;
		border-radius:50%;
		background-color: #20a0ff;
		color:#fff;
	}
	span{
		// color:#20a0ff;
	}
	a:hover{
		text-decoration: underline;
		cursor: pointer;
	}
	.el-button{
		position: relative;
	}
}
</style>