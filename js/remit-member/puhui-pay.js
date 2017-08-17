/**
 * Created by Lihuan on 2017/1/10.
 */
var isBalance = true; //是否为零钱支付
var validateStr = null; //正确的支付密码后的验证码
var time = null; //访问支付结果的定时器
var refresh = null; //每分钟刷新二维码的定时器
var path = '/puhuihua/static/wechat/template/remit-member/';
if (window.screen.availHeight > 400) {
    $('.pay-wrap').css('paddingTop', '.55rem')
}
if (window.screen.availHeight > 440) {
    $('.pay-wrap').css('paddingTop', '.6rem')
}
if (window.screen.availHeight > 460) {
    $('.pay-wrap').css('paddingTop', '0.6rem');
    $('.pay-content .bar-code').css('marginTop', '.4rem');
    $('.pay-content .QR-code').css('marginTop', '0.0rem')
}
//获取身份令牌
getToken(4);
var isNewUser = localStorage.getItem('isNewUser');




//判断新用户是否实名
if (isNewUser == 'true') {
    mui.post('/puhuihua/wechat/wallet/getCardInfo', {
        token: token + '_' + terminal
    }, function(data) {
        if (!data.success) {
            mui.confirm('到普惠平台诚信优质商家扫码支付，365天每笔消费都送红包，享随机立送最高免单特权。<br/>完成实名认证，享受便捷支付，还可立抢200万随机红包', ' ', ['取消', '开通'], function(e) {
                if (e.index == 1) {
                    localStorage.removeItem('from');
                    window.location.href = path + 'set-pay-pwd.html';
                    sessionStorage.setItem('setPwd', 4)
                } else {
                    isEnter = window.sessionStorage.getItem('enter');
                    // mui.toast(isEnter)
                    if (isEnter == '2') {
                        window.location.href = path + 'puhui-wallet.html'
                    } else if (isEnter == '3') {
                        WeixinJSBridge.call('closeWindow');
                    }

                }
            })
        } else {
            //判断是否免密
            mui.post('/puhuihua/wechat/wallet/hasPass', {
                token: token + '_' + terminal
            }, function(data) {
                $('#load').css('display', 'none');
                if (data.success) {
                    $('#pay-pwd-wrap').addClass('display-none');
                    $('#pay-wrap').removeClass('display-none');
                    validateStr = '';
                    initInfor();
                    getCode(validateStr);
                    refresh = setInterval(autoRefresh, 60000);
                } else if (data.errorCode == 8) {
                    mui.alert('身份验证出错' + '<br/>' + '前去登录', '提示', '是', function(e) {
                        window.location.href = path + 'login.html';
                        sessionStorage.setItem('page', 4);
                    })
                } else if (data.errorCode == 0) {
                    mui.toast('网络开小差了')
                } else {
                    $('#pay-pwd-wrap').removeClass('display-none');
                    $('#pay-wrap').addClass('display-none')
                }
            }, 'json');
        }
    }, 'json');
} else {
    mui.post('/puhuihua/wechat/wallet/hasPayPassword', {
        token: token + '_' + terminal
    }, function(data) {
        if (data.success) {
            if (!data.data) {
                mui.confirm('到普惠平台诚信优质商家扫码支付，365天每笔消费都送红包，享随机立送最高免单特权。<br/>完成实名认证，享受便捷支付，还可立抢200万随机红包', ' ', ['取消', '开通'], function(e) {
                    if (e.index == 1) {
                        localStorage.removeItem('from');
                        window.location.href = path + 'set-pay-pwd.html';
                        sessionStorage.setItem('setPwd', 4)
                    } else {
                        isEnter = window.sessionStorage.getItem('enter');
                        // mui.toast(isEnter)
                        if (isEnter == '2') {
                            window.location.href = path + 'puhui-wallet.html'
                        } else if (isEnter == '3') {
                            WeixinJSBridge.call('closeWindow');
                        }

                    }
                })
            } else {
                //判断是否免密
                mui.post('/puhuihua/wechat/wallet/hasPass', {
                    token: token + '_' + terminal
                }, function(data) {
                    $('#load').css('display', 'none');
                    if (data.success) {
                        $('#pay-pwd-wrap').addClass('display-none');
                        $('#pay-wrap').removeClass('display-none');
                        validateStr = '';
                        initInfor();
                        getCode(validateStr);
                        refresh = setInterval(autoRefresh, 60000);
                    } else if (data.errorCode == 8) {
                        mui.alert('身份验证出错' + '<br/>' + '前去登录', '提示', '是', function(e) {
                            window.location.href = path + 'login.html';
                            sessionStorage.setItem('page', 4);
                        })
                    } else if (data.errorCode == 0) {
                        mui.toast('网络开小差了')
                    } else {
                        $('#pay-pwd-wrap').removeClass('display-none');
                        $('#pay-wrap').addClass('display-none')
                    }
                }, 'json');
            }
        } else if (data.errorCode == 0) {
            mui.toast('网络开小差了')
        }
    }, 'json');
}




