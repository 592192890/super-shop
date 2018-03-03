<template>
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm" label-position="left">
    <div :class="{ mask: isView }">
        <el-form-item label="活动编码" required>
            <span>{{couponIssue}}</span>
        </el-form-item>
        <el-form-item label="活动名称" prop="name">
            <el-input class="coupon-name" v-model="ruleForm.name"  placeholder="市场部小伙伴们输入名称谢谢"></el-input><span class="des">活动名称不能为空，最多可输入30个字符，不能输入特殊符号</span>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
            <el-select v-model="ruleForm.department" placeholder="请选择部门">
                <el-option v-for="(option,index) in departmentData" :label="option.name" :value="option.value" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="活动时间" class="time-picker" required>
            <el-form-item prop="startDate" class="line">
                <el-date-picker type="datetime" placeholder="请选择" v-model="ruleForm.startDate"></el-date-picker>
            </el-form-item>
            <span class="line">-</span>
            <el-form-item prop="endDate" class="line">
                <el-date-picker type="datetime" placeholder="请选择" v-model="ruleForm.endDate"></el-date-picker>
            </el-form-item>
            <el-button v-if="ruleForm.endDate && ruleForm.startDate" class="add-time-btn" icon="plus" type="text" @click="addTimeSlot">增加新时间段</el-button>
        </el-form-item>
        <el-form-item class="time-slot" label-width="0" prop="timeSlot">
            <div class="title" v-if="hasSelectTimeSlot.length">已选时间段：</div>
            <div v-for="(time,index) in hasSelectTimeSlot" :key="index">
                <span class="slot">{{time}}</span><el-button class="text-btn" type="text" @click="delTimeSlot(index)">删除</el-button>
            </div>
        </el-form-item>
    </div>
	<el-form-item label="活动规则" prop="chooseRule">
        <el-button @click="cacheExistingRecord" v-if="!isView">添加规则</el-button>
		<div class="ues-rule" v-if="ruleList.length" v-for="(name,index) in ruleList" :key="index">
			<span class="rule-name">{{name.ruleName}}</span>
            <el-button class="text-btn" type="text" @click="ruleModify(index)" v-if="!isView">修改</el-button>
            <el-button class="text-btn" type="text" @click="ruleDel(index)" v-if="!isView">删除</el-button>
            <el-button class="text-btn" type="text" @click="ruleModify(index)" v-if="isView">查看</el-button>
		</div>
	</el-form-item>
    <div :class="{ mask: isView }">
        <el-form-item label="参与会员" prop="participant">
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
        <el-form-item label="活动描述" prop="explain">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="ruleForm.explain"  placeholder="请输入简短活动说明"></el-input>
            <span class="des area textarea">告知活动规则</span>
        </el-form-item>
        <el-form-item label="活动图片">
            <el-upload
            class="avatar-uploader"
            :with-credentials="true"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error= "handleAvatarError"
            :before-upload="beforeAvatarUpload">
            <img v-if="!imageUrl" src="../../../../../assets/images/upload.png" class="avatar"/>
            <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
            </el-upload>
            <span class="des upload">活动图片要求宽度为120像素，高度为120像素、比例为3:1的图片；支持格式gif、jpg、png</span>
        </el-form-item>
        </div>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" v-if="!isView">提交</el-button>
            <el-button @click="resetForm('ruleForm')" v-if="!isView">取消</el-button>
            <el-button @click="resetForm('ruleForm')" v-if="isView">返回</el-button>
        </el-form-item>
	</el-form>
