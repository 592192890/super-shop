import Mock from 'mockjs';
var base = 'http://shopmanage.yunhou.com/api';
//add page
//member level
// Mock.mock(base+'/active/type_list', function(opt) {
//     return {
//         error: '0',
//         msg: '',
//         data: [{value:'1',name:'等级1'},{value:'2',name:'等级2'},{value:'3',name:'等级3'},{value:'4',name:'等级4'}] 
//     }
// });
Mock.mock(base+'/active/member_list', function(opt) {
    return {
        error: '0',
        msg: '',
        data: [{value:'1',name:'等级1'},{value:'2',name:'等级2'}] 
    }
});
Mock.mock(base+'/active/get_channel', function(opt) {
    return {
        error: '0',
        msg: '',
        data: [{value:'1',name:'channel1'},{value:'2',name:'channel2'}] 
    }
});
// success
Mock.mock(base + '/active/add', function(opt) {
    return {
        error: 0,
        msg: '',
        data:{} 
    }
});
