
<template>
<div class="page-view fresh" :style="{ height: screenHeight +'px' }" >
		<div class="mod-login">
			<div class="login-l "></div>
			<div class="login-r">
				<div class="r-hd">
					<div class="hd-img">
						<img src="../../../assets/images/conf/login/1.0.0/logo-red.png" alt="">
					</div>
					<div class="hd-descrp">
						商户登陆
					</div>
					<!-- <a class="hd-register" @click="linkToRegister">
						注册
					</a> -->
				</div>
				<div class="tips">{{tipsInf}}</div>
				<form action="">
					<div class="r-text">
						<i class="iconfontcom r-descpt">&#xe7b7;</i>
						<input type="text" data-value=1 placeholder="请输入手机号" name="phoneNumb" v-model="tel" @input="allowLogin" @keyup="keypress($event)">
					</div>
					<div class="r-text">
						<i class="iconfontcom r-descpt">&#xe60c;</i>
						<input type="password" data-value=2 placeholder="请输入密码" name="password" v-model="password" @input="allowLogin" @keyup="keypress($event)">
					</div>

					<div class="r-chooece">
						<input v-model="checked" type="checkbox" name="loginSelf" id="loginSelf">
						<label for="loginSelf">2周内自动登录</label>
						<!-- <a href="javascript:;" class="forget-pass" @click="linkToFindPassword">忘记密码</a> -->
					</div>
					<button type="button" class="btn-login" :disabled.prop="disabled" :class="{ disable: isOpcity }" @click="login" v-loading.body="loading">登录</button>
				</form>
			</div>
		</div>
        <ft></ft>
	</div>
</template>
<script>
import ft from '@/components/common/login/ft.vue'
import Vue from 'vue'
import CustomRouter from '../../../router/custom-router.js' 
import Permission from '../../../assets/js/permission-util.js'
export default {
	components:{
		ft
	},
	data(){
		var Permission = Permission;
		return {
			screenHeight:"",
			tel:"",//账号
			password:"",//密码
			tipsInf:"",//提示信息
			checked:false,//自动登录选框选中状态
			disabled:true,//登陆按钮不可点击状态
			isOpcity:true,//登陆按钮样式禁点
			loading:false//加载动画
		}
	},
	mounted(){
		this.loading=true;
		this.$ajax.get(this.$apiUrl.reSessionUrl).then(res=>{
			if(res.error==0){
				if(res.data.login){
					//如果有login这个参数并且大于0就是已经登录
					this.$router.push({name:'选择进入店铺'});
				}else{
					//清空新增的router
					this.clearAddedRouters();
				}
				
			}
			this.loading=false;
		})
		//设置页面高度
		this.screenHeight = document.documentElement.clientHeight;

		
	},
	methods:{
		//键盘点击登陆
        keypress:function(e){
			//回车键的键值为13 
			if(e.keyCode == 13&&!this.disable){  
				this.login();
			}  
        },
		allowLogin:function(){
			var self = this;
			if(self.tel && self.password){
				self.disabled=false;
				self.isOpcity=false;
				return true;
            }else{
				self.disabled=true;
				self.isOpcity=true;
				return false;
			};
		},
		clearAddedRouters:function(){
			var routers=this.$router.options.routes;
			var routerLength=routers.length;
			var mark=0;
			for(var i=0;i<routers.length;i++){
				if(routers[i].path=="*"){
					mark=i;
					break;
				}
			}
			//删除新增的路由
			this.$router.options.routes.splice(mark,routerLength-mark);
			
		},
        //登陆
        login:function(){
			var self = this;
			// password	密码	string	
			// systemCode	系统编码	string	BMP ：商家管理平台 IMP ： 综合管理平台
			// userName	用户名	string	
			var data = {
				"userName":self.tel,
				"password":self.password,
				"systemCode":"BMP"
			}
			if(self.allowLogin()){
				self.loading=true;
				// self.isAutoLogin();
				self.$ajax.post(self.$apiUrl.loginUrl,data).then(res=>{
					self.loading=false;
					if (res.error !== 0) {
						self.tipsInf=res.msg;
				        self.tel="";
				        self.password="";
				        self.disabled=true;
						self.isOpcity=true;
						return false;
					}else{
						//获取当前用户的业态码
						localStorage.setItem('currentUserBussinessTypeCode',res.data.sysUser.businessTypeCode)
					}
					
					//获得授权的路由
					var params={
						loop:1,
						systemCode:"BMP"
					}
					this.$ajax.get(this.$apiUrl.getPermissionRouter,params).then(res=>{
						if(res.error==0){
							if(res.data.resources.length==0){
								this.$message({
									type:'warning',
									message:'你没有任何权限！'
								})
								//退出登录，以防再次登录时无法登录
								var url=this.$apiUrl.logoutUrl;
								this.$ajax.get(url).then(res=>{
									if(res.error==0){
										//在调用refsession接口
										this.$ajax.get(this.$apiUrl.reSessionUrl).then(res=>{
											if(res.error==0){
											}
										})
										
									}
								})
								return;
							}

							//临时代码，判断是否有店铺后台权限
							localStorage.removeItem('oldShop');
							res.data.resources.forEach(v=>{
								if(v.name=='跳老店铺按钮'){
									localStorage.setItem('oldShop','oldShop')
								}
							})

							//动态生成路由
							this.generateNewRouter(res);
							

							//判断是否有returnUrl,如果有跳转到这个外部链接，否则跳转到选择店铺页面
							if(window.location.search){
								window.location.href=decodeURIComponent(location.search.replace(/\?returnUrl=/,''));
							}else{
								this.$router.push({name:'选择进入店铺'});
							}
							
						}else{
							this.$message({
								type:'error',
								message:res.msg
							})
						}
						

					})
					
				})
				// self.$router.push({name:'登陆无权限'});
			}
        },
		generateNewRouter:function(res){
			//动态增加router
			var addRouter=[];
			// addRouter.push(CustomRouter)
			addRouter=CustomRouter;
			//根据动态生成的router匹配后端返回的路由
			var newRouter=Permission.router(addRouter,res.data.resources);
			newRouter.unshift({
				path: '*',
				redirect: '/404',
				hidden: true
			})
			
			this.$router.options.routes=this.$router.options.routes.concat(newRouter)
			this.$router.addRoutes(newRouter)
		
		},
        

		linkToFindPassword:function(){
			this.$router.push({path:'/find-password'});
		},
		linkToRegister:function(){
			this.$router.push({path:'/register'});
		}

	},

}


