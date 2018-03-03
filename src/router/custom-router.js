import index from '@/components/conf/index/index.vue'
import empty from '@/components/common/empty/empty.vue'
export default [{
        path: '/select-shop',
        component: resolve => require(['@/components/conf/select-shop/select-shop.vue'], resolve),
        name: "选择进入店铺",
        hidden: true
    },
    {
        path: '/integral-manage',
        redirect: '/integral-manage/list',
        component: index,
        name: '积分管理',
        iconCls: '&#xe78b;',
        children: [{
            path: 'list',
            component: resolve => require(['@/components/conf/integral-manage/list/index.vue'], resolve),
            name: '自助积分',
            iconCls: '&#xe7f5;'
        }]
    },
    {
        path: '/commodity-center',
        redirect: '/commodity-center/publish',
        component: index,
        name: '商品中心',
        iconCls: '&#xe61d;',
        children: [{
            path: "publish",
            component: empty,
            name: '商品发布',
            hiddenChildren: true,
            redirect: 'publish/list',
            iconCls: '&#xe635;',
            children: [{
                path: 'list',
                name: '商品发布1',
                component: resolve => require(['@/components/conf/commodity-center/list/publish-step1.vue'], resolve),

            }, {
                path: '@publish-step2',
                name: '商品发布2',
                component: resolve => require(['@/components/conf/commodity-center/list/publish-step2.vue'], resolve),

            }, {
                path: '@publish-step3',
                name: '商品发布3',
                component: resolve => require(['@/components/conf/commodity-center/list/publish-step3.vue'], resolve),

            }]
        }, {
            path: "list",
            component: empty,
            name: '商品列表',
            hiddenChildren: true,
            redirect: 'list/list',
            iconCls: '&#xe637;',
            children: [{
                path: 'list',
                name: '商品发布列表',
                component: resolve => require(['@/components/conf/commodity-center/list/list.vue'], resolve),
            }, {
                path: '@edit',
                name: '商品发布编辑',
                component: resolve => require(['@/components/conf/commodity-center/list/edit.vue'], resolve),
            }]
        }, {
            path: "express-delivery",
            component: empty,
            name: '物流配送',
            hiddenChildren: true,
            redirect: 'express-delivery/list',
            iconCls: '&#xe788;',
            children: [{
                path: 'list',
                name: '物流配送设置',
                component: resolve => require(['@/components/conf/commodity-center/express-delivery/index.vue'], resolve),
            }]
        }]

    }, {
        path: '/marketing-management',
        redirect: '/marketing-management/promotions/fixed-price',
        component: index,
        name: '营销中心',
        iconCls: '&#xe61b;',
        children: [{
            path: 'promotions',
            component: empty,
            name: '促销活动',
            redirect: 'promotions/fixed-price',
            children: [{
                    path: 'fixed-price',
                    component: empty,
                    name: '固定价格促销',
                    hiddenChildren: true,
                    redirect: 'fixed-price/list',
                    iconCls: '&#xe617;',
                    children: [{
                        path: 'list',
                        name: '固定价格列表',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fixed-price/list/index.vue'], resolve)
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fixed-price/add/index.vue'], resolve),
                        name: '固定价格添加'
                    }, {
                        path: '@goods',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fixed-price/set/goods.vue'], resolve),
                        name: '设置固定价格促销'
                    }]
                }, {
                    path: 'fixed-discount',
                    component: empty,
                    name: '商品折扣促销',
                    hiddenChildren: true,
                    redirect: 'fixed-discount/list',
                    iconCls: '&#xe615;',
                    children: [{
                        path: 'list',
                        name: '商品折扣列表',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fixed-discount/list/index.vue'], resolve)
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fixed-discount/add/index.vue'], resolve),
                        name: '商品折扣添加'
                    }, {
                        path: '@set-goods',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fixed-discount/set/goods/goods.vue'], resolve),
                        name: '设置单品折扣'
                    }, {
                        path: '@set-classify',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fixed-discount/set/classify/classify.vue'], resolve),
                        name: '设置类别折扣'
                    }, {
                        path: '@set-brand',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fixed-discount/set/brand/brand.vue'], resolve),
                        name: '设置品牌折扣'
                    }]
                }, {
                    path: 'echelon-number',
                    component: empty,
                    name: '梯次数量促销',
                    hiddenChildren: true,
                    redirect: 'echelon-number/list',
                    iconCls: '&#xe612;',
                    children: [{
                        path: 'list',
                        name: '梯次数量列表',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/echelon-number/list/index.vue'], resolve)
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/echelon-number/add/index.vue'], resolve),
                        name: '梯次数量添加'
                    }, {
                        path: '@set-echelon-product',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/echelon-number/set/echelon/index.vue'], resolve),
                        name: '设置梯次促销商品'
                    }, {
                        path: '@set-number-product',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/echelon-number/set/number/index.vue'], resolve),
                        name: '设置数量促销商品'
                    }]
                }, {
                    path: 'free',
                    component: empty,
                    name: '最便宜免费促销',
                    hiddenChildren: true,
                    redirect: 'free/list',
                    iconCls: '&#xe614;',
                    children: [{
                        path: 'list',
                        name: '免费促销列表',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/free/list/index.vue'], resolve)
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/free/add/index.vue'], resolve),
                        name: '免费促销添加'
                    }, {
                        path: '@set-single-volume',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/free/set/single-volume/index.vue'], resolve),
                        name: '设置满单品量免费'
                    }, {
                        path: '@set-class-size',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/free/set/class-size/index.vue'], resolve),
                        name: '设置满类别量免费'
                    }]
                }, {
                    path: 'reduced',
                    component: empty,
                    name: '满减促销',
                    hiddenChildren: true,
                    redirect: 'reduced/list',
                    iconCls: '&#xe60f;',
                    children: [{
                        path: 'list',
                        name: '满减促销列表',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/reduced/list/index.vue'], resolve)
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/reduced/add/index.vue'], resolve),
                        name: '满减促销添加'
                    }, {
                        path: '@set-merchandise',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/reduced/set/merchandise/index.vue'], resolve),
                        name: '设置商品满减'
                    }, {
                        path: '@set-order-reduced',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/reduced/set/order-reduced.vue'], resolve),
                        name: '设置订单满减'
                    }]
                }, {
                    path: 'fullgift',
                    component: empty,
                    name: '满赠促销',
                    hiddenChildren: true,
                    redirect: 'fullgift/list',
                    iconCls: '&#xe618;',
                    children: [{
                        path: 'list',
                        name: '满赠促销列表',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fullgift/list/index.vue'], resolve)
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fullgift/add/index.vue'], resolve),
                        name: '满赠促销添加'
                    }, {
                        path: '@set-goods',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fullgift/set/goods/index.vue'], resolve),
                        name: '设置商品满赠'
                    }, {
                        path: '@set-order',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/fullgift/set/order/index.vue'], resolve),
                        name: '设置订单满赠'
                    }]
                }, {
                    path: 'combind',
                    component: empty,
                    name: '组合促销',
                    hiddenChildren: true,
                    redirect: 'combind/list',
                    iconCls: '&#xe616;',
                    children: [{
                        path: 'list',
                        name: '组合促销列表',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/combind/list/index.vue'], resolve)
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/combind/add/index.vue'], resolve),
                        name: '组合促销添加'
                    }, {
                        path: '@goods',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/combind/set/goods.vue'], resolve),
                        name: '设置组合促销'
                    }]
                },
                {
                    path: 'group',
                    component: empty,
                    name: '团购',
                    hiddenChildren: true,
                    redirect: 'group/list',
                    iconCls: '&#xe619;',
                    children: [{
                        path: 'list',
                        name: '团购列表',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/group/list/index.vue'], resolve)
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/group/add/index.vue'], resolve),
                        name: '团购添加'
                    }, {
                        path: '@goods',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/group/set/goods.vue'], resolve),
                        name: '设置团购商品'
                    }]
                },
                {
                    path: 'presale',
                    component: empty,
                    name: '预售',
                    hiddenChildren: true,
                    redirect: 'presale/list',
                    iconCls: '&#xe613;',
                    children: [{
                        path: 'list',
                        name: '预售列表',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/presale/list/index.vue'], resolve)
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/presale/add/index.vue'], resolve),
                        name: '预售添加'
                    }, {
                        path: '@full-goods',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/presale/set/full/goods.vue'], resolve),
                        name: '设置全款预售'
                    }, {
                        path: '@deposit-goods',
                        component: resolve => require(['@/components/conf/marketing-management/promotions/presale/set/deposit/goods.vue'], resolve),
                        name: '设置定金预售'
                    }]
                }
            ]
        }, {
            path: 'coupon-management',
            component: empty,
            name: '优惠券管理',
            redirect: 'coupon-management/coupon-definition',
            children: [{
                    path: 'coupon-definition',
                    redirect: 'coupon-definition/list',
                    component: empty,
                    name: '优惠券定义列表',
                    hiddenChildren: true,
                    iconCls: '&#xe62e;',
                    children: [{
                        path: 'list',
                        name: '优惠券定义搜索列表',
                        meta: { needHide: true },
                        component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-definition/coupon-definition.vue'], resolve),
                    }, {
                        path: '@revise',
                        component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-definition/revise.vue'], resolve),
                        name: '修改',
                    }, {
                        path: '@add',
                        component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-definition/add.vue'], resolve),
                        name: '新增优惠券定义',
                    }]
                }, {
                    path: 'coupon-rule',
                    redirect: 'coupon-rule/list',
                    component: empty,
                    name: '用券规则列表',
                    hiddenChildren: true,
                    iconCls: '&#xe62f;',
                    children: [{
                        path: 'list',
                        name: '用券规则搜索列表',
                        meta: { needHide: true },
                        component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-rule/coupon-rule.vue'], resolve)
                    }, {
                        path: '@allocation-rule',
                        component: empty,
                        redirect: '@allocation-rule/add',
                        name: '用券规则配置',
                        children: [{
                            path: 'add',
                            name: '用券规则配置详情',
                            meta: { needHide: true },
                            component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-rule/add.vue'], resolve),
                        }, {
                            path: 'rule',
                            component: empty,
                            redirect: 'rule/add-rule',
                            name: '使用规则配置',
                            children: [{
                                path: 'add-rule',
                                name: '使用规则配置详情',
                                meta: { needHide: true },
                                component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-rule/rule.vue'], resolve),
                            }]
                        }]
                    }]
                }, {
                    path: 'voucher-activities',
                    component: empty,
                    name: '发券活动列表',
                    redirect: 'voucher-activities/list',
                    hiddenChildren: true,
                    iconCls: '&#xe631;',
                    children: [{
                        path: 'list',
                        name: '发券活动搜索列表',
                        meta: { needHide: true },
                        component: resolve => require(['@/components/conf/marketing-management/coupon-management/voucher-activities/voucher-activities.vue'], resolve),
                    }, {
                        path: '@activities',
                        component: empty,
                        redirect: '@activities/add',
                        name: '发券活动配置',
                        children: [{
                            path: 'add',
                            name: '发券活动配置详情',
                            meta: { needHide: true },
                            component: resolve => require(['@/components/conf/marketing-management/coupon-management/voucher-activities/add-activities.vue'], resolve),
                        }, {
                            path: 'rule',
                            name: '发放规则',
                            component: empty,
                            redirect: 'rule/add',
                            children: [{
                                path: 'add',
                                name: '发放规则详情',
                                meta: { needHide: true },
                                component: resolve => require(['@/components/conf/marketing-management/coupon-management/voucher-activities/add-rule.vue'], resolve),
                            }, {
                                path: 'condition',
                                name: '发放条件设置',
                                component: empty,
                                redirect: 'condition/add',
                                children: [{
                                    path: 'add',
                                    name: '发放条件设置详情',
                                    meta: { needHide: true },
                                    component: resolve => require(['@/components/conf/marketing-management/coupon-management/voucher-activities/add-condition.vue'], resolve),
                                }]
                            }]
                        }]
                    }]
                }, {
                    path: 'issuance',
                    redirect: 'issuance/issuance-list',
                    component: empty,
                    name: '优惠券发放列表',
                    hiddenChildren: true,
                    iconCls: '&#xe630;',
                    children: [{
                        path: 'issuance-list',
                        name: '发放列表',
                        meta: { needHide: true },
                        component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-issuance/issuance-list.vue'], resolve),
                    }, {
                        path: '@coupon-issuance',
                        redirect: '@coupon-issuance/form',
                        component: empty,
                        name: '新增优惠券发放',
                        hiddenChildren: true,
                        // iconCls: '&#xe630;',
                        children: [{
                            path: 'form',
                            name: '优惠券发放详情',
                            meta: { needHide: true },
                            component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-issuance/coupon-issuance.vue'], resolve),
                        }, {
                            path: 'list',
                            component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-issuance/list.vue'], resolve),
                            name: '发放结果页',
                        }]
                    }]
                }, {
                    path: 'write-off',
                    component: empty,
                    name: '优惠券核销',
                    redirect: 'write-off/all',
                    iconCls: '&#xe632;',
                    children: [{
                        path: 'all',
                        component: resolve => require(['@/components/conf/marketing-management/coupon-management/write-off/write-off.vue'], resolve),
                        name: '优惠券列表',
                    }, {
                        path: 'merchant',
                        component: resolve => require(['@/components/conf/marketing-management/coupon-management/write-off/merchant.vue'], resolve),
                        name: '商家优惠券',
                    }, {
                        path: 'park',
                        component: resolve => require(['@/components/conf/marketing-management/coupon-management/write-off/park.vue'], resolve),
                        name: '停车券',
                    }]
                }]
                // {
                //     path: 'coupon-order',
                //     component: resolve => require(['@/components/conf/marketing-management/coupon-management/coupon-order/coupon-order.vue'], resolve),
                //     name: '优惠券订单',
                //     iconCls: '&#xe634;'
                // } 一期暂时不上
        }]
    },
    {
        path: '/shop-management',
        redirect: '/shop-management/home',
        component: index,
        name: '店铺管理',
        iconCls: '&#xe61a;',
        children: [{
            path: 'home',
            component: resolve => require(['@/components/conf/shop-management/home/home.vue'], resolve),
            name: '店铺首页',
            iconCls: '&#xe7f5;'
        }, {
            path: 'customer-management',
            name: '客服管理',
            component: resolve => require(['@/components/conf/shop-management/customer-management/site.vue'], resolve),
            iconCls: '&#xe636;'
        }]
    }
]