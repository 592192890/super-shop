<template>  
    <div>
        <step-header currentStep='3'></step-header>
        <section>
            <div class="mod-toolbar">
                <el-row class="img">
                    <img src="../../../../assets/images/conf/commodity-center/success.png"/>
                </el-row>
                <el-row class="success">
                    <div >恭喜您,商品发布成功！</div>
                </el-row> 
                <el-row class="edit">
                    <el-button @click="goViewProductDetail">去店铺查看商品详情</el-button>
                    <el-button @click="goEdit">重新编辑刚刚发布的商品</el-button>
                </el-row> 
                <el-row class="other">
                    <div>您还可以</div>
                </el-row> 
                <el-row class="tips">
                    <div>1.继续"<span class="weight" @click="goPublish">发布新商品</span>"</div>
                    <div>2.进入“我的商城”管理"<span class="weight" @click="goList">商品列表</span>"</div>
                </el-row> 
            </div>
            
        </section>
    </div>
</template>
<script>
import stepHeader from './stepHeader'
import config from '@/config'
export default {
    components:{
		stepHeader
	},
    data(){
        return {
           titles:[{id:1,name:'商品中心'},{id:2,name:'商品发布'},{id:3,name:'商品发布3'}],
           goodsId:''
        }
    },
    methods:{
        goViewProductDetail:function(){
            window.location.href=config.productDeatilHTML+this.goodsId+".html";
        },
        goEdit:function(){
            this.$router.push({name:'商品发布编辑',query:{goodsId:this.goodsId}})
        },
        goPublish:function(){
            this.$router.push({name:'商品发布1'})
        },
        goList:function(){
            this.$router.push({name:'商品列表'})
        }
    },
    mounted(){
        if(this.$route.params.goodsId){
            sessionStorage.setItem('goodsId',JSON.stringify(this.$route.params.goodsId));
        }
        this.goodsId=sessionStorage.getItem('goodsId');
    }
    
}
</script>
<style scoped lang="scss"> 
    .mod-toolbar{
        background-color:#ffffff;
        padding:25px;
        margin-top:0px;
    }
    .img{
        text-align:center;
        margin-top:30px;
        margin-bottom:20px;
    }
    .success{
        font-size:24px;
        color:#333333;
        text-align:center;
        margin-bottom:20px;
    }
    .edit{
        font-size:16px;
        color:#333333;
        text-align:center;
        margin-bottom:70px;
    }
    .other{
        text-align:center;
        margin-bottom:10px;
        font-size:20px;
    }
    .tips{
        text-align:center;
        font-size:16px;
        color:#666666;
    }
    .weight{
        color:#3dc8f6;
    }
</style>