/**
 * Created by lihuan on 2017/1/10.
 */
//获取身份令牌
getToken(6);
sessionStorage.setItem('closeWindow', 'yes')
    // if (isWX) {
$('#modify-pwd').css('display', 'block');
//判断是否有支付密码
mui.post('/puhuihua/wechat/wallet/hasPayPassword', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        if (!data.data) {
            $('#price').text('未开通')
        } else {
            //请求余额
            mui.post('/puhuihua/wechat/userInfo/queryBalance', {
                token: token + '_' + terminal
            }, function(data) {
                if (data.success) {
                    if (data.data) {
                        $('#price').text('￥' + data.data)
                    }
                }
            }, 'json');
        }
    }
}, 'json');
// }

phone = local.getItem('phone');
//用户数据
var dataJson = JSON.stringify({　　　　
    token: token + '_wechat',
    phone: phone
});
// debugger;
//设置cookie
setCookie('userInfo', dataJson);


mui.post('/puhuihua/wechat/userInfo/myCenter', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        var dataJson = data.data;
        if (dataJson.headImage) {
            $('#person-top-photo-img').attr('src', dataJson.headImage)
        }
        $('.nickname').text(dataJson.nickname);
        $('.phone').text(dataJson.phone);
        if (dataJson.member) {
            $('#vip-infor').css('display', 'block');
            $('.name').text('工会会员');
            $('.gender').text(dataJson.gender);
            $('.nationality').text(dataJson.nationality);
            $('.unionName').text(dataJson.unionName);
        }
    } else if (data.errorCode == 0) {
        mui.toast('网络开小差了')
    }
}, 'json');

//判断是否显示绑定银行卡得红包提示
mui.post('/puhuihua/wechat/wallet/getCardInfo', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        $('.bind-card-alert').text('');
    } else if (data.errorCode = 38) {
        var isNewUser = localStorage.getItem('isNewUser')
        if (isNewUser == 'true') {
            $('.bind-card-alert').text('开通普惠钱包拿现金红包');
        } else {
            $('.bind-card-alert').text('绑定银行卡拿现金红包');
        }
    }
}, 'json');



//绑定点击跳转链接动作
mui('body').on('tap', '#personal-center', function() {
    window.location.href = 'personal-center.html'
});
mui('body').on('tap', '#puhui-wallet', function() {
    window.location.href = 'puhui-wallet.html'
});

mui('body').on('tap', '#safe-center', function() {
    window.location.href = 'safe-center.html'
});
mui('body').on('tap', '#my-apply', function() {
    window.location.href = 'my-apply.html';
});
mui('body').on('tap', '#interaction', function() {
    window.location.href = 'interaction.html'
});
mui('body').on('tap', '#about-us', function() {
    window.location.href = 'about-us.html'
});
mui('body').on('tap', '#login-out', function() {
    var phoneNum = local.getItem('phone');
    mui.post('/puhuihua/wechat/userInfo/loginOut', {
        phone: phoneNum
    }, function(data) {
        if (data.success) {
            mui.toast('退出成功');
        }
    }, 'json');
    // 向iframe发送消息
    // var dataJson = JSON.stringify({　　　　
    //     token: " ",
    //     phone: " "
    // });
    // window.frames[0].postMessage(dataJson, '*');
    delCookie('userInfo');
    local.removeItem('token');
    local.removeItem('isNewUser');
    WeixinJSBridge.invoke('closeWindow', {}, function(res) {})
});
// document.getElementById('iframe').src = transmitTokenPage;
//操作回退的历史记录
back('personal')

// console.log((document.cookie));
try {
    console.log(JSON.parse(getCookie('userInfo')));

} catch (e) {

}


//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain;
}

//获取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}



//写cookies
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain;
}