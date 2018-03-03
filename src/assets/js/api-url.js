///配置全局url
import Vue from 'vue'
import config from '@/config'
let host = config.apiHost
let loginHost = config.loginApiHost
Vue.prototype.$apiUrl = {
    //登陆
    loginUrl: host + '/member/login',
    getPermissionRouter: loginHost + '/member/getResources',
    reSessionUrl: loginHost + "/member/refSession",
    // 退出登录
    logoutUrl: loginHost + '/member/safeLogout',
    // allServiceLine: host + '/Businesstype/allServiceLine',//全部业务线
    allType: host + '/Businesstype/allType', //全部业态

    //跳转到老系统
    goOldSystemUrl: host + "/Shopjump/get_smp_resource",

    //上传图片
    uploadImageUrl: host + '/image/upload',
    //相册管理
    getAlnumNoPageUrl: host + '/album/get_nopage_list',
    getAlbumImagesUrl: host + '/album/get_album_images',
    addAlbumUrl: host + "/album/add_album",
    addAlbumImageUrl: host + "/album/add_album_image",
    deleteAlbumImageUrl: host + "/album/delete_album_images",

    //商品发布
    isStartVirtualStock:host+"/product/set_nostore_sell",
    deleteSpecUrl: host + "/spec/delete_value",
    addSpecUrl: host + "/spec/add_value",
    addOrUpdateProductPublishUrl: host + "/product/save",
    getSPUListUrl: host + "/spu/get_cate_spus",
    getProductDeatilUrl: host + "/product",
    getSPUDetailUrl: host + "/spu/spu_detail",
    deleteAlbumUrl: host + "/album/delete_album",
    getCategoryUrl: host + "/category/get_cates_by_pid",

    getCategoryByPid: host + '/category/get_shopcates_by_pid',

    validateFiledUrl: host + "/product/search_sku_by_skubn_or_barcode",
    validateProductCodeUrl: host + "/product/get_goods_byparam",
    getMountedSPUListUrl: host + '/spu/spu_page_result',

    //商品列表
    updateProductStock: host + "/product/update_product_stock",
    getProductStock: host + "/product/get_product_stock",
    getProListUrl: host + '/product/list',
    getMarketableUrl: host + '/product/product_marketable',
    updatePrice: host + "/product/update_price",
    deleteCategoryUrl: host + "/product/product_delete",

    //物流配送
    getFeeListUrl:host+"/logistics/carriageTpl_list",
    deleteFeeUrl:host+"/logistics/carriageTpl_del",
    getFeeDetailUrl:host+"/logistics/carriageTpl_detail",
    addFeeUrl:host+"/logistics/carriageTpl_add",
    updateFeeUrl:host+"/logistics/carriageTpl_update",
    getCascaderAddressUrl:host+"/logistics/get_address",

    getExpressAddressListUrl:host+"/logistics/refundAddress_list",
    addExpressAddressUrl:host+"/logistics/refundAddress_add",
    getExpressAddressDetailUrl:host+"/logistics/refundAddress_detail",
    updateExpressAddressUrl:host+"/logistics/refundAddress_update",

    getPickUpPortListUrl:host+"/logistics/pickUpTpl_list",
    addPickUpPortUrl:host+"/logistics/pickUpTpl_add",
    updatePickUpPortUrl:host+"/logistics/pickUpTpl_update",
    getPickUpPortDetailUrl:host+"/logistics/pickUpTpl_detail",
    deletePickUpPortUrl:host+"/logistics/pickUpTpl_del",
    getRelatedPickUpPortUrl:host+"/logistics/queryPickUp",
    //店铺管理
    thirtyOrderUrl: host + "/Product/sale_count",
    getCutomerInfo: host + "/xeshop/getCustomer",
    updateCustomerInfo: host + "/xeshop/saveCustomer",
    getUserInfoUrl: host + "/member/getLoginUserInfo",

    //自助积分
    getInteralListUrl:host+"/Integral/self_integral",
    getInteralAuditUrl:host+"/Integral/audit_accumulate",
    getInteralRefuseUrl:host+"/Integral/refuse_accumulate",
    getInteralStatusUrl:host+"/Integral/integral_status_enum",
    getInteralStoreUrl:host+"/member/getUserShops",
    getInteralStoreListUrl:host+"/member/getUserShopsOnlineOrOffline",

    marketing: {
        //活动列表
        activeList: host + '/active/list',
        //活动类型枚举
        activeType: host + '/active/type_list',
        //活动启用和禁用
        activeStatus: host + '/active/status',
        //获取商品分类
        goodsClassify: host + '/backclassify/tree',
        //获取商品货品
        getProductGoods: host + '/product/get_product_groupbybn',
        //品牌搜索
        getBrandSearch: host + '/brand/list',
        //创建临时表获取临时表ID
        getRedistableId: host + '/Redistable/createTable',
        //新增/更新临时表数据
        redistableAdd: host + '/Redistable/addDatas',
        //获取临时表数据
        getRedistable: host + '/Redistable/index',
        //删除临时表数据
        deleteRedisData: host + '/Redistable/delData',
        //清空临时表
        emptyRedisTable: host + '/RedisTable/emptyTable',
        //删除活动列表
        deleteAct: host + '/active/delete',
        //添加活动
        addActive: host + '/Active/add',
        //编辑活动
        updateActive: host + '/Active/update',
        //获取活动编辑信息
        getActiveInfo: host + '/active/info',
        //获取所有临时表数据
        getAllRedistable: host + '/Redistable/getAll',
        //获取会员分组
        getMemberList: host + '/active/member_list',
        //获取分类列表
        getClassifyList: host + '/Backclassify/list',
        //获取渠道
        getAllChannels: host + '/active/get_channel',
        //获取品牌列表
        getBrandList: host + '/Brand/list',
        //统计
        statistic: host + '/Active/statistics',
        //导出
        exportStatistic: host + '/Active/export_statistics'
    },


    //店铺搜索
    shopSearch: host + '/Xeshop/index',
    //调用改接口，让后端知道店铺权限
    selectShopUrl: host + '/member/selectShop',

    coupon: {
        /* 优惠券核销 */
        //优惠券兑换
        exchange: host + '/Coupon/verification_exchange',
        //优惠券核销列表
        verification: host + '/Coupon/verification',
        //停车券
        parking: host + '/Coupon/parking_list',
        //商家优惠券
        business: host + '/Coupon/business_list',

        /* 优惠券相关ID生成接口 */
        createCouponId: host + '/Coupon/create_coupon_code',

        /* 发券活动列表 */
        //删除发券活动
        grantDelete: host + '/Coupon/grant_delete',
        //列表
        grantList: host + '/Coupon/grant_list',
        //发券活动详情
        grantInfo: host + '/Coupon/grant_info',
        //发布发券活动
        grantRelease: host + '/Coupon/grant_release',
        //新增发券活动
        grantAdd: host + '/Coupon/grant_add',
        //编辑发券活动
        grantUpdate: host + '/Coupon/grant_update',

        /* 优惠券定义列表 */
        //列表接口
        defineList: host + '/coupon/define_list',
        //详情接口
        defineGet: host + '/coupon/define_get',
        //新增、修改优惠券定义
        saveDefine: host + '/coupon/save_define',
        //优惠券统计
        grantStatistics: host + '/coupon/grant_statistics',



        /* 优惠券用券规则 */
        //列表接口
        ruleList: host + '/Coupon/rule_list',
        //用券规则删除
        deleteCouponrule: host + '/Coupon/delete_couponrule',
        //用券规则发布
        releaseCouponrule: host + '/Coupon/release_couponrule',
        //配置用券规则
        saveCouponrule: host + '/Coupon/save_couponrule',
        //用券规则详情
        getRule: host + '/Coupon/get_rule',
        //会员等级接口
        memberList: host + '/active/member_list',
        //营销活动接口
        getActiveToolids: host + '/Active/get_active_toolids',

        /* 优惠券发放 */
        //列表搜索
        grantByHandlist: host + '/coupon/grantlist',
        downloadExcel: host + '/coupon/grant_downloadExcel', //模板下载
        parseExcel: host + '/coupon/grant_parse_excel', //文件提交
        grantCreate: host + '/coupon/grant_create', //优惠券发放
        grantResult: host + '/coupon/grant_result', //优惠券发放

    }
}
