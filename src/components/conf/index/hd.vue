<template>
	<div class="clearfix mod-hd">
		<div class="mod-shadow"></div>
		<el-col :span="24" class="mod-header">
			<el-col class="logo">
				<div :class="collapsed?'logo-collapse-width':'logo-inner'">
					{{collapsed?'':sysName}}
				</div>
			</el-col>
			<el-col :span="9" class="mod-hor-nav" v-if="!hiddenMenu">
				<el-tabs v-model="activeName" @tab-click="handleClick" >
					<el-tab-pane :name="item.path" v-for='item in $router.options.routes' v-if="!item.hidden" :key="item.path">
						<span slot="label"><i class="iconfontmod" v-html="item.iconCls" v-if="item.iconCls"></i> {{ item.name }}</span>
					</el-tab-pane>
				</el-tabs>	
			</el-col>
			<el-col :span="2" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img src="../../../assets/images/conf/login/1.0.0/user-img.png" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="modifyPwd">修改密码</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出账号</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
			<el-col :span="2" class="userinfo" v-if="!isHide">
				<router-link style="color:#3dc8f6;text-align:right;" :to="{ name: '选择进入店铺'}">切换店铺</router-link>
			</el-col>
			<el-col :span="4" class="userinfo" v-if="!isHide">
				<el-tooltip class="item" effect="light" :content="currentShopName" placement="bottom">
					<span class="shopName">当前店铺：{{currentShopName}}</span>
				</el-tooltip>
			</el-col>

			<!--临时代码-->
			<el-col :span="2" v-if="!isHide&&oldShop">
				<span style="color:#3dc8f6;text-align:left;cursor:pointer" @click="goOtherSystem">店铺后台</span>
			</el-col>
		</el-col>
		<el-dialog
			title="进入店铺后台"
			:visible.sync="dialogVisible"
			width="30%" class="permission-dailog">
			<ul class="shop-item clearfix">
				<li v-for="(shop, index) in permissionList" :key="shop.id">
					<el-radio class="radio" v-model="shopType" :label="shop.id">{{ shop.shopName}}</el-radio>
				</li>
			</ul>
			<el-button type="primary" @click="goShop" size="large" style="width:100%;margin-top:20px;margin-bottom:20px;">选择进入店铺</el-button>	
		</el-dialog>
	</div>
</template>
<script>
import config from '@/config.js'
export default
{
	data(){
		return {
			activeIndex: '1',
			activeIndex2: '1',
			collapsed:false,
			sysName:'商户管理平台',
			sysUserAvatar:'',
			activeName:'/'+location.pathname.split('/')[1],
			sysUserName:'',
			currentShopName:'',
			//临时代码
			dialogVisible:false,
			permissionList:[],
			shopType:'',
			oldShop:false//是否有老店铺后台权限
		}
	},
	methods: {
		modifyPwd(){
			this.$router.push({name:'找回密码'})
		},
		handleClick(tab, event){
			this.$router.push(tab.name);
			this.bus.$emit('hd/navClick', { parentPath:tab.name });
		},
		logout(){
			var _this = this;
			this.$confirm('确认退出吗?', '提示',
			{
				//type: 'warning'
			}).then(() =>
			{
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
				
				//退出
				var url=this.$apiUrl.logoutUrl;
				this.$ajax.get(url).then(res=>{
					if(res.error==0){
						this.$router.push('/login');
					}else{
						this.$message({
							type:'error',
							message:res.msg
						})
					}
				})
	
			}).catch(() =>
			{

			});
		},
		//临时代码
		goOtherSystem(){
			var url=this.$apiUrl.goOldSystemUrl;
			this.$ajax.get(url).then(res=>{
				if(res.error==0){
					if(res.data.shopInfo){
					 	//如果有权限直接跳转
						window.location.href=config.exchangeProduct+"rest/index"
						
					 }else{
						//无权限弹出对话if
						// if(res.data.shopInfos&&res.data.shopInfos.length>0){
						// 	this.dialogVisible=true;
						// 	this.permissionList=res.data.shopInfos;
						// 	this.shopType=res.data.shopInfos[0].id
						// }else{
						// 	this.$message({
						// 		type:'warning',
						// 		message:'无店铺后台权限！'
						// 	})
						// }
						this.$message({
							type:'warning',
							message:'无店铺后台权限！'
						})
						
					 }
				}
			})
		},
		goShop(){
			//获取选中的店铺名
			for(var i=0;i<this.permissionList.length;i++){
				var item=this.permissionList[i];
				if(this.shopType==item.id){
					localStorage.setItem('header-shopName',item.shopName)

					break;
				}
			}
			var url=this.$apiUrl.selectShopUrl+"?shopId="+this.shopType;
			
			this.$ajax.get(url).then(res=>{
				if(res.error==0){
					window.location.href="http://shopmanage.yunhou.com/rest/index"
				}
			})
		}
	},
	props: ['bus', 'hiddenMenu','isHide'],
	mounted(){
		let self = this
		// 如果刷新页面，需要重新获取当前店铺
		this.currentShopName=localStorage.getItem('header-shopName')

		this.oldShop=localStorage.getItem('oldShop')?true:false;
		bus.$on('goList', function(obj){
			self.handleClick(obj)
		})
	},
	watch:{
        $route(){
            this.activeName='/'+location.pathname.split('/')[1]
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
		//z-index: 3000;
		.userinfo {
			span.shopName{
				color:#999999;
				text-align:right;
				height:20px;
				vertical-align:middle;
				line-height:20px;
				display:inline-block;
				width:100%;
				overflow:hidden;
				text-overflow:ellipsis;
				white-space:nowrap
			}
			text-align: right;
			padding-right: 20px;
			float: right;
			.userinfo-inner {
				cursor: pointer;
				color: #333;
				line-height:normal;
				font-size:14px;
				img {
					width: 32px;
					height: 32px;
					border-radius: 20px;
					margin: 13px 0px 13px 10px;
					float: right;
					border:2px solid #adbec5;
				}
			}
		}
		.logo {
			width:204px;
			height: 60px;
			font-size: 20px;
			padding-left: 18px;
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
	}
	

	.permission-dailog li{
		height:30px;
		line-height:30px;
		text-align:left;
		width:50%;
		display:inline-block;
	}
</style>
<style lang="scss">
	.mod-hor-nav {
		padding-left:40px;
		.el-tabs__item{
			padding:0 12px;
		}	
	}
</style>
