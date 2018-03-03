import Mock from 'mockjs';
var baseUrl = 'http://t.com';
//get data
Mock.mock(baseUrl + '/marketing-management/promotions/fullgift/set-goods-list', function(opt) {
  var param = sessionStorage.getItem(opt.url);
  var tableData = [];
  for (var i = 0; i < 34; i++) {
    tableData.push(Mock.mock({
      id: i+1,
      name: Mock.Random.cname(),
      'goodsid|100000-600000':1,
      'code|10000000-60000000':1,
      // 销售价
      'sell|1000-5000':1,
      // 成本价
      'cost|1000-5000':1,
      // 库存
      'stock|1000-6000':1
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
