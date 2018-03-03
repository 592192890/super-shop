//优惠券form-search组件状态管理
const formSearch = {
    state: {
        // isDefinition: true,
        addNewName: '新增优惠券',
        typle: {
            typle1: "input",
            typle2: "select",
            typle3: "select",
            typle4: "select",
            typle5: "input",
        },
        lableName: {
            name1: "优惠券名称",
            name2: "种类",
            name3: "所属部门",
            name4: "状态",
            name5: "优惠券定义编码",
            name6: "有效期"
        },
        options: {
            option1: "",
            option2: [
                "满减券",
                "满折券",
                "停车券",
                "升值券",
                "免单券",
            ],
            option3: [
                "百货",
                "超市",
                "电器",
                "置业",
                "便利",
                "珠宝",
            ],
            option4: [
                "有效",
                "过期"
            ],
            option5: "",
        },
        placeholderName: {
            name1: "请输入名称",
            name2: "选择种类",
            name3: "百货",
            name4: "有效",
            name5: "优惠券定义编码",
        }
    },
    mutations: {
        mutationsToDefinition(state) {
            state.addNewName = '新增优惠券',
                state.typle = {
                    typle1: "input",
                    typle2: "select",
                    typle3: "select",
                    typle4: "select",
                    typle5: "input",
                },
                state.lableName = {
                    name1: "优惠券名称",
                    name2: "种类",
                    name3: "所属部门",
                    name4: "状态",
                    name5: "优惠券定义编码",
                    name6: "有效期"
                },
                state.options = {
                    option1: "",
                    option2: [
                        "满减券",
                        "满折券",
                        "停车券",
                        "升值券",
                        "免单券",
                    ],
                    option3: [
                        "百货",
                        "超市",
                        "电器",
                        "置业",
                        "便利",
                        "珠宝",
                    ],
                    option4: [
                        "有效",
                        "过期"
                    ],
                    option5: "",
                },
                state.placeholderName = {
                    name1: "请输入名称",
                    name2: "选择种类",
                    name3: "百货",
                    name4: "有效",
                    name5: "优惠券定义编码",
                }
        },
        mutationsToRule(state) {
            // state.isDefinition = false,
            state.addNewName = '新增用券规则',
                state.typle = {
                    typle1: "input",
                    typle2: "select",
                    typle3: "input",
                    typle4: "select",
                    typle5: "input",
                },
                state.lableName = {
                    name1: "活动名称",
                    name2: "所属部门",
                    name3: "优惠券名称",
                    name4: "活动状态",
                    name5: "规则编码",
                    name6: "开始时间"
                },
                state.options = {
                    option1: "",
                    option2: [
                        "超市",
                        "百货",
                        "电器",
                        "珠宝",
                        "置业",
                    ],
                    option3: "",
                    option4: [
                        "激活",
                        "禁止"
                    ],
                    option5: "",
                },
                state.placeholderName = {
                    name1: "请输入名称",
                    name2: "选择部门",
                    name3: "请输入名称",
                    name4: "选择状态",
                    name5: "请输入ID",
                }
        },
        mutationsToActivities(state) {
            // state.isDefinition = false,
            state.addNewName = '新增发券活动',
                state.typle = {
                    typle1: "input",
                    typle2: "select",
                    typle3: "input",
                    typle4: "select",
                    typle5: "input",
                },
                state.lableName = {
                    name1: "活动名称",
                    name2: "所属部门",
                    name3: "门店名称",
                    name4: "活动状态",
                    name5: "活动编码",
                    name6: "开始时间"
                },
                state.options = {
                    option1: "",
                    option2: [
                        "超市",
                        "百货",
                        "电器",
                        "珠宝",
                        "置业",
                    ],
                    option3: "",
                    option4: [
                        "待提交",
                        "待审核",
                        "已审核"
                    ],
                    option5: "",
                },
                state.placeholderName = {
                    name1: "请输入名称",
                    name2: "选择部门",
                    name3: "请输入名称",
                    name4: "选择状态",
                    name5: "请输入ID",
                }
        },
        //优惠券核销
        mutationsToWriteOff(state) {
            state.addNewName = '',
                state.typle = {
                    typle1: "input",
                    typle2: "select",
                    typle3: "input",
                    typle4: "select",
                    typle5: "input",
                },
                state.lableName = {
                    name1: "优惠券名称",
                    name2: "业态",
                    name3: "门店名称",
                    name4: "优惠券状态",
                    name5: "优惠券ID",
                    name6: "领取时间",
                    name7: "兑换时间"
                },
                state.options = {
                    option1: "",
                    option2: [
                        "超市",
                        "百货",
                        "家电",
                        "母婴",
                    ],
                    option3: "",
                    option4: [
                        "已过期",
                        "进行中"
                    ],
                    option5: "",
                },
                state.placeholderName = {
                    name1: "请输入名称",
                    name2: "选择业态",
                    name3: "请输入名称",
                    name4: "选择状态",
                    name5: "请输入ID",
                }
        },
        mutationsToOrder(state) {
            state.addNewName = '',
                state.typle = {
                    typle1: "input",
                    typle2: "select",
                    typle3: "select",
                    typle4: "input",
                    typle5: "select",
                    typle6: "input",
                    typle8: "input",
                    typle9: "input"
                },
                state.lableName = {
                    name1: "优惠券名称",
                    name2: "类型",
                    name3: "业态",
                    name4: "门店名称",
                    name5: "订单状态",
                    name6: "领取时间",
                    name7: "",
                    name8: "优惠券编码",
                    name9: "下单会员"
                },
                state.options = {
                    option1: "",
                    option2: [
                        "满减券",
                        "满折券",
                        "停车券",
                        "升值券",
                        "免单券",
                    ],
                    option3: [
                        "超市",
                        "百货",
                        "家电",
                        "母婴",
                    ],
                    option4: "",
                    option5: [
                        "已付款",
                        "已退款",
                        "退款中"
                    ],
                },
                state.placeholderName = {
                    name1: "请输入名称",
                    name2: "选择种类",
                    name3: "选择业态",
                    name4: "请输入名称",
                    name5: "选择状态",
                    name8: "请输入ID",
                    name9: "手机号",
                }
        },
        //选择部分店铺弹框
        mutationsToSelectShop(state) {
            state.addNewName = '',
                state.typle = {
                    typle1: "select",
                    typle2: "select",
                    typle3: "input",
                },
                state.lableName = {
                    name1: "业态",
                    name2: "店铺类型",
                    name3: "店铺名称",
                },
                state.options = {
                    option1: [
                        "全部业态",
                        "百货",
                        "超市",
                        "电器",
                        "置业",
                        "便利",
                        "珠宝",
                    ],
                    option2: [
                        "全部类型",
                        "满减券",
                        "满折券",
                        "停车券",
                        "升值券",
                        "免单券",
                    ],
                    option3: ""
                },
                state.placeholderName = {
                    name1: "全部业态",
                    name2: "全部类型",
                    name3: "请输入名称",
                }
        },
        //选择优惠券弹框
        mutationsToSelectCoupon(state) {
            state.addNewName = '',
                state.typle = {
                    typle1: "select",
                    typle2: "input",
                },
                state.lableName = {
                    name1: "所属部门",
                    name2: "优惠券名称",
                },
                state.options = {
                    option1: [
                        "百货",
                        "超市",
                        "电器",
                        "置业",
                        "便利",
                        "珠宝",
                    ],
                    option2: ""
                },
                state.placeholderName = {
                    name1: "请选择部门",
                    name2: "请输入名称",
                }
        },
    },

    actions: {}
}
export
default formSearch