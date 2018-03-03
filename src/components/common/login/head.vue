<template>
	<div class="clearfix">
		<div class="mod-shadow"></div>
		<el-col :span="24" class="mod-header">
			<el-col class="logo">
				<div class='logo-inner'>
					{{collapsed?'':sysName}}
				</div>
			</el-col>
			<el-col :span="10" class="userinfo">
				<div class="title">{{titleName}}</div>
			</el-col>
			<el-col v-if="hasContent" :span="4" class="login">
				<div>已有账号？<span @click="linkToLogin">立即登录</span></div>
			</el-col>
		</el-col>
	</div>
</template>
<script>
export default
{
	data(){
		return {
			collapsed:false,
			sysName:'商户管理平台'
		}
	},
	mounted(){
		return this.hasContent;
	},
	props: ['title','hasContent'],
	computed:{
		titleName:function(){
			return this.title;
		}
	},
	methods:{
		linkToLogin:function(){
			this.$router.push({path:'/login'});
		}
	}
}
</script>
<style scoped lang="scss">
	@import '~scss_vars';
	.mod-shadow {
		position:absolute;
		top:60px;
		left:0px;
		width:100%;
		box-shadow: 0px 5px 18px rgba(0,0,0, 0.69);
		height:1px;
		overflow:hidden;
		z-index:1;
		background:#dfdfdf;
	}
    .mod-header {
        height: 60px;
        line-height: 60px;
        background: #fff;
        color: #fff;
		position:relative;
        .userinfo {
            text-align: left;
            padding-right: 20px;
            float: left;
			.title{
				margin-left: 23px;
				color:#ccc;
				font-size:26px;
			}
        }
        .logo {
			width:230px;
            height: 60px;
            font-size: 20px;
            padding-left: 25px;
            padding-right: 20px;
            border-color: rgba(238, 241, 146, 0.3);
            border-right-width: 1px;
            border-right-style: solid;
			background:url('http://img1.bbgstatic.com/15dba8305fb_bc_5df8f270dd506fc8d0d3c992de68a85f_7x60.jpeg') repeat-x;
			box-shadow:5px 0px 20px #ccc;
			.logo-inner {
				padding-left:38px;
				background:url('http://img1.bbgstatic.com/15dba9e4c57_bc_3f28329c45d4f8f8b4d8a0f7de3b3bac_28x26.png') 0px 50% no-repeat;
			}
        }
		.login {
			float: right;
			color:#ccc;
			font-size:14px;
			text-align: right;
			padding-right: 30px;
			min-width: 180px;
			span{
				color:#3dcaf5;
				cursor: pointer;
				&:hover,&:active{
					text-decoration: underline;
				}
			}
		}
    }
</style>