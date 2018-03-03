<template>
<div class="no-right" :style="{ height: screenHeight +'px' }">
    <head-top title="欢迎登陆"></head-top>
    <div class="main-body">
        <div class="third-step">
            <div class="circle red">
                <i class="icon iconfontcom icon-show">&#xe607;</i>
            </div>
            <div class="inf">
                <span class="bigger">登陆失败！</span>
                <span class="middle">当前用户无店铺管理权限，请联系相应的店铺管理员</span>
                <span class="smaller"><em>{{time}}</em>秒后自动跳转到登陆界面</span>
            </div>
        </div>
    </div>
    <ft></ft>
</div>
</template>
<script>
import ft from '@/components/common/login/ft.vue'
import headTop from '@/components/common/login/head.vue'
export default {
    components:{
        ft,headTop
	},
    data(){
        return{
            time:"5",
            screenHeight:""
        }
    },
    mounted(){
		//设置页面高度
		this.screenHeight = document.documentElement.clientHeight;
        this.count();
    },
    methods:{
        count:function(){
            var self = this;
            var countSec = setInterval(function(){
                self.time--;
                if (self.time == 0) {
                    self.$router.push({path:'/login'});
                };
            },1000)
        },
    }
}
</script>
<style lang="scss" scoped>
@keyframes circleShow
{
from {
	opacity:0;
	font-size:0;
	left:14px;
	// top: -25px;
	}
to {
	opacity:1;
	font-size:36px;
	left:16px;
	// top: 28px;
	}
}

@-moz-keyframes circleShow /* Firefox */
{
from {
	opacity:0;
	font-size:0;
	left:14px;
	}
to {
	opacity:1;
	font-size:36px;
	left:16px;
	}
}

@-webkit-keyframes circleShow /* Safari 和 Chrome */
{
from {
	opacity:0;
	font-size:0;
	left:14px;
	// top: -25px;
	}
to {
	opacity:1;
	font-size:36px;
	left:16px;
	}
}

@-o-keyframes circleShow /* Opera */
{
from {
	opacity:0;
	font-size:0;
	left:14px;
	}
to {
	opacity:1;
	font-size:36px;
	left:16px;
	}
}
.no-right{
    position: relative;
}
.main-body{
	position: absolute;
    background-color: #fff;
	width:80%;
    min-width: 850px;
    height: 80%;
    top:100px;
    left:50%;
    margin-left:-40%;
	text-align: center;
}
.third-step{
    position:absolute;
    top:50%;
    width:100%;
    // top:50%;
    margin-top:-70px;
    text-align: center;
    // display:none;
}
.grenn{
    background-color:#56d993;
}
.red{
    background-color: #f95d5b;
}
.circle{	
    width:70px;
    height:70px;
    border-radius:50%;
    // background-color:#56d993;
    color:#fff;
    position:absolute;
    left:50%;
    margin-left:-36px;
    // line-height: 72px;
    .icon{
        
        font-size:36px;
        color:#fff;
        position: absolute;
        top: 28px;
        left: 16px;
    }
    .icon-show{
        animation: circleShow 0.8s;
        -moz-animation: circleShow 0.8s;	/* Firefox */
        -webkit-animation: circleShow 0.8s;	/* Safari 和 Chrome */
        -o-animation: circleShow 0.8s;	/* Opera */
    }
}
.inf{
    width:750px;
    position:absolute;
    top:102px;
    left:50%;
    margin-left:-375px;
    span{
        display:block;
    }
    .bigger{
        font-size:24px;
        margin-bottom:16px;
        color:#333;
    }
    .middle{
        font-size:16px;
        margin-bottom:20px;
        color:#333;
    }
    .smaller{
        font-size:14px;
        color:#999;
        em{
            font-style:normal;
        }
    }
}
</style>