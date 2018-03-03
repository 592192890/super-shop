<template>
	<div>
        <el-row class="header" :span="24">
            <el-col :span="3" class="step" style="text-align:left">
                <span v-if="currentStep!='1'" class="step1-visited">
                    <img src="../../../../assets/images/conf/commodity-center/tick.png" />
                </span>
                <span v-if="currentStep=='1'" class="step1-current">
                    1
                </span>
                <span v-bind:class="{active:currentStep=='1'}">选择分类</span>    
            </el-col>
            <el-col :span="7" class="step-img">
                <div v-if="currentStep=='1'">
                    <img src="../../../../assets/images/conf/commodity-center/line.png"/>
                </div>
                <div v-if="currentStep!='1'">
                    <img src="../../../../assets/images/conf/commodity-center/line-active.png"/>
                </div>
                
            </el-col>
            <el-col :span="4" class="step">
                <span v-if="currentStep=='3'" class="step2-visited">
                    <img src="../../../../assets/images/conf/commodity-center/tick.png" />
                </span>
                <span v-if="currentStep=='2'" class="step2-current">
                    2
                </span>
                <span v-if="currentStep=='1'" class="step2-noVisited">
                    2
                </span>
                <span v-bind:class="{active:currentStep=='2'}">填写商品详情</span>
            </el-col>
            <el-col :span="6" class="step-img">
                <div v-if="currentStep!='3'">
                    <img src="../../../../assets/images/conf/commodity-center/line.png"/>
                </div>
                <div v-if="currentStep=='3'">
                    <img src="../../../../assets/images/conf/commodity-center/line-active.png"/>
                </div>
                
            </el-col>
            <el-col :span="4" class="step" style="text-align:right">
                <span v-if="currentStep=='3'" class="step3-current">
                    3
                </span>
                <span v-if="currentStep!='3'"class="step3-noVisited">
                    3
                </span>
                <span v-bind:class="{active:currentStep=='3'}">商品发布成功</span>
            </el-col>
        </el-row>
    </div>

</template>
<script>
    export default {
        props:['currentStep'],
        data(){
            return {

            }
        }
    }
</script>
<style scoped lang="scss">
    .header{
        padding:30px 40px;
        
        background-color:#ffffff;
        
        .step-img{
            height:40px;
            line-height:40px;
            img{
                width:100%;
                vertical-align: middle;
            }
        }
        .step{
            text-align:center;
            span{
                &.active{
                    color:#333333;
                }
                text-align:center;
                color:#999999;

                display:inline-block;
                line-height:40px;
                font-size:16px;
            }
            .step1-visited{
                border-radius:50%;
                line-height:25px;
                width:25px;
                height:25px;
                border:1px solid #3dc8f6;
            }
            .step1-current{
                border-radius:50%;
                line-height:25px;
                width:25px;
                height:25px;
                background-color:#3dc8f6;
                color:#ffffff;
            }
            .step2-visited{
                border-radius:50%;
                line-height:25px;
                width:25px;
                height:25px;
                border:1px solid #3dc8f6;
            }
            .step2-current{
                border-radius:50%;
                line-height:25px;
                width:25px;
                height:25px;
                background-color:#3dc8f6;
                color:#ffffff;
            }
            .step2-noVisited{
                border-radius:50%;
                line-height:25px;
                width:25px;
                height:25px;
                border:1px solid #999999;
                color:#999999;
            }
            .step3-current{
                 border-radius:50%;
                 line-height:25px;
                 width:25px;
                 height:25px;
                 background-color:#3dc8f6;
                 color:#ffffff;
            }
            .step3-noVisited{
                 border-radius:50%;
                 line-height:25px;
                 width:25px;
                 height:25px;
                 border:1px solid #999999;
                 color:#999999;
            }
            display:inline-block;
        }
    }
</style>  