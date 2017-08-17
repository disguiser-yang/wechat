/**
 * Created by Administrator on 2017/2/21.
 */
//获取身份令牌
getToken(11);

/*
 * 绑定会员卡*/
//银行卡号禁止输入汉字
$('body').on('input', '.cardNo', function() {
    isNum($(this), 19)
});
$('body').on('input', '.password', function() {
    isNum($(this), 6)
});
var check = [false, false];
$('body').on('input', '#bind-vip input', function() {
    $('#bind-vip input').each(function(i, val) {
        var length = $(this).val().trim();
        if (length != 0) {
            check[i] = true;
        } else {
            check[i] = false;
        }
    });
    if (check.indexOf(false) < 0) {
        $('#bind-vip .my-btn').addClass('btn-success')
    } else {
        $('#bind-vip .my-btn').removeClass('btn-success')
    }
});

mui.post('/puhuihua/wechat/userInfo/queryClubCard', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        window.location.href = 'vip-card.html'
    } else if (data.errorCode == 52) {
        //查询是否为会员
        mui.post('/puhuihua/wechat/userInfo/myCenter', {
            token: token + '_' + terminal
        }, function(data) {
            if (data.success) {
                var dataJson = data.data;
                if (dataJson.member) {
                    $('form').removeClass('display-none')
                } else {
                    // mui.alert('您还不是工会会员，请先申请入会', '提示', '申请入会', function() {
                    window.location.href = 'enter-union-applied.html?enter=bindVip';
                    // });
                }
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            }
        }, 'json');
    } else if (data.errorCode == 0) {
        mui.toast('网络开小差了')
    }
}, 'json');

mui('body').on('tap', '#bind-vip .btn-success', function() {
    $('input').blur();
    var cardNo = $('.cardNo').val().trim();
    var password = $('.password').val().trim();
    if (cardNo.length != 19) {
        mui.toast('请输入19位工会会员卡号')
    } else if (password.length != 6) {
        mui.toast('请输入6位密码')
    } else {
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/userInfo/bindMemberCard', {
            token: token + '_' + terminal,
            cardNo: cardNo,
            password: password
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                window.location.href = 'enter-union-success.html?unionPage=2'
            } else if (data.errorCode == 8) {
                mui.toast('身份验证出错');
                setTimeout(function() {
                    window.location.href = 'login.html';
                    sessionStorage.setItem('page', 11);
                }, 1000);
            } else if (data.errorCode == 42) {
                mui.toast('会员卡绑定失败')
            } else if (data.errorCode == 43) {
                mui.toast('会员卡密码错误')
            } else if (data.errorCode == 44) {
                mui.toast('会员卡不存在')
            } else if (data.errorCode == 45) {
                mui.toast('会员卡状态异常')
            } else if (data.errorCode == 46) {
                mui.toast('会员卡总额超过5000')
            } else if (data.errorCode == 47) {
                mui.toast('会员卡已被绑定')
            } else if (data.errorCode == 48) {
                mui.toast('会员卡密码错误次数过多')
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            }
        }, 'json');
    }
});

//操作回退的历史记录
back('bind-vip');