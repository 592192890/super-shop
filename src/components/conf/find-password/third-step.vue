<template>
<div class="third-step">
    <div class="circle" :class="[bgc?grenn:red]">
        <i class="icon iconfontcom icon-show" v-if="bgc">&#xe606;</i>
        <i class="icon iconfontcom icon-show" v-if="!bgc">&#xe607;</i>
    </div>
    <div class="inf">
        <span class="bigger">{{statusInf}}</span>
        <span class="smaller"><em>{{time}}</em>秒后自动跳转到登陆界面</span>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            grenn:'grenn',
            red:'red',
            time:"5",
        }
    },
	props: ['statusText','bgc'],
	computed:{
		statusInf:function(){
			return this.statusText;
		},
    },
    updated(){
        this.count();
        return this.bgc;
    },
    methods:{
        count:function(){
            var self = this;
            var countSec = setTimeout(function(){
                self.time--;
                if (self.time === 0) {
                    self.$router.push({path:'/login'});
                };
            },1000)
            self.$nextTick(function () {
                countSec;
            })
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
    .smaller{
        font-size:14px;
        color:#999;
        em{
            font-style:normal;
        }
    }
}
</style>
