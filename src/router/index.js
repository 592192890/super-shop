import Vue from 'vue'
import Router from 'vue-router'
// import indexMod from './index/index'
import index from '@/components/conf/index/index.vue'
import empty from '@/components/common/empty/empty.vue'
import customRouter from './custom-router.js'
var vue = new Vue();
var routerOpt = {
    mode: 'history',
    routes: [{
        path: '/404',
        component: resolve => require(['@/components/common/404/404.vue'], resolve),
        hidden: true
    }, {
        path: '/',
        // component: resolve => require(['@/components/conf/select-shop/select-shop.vue'], resolve),
        redirect: '/login',
        hidden: true
    }, {
        path: '/login',
        component: resolve => require(['@/components/conf/login/login.vue'], resolve),
        name: "登陆",
        hidden: true
    }, {
        path: '/register',
        component: resolve => require(['@/components/conf/register/register.vue'], resolve),
        name: '注册',
        hidden: true,
    }, {
        path: '/register/protocol',
        component: resolve => require(['@/components/conf/protocol/protocol.vue'], resolve),
        name: '注册服务协议',
        hidden: true,
    }, {
        path: '/no-right',
        component: resolve => require(['@/components/conf/no-right/no-right.vue'], resolve),
        name: "登陆无权限",
        hidden: true
    }, {
        path: '/find-password',
        component: resolve => require(['@/components/conf/find-password/find-password.vue'], resolve),
        name: "找回密码",
        hidden: true
    }, ]
};
Vue.use(Router)
const router = new Router(routerOpt);
var isFirst = true;

router.beforeEach(function(to, from, next) {
    //	if( /* not login */ ){
    //	  next({ path: '/login' });
    //	}else{
    //change router, get permission data ... 
    //		if(isFirst){
    //			vue.$ajax.post('').then((res)=>{
    //				isFirst = false;
    //				next();
    //			})
    //		}else{
    next();
    //		}
    //	}
    //     vue.$ajax.get('http://t.com/login', {}).then((res) => {
    //         if (res && res.error == 0) {
    //             sessionStorage.setItem('_userInfo', JSON.stringify(res.data));
    //             next();
    //         } else {
    //             location.href = 'http://www.yunhou.com';
    //         }
    //     });
});
// router.beforeEach(function(to, from, next) {
//     vue.$ajax.get('http://api.sys.yunhou.com/member/refSession', {reqParam:""}).then((res) => {
//         if (res && res.resParam) {
//             sessionStorage.setItem('_userInfo', JSON.stringify(res.resParam));
//             next();
//         } else {
//             next({ path: '/' });
//         }
//     });
// });
export
default router