/**
 * Created by Lihuan on 2017/1/10.
 */
var m = '';
var searchKey = window.location.search;
var strs = searchKey.split("=");
var phoneNum = strs[1];
$('.login-phone').val(phoneNum);
//禁止输入汉字
$('body').on('input', '.input-yzm', function() {
    isNum($(this), 6)
});
var check = [false, false, false];
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
$('body').on('focus', '.login-pwd', function() {
    $(this).siblings('.icon-clear').removeClass('icon-hidden')
    $(this).parent().siblings().find('.icon-clear').addClass('icon-hidden');
})
$('body').on('blur', '.login-pwd', function() {
    $(this).siblings('.icon-clear').addClass('icon-hidden')
})
mui("body").on('tap', '.icon-clear', function() {
    $(this).siblings('input').val('')
});


$(".once-pwd").blur(function() {
    if (!$('.once-pwd').val().match(/^[a-zA-Z0-9_]{6,12}$/)) {
        mui.toast('请输入6-12位密码，英文、数字或下划线');
    }
});
$(".again-pwd").blur(function() {
    if ($('.again-pwd').val().trim() != $('.once-pwd').val().trim()) {
        mui.toast('密码不一致');
    }
});

mui("body").on('tap', '.btn-success', function() {
    $('input').blur();
    if (!$('.once-pwd').val().match(/^[a-zA-Z0-9_]{6,12}$/)) {
        mui.toast('请输入6-12位密码，英文、数字或下划线');
    } else if ($('.again-pwd').val().trim() != $('.once-pwd').val().trim()) {
        mui.toast('密码不一致');
    } else if ($('.input-yzm').val().trim().length == 6) {
        var pwd = $('.again-pwd').val();
        var yzm = $('.input-yzm').val();
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/userInfo/register', {
            phone: phoneNum,
            password: pwd,
            securityCode: yzm,
            terminal: terminal
        }, function(data) {
            // $('#tip').css('display', 'none');
            if (data.success) {
                var token = data.data.token;
                local.setItem('token', token);
                local.setItem('phone', phoneNum);
                local.setItem('isNewUser', 'true');
                var obj = {
                    "taskName": "userinfo",
                    "data": {
                        "token": token,
                        "phone": phoneNum
                    }
                };
                var jsonObj = JSON.stringify(obj);
                // if (isAndroid && !isWX) {
                //     window.app.nativeHandler(jsonObj);
                // } else if (isiOS && !isWX) {
                //     window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
                // }
                window.location.href = 'register-success.html';
            } else if (data.errorCode == 4) {
                $('#tip').css('display', 'none');
                mui.toast('手机号已注册')
            } else if (data.errorCode == 3) {
                $('#tip').css('display', 'none');
                mui.toast('验证码错误')
            } else if (data.errorCode == 12) {
                $('#tip').css('display', 'none');
                mui.toast('网络开小差了，请重试')
            } else if (data.errorCode == 0) {
                $('#tip').css('display', 'none');
                mui.toast('网络开小差了')
            }
        }, 'json');
    } else {
        mui.toast('请输入正确的验证码');
    }
})

//验证码倒计时
var countdown = 120;

function settime(obj) {
    if (countdown == 0) {
        obj.innerText = "发送验证码";
        countdown = 120;
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
    // $('input').blur();
    if (phoneNum.length == 11) {
        if (countdown == 120) {
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