import Vue from 'vue'
import router from './router'
import store from './store'
import ajax from './assets/js/ajax'
import filters from './filters';
import validate from './assets/js/validate'
import apiUrl from './assets/js/api-url'
import ElementUI from 'element-ui'
import App from './App'
import './assets/sass/reset/_reset.scss';
import './assets/sass/_common.scss';
import './assets/sass/fonts/common/1.0.0/_common.scss';
import './assets/theme/index.css'

import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor);
Vue.use(ElementUI);

// 实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
window.bus = new Vue();

new Vue({
    el: '#jApp',
    template:'<App />',
    components:{ App },
    store,
    router
})
