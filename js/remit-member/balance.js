/**
 * Created by Lihuan on 2017/1/10.
 */

//获取身份令牌
getToken(3);

//请求余额
$.post('/puhuihua/wechat/userInfo/queryBalance', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        if (data.data) {
            $('#price').text(data.data)
        }
    } else if (data.errorCode == 0) {
        mui.toast('网络开小差了');
    }
}, 'json');

//跳转到充值
$('body').on('click', '.btn-success', function() {
    var obj = {
        'taskName': 'openpage',
        'data': {
            'pageName': 'recharge'
        }
    };
    var jsonObj = JSON.stringify(obj);
    if (isWX) {
        window.location.href = 'recharge.html';
    } else if (isAndroid) {
        window.app.nativeHandler(jsonObj);
    } else if (isiOS) {
        window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
    } else {
        window.location.href = 'recharge.html';
    }
});

back2('balance.html')