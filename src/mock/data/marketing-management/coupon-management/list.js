import Mock from 'mockjs';
var baseUrl = 'http://t.com';
//get data
Mock.mock(baseUrl + '/marketing-management/coupon-management/list', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 0; i < 500; i++) {
        tableData.push({

            //优惠券定义列表
            definition: {
                couponName: '优惠券名称' + Mock.Random.pick([1, 2, 3]),
                //优惠券定义编码
                code: Mock.Random.guid(),
                //种类
                type: Mock.Random.pick([
                    "满减券",
                    "满折券",
                    "停车券",
                    "升值券",
                    "免单券",
                ]),
                //金额
                price: Mock.Random.float(0, 1000, 0, 2),
                //有效时间
                date: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss') + " — " + Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //状态
                status: Mock.Random.pick(['有效', '过期']),
                //所属部门
                belong: Mock.Random.pick([
                    "百货",
                    "超市",
                    "电器",
                    "置业",
                    "便利",
                    "珠宝",
                ]),
            },
            //规则
            rule: {
                activeName: '活动名称' + Mock.Random.pick([1, 2, 3]),
                //促销编码
                code: Mock.Random.guid(),
                //所属部门
                belong: Mock.Random.pick([
                    "百货",
                    "超市",
                    "电器",
                    "置业",
                    "便利",
                    "珠宝",
                ]),
                //开始时间
                date: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //结束时间
                date: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //活动状态
                status: Mock.Random.pick(['激活', '禁止']),
                //审核状态
                checkStatus: Mock.Random.pick(['待发布', '已发布']),
            },
            //发券活动列表
            activities: {
                name: '促销名称' + Mock.Random.pick([1, 2, 3]),
                //促销编码
                code: Mock.Random.guid(),
                //所属部门
                belong: Mock.Random.pick([
                    "百货",
                    "超市",
                    "电器",
                    "置业",
                    "便利",
                    "珠宝",
                ]),
                //开始时间
                date: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //结束时间
                date: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //活动状态
                status: Mock.Random.pick(['已提交', '待审核', "已审核"]),
                //已发数量
                number: Mock.Random.natural(0, 1000),
                //状态
                checkStatus: Mock.Random.pick(['待发布', '已发布']),
            },
            //优惠券核销
            writeOff: {
                name: '优惠券名称' + Mock.Random.pick([1, 2, 3]),
                //优惠券编码
                code: Mock.Random.guid(),
                //业态
                belong: Mock.Random.pick([
                    "百货",
                    "超市",
                    "电器",
                    "置业",
                    "便利",
                    "珠宝",
                ]),
                //类型
                type: Mock.Random.pick([
                    "满减券",
                    "满折券",
                    "停车券",
                    "升值券",
                    "免单券",
                ]),
                //使用会员
                people: Mock.Random.pick(['176', '155', "135"]) + Mock.Random.natural(10000000, 99999999),
                //优惠券状态
                status: Mock.Random.pick(['已过期', '进行中']),
                //领取门店
                stroe: Mock.Random.pick([
                    "步步高梅溪新天地店",
                    "步步高中信店",
                    "步步高王府店",
                ]),
                //发放时间
                time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //使用时间
                useTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //状态
                presentStatus: "已兑换"

            },
            //商家优惠券
            merchant: {
                name: '优惠券名称' + Mock.Random.pick([1, 2, 3]),
                //优惠券编码
                code: Mock.Random.guid(),
                //兑换码
                exchangeCode: Mock.Random.natural(10000, 99999),
                //业态
                belong: Mock.Random.pick([
                    "百货",
                    "超市",
                    "电器",
                    "置业",
                    "便利",
                    "珠宝",
                ]),
                //发放会员
                people: Mock.Random.pick(['176', '155', "135"]) + Mock.Random.natural(10000000, 99999999),
                //优惠券状态
                status: Mock.Random.pick(['已过期', '进行中']),
                //使用门店
                stroe: Mock.Random.pick([
                    "步步高梅溪新天地店",
                    "步步高中信店",
                    "步步高王府店",
                ]),
                //发放时间
                time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //兑换时间
                useTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
            },
            //停车券
            park: {
                name: '优惠券名称' + Mock.Random.pick([1, 2, 3]),
                //优惠券编码
                code: Mock.Random.guid(),
                //兑换码
                exchangeCode: Mock.Random.natural(10000, 99999),
                //业态
                belong: Mock.Random.pick([
                    "百货",
                    "超市",
                    "电器",
                    "置业",
                    "便利",
                    "珠宝",
                ]),
                //会员ID
                people: Mock.Random.pick(['176', '155', "135"]) + Mock.Random.natural(10000000, 99999999),
                //车牌号
                carNumber: '湘A' + Mock.Random.natural(10000, 99999),
                //优惠券状态
                status: Mock.Random.pick(['已过期', '进行中']),
                //使用门店
                stroe: Mock.Random.pick([
                    "步步高梅溪新天地店",
                    "步步高中信店",
                    "步步高王府店",
                ]),
                //领取时间
                time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //使用时间
                useTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
            },
            //优惠券订单
            order: {
                name: '优惠券名称' + Mock.Random.pick([1, 2, 3]),
                //优惠券编码
                code: Mock.Random.guid(),
                //类型
                type: Mock.Random.pick([
                    "满减券",
                    "满折券",
                    "停车券",
                    "升值券",
                    "免单券",
                ]),
                //优惠券价格
                price: Mock.Random.float(0, 1000, 0, 2),
                //优惠券状态
                status: Mock.Random.pick(['未开始', '进行中', "已结束"]),
                //所属门店
                stroe: Mock.Random.pick([
                    "步步高梅溪新天地店",
                    "步步高中信店",
                    "步步高王府店",
                ]),
                //下单时间
                time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                //订单金额
                orderPrice: Mock.Random.float(0, 1000, 0, 2),
                //下单会员
                people: Mock.Random.pick(['176', '155', "135"]) + Mock.Random.natural(10000000, 99999999),
                //支付方式
                pay: Mock.Random.pick(['支付宝', '微信', "商务卡"]),
                //订单状态
                orderStatus: Mock.Random.pick(['已付款', '退款中', "已退款"]),
                //退款金额
                backPrice: Mock.Random.float(0, 1000, 0, 2),
            },
            //选择优惠券弹窗
            chooseCoupon: {
                name: '优惠券名称' + Mock.Random.pick([1, 2, 3]),
                //ID
                id: Mock.Random.natural(1000000000, 1000009999),
                //类型
                type: Mock.Random.pick([
                    "满减券",
                    "满折券",
                    "停车券",
                    "升值券",
                    "免单券",
                ]),
                //所属门店
                stroe: Mock.Random.pick([
                    "步步高梅溪新天地店",
                    "步步高中信店",
                    "步步高王府店",
                ]),
            },
            //选择店铺弹窗
            chooseStore: {
                name: '店铺名称' + Mock.Random.pick([1, 2, 3, 4, 5]),
                //店铺编码
                id: Mock.Random.natural(1000000000, 1000009999),
                //店铺地址
                address: Mock.Random.county(true),
                //电话
                tel: "0731-5233" + Mock.Random.natural(1000, 9999),
            },
            //优惠券发放结果页
            releaseResults: {
                name: '优惠券名称' + Mock.Random.pick([1, 2, 3, 4, 5]),
                //手机号码
                tel: Mock.Random.pick(['176', '155', "135"]) + Mock.Random.natural(10000000, 99999999),
                //优惠券编码
                code: "100" + Mock.Random.natural(90000, 99999),
                //发放状态
                releaseStatus: Mock.Random.pick(['发放成功', '发放失败']),
            },
            //选择品牌
            brand: {
                name: '品牌' + Mock.Random.increment()
            },
            //选择商品
            goods: {
                name: '商品' + Mock.Random.increment()
            },
            //排除商品
            excluded: {
                name: '商品' + Mock.Random.increment()
            },
        });
    }
    let {
        page
    } = JSON.parse(param);
    let total = tableData.length;
    tableData = tableData.filter((u, index) => index < 16 * page && index >= 16 * (page - 1));
    sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '',
        data: {
            total,
            tableData: tableData
        }
    }
});