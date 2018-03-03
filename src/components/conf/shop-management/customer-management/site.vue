<template>
	<div class="mod-block">
		<el-form ref="form" :model="form" label-width="120px" :rules="rules">
			<el-form-item label="客服服务电话" prop="phone">
				<el-col :span="8">
					<el-input v-model="form.phone"></el-input>
				</el-col>
				
			</el-form-item>
			<el-form-item label="客服手机号" prop="mobile">
				<el-col :span="8">
					<el-input v-model="form.mobile"></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label-width="120px">
				<el-button type="primary" @click="submitForm('form')">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
    export
    default
    {
        data()
            {
                return {
                    form:{
						phone:'',
                        mobile: ''
					},
					rules: {
						phone: [{
							required:true, message:'不能为空', trigger: 'change'	
						}],
						mobile: [
							{ required: true, message: '请输入11位数字的手机号码', trigger: 'change' ,pattern:/^\d{11}$/}
						]
					}
				}
            },
            methods:{
                submitForm(formName){
					this.$refs[formName].validate((valid) => {
						if (valid) {
							var url=this.$apiUrl.updateCustomerInfo;
							this.$ajax.post(url, this.form).then((res)=>{
								if(res.error==0){
									this.$message({
										message: '保存成功',
										type: 'success'
									});
								}
							});
						} else {
							return false;
						}
					});
				},
				getCustomerInfo(){
					var url=this.$apiUrl.getCutomerInfo;
					this.$ajax.get(url).then(res=>{
						if(res.error==0){
							this.form = Object.assign({},res.data);
						}
						
					});
				}
			},
			mounted(){
				this.getCustomerInfo();
			}
    }
</script>
<style scope="scope" lang="scss">
	.mod-form-cnumber {
		overflow:hidden;
		.el-form-item {
			float:left;
			&:nth-child(1) {
				width:35%;
			}
			&:nth-child(2) {
				width:5%;	
				text-align:center;
				line-height:32px;
			}
			&:nth-child(3) {
				width:60%;
				.el-form-item__content {
					margin-left:0px!important;	
				}
			} 
		}
	}
</style>
