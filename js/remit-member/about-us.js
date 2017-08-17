mui("body").on('tap', '#link-platform-introduce', function() {
    window.location.href = "platform-introduce.html"
});
mui("body").on('tap', '#link-service-provider-introduce', function() {
    window.location.href = "service-provider-introduce.html"
});
mui("body").on('tap', '#link-sunshine-welfare-introduce', function() {
    window.location.href = "sunshine-welfare-introduce.html"
});

$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        var from = window.sessionStorage.getItem('from');
        if (from == 'puhuipay') {
            window.sessionStorage.removeItem('from');
            window.location.href = 'puhui-pay.html';
        } else {
            window.location.replace('personal.html');
        }

    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});