/**
 * Created by lihuan on 2017/1/5.
 */

var check = [false, false];
$('body').on('input', '.login-content input', function() {
    $('.login-content input').each(function(i, val) {
        var length = $(this).val().trim();
        if (length != 0) {
            check[i] = true;
        } else {
            check[i] = false;
        }
    });
    if (check.indexOf(false) < 0) {
        $('.my-btn-login').addClass('btn-success')
    } else {
        $('.my-btn-login').removeClass('btn-success')
    }
});
//禁止输入汉字
$('body').on('input', '.login-phone', function() {
    isNum($(this), 11)
});
$('body').on('input', '.input-yzm', function() {
    isNum($(this), 6)
});
$('body').on('focus', '.login-phone', function() {
    $('.icon-clear').removeClass('icon-hidden')
})
$('body').on('blur', '.login-phone', function() {
    $('.icon-clear').addClass('icon-hidden')
})
mui("body").on('tap', '.icon-clear', function() {
    $('.login-phone').val('')
});
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
mui(".login-content").on('tap', '.get-yzm span', function() {
    $('input').blur();
    var phone = $('.login-phone').val().trim();
    if (phone.length == 11) {
        if (countdown == 60) {
            settime(this);
            $('.input-yzm').val('')
            mui.post('/puhuihua/wechat/userInfo/sendSecurityCode', {
                phone: phone
            }, function(data) {
                if (data) {
                    if (data.success) {
                        checkYzm = true;
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
mui("body").on('tap', '.btn-success', function() {
    $('input').blur();
    var phone = $('.login-phone').val().trim();
    var yzm = $('.input-yzm').val().trim();
    if (!phone.match(/^1[3|4|5|7|8][0-9]\d{8}$/)) {
        mui.toast('请输入11位手机号')
    } else if (yzm.length != 6) {
        mui.toast('请输入6位验证码')
    } else {
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/userInfo/forgetPassword', {
            phone: phone,
            securityCode: yzm,
            terminal: terminal
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                var token = data.data;
                window.location.href = 'reset-pwd.html?token=' + token;
            } else if (data.errorCode == 7) {
                mui.toast(data.error)
            } else if (data.errorCode == 3) {
                mui.toast('验证码错误')
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            }
        }, 'json');
    }
})