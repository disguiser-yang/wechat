/**
 * Created by Lihuan on 2017/2/17.
 */
//获取身份令牌
var balance;
var checkBalance = false;
var token = local.getItem('token');
var phone = local.getItem('phone');
var orderNo = getQueryString('orderId');
var payFlag = 1;

var store = getQueryString('store');
// localStorage.setItem('store', store)
var money = parseInt(getQueryString('money'));
var balance = 0;
if (store == 2) {
    $('.pay-method-wechat').show();
    $('.some-tip').show();
} else {
    $('.pay-method-wechat').hide();
}
// var time = getQueryString('time');
// localStorage.setItem('time', time)

// var money = getQueryString('money');
// localStorage.setItem('money', money)
// var payPwdErrorCount = 0;
//获取参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var hasBankCard = false;
mui('body').on('tap', '.pay-btn-a', function() {
    if (payFlag == 1) {
        if (balance < money) {
            mui.toast('余额不足')
        } else {
            $('#pay-keyboard-wrap').css('right', '0rem');
            $('.float-mask').css('display', 'block');
        }
    } else {
        // $('#pay-keyboard-wrap').css('right', '0rem');
        // $('.float-mask').css('display', 'block');
        $('#tip').css('display', 'block');
        $.post('/puhuihua/external/ec/paymentOrder', {
            phone: phone,
            token: token + '_' + terminal,
            orderNo: orderNo,
            payFlag: 2
        }, function(data) {
            // debugger;
            // clearTimeout(timer);
            // $('#tip').css('display', 'none');
            // $('.float-mask').css('display', 'none');
            if (data.success == false) {
                if (data.errorCode == 9000) {
                    window.location.href = data.data;
                } else {
                    mui.toast('支付失败');
                    $('#tip').css('display', 'none');
                }
            }
        }, 'json');
        setTimeout(function() {
            $('#tip').css('display', 'none');
        }, 20000);
    }

});
mui('body').on('tap', '.float-mask', function() {
    $('#pay-keyboard-wrap').css('right', '-20rem');
    $('.float-mask').css('display', 'none');
    $('.pwd-row input').val('');
    count = 0;
    pwd = '';

});

//获取银行卡
mui.post('/puhuihua/wechat/wallet/getCardInfo', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        hasBankCard = true;
        $('.bankCard-name').text(data.data.bankName)
    } else {
        $('.pay-method-bankCard').removeClass('checked');
        $('.pay-method-wallet').addClass('checked');
        payFlag = 1;
        $('.bankCard-name').text('未绑定')
    }
}, 'json');

//请求余额
mui.post('/puhuihua/wechat/userInfo/queryBalance', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        if (data.data) {
            $('.bankCard-balance').text('￥' + data.data)
            balance = parseInt(data.data);
        }
    }
}, 'json');

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
    // clearTimeout(timer);
    // $(this).css('background-color', '#e6e6e6');
    // var this_span = $(this);
    // var timer = setTimeout(function() {
    //     this_span.css('background-color', '#fff');
    // }, 150);
    var num = $(this).text();
    if (count < 6) {
        count++;
        $('.pwd-row input:nth-child(' + count + ')').val(num);
        pwd = pwd + num;
    }
    if (count == 6) {
        $('#tip').css('display', 'block');
        $('.float-mask').css('display', 'none');
        $('#pay-keyboard-wrap').css('right', '-20rem');

        if (payFlag != 2) {
            payFlag = (payFlag == 0) ? 1 : 0;
        }
        clearTimeout(timer);
        var timer = setTimeout(function() {
            $('#tip').css('display', 'none');
            $('.float-mask').css('display', 'none');
            mui.toast('请求超时');
        }, 30000);

        $.post('/puhuihua/external/ec/paymentOrder', {
            phone: phone,
            token: token + '_' + terminal,
            payPwd: pwd,
            orderNo: orderNo,
            payFlag: 0
        }, function(data) {
            clearTimeout(timer);
            // $('#tip').css('display', 'none');
            $('.float-mask').css('display', 'none');
            if (data.success) {
                mui.toast('支付成功')
                setTimeout(function() {
                    $('#tip').css('display', 'none');
                    if (store == 1) {
                        window.location.replace(jdIndex + '?from=wechat&phone=' + phone + '&channel=2');
                    } else if (store == 2) {
                        window.location.replace(wineIndex);
                        // window.location.replace(wineIndex);
                    }
                }, 1000);
            } else {
                if (data.errorCode == 9007) {
                    $('#tip').css('display', 'none');
                    mui.alert('支付密码错误，请重新输入', '提示', '确定', function(e) {
                        $('#pay-keyboard-wrap').css('right', '0rem');
                        $('.float-mask').css('display', 'block');
                    })
                } else if (data.errorCode == 9011) {
                    $('#tip').css('display', 'none');
                    mui.alert('错误次数过多，被锁定，请到安全中心找回支付密码', '提示', '确定', function(e) {
                        setTimeout(function() {
                            if (store == 1) {
                                window.location.replace(jdIndex + '?from=wechat&phone=' + phone + '&channel=2');
                            } else if (store == 2) {

                                window.location.replace(wineIndex);

                                // window.location.replace(wineIndex);
                            }
                        }, 1000);
                    })
                } else {
                    if (data.errorCode == 9006) {
                        mui.toast('未设置支付密码')
                    } else if (data.errorCode == 9009) {
                        mui.toast('支付失败')
                    } else if (data.errorCode == 9003) {
                        mui.toast('订单不存在')
                    } else if (data.errorCode == 9004) {
                        mui.toast('订单已支付')
                    } else if (data.errorCode == 9008) {
                        mui.toast('余额不足')
                    } else if (data.errorCode == 9001) {
                        mui.toast('参数错误')
                    }
                    setTimeout(function() {
                        $('#tip').css('display', 'none');
                        if (store == 1) {
                            window.location.replace(jdIndex + '?from=wechat&phone=' + phone + '&channel=2');
                        } else if (store == 2) {
                            // debugger;

                            window.location.replace(wineIndex);

                            // debugger;
                            // window.location.replace(wineIndex);
                        }
                    }, 1000);
                }
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
    $('.float-mask').css('display', 'none');

    $('.pwd-row input').val('');
    count = 0;
    pwd = '';
});

//切换支付方式
mui('body').on('tap', '.pay-method .pay-method-bankCard', function() {

    if (hasBankCard) {
        $('.pay-method-bankCard').removeClass('checked');
        $(this).addClass('checked');
        payFlag = $(this).index();
        console.log(payFlag);
    } else {
        if ($(this).index() == 0) {
            mui.confirm('您还没有绑定银行卡,是否绑定？', '提示', ['取消', '去绑定'], function(e) {
                if (e.index == 1) {
                    window.location.replace('../remit-member/bind-bankCard.html');
                } else {

                }
            })
        }
    }

    // console.log($(this).index());
    payFlag = $(this).index();
    $('.pay-method-bankCard').removeClass('checked');
    $(this).addClass('checked');
    console.log(payFlag);
});