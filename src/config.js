let apiHost
let loginApiHost
if (process.env.NODE_ENV === 'production') {
    // api 测试环境
    apiHost = 'http://shopmanage.yunhou.com/api';
    loginApiHost = 'http://shopmanage.yunhou.com/api'
} else {
    // api 开发环境
    apiHost = 'http://shopmanage.yunhou.com/api';
    loginApiHost = 'http://shopmanage.yunhou.com/api'
}
// 图片静态资源
const staticImg4 = 'http://img4.bbgstatic.com/'
    // 商品管理详情页
const productDeatilHTML = 'https://wx.yunhou.com/super/item/'
    //交易商品链接
const exchangeProduct="http://shopmanage.yunhou.com/"
export default {
    apiHost,
    loginApiHost,
    staticImg4,
    productDeatilHTML,
    exchangeProduct

}