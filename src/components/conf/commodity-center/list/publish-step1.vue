<template>  
    <div>
        <section style="background-color:#fff">
            <step-header currentStep='1'></step-header>

            <el-col :span="24" class="select-type">
                <div class="item title">您当前选择的是：</div>
                <div class="item">{{selectedFirstCategory.catbackName}}</div>
                <div class="item arrow" v-if="selectedFirstCategory">></div>
                <div class="item">{{selectedSecondCategory.catbackName}}</div>
                <div class="item arrow" v-if="selectedSecondCategory">></div>
                <div class="item">{{selectedThirdCategory.catbackName}}</div>
                <div class="item arrow" v-if="selectedMountedSPU">></div>
                <div class="item">{{selectedMountedSPU.spuName}}</div>
            </el-col>
            <el-row class="content" :span="24" style="margin-left:40px">
                <el-col :span="5" class="item">
                    <div class="header">
                        <span>一级分类</span>
                    </div>
                    <div class="wrap">
                        <ul>
                            <li v-for="(item,index) in firstCategoryArr" v-bind:class="{active:item.active}" @click="selectFirstCategory(index,item)" :key="item.catbackId">
                                <span>{{item.catbackName}}</span>
                            </li>
                        </ul>
                    </div>
                    
                </el-col>
                <el-col :span="1" class="arrow">></el-col>
                <el-col :span="5" class="item">
                    <div class="header">
                        <span>二级分类</span>
                    </div>
                    <div class="wrap">
                        <ul>
                            <li v-for="(item,index) in secondCategoryArr" v-bind:class="{active:item.active}" @click="selectSecondCategory(index,item)" :key="item.catbackId">
                                <span >{{item.catbackName}}</span>
                            </li>
                        </ul>
                    </div>
                </el-col>
                <el-col :span="1" class="arrow">></el-col>
                <el-col :span="5" class="item">
                    <div class="header">
                        <span>三级分类</span>
                    </div>
                    <div class="wrap">
                        <ul>
                            <li v-for="(item,index) in thirdCategoryArr" v-bind:class="{active:item.active}" @click="selectThirdCategory(index,item)" :key="item.catbackId">
                                <span>{{item.catbackName}}</span>
                            </li>
                        </ul>
                    </div>
                </el-col>
                
            </el-row>
            <el-row style="margin-left:40px;margin-top:10px">
                <el-checkbox class="spu-checkbox" v-model="selectedSpu" @change="toggleSelectSPU">通过SPU发布商品</el-checkbox>
                <div class="select-spu" v-if="selectedSpu">{{selectedMountedSPU.spuName}}<i class="iconfontmod" style="padding-left:20px" @click="deleteSelectedSpu">&#xe60d;</i></div>
            </el-row>
            <el-row class="btn-group">
                <el-button class="next-btn btn" @click="goNext()">下一步</el-button>
                <el-button class="btn" @click="goBack">返回</el-button>
            </el-row>
            
        </section>
        <search-spu-dialog v-if="isShowSearchSpuDialog" :isShow="isShowSearchSpuDialog" :backCateId="selectedThirdCategory.catbackId" v-on:watchDialog="closeDialog" v-on:passSelectSpu="showRelatedSpu"></search-spu-dialog>
    </div>