//输入支付密码验证
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
//普惠商户
mui("body").on('tap', '.puhui-store', function() {
    window.location.replace('/puhuihua/static/wechat/template/sub-life/puhui-stroe.html');
});

//支付密码验证
mui("body").on('tap', '.btn-success', function() {
    if (pwd.length == 6) {
        $('#tip').css('display', 'block');
        var hasPwd = 0;
        var checked = $('#checkbox').is(':checked');
        console.log(checked);
        if (checked) {
            hasPwd = 1;
        } else {
            hasPwd = 0;
        }
        mui.post('/puhuihua/wechat/wallet/noPass', {
            token: token + '_' + terminal,
            payPassword: pwd,
            noPass: hasPwd
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                $('#pay-pwd-wrap').addClass('display-none');
                $('#pay-wrap').removeClass('display-none');
                validateStr = data.data;
                initInfor();
                getCode(validateStr);
                refresh = setInterval(autoRefresh, 60000);
            } else if (data.errorCode == 13) {
                mui.confirm('密码输入错误', '提示', ['重新输入', '忘记密码'], function(e) {
                    if (e.index == 0) {
                        $('.pwd-row input').val('');
                        count = 0;
                        pwd = '';
                        $('.mui-button-row button').removeClass('btn-success')
                    } else {
                        window.location.href = path + 'forget-pay-pwd.html?from=puhuipay';
                    }
                });
            } else if (data.errorCode == 34) {
                mui.alert('密码错误次数过多<br/>请前往"个人中心"->"安全中心"->"忘记支付密码"找回支付密码', '提示', '确定');
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了');
            }
        }, 'json');
    }
});

function initInfor() {
    //请求余额
    mui.post('/puhuihua/wechat/userInfo/queryBalance', {
        token: token + '_' + terminal
    }, function(data) {
        if (data.success) {
            $('#balance').text(data.data)
        } else if (data.errorCode == 0) {
            mui.toast('网络开小差了')
        }
    }, 'json');

    //请求银行卡号
    mui.post('/puhuihua/wechat/wallet/getCardInfo', {
        token: token + '_' + terminal
    }, function(data) {
        if (data.success) {
            $('.add-card').css('display', 'none');
            var length = parseInt(data.data.cardNo.length);
            var num = data.data.cardNo.substr(length - 4);
            $('.select-type-box').append(' <div class="type bank-card pay-type" data-num="' + num + '"><div><span class="bank-name">' + data.data.bankName + '</span>(' + num + ')</div></div>')
        } else if (data.errorCode == 38) {
            $('.add-card').css('display', 'block')
        }
    }, 'json');
}
//请求支付结果
function timestamp(timestamp) {
    $.post('/puhuihua/wechat/userInfo/codePayDetails', {
        token: token + '_' + terminal,
        timestamp: timestamp
    }, function(data) {
        if (data.success) {
            if (data.data.transType == 1) {
                if (data.data.paySuccess) {
                    window.location.href = path + "pay-success.html?transAmount=" + data.data.transAmount + '&rpType=' + data.data.rpType + '&rpAmount=' + data.data.rpAmount;
                } else {
                    if (data.data.status == 'S72_7010') {
                        window.location.href = path + "pay-fail2.html"
                    } else {
                        window.location.href = path + "pay-fail.html"
                    }
                }
            } else if (data.data.transType == 2) {
                if (data.data.paySuccess) {
                    window.location.href = path + "pay-cancel-success.html?transAmount=" + data.data.transAmount;
                } else {
                    window.location.href = path + "pay-cancel-fail.html"
                }
            }
        }
    }, 'json');
}

//请求零钱条形码和二维码
function getCode(validate) {
    $.post('/puhuihua/wechat/userInfo/codeCreate', {
        token: token + '_' + terminal,
        validateStr: validate
    }, function(data) {
        if (data.success) {
            $('.QR-code').html('');
            //生成条形码
            JsBarcode("#canvas", data.data.code, { displayValue: false });
            //生成二维码
            $('.QR-code').qrcode(data.data.code);
            //处理二维码
            var code = data.data.code.replace(/;/, '');
            var reg = /^(\d{3})(\d{4})(\d{4})(\d{4})(\d{4})$/;
            var matches = reg.exec(code);
            var newNum = matches[1] + ' ' + matches[2] + ' ' + matches[3] + ' ' + matches[4] + ' ' + matches[5];
            $('.bar-code-num').text(newNum);
            time = setInterval(function() {
                timestamp(data.data.timestamp)
            }, 3000)
        }
    }, 'json');
}

