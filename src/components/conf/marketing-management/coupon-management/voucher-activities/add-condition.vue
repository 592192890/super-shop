<template>
<div>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" label-position="left">
    <div :class="{ mask: isView }">
        <el-form-item label="序号" required>
            <span>{{serial}}</span>
        </el-form-item>
        <el-form-item label="条件名称" prop="name">
            <!-- <el-col :span="7"> -->
            <el-input class="full" v-model="ruleForm.name"  placeholder="请输入名称"></el-input>
            <!-- </el-col> -->
        </el-form-item>
    </div>
    <!-- <el-form-item label="参与门店" prop="chooseStroe"> -->
    <el-form-item label="参与门店">
        <!-- <el-button @click="dialogImportStroe">导入店铺</el-button> -->
        <el-button @click="dialogSelectStroe">选择店铺</el-button>
        <div class="shop-inf" v-if="hasChosenStroeId.length">当前已选择<span>{{hasChosenStroeId.length}}</span>个门店</div>
        <!-- <div class="stroe-inf" v-for="(name,index) in hasChosenStroeNames" :key="index">
            <span>{{name}}</span><el-button class="text-btn" type="text" @click="dialogSelectStroe(index)">更换</el-button>
        </div> -->
    </el-form-item>
    <!-- <el-form-item label="参与活动商品" prop="participatingGoods"> -->
    <el-form-item label="参与活动商品">
        <el-checkbox-group v-model="ruleForm.participatingGoods" @change="chooseGoods" :max="1">
            <el-checkbox :label="true">全部商品</el-checkbox>
        </el-checkbox-group>
            <!-- <el-checkbox label="部分商品"> -->
        <el-button class="choose" @click="addGoods">手动添加商品</el-button><el-button v-if="goodsSelsAr.length" type="primary" size="mini">您已选择了商品</el-button>
            <!-- </el-checkbox> -->
        
    </el-form-item>
    <div :class="{ mask: isView }">
    <el-form-item label="实付金额">
        <el-radio-group v-model="ruleForm.price" @change="price">
            <el-radio label="不限"></el-radio>
            <el-form-item prop="paidPrice">
                <el-radio label="单笔订单金额" class="inline"></el-radio><span class="font">>=</span><el-input v-model="ruleForm.paidPrice" @change="paidPrice"></el-input><span class="font">元可用</span>
            </el-form-item>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="商品总数量">
        <el-radio-group v-model="ruleForm.quantity" @change="quantity">
            <el-radio label="不限"></el-radio>
            <el-form-item prop="orderQuantity">
            <el-radio label="单笔商品数量" class="inline"></el-radio><span class="font">>=</span><el-input v-model="ruleForm.orderQuantity" @change="orderQuantity"></el-input><span>个可用</span>
            </el-form-item>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="积分">
        <el-radio-group v-model="ruleForm.integral" @change="integral">
            <el-radio label="不限"></el-radio>
            <el-form-item prop="integralNum">
            <el-radio label="积分" class="inline"></el-radio><span class="font">>=</span><el-input v-model="ruleForm.integralNum" @change="integralNum"></el-input><span>可用</span>
            </el-form-item>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="优惠券数量">
        <!-- <el-form-item prop="couponNum" class="margin-bottome">
            <div><span>同一用户优惠券数量<=</span><el-input v-model="ruleForm.couponNum"  placeholder=""></el-input><span>张</span></div>
        </el-form-item> -->
        <el-form-item prop="releasesNum">
		    <div><span>同一用户每天最多发放次数</span><el-input v-model="ruleForm.releasesNum"  placeholder=""></el-input><span>次</span></div>
        </el-form-item>
	</el-form-item>
    <el-form-item label="注册时间">
            <el-form-item prop="startDate" class="line">
            <el-date-picker class="time-input" type="date" placeholder="请选择" v-model="ruleForm.startDate"></el-date-picker>
            </el-form-item>
            <span class="line">-</span>
            <el-form-item prop="endDate" class="line">
            <el-date-picker class="time-input" type="date" placeholder="请选择" v-model="ruleForm.endDate"></el-date-picker>
            </el-form-item>
	</el-form-item>
    <el-form-item label="排除参与活动">
        <el-card class="box-card">
            <el-checkbox label="全选" v-model="ruleForm.exclusionCheckAll" :indeterminate="isIndeterminateExclusion" name="type" @change="handleCheckAllChangeExclusion"></el-checkbox>
            <el-checkbox-group v-model="ruleForm.exclusion" @change="handleCheckedExclusionlChange">                
                <el-checkbox v-for="(option,index) in options.options6" :key="index" :label="option.value" name="channel">{{option.name}}</el-checkbox>
            </el-checkbox-group>
        </el-card>
    </el-form-item>
    </div>
	<el-form-item>
		<el-button type="primary" @click="submitForm('ruleForm')" v-if="!isView">保存</el-button>
		<el-button @click="resetForm('ruleForm')" v-if="!isView">取消</el-button>
        <el-button @click="resetForm('ruleForm')" v-if="isView">返回</el-button>
	</el-form-item>
	</el-form>
    <!-- 选择店铺弹窗 -->
    <el-dialog
    title="选择店铺"
    class="mod-pop"
    :visible.sync="dialogStroeVisible"
    size="large"
    :before-close="handleClose">
        <!-- 表单 -->
        <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
            <el-form-item label="店铺名称">
                <el-input class="shop-name" v-model="formInline.shopName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="店铺编码">
                <el-input class="shop-name" v-model="formInline.shopId" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="业态">
                <el-select v-model="formInline.department" placeholder="请选择业态">
                    <el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="btn-area">
                <div class="reset-btn">
                    <el-button size="large" @click="onReset">重置</el-button>
                </div>
                <div class="search-btn">
                    <el-button type="primary" size="large" @click="onSearch">搜索</el-button>
                </div>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div :class="{ mask: isView }">
        <div class="mod-search-table">
        <el-table class="elTable" :data="tableData" style="width: 100%" ref="elTable" v-loading="listLoading" @select="handleSelectionChange" @select-all="selectAll">
            <el-table-column type="selection" width="60px"></el-table-column>
            <el-table-column v-for="(label,index) in lableNames" :key="index" :label="label" :prop="props[index]" :width="width[index]"></el-table-column>
            <el-table-column label="操作" v-if="operations" width="200px" fixed="right">
                <template scope="scope">
                    <el-button type="text" :disabled="isBtnDisabled[scope.$index][index]" v-for="(operation,index) in operations" :key="operation" @click.native="whichType(operation,scope.$index)">{{operation}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
        </div>
        <el-col :span="24" class="mod-toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
            :total="total" style="float:right;" :current-page="currentPage">
            </el-pagination>
        </el-col>
        <div slot="footer" class="dialog-footer">
            <el-button @click="chooseStroeClose" v-if="isView">返回</el-button>
            <el-button @click="chooseStroeClose" v-if="!isView">取 消</el-button>
            <el-button type="primary" @click="chooseStroeSubmit" v-if="!isView">提交</el-button>
        </div>
    </el-dialog>
    <!-- 选择商品 -->
    <add-part-goods :bus="bus" :isView="isView"></add-part-goods>
    <!-- 导入店铺 -->
    <shop-import :bus="bus"></shop-import>
</div>
</template>
<script>
import Vue from 'vue'
import _ from 'lodash'
import addPartGoods from '@/components/common/add-participate-product/index.vue'
import shopImport from '@/components/common/add-shop-import/index.vue'
export default {
    components:{
		addPartGoods,shopImport
	},
    data() {
        //选择店铺验证
        var validateChooseStroe = (rule, value, callback) => {
            if (this.hasChosenStroeId.length==0) {
                callback(new Error('请选择参与店铺'));
            }else{
                callback();
            }
        };
        var validateChooseGoods = (rule, value, callback) => {
            if (this.goodsSelsAr.length==0) {
                callback(new Error('请选择参与商品'));
            }else{
                callback();
            }
        };
        
        var validatePaidPrice = (rule, value, callback) => {
            if (this.ruleForm.price && this.ruleForm.price == "单笔订单金额" && !this.ruleForm.paidPrice) {
                callback(new Error('请输入金额'));
            }else{
                callback();
            }
        };
        var validateOrderQuantity = (rule, value, callback) => {
            if (this.ruleForm.quantity && this.ruleForm.quantity == "单笔商品数量" && !this.ruleForm.orderQuantity) {
                callback(new Error('请输入数量'));
            }else{
                callback();
            }
        };
        var validateIntegralNum = (rule, value, callback) => {
            if (this.ruleForm.integral && this.ruleForm.integral == "积分" && !this.ruleForm.integralNum) {
                callback(new Error('请输入积分条件'));
            }else{
                callback();
            }
        };
        //注册时间大于开始时间验证
        var validateEndDate = (rule, value, callback) => {
            if (Date.parse(this.ruleForm.startDate)>=Date.parse(this.ruleForm.endDate)) {
                callback(new Error('时间需晚于起始时间'));
            }else if((!this.ruleForm.startDate && this.ruleForm.endDate) || (this.ruleForm.startDate && !this.ruleForm.endDate)){
                 callback(new Error('请选择完整的时间段'));
            }else{
                callback();
            }
        }
        return {
            shopData:"",
            isView:false,
            serial:1,//序号
            goodsSelsAr:[],
            form:{
                // goodsSels:{'0':[{id:'1',text:'123'}],'1':[{id:'2',text:'123'}],'2':[{id:'2',text:'333'}],'3':[{id:'2',text:'444'}]},//已选择的分类 品牌 商品信息
                goodsSels:{},
            },
            bus: new Vue(),
            isIndeterminateExclusion:false,
            
            //选择店铺id（店铺id 正式数据）
            hasChosenStroeId:[],
            //选择店铺id（当前页选择的数据）
            newChosenStroeId:[],
            //当前页上一次选中的店铺数量
            lastLength:0,
            //选择店铺id（店铺id 非正式数据）
            stroeId:[],
            selectId:[],

            ruleForm: {
                name:'',
                participatingGoods:false,
                price:'不限',
                paidPrice:'',
                quantity:'不限',
                orderQuantity:'',
                integral:'不限',
                integralNum:'',
                // couponNum:'',
                releasesNum:'',
                startDate:'',
                endDate:'',
                exclusion:[],
                exclusionCheckAll:false,
            },
            rules: {
                name: [
                    { required: true, min:0, max: 30, message: '条件名称不能为空，最多可输入30个字符，不能输入特殊符号', trigger: 'blur' },
                    {pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, message:'不能输入特殊符号'}
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                chooseStroe:[
                    { required: true, validator: validateChooseStroe, trigger: 'change' }
                ],
                participatingGoods: [
                    { required: true, validator: validateChooseGoods, trigger: 'change' }
                ],
                endDate: [
                    { validator: validateEndDate, trigger: 'change'}
                ],
                paidPrice:[
                    { required: true, validator: validatePaidPrice, trigger: 'change' },
                    {pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
                ],
                orderQuantity:[
                    { required: true, validator: validateOrderQuantity, trigger: 'change' },
                    { pattern:/^([1-9]\d*)$/, message:'数量必须为正整数'}
                ],
                integralNum:[
                    { required: true, validator: validateIntegralNum, trigger: 'change' },
                    { pattern:/^([1-9]\d*)$/, message:'积分必须为正整数'}
                ],
                // couponNum:[
                //     { pattern:/^([1-9]\d*)$/, message:'数量必须为正整数'}
                // ],
                releasesNum:[
                    { pattern:/^([1-9]\d*)$/, message:'次数必须为正整数'}
                ],
            },
             options:{
                options6:[],
            },
            dialogStroeVisible :false,
            dialogGoodsVisible:false,


            //弹窗表单
            formInline:{
                shopName:'',
                shopId:'',
                department:''
            },
            departmentData:[],//业态数据
            // 弹窗列表
			isBtnDisabled:[],
			listLoading:true,
			currentPage: 1,
			sels: [],
			tableData: [],
			page: 1,
			total: 0,
			lableNames: [
				"店铺编码",
                "店铺名称",
                "店铺ID",
				"业态",
			],//列表标题数组集合
			//列宽
			width:[],
			//请求响应参数名
			props: [
				"shopMdCode",
                "shopName",
                "id",
				"businessTypeName",
			],//请求响应参数数组集合
			operations: '',//操作列，操作能力数组集合
            index:"",//当前操作的列表行索引，



            //请求数据
             ruleItemList:[],
        };
    },
    mounted(){
        //判断是否查看详情
        if(sessionStorage.getItem("isView")){
            this.isView = true;
        }

        this.bus.$on('part-goods/submit', sels => {
            this.form.goodsSels = sels;
            this.getGoodsSelsAr();
        });
        this.bus.$on('importShop/submit', importIds => {
            // this.form.goodsSels = sels;
            this.mergeShopIds(importIds);
        });



        //营销活动接口
        this.$ajax.post(this.$apiUrl.coupon.getActiveToolids
        ).then((res) =>
        {
            if (res.error !== 0) {
                this.$message({
                message: res.msg,
                type: 'error'
                });
            }
            var data = res.data;
            for (var index = 0; index < data.length; index++) {
                this.options.options6.push(data[index])                 
            }
        })



        var isModifyEnterCondition = this.$store.state.voucherActivities.enterCondition.isModifyEnterCondition
        if(isModifyEnterCondition){
            var index = this.$store.state.voucherActivities.enterCondition.index;//当前修改的规则位置
            //修改状态进入
            //表单数据注入
            var ruleItemList = JSON.parse(sessionStorage.getItem("ruleItemList"));
            this.serial = index+1;//序号值注入
            //单笔订单金额大于X元送券
            if (ruleItemList[index].condAmount == 0) {
                this.ruleForm.paidPrice="";
                this.ruleForm.price = "不限"
            }else{
                this.ruleForm.paidPrice=ruleItemList[index].condAmount;	
                this.ruleForm.price = "单笔订单金额"
            }

            //单笔订单商品数量大于X件送券
            if (ruleItemList[index].condGoods == 0) {
                this.ruleForm.orderQuantity="";
                this.ruleForm.quantity = "不限"
            }else{
                this.ruleForm.orderQuantity=ruleItemList[index].condGoods;
                this.ruleForm.quantity = "单笔商品数量"
            }
            //积分大于X送券
            if (ruleItemList[index].condPoints == 0) {
                this.ruleForm.integralNum="";
                this.ruleForm.integral = "不限"
            }else{
                this.ruleForm.integralNum=ruleItemList[index].condPoints;
                this.ruleForm.integral = "积分"
            }
            if (ruleItemList[index].regEndTime) {
                this.ruleForm.endDate=new Date(ruleItemList[index].regEndTime);//注册结束时间
            }
            if (ruleItemList[index].regStartTime) {
                this.ruleForm.startDate=new Date(ruleItemList[index].regStartTime);//注册开始时间
            }
            if (ruleItemList[index].excludeTool.length>0 && ruleItemList[index].excludeTool.length!==18) {
                this.isIndeterminateExclusion = true;
                var exclusion = [];
                for (var i = 0; i < ruleItemList[index].excludeTool.length; i++) {
                    exclusion.push(parseInt(ruleItemList[index].excludeTool[i]));
                    
                }
                this.ruleForm.exclusion=exclusion;	//排除参与活动	array	@mock=(团购;秒杀)
            }
            if (ruleItemList[index].excludeTool.length == 18) {
                this.ruleForm.exclusionCheckAll = true;
                this.isIndeterminateExclusion = false;
                var exclusion = [];
                for (var i = 0; i < ruleItemList[index].excludeTool.length; i++) {
                    exclusion.push(parseInt(ruleItemList[index].excludeTool[i]));
                    
                }
                this.ruleForm.exclusion=exclusion;	//排除参与活动	array	@mock=(团购;秒杀)
            }
            this.ruleForm.name=ruleItemList[index].itemName;	//条件名称	number	@mock=5
            // this.ruleForm.endDate=new Date(ruleItemList[index].regEndTime);//注册结束时间
            // this.ruleForm.startDate=new Date(ruleItemList[index].regStartTime);//注册起始时间(满足条件送券)
            this.stroeId = ruleItemList[index].shopIds;//店铺id
            sessionStorage.setItem("ids",JSON.stringify(this.stroeId));//!!消除this.stroeId和this.hasChosenStroeId的连理关系
            this.hasChosenStroeId = JSON.parse(sessionStorage.getItem("ids"));//店铺id
            sessionStorage.removeItem("ids");
            // this.ruleForm.couponNum=ruleItemList[index].userMaxNum;	//单个用户最大领券数	number	@mock=10
            this.ruleForm.releasesNum=ruleItemList[index].userMaxNumDaily;//同一用户每天最多发放次数
            this.form.goodsSels = ruleItemList[index].productsSels;//商品信息
            this.getGoodsSelsAr();//商品数量
            if(ruleItemList[index].isAllProducts){//判断是否选择了全部商品
                this.ruleForm.participatingGoods = true;
            }
        }else{
            // 新增进入单独处理序号值
            var ruleItemList = JSON.parse(sessionStorage.getItem("ruleItemList"));
            if(ruleItemList){
                this.serial = ruleItemList.length+1;
            }else{
                this.serial = 1;
            }
            
        }
    },
    methods: {
        submitForm(formName) { 
            if(this.$store.state.voucherActivities.isEditorEnter){
                var createTime="",
                updateTime=Date.parse(new Date());
            }else{
                var createTime=Date.parse(new Date()),
                updateTime="";
            }
            var ruleItemListData={	//发放条件	array<object>	
                condAmount:this.ruleForm.paidPrice,	//单笔订单金额大于X元送券	number	@mock=100
                condGoods:this.ruleForm.orderQuantity,	//单笔订单商品数量大于X件送券	number	@mock=18
                condPoints:this.ruleForm.integralNum,	//积分大于X送券	number	@mock=100000
                createTime:createTime,	//创建时间	number	@mock=1504169476000
                excludeTool:this.ruleForm.exclusion,	//排除参与活动	array	@mock=(团购,秒杀)
                issueId:sessionStorage.getItem("activityId"),	//发券活动编码	number	@mock=1000000868
                itemName:this.ruleForm.name,	//条件名称	number	@mock=5
                productsSels:this.form.goodsSels,//商品选择	object
                isAllProducts:this.ruleForm.participatingGoods,//是否勾选全部商品
                regEndTime:Date.parse(this.ruleForm.endDate),	//注册结束时间	number	@mock=7865121221313
                regStartTime:Date.parse(this.ruleForm.startDate),	//注册起始时间(满足条件送券)	number	@mock=7865121221313
                ruleId:sessionStorage.getItem("ruleId"),	//发券活动规则编码	number	@mock=3252123
                shopIds:this.hasChosenStroeId,	//门店id	array	@mock=(120237)
                updateTime:updateTime,	//更新时间	number	@mock=1504169476000
                // userMaxNum:this.ruleForm.couponNum,	//单个用户最大领券数	number	@mock=10
                userMaxNumDaily:this.ruleForm.releasesNum,//同一用户每天最多发放次数	number	@mock=5
            };
            this.$refs[formName].validate((valid) => {
            if (valid) {
                var ruleItemList = [];
                if (JSON.parse(sessionStorage.getItem("ruleItemList"))) {
                    var cookieRuleItemList = JSON.parse(sessionStorage.getItem("ruleItemList"));
                    for (var index = 0; index < cookieRuleItemList.length; index++) {//遍历当前所有条件，推入数组中
                        ruleItemList.push(cookieRuleItemList[index]);
                    }
                }
                    // ruleItemList.push(ruleItemListData);//将本次新增/修改数据推入数组栈中
                //判断当前是新增提交或修改提交
                if(this.$store.state.voucherActivities.enterCondition.isModifyEnterCondition){//修改提交
                    var index = this.$store.state.voucherActivities.enterCondition.index;//当前修改的规则位置
                    this.$store.commit('mutationsToSubmitModifyCondition', index);
                    ruleItemList.splice(index,1,ruleItemListData);//将本次修改数据替换到原有规则位置
                }else{//新增提交
                    this.$store.commit('mutationsToSubmitModifyCondition', index);
                    ruleItemList.push(ruleItemListData);//将本次新增数据推入数组栈中
                }


                if (ruleItemList.length>0) {
                    sessionStorage.setItem("ruleItemList",JSON.stringify(ruleItemList));//更新当前所建立的条件
                }
                this.$router.push({name:'发放规则'});
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {
            if (this.isView) {
                this.$refs[formName].resetFields();
                this.$store.commit('mutationsToBackModifyCondition');
                this.$router.push({name:'发放规则'});
            }else{
                this.$confirm('放弃填写?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs[formName].resetFields();
                    this.$store.commit('mutationsToBackModifyCondition');
                    this.$router.push({name:'发放规则'});
                });
            }
            
        },
        dialogSelectShop(){
            this.dialogShopVisible = true;
            this.$store.commit("mutationsToSelectShop");
        },
        dialogSelectGoods(){
            this.dialogGoodsVisible = true;
            this.$store.commit("mutationsToSelectShop");
        },
        //排除用券条件全选
        handleCheckAllChangeExclusion(event) {
            var label = [];
            for (var index = 0; index < this.options.options6.length; index++) {
                label.push(this.options.options6[index].value);
            }
                this.ruleForm.exclusion = event.target.checked ? label : [];
                this.isIndeterminateExclusion = false;
        },
        handleCheckedExclusionlChange(value){
                let checkedCount = value.length;
                this.ruleForm.exclusionCheckAll = checkedCount == this.options.options6.length;
                this.isIndeterminateExclusion = checkedCount > 0 && checkedCount < this.options.options6.length;
        },
        //导入店铺弹窗
        dialogImportStroe(){
            this.bus.$emit('importShop/dialog', {});
        },
        //选择店铺弹窗
        dialogSelectStroe(index){
            //获取当前所有业务线
            this.$ajax.post(this.$apiUrl.allType
			).then((res) =>
			{
                if (res.error !== 0) {
					this.$message({
					message: res.msg,
					type: 'error'
                    });
                }
                var data = res.data;
                for (var index = 0; index < data.length; index++) {
                    this.departmentData.push(data[index])                 
                }
            })
            
            this.dialogStroeVisible = true;
            this.getData();
            
            // if (typeof index === 'number' ) {
            //     this.hasChosenStroeId.splice(index,1);
            // }
        },
        //根据门店id，门店自动选择
        selectedOption(shopId){
            var self = this;
                var rows = [];
                self.selectId = [];
                var tableData = self.tableData;
                for (var i = 0; i < shopId.length; i++) {
                    var id = shopId[i];
                    for (var index = 0; index < tableData.length; index++) {
                        if(id == tableData[index].id){
                            rows.push(index);
                            self.selectId.push(id);
                        }
                    }                    
                }
                self.lastLength = rows.length;//数据变化时，将上次选择的数量重置为当前页匹配到的选择数量
            //列表注入数据后再设置选中
            setTimeout(function() {
                for (var index = 0; index < rows.length; index++) {
                    var row = rows[index];
                    self.$refs.elTable.toggleRowSelection(self.tableData[row]);
                }
            }, 100);    
        },
        //选择门店弹框关闭回调
        handleClose(done) {
            if (this.hasChosenStroeId.length) {//如果之前已经存有门店数据
                this.stroeId = [];
                sessionStorage.setItem("stroeId",JSON.stringify(this.hasChosenStroeId));
                this.stroeId = JSON.parse(sessionStorage.getItem("stroeId")); //stroeId重置为已存有的数据
                sessionStorage.removeItem("stroeId");
            }else{
                this.stroeId = [];
            }            
            this.formInline.shopName='';
            this.formInline.shopId='';
            this.formInline.department=''
            done();
        },
        //店铺弹窗返回
        chooseStroeClose(){
            this.dialogStroeVisible = false;
            if (this.hasChosenStroeId.length) {//如果之前已经存有门店数据
                this.stroeId = [];
                sessionStorage.setItem("stroeId",JSON.stringify(this.hasChosenStroeId));
                this.stroeId = JSON.parse(sessionStorage.getItem("stroeId")); //stroeId重置为已存有的数据
                sessionStorage.removeItem("stroeId");
            }else{
                this.stroeId = [];
            }
            this.formInline.shopName='';
            this.formInline.shopId='';
            this.formInline.department=''
        },
        // 列表
        onSearch() {
            this.getData();
        },
        onReset(){
			this.formInline.department = "",
            this.formInline.shopName="",
            this.formInline.shopId="",
			this.getData();
		},
        //翻页
		handleCurrentChange(val)
		{
            this.currentPage = val;
			this.getData();
        },
        //选中某列
        handleSelectionChange(selection, row)
        {   
            this.newChosenStroeId= [];    
            for (var index = 0; index < selection.length; index++) {
                this.newChosenStroeId.push(selection[index].id);
            }
            //判断是取消勾选还是新增勾选
            var lastLength = this.lastLength;//上次选择时的数量
            var nowLength = selection.length;//本次选择时的数量
            if (lastLength>nowLength) {//用户有取消勾选操作
                for (var index = 0; index < this.stroeId.length; index++) {//判断取消的是哪一个id
                    if(row.id == this.stroeId[index]){
                        this.stroeId.splice(index,1);//将取消勾选的门店id删除
                    } 
                }
            }else if (lastLength<nowLength) {//用户有新增勾选操作
                this.stroeId.push(row.id);
            }
            this.lastLength = selection.length;//将本次勾选的数量存储
        },
        //选中当前页全部列
        selectAll(selection){
            if (selection.length) {//全部选中
                this.newChosenStroeId = [];
                var id=[];
                for (var index = 0; index < selection.length; index++) {
                    id.push(selection[index].id);
                }
                this.newChosenStroeId = id;
                var ids = [].concat(id,this.stroeId);
                //重复数据删除
                this.stroeId = this.unique(ids);
                this.lastLength = selection.length;
            }else{//全部取消(能触发的前提是当前页数据全部选中)
                if (this.selectId.length && this.newChosenStroeId.length) {
                    if (this.selectId.length == this.newChosenStroeId.length) {
                        this.stroeId = _.difference(this.stroeId,this.selectId);
                        this.lastLength = 0;
                    }else if(this.selectId.length < this.newChosenStroeId.length){
                        this.stroeId = _.difference(this.stroeId,this.newChosenStroeId);
                        this.lastLength = 0;
                    }
                }else if(!this.selectId.length && this.newChosenStroeId.length){
                    this.stroeId = _.difference(this.stroeId,this.newChosenStroeId);
                    this.lastLength = 0;
                }else if(this.selectId.length && !this.newChosenStroeId.length){
                    this.stroeId = _.difference(this.stroeId,this.selectId);
                    this.lastLength = 0;
                }
            }
        },
        //数组内重复数据只保留一个
        unique(arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        },
        //提交
        chooseStroeSubmit()
        {
            this.dialogStroeVisible = false;
            //采用缓存实现监听断层，不能直接进行赋值操作（直接赋值会将临时数据与正式数据一一对应监听）
            sessionStorage.setItem("stroeId",JSON.stringify(this.stroeId));
            this.hasChosenStroeId = JSON.parse(sessionStorage.getItem("stroeId"));
            sessionStorage.removeItem("stroeId");
            this.formInline.shopName='';
            this.formInline.shopId='';
            this.formInline.department=''
        },
        //导入的门店数据与已选择的门店数据融合，避免重复
        mergeShopIds(importIds){
            this.hasChosenStroeId = _.union(importIds,this.hasChosenStroeId);
        },
		//请求列表数据
		getData()
		{
            let self = this;
            var param = {
                businessTypeCode:this.formInline.department,
                shopName:this.formInline.shopName,
                shopMdCode:this.formInline.shopId,
                currentPage:1,
                pageSize:10,
            }

			param.currentPage = self.currentPage;
			self.listLoading = true;
			self.$ajax.post(this.$apiUrl.shopSearch,param
			).then((res) =>
			{
				self.total = res.data.totalRow;
				self.tableData = res.data.list;
                self.listLoading = false;
                self.selectedOption(self.stroeId);
			});
        },
        //选择参与商品
        addGoods(){
            this.ruleForm.participatingGoods = false;
            this.bus.$emit('index/addGoods', {flag:true, sels:this.form.goodsSels,shopIds:this.hasChosenStroeId});
        },

        getGoodsSelsAr(){
            var ar = [];
            for(var key in this.form.goodsSels){
                if(key!='excludeProducts'){ //exclude item
                    ar = [].concat(ar, this.form.goodsSels[key]);
                }
            }
            this.goodsSelsAr = ar;
            return ar;
        },
        clearGoodsSelsAr(){
            var ar = [];
            for(var key in this.form.goodsSels){
                this.form.goodsSels[key] = [];
                ar = [].concat(ar, this.form.goodsSels[key]);
            }
            this.goodsSelsAr = ar;
            return ar;
            
        },



        chooseGoods(value){
            if (value) {//选择了全部商品
                this.clearGoodsSelsAr();
                // this.bus.$emit('index/clearGoods');
            }
        },
        paidPrice(value){
            if (value) {
                this.ruleForm.price = "单笔订单金额" 
            }else{
                this.ruleForm.price = "不限" 
            }
        },
        price(value){
            if (value == "不限") {
                this.ruleForm.paidPrice = ""
            }
        },
        integral(value){
            if (value == "不限") {
                this.ruleForm.integralNum = ""
            }
        },
        integralNum(value){
            if (value) {
                this.ruleForm.integral = "积分" 
            }else{
                this.ruleForm.integral = "不限" 
            }
        },
        quantity(value){
            if (value == "不限") {
                this.ruleForm.orderQuantity = ""
            }
        },
        orderQuantity(value){
            if (value) {
                this.ruleForm.quantity = "单笔商品数量" 
            }else{
                this.ruleForm.quantity = "不限" 
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.el-form{
    background-color: #fff;
    padding: 30px;
    .time-input{
        width: 220px;
    }
}
.date{
    width: 300px!important;
}
.el-radio{
    display: block;
    width: auto;
    margin-left: 0;
}
.el-radio + .el-radio{
    display: inline-block;
}
.el-checkbox{
    width: 160px;
}
.el-checkbox + .el-checkbox{
    margin-left: 0;
}
.inline{
    display: inline-block;
}
.inline + .inline{
    margin-left: 15px;
}
.lineTwo{
    margin-left:0;
}
.line{
    display: inline-block;
}
.el-input{
    display: inline-block;
    width: 80px;
    margin:0 5px;
}
.full{
    width: 454px;
}
.box-card{
    width: 850px;
}
.margin-bottome{
    margin-bottom: 22px;
}
.choose{
    // margin-left:20px;
}
.shop-name{
    width:100%
}
.shop-inf{
    display: inline-block;
    height: 16px;
    line-height: 16px;
    background-color: #3dc8f6;
    color:#fff;
    border-radius:16px;
    padding:5px 10px;
    span{
        padding: 0 4px;
    }
}
.btn-area{
	display: block;
	width: 300px!important;
	z-index: 0;
	.search-btn{
		float: right;
	}
	.reset-btn{
		float: right;
		margin-left: 8px;
	}
}
.mask{
    z-index: 99;
    pointer-events: none;
}
</style>


