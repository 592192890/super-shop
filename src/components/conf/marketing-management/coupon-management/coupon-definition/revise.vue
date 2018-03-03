<template>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm" label-position="left">
    <div :class="{ mask: isView }">
	<el-form-item label="优惠券定义编码" required>
		<span>{{ruleForm.code}}</span>
	</el-form-item>
	<el-form-item label="优惠券名称" prop="name">
		<el-input class="coupon-name" v-model="ruleForm.name"  placeholder="市场部小伙伴们输入名称谢谢"></el-input><span class="des">优惠券名称不能为空，最多可输入30个字符，不能输入特殊符号</span>
	</el-form-item>
	<el-form-item label="所属部门" required>
		<el-select v-model="ruleForm.department" placeholder="请选择部门" :disabled="true">
            <el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
			<!-- <el-option label="百货" value="0"></el-option>
			<el-option label="超市" value="1"></el-option>
			<el-option label="电器" value="2"></el-option>
			<el-option label="置业" value="3"></el-option>
			<el-option label="便利" value="4"></el-option>
			<el-option label="珠宝" value="5"></el-option> -->
		</el-select>
        <span class="alert-inf">提交后不可修改</span>
	</el-form-item>
	<el-form-item label="优惠券类型" required>
		<el-select v-model="ruleForm.type" :disabled="true">
			<el-option label="满减券" :value="1"></el-option>
			<el-option label="满折券" :value="2"></el-option>
			<el-option label="停车券" :value="3"></el-option>
			<el-option label="升值券" :value="4"></el-option>
			<el-option label="免单券" :value="5"></el-option>
			<el-option label="现金劵" :value="6"></el-option>
		</el-select>
        <span class="alert-inf">提交后不可修改</span>
	</el-form-item>
    <el-form-item :label="labelName" required>
		<el-input class="issue" :disabled="true" v-model="ruleForm.price"></el-input><span class="txt">{{priceTxt}}</span>
        <span class="des">优惠券金额不能小于等于0，可到小数点后2位</span>
        <span class="alert-inf">提交后不可修改</span>
	</el-form-item>
	<el-form-item label="发行总量" prop="gross">
		<el-input class="issue" v-model="ruleForm.gross"  placeholder="请输入发行数量"></el-input><span class="txt">张</span>
        <span class="des">最多发行20万份</span>
	</el-form-item>
    <el-form-item label="同一用户优惠券数量<=" prop="number">
		<el-input class="issue" v-model="ruleForm.number"  placeholder="请输入数量"></el-input><span class="txt">个</span>
	</el-form-item>
	<el-form-item label="优惠券截止有效期" required>
		<el-form-item prop="date">
			<el-date-picker type="datetime" placeholder="选择日期" v-model="ruleForm.date"></el-date-picker>
		</el-form-item>
	</el-form-item>
    <el-form-item label="其他规则">
		<el-checkbox v-model="ruleForm.otherRules">限制设备领取（一个手机限领一张）</el-checkbox>
	</el-form-item>
	<el-form-item label="优惠券说明" prop="explain">
		<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="ruleForm.explain"  placeholder="请输入简短优惠券说明"></el-input>
		<span class="des textarea">描述显示在优惠券名称里，告知优惠券金额等</span>
	</el-form-item>
	<el-form-item label="优惠券图片">
		<el-upload
		class="avatar-uploader"
        :with-credentials="true"
		:action="uploadUrl"
		:show-file-list="false"
		:on-success="handleAvatarSuccess"
		:before-upload="beforeAvatarUpload">
		<!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
        <img v-if="!imageUrl" src="../../../../../assets/images/upload.png" class="avatar"/>
		<img v-if="imageUrl" :src="imageUrl" class="avatar"/>
		</el-upload>
        <span class="des upload">优惠券图片要求宽度为120像素，高度为120像素、比例为3:1的图片；支持格式gif、jpg、png</span>
	</el-form-item>
    </div>
	<el-form-item>
		<el-button type="primary" @click="submitForm('ruleForm')" v-if="!isView">提交</el-button>
		<el-button @click="resetForm('ruleForm')" v-if="!isView">取消</el-button>
        <el-button @click="resetForm('ruleForm')" v-if="isView">返回</el-button>
	</el-form-item>
	</el-form>
