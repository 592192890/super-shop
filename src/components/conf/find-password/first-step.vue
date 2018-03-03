<template>
<div class="first-step">
    <div class="center">
        <i class="icon iconfontcom">&#xe7b7;</i><input id="mobile" type="text" placeholder="请输入手机号码" v-model="tel" @input="allowLogin" @blur="phoneVerification"/>
    </div>
    <span class="tips one">{{tipsOne}}</span>
    <div class="center bottom">
        <i class="icon iconfontcom">&#xe60c;</i><input id="captcha" type="text" placeholder="请输入手机验证码" v-model="codeNum" @input="btnCanClick"/>
        <button  id="jGetCode" @click="getCode" :class="[canClick ? get : sec]" :disabled="!canClick">{{getOrCountText}}</button>
    </div>
    <span class="tips two">{{tipsTwo}}</span>
    <button id="jLoginBtn" class="center button" :disabled="!canSubmit" :class="[canSubmit ? '' : disable]" @click="login">下一步</button>
</div>
</template>
<script>
export default {
    data(){
        return{
            tel:"",
            codeNum:"",
            tipsOne:"",
            tipsTwo:"",
            canClick:true,
            smsTime:"60",
            getOrCountText:"获取验证码",
            loading:false,
            wholeLoading:true,
            get:"get",
            sec:"sec",
            canSubmit:false,
            disable:"disable",
        }
    },
    methods:{
        //手机号码验证
        phoneVerification:function(){
            if(/^1[3456789]\d{9}$/g.test(this.tel)){
                this.tipsOne="";
                return true;
            }else{
                this.tipsOne="手机号码格式不正确";
                return false;
            }
        },
        allowLogin:function(){
			if(/^1[3456789]\d{9}$/g.test(this.tel)){
                this.tipsOne="";
            }
            this.btnCanClick();
		},
        //发送验证码请求
        getCode: function(){
            var self = this;
            var json = {
                "mobile" : self.tel,
            }
            self.loading=true;
            if(self.tel && self.phoneVerification()){
                self.canClick=false;
                self.$message('验证码发送成功!');//test
                self.countDown();//test
                // io.post(smsUrl, json, function(rst){
                //     self.loading=false;
                //     self.$message('验证码发送成功!');
                //     if(rst.data&&rst.data.leftSecond){
                //         self.smsTime = parseInt(rst.data.leftSecond);
                //         self.countDown();
                //     }else{
                //         self.countDown();//默认60s
                //     }
                // }, function(e){
                //     self.loading=false;
                //     e.msg && self.$message({
                //         message: e.msg,
                //         type: 'warning'
                //     });
                //     self.codeNum="";
                //     self.canClick=false;
                //     self.getOrCountText="重新获取";
                // });
            }else if(!self.tel){
                self.tipsOne = "请填写手机号";
            }
        },
        //获取验证码倒计时
        countDown: function(){
            var self = this;
            self.canClick=false;
            var timeId = setInterval(function(){
                self.smsTime--;
                self.getOrCountText= self.smsTime + 's';
                if(self.smsTime===0){
                    self.smsTime="60";
                    timeId && clearInterval(timeId);
                    self.canClick=true;
                    self.getOrCountText="重新获取";
                }  
            },1000)
        },
        btnCanClick:function(){
            var self = this;
            if(self.tel && self.codeNum.length==5 && !self.tipsOne && !self.tipsTwo){
                self.canSubmit = true;
            }else{
                self.canSubmit = false;
            }
        },
        //提交按钮逻辑
        login: function(){
            var self = this,
                param;
                param = {
                    "mobile" : self.telNum,
                    "captcha" : self.verfCode,
                };  
                self.wholeLoading=true;
                // io.post(authCode, param, function(res){
                    self.wholeLoading=false;
                    //进入步骤二组件
                    self.$emit('firstStepDone');
                // }, function(e){
                //     self.wholeLoading=false;
                //     self.tipsTwo = e.msg;
                //     self.codeNum="";
                //     self.canSubmit = false;
                // });         
        },
        // retureLogin:function(){
        //     this.$router.push({path:'/login'});
        // }

    }
}
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.first-step{
    position:absolute;
    top:38%;
    width:100%;
    // top:50%;
    // margin-top:-185px;
    text-align: center;
    // display:none;
}
.center{
    position:relative;
    display:block;
    left:50%;
    margin-left:-170px;
    width:340px;
    height:50px;
    margin-bottom:30px;
    background-color:#f1f8fe;
    border-radius:3px;
    font-size:18px;
    line-height: 50px;
    .icon{
        font-size:28px;
        color:#666;
    }
    input{
        position:relative;
        float:right;
        margin-right:4px;
        width:290px;
        height:50px;
        background-color:#f2f6ff;
        border:none;
        color:#333;
        font-size:16px;
    }
    input:-webkit-autofill { 
        background-color:#f2f6ff!important;
        -webkit-box-shadow: 0 0 0px 1000px #f2f6ff inset;
    }
    ::-webkit-input-placeholder { /* WebKit browsers */ 
        color: #bcbcbc; 
    } 
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
        color: #bcbcbc; 
    } 
    ::-moz-placeholder { /* Mozilla Firefox 19+ */ 
        color: #bcbcbc; 
    } 
    :-ms-input-placeholder { /* Internet Explorer 10+ */ 
        color: #bcbcbc; 
    } 
    .get,.sec{
        position:absolute;
        right:5px;
        width:132px;
        height:40px;
        top:5px;
        border:none;
        background-color: #FFF;
        color:#333;
        line-height: 40px;
        font-size:16px;
    }
    .sec{
        // display:none;
        color:#3dcaf5;
    }
    .hide{
        display:none!important;
    }
    .show{
        display:inline-block!important;
    }
}
.bottom{
			margin-bottom:40px;
		}
.button{
    background-color:#3dcaf5;
    border:none;
    color:#fff;
    font-size:18px;
}
.disable{
    // background-color:#ccc;
    opacity:0.3;
}
.tips{
    position:relative;
    left:50%;
    margin-left:-170px;
    display:block;
    width:293px;
    height:30px;
    line-height: 30px;
    // vertical-align: middle;
    margin-top:-30px;
    color:#f15a58;
    text-align: left;
    padding-left: 47px;
    font-size:14px;
}
.two{
    height:40px;
}
</style>
