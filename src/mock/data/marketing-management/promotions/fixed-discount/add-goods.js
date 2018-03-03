import Mock from 'mockjs';
var baseUrl = 'http://shopmanage.yunhou.com/api';
//get data
Mock.mock(baseUrl + '/product/list', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 0; i < 34; i++) {
        tableData.push(Mock.mock({
            id: i+1,
            rank: i+1,
            name: '测试商品数据测试商品数据测试商品数据测试商品数据',
            'goodsid|100000-600000':1,
            'code|10000000-60000000':1,
            'price|1-100.2':1,
            presale:'',
            deposit:'',
            // 'presale|1-100.2':1,
            // 'deposit|1-100.2':1,
            'cost|1-80.2':1,
            'discount|1-100':1,
            'limit|1-10':1,
            'stock|10-100':1,
            'sale|1-100.2':1,
            'discountCode|1-100':1
        }));
    }
    let {
        page,
        pageSize
    } = JSON.parse(param);
    let total = tableData.length;
    tableData = tableData.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1));
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

Mock.mock(baseUrl + '/marketing-management/promotions/fixed-discount/goods-table', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 0; i < 34; i++) {
        tableData.push(Mock.mock({
            id: i+1,
						text:'测试数据'+(i+1),
            name: Mock.Random.cname(),
            'goodsid|100000-600000':1,
            'code|10000000-60000000':1,
            brand: '恰恰',
            classify: '休闲食品>坚果>瓜子类'
        }));
    }
    let {
        page,
        pageSize
    } = JSON.parse(param);
    let total = tableData.length;
    tableData = tableData.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1));
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

Mock.mock(baseUrl + '/marketing-management/promotions/fixed-discount/format', function(opt) {
    
    
    return {
        error: 0,
        msg: '',
        data: {
            
        }
    }
});

Mock.mock(baseUrl + '/product/search', function(opt){
    var param = sessionStorage.getItem(opt.url);
    let tableData = [];

    for (var i = 0; i < 34; i++) {
        tableData.push(Mock.mock({
            "location": 1,
            "backCatPath": Mock.Random.cname() + " > " + Mock.Random.cname() + " > " + Mock.Random.cname(),
            "backcatId": 201990012,
            "bn":i,
            "brandId": 2019900004,
            "brandName": "七度空间",
            "goodsId": 30095000006,
            "goodsName": Mock.Random.cname(),
            "hasSpec": true,
            "marketable": false,
            "spuBn": "11111133",
            "spuId": 3007900002,
            "unit": "个",
            "price": 2000
            // id: i+1,
            // text:'测试数据'+(i+1),
            // name: Mock.Random.cname(),
            // 'goodsid|100000-600000':1,
            // 'code|10000000-60000000':1,
            // brand: '恰恰',
            // classify: '休闲食品>坚果>瓜子类'
        }));
    }

    let {
        currentPage,
        pageSize
    } = JSON.parse(param);
    let total = tableData.length;
    tableData = tableData.filter((u, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
    sessionStorage.removeItem(opt.url);

    return {
        error:0,
        msg:'',
        data:{
            list: tableData,
						totalRow: 34
        }
    }
});
