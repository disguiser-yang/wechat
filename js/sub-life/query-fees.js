/**
 * Created by Lihuan on 2017/3/3.
 */
//格式化日期
Date.prototype.format = function(format) {
    /*
     * 使用例子:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
            // millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/*查询账务*/
function queryFees(page, html_url, payType) {
    var date = new Date();
    var time = date.format("hh:mm:ss");
    //获取身份令牌
    if (!token) {
        window.location.href = '../remit-member/login.html';
        sessionStorage.setItem('page', page);
    } else {
        $.post('/puhuihua/wechat/userInfo/validateToken', {
            token: token + '_' + terminal
        }, function(data) {
            if (!data.success) {
                local.removeItem('token');
                window.location.href = '../remit-member/login.html';
                sessionStorage.setItem('page', page);
            }
        }, 'json');
    }
    //打开弹出下拉框
    mui('body').on('tap', '#pay-fees-row', function() {
        $('#pay-fees').css('right', '0');
    });
    //关闭弹出下拉框
    mui('body').on('tap', '#pay-fees .close-icon', function() {
        $('#pay-fees').css('right', '-20rem');
    });
    //选择缴费单位
    mui('body').on('tap', '#pay-fees .unit', function() {
        var unit = $(this).find('div').text();
        var dataId = $(this).attr('data-id');
        $('#unit').text(unit).attr('data-id', dataId);
        $('#pay-fees').css('right', '-20rem');
    });
    $('.num').focus(function() {
        if ('02:00:00' < time && time < '22:00:00') {
            $('.my-btn').css({
                'border-color': "#EC2719",
                'background-color': '#EC2719'
            });
        }
    });
    $('.num').blur(function() {
        if (!$('.num').val().replace(/\s/g, "")) {
            $('.my-btn').css({
                'border-color': "#ccc",
                'background-color': '#ccc'
            });
        }
    });
    //查询缴费
    mui('body').on('tap', '.my-btn', function() {
        $('input').blur();
        if ('02:00:00' < time && time < '22:00:00') {
            if ($('.num').val().replace(/\s/g, "")) {
                var companyId = $('#unit').attr('data-id');
                $('#tip').css('display', 'block');
                mui.post('/puhuihua/wechat/mall/convenientPayment', {
                    token: token + '_' + terminal,
                    payType: payType,
                    billKey: $('.num').val().replace(/\s/g, ""),
                    companyId: companyId
                }, function(data) {
                    $('#tip').css('display', 'none');
                    if (data.success) {
                        var account = JSON.stringify(data.data);
                        sessionStorage.setItem('account', account);
                        window.location.href = html_url
                    } else if (data.errorCode == 36) {
                        mui.toast('未出账或已经缴纳，暂时无需缴费')
                    } else if (data.errorCode == 18) {
                        mui.toast('网络开小差了，请重试')
                    } else if (data.errorCode == 0) {
                        mui.toast('网络开小差了')
                    }
                }, 'json');
            } else {
                mui.toast('请填写缴费户号')
            }
        } else {
            mui.toast('该时段不支持缴费')
        }
    });
}

/*缴费*/
function payFees(payType, page) {
    var check = true;
    var account = sessionStorage.getItem('account');
    var data = JSON.parse(account);
    $('#font').text((data.payAmount / 100).toFixed(1));
    $('.unit').val(data.companyName).attr('data-id', data.companyId);
    $('.num').val(data.billkey);
    $('.name').val(data.customerName);
    //获取身份令牌
    if (!token) {
        window.location.href = '../remit-member/login.html';
        sessionStorage.setItem('page', page);
    } else {
        $.post('/puhuihua/wechat/userInfo/validateToken', {
            token: token + '_' + terminal
        }, function(data) {
            if (!data.success) {
                local.removeItem('token');
                window.location.href = '../remit-member/login.html';
                sessionStorage.setItem('page', page);
            }
        }, 'json');
    }

    /*是否同意《和信通便民缴费服务协议》*/
    $('input:checkbox').click(function() {
        if ($('input:checkbox').is(':checked')) {
            $('.my-btn').css({
                'border-color': "#EC2719",
                'background-color': '#EC2719'
            });
            check = true;
        } else {
            $('.my-btn').css({
                'border-color': "#ccc",
                'background-color': '#ccc'
            });
            check = false;
        }
    });
    //缴费
    mui('body').on('tap', '.my-btn', function() {
        if (check) {
            //打开支付密码键盘
            $('#pay-keyboard-wrap').css('right', '0');
        }
    });
    //输入支付密码支付
    var count = 0;
    var pwd = '';
    $('#keyboard .num').click(function() {
        var num = $(this).text();
        if (count < 6) {
            count++;
            $('.pwd-row input:nth-child(' + count + ')').val(num);
            pwd = pwd + num;
        }
        if (count == 6) {
            $('#tip').css('display', 'block');
            $.post('/puhuihua/wechat/wallet/payValidate', {
                token: token + '_' + terminal,
                payPassword: pwd
            }, function(data) {
                if (data.success) {
                    var validateStr = data.data;
                    mui.post('/puhuihua/wechat/mall/payment', {
                        token: token + '_' + terminal,
                        payType: payType,
                        billKey: data.billkey,
                        payAmount: data.payAmount,
                        companyId: data.companyId,
                        validateStr: validateStr
                    }, function(data) {
                        $('#tip').css('display', 'none');
                        if (data.success) {
                            window.location.href = 'pay-fees-success.html'
                        } else if (data.errorCode == 33) {
                            mui.toast('不在缴费时间之内')
                        } else if (data.errorCode == 17) {
                            mui.toast('扣款失败')
                        } else if (data.errorCode == 18) {
                            mui.toast('缴费查询失败')
                        } else if (data.errorCode == 16) {
                            mui.toast('该缴费服务暂停使用')
                        } else if (data.errorCode == 0) {
                            mui.toast('网络开小差了')
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
        } else {

        }
    });
    $('#keyboard .single-del').click(function() {
        if (count > 0) {
            $('.pwd-row input:nth-child(' + count + ')').val('');
            count--;
            pwd = pwd.substr(0, pwd.length - 1)
        }
    });
    $('#keyboard .all-del').click(function() {
        $('.pwd-row input').val('');
        count = 0;
        pwd = '';
    });
    //收起支付密码键盘
    $('#keyboard .close-icon').click(function() {
        $('#pay-keyboard-wrap').css('right', '-20rem');
    });
}