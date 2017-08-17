/**
 * Created by Lihuan on 2017/1/10.
 */
var consumeLength = true;
var rechargeLength = true;
//获取身份令牌
getToken(2);
sessionStorage.setItem('back', 'wallet');
// sessionStorage.setItem('entry', 'convenient123');
var REDIRECT_URI = encodeURIComponent(url + '/puhuihua/wechat/userInfo/getOpenId');

var isNewUser = localStorage.getItem('isNewUser');
//判断是否是新用户
if (isNewUser == 'true') {
    mui.post('/puhuihua/wechat/wallet/getCardInfo', {
        token: token + '_' + terminal
    }, function(data) {
        if (!data.success) {
            mui.confirm('到普惠平台诚信优质商家扫码支付，365天每笔消费都送红包，享随机立送最高免单特权。<br/>完成实名认证，享受便捷支付，还可立抢200万随机红包', ' ', ['取消', '开通'], function(e) {
                if (e.index == 1) {
                    localStorage.removeItem('from');
                    window.location.href = 'set-pay-pwd.html?enter=puhuiwallet';
                    sessionStorage.setItem('setPwd', 3)
                } else {
                    window.location.href = 'personal.html';
                }
            })
        } else {

        }
    }, 'json');
} else {
    //判断是否有支付密码--老用户
    mui.post('/puhuihua/wechat/wallet/hasPayPassword', {
        token: token + '_' + terminal
    }, function(data) {
        if (data.success) {
            if (!data.data) {
                mui.confirm('到普惠平台诚信优质商家扫码支付，365天每笔消费都送红包，享随机立送最高免单特权。<br/>完成实名认证，享受便捷支付，还可立抢200万随机红包', ' ', ['取消', '开通'], function(e) {
                    if (e.index == 1) {
                        localStorage.removeItem('from');
                        window.location.href = 'set-pay-pwd.html?enter=puhuiwallet';
                        sessionStorage.setItem('setPwd', 3)
                    } else {
                        window.location.href = 'personal.html';
                    }
                })
            }
        } else if (data.errorCode == 0) {
            mui.toast('网络开小差了')
        }
    }, 'json');
}



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

//请求消费记录列表
function getList(obj, type) {
    mui.post('/puhuihua/wechat/userInfo/queryTransDetail', obj, function(data) {
        if (data.success) {
            var dataJson = data.data;
            $.each(dataJson, function(i, val) {
                var date = val.txnDate;
                var time = val.txnTime;
                val.txnDate = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
                val.txnTime = time.substring(0, 2) + ':' + time.substring(2, 4) + ':' + time.substring(4, 6);
            });
            if (type == 1) {
                $('#recharge-list').tmpl(dataJson).appendTo('#recharge');
                var length = $('#recharge').children().length;
                if (length == 0) {
                    $('.tip').css('display', 'block').text('暂无充值记录');
                    $('.mui-pull-bottom-pocket').removeClass('mui-visibility');
                    rechargeLength = false
                } else {
                    $('.tip').css('display', 'none');
                    $('.mui-pull-bottom-pocket').addClass('mui-visibility');
                    rechargeLength = true
                }
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(!dataJson.length);
            } else if (type == 2) {
                $('#consume-list').tmpl(dataJson).appendTo('#consume');
                var length = $('#consume').children().length;
                if (length == 0) {
                    $('.tip').css('display', 'block').text('暂无消费记录');
                    $('.mui-pull-bottom-pocket').removeClass('mui-visibility');
                    consumeLength = false;
                } else {
                    $('.tip').css('display', 'none');
                    $('.mui-pull-bottom-pocket').addClass('mui-visibility');
                    consumeLength = true;
                }

                mui('#pullrefresh').pullRefresh().endPullupToRefresh(!dataJson.length);
            }
        } else {
            mui.toast('网络开小差了')
        }
    }, 'json');
}
var rechargePage = 0;
var consumePage = 0;
var type = 1;
var init = true;
/*初始化上拉加载*/
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            auto: true,
            contentrefresh: '正在加载...',
            callback: function() {
                pullupRefresh(type)
            }
        }
    }
});

function pullupRefresh(refreshType) {
    if (refreshType == 1) {
        rechargePage++;
        var obj = {
            token: token + '_' + terminal,
            transType: 'R',
            pageNo: rechargePage
        };
        getList(obj, 1)
    } else if (refreshType == 2) {
        consumePage++;
        var obj = {
            token: token + '_' + terminal,
            transType: 'S',
            pageNo: consumePage
        };
        getList(obj, 2)
    }
}
//点击切换消费tab
mui("body").on('tap', '.consume', function() {
    $("#recharge").css('display', 'none');
    $("#consume").css('display', 'block');
    if (!consumeLength) {
        $('.tip').css('display', 'block').text('暂无消费记录');
    } else {
        $('.tip').css('display', 'none')
    }
    type = 2;
    if (init) {
        mui('#pullrefresh').pullRefresh().refresh(true);
        mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
        mui('#pullrefresh').pullRefresh().pullupLoading();
    }
    init = false;
});

