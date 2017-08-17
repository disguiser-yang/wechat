/**
 * Created by Lihuan on 2017/3/28.
 */
getToken(11);
mui.post('/puhuihua/wechat/userInfo/queryClubCard', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        $('.content-wrap').removeClass('display-none');
        var dataJson = data.data;
        var length = parseInt(dataJson.cardNumber.length);
        var preCardNum = dataJson.cardNumber.substr(0, 5);
        var cardNum = dataJson.cardNumber.substr(length - 4);
        $('.card-num').html(preCardNum + '<span class="va-m"> ***** ***** </span>' + cardNum)
    } else if (data.errorCode == 0) {
        mui.toast('网络开小差了')
    }
}, 'json');
mui('body').on('tap', '.modify-card', function() {
    window.location.href = 'modify-vipCard.html'
});
//操作回退的历史记录
// back('vip-card');

$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        // alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能  

        window.location.href = '../labor-server/labor-server.html'

    }, false);

    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    }

});