</script>
<style lang="scss">
	.fresh{
		z-index: 0;
	position:relative;
	min-width: 1050px;
	height: 100%;
	min-height:600px;
	background: #65daff url('./../../../assets/images/conf/login/1.0.0/body-bg.png') repeat fixed top;
	// height:1080px;
}

</style>

<style scoped lang="scss">
.page-view{
	// position:relative;
	// height:100%;
	// min-height:600px;
	.mod-login{
		position:absolute;
		top:50%;
		left:50%;
		margin-left:-550px;
		margin-top:-260px;
		// margin:0 auto;
		height: 530px;
		background-color:#fff;
		border-radius: 10px;
		width:1100px;
		// width:100%;
		.login-l{
			float:left;
			background:#33384b url('./../../../assets/images/conf/login/1.0.0/login-bg.png') no-repeat;
			height:530px;
			max-width:680px;
			width:680px;
		}
		.login-r{
			display: inline-block;
			// background-color:#fff;
			float:right;
			.r-hd{
				width: 418px;
				height: 60px;
				padding: 46px 0 0 0;
				&:after{
					height: 4px;
					background: linear-gradient(top,#c9f4ff,#fff);
					background: -webkit-linear-gradient(top,#c9f4ff,#fff);
					background: -moz-linear-gradient( top,#c9f4ff,#fff);
					background: -o-linear-gradient(top,#c9f4ff,#fff);
					display: block;
					content: " ";
					position: relative;
    				top: -3px;
				}

				.hd-img{
					display: inline-block;
					margin: 0 0 30px 50px;
					img{
						position: relative;
    					top: 3px;
					}
				}
				.hd-descrp{
					display: inline-block;
					font-size: 18px;
					color: #333;
					// margin: 0 0 0 10px;
				}
				.hd-register{
					font-size: 18px;
					color: #ccc;
					position:absolute;
					right: 50px;
					line-height: 50px;
					cursor:pointer;
				}
				a:hover{
					color: #999;
				}
			}
			.tips{
				height:40px;
				line-height:40px;
				padding-left: 50px;
				color:#f35a5a;
				font-size:14px;
			}
			form{
				padding: 0 50px 0 50px;
				.r-text{
					margin: 0 0 20px 0;
					position: relative;
					background-color:#f2f6ff;
					border-radius: 5px;	
					border: 1px solid #f2f6ff;
					input{
						float:right;
						width: 268px;
						height: 50px;
						background-color:#f2f6ff!important;
						border: none;
						// border-radius: 5px;	
						padding-left: 10px;
						font-size: 18px;
						color: #333;
						line-height: 50px;
						// cursor:pointer;
					}
					input:-webkit-autofill { 
						background-color:#f2f6ff!important;
						-webkit-box-shadow: 0 0 0px 1000px #f2f6ff inset;
					} 
					::-webkit-input-placeholder { /* WebKit browsers */ 
						color: #ccc; 
					} 
					:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
						color: #ccc; 
					} 
					::-moz-placeholder { /* Mozilla Firefox 19+ */ 
						color: #ccc; 
					} 
					:-ms-input-placeholder { /* Internet Explorer 10+ */ 
						color: #ccc; 
					} 
					input[placeholder]{
						font-size:16px;
						// color:#999;
					}
					.r-descpt{
						position: relative;
						display:inline-block;
						height:50px;
						line-height:50px;
						padding: 0 0 0 10px;
						font-size: 28px;
						color: #999;
					}
					.refresh{
						position: absolute;
						right: 96px;
						top: 20px;
						font-size: 28px;
						color: #999;
						cursor:pointer;
					}
					img{
						position: absolute;
						right: 0;
						top: 1px;
						cursor:pointer;
					}
				}
				.r-chooece{
					position: relative;
					input{
						background-color: #fff;
						color:#999;
						width: 16px;
						height: 16px;
						position: relative;
						top:2px;
						cursor:pointer;
					}
					label{
						color: #333;
						padding: 0 0 0 10px;
						font-size: 14px;
						cursor:pointer;
					}
					.forget-pass{
						position: absolute;
						right: 0px;
						color: #333;
						font-size: 14px;
					}
				}
				.btn-login{
					width: 320px;
					height: 50px;
					border-radius:5px;
					background-color: #3dcaf5;
					color: #fff;
					border: 1px solid #3dcaf5;
					margin-top: 50px;
					font-size: 18px;
				}
				.disable{
					opacity:0.3;
				}
			}
		}
	}
	.mod-login:after{
		z-index: -1;
		content:"";
		position:absolute;
		top:0;
		left:30px;
		max-width: 1100px;
		width: 1040px;
		height: 530px;
		box-shadow: 0 25px 40px #4fc5f0;
		-moz-box-shadow: 0 25px 40px #4fc5f0;
		-webkit-box-shadow: 0 25px 40px #4fc5f0;
	}
}
</style>
