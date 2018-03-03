<template>
  <div class="page-view" :style="{ height: screenHeight +'px' }">
	<head-top title="欢迎注册" hasContent="这里是传递给子组件的布尔值，当前组件下必须不能为空，干脆写个注释好了：这里注册组件要有返回登陆组件的入口，忘记密码组件却不要有，单独拎出来写这个判断好心累= =，如果不要显示返回登陆组件的入口，把这段文字删掉就OK啦！">
	</head-top>
	<div class="mod-content">
		<transition-group tag="div" name="fade" mode="out-in" class="transition-tag">
			<form action="#" id="jForm" v-show="!thirdStepShow" key="form">
				<div class="content content-phone">
					<input type="text" id="phoneNum" name="phoneNum" class="jTxt" data-value="1" placeholder="请输入手机号" v-model="tel" @blur="phoneVerification" @input="btnCanClick">
					<i class="icon iconfontcom">&#xe7b7;</i>
					<span class="descrp-eeror jRemind1">{{tipsOne}}</span>
				</div>
				<div class="content content-password">
					<input type="password" id="password" name="passWord" class="jTxt" data-value="2" placeholder="密码由6-20个数字和字母组合" v-model="password" @blur="isPassword" @input="passwordRegex">
					<i class="icon iconfontcom">&#xe60c;</i>
					<span class="descrp-eeror jRemind2">{{tipsTwo}}</span>
					<div class="level" v-if="leveShow">
						<div class="text">安全程度</div>
						<span class="graph good" v-if="isEnough">弱</span>
						<span class="graph better" v-if="isMedium">中</span>
						<span class="graph best" v-if="isStrong">强</span>
					</div>
				</div>
				<!-- <div class="content content-validate-img">
					<input type="text" id="validateImg" class="jTxt" data-value="3" placeholder="请输入图片验证码">
					<img src="//s1.bbgstatic.com/pc-user/images/conf/register/identifyImg.png" alt="" class="img-verify">
					<i class="icon iconfontcom">&#xe7d9;</i>
					<i class="icon iconfontcom refresh change-img" id="jRefresh">&#xe7d3;</i>
					<span class="descrp-eeror jRemind3">请输入图片验证码</span>
				</div> -->
				<div class="content content-validate-phone">
					<input type="text" id="validatePhone" class="register.html" data-value="4" placeholder="请输入手机验证码" v-model="codeNum" @input="btnCanClick">
					<i class="icon iconfontcom">&#xe60c;</i>
					<button type="button" class="btn-identify jVerification get" @click="getCode" :class="[canClick ? get : sec]" :disabled="!canClick">{{getOrCountText}}</button>
					<span class="descrp-eeror jRemind4">{{tipsThree}}</span>
				</div>
				<div class="register-protocol">
					<a href="javascript:;" @click="linkToProtocol">会员注册协议</a>
				</div>			
				<button type="button" class="btn-agree" :disabled="!canSubmit" :class="[canSubmit ? '' : disable]" @click="login">同意协议并注册</button>
			</form>
			<third-step
				key="thirdStep"
				v-show="thirdStepShow"
				:bgc="bgc"
				:statusText="statusText"
				:icon="icon">
			</third-step>
		</transition-group>
	</div>
    <ft></ft>
