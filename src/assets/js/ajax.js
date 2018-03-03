/**
 * @file ajax.js
 * @synopsis  ajax
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-07-23
 */

import Vue from 'vue'
import Promise from 'promise'
import axios from 'axios'
import jsonp from 'jsonp';
import querystring from 'querystring';
import router from '../../router/index';
import { Message } from 'element-ui'
import Q from 'q';
var isPro = (process.env.NODE_ENV === 'production');
(axios.defaults.withCredentials=true); 
var ajax = function(type, url, data) {
    if (!isPro) {
        sessionStorage.setItem(url, JSON.stringify(data));
        type = 'post'
    };
    if (type == 'post') {
        data = querystring.stringify(data);
    }
    if (type == 'get') {
        data = {
            params: data
        }
    }
    return axios[type](url, data).then((res) => {
        //error值为-100时，跳转至登陆页
        if (res.data.error === -100) {
            //如果登录失效了，保存该状态
            localStorage.setItem('loginExpired','loginExpired');
            router.push('/login');
        }
        if(res.data.error=='4001001'){
            router.push('/select-shop');
        }
        if(res.data.error !=0 && res.data.msg && res.data.msg.length!=0){
            Message.error(res.data.msg)
        }
        return res.data;
    }).catch((err)=>{
        Message.error(err.message)
    })

}

//ajax
Vue.prototype.$ajax = {
    get: (url, data) => ajax('get', url, data),
    post: (url, data) => ajax('post', url, data),
    jsonp: (url, data) => {
        if (isPro) {
            return new Promise(
                function(resolve, reject) {
                    jsonp(url, data, function(err, res) {
                        resolve(res);
                    })
                }
            )
        } else {
            return ajax('post', url, data);
        }
    }
};
