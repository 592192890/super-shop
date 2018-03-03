<template>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm" label-position="left">
	<el-form-item label="优惠券定义编码" required>
		<span>{{cpnsId}}</span>
	</el-form-item>
	<el-form-item label="优惠券名称" prop="name">
		<!-- <el-col :span="7"> -->
		<el-input class="coupon-name" v-model="ruleForm.name"  placeholder="市场部小伙伴们输入名称谢谢"></el-input><span class="des">优惠券名称不能为空，最多可输入30个字符，不能输入特殊符号</span>
		<!-- </el-col> -->
	</el-form-item>
	<el-form-item label="所属部门" prop="department">
		<el-select v-model="ruleForm.department" placeholder="请选择部门">
			<el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
		</el-select>
	</el-form-item>
	<el-form-item label="优惠券类型" prop="typle">
		<el-select v-model="ruleForm.typle" placeholder="请选择类型">
			<el-option label="满减券" :value="1"></el-option>
			<el-option label="满折券" :value="2"></el-option>
			<el-option label="停车券" :value="3"></el-option>
			<el-option label="升值券" :value="4"></el-option>
			<el-option label="免单券" :value="5"></el-option>
			<el-option label="现金劵" :value="6"></el-option>
		</el-select>
	</el-form-item>
	<transition name="slide-fade" mode="in-out">
	<el-card class="box-card" v-if="ruleForm.typle">
		<transition-group name="fade" tag="div">
			<div v-if="ruleForm.typle == 1" class="manjian" key="manjian">
				<el-form-item prop="manjianDiscount">
					<span>优惠券金额：</span><el-input v-model="ruleForm.manjianDiscount" class="discount"></el-input><span>元</span>
				</el-form-item>
				<!-- <el-form-item prop="manjianPrice">
					<div class="div">金额满<el-input v-model="ruleForm.manjianPrice" class="price"></el-input>元，减{{ruleForm.discount}}元</div>
				</el-form-item> -->
			</div>

			<div v-if="ruleForm.typle == 2" class="manzhe" key="manzhe">
				<el-form-item prop="manzheDiscount">
					<span>折扣：</span><el-input v-model="ruleForm.manzheDiscount" class="discount"></el-input><span>折</span>
				</el-form-item>
				<!-- <el-form-item prop="manzhePrice">
					<div class="div">金额满<el-input v-model="ruleForm.manzhePrice" class="price"></el-input>打{{ruleForm.discount}}折</div>
				</el-form-item> -->
			</div>

			<div v-if="ruleForm.typle == 3" class="tingche" key="tingche">
				<el-form-item prop="tingchePrice">
					<span>免费停车券：</span><el-input v-model="ruleForm.tingchePrice" class="discount"></el-input><span>元</span>
				</el-form-item>
			</div>

			<div v-if="ruleForm.typle == 4" class="shenzhi" key="shenzhi">
				<el-form-item prop="shengzhiPrice">
					<span class="lable">优惠券金额</span><el-input v-model="ruleForm.shengzhiPrice" class="discount"></el-input><span>元</span>
				</el-form-item>
				<div class="pick-date">
					<span class="lable">日期</span>
					<el-form-item prop="shengzhiStartTime" class="inline">
						<el-date-picker class="date" type="datetime" placeholder="选择日期" v-model="ruleForm.shengzhiStartTime"></el-date-picker>
					</el-form-item>
					<span>—</span>
					<el-form-item prop="shengzhiEndTime"  class="inline">
						<el-date-picker class="date" type="datetime" placeholder="选择日期" v-model="ruleForm.shengzhiEndTime"></el-date-picker>
					</el-form-item>
				</div>
				<el-form-item prop="shengzhiUpPrice">
					<div class="div">优惠券金额升值为<el-input v-model="ruleForm.shengzhiUpPrice" class="price"></el-input>元</div>
				</el-form-item>
			</div>
			<div v-if="ruleForm.typle == 5" class="miandan" key="miandan">
				<!-- <div class="pick-date">
					<span class="lable">日期</span>
					<el-form-item prop="miandanStartTime"  class="inline">
						<el-date-picker class="date" type="date" placeholder="选择日期" v-model="ruleForm.miandanStartTime"></el-date-picker>
					</el-form-item>
					<span>—</span>
					<el-form-item prop="miandanEndTime"  class="inline">
						<el-date-picker class="date" type="date" placeholder="选择日期" v-model="ruleForm.miandanEndTime"></el-date-picker>
					</el-form-item>
				</div> -->
				<el-form-item prop="miandanPrice">
					<div class="div">单笔订单小于等于<el-input v-model="ruleForm.miandanPrice" class="price"></el-input>元，该笔订单可免单</div>
				</el-form-item>
			</div>

			<div v-if="ruleForm.typle == 6" class="xianjin" key="xianjin">
				<el-form-item prop="xianjingPrice">
					<span>现金券价值：</span><el-input v-model="ruleForm.xianjingPrice" class="discount"></el-input><span>元</span>
				</el-form-item>
			</div>
		</transition-group>
	</el-card>
	</transition>
	<el-form-item label="发行总量" prop="gross">
		<!-- <el-col :span="4"> -->
		<el-input class="issue" v-model="ruleForm.gross"  placeholder="请输入发行数量"></el-input><span class="txt">张</span>
        <span class="des">最多发行20万份</span>
		<!-- </el-col> -->
	</el-form-item>
	<el-form-item label="同一用户优惠券数量<=" prop="number">
		<!-- <el-col :span="4"> -->
		<el-input class="issue" v-model="ruleForm.number"  placeholder="请输入数量"></el-input><span class="txt">个</span>
		<!-- </el-col> -->
	</el-form-item>
	<el-form-item label="优惠券截止有效期" required>
		<!-- <el-col :span="4"> -->
		<el-form-item prop="date">
			<el-date-picker type="datetime" placeholder="选择日期" v-model="ruleForm.date"></el-date-picker>
		</el-form-item>
		<!-- </el-col> -->
	</el-form-item>
	<el-form-item label="其他规则">
		<el-checkbox v-model="ruleForm.otherRules">限制设备领取（一个手机限领一张）</el-checkbox>
	</el-form-item>
	<el-form-item label="优惠券说明" prop="explain">
		<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="ruleForm.explain"  placeholder="请输入简短优惠券说明"></el-input>
		<span class="des textarea">描述显示在优惠券名称里，告知优惠券金额等</span>
	</el-form-item>
	<el-form-item label="优惠券图片" prop="">
		<el-upload
		class="avatar-uploader"
		:with-credentials="true"
		:action="uploadUrl"
		:show-file-list="false"
		:on-success="handleAvatarSuccess"
		:before-upload="beforeAvatarUpload">
		<img v-if="!imageUrl" src="../../../../../assets/images/upload.png" class="avatar"/>
		<img v-if="imageUrl" :src="imageUrl" class="avatar"/>
		</el-upload>
        <span class="des upload">优惠券图片要求宽度为120像素，高度为120像素、比例为3:1的图片；支持格式gif、jpg、png</span>
	</el-form-item>
	<el-form-item>
		<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
		<el-button @click="resetForm('ruleForm')">取消</el-button>
	</el-form-item>
	</el-form>
