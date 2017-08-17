/**
 * Created by Lihuan on 2017/4/26.
 */
var searchKey = window.location.search;
var strs = searchKey.split("=");
// if (strs[1]) {
//     document.body.querySelector(".price").innerText = '￥' + strs[1];
// }

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var rpType = GetQueryString('rpType');
var rpAmount = GetQueryString('rpAmount');
var transAmount = GetQueryString('transAmount');


$('.price').text('￥' + transAmount);

if (rpType == '1') {
    $('.pocket-value').text(rpAmount);
    $('.rpType').text('消费红包');
    $('.random-red-pocket').show();
} else if (rpType == '2') {
    $('.pocket-value').text(rpAmount);
    $('.rpType').text('随机红包');
    $('.random-red-pocket').show();

} else if (rpType == '3') {
    $('.pocket-value').text(rpAmount);
    $('.rpType').text('电子券');
    $('.random-red-pocket-value-describe').hide();
    $('.random-red-pocket').show();

} else if (rpType == '99') {
    $('.random-red-pocket-value-info').text('红包正在赶往途中');
    $('.random-red-pocket-value-info').css('color', '#000000');
    $('.random-red-pocket-value-describe').text('别担心！红包将于次日到账');
    $('.random-red-pocket').show();
} else {
    $('.random-red-pocket-value-info').text('太可惜了竟然与红包擦肩而过');
    $('.random-red-pocket-value-info').css('color', '#000000');
    $('.random-red-pocket-value-describe').text('别担心！下次还有机会哦');
    $('.random-red-pocket').show();
}


mui.get('/puhuihua/wechat/mall/advertisementList',
    function(data) {
        if (data.success) {
            document.body.querySelector("#img").setAttribute('src', data.data[0].imageUrl);
            mui("body").on('tap', '#img', function() {
                window.location.href = data.data[0].targetUrl;
            });
        } else if (data.errorCode == 0) {
            mui.toast('网络开小差了')
        }
    }, 'json'
);
//支付成功跳到钱包
mui("body").on('tap', '#btn-success', function() {
    localStorage.removeItem('redPocket');
    window.location.replace('puhui-wallet.html');
});
pushHistory();
window.addEventListener("popstate", function(e) {
    //监听到了浏览器的返回按钮事件
    window.location.href = "puhui-wallet.html";
}, false);

function pushHistory() {
    window.history.pushState('', "title", "");
}