</template>
<script>
export default {
    data() {
        var uploadUrl = this.$apiUrl.uploadImageUrl;
        return {
            isView:false,
            uploadUrl,
            imageUrl:"",
            priceTxt:"元",
            departmentData:[],//全部业态
            pic:"",
            ruleForm: {
                otherRules:false,
                code:"",
                name: '',
                department: '',
                type: '',
                gross: '',
                number:"",
                date:"",
                explain:'',
                price:'',
                belong:"",
            },
            rules: {
                name: [
                    { required: true, min:0, max: 30, message: '优惠券名称不能为空，最多可输入30个字符，不能输入特殊符号', trigger: 'blur' },
					{pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, message:'不能输入特殊符号'}
                ],
                gross:[
                    { required: true,  message:'请输入数量'},
					{pattern:/^(\d{1,5}|1\d{5}|200000)$/, message:'最多发行20万份'}
                ],
                date: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                explain: [
                    { max: 50, message: '描述需小于50个字符', trigger: 'blur'  }
                ],
                number:[
					{ required: true,message:'请输入数量',trigger: 'blur'},
					{ pattern:/^([1-9]\d*)$/, message:'数量需大于等于1'}
				],
            },
            labelName:"优惠券金额",
            ruleDate:"",
        };
    },
    mounted () {
        //判断是否查看详情
        if(sessionStorage.getItem("isView")){
            this.isView = true;
        }
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
        //获取全部定义信息
        var id = sessionStorage.getItem('id');
		this.$ajax.post(this.$apiUrl.coupon.defineGet,{id:id}
		).then((res) =>
		{
			if (res.error !== 0) {
				this.$message({
				message: res.msg,
				type: 'error'
				});
				return false;
            }
            //信息注入
            this.ruleDate = res.data;
            console.log(this.ruleDate);
            if (this.ruleDate) {
                if (this.ruleDate.type == 2) {//满折券
                    this.labelName="优惠券折扣";
                    this.ruleForm.price = (this.ruleDate.discount/10);
                    this.priceTxt = "折";
                }else if(this.ruleDate.type == 4){//升值券
                    this.ruleForm.price = this.ruleDate.revalue;
                }else if(this.ruleDate.type == 5){//免单券
                    this.labelName="优惠券免单金额";
                    this.ruleForm.price = this.ruleDate.freeCondAmount;
                }else{
                    this.labelName="优惠券金额";
                    this.ruleForm.price = this.ruleDate.amount;//优惠券金额
                }

                if (this.ruleDate.deviceLimitedFlag) {
                    this.ruleForm.otherRules = true;
                }else{
                    this.ruleForm.otherRules = false;
                }

                this.ruleForm.department = this.ruleDate.department;//所属部门
                this.ruleForm.type = this.ruleDate.type;//优惠券类型
                this.ruleForm.code = this.ruleDate.cpnsId;//优惠券编码
                this.ruleForm.name = this.ruleDate.name;//优惠券名称
                this.ruleForm.gross = this.ruleDate.maxNum;//发行总量
                this.ruleForm.number = this.ruleDate.userMaxNum.toString();//单个用户数量
                this.ruleForm.date = new Date(this.ruleDate.expireTime);//优惠券截止有效期
                this.ruleForm.explain = this.ruleDate.info;//优惠券说明
                if (this.ruleDate.pic) {
                    this.imageUrl = this.ruleDate.pic;//优惠券图片
                }
                this.pic = this.ruleDate.pic;//优惠券图片
            }
        }) 
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                //validate()验证是否有报错信息，通过valid为true
                if (valid) {
					var amount = "";
					//根据优惠券类型获取优惠券金额
					switch (this.ruleForm.type) {
						case "1":
							amount = this.ruleForm.price;
							break;
						case "2":
							amount = this.ruleForm.price;
							break;
						case "3":
							amount = this.ruleForm.price;
							break;
						case "4":
							amount = this.ruleForm.price;
							break;
						case "5":
							amount = this.ruleForm.price;
							break;
						case "6":
							amount = this.ruleForm.price;
							break;
					}
					//请求参数
					var param={
						amount:parseInt(this.ruleDate.amount),	//优惠券金额	string	@mock=1
                        cpnsId:this.ruleDate.cpnsId,	//优惠券定义编码	string	@mock=6729
                        // createAccountId:this.ruleDate.updateAccountId,	//创建人ID	string	@mock=1
                        discount:this.ruleDate.discount,	//折扣券折扣，百分比%	string	@mock=80
                        expireTime:Date.parse(this.ruleForm.date),	//优惠券过期时间	string	@mock=1388307215000
                        id:this.ruleDate.id,//主键id	number	@mock=123
                        info:this.ruleForm.explain,	//优惠券说明	string	@mock=sd
                        maxNum:parseInt(this.ruleForm.gross),	//发行总数量	number	@mock=1
                        name:this.ruleForm.name,	//优惠券名称	string	@mock=劵
                        pic:this.pic,	//优惠券图片地址	string	@mock=dee
                        userMaxNum:parseInt(this.ruleForm.number),	//单个用户最大领券数量	number	@mock=2
					}
                    if (this.ruleForm.otherRules) {//是否限制设备领取 0,不限制 ， 1，限制
						param.deviceLimitedFlag = 1;
					}else{
						param.deviceLimitedFlag = 0;
					}
                    
                    console.log(param)
					this.$ajax.post(this.$apiUrl.coupon.saveDefine,param
					).then((res) =>
					{
						if (res.error !== 0) {
							this.$message({
							message: res.msg,
							type: 'error'
							});
							return false;
						}
						this.$message({
							message: '修改优惠券定义成功！',
							type: 'success'
						})
						this.$router.push({name:'优惠券定义列表'});
					})	
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.$router.push({name:'优惠券定义列表'});
        },
        //上传成功回调
        handleAvatarSuccess(res, file) {
            if (res.error !== 0) {
                this.$message({
                message: res.msg,
                type: 'error'
                });
                return false;
            }
            this.imageUrl = res.data.imageUrl;
            // this.imageUrl =file.url;
            this.pic = res.data.imageUrl;
        },
        //上传失败回调
        handleAvatarError(err, file){
            this.$message({
                message: "上传失败，请重试！",
                type: 'error'
            });
        },
        //图片上传限制
        beforeAvatarUpload(file) {
            const isPNG = file.type === 'image/png';
            const isJPG = file.type === 'image/jpeg';
            const isGIF = file.type === 'image/gif';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG && !isGIF) {
            this.$message.error('上传图片只能是 gif/jpg/png 格式！');
            }
            if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
            }
            return (isJPG || isPNG || isGIF) && isLt2M;
        },
    }
}
</script>
<style lang="scss" scoped>
.el-form{
	background-color: #fff;
	padding: 20px;
    .el-input{
		width: 220px;
	}
	.el-select{
		width: 220px;
	}
	.coupon-name{
		width:450px;
	}
}
.issue{
	width: 70%
}
.des{
    position: absolute;
    color:#999;
    margin-left:10px;
    font-size:8px;
    bottom:0;
    height: 36px;
}
.textarea{
    left:450px;
}
.upload{
    left:100px;
}
.el-textarea{
    width: 450px;
}
.alert-inf{
    position: absolute;
    display: inline-block;
    left: 0;
    top: 100%;
    // margin:0 0 22px 150px;
    color:#ff4949;
    font-size: 12px;
    line-height: 12px;
    padding-top:5px;
}
.txt{
	padding-left: 10px;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
.mask{
    z-index: 99;
    pointer-events: none;
}
</style>



