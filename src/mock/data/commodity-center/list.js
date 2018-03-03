import Mock from 'mockjs';
var baseUrl = 'http://t.com';
Mock.mock(baseUrl + '/commodity-center/select', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    let shops = [];
    for (let i = 1; i < 4; i++) {
        shops.push(Mock.mock({
            //id: Mock.Random.guid(),
            id: i,
            name: '店铺'+i 
        }));
    }
    return {
        error: 0,
        msg: '',
        data: shops 
    }
});

Mock.mock(baseUrl + '/commodity-center/list', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    let shops = [];
    return {
        error: 0,
        msg: '',
        data: {
            list:[
                {
                    id:1,
                    bn: "p21471068",
                    goodsName: '苹果',
                    location: 38,
                    goodsId:11,
                    marketable:true,
                    salePrice: 0,
                    mktPrice:2.00,
                    cost:1.00,
                    storeCount:null,
                    unit: true,
                    spuBn:false,
                    productList: [
                    {   
                        id:3,
                        goodsName:'苹果手机 白色',
                        bn: "p24471068",
                        productName: '白色',
                        location: 'WX100992',
                        marketable:true,
                        salePrice: 10.00,
                        mktPrice:2222.00,
                        cost:2222.00,
                        storeCount:222,
                        unit: '个',
                        spuBn:false
                    },{
                        id:4,
                        bn: "p23451068",
                        goodsName:'苹果手机 黑色',
                        productName: '黑色',
                        location: 'WX100992',
                        marketable:'已上架',
                        salePrice: 1000.00,
                        mktPrice:2.00,
                        cost:3.00,
                        storeCount:20,
                        unit: '个',
                        spuBn:false
                    }]
                },
                {
                    id:2,
                    bn: "p23471068",
                    goodsName: "酸奶",
                    goodsId:12,
                    location: 'WX100992',
                    marketable:false,
                    salePrice: 300.00,
                    mktPrice:2.00,
                    cost:4.00,
                    storeCount:44,
                    unit: '个',
                    spuBn:false
                }
            ]
        }
    }
});
