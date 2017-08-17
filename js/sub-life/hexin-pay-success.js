//获取参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var payMoney = getQueryString('payMoney')
if (payMoney) {
    // debugger;
    $('.pay-success-amount').text('￥' + payMoney + '元');
}

//跳转到订单页
mui("body").on('tap', '.return-a', function() {

    window.location.replace(jdOrder + '?type=0');

});