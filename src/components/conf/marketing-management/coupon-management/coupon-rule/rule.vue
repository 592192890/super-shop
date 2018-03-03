<template>
<div>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" label-position="left">
	<!-- <el-form-item label="参与门店" prop="name">
        <el-radio-group v-model="ruleForm.participatingStores">
            <el-radio label="全部店铺"></el-radio>
            <el-radio label="部分店铺"></el-radio><el-button class="choose" @click="dialogSelectShop">选择参与店铺</el-button>
        </el-radio-group>
    </el-form-item> -->
    
    <el-form-item label="参与门店" prop="chooseStroe">
    <!-- <el-form-item label="参与门店"> -->
        <!-- <el-button @click="dialogSelectStroe">导入店铺</el-button> -->
        <el-button @click="dialogSelectStroe">选择店铺</el-button>
        <div class="shop-inf" v-if="stroeId.length">当前已选择<span>{{stroeId.length}}</span>个门店</div>
    </el-form-item>
    <!-- <el-form-item label="使用规则名称" prop="ruleName">
            <el-input v-model="ruleForm.ruleName"  placeholder="请输入名称"></el-input>
    </el-form-item> -->
    <el-form-item label="参与活动商品" prop="participatingGoods">
    <!-- <el-form-item label="参与活动商品"> -->
        <!-- <el-radio-group v-model="ruleForm.participatingGoods">
            <el-radio label="全部商品"></el-radio>
            <el-radio label="部分商品"></el-radio> -->
            <el-button class="choose" @click="addGoods">添加商品</el-button><el-button v-if="goodsSelsAr.length" type="primary" size="mini">您已选择了商品</el-button>
        <!-- </el-radio-group> -->
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
    <el-form-item label="可使用优惠券渠道">
        <el-checkbox label="全部" v-model="ruleForm.channelCheckAll" :indeterminate="isIndeterminateChannel" name="type" @change="handleCheckAllChangeChannel"></el-checkbox>
        <el-checkbox-group v-model="ruleForm.channel" @change="handleCheckedChannelChange">
            <el-checkbox label="8" name="channel">线下门店</el-checkbox>
            <el-checkbox label="7" name="channel">App</el-checkbox>
            <el-checkbox label="3" name="channel">H5</el-checkbox>
        </el-checkbox-group>
    </el-form-item>
    <el-form-item label="限制用户首单使用">
        <el-radio-group v-model="ruleForm.restrictUse">
            <el-radio class="inline" label="0">不限</el-radio>
            <el-radio class="inline" label="1">限平台首单</el-radio>
            <el-radio class="inline" label="2">限店铺首单</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="排除用券条件">
        <el-card class="box-card">
            <el-checkbox label="全选" v-model="ruleForm.exclusionCheckAll" :indeterminate="isIndeterminateExclusion" name="type" @change="handleCheckAllChangeExclusion"></el-checkbox>
            <el-checkbox-group v-model="ruleForm.exclusion" @change="handleCheckedExclusionlChange">                
                <el-checkbox v-for="(option,index) in options.options6" :key="index" :label="option.value" name="channel">{{option.name}}</el-checkbox>
            </el-checkbox-group>
        </el-card>
    </el-form-item>
	<el-form-item label="优惠券其他设置">
        <el-form-item prop="dayCanUse" class="margin-bottom">
            <div><span>优惠券发放后</span><el-input v-model="ruleForm.dayCanUse"  placeholder=""></el-input><span>天可用</span></div>
        </el-form-item>
        <el-form-item prop="invalid">
            <div><span>优惠券发放后</span><el-input v-model="ruleForm.invalid"  placeholder=""></el-input><span>天失效</span></div>
        </el-form-item>
	</el-form-item>
    <el-form-item label="积分">
        <el-radio-group v-model="ruleForm.integral" @change="integral">
            <el-radio label="不限"></el-radio>
            <el-form-item prop="integralNum">
            <el-radio label="积分" class="inline"></el-radio><span class="font">>=</span><el-input v-model="ruleForm.integralNum" @change="integralNum"></el-input><span class="font">个可用</span>
            </el-form-item>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="可使用会员" prop="participant">
        <el-radio-group class="radio-group" v-model="ruleForm.participant" @change="showCard">
			<el-radio label="所有用户"></el-radio>
			<el-radio label="注册会员"></el-radio>
			<!-- <el-radio label="会员标签"></el-radio> -->
        </el-radio-group>
        <transition-group name="component-fade">
            <el-card class="user-hide" v-if="participantCardGrade || participantCardTags" key="userGrade">
                <el-form-item prop="userGrade" label="按会员等级筛选" v-if="participantCardGrade">
                    <el-checkbox-group v-model="ruleForm.userGrade">
                        <el-checkbox v-for="(option,index) in memberListData" :label="option.value" :key="index">{{option.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-card>
            
            <!-- <el-card class="user-hide" v-if="participantCardGrade || participantCardTags" key="userTags">
            <el-form-item prop="userTags" label="按会员标签筛选" v-if="participantCardTags">
                <el-checkbox-group v-model="ruleForm.userTags">
                    <el-checkbox label="0">超市VIP</el-checkbox>
                    <el-checkbox label="1">母婴VIP</el-checkbox>
                    <el-checkbox label="2">家电VIP</el-checkbox>
                    <el-checkbox label="3">梅溪新天地会员</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            </el-card> -->
        </transition-group>
	</el-form-item>
    </div>
	<el-form-item>
		<el-button type="primary" @click="submitForm('ruleForm')" v-if="!isView">提交</el-button>
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
        <el-table :data="tableData" style="width: 100%" ref="elTable" v-loading="listLoading" @select="handleSelectionChange" @select-all="selectAll">
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
            <el-button @click="chooseStroeClose"  v-if="isView">返回</el-button>
            <el-button @click="chooseStroeClose"  v-if="!isView">取 消</el-button>
            <el-button type="primary" @click="chooseStroeSubmit" v-if="!isView">提交</el-button>
        </div>
    </el-dialog>
    <!-- 选择商品 -->
    <add-part-goods :bus="bus" :isView="isView"></add-part-goods>
</div>
</template>
<script>
import Vue from 'vue'
// lodash
import _ from 'lodash'
import addPartGoods from '@/components/common/add-participate-product/index.vue'
  export default {
    components:{
		addPartGoods
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
        var validateIntegralNum = (rule, value, callback) => {
            if (this.ruleForm.integral && this.ruleForm.integral == "积分" && !this.ruleForm.integralNum) {
                callback(new Error('请输入积分条件'));
            }else{
                callback();
            }
        };
        // var validateUser = (rule, value, callback) => {
        //     if (!this.ruleForm.userGrade && !this.ruleForm.userTags) {
        //         callback(new Error('请选择一个标记'));
        //     }else{
        //         callback();
        //     }
        // };
        return {
            isView:false,
            goodsSelsAr:[],
            form:{
                // goodsSels:{'0':[{id:'1',text:'123'}],'1':[{id:'2',text:'123'}],'2':[{id:'2',text:'333'}],'3':[{id:'2',text:'444'}]},//已选择的分类 品牌 商品信息
                goodsSels:{},
            },
            bus: new Vue(),
            departmentData:[],//全部业态
            isIndeterminateChannel: false,
            isIndeterminateExclusion:false,
            
            //选择店铺id（店铺id 正式数据）
            hasChosenStroeId:[],
            //选择店铺id（当前页选择的店铺）
            newChosenStroeId:[],
            //当前页上一次选中的店铺数量
            lastLength:0,
            //选择店铺id（店铺id 非正式数据）
            stroeId:[],
            selectId:[],
            chosenStroe:[],
            form:{
                resource:"",
                type:"",
            },
            ruleForm: {
                participant:"",
                userGrade:[],
                userTags:[],
                ruleName:"",
                participatingStores:'',
                participatingGoods:'',
                price:'不限',
                paidPrice:'',
                channel:[],
                restrictUse:'0',
                exclusion:[],
                dayCanUse:'',
                invalid:'',
                integral:'不限',
                integralNum:'',
                type:"",
                exclusionCheckAll:false,
                channelCheckAll:false,
            },
            rules: {
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                chooseStroe:[
                    { required: true, validator: validateChooseStroe, trigger: 'change' }
                ],
                participatingGoods: [
                    { required: true, validator: validateChooseGoods, trigger: 'change' }
                ],
                paidPrice:[
                    { required: true, validator: validatePaidPrice, trigger: 'change' },
                    {pattern:/^\d+(\.\d{1,2})?$/ , message:'金额只允许输入到小数点后两位'}
                ],
                integralNum:[
                    { required: true, validator: validateIntegralNum, trigger: 'change' },
                    { pattern:/^([1-9]\d*)$/, message:'积分必须为正整数'}
                ],
                ruleName: [
                    { required: true, min:0, max: 30, message: '优惠券名称不能为空，最多可输入30个字符，不能输入特殊符号', trigger: 'blur' },
                    {pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, message:'不能输入特殊符号'}
                ],
                dayCanUse:[
                    { pattern:/^([0-9]\d*)$/, message:'天数必须为不小于0的整数'}
                ],
                invalid:[
                    { pattern:/^([0-9]\d*)$/, message:'天数必须为不小于0的整数'}
                ],
                participant: [
                    { required: true, message: '请选择参与活动的会员', trigger: 'change' }
                ],
                userGrade: [
                    { type: 'array',required: true, message: '请选择参与活动的会员等级', trigger: 'change' }
                ],
                userTags: [
                    { type: 'array',required: true, message: '请选择参与活动的会员标签', trigger: 'change' }
                ],
            },
            options:{
                options4:["8","7","3"],
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

            //会员等级
            participantCardGrade:false,
            //会员标签
            participantCardTags:false,

            //会员等级数据
            memberListData:[],
        };
    },
    mounted(){
        //判断是否查看详情
        if(sessionStorage.getItem("isView")){
            this.isView = true;
        }


        this.getGoodsSelsAr();
        this.bus.$on('part-goods/submit', sels => {
            this.form.goodsSels = sels;
            this.getGoodsSelsAr();
        });



        //获取会员等级数据
        this.$ajax.post(this.$apiUrl.coupon.memberList
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
                this.memberListData.push(data[index])                 
            }
        })
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


        if (this.$store.state.couponRule.enterRuleCouponRule.isModifyEnterRuleCouponRule) {
            //以修改状态进入
            var index = this.$store.state.couponRule.enterRuleCouponRule.indexCouponRule;//当前修改的规则是第几个
            var ruleItemList = JSON.parse(sessionStorage.getItem("useRuleList"));
            //信息注入
            this.stroeId = ruleItemList[index].shopIds;//店铺id
            sessionStorage.setItem("ids",JSON.stringify(this.stroeId));//!!消除this.stroeId和this.hasChosenStroeId的连理关系
            this.hasChosenStroeId = JSON.parse(sessionStorage.getItem("ids"));//店铺id
            sessionStorage.removeItem("ids");
            // this.ruleForm.participatingGoods = ""//参与活动商品

            //实付金额大于X元送券
            if (!ruleItemList[index].condAmount) {
                this.ruleForm.paidPrice="";
                this.ruleForm.price = "不限"
            }else{
                this.ruleForm.paidPrice=ruleItemList[index].condAmount;	
                this.ruleForm.price = "单笔订单金额"
            }
            if (ruleItemList[index].excludeTool.length>0 && ruleItemList[index].excludeTool.length!==18) {
                this.isIndeterminateExclusion = true;
                this.ruleForm.exclusion=ruleItemList[index].excludeTool;	//排除参与活动	array	@mock=(团购;秒杀)
            }
            if (ruleItemList[index].excludeTool.length==18) {
                this.ruleForm.exclusionCheckAll = true;
                this.isIndeterminateExclusion = false;
                this.ruleForm.exclusion=ruleItemList[index].excludeTool;	//排除参与活动	array	@mock=(团购;秒杀)
            }

            //可使用优惠券渠道
            if (ruleItemList[index].channels.length>0 && ruleItemList[index].channels.length!==3) {
                this.isIndeterminateChannel = true;

                var channel = [];
                for (var i = 0; i < ruleItemList[index].channels.length; i++) {
                    channel.push(ruleItemList[index].channels[i].toString());
                    
                }
                this.ruleForm.channel=channel;	//可使用优惠券渠道	array	@mock=(团购;秒杀)
            }
            if (ruleItemList[index].channels.length==3) {
                this.ruleForm.channelCheckAll = true;
                this.isIndeterminateChannel = false;
                var channel = [];
                for (var i = 0; i < ruleItemList[index].channels.length; i++) {
                    channel.push(ruleItemList[index].channels[i].toString());
                }
                this.ruleForm.channel=channel;	//可使用优惠券渠道	array	@mock=(团购;秒杀)
            }

            //限制用户首单使用
            if (ruleItemList[index].firstOrderLimited) {
                this.ruleForm.restrictUse = ruleItemList[index].firstOrderLimited.toString();
            }else if (ruleItemList[index].firstOrderLimited === 0) {
                this.ruleForm.restrictUse = ruleItemList[index].firstOrderLimited.toString();
            }
            this.ruleForm.dayCanUse = ruleItemList[index].actDaysLimit;//领券后X天可用
            this.ruleForm.invalid = ruleItemList[index].validDaysLimit;//领券后X天失效

            //积分大于X用券
            if (!ruleItemList[index].condPoints) {
                this.ruleForm.integralNum="";
                this.ruleForm.integral = "不限"
            }else{
                this.ruleForm.integralNum=ruleItemList[index].condPoints;
                this.ruleForm.integral = "积分"
            }

            //可使用会员
            if (ruleItemList[index].userGrade.length>0 || ruleItemList[index].userTags.length>0) {
                this.ruleForm.participant = "注册会员";
             
                this.ruleForm.userGrade = ruleItemList[index].userGrade;
                this.ruleForm.userTags = ruleItemList[index].userTags;
            }else{
                this.ruleForm.participant = "所有用户";
            }
            //添加商品
            this.form.goodsSels = ruleItemList[index].productsSels;//商品信息
            this.getGoodsSelsAr();//商品数量
        }
    },
    methods: {
        submitForm(formName) {
            //可使用渠道数据 转number
            var channels = [];
            if (this.ruleForm.channel.length == 0) {
                channels = [3,7,8]
            }else{
                for (var key in this.ruleForm.channel) {
                    if (this.ruleForm.channel.hasOwnProperty(key)) {
                        channels.push(parseInt(this.ruleForm.channel[key]));
                    }
                }
            }
            
            //店铺id转number
            var shopIds=[];
            for (var key in this.hasChosenStroeId) {
                if (this.hasChosenStroeId.hasOwnProperty(key)) {
                    shopIds.push(parseInt(this.hasChosenStroeId[key]));
                }
            }
            var restrictUse = []
            var ruleItemListData={	//使用规则	array<object>	
                actDaysLimit:parseInt(this.ruleForm.dayCanUse),	//优惠券领取后多少天激活	number	
                channels:channels,	//可使用渠道,8:线下门店 , 7:APP , 3:H5 ( 全部为[3,7,8] )	array<number>	@mock=[3,7]
                condAmount:parseFloat(this.ruleForm.paidPrice),	//优惠券满足使用条件-金额	number	
                condPoints:parseInt(this.ruleForm.integralNum),	//可使用会员-会员积分		
                excludeTool:this.ruleForm.exclusion,	//排除用券的活动id	array<string>	@mock=[12，8]
                firstOrderLimited:parseInt(this.ruleForm.restrictUse),	//首单限制 0:不限制, 1:平台首单使用，2:店铺首单使用	number	
                productsSels:this.form.goodsSels,//商品选择	object
                ruleId:parseInt(sessionStorage.getItem("ruleId")),	//ruleId	number
                
                shopIds:shopIds,	//店铺ID	array<number>	@mock=[1,2,3]
                userGrade:this.ruleForm.userGrade,	//可使用会员-会员等级	array<number>	@mock=[1,2,3]
                userTags:this.ruleForm.userTags,	//可使用会员-会员标签	array<number>	@mock=[1,2,3]
                validDaysLimit:parseInt(this.ruleForm.invalid),	//优惠券激活后多少天有效	number
            };
            if (!this.ruleForm.restrictUse) {
                ruleItemListData.firstOrderLimited = 0;
            }
            if (!this.ruleForm.paidPrice) {
                ruleItemListData.condAmount = 0;
            }
            if (!this.ruleForm.integralNum) {
                ruleItemListData.condPoints = 0;
            }
            var ruleItemList = [];
            if (JSON.parse(sessionStorage.getItem("useRuleList"))) {
                var cookieRuleItemList = JSON.parse(sessionStorage.getItem("useRuleList"));
                for (var index = 0; index < cookieRuleItemList.length; index++) {//遍历当前所有条件，推入数组中
                    ruleItemList.push(cookieRuleItemList[index]);
                }
            }
                // ruleItemList.push(ruleItemListData);//将本次新增/修改数据推入数组栈中




            this.$refs[formName].validate((valid) => {
            if (valid) {

                //判断当前是新增提交或修改提交
                if(this.$store.state.couponRule.enterRuleCouponRule.isModifyEnterRuleCouponRule){//修改提交
                    var index = this.$store.state.couponRule.enterRuleCouponRule.indexCouponRule;//当前修改的规则位置
                    this.$store.commit('mutationsToSubmitModifyRuleCouponRule', index);
                    ruleItemList.splice(index,1,ruleItemListData);//将本次修改数据替换到原有规则位置
                }else{//新增提交
                    ruleItemList.push(ruleItemListData);//将本次新增数据推入数组栈中
                    
                }


                if (ruleItemList.length>0) {
                    sessionStorage.setItem("useRuleList",JSON.stringify(ruleItemList));//更新当前所建立的条件
                }
                this.$router.push({name:'用券规则配置'});
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {
            if (this.isView) {
                this.$refs[formName].resetFields();
                this.$store.commit('mutationsToBackModifyRuleCouponRule');
                this.$router.push({name:'用券规则配置'});
            }else{
                this.$confirm('放弃填写?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs[formName].resetFields();
                    this.$store.commit('mutationsToBackModifyRuleCouponRule');
                    this.$router.push({name:'用券规则配置'});
                });
            }
        },

        //渠道全选
        handleCheckAllChangeChannel(event) {
                this.ruleForm.channel = event.target.checked ? this.options.options4 : [];
                this.isIndeterminateChannel = false;
        },
        handleCheckedChannelChange(value){
                let checkedCount = value.length;
                this.ruleForm.channelCheckAll = checkedCount === this.options.options4.length;
                this.isIndeterminateChannel = checkedCount > 0 && checkedCount < this.options.options4.length;
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

        //选择店铺弹窗

        dialogSelectStroe(index){
            //获取当前所有业态
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
            //     this.hasChosenStroeNames.splice(index,1);
            // }
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
        //显示会员选择隐藏卡片
        showCard(label){
            if (label == "注册会员") {
                this.participantCardGrade=true;
                this.participantCardTags=true;
                // this.ruleForm.userTags=[];
            }else if(label == "所有用户"){
                this.participantCardGrade=false;
                this.participantCardTags=false;
                this.ruleForm.userGrade=[];
                this.ruleForm.userTags=[];
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
.stroe-inf{
    margin-top:10px;
    padding-left:6px;  
    .text-btn{
        margin-left:30px;
    }
}
.font{
    font-size: 14px;
}
.el-form{
    background-color: #fff;
    padding: 30px;
}
.el-radio{
    display: block;
    width: auto;
    margin-left: 0;
}
.el-radio + .el-radio{
    display: inline-block;
}
.el-checkbox-group{
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
.el-input{
    display: inline-block;
    width: 80px;
    margin:0 5px;
}
.shop-name{
    width: 100%;
}
.box-card{
    width: 850px;
}
.margin-bottom{
    margin-bottom: 22px;
}
.choose{
    // margin-left:20px;
}
.user-hide{
    display: inline-block;
    width: 300px;
    margin:20px 30px 0 0;
    .el-checkbox{
        width: 100%;
        margin: 0;
    }
}
.radio-group{
    display: block;
    margin-top:10px;
    .el-radio{
        display: inline-block;
        margin-right:10px;
    }
}
.el-card{
    padding-bottom:20px; 
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
    // position: absolute;
	display: block;
	width: 300px!important;
	z-index: 0;
	// float: right;
    // right:0;
    // bottom:0;
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


