/**
 * @file common.js
 * @synopsis  common interface
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-09-05
 */

import Mock from 'mockjs';
var baseUrl = 'http://t.com';
var base = 'http://shopmanage.yunhou.com/api';

//创建折扣促销临时表格
Mock.mock(base+'/Redistable/createTable', function(opt) {
    return {
        error: '0',
        msg: '',
        data: 'guid' 
    }
});
Mock.mock(base+'/Redistable/index', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 10; i < 20; i++) {
        tableData.push({
						id:i,
						bn:i,
						name:i,
						shopName:i,
            shopMdCode: i,
						onlineOfflineName: i,
						businessTypeCode:i,
						code:i,
						classify:i,
            c2: 100+i,
            brand: i 
        });
    }
    let {
        currentPage
    } = JSON.parse(param);
    let total = tableData.length;
		if(currentPage){
			tableData = tableData.filter((u, index) => index < 10 * currentPage && index >= 10 * (currentPage - 1));
		}
    sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '',
        data: {
						totalRow:total,
            listData: tableData
        }
    }
});
//活动类型
Mock.mock(base+'/active/type_list', function(opt) {
    return {
        error: '0',
        msg: '',
        data: [{
					name:'活动类型1',
					value:'1'
				}]
    }
});
//获取渠道
Mock.mock(base+'/active/get_channel', function(opt) {
    return {
        error: '0',
        msg: '',
        data: [{
					name:'渠道1',
					value:'1'
				}]
    }
});

//获取业态
Mock.mock(base+'/Businesstype/allType', function(opt) {
    return {
        error: '0',
        msg: '',
        data: [{
					name:'业态1',
					value:'1'
				}]
    }
});

//Mock.mock(base+'/backclassify/tree', function(opt) {
//    return {
//        error: '0',
//        msg: '',
//        data: [] 
//    }
//});

// search shop
Mock.mock(base + '/Xeshop/index', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 0; i < 34; i++) {
        tableData.push({
						id:i,
						shopName:i,
            shopMdCode: i,
						onlineOfflineName: i,
						businessTypeCode:i,
						code:i,
						classify:i,
            c2: 100+i,
            brand: i 
        });
    }
    let {
        currentPage
    } = JSON.parse(param);
    let total = tableData.length;
    tableData = tableData.filter((u, index) => index < 10 * currentPage && index >= 10 * (currentPage - 1));
    // sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '',
        data: {
						totalRow:total,
            list: tableData
        }
    }
});

Mock.mock(base + '/product/list', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 0; i < 34; i++) {
        tableData.push({
						id:i,
            name: i,
						code:i,
						classify:i,
            c2: 100+i,
            brand: i 
        });
    }
    let {
        page
    } = JSON.parse(param);
    let total = tableData.length;
    tableData = tableData.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
    // sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '',
        data: {
            total,
            tableData: tableData 
        }
    }
});

//login -------------------------
Mock.mock(baseUrl + '/login', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    sessionStorage.removeItem(opt.url);
    return {
        error: '0',
        msg: '',
        data: {
            userId: 1,
            username: 'admin',
            password: '123456',
            avatar: 'http://img1.bbgstatic.com/15d62d45666_bc_500e322ae799c0a882e91edf786aaf7d_1024x681.jpeg',
            name: 'lct'
        }
    }
});

//table
Mock.mock(baseUrl + '/table', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 0; i < 34; i++) {
        tableData.push({
						id:i,
            c1: i,
            c2: 100+i,
            c3: i, 
            c4: i, 
            c5: i, 
            c6: i, 
            c7: i 
        });
    }
    let {
        page
    } = JSON.parse(param);
    let total = tableData.length;
    tableData = tableData.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
    // sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '',
        data: {
            total,
            tableData: tableData 
        }
    }
});

//list
Mock.mock(baseUrl + '/list', function(opt) {
    var tableData = [];
    for (var i = 0; i < 5; i++) {
        tableData.push({
					id:i,
					text:'测试'+i
        });
    }
    return {
        error: 0,
        msg: '',
        data:tableData 
    }
});

// success
Mock.mock(baseUrl + '/success', function(opt) {
    return {
        error: 0,
        msg: '',
        data:{} 
    }
});

// error 
Mock.mock(baseUrl + '/error', function(opt) {
    return {
        error: 1,
        msg: '网络错误',
        data:{} 
    }
});

// upload 
Mock.mock(baseUrl + '/upload', function(opt) {
    return {
        error: 0,
        msg: '成功',
        data:[{id:200, text:'导入数据'}] 
    }
});

//select 
Mock.mock(baseUrl + '/select', function(opt) {
    return {
        error: 0,
        msg: '成功',
        data:[{name:200, value:'导入数据'}] 
    }
});
 
//
// Mock.mock(baseUrl+'Backclassify/list', function(opt){
	// return {
		// error: 0,
		// msg:'',
		// data:{main:[{name:'元素main',value:1}],other:[{name:'元素other',value:1}]}
	// }
// })
