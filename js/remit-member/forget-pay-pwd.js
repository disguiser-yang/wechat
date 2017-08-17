/**
 * Created by Lihuan on 2017/3/8.
 */
//获取身份令牌
getToken(16);

mui.post('/puhuihua/wechat/wallet/getPhone', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        $('.login-phone').val(data.data)
    }
}, 'json');
//判断是否有支付密码
mui.post('/puhuihua/wechat/wallet/hasPayPassword', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        if (!data.data) {
            window.location.href = 'set-pay-pwd.html'
        }
    }
}, 'json');
//验证码倒计时
var countdown = 60;

function settime(obj) {
    if (countdown == 0) {
        obj.innerText = "发送验证码";
        countdown = 60;
        return;
    } else {
        obj.innerText = "重新发送(" + countdown + "s)";
        countdown--;
    }
    setTimeout(function() {
        settime(obj)
    }, 1000)
}
$('.input-yzm').focus(function() {
    $('.my-btn-login').css({
        'border-color': "#EC2719",
        'background-color': '#EC2719'
    });
});
$('.input-yzm').blur(function() {
    var securityCode = $('.input-yzm').val();
    if (!securityCode) {
        $('.my-btn-login').css({
            'border-color': "#ccc",
            'background-color': '#ccc'
        });
    }
});
mui(".login-content").on('tap', '.get-yzm span', function() {
    var phoneNum = $('.login-phone').val().trim();
    if (phoneNum.length == 11) {
        if (countdown == 60) {
            settime(this);
            $('.input-yzm').val('');
            mui.post('/puhuihua/wechat/userInfo/sendSecurityCode', {
                phone: phoneNum
            }, function(data) {
                if (data) {
                    if (data.success) {

                    } else {
                        mui.toast(data.error);
                    }
                }
            }, 'json');
        }
    } else {
        mui.toast('请输入11位手机号')
    }

});
mui("body").on('tap', '.my-btn-login', function() {
    $('input').blur();
    var securityCode = $('.input-yzm').val();
    if (securityCode) {
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/wallet/forgetPayPassword', {
            token: token + '_' + terminal,
            securityCode: securityCode
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                var validateStr = data.data;
                window.location.href = 'reset-pay-pwd.html?validateStr=' + validateStr + '&pageId=2'
            } else if (data.errorCode == 3) {
                mui.toast('验证码错误')
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            } else if (data.errorCode == 8) {
                mui.alert('身份验证出错' + '<br/>' + '前去登录', '提示', '是', function(e) {
                    window.location.href = 'login.html';
                    sessionStorage.setItem('page', 16);
                })
            }
        }, 'json');
    } else {
        $('.my-btn-login').css({
            'border-color': "#ccc",
            'background-color': '#ccc'
        });
    }
});


$(function() {
    pushHistory();

    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        var searchKey = window.location.search;
        var isEnter = searchKey.split("=")[1];
        if (isEnter == 'puhuipay') {
            window.location.href = 'puhui-pay.html';
        } else {
            window.location.href = 'safe-center.html';
        }

    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});