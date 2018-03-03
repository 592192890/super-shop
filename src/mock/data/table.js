import Mock from 'mockjs';
var baseUrl = 'http://t.com';
var Users = [];
//list ---------------------------------------------
for (let i = 0; i < 86; i++) {
    Users.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        // addr: Mock.mock('@county(true)'),
        'age|18-60': 1,
        // birth: Mock.Random.date(),
        sex: Mock.Random.integer(0, 1)
    }));
}
Mock.mock(baseUrl + '/table', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    let {
        page,
        name
    } = JSON.parse(param);
    let mockUsers = Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
    });
    let total = mockUsers.length;
    mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
    sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '',
        data: {
            total,
            users: mockUsers
        }
    }
});

//add ----------------------------------
Mock.mock(baseUrl + '/user/add', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    let {
        id, name, addr, age, birth, sex
    } = JSON.parse(param);
    Users.some(u => {
        if (u.id === id) {
            u.name = name;
            u.addr = addr;
            u.age = age;
            u.birth = birth;
            u.sex = sex;
            return true;
        }
    });
    sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '修改成功',
        data: {}
    }
})

//delete -------------------------------
Mock.mock(baseUrl + '/user/delete', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    let {
        ids
    } = JSON.parse(param);
    Users = Users.filter(u => !ids.includes(u.id));
    sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '删除成功'
    }
})
