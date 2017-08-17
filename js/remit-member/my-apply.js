/**
 * Created by Administrator on 2017/2/24.
 */
//获取身份令牌
getToken(10);

var pageNo = 0;
/*初始化上拉加载*/
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentrefresh: '正在加载...',
            callback: pullupRefresh
        }
    }
});

pullupRefresh();

function pullupRefresh() {
    /*获取我的申请列表*/
    mui.post('/puhuihua/wechat/userInfo/myApplication', {
            token: token + '_' + terminal,
            pageNo: ++pageNo
        },
        function(data) {
            $('#load').css('display', 'none');
            if (data.success) {
                $.each(data.data, function(i, val) {
                    val.createTime = val.createTime.substr(0, 10);
                });
                $('#list').tmpl(data.data).appendTo('form');
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了');
            } else if (!$('form').html()) {
                $('#none').css('display', 'block');
            }
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
        }, 'json'
    );
}

/*点击列表数据进入详情页*/
mui("body").on('tap', ".list", function() {
    var applicationId = $(this).attr('id');
    var applicationType = $(this).find('.application-type').attr('id');
    window.location.href = 'apply-detail.html?applicationId=' + applicationId + '&applicationType=' + applicationType;
});

//操作回退的历史记录
// back('my-apply')

$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        if (isWX) {
            window.location.href = 'personal.html';
        } else if (isAndroid) {
            window.app.nativeHandler(jsonObj);
        } else if (isiOS) {
            window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
        }
    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});