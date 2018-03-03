import index from '@/components/conf/index/index.vue'
export
default {
    path: '/index',
    component: index,
    name: '首页',
    iconCls: '&#xe602;',
    children: [{
        path: 'home',
        component: resolve => require(['@/components/conf/table/index.vue'], resolve),
        name: '管理中心'
    }]
}
