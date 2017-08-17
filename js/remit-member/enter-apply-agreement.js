/**
 * Created by Administrator on 2017/2/23.
 */
//获取身份令牌
getToken(9);

var check = true;
$('input:checkbox').click(function() {
    if ($('input:checkbox').is(':checked')) {
        $('#btn-success').css({
            'border-color': "#EC2719",
            'background-color': '#EC2719'
        });
        check = true;
    } else {
        $('#btn-success').css({
            'border-color': "#ccc",
            'background-color': '#ccc'
        });
        check = false;
    }
});
mui("body").on('tap', "#btn-success", function() {
    if (check) {
        window.location.href = 'enter-union-applied.html';
    } else {
        mui.toast('请阅读并同意入会协议');
    }
});