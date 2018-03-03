import Mock from 'mockjs';
var baseUrl = 'http://t.com';
Mock.mock(baseUrl + '/productList/publish', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    let {
        level
    } = JSON.parse(param);
    if (level == 0 ) {
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
