import Mock from 'mockjs';
var baseUrl = 'http://t.com';
Mock.mock(baseUrl + '/commodity-center/publish', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    let shops = [];
    for (let i = 0; i < 80; i++) {
        shops.push(Mock.mock({
            id: Mock.Random.guid(),
            name: '店铺'+i 
        }));
    }
    return {
        error: 0,
        msg: '',
        data: shops 
    }
});