//点击切换充值tab
mui("body").on('tap', '.recharge', function() {
    $("#consume").css('display', 'none');
    $("#recharge").css('display', 'block');
    if (!rechargeLength) {
        $('.tip').css('display', 'block').text('暂无充值记录');
    } else {
        $('.tip').css('display', 'none')
    }
    type = 1;
});

mui("body").on('tap', '.li-header', function() {
    $('.li-header').removeClass('active');
    $(this).addClass('active');
});


//跳转到普惠支付
mui("#mui-content").on('tap', '.pay', function() {

    if (isWX) {
        window.sessionStorage.setItem('enter', '2');
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_base&state=' + token + '_' + terminal + '#wechat_redirect'
    } else {
        hasPayPassword('puhui-pay.html?enter=2', 4, 'set-pay-pwd')
    }
});

//跳转到零钱
mui("#mui-content").on('tap', '.balance', function() {
    hasPayPassword('balance.html', 5, 'set-pay-pwd')
});

//跳转到绑定银行卡
mui("#mui-content").on('tap', '.bank-card', function() {
    sessionStorage.removeItem('entry');
    //判断是否有银行卡
    //window.location.href='bank-card.html'
    mui.post('/puhuihua/wechat/wallet/getCardInfo', {
        token: token + '_' + terminal
    }, function(data) {
        if (data.success) {
            window.location.href = 'bank-card.html'
        } else if (data.errorCode = 38) {
            $(".float-mask").css('display', 'block');
            $(".float-mask-reg-bag").css('animation', 'drop 0.5s');
            $(".float-mask-reg-bag").css('animation-fill-mode', 'forwards');
            $(".float-mask-reg-bag").css('animation-timing-function', 'ease');
            $(".close-btn-a").css('animation', 'showBtn 0.8s');
            $(".close-btn-a").css('animation-fill-mode', 'forwards');
            // window.location.href = 'bind-bankCard.html'
        }
    }, 'json');
});

mui("body").on('tap', '.redirect-bind-card', function() {
    sessionStorage.removeItem('entry');
    //判断是否有银行卡
    //window.location.href='bank-card.html'
    mui.post('/puhuihua/wechat/wallet/getCardInfo', {
        token: token + '_' + terminal
    }, function(data) {
        if (data.success) {
            window.location.href = 'bank-card.html'
        } else if (data.errorCode = 38) {
            localStorage.removeItem('from');
            window.location.href = 'bind-bankCard.html'
        }
    }, 'json');
});

mui("body").on('tap', '.close-btn-a', function() {
    $(".float-mask").css('display', 'none');
});
//跳转到充值
mui("body").on('tap', '.btn-success', function() {
    var obj = {
        'taskName': 'openpage',
        'data': {
            'pageName': 'recharge'
        }
    };
    var jsonObj = JSON.stringify(obj);
    if (isWX) {
        window.location.href = 'recharge.html';
    } else if (isAndroid) {
        window.app.nativeHandler(jsonObj);
    } else if (isiOS) {
        window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
    } else {
        window.location.href = 'recharge.html';
    }
});


$(function() {
    window.onpageshow = function(e) {
        pushHistory();
    };

    window.onpopstate = function(e) {
        //监听到了浏览器的返回按钮事件
        //alert('window.__wxjs_is_wkwebview='+window.__wxjs_is_wkwebview)
        var obj = {
            'taskName': 'close',
            'data': {
                'pageName': 'puhui-wallet'
            }
        };
        var jsonObj = JSON.stringify(obj);
        if (isWX) {
            if (typeof(WeixinJSBridge) != 'undefined') {
                // WeixinJSBridge.call('closeWindow');
                window.location.href = 'personal.html';
            } else {
                window.opener = null;
                window.open('', '_self');
                window.close();
            }
        } else if (isAndroid) {
            window.app.nativeHandler(jsonObj);
        }
    };

    function pushHistory() {
        if (isiOS && !window.__wxjs_is_wkwebview) {
            window.history.replaceState(null, null, "puhui-wallet.html");
        } else {
            window.history.replaceState(null, null, "puhui-wallet.html");
            window.history.pushState(null, null, null);
        }

    }
});