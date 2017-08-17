var from = sessionStorage.getItem('setPwd');

mui("body").on('tap', '.my-btn', function() {
    if (from == '3') {
        window.location.href = 'puhui-wallet.html';
    } else {
        window.location.href = 'puhui-pay.html';
    }
});

$(function() {
    pushHistory();

    window.addEventListener("popstate", function(e) {
        pushHistory();
        // mui.toast(isWX)

        window.location.href = 'convenient-pay.html'

        // alert("我监听到了浏览器的返回按钮事件啦"); //根据自己的需求实现自己的功能 
    }, false);

    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    }

});