/*
 * Created by Lihuan on 2017/1/10.
 */

//获取身份令牌
getToken(20);

//修改密码变量
var check = false; //验证密码格式是否通过变量
var check2 = false; //验证两次密码是否相同变量

//验证密码格式
$('.once-pwd').blur(function() {
    //控制密码位数
    if (!$(this).val().match(/^[a-zA-Z0-9_]{6,12}$/)) {
        mui.toast('请输入6-12位密码，英文、数字或下划线');
        check = false;
    } else {
        check = true;
        $('.my-btn-login').css({
            'border-color': "#EC2719",
            'background-color': '#EC2719'
        });
    }
});

//验证两次密码是否相同
$('.again-pwd').blur(function() {
    if ($('.again-pwd').val().trim() != '') {
        if ($('.again-pwd').val().trim() != $('.once-pwd').val().trim()) {
            mui.toast('密码不一致');
            check2 = false;
        } else {
            check2 = true;
        }
    }
});
var obj = {
    'taskName': 'close',
    'data': {
        'pageName': 'modify-pwd'
    }
};
var jsonObj = JSON.stringify(obj);
//确定修改密码
$('#modify-pwd').click(function() {
    $('input').blur();
    if (check && check2) {
        var pwd = $('.again-pwd').val();
        var oldPassword = $('.old-pwd').val();
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/userInfo/modifyPassword', {
            oldPassword: oldPassword,
            password: pwd,
            token: token + '_' + terminal
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                mui.toast('密码修改成功');
                setTimeout(function() {
                    window.location.href = 'personal.html';
                    // if (isWX) {
                    //     // window.location.href = 'personal.html';
                    //     // window.location.href = 'safe-center.html';
                    // } else if (isAndroid) {
                    //     window.app.nativeHandler(jsonObj);
                    // } else if (isiOS) {
                    //     window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
                    // }
                }, 1000);
            } else if (data.errorCode == 13) {
                mui.toast('旧密码错误，请重新输入')
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            }
        }, 'json');
    } else if (!check) {
        mui.toast('请输入6-12位密码，英文、数字或下划线');
    } else if (!check2) {
        mui.toast('密码不一致');
    }
});
$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        window.location.href = 'safe-center.html';

    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});