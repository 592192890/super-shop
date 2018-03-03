<template>
<div class="second-step">
    <div class="center">
        <i class="icon iconfontcom">&#xe60c;</i><input id="jNewPassword" type="password" placeholder="密码由6-20个数字和字母组合" v-model="password" @blur="isPassword" @input="passwordRegex"/>
        <div class="level" v-if="leveShow">
            <div class="text">安全程度</div>
            <span class="graph good" v-if="isEnough">弱</span>
            <span class="graph better" v-if="isMedium">中</span>
            <span class="graph best" v-if="isStrong">强</span>
        </div>
    </div>
    <span class="tips one">{{tipsOne}}</span>
    <div class="center bottom">
        <i class="icon iconfontcom">&#xe60c;</i><input id="jCheckPassword" type="password" placeholder="请再次输入密码" v-model="passwordCheck" @input="clearTipsTwo"/>
    </div>
    <span class="tips two">{{tipsTwo}}</span>
    <button id="jLoginBtn" class="center button" :disabled="!canSubmit" :class="[canSubmit ? '' : disable]" @click="login">下一步</button>
</div>
</template>
<script>
export default {
    data(){
        return{
            password:"",
            passwordCheck:"",
            tipsOne:"",
            tipsTwo:"",
            leveShow:false,//显示密码等级
            isEnough:false,//弱
            isMedium:false,//中等
            isStrong:false,//强
            loading:false,
            wholeLoading:true,
            canSubmit:false,
            disable:"disable",
        }
    },
    methods:{
        //判断新密码格式
        isPassword:function(){
            var passwordRegex = new RegExp("^(?=.*[0-9].*)(?=.*[a-zA-Z].*).{6,19}.*$", "g");
            if(passwordRegex.test(this.password)){
                this.tipsOne="";
                return true;
            }else if(!passwordRegex.test(this.password) && this.password){
                this.tipsOne="密码由6-20个数字和字母组合";
                return false;
            }
        },
        //判断用户是否有重新输入动作，消灭提醒,输入过程中格式正确，消灭提醒
        clearTipsOne:function(){
            var passwordRegex = new RegExp("^(?=.*[0-9].*)(?=.*[a-zA-Z].*).{6,19}.*$", "g");
             if(passwordRegex.test(this.password)){
                this.tipsOne = "";
            }  
        },
        //验证密码强度
        passwordRegex:function(){
            var self = this;
            self.clearTipsOne();
            self.btnCanClick();
            //密码为12位及以上并且字母数字大写字母三项都包括
            var strongRegex = new RegExp("^(?=.{12,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$", "g");
           
            //密码为八位及以上并且字母、数字、大写字母三项中有两项
            var mediumRegex = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
            //密码为6位以上数字字母组合
            var enoughRegex = new RegExp("(?=.{6,}).*", "g");
            if(!self.password){
                self.leveShow=false;
                self.tipsOne="";
            } else if (strongRegex.test(self.password)) {
                self.leveShow=true;
                self.isEnough=false;
                self.isMedium=false;
                self.isStrong=true;
            } else if (mediumRegex.test(self.password)) {
                self.leveShow=true;
                self.isEnough=false;
                self.isMedium=true;
                self.isStrong=false;
            } else if(enoughRegex.test(self.password)){
                self.leveShow=true;
                self.isEnough=true;
                self.isMedium=false;
                self.isStrong=false;
            };
            
        },
        isSame:function(){
            if(this.password == this.passwordCheck){
                this.tipsTwo="";
                return true;
            }else{
                this.tipsTwo="两次密码输入不一致，请重新输入";
                this.btnCanClick();
                return false;
            }
        },
        //判断用户是否有重新输入动作，消灭提醒,输入过程中格式正确，消灭提醒,按钮可点
        clearTipsTwo:function(){
            if(this.password == this.passwordCheck){
                this.tipsTwo = "";
            }
            this.btnCanClick();
        },
        btnCanClick:function(){
            var self = this;
            if(self.password && self.passwordCheck && !self.tipsOne && !self.tipsTwo){
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
                if(self.isSame()){

                
                self.wholeLoading=true;
                // io.post(authCode, param, function(res){
                    self.wholeLoading=false;
                    //进入步骤二组件
                    self.$emit('secondStepDone');
                    //判断步骤二组件采用的状态
                    // if(){
                        self.$emit('thirdStatusOk');
                    // }else{
                        // self.$emit('thirdStatusErr');
                    // }
                // }, function(e){
                //     self.wholeLoading=false;
                //     self.tipsTwo = e.msg;
                //     self.CodeNum="";
                //     self.canSubmit = false;
                // });
                }        
        },
        retureLogin:function(){
            this.$router.push({path:'/login'});
        }

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
.second-step{
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
    .level{
        display:inline-block;
        width:160px;
        height:50px;
        position:absolute;
        right:-182px;
        span{
            float:left;
        }
        .text{
            // display:none;
            height:25px;
            line-height:25px;
            text-align: left;
            margin-bottom:10px;
            color:#333;
        }
        .graph{
            // display:none;
            // display:inline-block;
            // width:50px;
            height:14px;
            border-radius:2px;
            color:#fff;
            font-size:12px;
            line-height:14px;
            text-align: center;
        }
        .good{
            width:50px;
            background-color: #e65656;
        }
        .better{
            width:100px;
            background-color: #fbbd46;
        }
        .best{
            width:150px;
            background-color: #72c1fb;
        }
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
.three{
    height: 45px;
}
</style>
