/**
 * Created by Lihuan on 2017/2/6.
 */
//获取身份令牌
getToken(6);
mui("body").on('tap', '.my-btn', function() {
    $('input').blur();
    var nickName = document.body.querySelector('.nickname').value;
    if (nickName) {
        mui.post('/puhuihua/wechat/userInfo/modifyNickname', {
            token: token + '_' + terminal,
            nickname: nickName
        }, function(data) {
            if (data.success) {
                mui.toast('修改昵称成功');
                setTimeout(function() {
                    window.location.href = 'personal-center.html'
                }, 1000);
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            }
        }, 'json');
    } else {
        mui.toast('请输入昵称')
    }
});

$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        window.location.href = 'personal-center.html';
    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});