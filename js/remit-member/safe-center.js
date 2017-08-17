mui('body').on('tap', '#modify-pwd', function() {
    window.location.href = 'modify-pwd.html'
});

mui('body').on('tap', '#modify-pay-pwd', function() {
    window.location.href = 'modify-pay-pwd.html'
});
mui('body').on('tap', '#forget-pay-pwd', function() {
    window.location.href = 'forget-pay-pwd.html'
});

var isNewUser = localStorage.getItem('isNewUser');


//判断是否有支付密码
mui.post('/puhuihua/wechat/wallet/hasPayPassword', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        if (!data.data) {
            $('#modify-pay-pwd').hide();
            $('#forget-pay-pwd').hide();
        }
    }
}, 'json');


$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {

        window.location.href = 'personal.html';

    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});