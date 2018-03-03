//优惠券规则配置组件状态管理
const addRule = {
    // namespaced: true,
    state: {
        //优惠券配置页面,表单上次进行中的状态
        activitiesFormStatusCouponRule: "",
        isEditorEnter: false,
        id: "",
        //进入规则配置时
        enterRuleCouponRule: {
            isModifyEnterRuleCouponRule: false, //是否以修改状态进入规则配置组件
            isModifyFinishCouponRule: false, //修改是否完成提交了
            indexCouponRule: "", //需要修改的规则位置
        },
    },
    mutations: {
        //重置全部状态
        mutationsResetCouponRule(state) {
            //优惠券配置页面,表单上次进行中的状态
            state.activitiesFormStatusCouponRule = "";
            state.isEditorEnter = false;
            state.id = "";
            //进入规则配置时
            state.enterRuleCouponRule = {
                isModifyEnterRuleCouponRule: false, //是否以修改状态进入规则配置组件
                isModifyFinishCouponRule: false, //修改是否完成提交了
                indexCouponRule: "", //需要修改的规则位置
            };
        },
        //编辑活动进入
        mutationsToEditorEnterCouponRule(state, id) {
            state.isEditorEnter = true;
            state.id = id;
        },
        //新增活动进入
        mutationsToClearEditorEnterCouponRule(state) {
            state.isEditorEnter = false;
            state.id = "";
        },




        //优惠券活动配置表单数据状态自动填充
        mutationsToRecordStatusActivitiesCouponRule(state, formData) {
            state.activitiesFormStatusCouponRule = formData;
        },
        //规则配置表单数据状态自动填充
        mutationsToRecordStatusRuleCouponRule(state, formData) {
            state.ruleFormStatusCouponRule = formData;
        },
        //返回或提交后，清除规则配置页面
        mutationsToClearStatusActivitiesFormCouponRule(state, formData) {
            state.activitiesFormStatusCouponRule = "";
        },
        //修改一个指定规则状态
        mutationsToModifyRuleCouponRule(state, index) {
            state.enterRuleCouponRule.isModifyEnterRuleCouponRule = true; //以修改状态进入规则配置组件
            // state.enterConditionCouponRule.isModifyFinishCouponRule = false; //修改完成进行提交了improtant！！！
            state.enterRuleCouponRule.indexCouponRule = index; //当前需要修改的规则位置
        },
        //提交修改的规则状态
        mutationsToSubmitModifyRuleCouponRule(state, index) {
            state.enterRuleCouponRule.isModifyEnterRuleCouponRule = false; //更改规则配置组件默认进入状态为新增
            state.enterRuleCouponRule.isModifyFinishCouponRule = true; //修改完成进行提交了
            state.enterRuleCouponRule.indexCouponRule = index; //提交的修改规则位置
        },
        //以修改状态进入后，但是没有提交直接点击了返回,状态恢复至初始状态
        mutationsToBackModifyRuleCouponRule(state, index) {
            state.enterRuleCouponRule.isModifyEnterRuleCouponRule = false; //更改规则配置组件默认进入状态为新增
            state.enterRuleCouponRule.isModifyFinishCouponRule = false; //修改完成进行提交了
            state.enterRuleCouponRule.indexCouponRule = ""; //返回的修改规则位置
        },

    },
    actions: {}
}
export
default addRule