//请求银行卡条形码和二维码
function getCardCode() {
    $.post('/puhuihua/wechat/userInfo/cardCodeCreate', {
        token: token + '_' + terminal,
        validateStr: validateStr
    }, function(data) {
        if (data.success) {
            $('.QR-code').html('');
            //生成条形码
            JsBarcode("#canvas", data.data.code, { displayValue: false });
            //生成二维码
            $('.QR-code').qrcode(data.data.code);
            //处理二维码
            var code = data.data.code.replace(/;/, '');
            var reg = /^(\d{3})(\d{4})(\d{4})(\d{4})(\d{4})$/;
            var matches = reg.exec(code);
            var newNum = matches[1] + ' ' + matches[2] + ' ' + matches[3] + ' ' + matches[4] + ' ' + matches[5];
            $('.bar-code-num').text(newNum);
            time = setInterval(function() {
                timestamp(data.data.timestamp)
            }, 3000)
        } else {

            mui.toast('网络开小差')
        }
    }, 'json');
}

//点击刷新
$('.refresh').click(function() {
    clearInterval(time);
    clearInterval(refresh);
    if (isBalance) {
        getCode(validateStr);
    } else {
        getCardCode()
    }
    refresh = setInterval(autoRefresh, 60000);
});

function autoRefresh() {
    clearInterval(time);
    if (isBalance) {
        getCode(validateStr);

    } else {
        getCardCode();
    }
}
//手动关闭弹出层
mui('body').on('tap', '.select-type-wrap .close-icon', function() {
    $('.select-type-wrap').css('bottom', '-18rem')
    $('.float-mask').css('display', 'none')
});
//点击更换
mui('body').on('tap', '.change-pay-type', function() {
    $('.select-type-wrap').css({
        'display': 'block',
        'bottom': '0'
    })

    $('.float-mask').css('display', 'block')
});
//添加银行卡
mui('body').on('tap', '.add-card', function() {
    window.location.href = path + 'bind-bankCard.html?enter=puhuipay'
});
//切换支付方式
mui('body').on('tap', '.pay-type', function() {
    var $this = $(this);
    $this.siblings('.pay-type').removeClass('active');
    $this.addClass('active');
    var cardNum = $this.attr('data-num');
    if (cardNum) {
        $('.bank').html($this.find('div').html());
        $('.wallet').css('display', 'none');
        $('.bank').css('display', 'block');
        isBalance = false;
        clearInterval(refresh);
        clearInterval(time);
        getCardCode();
        refresh = setInterval(autoRefresh, 60000);
    } else {
        $('.bank').text('');
        $('.wallet').css('display', 'block');
        $('.bank').css('display', 'none');
        isBalance = true;
        clearInterval(refresh);
        clearInterval(time);
        getCode(validateStr);
        refresh = setInterval(autoRefresh, 60000);
    }
    $('.select-type-wrap').css('bottom', '-18rem');
    $('.float-mask').css('display', 'none')
});
//点击设置免密
mui('body').on('tap', '.set', function() {
    $('.no-password-wrap').css('bottom', '0');
    $('.noPwd-box').addClass('no-password-box');
    //$('.no-password-box').css('position','fixed')
});
mui('body').on('tap', '.no-password-wrap .cancel', function() {
    $('.no-password-wrap').css('bottom', '-18rem');
    $('.noPwd-box').removeClass('no-password-box');
});
mui('body').on('tap', '.no-password-box', function() {
    $('.no-password-wrap').css('bottom', '-18rem');
    $('.noPwd-box').removeClass('no-password-box');
});
mui('body').on('tap', '.no-password-wrap .help', function() {
    window.location.href = path + 'user-help.html';
    $('.no-password-wrap').css('bottom', '-18rem');
    $('.noPwd-box').removeClass('no-password-box');
});
mui('body').on('tap', '.no-password-wrap .password-set', function() {
    window.location.href = path + 'set-no-password.html';
    $('.no-password-wrap').css('bottom', '-18rem');
    $('.noPwd-box').removeClass('no-password-box');
});
mui('body').on('tap', '.recharge-agreement', function() {
    window.location.href = path + 'no-password-agreement.html'
});
mui('body').on('tap', '.link-to-about-us', function() {
    sessionStorage.setItem('from', 'puhuipay')
    window.location.replace(path + 'service-provider-introduce.html?enter=puhui-pay');
});

mui('body').on('tap', '.float-mask', function() {
    $('.select-type-wrap').css('display', 'none')
    $('.float-mask').css('display', 'none')
});
//判断是否由登录页面进入
var searchKey = window.location.search;
var isEnter = searchKey.split("=")[1];
$(function() {
    if (isEnter == '1') {
        //操作回退的历史记录
        back(path + 'puhui-pay');
        //pushHistory();
    } else {
        isEnter = window.sessionStorage.getItem('enter');
        if (isEnter == '2') {
            back2('puhui-pay.html')
        } else {
            pushHistory();
            window.addEventListener("popstate", function(e) {
                //监听到了浏览器的返回按钮事件
                WeixinJSBridge.call('closeWindow');
            }, false);

            function pushHistory() {
                window.history.pushState('', "title", "");
            }
        }
    }
});