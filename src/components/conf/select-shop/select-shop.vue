<template>
    <div v-if="showSelectShop">
        <hd :hiddenMenu="true" isHide="true"></hd>
        <div class="mod-select-shop" >
			<div class="inner" v-if="showBtn">
				<h3>请选择您需要进入的店铺</h3>	
				<div class="tips">营销活动、开票功能可选择任意店铺进入</div>
				<div class="mod-shop-search">
					<el-form ref="form" :model="form" label-width="0px" :inline="true">
						<el-form-item>
							<el-input placeholder="请输入店铺名称" v-model="form.searchInput"></el-input>
						</el-form-item>
						<el-button type="primary" :disabled="btnDisabled" @click="searchShop">搜索</el-button>
					</el-form>
				</div>
				<ul class="shop-item clearfix" :class="shrink?'shrink':''">
					<li v-for="(shop, index) in shops" :key="shop.id" @click="changeShopType(shop)">
						<el-radio class="radio" v-model="shopType" :label="shop.id">{{ shop.shopName}}</el-radio>
					</li>
				</ul>
				<div v-if="shops.length==0" class="no-shop">没有此店铺</div>
				<a class="more" @click="getMore" v-if="showMore">{{ shrink?'查看更多店铺>':'收起>' }}</a>
				<div class="shop-btn" v-if="showBtn">
					<el-button type="primary" @click="submitFun" size="large" :disabled="shops.length==0">点击进入</el-button>	
				</div>
			</div>
			<div v-if="!showBtn" class="inner">
				<h3>没有店铺</h3>	
			</div>
        </div>
		<ft></ft>
    </div>
</template>
<script>
import hd from '../index/hd.vue'
import ft from '../index/ft.vue'
    export
    default
    {
        data()
            {
				return {
					showSelectShop:false,
					shopName:'',
					shopType: '',
					shrink:true,
					showMore:false,
					showBtn: false,
					btnDisabled:true,
					form:{
						searchInput:''
					},
					shops:[],
					_shops:[]
				}
            },
            components:
            {
                hd,ft
			},
			methods: {
				changeShopType:function(shop){
					this.shopName=shop.shopName;
				},
				getMore(){
					this.shrink = !this.shrink;	
				},
				submitFun(){
					var url=this.$apiUrl.selectShopUrl+"?shopId="+this.shopType;
					this.$ajax.get(url).then(res=>{
						if(res.error==0){
							sessionStorage.setItem('selectShop/shopType', this.shopType);
							
							localStorage.setItem('header-shopName',this.shopName);
							this.$router.push({name:'店铺首页'});
						}else{
							this.$message({
								type:'error',
								message:res.msg
							})
						}
						
					})
					
					
				},
				searchShop(){
					let val = (this.form.searchInput).toString(); 
					let self = this;
					this.showMore = false;
					this.shrink = false;
					this.shops = this._shops.filter(function(item){
						if(item.shopName.indexOf(val)>-1){
							return item;
						}
					})||[];
					if(this.shops.length!=0){
						self.shopType = self.shops[0]['id'];
					}
				}
			},
			mounted(){
				this.$ajax.post('http://shopmanage.yunhou.com/api/member/getUserShops',{}).then(res=>{
					if(res.error==0){
						// res.data=res.data.filter(v=>{
						// 	if(v.onlineOffline=='online'){
						// 		return v
						// 	}
						// })
						if(res.data.length!=0){
							this.shopType = res.data[0]['id'];	
							this.shopName=res.data[0]['shopName'];	
							this.shrink = (res.data.length>6);
							this.showMore = this.shrink;
							this.showBtn = true;
							this.showSelectShop = (res.data.length>1);
							this.btnDisabled=false;
							if(!this.showSelectShop){
								var url=this.$apiUrl.selectShopUrl+"?shopId="+res.data[0].id;
								this.$ajax.get(url).then(res=>{
									if(res.error==0){

										localStorage.setItem('header-shopName',this.shopName);
										this.$router.push({name:'店铺首页'});
									}else{
										this.$message({
											type:'error',
											message:res.msg
										})
									}
									
								})
								
							}
						}else if(res.data.length==0){
							this.$message({
								type:'warning',
								message:'该用户名下没有任何店铺，请找相关人员开通店铺权限！'
							})
							//退出登录，以防陷入死循环
							var url=this.$apiUrl.logoutUrl;
							this.$ajax.get(url).then(res=>{
								if(res.error==0){
									this.$router.push('/login');
								}
							})
							
						}
						this._shops = this.shops = res.data;
					}
					
				});
			}
    }
</script>
<style lang="scss">
	.mod-select-shop {
		background:#fff;
		border-radius:4px;
		margin:30px 165px 40px;
		padding:60px 0px 100px;
		min-height:300px;
		.inner {
			width:540px;	
			margin:0 auto 0;
			h3 {
				height:60px;	
				line-height:60px;
				display:block;
				font-size:30px;
				text-align:center;
			}
			.tips {
				color:#f35a5a;	
				text-align:center;
			}
			.shop-item {
				li {
					height:40px;
					line-height:40px;	
					width:50%;
					display:inline-block;
					float:left;
					.el-radio {
						margin:0px 20px;	
						display:block;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					&:hover {
						background:#f4f6f8;
					}
				}
			}
			.no-shop {
				text-align:center;
				width:100%;
			}
			.shrink {
				height:120px;	
				overflow:hidden;
			}
			.more {
				display:block;
				height:50px;	
				line-height:50px;
				color:#3dc8f6;
				text-align:right;
				font-size:14px;
				cursor:pointer;
				margin-bottom:30px;
			}
			.shop-btn {
				text-align:center;
				margin:20px 0 0;
				.el-button {
					width:322px;	
				}
			}
		}
	}
	.mod-shop-search {
		width: 460px;
		margin: 30px auto 0px;
		.el-form--inline .el-form-item__content {
			width:385px;
		}	
	}
</style>
