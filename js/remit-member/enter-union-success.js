/**
 * Created by lihuan on 2017/4/5.
 */

var searchKey = window.location.search;
var strs = searchKey.split("=");
var obj = {
    'taskName': 'close',
    'data': {
        'pageName': 'puhui-activity'
    }
};
var jsonObj = JSON.stringify(obj);
if (strs[1] == 1) {
    document.title = '认证成功';
    document.querySelector('.hint-success').innerText = '认证成功';
    document.querySelector('#btn-success').innerText = '绑定会员卡';

    //留言绑定会员卡
    mui("body").on('tap', '#btn-success', function() {
        window.location.href = 'bind-vip.html';
    });
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        window.location.href = "../labor-server/labor-server.html"
    }, false);
} else if (strs[1] == 2) {
    document.title = '绑卡成功';
    document.querySelector('.hint-success').innerText = '绑卡成功';
    document.querySelector('#btn-success').innerText = '完 成';

    //绑卡成功跳到个人中心页
    mui("body").on('tap', '#btn-success', function() {
        //window.location.href='personal-center.html';
        if (isWX) {
            WeixinJSBridge.call('closeWindow');
        } else if (isAndroid) {
            window.app.nativeHandler(jsonObj);
        } else if (isiOS) {
            window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
        }
    });
    back('puhui-activity')
} else if (strs[1] == 3) {
    document.title = '申请成功';
    document.querySelector('.hint-success').innerText = '申请成功，请等待审核';
    document.querySelector('#btn-success').innerText = '完 成';

    //申请成功跳到我的申请页
    mui("body").on('tap', '#btn-success', function() {
        window.location.href = 'my-apply.html';
    });
}

function pushHistory() {
    window.history.pushState('', "title", "");
}