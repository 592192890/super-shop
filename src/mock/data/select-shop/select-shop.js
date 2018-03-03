import Mock from 'mockjs';
var baseUrl = 'http://t.com';
Mock.mock(baseUrl + '/selectShop', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    let shops = [];
    for (let i = 0; i < 80; i++) {
        shops.push(Mock.mock({
            value: Mock.Random.guid(),
            name: '店铺店铺'+i 
        }));
    }
    return {
        error: 0,
        msg: '',
        data: shops 
    }
});
