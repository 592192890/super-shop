<template>
<div class="commodity-list">
    <el-popover
        ref="moreOperate"
        placement="bottom-start"
        width="230"
        trigger="click">
        <el-row :span="24">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="22">
                <el-button type="text" @click="onShelf" v-if="buttonArr.indexOf('bt-up')!=-1">上架</el-button>
                <el-button type="text" @click="offShelf" v-if="buttonArr.indexOf('bt-down')!=-1">下架</el-button>
                <el-button type="text" @click="priceModify" v-if="buttonArr.indexOf('bt-setPrice')!=-1">调整价格</el-button>
                <el-button type="text" @click="stockModify" v-if="buttonArr.indexOf('bt-setStock')!=-1">调整库存</el-button>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
        </el-row>
    </el-popover>
    <section>
        <el-row :span="24" class="hearder">
            <el-col :span="3" class="mr">
                <el-select v-model="firstCateId" @change='changeOne' placeholder="一级分类">
                    <el-option label="请选择" value="" ></el-option>
                    <el-option
                      v-for="item in options1"
                      :key="item.catbackId"
                      :label="item.catbackName"
                      :value="item.catbackId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3" class="mr">
                <el-select v-model="secondCateId" @change='changeTwo' placeholder="二级分类">
                    <el-option label="请选择" value=""></el-option>
                    <el-option
                      v-for="item in options2"
                      :key="item.catbackId"
                      :label="item.catbackName"
                      :value="item.catbackId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3" class="mr">
                <el-select v-model="thirdCateId" @change='changeThr' placeholder="三级分类">
                    <el-option label="请选择" value=""></el-option>
                    <el-option
                      v-for="item in options3"
                      :key="item.catbackId"
                      :label="item.catbackName"
                      :value="item.catbackId">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3" class="mr">
                <el-select v-model="selMarketable" @change='changeMarketable' placeholder="选择上下架">
                    <el-option label="请选择" value=""></el-option>
                    <el-option
                      v-for="item in marketableArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="3" class="mr">
                <el-select v-model="type" placeholder="请选择">
                    <el-option label="商品编码" value="1"></el-option>
                    <el-option label="货品编码" value="2"></el-option>
                    <el-option label="商品名称" value="3"></el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-input v-model="keyWords" placeholder="请输入商品名称或编码"></el-input>
            </el-col>
            <el-col :span="2" class="search">
                <el-button type="primary" @click="search">搜索</el-button>
            </el-col>
        </el-row>

        <el-row :span="24" class="sub-hearder">
            <div class="btn" v-popover:moreOperate>更多操作></div>
            <div class="publish" @click="onPublish" v-if="buttonArr.indexOf('bt-publish')!=-1">发布商品</div>
        </el-row>
        <el-row :span="24">
            <el-col class="mod-header frontSelect">
                <div class="choose">
                    <el-checkbox v-model="checked" @change="checkAll">全选</el-checkbox>
                </div>
                <div class="sub-title wth">商品名称/规格</div>
                <div class="sub-title">SPU/SKU编码</div>
                <!-- <div class="sub-title">计量单位</div> -->
                <div class="sub-title">可销售库存</div>
                <div class="sub-title">销售价</div>
                <div class="sub-title">库位信息</div>
                <div class="sub-title">是否称重商品</div>
                <div class="sub-title">上架状态</div>
                <div class="sub-title">操作</div>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col  class="tree-menu" v-loading="listLoading">
                <ul v-for="menuItem in theModel">
                    <my-tree :model="menuItem" :list="theModel" :isWeight="menuItem.catchWeightInd" :currentPage="currentPage"></my-tree>
                </ul>
            </el-col>
        </el-row>
        <el-row :span="24">
            <el-col  class="no-data" v-if="!findOutData">暂无数据</el-col>
        </el-row>
        <el-row :span="24">
            <el-col class="mod-toolbar" v-loading="listLoading">
                <el-pagination layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;" :current-page="currentPage">
                </el-pagination>
            </el-col>
        </el-row>
    </section>
    <el-dialog
        title="调整价格"
        :visible.sync="dialogSetPriceVisible" :before-close="dialogClose">
        <el-form :rules="rules" ref="setForm" :model="setFormData" label-position="left"
               class="form">
            <el-table :data="setFormData.list" >
                <el-table-column label="SKU商品规格" width="240">
                    <template scope="scope">
                        {{ scope.row.goodsName || scope.row.productName}}
                    </template>
                </el-table-column>
                <el-table-column label="销售价">
                    <template scope="scope">
                        <!-- <div v-if="scope.row.spuSource==1"> {{ scope.row.salePrice }} </div> -->
                        <el-form-item class="validate-table-error"
                                :prop="'list.' + scope.$index +'.salePrice'"
                                :rules="rules.numberValidate">
                            <el-input v-model="scope.row.salePrice" placeholder="销售价"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="市场价">
                    <template scope="scope">
                        <div v-if="scope.row.spuSource==1"> {{ scope.row.mktPrice }} </div>
                        <el-form-item v-if="scope.row.spuSource==2" class="validate-table-error"
                                :prop="'list.' + scope.$index +'.mktPrice'"
                                :rules="rules.numberValidate">
                            <el-input v-model="scope.row.mktPrice" placeholder="市场价" :disabled="scope.row.spuSource==1||!!scope.row.spuId"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="成本价">
                    <template scope="scope">
                        <div v-if="scope.row.spuSource==1"> {{ scope.row.cost }} </div>
                        <el-form-item v-if="scope.row.spuSource==2" class="validate-table-error"
                                :prop="'list.' + scope.$index +'.cost'"
                                :rules="rules.numberValidate">
                            <el-input v-model="scope.row.cost" placeholder="成本价" :disabled="scope.row.spuSource==1||!!scope.row.spuId"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelSetPrice">取 消</el-button>
            <el-button type="primary" @click="confirmPrice('setFormData')">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog
      title="调整库存"
      :visible.sync="dialogSetStockVisible" :before-close="dialogClose">
        <el-form :rules="rules" ref="setStockForm" :model="setFormData" label-position="left"
               class="form">
            <el-table :data="setFormData.list">
                <el-table-column label="SKU商品规格" width="160">
                    <template scope="scope">
                        {{ scope.row.goodsName || scope.row.productName}}
                    </template>
                </el-table-column>
                <el-table-column label="可销售库存" width="180">
                    <template scope="scope" >
                        <div v-if="scope.row.nostoreSell==0&&scope.row.businessTypeCode=='002'"> {{ scope.row.availableNum }} </div>
                        <el-form-item v-else class="validate-table-error"
                                :prop="'list.' + scope.$index +'.availableNum'"
                                :rules="rules.numberValidate">
                            <el-input v-model="scope.row.availableNum" placeholder="可销售库存"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column  label="冻结库存" >
                    <template scope="scope">{{ scope.row.freezNum}}</template>
                </el-table-column>
            </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelSetStock">取 消</el-button>
            <el-button type="primary" @click="confirmStock">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script type="text/javascript">
