/**
 * Created by Lihuan on 2017/1/10.
 */
//获取身份令牌
//getToken(1);
$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        // alert("我监听到了浏览器的返回按钮事件啦"); //根据自己的需求实现自己的功能
        window.location.href = 'interaction.html'
    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "#");
    }

});

//留言成功跳到留言详情页
$(document).on('click', '#btn-success', function() {
    window.location.href = 'interaction.html';
});

//留言失败跳到留言页
$(document).on('click', '#btn-fail', function() {
    window.location.href = 'interaction-leave-words.html';
});