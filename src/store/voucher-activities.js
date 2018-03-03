//发券活动组件状态管理
const addActivities = {
    // namespaced: true,
    state: {
        //优惠券配置页面,表单上次进行中的状态
        activitiesFormStatus: "",
        //优惠券新增规则页面,表单上次进行中的状态
        ruleFormStatus: "",

        //已有活动，用户点击编辑进入修改
        isEditorEnter: false,

        //当前编辑活动的id
        id: "",

        //进入规则配置时
        enterRule: {
            isModifyEnterRule: false, //是否以修改状态进入规则配置组件
            isModifyFinish: false, //修改是否完成提交了
            index: "", //需要修改的规则位置
        },
        //进入规则配置时
        enterCondition: {
            isModifyEnterCondition: false, //是否以修改状态进入规则配置组件
            isModifyFinish: false, //修改是否完成提交了
            index: "", //需要修改的规则位置
        }

    },
    mutations: {
        //重置全部状态
        mutationsReset(state) {
            //优惠券配置页面,表单上次进行中的状态
            state.activitiesFormStatus = "";
            //优惠券新增规则页面;表单上次进行中的状态
            state.ruleFormStatus = "";
            //已有活动，用户点击编辑进入修改
            state.isEditorEnter = false;

            //当前编辑活动的id
            state.id = "";

            //进入规则配置时
            state.enterRule = {
                isModifyEnterRule: false, //是否以修改状态进入规则配置组件
                isModifyFinish: false, //修改是否完成提交了
                index: "", //需要修改的规则位置
            };
            //进入规则配置时
            state.enterCondition = {
                isModifyEnterCondition: false, //是否以修改状态进入规则配置组件
                isModifyFinish: false, //修改是否完成提交了
                index: "", //需要修改的规则位置
            }
        },
        //编辑活动进入
        mutationsToEditorEnter(state, id) {
            state.isEditorEnter = true;
            state.id = id;
        },
        //新增活动进入
        mutationsToClearEditorEnter(state) {
            state.isEditorEnter = false;
            state.id = "";
        },

        //优惠券活动配置表单数据状态自动填充
        mutationsToRecordStatusActivities(state, formData) {
            state.activitiesFormStatus = formData;
        },
        //规则配置表单数据状态自动填充
        mutationsToRecordStatusRule(state, formData) {
            state.ruleFormStatus = formData;
        },
        //新增的状态进入，规则配置表单数据状态清空
        mutationsToClearStatusRule(state, formData) {
            state.ruleFormStatus = "";
        },
        //返回或提交后，清除规则配置页面
        mutationsToClearStatusActivitiesForm(state, formData) {
            state.activitiesFormStatus = "";
        },
        //修改一个指定规则状态
        mutationsToModifyRule(state, index) {
            state.enterRule.isModifyEnterRule = true; //以修改状态进入规则配置组件
            state.enterCondition.isModifyFinish = false; //修改完成进行提交了improtant！！！
            state.enterRule.index = index; //当前需要修改的规则位置
        },
        //提交修改的规则状态
        mutationsToSubmitModifyRule(state, index) {
            state.enterRule.isModifyEnterRule = false; //更改规则配置组件默认进入状态为新增
            state.enterRule.isModifyFinish = true; //修改完成进行提交了
            state.enterRule.index = index; //提交的修改规则位置
        },
        //以修改状态进入后，但是没有提交直接点击了返回,状态恢复至初始状态
        mutationsToBackModifyRule(state, index) {
            state.enterRule.isModifyEnterRule = false; //更改规则配置组件默认进入状态为新增
            state.enterRule.isModifyFinish = false; //修改完成进行提交了
            state.enterRule.index = ""; //返回的修改规则位置
        },



        //修改一个指定条件状态
        mutationsToModifyCondition(state, index) {
            state.enterCondition.isModifyEnterCondition = true; //以修改状态进入条件配置组件
            state.enterCondition.index = index; //当前需要修改的条件位置
        },
        //提交修改的条件状态
        mutationsToSubmitModifyCondition(state, index) {
            state.enterCondition.isModifyEnterCondition = false; //更改条件配置组件默认进入状态为新增
            state.enterCondition.isModifyFinish = true; //修改完成进行提交了
            state.enterCondition.index = index; //提交的修改条件位置
        },
        //以修改状态进入后，但是没有提交直接点击了返回,状态恢复至初始状态
        mutationsToBackModifyCondition(state, index) {
            state.enterCondition.isModifyEnterCondition = false; //更改条件配置组件默认进入状态为新增
            state.enterCondition.isModifyFinish = false; //修改完成进行提交了
            state.enterCondition.index = ""; //返回的修改条件位置
        },
    },
    actions: {}
}
export
default addActivities