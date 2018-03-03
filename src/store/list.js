//优惠券list组件状态管理
const list = {
    state: {
        lableNames: [
            "优惠券名称",
            "优惠券定义编码",
            "类型",
            "金额",
            "有效时间",
            "状态",
            "所属部门",
        ],
        //请求响应参数名
        props: [
            "name",
            "code",
            "type",
            "price",
            "validDate",
            "status",
            "belong",

        ],
        operations: [
            "编辑",
            "统计"
        ],
    },
    mutations: {
        mutationsToDefinition(state) {
            state.lableNames = [
                    "优惠券名称",
                    "优惠券定义编码",
                    "类型",
                    "金额",
                    "有效时间",
                    "状态",
                    "所属部门",
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    "validDate",
                    "status",
                    "belong",

                ],
                state.operations = [
                    "编辑",
                    "统计"
                ]
        },
        mutationsToRule(state) {
            state.lableNames = [
                    "活动名称",
                    "促销编码",
                    "所属部门",
                    "开始时间",
                    "结束时间",
                    "活动状态",
                    "审核状态",
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    "validDate",
                    "status",
                    "belong",

                ],
                state.operations = [
                    "编辑",
                    "删除",
                    "发布"
                ]
        },
        mutationsToActivities(state) {
            state.lableNames = [
                    "促销名称",
                    "促销编码",
                    "所属部门",
                    "开始时间",
                    "结束时间",
                    "状态",
                    "已发数量",
                    "活动状态"
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    "validDate",
                    "status",
                    "belong",

                ],
                state.operations = [
                    "编辑",
                    "删除",
                    "发布"
                ]
        },
        //优惠券核销
        mutationsToWriteOff(state) {
            state.lableNames = [
                    "优惠券名称",
                    "优惠券编码",
                    "业态",
                    "类型",
                    "使用会员",
                    "优惠券状态",
                    "领取门店",
                    "发放时间",
                    "使用时间",
                    "状态"
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    "validDate",
                    "status",
                    "belong",

                ],
                state.operations = ""
        },
        //商家优惠券核销
        mutationsToMerchant(state) {
            state.lableNames = [
                    "优惠券名称",
                    "优惠券编码",
                    "兑换码",
                    "业务",
                    "发放会员",
                    "优惠券状态",
                    "使用门店",
                    "发放时间",
                    "兑换时间",
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    "validDate",
                    "status",
                    "belong",
                ],
                state.operations = ["兑换"]
        },
        //停车券核销
        mutationsToPark(state) {
            state.lableNames = [
                    "优惠券名称",
                    "优惠券编码",
                    "兑换码",
                    "业态",
                    "会员ID",
                    "车牌号",
                    "优惠券状态",
                    "使用门店",
                    "领取时间",
                    "使用时间",
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    "validDate",
                    "status",
                    "belong",
                ],
                state.operations = ""
        },
        mutationsToOrder(state) {
            state.lableNames = [
                    "优惠券名称",
                    "优惠券编码",
                    "类型",
                    "优惠券价格",
                    "优惠券状态",
                    "所属门店",
                    "下单时间",
                    "订单金额",
                    "下单会员",
                    "支付方式",
                    "订单状态",
                    "退款金额",
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    "validDate",
                    "status",
                    "belong",

                ],
                state.operations = ""
        },
        //选择部分店铺弹框
        mutationsToSelectShop(state) {
            state.lableNames = [
                    "店铺名称",
                    "店铺编码",
                    "店铺地址",
                    "电话",
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    // "validDate",
                    // "status",
                    // "belong",

                ],
                //操作栏内容（无）
                state.operations = ""
        },
        //选择优惠券弹框
        mutationsToSelectCoupon(state) {
            state.lableNames = [
                    "优惠券名称",
                    "ID",
                    "种类",
                    "门店",
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    // "validDate",
                    // "status",
                    // "belong",

                ],
                //操作栏内容（无）
                state.operations = ""
        },
        //优惠券发放结果页，发放情况表
        mutationsToCouponGrant(state) {
            state.lableNames = [
                    "优惠券名称",
                    "会员手机号码",
                    "优惠券编码",
                    "状态",
                ],
                //请求响应参数名
                state.props = [
                    "name",
                    "code",
                    "type",
                    "price",
                    // "validDate",
                    // "status",
                    // "belong",

                ],
                //操作栏内容（无）
                state.operations = ""
        },
    },
    actions: {}
}
export
default list