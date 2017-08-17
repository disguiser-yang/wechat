/**
 * Created by Lihuan on 2017/2/17.
 */
//获取身份令牌
var balance;
var checkBalance = false;
var token = local.getItem('token');
if (!token) {
    window.location.href = '../remit-member/login.html';
    sessionStorage.setItem('page', 8);
} else {
    $.post('/puhuihua/wechat/userInfo/validateToken', {
        token: token + '_' + terminal
    }, function(data) {
        if (!data.success) {
            local.removeItem('token');
            window.location.href = '../remit-member/login.html';
            sessionStorage.setItem('page', 8);
        }
    }, 'json');
}
var check = true;
var catName = null;

//获取登录用户的手机号和运营商
mui.post('/puhuihua/wechat/mall/phonePayment', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        var dataJson = data.data;
        var phone = dataJson.telString;
        $('.phone-num').val(phone.substring(0, 3) + ' ' + phone.substring(3, 7) + ' ' + phone.substring(7));
        $('.tip').text(dataJson.carrier);
        catName = dataJson.catName;
    }
}, 'json');

//输入手机号操作
$('.phone-num').keyup(function(e) {
    var str = $(this).val();
    str = str.replace(/\s/g, "");
    var length = str.length;
    if (length > 3 && length <= 7) {
        str = str.substring(0, 3) + " " + str.substring(3)
    }
    if (length > 7) {
        str = str.substring(0, 3) + " " + str.substring(3, 7) + " " + str.substring(7)
    }
    $(this).val(str);
    if ($(this).val().length == 13) {
        var phoneNum = $(this).val().replace(/\s/g, "");
        if (phoneNum.match(/^1[3|4|5|7|8][0-9]\d{8}$/)) {
            mui.post('/puhuihua/wechat/mall/phonePayment', {
                phone: phoneNum,
                token: token + '_' + terminal
            }, function(data) {
                if (data.success) {
                    var dataJson = data.data;
                    $('.tip').text(dataJson.carrier);
                    catName = dataJson.catName;
                } else if (data.errorCode == 0) {
                    mui.toast('网络开小差了')
                }
            }, 'json');
        } else {
            mui.toast('请输入11位手机号')
        }
    } else {
        $('.tip').text('');
    }
});
$('.phone-num').focus(function() {
    $('form').css({
        'bottom': '-15rem',
        'transition': 'bottom .6s linear '
    });
});

//请求余额
$.post('/puhuihua/wechat/userInfo/queryBalance', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        $("#rechargebtn").removeAttr("disabled");
        checkBalance = true;
        balance = Number(data.data) * 100;
        if (balance < parseInt($('.pay-price').val()) * 100) {
            $('.records-btn button').text('余额不足，去充值');
            check = false;
        } else {
            $('.records-btn button').text('支付');
            check = true;
        }
    } else if (data.errorCode == 0) {
        mui.toast('网络开小差了')
        $('.records-btn button').text('网络开小差了！');
    } else if (data.errorCode == 9) {
        mui.toast('查询余额失败！');
        $('.records-btn button').text('查询余额失败！');
    }
}, 'json');

//选择充值金额
mui('body').on('tap', '.recharge-money', function() {
    $('.phone-num').blur();
    var $this = $(this);
    var $phoneNum = $('.phone-num').val().replace(/\s/g, "");
    setTimeout(function() {
        if ($phoneNum.match(/^1[3|4|5|7|8][0-9]\d{8}$/)) {
            $this.parent().siblings().children().removeClass('active');
            $this.addClass('active');
            $('#other-price').css('display', 'none');
            $('form').css({
                'bottom': '0',
                'transition': 'bottom .1s linear '
            });
            $('.order-infor').val($phoneNum + $('.tip').text());
            $('.pay-price').val(parseInt($this.text()) + '.00元');

            //余额是否足够,需先判断余额是否查询成功
            if (checkBalance == true) {
                if (balance < parseInt($('.pay-price').val()) * 100) {
                    $('.records-btn button').text('余额不足，去充值');
                    check = false;
                } else {
                    $('.records-btn button').text('支付');
                    check = true;
                }
            }
        } else {
            mui.toast('请输入11位手机号')
        }
    }, 200)
});

