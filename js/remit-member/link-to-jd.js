getToken1(27);

function getToken1(page) {
    token = local.getItem('token');
    sessionStorage.setItem('page', page);
    if (!token) {
        window.location.replace('login.html?enter=jd');
    } else {
        $.post('/puhuihua/wechat/userInfo/validateToken', {
            token: token + '_' + terminal
        }, function(data) {
            if (!data.success) {
                // mui.toast('123')
                local.removeItem('token');
                sessionStorage.setItem('page', page);
                window.location.replace('login.html?enter=jd');
            } else {
                var phone = local.getItem('phone');
                window.location.replace(jdIndex + '?phone=' + phone + '&channel=2');
            }
        }, 'json');
    }
}