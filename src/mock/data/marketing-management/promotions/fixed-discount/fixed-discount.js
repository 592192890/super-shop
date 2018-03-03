import Mock from 'mockjs';
var baseUrl = 'http://t.com';
//get data
Mock.mock(baseUrl + '/marketing-management/promotions/fixed-discount/table', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    for (var i = 0; i < 34; i++) {
        tableData.push({
            activeName: '活动名称' + Mock.Random.pick([1, 2, 3]),
            activeType: Mock.Random.pick(['DM固定价格促销','固定价格促销','会员固定价格促销','小时促销','限时抢购','折价促销']),
            startTime: Mock.Random.datetime(),
            endTime: Mock.Random.datetime(),
            timeStatus: Mock.Random.pick(['进行中', '未开始', '已结束']),
            switchValue: Mock.Random.pick(['1','0']),
            creater: Mock.Random.cname()
        });
    }
    let {
        page
    } = JSON.parse(param);
    let total = tableData.length;
    tableData = tableData.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
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
