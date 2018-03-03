import Mock from 'mockjs';
var baseUrl = 'http://t.com';
//
Mock.mock(baseUrl + '/shop-management/home', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    var tableData = [];
    var product = {
        productId: 2,
        goodsId: 191000370,
        productName: "精品富士王",
        barcode: '123',
        productImage: "http://img04.bubugao.com/149192e3bc5_2_606e9d059ca16f3d5d4aca51e967925b_600x600.jpeg!s1"
    };
    for (var i = 0; i < 34; i++) {
        tableData.push({
            rank: i+1,
            product: product,
            costPrice: '11',
            sellPrice: '123',
            grossMargin: '12%',
            status: true,
            stock: 100,
            sales: 10,
            address: 'No. 189, Grove St, Los Angeles'
        });
    }
    let {
        page
    } = JSON.parse(param);
    let mockUsers = tableData;
    let total = mockUsers.length;
    mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
    sessionStorage.removeItem(opt.url);
    return {
        error: 0,
        msg: '',
        data: {
            total,
            tableData: mockUsers
        }
    }
});
