<template>
	<div>
		<section class="mod-item">
			<h3 class="mod-title">店铺名称</h3>
			<ul class="mod-shop-info">
				<li>
					<p class="iconfont iconfontmod">&#xe607;</p>	
					<p>账号</p>
					<p>{{userInfo.loginName}}</p>
				</li>	
			
				<li>
					<p class="iconfont iconfontmod">&#xe60a;</p>	
					<p>店铺有效期</p>
					<p>{{userInfo.validDate?userInfo.validDate:'长期'}}</p>
				</li>
			</ul>
		</section>
		<section  class="mod-link">
			<h3 class="link-hd">店铺商品快捷链接</h3>
			<div class="link-bd">
				<!--1上架 2下架 0所有-->
				<a @click="goList(1)">出售中商品</a>
				<a @click="goList(0)">仓库商品</a>
				<a @click="goList(2)">下架商品</a>
			</div>
		</section>
		<section class="mod-link">
			<h3 class="link-hd">交易快捷链接</h3>
			<div class="link-bd">
				<a @click="goOtherSystem('rest/order/list?viewStatus=wait_pay')">待付款</a>
				<a @click="goOtherSystem('rest/order/list?viewStatus=paid')">待发货</a>
				<a @click="goOtherSystem('rest/order/reverse')">待审核售后申请单</a>
			</div>
		</section>
		<section class="mod-item">
			<h3 class="mod-table-title">近30天销量排行</h3>
			<el-table :data="tableData" style="width: 100%" v-loading="listLoading">
				<el-table-column prop="sortNumber" label="排名" width="100px">
				</el-table-column>
				<el-table-column label="商品" width="350px">
					<template scope="scope">
						<div class="mod-pro-list">
							<a class="list-img" :href="productDetailUrl+ scope.row.id +'.html'">
								<img :src="scope.row.image" class="jImg">
							</a>
							<div class="list-ctn">
								<a class="h3" :href="productDetailUrl+ scope.row.id +'.html'">{{ scope.row.name }}</a>
								<p class="txt-overflow">商品条码: {{ scope.row.barcode }}</p>
								<p class="txt-overflow">商品货号: {{ scope.row.bn }}</p>
							</div>
						</div>
					</template>
					<!-- pro -->
				</el-table-column>
				<el-table-column label="价格信息" width="220px">
					<template scope="scope">
						<p>成本价：￥{{ scope.row.cost }}</p>
						<p>销售价：￥{{ scope.row.price }}</p>
						<p>销售毛利率：{{scope.row.grossProfitMargin}}</p>
					</template>
				</el-table-column>
				<el-table-column prop="marketable" label="状态">
				</el-table-column>
				<el-table-column prop="store" label="库存">
				</el-table-column>
				<el-table-column prop="saleCount" label="近30天销量" width="120px">
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="mod-toolbar" v-loading="listLoading">
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
					:page-size="pageSize" :total="total" style="float:right;" :current-page="currentPage">
				</el-pagination>
			</el-col>
		</section>
	</div>
</template>
<script>
	import config from '../../../../config.js'
    export default{
        data()
            {
                return {
                    listLoading: true,
                    currentPage: 1,
                    sels: [],
                    tableData: [],
                    total: 0,
					pageSize:20,
					userInfo:{
						validDate:'',
						loginName:''
					},
					productDetailUrl:config.productDeatilHTML,
					exchangeProduct:config.exchangeProduct
                }
            },
            methods:{
            	goList(num){
            		bus.$emit('goList', {name:'/commodity-center'})
	                this.$router.push({name:'商品列表', query:{marketable:num}})
	            },
				goOtherSystem(paramsUrl){
					//临时代码
					var url=this.$apiUrl.goOldSystemUrl;
					this.$ajax.get(url).then(res=>{
						if(res.error==0){
							if(res.data.shopInfo){
								//如果有权限直接跳转
								window.location.href=this.exchangeProduct+paramsUrl
								
							}else{
								
								this.$message({
									type:'warning',
									message:'无店铺后台权限！'
								})
								
							}
						}
					})

				},
                formaStatus(row, column){
					return row.status ? '上架' : '下架';
				},
				handleCurrentChange(val){
					this.getThirtyOrderData(val);
				},
				getThirtyOrderData(index){
					this.listLoading = true;
					var url=this.$apiUrl.thirtyOrderUrl;
					var params={
						currentPage:index||1,
						pageSize:this.pageSize
					}
					this.$ajax.get(url,params).then((res) =>{
						if(res.error==0){
							this.total = res.data.totalRow;
							this.tableData = res.data.list;
							this.currentPage=res.data.currentPage;
							this.listLoading = false;
						}
						
					});
				},
				getUserInfo(){
					var url=this.$apiUrl.getUserInfoUrl;
					this.$ajax.get(url).then(res=>{
						if(res.error==0){
							//日期转化
							if(res.data.shopInfo.validDate){
								var currentDate=new Date(res.data.shopInfo.validDate)
								var year=currentDate.getFullYear();
								var month=parseInt(currentDate.getMonth()+1)<10?"0"+parseInt(currentDate.getMonth()+1):parseInt(currentDate.getMonth()+1);
								var day=currentDate.getDate()<10?"0"+currentDate.getDate():currentDate.getDate()
								this.userInfo.validDate=year+"-"+month+"-"+day;
							}
							// this.userInfo.validDate=res.data.shopInfo.validDate;
							this.userInfo.loginName=res.data.sysUser.loginName
						}
					})
				}
            },
            mounted(){
                this.getThirtyOrderData();
				this.getUserInfo();
            }
    }
</script>
<style scoped lang="scss">
    .mod-title {
		height:40px;
		line-height:40px;
		background:#fff;
		border-radius:4px;
		padding-left:20px;
		font-size:18px;
    }
	.mod-table-title {
		font-size:14px;
		color:#bbbbbb;
		padding-bottom:15px;
	}
	.mod-item {
		color:#666;
		&:not(:first-child){
			margin-top:25px;	
		}
	}
    .mod-shop-info {
		margin-top:5px;
		overflow:hidden;
		background:#fff;
		border-radius:4px;
		li {
			width:25%;	
			display:inline-block;
			float:left;
			text-align:center;
			height:150px;
			p {
				&:nth-child(2) {
					color:#999;	
					margin-top:10px;
				}
				&:nth-child(3) {
					font-size:14px;	
				}
			}
			.iconfont {
				font-size:50px;	
				height:50px;
				line-height:50px;
				overflow:hidden;
				color:#3dc8f6;
				margin:25px 0px 10px;
			}
		}
    }
    .mod-link {
		background:#fff;
		border-radius:4px;
		padding:25px 20px 20px;
		margin-top:25px;
		.link-hd {
			font-size:18px;
			padding-bottom:30px;
			color:#666;
		}
        a {
            margin-right: 10px;
			color:#3dc8f6;
			text-decoration:underline;
			width:200px;
			display:inline-block;
			font-size:14px;
			cursor:pointer;
        }
    }
    .mod-pro-list {
        margin: 10px 0px;
        .list-img {
            width: 72px;
            height: 72px;
            float: left;
			display:block;
            img {
                width: 72px;
                height: 72px;
            }
        }
        .list-ctn {
			.h3 {
				font-weight:bold;
				color:#3dc8f6;
			}
            overflow: hidden;
            padding-left: 10px;
        }
    }
</style>
