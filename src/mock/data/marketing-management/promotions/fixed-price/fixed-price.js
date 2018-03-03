import Mock from 'mockjs';
var baseUrl = 'http://shopmanage.yunhou.com/api';
//get data
Mock.mock(baseUrl + '/active/list', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 0; i < 54; i++) {
        tableData.push({
            "id": i,
            'activityId|100000-600000':1,
            "toolId": 16000,
            "toolCode": "ump-goods-fixed",
            "shopIds": [
                "1",
                "2",
                "3",
                "4",
                "5"
            ],
            "createAccount": Mock.Random.cname(),
            "createTime": Date.now(),
            "enable": true,
            "del": false,
            "effect": null,
            "ver": 1,
            "name": Mock.Random.cname(),
            "ad": Mock.Random.cname(),
            "info": null,
            "warmTime": null,
            "dailyStartTime": null,
            "dailyEndTime": null,
            "accurateAd": null,
            "channel": [
                3
            ],
            "memberTimes": null,
            "params": {
                "actType": 4,
                "actTypeName": "小时促销"
            },
            "applyed": true,
            "url": null,
            "urlType": 0,
            "userGrades": "|1|2|3|4|5|",
            "userTags": "|1|2|3|4|5|",
            "currentStartTime": null,
            "currentEndTime": null,
            "shopName": null,
            "activityTimeIntervals": {
                "effectStartTime": "2017-09-01 01:47:43",
                "effectEndTime": "2030-05-05 16:54:23"
            },
            "status": 1,
            "statusName": "进行中",
            "enableName": "启用"
        });
    }
    let {
        currentPage,
        pageSize
    } = JSON.parse(param);
    let total = tableData.length;
    tableData = tableData.filter((u, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
    sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '',
        data: {
            "totalPage": 1,
            "currentPage": currentPage,
            "permission": {
                "delete": true,
                "edit": true,
                "statistics": true,
                "enable": false
            },
            "offset": 0,
            "pageSize": pageSize,
            "totalCount": total,
            "list": tableData
        } 
    }
});
//
Mock.mock(baseUrl + '/marketing-management/promotions/fixed-price/add/table', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 0; i < 34; i++) {
        tableData.push({
			id:i,
            activeName: '活动名称',
            activeType: i,
            startTime: i, 
            endTime: i, 
            timeStatus: i, 
            switchStatus: i, 
						text:'内容'+i,
            creater: i 
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
// get format
Mock.mock(baseUrl + '/marketing-management/promotions/fixed-price/format', function(opt) {
    return {
        error: 0,
        msg: '',
        data: [{
			label:'电器',
			value:'1'	
		},{
			label:'百货',
			value:'2'	
		}] 
    }
});