import myTree from './menu.vue';
import Permission from '@/assets/js/permission-util.js';
export default {
    components: {
        myTree
    },
    data() {
        return {
            idArr:[],
            type:'1',
            dialogVisible:false,
            dialogSetPriceVisible: false,
            dialogSetStockVisible: false,
            currentPage:1,
            page:1,
            total:0,
            pageSize:15,
            checked:false,
            firstCateId:null,
            secondCateId:null,
            thirdCateId:null,
            options1:[],
            options2:[],
            options3:[],
            keyWords:'',
            listLoading:false,
            tips:"",
            theModel:[],
            deepCopyVal:'',
            single:false,
            selMarketable:null,
            marketable:'null',
            setFormData: {
              list:[]
            },
            priceArr:[],
            rules: {
              numberValidate: [
                  { validator: this.validatePriceFormData }
              ]
            },
            findOutData:true,
            buttonArr:[],
            marketableArr:[{
                id:1,
                name:'上架'
            },{
                id:2,
                name:'下架'
            }]
        }
    },
    methods:{
        validatePriceFormData(rule, value, callback){
            if (!value) {
                return callback(new Error('不能为空'));
            }
            if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)) {
                return callback(new Error('整数最多7位,小数2位'));
            }
            return callback();
        },
        changeMarketable(v){
            if(v==1){
                this.marketable = true
            }else if (v==2) {
                this.marketable = false
            }else{
                this.marketable = 'null'
            }
        },
        changeOne(val){
            this.secondCateId = null
            this.thirdCateId = null
            this.options2 = []
            this.options3 = []
            if(val){
                this.firstCateId = val
                this.$ajax.post(this.$apiUrl.getCategoryUrl, {parentId:val}).then(res=>{
                    if(res.error==0){
                        this.options2 = res.data
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }else{
                this.firstCateId = null
            }
        },

        changeTwo(val){
            this.thirdCateId = null
            this.options3 = []
            if(val){
                this.secondCateId = val
                this.$ajax.post(this.$apiUrl.getCategoryUrl, {parentId:val}).then(res=>{
                    if(res.error==0){
                        this.options3 = res.data
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }else{
                this.secondCateId = null
            }
        },

        changeThr(val){
            if(val){
                this.thirdCateId = val
            }else{
                this.thirdCateId = null
            }
        },

        handleCurrentChange(currentPage){
            this.search(currentPage);
        },
        // 获取树形结构数据
        search(index){
            let page = index || this.currentPage
            let backCateId = ''
            this.checked = false
            if(this.firstCateId){
                backCateId = this.firstCateId
                if(this.secondCateId){
                    backCateId = this.secondCateId
                    if(this.thirdCateId){
                        backCateId = this.thirdCateId
                    }
                }
            }
            let url = this.$apiUrl.getProListUrl

            let param = {
                backCateId: backCateId,
                currentPage : page,
                pageSize : this.pageSize,
                keyWords: this.keyWords,
                type: this.type,
                marketable: this.marketable
            }
            this.findOutData = true
            this.listLoading = true
            this.$ajax.post(url, param).then(res =>{
                this.listLoading = false
                if(res.error==0){
                    this.initData(res.data.list)
                    this.theModel = res.data.list

                    this.total = res.data.totalRow
                    this.currentPage = parseInt(res.data.currentPage)
                    this.idArr = []
                    this.setFormData.list=[]
                    if(!this.total){
                        this.findOutData = false
                    }
                }else{
                    this.$message.error(res.msg);
                }

            })
        },

        // 批量上架
        onShelf(){
            let self = this
            this.$ajax.post(this.$apiUrl.getMarketableUrl, {type:1,idArr:JSON.stringify(this.idArr)}).then(res =>{
                if(res.error==0){
                    self.$message({
                        message: '批量上架成功！',
                        type: 'success'
                    });
                    self.listLoading = true
                    setTimeout(function(){
                        self.listLoading =false
                        self.search()
                    },3000)
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        // 批量下架
        offShelf(){
            let self = this
            this.$ajax.post(this.$apiUrl.getMarketableUrl, {type:-1,idArr:JSON.stringify(this.idArr)}).then(res =>{
                if(res.error==0){
                    self.$message({
                        message: '批量下架成功！',
                        type: 'success'
                    });
                    self.listLoading = true
                    setTimeout(function(){
                        self.listLoading =false
                        self.search()
                    },3000)
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        batchHandle(id, statue, del){
            for(let i in this.theModel){
                if(this.theModel[i].id == id){
                    if(del){
                        this.theModel.splice(i,1)
                    }else{
                        this.theModel[i].marketable = statue;
                    }
                    break
                }else{
                    if(this.theModel[i].productList){
                        this.theModel[i].productList.forEach((list,index)=>{
                            if(list.id==id){
                                if(del){
                                    this.theModel[i].productList.splice(index,1)
                                }else{
                                    list.marketable = statue
                                }
                            }
                        })
                    }
                }
            }
        },

        onPublish(){
            this.$router.push({name:'商品发布1'});
        },

        // 初始化数据
        initData(arr){
            if(arr && arr.length>=1){
                arr.forEach(item=>{
                    item.show = false;
                    item.checked = false;
                    item.freezNum = 0
                    if(item.productList && item.productList.length>=1){
                        this.initData(item.productList);
                    }
                })
            }
        },

        // 全部勾选或全部取消
        checkAll(){
            this.getChecked(this.theModel, this.checked)
        },

        getChecked(arr, val){
            if(arr && arr.length>=1){
                arr.forEach(item=>{
                    if(item.productList && item.productList.length>=1){
                        this.getChecked(item.productList, val);
                    }else{
                        item.checked = val;
                        if(val){
                            this.add(item)
                        }else{
                            this.remove(item)
                        }
                    }
                })
            }
        },

        remove(item){
            for(let i=0; i<this.idArr.length; i++){
                if(this.idArr[i] == item.id ){
                    this.idArr.splice(i,1)
                    this.setFormData.list.splice(i,1)
                }
            }
        },

        add(item){
            let repeat = false
            let id = item.id
            let self = this
            for(let i=0; i<this.idArr.length; i++){
                if(this.idArr[i] && this.idArr[i] == id ){
                    repeat = true
                    break;
                }
            }
            if(!repeat){
                if(item.productList){
                    item.productList.forEach(pro=>{
                        console.log(pro,222)
                        if(pro.catchWeightInd=='N'){
                            self.idArr.push(pro.id)
                            self.setFormData.list.push(pro)
                        }
                    })
                }else{
                    if(item.catchWeightInd=='N'){
                        this.idArr.push(id)
                        this.setFormData.list.push(item)
                    }
                }
            }
        },

        // 调整库存
        stockModify(){
            this.dialogSetStockVisible = true
            let self = this
            this.stockArr=[]
            this.setFormData.list.forEach(item =>{
                this.stockArr.push(item.id)
            })
            this.$ajax.post(this.$apiUrl.getProductStock, {productIds:JSON.stringify(this.stockArr)}).then(res=>{
                if(res.error==0){
                    if(res.data&&res.data.length>0){
                        let arr = res.data
                        this.setFormData.list.forEach(v=>{
                            let len = arr.length
                            while(len--){
                                if(v.id==arr[len].productId){
                                    v.availableNum = arr[len].availableNum
                                    v.freezNum = arr[len].freezNum
                                }
                            }
                        })
                    }
                }else{
                    this.$message.error(res.msg);
                }

            });
        },

        cancelSetStock(){
            let self = this
            this.dialogSetStockVisible = false
            if(this.single){
                setTimeout((function(){
                    self.setFormData.list = JSON.parse(self.deepCopyVal)
                }),100)
                this.single = false
            }
        },

        confirmStock(){
            this.dialogSetStockVisible = false
            let self = this
            this.productVos=[]
            this.setFormData.list.forEach(item =>{
                this.productVos.push({
                    productId: parseFloat(item.id),
                    availableNum: parseFloat(item.availableNum),
                    freezNum:parseFloat(item.freezNum),
                    nostoreSell:item.nostoreSell
                })
            })
            this.$ajax.post(this.$apiUrl.updateProductStock, {productVos:JSON.stringify(this.productVos)}).then(res=>{
                if(res.error==0){
                    self.$message({
                        message: '库存设置成功！',
                        type: 'success'
                    });
                    if(this.single){
                        this.single = false
                        this.setFormData.list = []
                    }
                    self.listLoading = true
                    setTimeout(function(){
                        self.listLoading = false
                        self.search()
                    },3000)
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        // 调整价格
        priceModify(){
            this.dialogSetPriceVisible = true
        },

        dialogClose(done){
            let self = this
            if(this.single){
                this.single = false
                setTimeout((function(){
                    self.setFormData.list = JSON.parse(self.deepCopyVal)
                }),500)
            }
            done()
        },

        cancelSetPrice(){
            let self = this
            this.dialogSetPriceVisible = false
            if(this.single){
                this.single = false
                setTimeout((function(){
                    self.setFormData.list = JSON.parse(self.deepCopyVal)
                }),500)
            }
        },

        confirmPrice(obj){
            // this.dialogSetPriceVisible = false
            let self = this
            this.priceArr=[]
            this.setFormData.list.forEach(item =>{
                this.priceArr.push({
                    id: parseFloat(item.id),
                    salePrice: parseFloat(item.salePrice),
                    marketPrice: parseFloat(item.mktPrice),
                    cost: parseFloat(item.cost)
                })
            })
            this.$ajax.post(this.$apiUrl.updatePrice, {priceArr:JSON.stringify(this.priceArr)}).then(res=>{
                if(res.error==0){
                    this.$message({
                        message: '价格设置成功！',
                        type: 'success'
                    });
                    if(this.single){
                        this.single = false
                        this.setFormData.list = []
                    }
                    self.listLoading = true
                    setTimeout(function(){
                        self.listLoading = false
                        self.search()
                    },3000)
                    this.dialogSetPriceVisible = false
                }else{
                    this.dialogSetPriceVisible = true
                    this.$message.error(res.msg);
                }
            });
        }
    },
    mounted(){
        let self = this
        let params = this.$route.params || ''
        let query = this.$route.query || ''
        this.buttonArr=Permission.button(this.$route.path,this.$router.options.routes);
        if(params){
            this.page = parseInt(params.currentPage) || this.currentPage
        }
        if(query){
            if(query.marketable==1){
                this.marketable = true
                this.selMarketable = 1
            }else if(query.marketable==2){
                this.marketable = false
                this.selMarketable = 2
            }
        }
        this.$ajax.post(this.$apiUrl.getCategoryUrl, {parentId:0}).then(res =>{
            if(res.error==0){
                this.options1 = res.data
            }else{
                this.$message.error(res.msg);
            }
        });
        bus.$on('onCheck', function(val){
            if(!val){
                self.checked = val
            }
        });
        bus.$on('idArr', function(obj){
            let mode = obj.mode
            if(mode=='remove'){
                self.remove(obj.item)
            }else{
                self.add(obj.item)
            }
        });
        bus.$on('setProduct', function(model){
            if(model){
                self.single = true
                self.deepCopyVal = JSON.stringify(self.setFormData.list)
                self.setFormData.list = [];
                self.setFormData.list.push(model)
                if(model.type=='price'){
                    self.priceModify()
                }else{
                    self.stockModify()
                }
            }
        });
        bus.$on('setVirtualStock',function(){
          self.listLoading=true;
          setTimeout(function(){
            self.search();
          },3000)

        }),
        bus.$on('updateList', function(model){
            if(model.type == 'delete'){
                self.$message({
                    message: '已成功删除',
                    type: 'success'
                });
            }else{
                if(model.val){
                    self.$message({
                        message: '成功上架',
                        type: 'success'
                    });
                }else{
                    self.$message({
                        message: '成功下架',
                        type: 'success'
                    });
                }
            }
            self.listLoading = true
            setTimeout(function(){
                self.listLoading = false
                self.search()
            },3000)
        });
        setTimeout(function(){
            self.search(self.page)
        },1000)
    }
}
</script>
<style lang="scss">
.commodity-list{
    .hearder{
        margin: 20px 0 10px;
        padding: 15px 30px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 5px;
        .mr{
            margin-right:15px;
        }
        .search{
            margin-left: 30px;
        }
        .hide{
            visibility: hidden;
        }
    }

    .sub-hearder{
        margin: 30px 0 15px;
        box-sizing: border-box;
        overflow: hidden;
        .btn{
            float: left;
            padding: 0 15px;
            background-color: #fff;
            line-height: 30px;
            color: #333;
            font-size: 14px;
            margin-right: 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        .publish{
            float: right;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            background: #fff;
            border: 1px solid rgb(191, 208, 217);
            border-color: #c4c4c4;
            color: rgb(31, 50, 61);
            -webkit-appearance: none;
            text-align: center;
            box-sizing: border-box;
            outline: none;
            margin: 0;
            padding: 0 15px;
            font-size: 14px;
            line-height: 30px;
            border-radius: 4px;
            color: #fff;
            background-color: #3dc8f6;
            border-color: #3dc8f6;
        }
    }

    .frontSelect{
        width: 100%;
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        padding: 0 30px;
        box-sizing: border-box;
        font-size: 14px;
        color: #999;
        margin: 5px 0;
        background-color: #fff;
        border-radius:5px;
        .sub-title{
            padding: 0 20px 0 0px;
            float: left;
            text-align: center;
            font-size: 14px;
            &.wth{
                padding-right:34px
            }
        }
        .choose{
            width: 60px;
            float: left;
            text-align: left;
            padding-right: 20px;
        }
        .el-checkbox__label{
            color: #999;
        }
    }
    .el-dialog{
        .el-dialog__header{
            padding: 30px 20px;
            background-color: #fff
        }
        .el-table__header{
            width: 100%!important;
            background-color: #f3f5f7;
            tr{
                th{
                    /* width: 250px!important */
                }
            }
        }
        .el-table__body{
            width: 100%!important;
        }
        .el-dialog__body{
            padding: 0 20px 30px;
            .el-table{
                border: 1px solid #f3f5f7;
            }
        }
        tr{
            border-top: 1px solid #f3f5f7;
            border-bottom: 0;
        }
        .el-table tr th{
            background-color:rgb(238, 243, 246);
        }
    }

    .el-checkbox__input.is-checked .el-checkbox__inner{
        background-color:#33bcac;
        border-color:#33bcac;
    }
    .validate-table-error {
        margin: 20px 0;
    }
    .el-form-item__error{
        width:120%;
        left:-10%
    }
    .no-data{
        width:100%;
        padding:20px 0;
        background:#fff;
        text-align:center;
        border-radius:5px;
    }
}

</style>
