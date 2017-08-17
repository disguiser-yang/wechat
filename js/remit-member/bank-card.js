/**
 * Created by Lihuan on 2017/3/28.
 */
getToken(22);
mui.post('/puhuihua/wechat/wallet/getCardInfo', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        $('.content-wrap').removeClass('display-none')
        var dataJson = data.data;
        var length = parseInt(dataJson.cardNo.length);
        var cardNum = dataJson.cardNo.substr(length - 4);
        $('.bank-name').text(dataJson.bankName);
        $('.bank-logo img').attr('src', dataJson.bankLogo);
        $('.card-num').text('**** **** **** **** ' + cardNum)
    } else if (data.errorCode == 38) {
        mui.toast('请先添加银行卡');
        setTimeout(function() {
            window.location.href = 'bind-bankCard.html'
        }, 1000)
    }
}, 'json');
mui('body').on('tap', '.modify-card', function() {
    window.location.href = 'modify-bankCard.html'
});
window.onpageshow = function(e) {
    //alert('pageshow bind-bankCard'+e.persisted );
    pushHistory();
};
window.addEventListener("popstate", function(e) {
    //监听到了浏览器的返回按钮事件
    if ((isiOS && !window.__wxjs_is_wkwebview)) {
        window.location.href = 'bank-card.html';
    } else {
        window.location.href = 'puhui-wallet.html';
    }
}, false);

function pushHistory() {
    if (isiOS && !window.__wxjs_is_wkwebview) {
        window.history.replaceState({}, "", "");
    } else {
        window.history.pushState({}, "", "");
    }
}