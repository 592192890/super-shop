<template>
    <div class="upload-dialog">
        <el-dialog title="选择图片" :visible.sync="isShow" size="small" :before-close="beforeCloseDialog">
            <div>
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-select v-model="searchEntity.albumId" placeholder="请选择相册" @change="changeAlbum">  
                            <el-option label="请选择相册" value="" v-if="!albumList.length"></el-option>
                            <el-option
                                v-for="item in albumList"
                                :key="item.albumId"
                                :label="item.albumName"
                                :value="item.albumId">
                                <span style="float: left">{{ item.albumName }}</span>
                                <i class="icon iconfontcom" @click.stop="deleteAlbum(item)" style="float: right; margin-top:1px; font-size: 14px">&#xe607;</i>
                            </el-option>
                            <div style="width: 100%; height: 36px"></div>
                            <el-button class="create-btn" @click="createPicDialogVisible=true">创建新相册</el-button>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <div style="height:40px;line-height:40px;min-width:60px;text-align:right">图片名称</div>
                    </el-col>
                    <el-col :span="6">
                        <el-input v-model="searchEntity.imageName"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button class="search-btn" @click="search">搜索</el-button>
                    </el-col>
                </el-row>
                <div class="pic-group selected">
                  <div class="pic-item selected" v-for="(item,index) in selectedFiles">
                    <img class="small-img" :src="item.imageUrl" />
                    <div class="arrow">
                      <span class="left" @click="moveLeft(item,index)">
                        <i class="el-icon el-icon-arrow-left"></i>
                      </span>
                      
                      <span class="right" @click="moveRight(item,index)">
                        <i class="el-icon el-icon-arrow-right"></i>
                      </span>
                    </div>

                  </div>
                </div>
                <div class="pic-group" v-if="albumList.length">
                    <div class="pic-item" v-for="(item,index) in picList" style="width:25%;">
                        <img :src="item.imageUrl" />
                        <el-checkbox class="checkbox" v-model="item.checked" @change="checkFile(item)"></el-checkbox>
                        <div class="delete-btn">
                            <div class="wrap" @click="deletePic(item)">
                                <i class="el-icon-delete"></i>
                            </div>
                        </div>
                        <div class="image-name">{{item.imageName}}</div>
                    </div>
                    <el-upload
                        v-loading="loading"
                        class="upload-default"
                        v-if="!picList.length"
                        :before-upload="beforeUpload"
                        :multiple="true"
                        :with-credentials="true"
                        :show-file-list="false"
                        :action="uploadFileUrl"
                        :on-success="uploadProductPicSuccess">
                        <el-button size="big" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">图片格式必须为jpg,png和gif,每张不能超过1M!</div>
                    </el-upload>

                    <div class="pic-item" v-if="picList.length">
                        <el-upload class="upload-el"
                            v-loading="loading"
                            :action="uploadFileUrl"
                            list-type="picture-card"
                            :before-upload="beforeUpload"
                            :multiple="true"
                            :with-credentials="true"
                            :show-file-list="false"
                            :on-success="uploadProductPicSuccess">
                            <img src="../../../assets/images/upload.png" style="margin-top:0px"></img>
                        </el-upload>
                        <div class="image-name" style="visibility: hidden;"></div>
                    </div>
                </div>
                <div class="pic-group" v-if="!albumList.length">
                    <span class="create-album">请先创建相册</span>
                </div>
                <el-row v-if="albumList.length">
                        <el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;" :current-page="currentPage">
                        </el-pagination>
                </el-row>
                <el-row>
                    <el-col :span="3" :offset="18" class="bt-item">
                        <el-button @click="beforeCloseDialog">取消</el-button>
                    </el-col>
                    <el-col :span="3" class="bt-item">
                        <el-button class="submit-btn" @click="submitPic">提交</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
        <el-dialog
            title="创建新相册"
            :visible.sync="createPicDialogVisible"
            size="tiny">

            <el-row style="height:250px;overflow:auto;border:1px solid #efefef">
                <p style="height:40px;line-height:40px;padding-left:5px;" v-for="item in albumList">{{item.albumName}}</p>
            </el-row>
            <el-row :gutter="10" style="margin-top:20px">
                <el-col :span="10">
                    <el-input v-model="createdAlbumName" @change="validateCreatedAlbum" placeholder="输入相册名"></el-input>    
                </el-col>
                <el-col v-if="isShowErrorTips" :span="3" style="height:0px;line-height:40px;color:#ff4949">请输入相册名</el-col>
                <el-col :span="1" :offset="6">
                    <el-button type="primary" @click="createAlbum" class="confirm-btn">保存</el-button>
                </el-col>
                
                
            </el-row>
            
            
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="tipsDialogVisible"
            size="tiny">
            <span>请选择图片！</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="tipsDialogVisible=false" class="confirm-btn">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="deletePicDialogVisible"
            size="tiny">
            <span>确定删除图片吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="deletePicConfirm" class="confirm-btn">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="deleteAblbumDialogVisible"
            size="tiny">
            <span>确定删除相册吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="deleteAlbumConfirm" class="confirm-btn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>
