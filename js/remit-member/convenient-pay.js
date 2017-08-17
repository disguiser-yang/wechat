// mui("body").on('tap', '#skip', function() {
//     window.location.href = 'open-puhuiwallet-success.html';
// });

mui("body").on('tap', '#btn-convenient-pay', function() {
    window.location.href = 'bind-bankCard.html';
});

sessionStorage.setItem('entry', 'convenient');


$(function() {
    pushHistory();

    window.addEventListener("popstate", function(e) {
        pushHistory();
        // mui.toast(isWX)

        window.location.href = 'set-pay-pwd.html'

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