//关闭弹出下拉框
mui('body').on('tap', 'form .close-icon', function() {
    $('form').css({
        'bottom': '-15rem',
        'transition': 'bottom .1s linear '
    });
});
//输入支付密码支付
var count = 0;
var pwd = '';
mui('body').on('tap', '#keyboard .num', function() {
    clearTimeout(timer);
    $(this).css('background-color', '#e6e6e6');
    var this_span = $(this);
    var timer = setTimeout(function() {
        this_span.css('background-color', '#fff');
    }, 150);
    var num = $(this).text();
    if (count < 6) {
        count++;
        $('.pwd-row input:nth-child(' + count + ')').val(num);
        pwd = pwd + num;
    }
    if (count == 6) {
        $('#tip').css('display', 'block');
        $('#pay-keyboard-wrap').css('right', '-20rem');

        $.post('/puhuihua/wechat/wallet/payValidate', {
            token: token + '_' + terminal,
            payPassword: pwd
        }, function(data) {
            if (data.success) {
                var validateStr = data.data;
                var company;
                if (catName == '中国移动') {
                    company = 1
                } else if (catName == '中国电信') {
                    company = 2
                } else if (catName == '中国联通') {
                    company = 3
                }
                mui.post('/puhuihua/wechat/mall/payment', {
                    token: token + '_' + terminal,
                    payType: 1,
                    billKey: $('.phone-num').val().replace(/\s/g, ""),
                    companyId: company,
                    payAmount: parseInt($('.pay-price').val()) * 100,
                    validateStr: validateStr
                }, function(data) {
                    $('#tip').css('display', 'none');
                    if (data.success) {
                        window.location.href = 'pay-fees-success.html'
                    } else {
                        window.location.href = 'pay-fees-fail.html'
                    }
                }, 'json');
            } else if (data.errorCode == 13) {
                $('#tip').css('display', 'none');
                mui.toast('支付密码错误');
            } else if (data.errorCode == 34) {
                $('#tip').css('display', 'none');
                mui.confirm('密码尝试次数过多，已锁定', '提示', ['取消', '重置密码'], function(e) {
                    if (e.index == 1) {
                        window.location.href = '../remit-member/forget-pay-pwd.html'
                    }
                });
            } else if (data.errorCode == 0) {
                $('#tip').css('display', 'none');
                mui.toast('网络开小差了')
            }
        }, 'json');

        $('.pwd-row input').val('');
        count = 0;
        pwd = '';

    } else {

    }
});
mui('body').on('tap', '#keyboard .single-del', function() {
    if (count > 0) {
        $('.pwd-row input:nth-child(' + count + ')').val('');
        count--;
        pwd = pwd.substr(0, pwd.length - 1)
    }
});
mui('body').on('tap', '#keyboard .all-del', function() {
    $('.pwd-row input').val('');
    count = 0;
    pwd = '';
});
//收起支付密码键盘
mui('body').on('tap', '#keyboard .close-icon', function() {
    $('#pay-keyboard-wrap').css('right', '-20rem');
});
//支付
mui('body').on('tap', '.records-btn button', function() {
    $('input').blur();
    if (check) {
        //打开支付密码键盘
        $('#pay-keyboard-wrap').css('right', '0')
    } else {
        //跳转到充值
        var obj = {
            'taskName': 'openpage',
            'data': {
                'pageName': 'recharge'
            }
        };
        var jsonObj = JSON.stringify(obj);
        if (isWX) {
            window.location.href = '../remit-member/recharge.html';
        } else if (isAndroid) {
            window.app.nativeHandler(jsonObj);
        } else if (isiOS) {
            window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
        } else {
            window.location.href = '../remit-member/recharge.html';
        }
    }
});