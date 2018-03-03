import Mock from 'mockjs';
var baseUrl = 'http://t.com';
Mock.mock(baseUrl + '/marketing-management/coupon-management/form-search', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    let {
        level
    } = JSON.parse(param);
    console.log(opt.url);
    if (level == 0) {
        return {
            error: 0,
            msg: '',
            data: {
                classify: [{
                    name: 'Root' + level + '1'
                }, {
                    name: 'Root' + level + '2'
                }]
            }
        }
    } else {
        return {
            error: 0,
            msg: '',
            data: {
                classify: []
            }
        }
    }
});