<script>

    export default {
        props:['isShow'],
        data(){
            return {
                selectedFiles:[],
                deletePicDialogVisible:false,
                deleteAblbumDialogVisible:false,
                deletePicItem:'',
                deleteAlbumItem:'',
                picList:[],
                loading:false,
                uploadFileUrl:this.$apiUrl.uploadImageUrl,
                addImageToAlbumUrl:this.$apiUrl.addAlbumImageUrl,
                tipsDialogVisible:false,
                createPicDialogVisible:false,
                checkboxList:[],
                currentPage:1,
                pageSize:20,
                total:0,
                searchEntity:{
                    albumId:''
                },
                albumList:[],
                createdAlbumName:'',
                isShowErrorTips:false
            }
        },
        methods:{
            moveLeft(item,index){
              if(index==0){
                return;
              }else{
                var currentItem=Object.assign({},item);
                var preItem=Object.assign({},this.selectedFiles[index-1]);

                //调换位置
                this.selectedFiles.splice(index-1,2,currentItem,preItem);

              }
            },
            moveRight(item,index){
              if(index==this.selectedFiles.length-1){
                return;
              }else{
                var currentItem=Object.assign({},item);
                var lastItem=Object.assign({},this.selectedFiles[index+1]);

                //调换位置
                this.selectedFiles.splice(index,2,lastItem,currentItem);
              }
            },
            checkFile(item){
                if(item.checked){
                    if(this.selectedFiles.length>=6){
                        this.$message({
                        type:'warning',
                        message:'最多选择6个图片'
                        })
                        item.checked=false;
                        return;
                    }else{
                        this.selectedFiles.push(item);
                    }
                }else{
                    this.selectedFiles=this.selectedFiles.filter(v=>{
                        if(item.imageId!=v.imageId){
                        return v;
                        }
                    })
                }

            },
            deleteAlbum:function(item){
                this.deleteAlbumItem=item;
                this.deleteAblbumDialogVisible=true;
            },
            deleteAlbumConfirm:function(){
                var item=this.deleteAlbumItem;
                var params={
                    albumId:item.albumId
                }
                var url=this.$apiUrl.deleteAlbumUrl;
                this.$ajax.post(url,params).then(res=>{
                    if(res.error==0){
                        //重新获取相册信息
                        this.getAlbumList();
                        this.$message({
                            type:'success',
                            message:'相册删除成功！'
                        })
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                    this.deleteAblbumDialogVisible=false;
                })   
            },
            validateCreatedAlbum:function(){
                if(this.createdAlbumName&&this.createdAlbumName.toString().trim()!=''){
                    this.isShowErrorTips=false;
                }else{
                    this.isShowErrorTips=true;
                }
            },
            beforeCloseDialog:function(){
                this.$emit('watchDialog',false)
            },
            submitPic:function(){
                //判断是否选择图片
                if(this.selectedFiles.length==0){
                    this.$message({
                        message: '请选择图片',
                        type: 'warning'
                    });
                }else if(this.selectedFiles.length>6){
                    this.$message({
                        message: '最多选择6张图片',
                        type: 'warning'
                    });
                }else{
                    //重置状态
                    this.picList.forEach(function(value){
                        if(value.checked){
                            value.checked=false;
                        }
                    })
                    var passSelectedFiles=Object.assign([],this.selectedFiles);
                    this.selectedFiles=[];

                    this.$emit('passSelectedPicUrl',passSelectedFiles)
                }
            },
            beforeUpload:function(file){
                this.loading=true;
                const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png')||(file.type === 'image/gif');
                const isLt2M = file.size / 1024 / 1024 < 1;
                
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG,PNG,GIF 格式!');
                    this.loading=false;
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                    this.loading=false;
                }
                return isJPG && isLt2M;
            },
            uploadProductPicSuccess:function(response,file,fileList){
                this.loading=false;
                if(response.error==0){
                    var params=response.data;
                    params.albumId=this.searchEntity.albumId;
                    var url=this.addImageToAlbumUrl;
                    
                    this.$ajax.post(url,params).then(res=>{
                        if(res.error==0){

                            //重新加载图片
                            this.searchEntity.imageName = ''
                            this.getAlbumImagesList(1,this.searchEntity.albumId,this.searchEntity.imageName)
                        }else{
                            this.$message({
                                type:'error',
                                message: res.msg
                            });
                        }
                    })  
                }else{
                    this.$message({
                        message: response.msg,
                        type: 'error'
                    });
                }
                 
            },
            deletePic:function(item){
                this.deletedPicItem=item;
                this.deletePicDialogVisible=true;
                
            },
            deletePicConfirm:function(){
                var item=this.deletedPicItem;
                var imageId=item.imageId;
                var imageIds=[imageId];
                var params={
                    imageIds:JSON.stringify(imageIds)
                }
                var url=this.$apiUrl.deleteAlbumImageUrl;
                this.$ajax.post(url,params).then(res=>{
                    if(res.error==0){
                        this.$message({
                            type:'success',
                            message: '图片删除成功！'
                        });
                        //重新加载图片
                        this.getAlbumImagesList(1,this.searchEntity.albumId,this.searchEntity.imageName);
                    }else{
                        this.$message({
                            type:'error',
                            message: res.msg
                        });
                    }
                    this.deletePicDialogVisible=false;
                })
            },
            changeAlbum:function(){
                this.search();
            },
            createAlbum:function(){
                if(!this.createdAlbumName||this.createdAlbumName.toString().trim()==''){
                    this.isShowErrorTips=true;
                }else{
                    this.isShowErrorTips=false;
                    var url=this.$apiUrl.addAlbumUrl;
                    var params={
                        albumName:this.createdAlbumName
                    }
                    this.$ajax.post(url,params).then(res=>{
                        if(res.error==0){

                            //重新获取相册信息
                            this.getAlbumList();

                            this.createPicDialogVisible=false;
                            this.$message({
                                type:'success',
                                message: '相册创建成功！'
                            });
                        }else{
                            this.$message({
                                type:'error',
                                message: res.msg
                            });
                        }
                    })
                }
                
            },
            getAlbumList:function(){
                var url=this.$apiUrl.getAlnumNoPageUrl;
                this.$ajax.post(url).then(res=>{
                    if(res.error==0){
                        this.albumList=res.data;
                        if(res.data.length){
                            this.searchEntity.albumId=res.data[0].albumId;
                            this.getAlbumImagesList(1,this.searchEntity.albumId,this.searchEntity.imageName);
                        }
                        
                    }else{
                        this.$message({
                            type:'error',
                            message: res.msg
                        });
                    }
                })
            },
            getAlbumImagesList:function(index,albumId,imageName){
                var url=this.$apiUrl.getAlbumImagesUrl;
                var params={
                    albumId:albumId,
                    imageName:imageName,
                    currentPage:index||1,
                    pageSize:this.pageSize
                }
                this.$ajax.post(url,params).then(res=>{
                    if(res.error==0){
                       
                        res.data.list.forEach(value=>{
                            value.checked=false;
                        })
                        this.picList=res.data.list;

                        this.currentPage=res.data.currentPage;
                        this.total=res.data.totalRow;
                        
                    }else{
                        this.$message({
                            type:'error',
                            message: res.msg
                        });
                    }
                })
            },
            handleCurrentChange:function(index){
                this.selectedFiles=[];
                this.getAlbumImagesList(index,this.searchEntity.albumId,this.searchEntity.imageName)
            },
            search:function(){
                this.getAlbumImagesList(1,this.searchEntity.albumId,this.searchEntity.imageName)
            }
        },
        mounted(){
            
            this.getAlbumList();
        }
        
    }