</div>
</template>
<script>
import ft from '@/components/common/login/ft.vue'
import headTop from '@/components/common/login/head.vue'
import thirdStep from '@/components/conf/find-password/third-step.vue'
// import left from './left.vue'
import Vue from 'vue'
export default {
	data(){
		return{
			screenHeight:"",
			thirdStepShow:false,
			bgc:"",
			statusText:"",
			icon:"",
			tel:"",
			password:"",
			codeNum:"",
			tipsOne:"",
			tipsTwo:"",
			tipsThree:"",
			leveShow:false,
			isEnough:false,
			isMedium:false,
			isStrong:false,
			canClick:true,
            smsTime:"60",
            getOrCountText:"获取验证码",
			get:"get",
            sec:"sec",
            canSubmit:false,
			disable:"disable",
		}
	},
	components:{
		ft,headTop,thirdStep
	},
	mounted(){
		//设置页面高度
		this.screenHeight = document.documentElement.clientHeight;
	},
	methods:{
		showThirdStep:function(){
            this.thirdStepShow=true;
        },
        thirdStatusOk:function(){
            this.statusText="恭喜您注册成功！",
            this.icon=""
            this.bgc=true
        },
        thirdStatusErr:function(){
            this.statusText="注册失败",
            this.icon=""
            this.bgc=false
        },
		linkToProtocol:function(){
			this.$router.push({name:'注册服务协议'});
		},
		//手机号码验证
        phoneVerification:function(){
            if(/^1[3456789]\d{9}$/g.test(this.tel)){
                this.tipsOne="";
                return true;
            }else{
                this.tipsOne="手机号码格式不正确";
                return false;
            }
        },
		//判断新密码格式
        isPassword:function(){
            var passwordRegex = new RegExp("^(?=.*[0-9].*)(?=.*[a-zA-Z].*).{6,19}.*$", "g");
            if(passwordRegex.test(this.password)){
                this.tipsTwo="";
                return true;
            }else if(!passwordRegex.test(this.password) && this.password){
                this.tipsTwo="密码由6-20个数字和字母组合";
                return false;
            }
        },
		//判断用户是否有重新输入动作，消灭提醒,输入过程中格式正确，消灭提醒
        clearTipsTwo:function(){
            var passwordRegex = new RegExp("^(?=.*[0-9].*)(?=.*[a-zA-Z].*).{6,19}.*$", "g");
             if(passwordRegex.test(this.password)){
                this.tipsTwo = "";
            }  
        },
		//验证密码强度
        passwordRegex:function(){
            var self = this;
            self.clearTipsTwo();
            self.btnCanClick();
            //密码为12位及以上并且字母数字大写字母三项都包括
            var strongRegex = new RegExp("^(?=.{12,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$", "g");
           
            //密码为八位及以上并且字母、数字、大写字母三项中有两项
            var mediumRegex = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
            //密码为6位以上数字字母组合
            var enoughRegex = new RegExp("(?=.{6,}).*", "g");
            if(!self.password){
                self.leveShow=false;
                self.tipsOne="";
            } else if (strongRegex.test(self.password)) {
                self.leveShow=true;
                self.isEnough=false;
                self.isMedium=false;
                self.isStrong=true;
            } else if (mediumRegex.test(self.password)) {
                self.leveShow=true;
                self.isEnough=false;
                self.isMedium=true;
                self.isStrong=false;
            } else if(enoughRegex.test(self.password)){
                self.leveShow=true;
                self.isEnough=true;
                self.isMedium=false;
                self.isStrong=false;
            };
            
        },
		//发送验证码请求
        getCode: function(){
            var self = this;
            var json = {
                "mobile" : self.tel,
            }
            self.loading=true;
            if(self.tel && self.phoneVerification()){
                self.canClick=false;
                self.$message('验证码发送成功!');//test
                self.countDown();//test
                // io.post(smsUrl, json, function(rst){
                //     self.loading=false;
                //     self.$message('验证码发送成功!');
                //     if(rst.data&&rst.data.leftSecond){
                //         self.smsTime = parseInt(rst.data.leftSecond);
                //         self.countDown();
                //     }else{
                //         self.countDown();//默认60s
                //     }
                // }, function(e){
                //     self.loading=false;
                //     e.msg && self.$message({
                //         message: e.msg,
                //         type: 'warning'
                //     });
                //     self.codeNum="";
                //     self.canClick=false;
                //     self.getOrCountText="重新获取";
                // });
            }else if(!self.tel){
                self.tipsOne = "请填写手机号";
            }
        },
        //获取验证码倒计时
        countDown: function(){
            var self = this;
            self.canClick=false;
            var timeId = setInterval(function(){
                self.smsTime--;
                self.getOrCountText= self.smsTime + 's';
                if(self.smsTime===0){
                    self.smsTime="60";
                    timeId && clearInterval(timeId);
                    self.canClick=true;
                    self.getOrCountText="重新获取";
                }  
            },1000)
        },
		btnCanClick:function(){
            var self = this;
            if(self.password && self.tel && self.codeNum.length == 5 && !self.tipsOne && !self.tipsTwo){
                self.canSubmit = true;
            }else{
                self.canSubmit = false;
            }
        },
		//提交按钮逻辑
        login: function(){
            var self = this,
                param;
                param = {
                    "mobile" : self.telNum,
                    "captcha" : self.verfCode,
                };  
				self.btnCanClick();
                // self.wholeLoading=true;
                // io.post(authCode, param, function(res){
                    // self.wholeLoading=false;
                    //进入步骤二组件
                    // self.$emit('showThirdStep');
					self.showThirdStep();
                    //判断步骤二组件采用的状态
                    // if(){
                        // self.$emit('thirdStatusOk');
						self.thirdStatusOk();
                    // }else{
                        // self.$emit('secondStatusErr');
                    // }
                // }, function(e){
                //     self.wholeLoading=false;
                //     self.tipsTwo = e.msg;
                //     self.codeNum="";
                //     self.canSubmit = false;
                // });         
        },
	}
}
</script>
<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity .15s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.transition-tag{
	height: 100%;
}
.login{
	position: relative;
}
.mod-content{
    position: absolute;
    background-color: #fff;
	width:80%;
    min-width: 850px;
    height: 80%;
    top:100px;
    left:50%;
    margin-left:-40%;
	// text-align: center;
	form{
		position: relative;
		top:20%;
        width:340px;
        margin:0 auto;
		.content{
			width: 100%;
			margin: 0 0 30px 0;
			position: relative;
			input{
				background-color: #f2f6ff;
				height: 50px;
				border: 1px solid #f2f6ff;
				border-radius: 5px;	
				padding-left: 50px;
				width: 288px;
				font-size: 18px;
				color: #333;
			}
			input:-webkit-autofill { 
				background-color:#f2f6ff!important;
				-webkit-box-shadow: 0 0 0px 1000px #f2f6ff inset;
			}
			i{
				position: absolute;
				left: 14px;
				top: 18px;
				font-size: 24px;
				color: #666;
			}
			.refresh{
				position: absolute;
    			left: 215px;
    			cursor: pointer;
			}
			img{
				position: absolute;
				top: 0;
				right: 0;
			}
			.btn-identify{
				width: 130px;
				height: 46px;
				margin: 2px;
				position: absolute;
				right: 0;
				top: 1px;
				background-color: #fff;
				border: 1px solid #fff;
				font-size: 16px;
				color: #333;
            }
			.get,.sec{
				position:absolute;
				right:5px;
				width:132px;
				height:40px;
				top:5px;
				border:none;
				background-color: #FFF;
				color:#333;
				line-height: 40px;
				font-size:16px;
			}
			.sec{
				// display:none;
				color:#3dcaf5;
			}
            .loading{
                background-image:url('http://s1.bbgstatic.com/pc-user/images/conf/register/loading.gif');
                background-repeat:no-repeat;
                background-position:center;
            }
			.descrp-eeror{
				color: #f95d5b;
				position: absolute;
				font-size: 14px;
				line-height: 30px;
				left: 52px;
				// display: none;
			}
			.level{
				display:inline-block;
				width:160px;
				height:50px;
				position:absolute;
				right:-182px;
				top:0;
				span{
					float:left;
				}
				.text{
					// display:none;
					height:25px;
					line-height:25px;
					text-align: left;
					margin-bottom:10px;
					color:#333;
				}
				.graph{
					// display:none;
					// display:inline-block;
					// width:50px;
					height:14px;
					border-radius:2px;
					color:#fff;
					font-size:12px;
					line-height:14px;
					text-align: center;
				}
				.good{
					width:50px;
					background-color: #e65656;
				}
				.better{
					width:100px;
					background-color: #fbbd46;
				}
				.best{
					width:150px;
					background-color: #72c1fb;
				}
			}
		}
		.register-protocol{
			margin-bottom: 40px;
            a{
                color: #333;
                font-size: 14px;
                text-decoration: underline;
            }
		}
		.btn-agree{
			width: 342px;
			height: 50px;
			border-radius:5px;
			background-color: #3dc9f7;
			color: #fff;
			border: 1px solid #3dc9f7;
			font-size: 18px;
		}
		.disable{
			// background-color:#ccc;
			opacity:0.3;
		}
	}
}
/* 输入框提示 */
::-webkit-input-placeholder { /* WebKit browsers */
    color: #ccc;
    font-size: 16px;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #ccc;
    font-size: 16px;
    opacity:  1;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #ccc;
    font-size: 16px;
    opacity:  1;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #ccc;
    font-size: 16px;
}
</style>