</template>
<script>
export default {
    data() {
        //选择规则验证
        var validateChooseRule = (rule, value, callback) => {
            if (this.ruleList.length==0) {
                callback(new Error('你还未添加规则'));
            }else{
                callback();
            }
        };
        //结束时间大于开始时间验证
        var validateEndDate = (rule, value, callback) => {
            if (Date.parse(this.ruleForm.startDate)>=Date.parse(this.ruleForm.endDate)) {
                callback(new Error('活动结束时间需晚于开始时间'));
            }else{
                callback();
            }
        };
        //时间段重叠验证
        var validateTimeSlot = (rule, value, callback) => {
            var newEndDate = Date.parse(this.ruleForm.endDate);//新加的结束时间
            var newStartDate = Date.parse(this.ruleForm.startDate);//新加的开始时间
            for (var index = 0; index < this.intervalList.length; index++) {
                var endTime = this.intervalList[index].endTime;//已添加的结束时间
                var startTime = this.intervalList[index].startTime;//已添加的开始时间
                this.timeSlotOverlap = false;
                if (!(newEndDate<startTime || newStartDate>endTime) && newEndDate && newStartDate) {
                    callback(new Error('新选时间段与已选时间段的第'+(index+1)+'段重叠，请重新选择'));
                    this.timeSlotOverlap = true;
                }
            }
            if (this.timeSlotOverlap == false) {
                callback();
            }
            if (!newEndDate || !newStartDate) {
                callback();
            }
            if(!this.hasSelectTimeSlot.length){
                callback();
            }
        };
        var uploadUrl = this.$apiUrl.uploadImageUrl;
        return {
            isView:false,//遮罩层是否显示
            timeSlotOverlap:false,//0新增时间段是否与已有时间段重合 1当前重叠的时间段索引位置
            departmentData:[],//全部业态
            uploadUrl,
            imageUrl:"",
            // //上传图片的链接
            pic:"",
            // uploadUrl,
            //已选定时间段
            hasSelectTimeSlot:[],

            ruleForm: {
                name: '',
                department: '',
                startDate:"",
                endDate:'',
                participant:"",
                explain:'',
                userGrade:[],
                userTags:[],
                
            },
            //请求参数数据处理
            intervalList:[],//活动时间段
            //时间段
            timeSlot:{
                endTime:"",	//活动区段结束时间	number	@mock=1000000868
                issueId:"",	//发券活动编码
                startTime:"",//活动区段开始时间	number	@mock=1000000868
            },
            lastStartDate:"",
            lastEndDate:"",

            rules: {
                name: [
                    { required: true, min:0, max: 30, message: '优惠券名称不能为空，最多可输入30个字符，不能输入特殊符号', trigger: 'blur' },
                    {pattern:/^[a-zA-Z0-9\u4e00-\u9fa5]+$/, message:'不能输入特殊符号'}
                ],
                department:[
                    { required: true, message: '请选择部门', trigger: 'change' }
                ],
                startDate: [
                    { type:'date', required: true, message: '请选择活动开始时间', trigger: 'change' }
                ],
                endDate: [
                    { type:'date', required: true, message: '请选择活动结束时间', trigger: 'change' },
                    { required: true, validator: validateEndDate, trigger: 'change'}
                ],
                timeSlot:[
                    {  validator: validateTimeSlot}
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
                chooseRule:[
                    { required: true, validator: validateChooseRule, trigger: 'change'}
                ],
                explain:[
                    { max: 51, message: '最多输入50个字符', trigger: 'blur' }
                ],
            },
            //会员等级
            participantCardGrade:false,
            //会员标签
            participantCardTags:false,
            couponIssue:"",//活动编码

            //请求数据 规则
            ruleList:[],
            //会员等级数据
            memberListData:[],
            id:"",
        };    
    },
    mounted(){
        //判断是否查看详情
        if(sessionStorage.getItem("isView")){
            this.isView = true;
        }
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
        // var isEditorEnter = sessionStorage.getItem("isEditorEnter");
        if (!this.$store.state.voucherActivities.isEditorEnter) {
            /* 进入来源：用户新增优惠券活动 */
            //获取全部规则信息
            if (JSON.parse(sessionStorage.getItem("ruleList"))) {
                this.ruleList = JSON.parse(sessionStorage.getItem("ruleList"));
            }else{
                this.ruleList=[]
            }

            //获取表单上次进行中的状态
            var activitiesFormStatus = this.$store.state.voucherActivities.activitiesFormStatus;
            if (activitiesFormStatus) {
                this.couponIssue = activitiesFormStatus.activityId;	//发券活动编码	number	@mock=1000000868
                this.hasSelectTimeSlot=activitiesFormStatus.hasSelectTimeSlot; //	活动时间段 array<object>
                this.ruleForm.startDate=activitiesFormStatus.startDate;
                this.ruleForm.endDate=activitiesFormStatus.endDate;
                this.ruleForm.name=activitiesFormStatus.activityName;	//发券活动名称
                this.ruleForm.department=activitiesFormStatus.department;	//所属部门(发券方)	string	@mock=超市
                this.ruleForm.explain=activitiesFormStatus.explain;	//活动描述	string	@mock=xxx
                this.intervalList=activitiesFormStatus.intervalList; //	活动时间段 array<object>
                this.imageUrl=activitiesFormStatus.pic,	//活动图片	string	@mock=测试内容47im
                this.ruleForm.participant = activitiesFormStatus.participant;
                this.ruleForm.userGrade=activitiesFormStatus.userGrade;	//可参与活动的会员等级	array	@mock=(1,2,3)
                this.ruleForm.userTags=activitiesFormStatus.userTags;	//可参与活动的会员标签
            }
            var activityId = sessionStorage.getItem("activityId");
            if (!activityId) {
                //获取活动编码
                this.$ajax.post(this.$apiUrl.coupon.createCouponId,{couponKey:"couponIssue_"}
                ).then((res) =>
                {
                    if (res.error !== 0) {
                        this.$message({
                        message: res.msg,
                        type: 'error'
                        });
                        return false;
                    }
                    this.couponIssue = res.data;
                    sessionStorage.setItem("activityId",this.couponIssue);
                })
            }else{
                this.couponIssue = activityId;
            }
        }else{
            /* 进入来源：用户编辑优惠券活动 */
            //获取当前编辑活动的活动id
            var id = this.$store.state.voucherActivities.id;
            //获取当前活动配置详情
            this.$ajax.post(this.$apiUrl.coupon.grantInfo,{"id":id}
			).then((res) =>
			{
				if (res.error !== 0) {
					this.$message({
					message: res.msg,
					type: 'error'
                    });
                    return false;
                }
                var couponIssue = res.data.couponIssue;
                this.id = couponIssue.id;
                //将数据注入下级所有页面
                // if (couponIssue.id!== id) {
                    this.couponIssue = couponIssue.issueId;	//发券活动编码	number	@mock=1000000868
                    sessionStorage.setItem("activityId",this.couponIssue);
                    
                    //时间段处理
                    var timeSlotLength = couponIssue.intervalList.length-1;
                    for (var index = 0; index < timeSlotLength; index++) {
                        let startDate = new Date(couponIssue.intervalList[index].startTime).toLocaleString();
                        let endDate = new Date(couponIssue.intervalList[index].endTime).toLocaleString();
                        if (endDate && startDate) {
                            let timeSlot = startDate+" — "+endDate;
                            this.hasSelectTimeSlot.push(timeSlot);
                        }
                    }
                    this.ruleForm.startDate=new Date(couponIssue.intervalList[timeSlotLength].startTime);//活动开始时间
                    this.ruleForm.endDate=new Date(couponIssue.intervalList[timeSlotLength].endTime);//活动结束时间

                    this.ruleForm.name=couponIssue.name;	//发券活动名称
                    this.ruleForm.department=couponIssue.department;	//所属部门(发券方)	string	@mock=超市
                    this.ruleForm.explain=couponIssue.info;	//活动描述	string	@mock=xxx
                    this.intervalList=couponIssue.intervalList; //活动时间段 array<object>
                   
                    this.intervalList.splice(timeSlotLength,1);
                    if (couponIssue.pic) {
                        this.imageUrl=couponIssue.pic;
                    }
                    	//活动图片	string	@mock=测试内容47im
                    if ((!couponIssue.userGrade || couponIssue.userGrade.length==0) && (!couponIssue.userTags||this.isEmpty(couponIssue.userTags))) {
                        this.ruleForm.participant = "所有用户";
                    }else{
                        this.ruleForm.participant = "注册会员";
                    }
                    this.ruleForm.userGrade=couponIssue.userGrade;	//可参与活动的会员等级	array	@mock=(1,2,3)
                    this.ruleForm.userTags=couponIssue.userTags;	//可参与活动的会员标签

                    //规则信息注入
                    if (JSON.parse(sessionStorage.getItem("ruleList"))) {
                        this.ruleList = JSON.parse(sessionStorage.getItem("ruleList"));
                    }else{
                        this.ruleList = couponIssue.ruleList;
                    }


                    
                    // //条件信息注入
                    // sessionStorage.setItem("ruleItemList",)
                // }



			})
        }

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
        // this.lastStartDate = this.ruleForm.startDate;
        // this.lastEndDate = this.ruleForm.endDate;
        
    },
    methods: {
				isEmpty(obj) {
					 for (var x in obj) { if (obj.hasOwnProperty(x))  return false; }
					 return true;
				},
        submitForm(formName) {
            var self = this;
            self.$refs[formName].validate((valid) => {

            if (valid) {
                if(this.$store.state.voucherActivities.isEditorEnter){
                    var createTime="",
                    updateTime=Date.parse(new Date());
                }else{
                    var createTime=Date.parse(new Date()),
                    updateTime="";
                }
                
                

                //全部请求参数
                var	couponIssue = {
                   issueId:self.couponIssue,	//发券活动编码	number	@mock=1000000868
                   name:self.ruleForm.name,	//发券活动名称	string	@mock=步步高金星店资生堂送券
                   createTime:createTime,	//创建时间	number	@mock=23318
                   department:self.ruleForm.department,	//所属部门(发券方)	string	@mock=超市
                   info:self.ruleForm.explain,	//活动描述	string	@mock=xxx
                   intervalList:self.intervalList, //	活动时间段 array<object>
                   pic:self.pic,	//活动图片	string	@mock=测试内容47im
                   ruleList:self.ruleList,	//发放规则	array<object>		
                   updateTime:updateTime,	//更新时间	number	@mock=43803
                   userGrade:self.ruleForm.userGrade,	//可参与活动的会员等级	array	@mock=(1,2,3)
                   userTags:self.ruleForm.userTags,	//可参与活动的会员标签
                };
                if (!self.$store.state.voucherActivities.isEditorEnter) {
                    /* 进入来源：用户新增优惠券活动 */
                    var url = self.$apiUrl.coupon.grantAdd
                    //时间段
                    if(self.ruleForm.startDate && self.ruleForm.endDate){
                        var data = {
                            endTime:Date.parse(self.ruleForm.endDate),	//创建时间	number	@mock=1504169476000
                            issueId:self.couponIssue,	//活动区段结束时间	number	@mock=1000000868
                            startTime:Date.parse(self.ruleForm.startDate),//活动区段开始时间	number	@mock=1504169476000
                        }
                        self.intervalList.push(data);
                    }
                }else{
                    /* 进入来源：用户编辑优惠券活动 */
                    var url = self.$apiUrl.coupon.grantUpdate
                    couponIssue.id = this.id;
                    //时间段
                    if(self.ruleForm.startDate && self.ruleForm.endDate){
                        var data = {
                            endTime:Date.parse(self.ruleForm.endDate),	//创建时间	number	@mock=1504169476000
                            issueId:self.couponIssue,	//活动区段结束时间	number	@mock=1000000868
                            startTime:Date.parse(self.ruleForm.startDate),//活动区段开始时间	number	@mock=1504169476000
                        }
                        self.intervalList.push(data);
                    }
                }
            self.$ajax.post(url,{"couponIssue":JSON.stringify(couponIssue)}
			).then((res) =>
			{
				if (res.error !== 0) {
					self.$message({
					message: res.msg,
					type: 'error'
                    });
                    self.intervalList.pop();
                    return false;
				}
                self.$message({
                    message: res.msg,
                    type: 'success'
                })
                sessionStorage.clear();
                self.$store.commit('mutationsToClearStatusActivitiesForm');
                self.$router.push({name:'发券活动列表'});
			})
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {
            if(this.isView){
                this.$refs[formName].resetFields();
                this.$store.commit('mutationsToClearStatusActivitiesForm');
                sessionStorage.clear();
                this.$router.push({name:'发券活动列表'});
            }else{
                this.$confirm('放弃填写?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs[formName].resetFields();
                    this.$store.commit('mutationsToClearStatusActivitiesForm');
                    sessionStorage.clear();
                    this.$router.push({name:'发券活动列表'});
                });
            }
        },
        //上传成功回调
        handleAvatarSuccess(res, file) {
            if (res.error !== 0) {
                this.$message({
                message: res.msg,
                type: 'error'
                });
                return false;
            }
            this.imageUrl = res.data.imageUrl;
            // this.imageUrl =file.url;
            this.pic = res.data.imageUrl;
        },
        //上传失败回调
        handleAvatarError(err, file){
            this.$message({
                message: "上传失败，请重试！",
                type: 'error'
            });
        },
        //图片上传限制
        beforeAvatarUpload(file) {
            const isPNG = file.type === 'image/png';
            const isJPG = file.type === 'image/jpeg';
            const isGIF = file.type === 'image/gif';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG && !isGIF) {
            this.$message.error('上传图片只能是 gif/jpg/png 格式！');
            }
            if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
            }
            return (isJPG || isPNG || isGIF) && isLt2M;
        },
        //增加时间段
        addTimeSlot(){
            // if(this.lastStartDate == this.ruleForm.startDate && this.lastEndDate == this.ruleForm.endDate && this.hasSelectTimeSlot.length){
                var newEndDate = Date.parse(this.ruleForm.endDate);//新加的结束时间
                var newStartDate = Date.parse(this.ruleForm.startDate);//新加的开始时间
                for (var index = 0; index < this.intervalList.length; index++) {
                    var endTime = this.intervalList[index].endTime;//已添加的结束时间
                    var startTime = this.intervalList[index].startTime;//已添加的开始时间
                    if (!(newEndDate<startTime || newStartDate>endTime)) {
                        this.$message.error('所选时间段与已添加的第'+(index+1)+'段重叠，请重新选择');
                        return false;
                    }
                }
            // }else{
                let endDate = this.ruleForm.endDate.toLocaleString();
                let startDate = this.ruleForm.startDate.toLocaleString();

                var data = {
                    endTime:Date.parse(this.ruleForm.endDate),	//创建时间	number	@mock=1504169476000
                    issueId:this.couponIssue,	//活动区段结束时间	number	@mock=1000000868
                    startTime:Date.parse(this.ruleForm.startDate),//活动区段开始时间	number	@mock=1504169476000
                }
                this.intervalList.push(data);
                if (endDate && startDate) {
                    let timeSlot = startDate+" — "+endDate;
                    this.hasSelectTimeSlot.push(timeSlot);
                }
                this.ruleForm.startDate="";
                this.ruleForm.endDate="";
                this.lastStartDate = this.ruleForm.startDate;
                this.lastEndDate = this.ruleForm.endDate;
            // }
        },
        //删除时间段
        delTimeSlot(index){
            this.hasSelectTimeSlot.splice(index,1);
            this.intervalList.splice(index,1);
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
        //点击添加规则时，管理当前页面已填写的表单
        cacheExistingRecord(){
            //规则最多只能添加五条
            if (this.ruleList.length == 5 || this.ruleList.length > 5) {   
                this.$message({
					message: "最多允许添加5条规则",
					type: 'warning'
                });
                return false;
            }
            var couponIssue = {
                activityId:this.couponIssue,	//发券活动编码	number	@mock=1000000868
                activityName:this.ruleForm.name,	//发券活动名称	string	@mock=步步高金星店资生堂送券
                department:this.ruleForm.department,	//所属部门(发券方)	string	@mock=超市
                explain:this.ruleForm.explain,	//活动描述	string	@mock=xxx
                hasSelectTimeSlot:this.hasSelectTimeSlot, //	活动时间段 array<object>
                startDate:this.ruleForm.startDate,
                endDate:this.ruleForm.endDate,
                pic:this.imageUrl,	//活动图片	string	@mock=测试内容47im
                userGrade:this.ruleForm.userGrade,	//可参与活动的会员等级	array	@mock=(1,2,3)
                userTags:this.ruleForm.userTags,	//可参与活动的会员标签
                participant:this.ruleForm.participant,//参与会员
                intervalList: this.intervalList
            };
            //记录当前状态
            this.$store.commit('mutationsToRecordStatusActivities', couponIssue);
            this.$store.commit('mutationsToClearStatusRule');
            this.$store.commit('mutationsToBackModifyRule');
            if (this.ruleList.length!==0) {
                sessionStorage.setItem("ruleList",JSON.stringify(this.ruleList));//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            }else{
                sessionStorage.removeItem("ruleList");//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            }
            sessionStorage.removeItem("ruleItemList");
            this.$router.push({name:'发放规则'});
        },


        //规则修改
        ruleModify(index){





            var couponIssue = {
                activityId:this.couponIssue,	//发券活动编码	number	@mock=1000000868
                activityName:this.ruleForm.name,	//发券活动名称	string	@mock=步步高金星店资生堂送券
                department:this.ruleForm.department,	//所属部门(发券方)	string	@mock=超市
                explain:this.ruleForm.explain,	//活动描述	string	@mock=xxx
                hasSelectTimeSlot:this.hasSelectTimeSlot, //	活动时间段 array<object>
                startDate:this.ruleForm.startDate,
                endDate:this.ruleForm.endDate,
                pic:this.imageUrl,	//活动图片	string	@mock=测试内容47im
                userGrade:this.ruleForm.userGrade,	//可参与活动的会员等级	array	@mock=(1,2,3)
                userTags:this.ruleForm.userTags,	//可参与活动的会员标签
                participant:this.ruleForm.participant,//参与会员
                intervalList: this.intervalList
            };
            //记录当前状态
            this.$store.commit('mutationsToRecordStatusActivities', couponIssue);
            this.$store.commit('mutationsToClearStatusRule');
            this.$store.commit('mutationsToModifyRule', index);
            if (this.ruleList.length!==0) {
                
                sessionStorage.setItem("ruleList",JSON.stringify(this.ruleList));//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            }else{
                sessionStorage.removeItem("ruleList");//重新设置缓存，用户之前可能有删除规则操作，更新最新规则状态
            }
            sessionStorage.removeItem("ruleItemList");
            this.$router.push({name:'发放规则'});
        },
        //规则删除
        ruleDel(index){
            this.$confirm('删除该规则, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.ruleList.splice(index,1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to{
  opacity: 0;
}
.time-slot{
    position: relative;
    left: 150px;
    margin-bottom: 20px;
    .title{
        margin-bottom: 10px;
    }
    .slot{
        margin-right:30px;
    }
    // .el-form-item__content{
    //     margin-left: 0!important;
    // }
}

.add-time-btn{
    margin-left: 10px;
}
.ues-rule{
    .rule-name{
        margin-right:30px;
        display:inline-block;
        width:150px;
    }
}
.el-form{
	background-color: #fff;
	padding: 20px;
    .el-input{
		width: 220px;
	}
	.el-select{
		width: 220px;
	}
	.coupon-name{
		width:454px;
	}
}
.des{
    position: absolute;
    color:#999;
    margin-left:10px;
    font-size:8px;
    bottom:0;
    height: 36px;
}
.area{
    height: 24px;
}
.textarea{
    left:454px;
}
.upload{
    left:100px;
}
.el-textarea{
    width: 454px;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
.radio-group{
    display: block;
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
.el-card{
    padding-bottom:20px; 
}
.line{
    display: inline-block;
}
.time-picker{
    display: inline-block;
}
.mask{
    z-index: 99;
    pointer-events: none;
}
</style>


