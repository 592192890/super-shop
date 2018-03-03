<<template>
	<div class="page-view find-password" :style="{ height: screenHeight +'px' }" >
        <head-top title="安全中心-修改密码"></head-top>
        <div class="main-body">
            <div class="head">
				<span class="step-one" :class="{'active':firstStepShow || secondStepShow || thirdStepShow}">验证身份</span>
				<span class="step-two middle" :class="[{'active':secondStepShow || thirdStepShow},{'all-dark':firstStepShow},{'show-one':secondStepShow},{'all-show':thirdStepShow}]">设置新密码</span>
				<span class="step-three" :class="{'active':thirdStepShow}">修改密码成功</span>
			</div>
            <transition-group tag="div" name="fade" mode="out-in">
                <first-step
                    key="firstStep" 
                    v-show="firstStepShow"
                    @firstStepDone="showSecondStep">
                </first-step>
                <second-step 
                    key="secondStep"
                    v-show="secondStepShow"
                    @secondStepDone="showThirdStep"
                    @thirdStatusOk="thirdStatusOk"
                    @thirdStatusErr="thirdStatusErr"
                ></second-step>
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
import firstStep from '@/components/conf/find-password/first-step.vue'
import secondStep from '@/components/conf/find-password/second-step.vue'
import thirdStep from '@/components/conf/find-password/third-step.vue'
import Vue from 'vue'
export default {
	components:{
        ft,headTop,firstStep,secondStep,thirdStep
	},
	data(){
        return{
            statusText:"",//修改密码状态提示文字
            icon:"",//成功或失败的状态图标
            bgc:"",//成功或失败的图标背景颜色，1绿色，0红色
            firstStepShow:true,//当前是第一步状态
            secondStepShow:false,//当前是第二步状态
            thirdStepShow:false,//当前是第三步状态
            screenHeight:""
        }
    },
    mounted(){
		//设置页面高度
		this.screenHeight = document.documentElement.clientHeight;
	},
    methods:{
        showSecondStep:function(){
            this.firstStepShow=false;
            this.secondStepShow=true;
            this.thirdStepShow=false;
        },
        showThirdStep:function(){
            this.firstStepShow=false;
            this.secondStepShow=false;
            this.thirdStepShow=true;
        },
        thirdStatusOk:function(){
            this.statusText="恭喜您提交成功！",
            this.bgc=true
        },
        thirdStatusErr:function(){
            this.statusText="提交失败",
            this.bgc=false
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
.find-password{
    height: 100%;
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
	.head{
		position: relative;
		top:70px;
		min-width:830px;
		span{
			display:inline-block;
			height:42px;
			width:100px;
			border-radius:21px;
			background-color:#f2f2f2;
			color:#999;
			font-size:16px;
			padding:0 20px;
			text-align: center;
			line-height: 42px;
		}
		.active{
			background-color:#3dc9f7;
			color:#fff;
		}
		.all-dark{
			position: relative;
			margin:0 180px;
		}
		.all-dark{
			&:before,&:after{
				position:absolute;
				top:21px;
				content:"";
				height:2px;
				width:185px;
				background-color:#f2f2f2;
			}
			&:before{
				left:140px;
			}
			&:after{
				right:139px;
			}
		}
		.all-show{
            position: relative;
			margin:0 180px;
			&:before,&:after{
				position:absolute;
				top:21px;
				content:"";
				height:2px;
				width:185px;
				background-color:#3dc9f7;
			}
			&:before{
				left:140px;
			}
			&:after{
				right:140px;
			}
		}
		.show-one{
            position: relative;
			margin:0 180px;
			&:before,&:after{
				position:absolute;
				top:21px;
				content:"";
				height:2px;
				width:185px;
			}
			&:before{
				left:140px;
				background-color:#f2f2f2;
			}
			&:after{
				right:140px;
				background-color:#3dc9f7;
			}
		}
    }
}
</style>
