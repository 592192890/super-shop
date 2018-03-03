import Mock from 'mockjs';
var baseUrl = 'http://t.com';
//get data
Mock.mock(baseUrl + '/shop-management/customer-management/getData', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    return {
        error: 0,
        data: {

            consumerNumber: '1112',
            phoneNumber: '15111342343'
        }
    }
});
//save
Mock.mock(baseUrl + '/shop-management/customer-management/sit', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    return {
        error: 0,
        data: {}
    }
});