</script>
<style scoped lang="scss">
    i.el-icon-arrow-left{
     content:"\E600";
     font-size:12px;
   }
   i.el-icon-arrow-right{
     content:"\E604";
     font-size:12px;
   }
    img{
        width:100px;
        height:100px;
        margin-top:20px
       
    }
    .upload-default{
        width:260px;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        -webkit-transform:translate(-50%,-50%);
        -ms-transform:translate(-50%,-50%);
        text-align: center;
    }
    .upload-el{
        width:102px;
        height:102px;
    }
    .pic-group{
        &.selected{
          height:auto;
          overflow:hidden;
        }
        // width:500px;
        position:relative;
        height:400px;
        overflow:auto;
        background-color:#f3f5f7;
        margin:20px auto;
        .pic-item{
            &.selected{
              width:16%;
              padding-bottom: 5px;
              padding-top:5px;
              .small-img{
                width:50px;
                height:50px;
                margin-top:0px;
              }
              .arrow{
                width:50px;
                margin:0 auto;
                span.left{
                  float:left;
                  cursor:pointer;
                  color:#33bbab;
                }
                span.right{
                  float:right;
                  cursor:pointer;
                  color:#33bbab;
                }
              }
            }
            float: left;
            width: 25%;
            text-align:center;
            position:relative;
            .checkbox{
                position:absolute;
                top:20px;
                right:30px
            }
        }
        .upload-el{
            position:absolute;
            top:20px;
            left:28px;
        }
        .create-album{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size:24px
        }
    }
    .search-btn{
        border:none;
        color:#ffffff;
        background-color:#3dc8f6;
    }
    .submit-btn{
        border:none;
        color:#ffffff;
        background-color:#3dc8f6;
    }
    .confirm-btn{
        background-color:#33bbab;
        color:#ffffff;
        border:none;
    }
    .create-btn{
        width:100%;
        background-color:#f3f5f7;
    }
    .delete-btn{
        // display:none;
        position:absolute!important;
        bottom:24px;
        width:100%;
        // margin:0px auto;

        height:26px;
        line-height:26px;
        font-size:10px;
        
        color:#ffffff;
        .wrap{
            background-color:#000000;
            opacity:0;
            margin:0px auto;
            width:100px;
            bottom:3px;
            &:hover{
                opacity:0.3;
            }
        }
        
    }
    .bt-item{
        text-align:right;
    }
    .image-name{
        font-size: 10px;
        overflow:hidden;
        white-space:nowrap;
        width:100%;
        text-overflow:ellipsis;
        height:20px;
    }
</style>
<style lang="scss">
    // .el-upload-list.el-upload-list--picture-card{
    //     display:none;
    // }
    .upload-dialog .el-dialog.el-dialog--small{
        width:674px;
    }
    .el-select-dropdown__list{
        position: static!important
    }
</style>