</template>
<script>
import stepHeader from './stepHeader'
import searchSpuDialog from './searchSpuDialog'
export default {
    components:{
		stepHeader,
        searchSpuDialog
	},
    data(){
        return {
        //    titles:[{id:1,name:'商品中心'},{id:2,name:'SPU管理'},{id:3,name:'SPU新增1'}],
           listLoading:false,
           selectedFirstCategory:'',
           selectedSecondCategory:'',
           selectedThirdCategory:'',
           selectedMountedSPU:'',
           firstCategoryArr:[],
           secondCategoryArr:[],
           thirdCategoryArr:[],
           mountedSPUArr:[],
           isShowSearchSpuDialog:false,
           selectedSpu:false,//判断是否选择了spu checkbox
           isBack:false//判断是否是从第二步返回第一步
        }
    },
    methods:{
        closeDialog:function(status){
            this.isShowSearchSpuDialog=status;
            this.selectedSpu=false;
        },
        deleteSelectedSpu:function(){
            this.selectedSpu=false;
            this.selectedMountedSPU="";
        },
        showRelatedSpu:function(entity){
            
            this.selectedMountedSPU=entity;
            this.isShowSearchSpuDialog=false;
            
        },
        toggleSelectSPU:function(){
            if(this.selectedSpu){
                //判断是否选择了三个分类
                if(this.selectedThirdCategory){
                    //选择了SPU,弹出选择spu的对话框
                    this.isShowSearchSpuDialog=true;
                }else{
                    this.selectedSpu=false;
                    this.$message({
                        type:'warning',
                        message:'请选择三级分类'
                    })
                }
                
            }else{
                this.selectedMountedSPU="";
            }
        },
        goNext:function(){
            if(!this.selectedThirdCategory){
                this.$message({
                    type:'warning',
                    message:"请选择三级分类信息"
                })
            }else{

                sessionStorage.setItem('selectedFirstCategory',JSON.stringify(this.selectedFirstCategory));
                sessionStorage.setItem('selectedSecondCategory',JSON.stringify(this.selectedSecondCategory));
                sessionStorage.setItem('selectedThirdCategory',JSON.stringify(this.selectedThirdCategory));

                if(this.selectedMountedSPU){
                    sessionStorage.setItem('selectedMountedSPU',JSON.stringify(this.selectedMountedSPU));
                }else{
                    sessionStorage.removeItem('selectedMountedSPU');
                }
                

                this.$router.push({name:'商品发布2',params:{entity:{backCateId:this.selectedThirdCategory.catbackId,spuId:this.selectedMountedSPU.spuId}}});
               
            }
            
        },
        goBack:function(){
            this.$router.push({name:'商品列表'})
        },
        selectFirstCategory:function(selectedIndex,item){
            this.selectedFirstCategory=item;
            this.firstCategoryArr.forEach(function(value,index){
                if(selectedIndex==index){
                    value.active=true;
                }else{
                    value.active=false;
                }
                
            })
            //查询二级分类
            this.getSecondCategory(item.catbackId);

            this.selectedSecondCategory='';
            this.selectedThirdCategory='';
            this.selectedMountedSPU='';
            this.thirdCategoryArr=[];
            this.mountedSPUArr=[];
        },
        selectSecondCategory:function(selectedIndex,item){
            this.selectedSecondCategory=item;
            this.secondCategoryArr.forEach(function(value,index){
                if(selectedIndex==index){
                    value.active=true;
                }else{
                    value.active=false;
                }
                
            })
            //查询三级分类
            this.getThirdCategory(item.catbackId);

            this.selectedThirdCategory='';
            this.selectedMountedSPU='';
            this.mountedSPUArr=[];
        },
        selectThirdCategory:function(selectedIndex,item){
            this.selectedThirdCategory=item;
            this.thirdCategoryArr.forEach(function(value,index){
                if(selectedIndex==index){
                    value.active=true;
                }else{
                    value.active=false;
                }
                
            })

            this.selectedMountedSPU="";
        },
        selectMountedSPU:function(selectedIndex,item){
            this.selectedMountedSPU=item;
            this.mountedSPUArr.forEach(function(value,index){
                if(selectedIndex==index){
                    value.active=true;
                }else{
                    value.active=false;
                }
                
            })
        },
        getFirstCategory:function(isBack){
            var url=this.$apiUrl.getCategoryByPid+"?parentId=0"+"&deep=1";
            this.$ajax.post(url).then(res=>{
                if(res.error==0){
                    this.firstCategoryArr=res.data;
                    if(isBack){
                        for(var i=0;i<this.firstCategoryArr.length;i++){
                            var item=this.firstCategoryArr[i];
                            if(item.catbackId==this.selectedFirstCategory.catbackId){
                                item.active=true;
                                break;
                            }
                        }
                    }
                }else{
                    this.$message({
                        type:'error',
                        message:res.msg
                    })
                }
                
            })
            if(isBack){
                this.getSecondCategory(this.selectedFirstCategory.catbackId,isBack)
            }
        },
        getSecondCategory:function(firstCategoryId,isBack){
            var url=this.$apiUrl.getCategoryByPid+"?parentId="+firstCategoryId+"&deep=2";
            this.$ajax.post(url).then(res=>{
                if(res.error==0){
                    this.secondCategoryArr=res.data;
                    if(isBack){
                        for(var i=0;i<this.secondCategoryArr.length;i++){
                            var item=this.secondCategoryArr[i];
                            if(item.catbackId==this.selectedSecondCategory.catbackId){
                                item.active=true;
                                break;
                            }
                        }
                    }
                }else{
                    this.$message({
                        type:'error',
                        message:res.msg
                    })
                }
                
            })
            if(isBack){
                this.getThirdCategory(this.selectedSecondCategory.catbackId,isBack)
            }
        },
        getThirdCategory:function(secondCategoryId,isBack){
            var url=this.$apiUrl.getCategoryByPid+"?parentId="+secondCategoryId+"&deep=3";
            this.$ajax.post(url).then(res=>{
                if(res.error==0){
                    this.thirdCategoryArr=res.data;
                    if(isBack){
                        for(var i=0;i<this.thirdCategoryArr.length;i++){
                            var item=this.thirdCategoryArr[i];
                            if(item.catbackId==this.selectedThirdCategory.catbackId){
                                item.active=true;
                                break;
                            }
                        }
                    }
                }else{
                    this.$message({
                        type:'error',
                        message:res.msg
                    })
                }
                
            })
        },
    },
    mounted(){
        this.isBack=false;
        if(this.$route.params.isBack){
            this.isBack=true;
            this.selectedFirstCategory=JSON.parse(sessionStorage.getItem('selectedFirstCategory'));
            this.selectedSecondCategory=JSON.parse(sessionStorage.getItem('selectedSecondCategory'));
            this.selectedThirdCategory=JSON.parse(sessionStorage.getItem('selectedThirdCategory'));
            
            if(sessionStorage.getItem('selectedMountedSPU')){
                this.selectedMountedSPU=JSON.parse(sessionStorage.getItem('selectedMountedSPU'));
                this.selectedSpu=true;
            }else{
                this.selectedMountedSPU="";
                this.selectedSpu=false;
            }
        }
        this.getFirstCategory(this.isBack);
    }
}
</script>
<style scoped lang="scss"> 

    .select-type{
        padding-left:40px;
        padding-bottom:20px;
        background-color:#ffffff;
        .item{
            
            color:#666666;
            font-size:14px;
            &.title{
                width:120px;
                color:#333333;
            }
        }
        .arrow{
            padding-left:5px;
            padding-right:5px;
        }
        div{
            float:left
        }
    }
    .content{
        .item{
            .header{
                span{
                    padding-left:20px;
                }
                // width:240px;
                height:40px;
                line-height:40px;
                color:#999999;
                background-color:#f3f5f7;

            }
            .wrap{
                height:362px;
                width:100%;
                overflow-y:auto;
                border:1px solid #efefef;
                box-sizing: border-box;
                &::-webkit-scrollbar{
                    width: 3px;
                    // height: 16px;
                    background-color: #3dc8f6;
                }
                /*定义滚动条的轨道，内阴影及圆角*/
                &::-webkit-scrollbar-track{
                    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
                    border-radius: 10px;
                    background-color: #f5f5f5;
                }
                &::-webkit-scrollbar-thumb{
                    height: 10px;
                    border-radius: 20px;
                    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
                    background-color: #3dc8f6;
                }
                ul{
                    overflow-y:auto;
                    overflow-x:hidden;
                    width:100%;
                    list-style:none;
                    min-height:360px;
                    // border:1px solid #efefef;
                    box-sizing:border-box;
                    li{
                        &:hover{
                            background-color:#f3f5f7;
                        }
                        &.active{
                            color:#3dc8f6;
                            background-color:#ffffff;
                        }
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        width:100%;
                        height:40px;
                        box-sizing:border-box;
                        line-height:40px;
                        color:#333333;
                        span{
                            padding-left:20px;
                            width:100%;
                            display:inline-block;
                            box-sizing:border-box;
                            
                        }
                        
                        // border-bottom:1px solid #efefef;

                        
                    }
                }
            }
        }
        .arrow{
            height:40px;
            line-height:40px;
            text-align:center;
        }
    }
    .btn-group{
        .btn{
            width:80px;
        }
        padding:40px;
        .next-btn{
            color:#ffffff;
            background-color:#3dc8f6;
            border:none;
        }
    }
    .select-spu{
        background-color:#e1f5f3;
        color:#33bbab;
        display:inline-block;
        height:40px;
        line-height:40px;
        padding:0px 10px;
        border-radius:3px;
        font-size:14px;
        i{
            cursor:pointer;
        }
    }
    .spu-checkbox{
        height:40px;
        line-height:40px;
        font-size:14px;
    }
</style>