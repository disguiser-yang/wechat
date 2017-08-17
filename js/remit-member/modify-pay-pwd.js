/**
 * Created by Lihuan on 2017/3/8.
 */
//获取身份令牌
getToken(6);
var url = window.location.search;
var strs = url.split('=');
var pageId = strs[2];
// var validateStr = strs[1].split('&')[0];
if (pageId == 1) {
    document.title = "修改支付密码"
} else if (pageId == 2) {
    document.title = "忘记支付密码"
}
var phone = localStorage.getItem('phone');
var count = 0;
var countAgain = 0;
var oldPwd = '';
var oncePwd = '';
var twicePwd = '';
mui("body").on('tap', '#keyboard .num', function() {
    var num = $(this).text();
    if (count < 6) {
        count++;
        $('.pwd-row-old input:nth-child(' + count + ')').val(num);
        oldPwd = oldPwd + num;
    } else if (count < 12) {
        count++;
        var onceCount = count - 6
        $('.pwd-row-once input:nth-child(' + onceCount + ')').val(num);
        oncePwd = oncePwd + num;
    } else if (countAgain < 6) {
        countAgain++;
        $('.pwd-row-again input:nth-child(' + countAgain + ')').val(num);
        twicePwd = twicePwd + num;
    }
    if (count == 12 && countAgain == 6) {
        if (oncePwd == twicePwd) {
            $('.mui-button-row button').addClass('btn-success')
        } else {
            mui.toast('两次输入的新支付密码不一致')
        }
    }

    console.log(oldPwd);
    console.log(oncePwd);
    console.log(twicePwd);

})
mui("body").on('tap', '#keyboard .single-del', function() {
    if (countAgain > 0) {
        $('.pwd-row-again input:nth-child(' + countAgain + ')').val('');
        countAgain--;
        twicePwd = twicePwd.substr(0, twicePwd.length - 1);
        $('.mui-button-row button').removeClass('btn-success')
    } else if (count > 6) {
        var againCount = count - 6;
        $('.pwd-row-once input:nth-child(' + againCount + ')').val('');
        count--;
        oncePwd = oncePwd.substr(0, oncePwd.length - 1);
        $('.mui-button-row button').removeClass('btn-success')
    } else if (count > 0) {
        $('.pwd-row-old input:nth-child(' + count + ')').val('');
        count--;
        oldPwd = oldPwd.substr(0, oldPwd.length - 1);
        $('.mui-button-row button').removeClass('btn-success')
    }


})
mui("body").on('tap', '#keyboard .all-del', function() {
        if (countAgain > 0) {
            $('.pwd-row-again input').val('');
            twicePwd = '';
            countAgain = 0;
            $('.mui-button-row button').removeClass('btn-success')
        } else if (count > 6) {
            $('.pwd-row-once input').val('');
            countAgain = 0;
            count = 6;
            oncePwd = '';
            $('.mui-button-row button').removeClass('btn-success')
        } else {
            $('.pwd-row-old input').val('');
            count = 0;
            oldPwd = '';
            $('.mui-button-row button').removeClass('btn-success')
        }
    })
    //打开键盘
mui("body").on('tap', '.pwd-row', function() {
    $('#keyboard').css('bottom', '0')
});
//收起键盘
mui("body").on('tap', '#switch', function() {
    $('#keyboard').css('bottom', '-12rem')
});
var obj = {
    'taskName': 'close',
    'data': {
        'pageName': 'modify-pay-pwd'
    }
};
var jsonObj = JSON.stringify(obj);
mui("body").on('tap', '.btn-success', function() {
    if (oncePwd === twicePwd && twicePwd.length == 6) {
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/wallet/modifyPayPassword', {
            phone: phone,
            token: token + '_' + terminal,
            oldPayPassword: oldPwd,
            newPayPassword: oncePwd
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                mui.toast('密码修改成功');
                setTimeout(function() {
                    if (isWX) {
                        window.location.href = 'safe-center.html';
                    } else if (isAndroid) {
                        window.app.nativeHandler(jsonObj);
                    } else if (isiOS) {
                        window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
                    }
                }, 1000);
            } else {
                mui.toast(data.error);
            }
        }, 'json');
    } else {
        mui.toast('密码不一致')
    }
});
$(function() {

    pushHistory();
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        // if (pageId == 1) {
        //     window.location.href = 'reset-pay-pwd.html';
        // } else if (pageId == 2) {
        //     window.location.href = 'forget-pay-pwd.html';
        // }
        window.location.href = 'safe-center.html';
        // history.go(-1);
    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});