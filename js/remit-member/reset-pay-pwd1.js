/**
 * Created by Lihuan on 2017/3/8.
 */
//获取身份令牌
getToken(17);
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
var count = 0;
var pwd = '';
mui("body").on('tap', '#keyboard .num', function() {
    var num = $(this).text();
    if (count < 6) {
        count++;
        $('.pwd-row input:nth-child(' + count + ')').val(num);
        pwd = pwd + num;
    }
    if (count == 6) {
        $('.mui-button-row button').addClass('btn-success')
    }
});
mui("body").on('tap', '#keyboard .single-del', function() {
    if (count > 0) {
        $('.pwd-row input:nth-child(' + count + ')').val('');
        count--;
        pwd = pwd.substr(0, pwd.length - 1);
        $('.mui-button-row button').removeClass('btn-success')
    }
});
mui("body").on('tap', '#keyboard .all-del', function() {
    $('.pwd-row input').val('');
    count = 0;
    pwd = '';
    $('.mui-button-row button').removeClass('btn-success')
});
//打开键盘
mui("body").on('tap', '.pwd-row', function() {
    $('#keyboard').css('bottom', '0')
});
//收起键盘
mui("body").on('tap', '#switch', function() {
    $('#keyboard').css('bottom', '-12rem')
});
mui("body").on('tap', '.btn-success', function() {
    if (pwd.length == 6) {
        $('#tip').css('display', 'block');
        //设置支付密码
        $.post('/puhuihua/wechat/wallet/modifyPayPassword', {
            token: token + '_' + terminal,
            payPassword: pwd
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                var validateStr = data.data;
                window.location.href = 'modify-pay-pwd.html?validateStr=' + validateStr + '&pageId=1'
            } else if (data.errorCode == 13) {
                mui.toast('旧密码错误，请重新输入')
            } else if (data.errorCode == 8) {
                mui.alert('身份验证出错' + '<br/>' + '前去登录', '提示', '是', function(e) {
                    window.location.href = 'login.html';
                    sessionStorage.setItem('page', 17);
                })
            } else if (data.errorCode == 34) {
                mui.alert('密码错误次数过多<br/>请前往"安全中心"->"忘记支付密码"找回支付密码', '提示', '确定');
            }
        }, 'json');
    }
});

$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        window.location.href = 'safe-center.html';

    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});