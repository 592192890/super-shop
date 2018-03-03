<template>
    <div class="page-view">
        <el-row :gutter="40">
            <el-col :span="8">
                <el-checkbox class="title-check" v-model="checked">选择分类</el-checkbox>
                <el-card>
                    <!-- @default-expanded-keys 默认展开项 -->
                    <!-- @default-checked-keys默认选中项 -->
                    <el-tree
                    :data="data2"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[1, 3]"
                    :default-checked-keys="[6]"
                    :props="defaultProps">
                    </el-tree>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-checkbox class="title-check" v-model="checked">选择品牌</el-checkbox>
                <el-card>
                    <el-checkbox-group class="brand-checkbox-group" v-model="checkListBrand">
                        <el-checkbox class="col-checkbox" v-for="(name,index) in hasChosenBrandNames" :key="index" :label="name" @click.native="reloadIndex('brand',index)"></el-checkbox>
                    </el-checkbox-group>
                    <el-button @click="dialogSelectBrand('brand', $event)">添加品牌</el-button>
                    <el-button @click="delBranIndex('brand',$event)">删除品牌</el-button>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-checkbox class="title-check" v-model="checked">选择商品</el-checkbox>
                <el-card>
                    <el-checkbox-group class="goods-checkbox-group" v-model="checkListGoods">
                        <el-checkbox class="col-checkbox" v-for="(name,index) in hasChosenGoodsNames" :key="index" :label="name" @click.native="reloadIndex('goods',index)"></el-checkbox>
                    </el-checkbox-group>
                    <el-button @click="dialogSelectBrand('goods', $event)">添加商品</el-button>
                    <el-button @click="importedGoods('goods', $event)">导入商品</el-button>
                    <el-button @click="delBranIndex('goods',$event)">删除商品</el-button>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="40" class="last-row">
            <el-col :span="8">
                <div class="title-check exclude-title">排除商品</div>
                <el-card>
                    <el-checkbox-group class="excluded-checkbox-group" v-model="checkListExcluded">
                        <el-checkbox class="col-checkbox" v-for="(name,index) in hasChosenExcludedNames" :key="index" :label="name" @click.native="reloadIndex('excluded',index)"></el-checkbox>
                    </el-checkbox-group>
                    <el-button @click="dialogSelectBrand('excluded', $event)">添加商品</el-button>
                    <el-button @click="importedGoods('excluded', $event)">导入商品</el-button>
                    <el-button @click="delBranIndex('excluded',$event)">删除商品</el-button>
                </el-card>
            </el-col>
        </el-row>
        <!-- 添加品牌弹窗 -->
        <el-dialog
        title="添加品牌"
        :visible.sync="dialogBrandVisible"
        size="small"
        :before-close="handleClose">
            <!-- 表单 -->
            <el-form :inline="true" :model="formInline" label-position="left">
                <el-col :span="20">
                    <el-form-item label="品牌名称">
                        <el-input v-model="formInline.brandName" placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-col>
                    <el-form-item class="search-btn">
                        <el-button type="primary" size="large" @click="onSearch">搜索</el-button>
                    </el-form-item>
            </el-form>
            <!-- 列表 -->
            <el-table :data="tableData" style="width: 100%" v-loading="listLoading" @selection-change="handleSelectionChangeBrand">
                <el-table-column type="selection" width="60px"></el-table-column>
                <el-table-column v-for="(label,index) in lableNames.brand" :key="index" :label="label" :prop="brandProps[index]" :width="width[index]"></el-table-column>
            </el-table>
            <el-col :span="24" class="mod-toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                :page-size="20" :total="total" style="float:right;" :current-page="currentPage">
                </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogCouponVisible = false">取 消</el-button>
                <el-button type="primary" @click="chooseCouponSubmit('brand',$event)">提交</el-button>
            </div>
        </el-dialog>

        <!-- 添加商品弹窗 -->
        <el-dialog
        title="添加商品"
        :visible.sync="dialogGoodsVisible"
        size="small"
        :before-close="handleClose">
            <!-- 表单 -->
            <el-form :inline="true" :model="formInline" label-position="left">
                <el-col :span="20">
                    <el-form-item label="品牌名称">
                        <el-input v-model="formInline.brandName" placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-col>
                    <el-form-item class="search-btn">
                        <el-button type="primary" size="large" @click="onSearch">搜索</el-button>
                    </el-form-item>
            </el-form>
            <!-- 列表 -->
            <el-table :data="tableData" style="width: 100%" v-loading="listLoading" @selection-change="handleSelectionChangeGoods">
                <el-table-column type="selection" width="60px"></el-table-column>
                <el-table-column v-for="(label,index) in lableNames.goods" :key="index" :label="label" :prop="goodsProps[index]" :width="width[index]"></el-table-column>
            </el-table>
            <el-col :span="24" class="mod-toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                :page-size="20" :total="total" style="float:right;" :current-page="currentPage">
                </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogCouponVisible = false">取 消</el-button>
                <el-button type="primary" @click="chooseCouponSubmit('goods',$event)">提交</el-button>
            </div>
        </el-dialog>

        <!-- 排除商品-商品选择弹窗 -->
        <el-dialog
        title="添加需要过滤的商品"
        :visible.sync="dialogExcludedVisible"
        size="small"
        :before-close="handleClose">
            <!-- 表单 -->
            <el-form :inline="true" :model="formInline" label-position="left">
                <el-col :span="20">
                    <el-form-item label="商品名称">
                        <el-input v-model="formInline.brandName" placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-col>
                    <el-form-item class="search-btn">
                        <el-button type="primary" size="large" @click="onSearch">搜索</el-button>
                    </el-form-item>
            </el-form>
            <!-- 列表 -->
            <el-table :data="tableData" style="width: 100%" v-loading="listLoading" @selection-change="handleSelectionChangeExcluded">
                <el-table-column type="selection" width="60px"></el-table-column>
                <el-table-column v-for="(label,index) in lableNames.excluded" :key="index" :label="label" :prop="excludedProps[index]" :width="width[index]"></el-table-column>
            </el-table>
            <el-col :span="24" class="mod-toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                :page-size="20" :total="total" style="float:right;" :current-page="currentPage">
                </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogCouponVisible = false">取 消</el-button>
                <el-button type="primary" @click="chooseCouponSubmit('excluded',$event)">提交</el-button>
            </div>
        </el-dialog>

        <!-- 导入商品 -->
        <el-dialog
        title="导入商品"
        :visible.sync="dialogImportedGoods"
        size="tiny"
        :before-close="handleClose">
                <!-- <el-input icon="upload"> -->
                    <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-change="handleChange"
                    :file-list="fileList3"
                    :before-upload="beforeAvatarUpload">
                    <el-form ref="form"  label-width="80px">
                        <el-form-item label="选择文件">
                            <el-input icon="upload"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
        
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogImportedGoods = false">取 消</el-button>
                <el-button type="primary" @click="chooseCouponSubmit('excluded',$event)">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //上传列表控制
            fileList3: [{
                name: 'food.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
                status: 'finished'
                }, {
                name: 'food2.jpeg',
                url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
                status: 'finished'
            }],

            checked:true,
            checkListBrand:[],
            checkListGoods:[],
            checkListExcluded:[],

            //树形控件数据
            data2: [{
                id: 1,
                label: '一级 1',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                    id: 9,
                    label: '三级 1-1-1'
                    }, {
                    id: 10,
                    label: '三级 1-1-2'
                    }]
                }]
                }, {
                id: 2,
                label: '一级 2',
                children: [{
                    id: 5,
                    label: '二级 2-1'
                }, {
                    id: 6,
                    label: '二级 2-2'
                }]
                }, {
                id: 3,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }, {
                id: 4,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }, {
                id: 5,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }, {
                id: 6,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },


            dialogBrandVisible:false,
            dialogGoodsVisible:false,
            dialogExcludedVisible:false,
            dialogImportedGoods:false,
            //选择品牌（已经被选择的品牌名称）
            hasChosenBrandNames:[],
            //选择品牌（新选择品牌）
            newChosenBrandNames:[],
            //删除品牌缓存index位置值
            delBrandIndex:[],

            //选择商品（已经被选择的商品名称）
            hasChosenGoodsNames:[],
            //选择商品（新选择商品）
            newChosenGoodsNames:[],
            //删除商品缓存index位置值
            delGoodsIndex:[],

            //选择排除商品（已经被选择的排除商品名称）
            hasChosenExcludedNames:[],
            //选择排除商品（新选择排除商品）
            newChosenExcludedNames:[],
            //删除排除商品缓存index位置值
            delExcludedIndex:[],

            //弹窗表单
            formInline:{
                brandName:'',
            },
            // 弹窗列表
			listLoading:true,
			currentPage: 1,
			sels: [],
			tableData: [],
			page: 1,
			total: 0,
			lableNames: {
                brand:["品牌名称"],
                goods:["商品名称"],
                excluded:["商品名称"],
            },//列表标题数组集合
			//列宽
			width:[],
			//请求响应参数名
			brandProps: [
				"brand.name",
            ],//请求响应参数数组集合
            goodsProps: [
				"goods.name",
            ],
            excludedProps: [
				"excluded.name",
			],
			operations: '',//操作列，操作能力数组集合
            index:"",//当前操作的列表行索引，
        };
    },

    methods: {
        //上传
        handleChange(file, fileList) {
            this.fileList3 = fileList.slice(-3);
        },

        //选择品牌、商品、排除商品弹框渲染
        dialogSelectBrand(type,event){
            if ( type== "brand") {
                this.dialogBrandVisible = true;
            }else if(type == "goods"){
                this.dialogGoodsVisible = true;
            }else if(type == "excluded"){
                this.dialogExcludedVisible = true;
            }
            this.getData();
        },
        //选择优惠券弹框关闭回调
        handleClose(done) {
            done();
        },
        // 列表
        onSearch() {
			var self = this;
			//对象键名需要根据rap定义做修改
			var objFormInline = this.formInline,
				objFormDate = this.formDate;
			console.log('submit!');
			//对象合并
			var param = Object.assign(objFormInline, objFormDate);
			console.log(param);
			self.$ajax.post('http://t.com/marketing-management/coupon-management',
					param
					).then((res) =>
					{
						console.log("res suc!");
					}).catch((res)=>{
						console.log("res erro!");
					});
        },
        //翻页
		handleCurrentChange(val)
		{
            this.page = val;
            console.log(val);
			this.getData();
        },

        //品牌列表弹窗，选中某列
        handleSelectionChangeBrand(data,index)
        {   

            this.newChosenBrandNames= [];     
            for (var index = 0; index < data.length; index++) {
                this.newChosenBrandNames.push(data[index].brand.name);
            }
            console.log("newChosenBrandNames[]:"+ this.newChosenBrandNames);

        },
        //商品列表弹窗，选中某列
        handleSelectionChangeGoods(data,index)
        {   
            this.newChosenGoodsNames= [];     
            for (var index = 0; index < data.length; index++) {
                this.newChosenGoodsNames.push(data[index].goods.name);
            }
            console.log("newChosenGoodsNames[]:"+ this.newChosenGoodsNames);
        },
        //排除商品列表弹窗，选中某列
        handleSelectionChangeExcluded(data,index)
        {   
            this.newChosenExcludedNames= [];     
            for (var index = 0; index < data.length; index++) {
                this.newChosenExcludedNames.push(data[index].excluded.name);
            }
            console.log("newChosenExcludedNames[]:"+ this.newChosenExcludedNames);
        },

        //提交
        chooseCouponSubmit(type,event)
        {
            if (type == "brand") {
                this.dialogBrandVisible = false;
                for (var index = 0; index < this.newChosenBrandNames.length; index++) {
                    this.hasChosenBrandNames.push(this.newChosenBrandNames[index]);
                }
            }else if(type == "goods"){
                this.dialogGoodsVisible = false;
                for (var index = 0; index < this.newChosenGoodsNames.length; index++) {
                    this.hasChosenGoodsNames.push(this.newChosenGoodsNames[index]);
                }
            }else if(type == "excluded"){
                this.dialogExcludedVisible = false;
                for (var index = 0; index < this.newChosenExcludedNames.length; index++) {
                    this.hasChosenExcludedNames.push(this.newChosenExcludedNames[index]);
                }
            }
            
        },
		//请求列表数据
		getData()
		{
			let self = this;
			self.currentPage = self.page;
			self.listLoading = true;
			self.$ajax.post('http://t.com/marketing-management/coupon-management/list',
			{
				page: self.page
			}).then((res) =>
			{
				self.total = res.data.total;
				self.tableData = res.data.tableData;
				self.listLoading = false;
			});
        },
        
        //更新品牌栏中选中品牌的位置信息
        reloadIndex(type,index){
            if (type == "brand") {
                if(event.target.checked){
                    this.delBrandIndex.push(index);
                    if(this.checkListBrand.length == this.delBrandIndex.length ){
                        console.log(this.delBrandIndex);
                    }
                }else{
                    if(this.checkListBrand.length !== this.delBrandIndex.length ){
                        console.log(index)
                        for (var i = 0; i < this.delBrandIndex.length; i++) {
                            if (index === this.delBrandIndex[i]) {
                                this.delBrandIndex.splice(i,1);
                            }
                        }
                        console.log(this.delBrandIndex);
                    }
                }
            }else if(type == "goods"){
                if(event.target.checked){
                    this.delGoodsIndex.push(index);
                    if(this.checkListGoods.length == this.delGoodsIndex.length ){
                        console.log(this.delGoodsIndex);
                    }
                }else{
                    if(this.checkListGoods.length !== this.delGoodsIndex.length ){
                        console.log(index)
                        for (var i = 0; i < this.delGoodsIndex.length; i++) {
                            if (index === this.delGoodsIndex[i]) {
                                this.delGoodsIndex.splice(i,1);
                            }
                        }
                        console.log(this.delGoodsIndex);
                    }
                }
            }else if(type == "excluded"){
                if(event.target.checked){
                    this.delExcludedIndex.push(index);
                    if(this.checkListExcluded.length == this.delExcludedIndex.length ){
                        console.log(this.delExcludedIndex);
                    }
                }else{
                    if(this.checkListExcluded.length !== this.delExcludedIndex.length ){
                        console.log(index)
                        for (var i = 0; i < this.delExcludedIndex.length; i++) {
                            if (index === this.delExcludedIndex[i]) {
                                this.delExcludedIndex.splice(i,1);
                            }
                        }
                        console.log(this.delExcludedIndex);
                    }
                }
            } 
        },
        //根据记录的位置信息，删除对应的品牌
        delBranIndex(type,event){
            if (type == "brand") {
                var checkListBrand = this.checkListBrand;
                var delBrandIndex = this.delBrandIndex.sort(function(a,b){return a>b?1:-1});
                console.log(delBrandIndex);
                for (var index = 0; index < delBrandIndex.length; index++) {
                    var i = delBrandIndex[index];
                    this.hasChosenBrandNames.splice(i-1*index,1);
                }
                this.delBrandIndex=[];
                this.checkListBrand=[];
            }else if(type == "goods"){
                var checkListGoods = this.checkListGoods;
                var delGoodsIndex = this.delGoodsIndex.sort(function(a,b){return a>b?1:-1});
                console.log(delGoodsIndex);
                for (var index = 0; index < delGoodsIndex.length; index++) {
                    var i = delGoodsIndex[index];
                    this.hasChosenGoodsNames.splice(i-1*index,1);
                }
                this.delGoodsIndex=[];
                this.checkListGoods=[];
            }else if(type == "excluded"){
                var checkListExcluded = this.checkListExcluded;
                var delExcludedIndex = this.delExcludedIndex.sort(function(a,b){return a>b?1:-1});
                console.log(delExcludedIndex);
                for (var index = 0; index < delExcludedIndex.length; index++) {
                    var i = delExcludedIndex[index];
                    this.hasChosenExcludedNames.splice(i-1*index,1);
                }
                this.delExcludedIndex=[];
                this.checkListExcluded=[];
            }
        },
        //导入商品
        importedGoods(type,event){
            if (type == "goods") {
                this.dialogImportedGoods = true;
            }else if(type == "excluded"){
                this.dialogImportedGoods = true;
            }
        },
        //验证上传文件格式
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'xls/xlsx';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传文件只能是 xls/xlsx 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传文件大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
}
</script>
<style lang="scss">
.el-tree-node__content > .el-checkbox{
    float: right;
}
.el-card__body{
    padding: 20px 5px;
}
</style>

<style lang="scss" scoped>
.page-view{
    background-color: #fff;
    padding: 35px 30px;
}
.title-check{
    margin:16px 0;
}
.exclude-title{
    font-size: 16px;
}
.el-card{
    height: 450px;
    min-width: 310px;
}
.last-row{
    margin-top: 35px;
}
.el-tree{
    overflow: auto;
    height: 410px;
    border: none;
}
.brand-checkbox-group{
    height: 370px;
    margin-bottom: 10px;
    overflow: auto;
    .col-checkbox{
        margin-left:0px;
        display: block;
        height: 30px;
        line-height:30px;
    }
    // border:1px solid #000;
}
.goods-checkbox-group{
    height: 370px;
    margin-bottom: 10px;
    overflow: auto;
    // border:1px solid #000;
    .col-checkbox{
        margin-left:0px;
        display: block;
        height: 30px;
        line-height:30px;
    }
}
.excluded-checkbox-group{
    height: 370px;
    margin-bottom: 10px;
    overflow: auto;
    // border:1px solid #000;
    .col-checkbox{
        margin-left:0px;
        display: block;
        height: 30px;
        line-height:30px;
    }
}
</style>


