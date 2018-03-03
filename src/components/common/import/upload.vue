<template>
	<el-form ref="popForm" :model="popForm" label-width="100px" class="mod-upload" >
		<el-form-item label="选择文件:">
			<el-upload
				ref="upload"
				with-credentials="true"
				:action="(popData.url || 'http://shopmanage.yunhou.com/api/Active/import_excel')"
				:data="uploadOpt"
				:auto-upload="false"
				:on-change="onChange"
				:on-remove="onRemove"
				:on-success="onSuccess"
				:on-error="onError"
				accept=".xls,.xlsx"
				:with-credentials="true"
				>
				<el-button slot="trigger" size="small" type="success" @click="selectFile">选择文件</el-button>
				<div class="el-upload__tip" slot="tip">请上传xlsx, xls格式文件,大小不超过20Mb.</div>
			</el-upload>
			<div class="el-form-item__error">{{ errorMsg }}</div>
			<div class="el-form-item__error">{{ uploadErrorMsg }}</div>
		</el-form-item>
		<div class="mod-pop-btn">
			<el-button type="text" @click="downloadTpl">模板下载</el-button>
			<el-button type="primary" @click="onSubmit">上传</el-button>
		</div>
	</el-form>
</template>
<script>
  export default {
		props:['bus', 'popData'],
		data(){
			return{ 
				errorMsg:'',
				uploadErrorMsg:'',
				fileList:[],
				popForm:{
					uploadName:'',
					uploadSize:''
				},
				uploadOpt: {
					tableId: this.popData.tableId,
					toolId: this.popData.actData.toolId,
					actType: this.popData.actData.actType
				}
			}
		},
    methods: {
			selectFile(){
				this.uploadErrorMsg = '';	
			},
			downloadTpl(){
				location.href=this.popData.downloadUrl || 'http://shopmanage.yunhou.com/api/Active/down_excel_temp?actType='+this.popData.actData.actType+'&toolId='+this.popData.actData.toolId;	
			},
			onSuccess(response, file, fileList){
				if(response.error == '0'){
					this.$refs.upload.clearFiles(fileList);
					this.fileList = [];
					this.$message.success(response.msg || '导入成功');
					this.bus.$emit('import/upload/success',response.data);	
					this.uploadErrorMsg = '';
				}else{
					this.uploadErrorMsg = response.msg;
				}
				this.errorMsg = '';
			},
			onError(err, file, fileList){
				this.errorMsg = file.name+'上传失败!';
			},
			onChange(file, fileList){
				//this.uploadErrorMsg = '';
				if(fileList.length>1){
					this.$refs.upload.uploadFiles.splice(0,1);
				}
				this.popForm.uploadName = file.name;
				this.popForm.uploadSize = file.size;
				this.fileList = fileList;	
				return this.validate();
			},
			onRemove(file, fileList){
				this.fileList = [];
			},
			validate(){
				if(this.fileList.length==0){
					this.errorMsg = '请选择一个上传文件!'
					return false;	
				}	
				if(!/\.xlsx|xls$/.test(this.popForm.uploadName)){
					this.errorMsg = '文件后缀名必须为.xlsx或.xls'
					return false;	
				}	
				if(this.popForm.uploadSize>20*1024){
					this.errorMsg = '文件大小不能超过20Mb!'
					return false;	
				}
				this.errorMsg = '';
				return true;
			},
      		onSubmit() {
				if(this.validate()){
					// this.$ajax.post(' Active/import_excel',{}).then((res)=>{
					
					// });
					
					this.$refs.upload.submit();
				}
      		}
    	}
  	}
</script>
<style lang="scss" scoped>
	.mod-upload {
		overflow:hidden;
		margin-bottom:20px;
	}
</style>
