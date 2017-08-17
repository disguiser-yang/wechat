getToken1(27);
var phone = local.getItem('phone');
var token = local.getItem('token');
var searchKey = window.location.search;
var img = searchKey.split("=")[1];

function getToken1(page) {
    token = local.getItem('token');
    sessionStorage.setItem('page', page);
    if (!token) {
        window.location.replace('../../template/remit-member/login.html?enter=questionnaire');
    } else {
        $.post('/puhuihua/wechat/userInfo/validateToken', {
            token: token + '_' + terminal
        }, function(data) {
            if (!data.success) {
                local.removeItem('token');
                sessionStorage.setItem('page', page);
                window.location.replace('../../template/remit-member/login.html?enter=questionnaire');
            } else {
                //  sessionStorage.setItem('close', 'yes');
                //  var phone = local.getItem('phone');
                //  var token = local.getItem('token');
                //  window.location.replace(activityPage + '?phone=' + phone + '&token=' + token + '_wechat');
            }
        }, 'json');
    }
}


mui('body').on('tap', '.main-content-tip-btn-a', function() {
    window.location.replace(coupon);

});

$('.main-content-tip-img img').attr("src", local.getItem('couponimage'));


// getQuestionnaire();
// 判断是否答题
function getQuestionnaire() {

    $.post(questionBaseUrl + '/getQuestionnaire', JSON.stringify({ "token": token + '_' + terminal, "phone": phone }), function(data) {
        if (data.success == 0) {
            window.location.replace('./index.html')
        } else {}

    }, 'json');
}