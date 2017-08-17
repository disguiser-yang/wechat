/**
 * Created by Administrator on 2017/1/10.
 */
//获取身份令牌
getToken(5);
var check = true;
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

mui("body").on('tap', '.my-btn', function() {
    $('input').blur();
    if (check) {
        var money = $('input:text').val().trim();
        if (money.match(/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/)) {
            $('#tip').css('display', 'block');
            var amount = money * 100;
            mui.post('/puhuihua/wechat/userInfo/rechargePrepare', {
                token: token + '_' + terminal,
                amount: amount
            }, function(data) {
                $('#tip').css('display', 'none');
                if (data.success) {
                    window.location.href = data.data;
                } else if (data.errorCode == 8) {
                    mui.alert('身份验证出错' + '<br/>' + '前去登录', '提示', '是', function(e) {
                        window.location.href = 'login.html';
                        sessionStorage.setItem('page', 17);
                    })
                } else if (data.errorCode == 0) {
                    mui.toast('网络开小差了')
                }
            }, 'json');
        } else {
            mui.toast('请输入正确的金额')
        }
    }
});

//跳转到《天府普惠充值服务协议》
mui('body').on('tap', '.recharge-agreement', function() {
    window.location.href = 'recharge-agreement.html'
});


back2('recharge.html')