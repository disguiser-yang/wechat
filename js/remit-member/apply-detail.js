/**
 * Created by Administrator on 2017/2/22.
 */

//获取身份令牌
getToken(10);
//获取关键字
var searchKey = window.location.search;
var strs = searchKey.split("=");
var applicationId = strs[1].split("&")[0];
var applicationType = strs[2];

/*获取我的申请列表*/
mui.post('/puhuihua/wechat/userInfo/myApplicationDetails', {
        token: token + '_' + terminal,
        applicationId: applicationId,
        applicationType: applicationType
    },
    function(data) {
        if (data.success) {
            var dataJson = data.data;
            $('#apply-type').text(dataJson.applicationType);
            $('.title').text(dataJson.title);
            $('.create-time').text(dataJson.createTime);
            $('.check-status').text(dataJson.checkStatus);
            if (dataJson.remark) {
                $('.remark').text(dataJson.remark)
            }
        } else if (data.errorCode == 0) {
            mui.toast('网络开小差了');
        }
    }, 'json'
);


$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        // if (isWX) {
        window.location.href = 'my-apply.html';
        // } else if (isAndroid) {
        //     window.app.nativeHandler(jsonObj);
        // } else if (isiOS) {
        //     window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
        // }
    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});