</template>
<script>
export default {
    data() {
		//结束时间大于开始时间验证
        var validateShengzhiEndTime = (rule, value, callback) => {
            if (Date.parse(this.ruleForm.shengzhiStartTime)>=Date.parse(this.ruleForm.shengzhiEndTime)) {
                callback(new Error('时间需晚于起始时间'));
            }else{
                callback();
            }
		};
		var validateMiandanEndTime = (rule, value, callback) => {
            if (Date.parse(this.ruleForm.miandanStartTime)>=Date.parse(this.ruleForm.miandanEndTime)) {
                callback(new Error('时间需晚于起始时间'));
            }else{
                callback();
            }
		}
		var uploadUrl = this.$apiUrl.uploadImageUrl;
        return {
			uploadUrl,//图片上传地址
			departmentData:[],//全部业态
			imageUrl:'',
			
			pic:"",
			cpnsId:"",
            ruleForm: {
				otherRules:false,
                name: '',
                department: '',
                typle: '',
				gross: '',
				number:"",
                date:"",
                explain:'',
                discount:'',
                // price:'',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
				manjianPrice:"",
				manjianDiscount:"",
				manzheDiscount:"",
				manzhePrice:"",
				tingchePrice:"",
				shengzhiPrice:"",
				shengzhiStartTime:"",
				shengzhiEndTime:"",
				shengzhiUpPrice:"",
				miandanPrice:"",
				miandanStartTime:"",
				miandanEndTime:"",
				xianjingPrice:""
            },
            rules: {
                name: [
					{ required: true, min:0, max: 30, message: '优惠券名称不能为空，最多可输入30个字符，不能输入特殊符号', trigger: 'blur' },
					{pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, message:'不能输入特殊符号'}
                ],
                department:[
                    { required: true, message: '请选择部门', trigger: 'change' }
                ],
                typle:[
                    { required: true, type:"number", message: '请选择优惠券类型', trigger: 'change' }
                ],
                gross:[
					{ required: true,  message:'请输入数量'},
					{pattern:/^(\d{1,5}|1\d{5}|200000)$/, message:'最多发行20万份'}
				],
				number:[
					{ required: true,  message:'请输入数量',trigger: 'blur'},
					{ pattern:/^([1-9]\d*)$/, message:'数量需大于等于1'}
				],
                date: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
				],
                explain: [
                    { max: 50, message: '描述需小于50个字符', trigger: 'blur' }
				],
				manjianDiscount:[
					{required: true, message: '请输入减扣金额', trigger: 'blur'  },
					{pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
				],
				manjianPrice:[
					{required: true, message: '请输入条件金额', trigger: 'blur'  },
					{pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
				],
				manzheDiscount:[
					{required: true, message: '请输入折扣', trigger: 'blur'  },
					{pattern:/^(\d(\.\d)?|10)$/ , message:'请输入0到10之间的数字，最多一位小数'}
				],
				manzhePrice:[
					{required: true, message: '请输入条件金额', trigger: 'blur'  },
					{pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
				],
				tingchePrice:[
					{required: true, message: '请输入金额', trigger: 'blur'  },
					{pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
				],
				shengzhiPrice:[
					{required: true, message: '请输入金额', trigger: 'blur'  },
					{pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
				],
				shengzhiStartTime:[
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
				],
				shengzhiEndTime:[
					{ type: 'date', required: true, message: '请选择日期', trigger: 'change' },
					{ required: true, validator: validateShengzhiEndTime, trigger: 'change'}
				],
				shengzhiUpPrice:[
					{required: true, message: '请输入升值金额', trigger: 'blur'  },
					{pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
				],
				miandanStartTime:[
					{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }
				],
				miandanEndTime:[
					{ type: 'date', required: true, message: '请选择日期', trigger: 'change' },
					{ required: true, validator: validateMiandanEndTime, trigger: 'change'}
				],
				miandanPrice:[
					{required: true, message: '请输入条件金额', trigger: 'blur'  },
					{pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
				],
				xianjingPrice:[
					{required: true, message: '请输入金额', trigger: 'blur'  },
					{pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
				],
            },
        };
	},
	mounted(){
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
		//获取优惠券定义编码
		this.$ajax.post(this.$apiUrl.coupon.createCouponId,{couponKey:"coupon_"}
		).then((res) =>
		{
			if (res.error !== 0) {
				this.$message({
				message: res.msg,
				type: 'error'
				});
				return false;
			}
			this.cpnsId = res.data;
		})   
	},
    methods: {
        submitForm(formName) {
			// console.log(parse(this.ruleForm.otherRules));
            this.$refs[formName].validate((valid) => {
                //validate()验证是否有报错信息，通过valid为true
                if (valid) {
					var amount = "";
					//根据优惠券类型获取优惠券金额
					switch (this.ruleForm.typle) {
						case 1:
							amount = this.ruleForm.manjianDiscount;
							break;
						case 2:
							amount="";
							break;
						case 3:
							amount = this.ruleForm.tingchePrice;
							break;
						case 4:
							amount = this.ruleForm.shengzhiPrice;
							break;
						case 5:
							amount="";
							break;
						case 6:
							amount = this.ruleForm.xianjingPrice
							break;
					}
					//请求参数
					var param={
						amount:parseFloat(amount),//优惠券金额	string	@mock=1
						cpnsId:this.cpnsId,		//优惠券定义编码	string	@mock=6729
						// createAccountId:"123",	//创建人ID	string	@mock=1
						department:this.ruleForm.department,	//发券方(所属部门)	string	@mock=2
						discount:this.ruleForm.manzheDiscount*10,	//折扣券折扣，百分比%	string	@mock=80
						expireTime:Date.parse(this.ruleForm.date),	//优惠券过期时间	string	@mock=1388307215000
						freeCondAmount:parseFloat(this.ruleForm.miandanPrice),	//免单券门槛	string	@mock=1
						info:this.ruleForm.explain,	//优惠券说明	string	@mock=sd
						//maxDiscountAmount	//折扣券最大折扣金额	string	@mock=1
						maxNum:parseInt(this.ruleForm.gross),	//发行总数量	string	@mock=1
						name:this.ruleForm.name,	//优惠券名称	string	@mock=劵
						pic:this.pic,	//优惠券图片地址	string	@mock=dee
						revalue:parseFloat(this.ruleForm.shengzhiUpPrice),	//升值券升值金额	string	@mock=22
						revalueEndTime:Date.parse(this.ruleForm.shengzhiEndTime),	//升值券结束时间	string	@mock=1388307215000
						revalueStartTime:Date.parse(this.ruleForm.shengzhiStartTime),	//升值券开始时间	string	@mock=1388307215000
						type:parseInt(this.ruleForm.typle),	//优惠券类型	string	@mock=1
						userMaxNum:parseInt(this.ruleForm.number),	//单个用户最大领券数量	string	@mock=2
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
							message: '新增优惠券定义成功！',
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
			// this.uploadData = {
			// 	files:file,	//文件表单	array<object>	
			// 	security:false	//是否为私密图片	string
			// }
        },
    }
}
</script>
<style lang="scss">
.el-card{
	  .el-form-item__content{
		  margin-left: 0!important;
	  }
  }
</style>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
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
.box-card{
	width: 500px;
	margin:0 0 20px 180px;
		.discount{
			width: 100px;
			padding: 0 5px;
		}
		.div{
			margin-top:20px;
			.price{
				width: 100px;
				margin:0 5px;
			}
		}
		.pick-date{
			margin-top:20px;
			.date{
				width: 150px;
			}
		}
		.lable{
			display: inline-block;
			width: 110px;
		}
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
  .inline{
	  display: inline-block;
  }
</style>


