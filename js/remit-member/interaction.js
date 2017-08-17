/**
 * Created by Lihuan on 2017/1/10.
 */

//获取身份令牌
getToken(0);

//跳转到留言页
mui("body").on('tap', '#to-leave-wards', function() {
    window.location.href = 'interaction-leave-words.html'
});

function pullRefresh(url, prama, type) {
    //获取留言表
    mui.post(url, prama, function(data) {
        if (data.success) {
            var dataJson = data.data;
            $.each(dataJson, function(i, val) {
                if (!val.headImage) {
                    val.headImage = 'static/wechat/images/public/headImg.png';
                }
                if (!val.feedback) {
                    val.className = 'remove'
                } else {
                    val.className = ''
                }
            });
            //上拉刷新
            if (type == 1) {
                /*下面这句很关键！*/
                mui('#pullrefresh').pullRefresh().refresh(true); //有重新触发上拉加载的需求（比如当前类别已无更多数据，但切换到另外一个类别后，应支持继续上拉加载）
                $('#content-list').html('');
                $('#list').tmpl(dataJson).appendTo('#content-list')
            }
            //下拉加载
            if (type == 2) {
                $('#list').tmpl(dataJson).appendTo('#content-list')
            }
            document.querySelector('#pullrefresh').removeAttribute('data-imagelazyload');
            //懒加载图片
            mui('#pullrefresh').imageLazyload({
                placeholder: '../../images/public/headImg.png'
            });
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
        } else if (data.errorCode == 1) {
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        } else if (data.errorCode == 0) {
            mui.toast('网络开小差了');
        } else {
            mui.toast('网络开小差了');
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        }
    }, 'json');
}
/*初始化上拉加载*/
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        //下拉刷新
        down: {
            auto: true, //可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        //上拉加载
        up: {
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: pullupRefresh
        }
    }
});

function pulldownRefresh() {
    setTimeout(function() {
        count = 1; //刷新并显示第一页
        data = {
            token: token + '_' + terminal,
            pageNo: count
        };
        type = 1; //代表下拉刷新
        pullRefresh('/puhuihua/wechat/userInfo/wordsList', data, type); //具体取数据的方法
    }, 100);
}

function pullupRefresh() {
    setTimeout(function() {
        count++; //翻下一页
        data = {
            token: token + '_' + terminal,
            pageNo: count
        };
        type = 2; //代表上拉加载
        pullRefresh('/puhuihua/wechat/userInfo/wordsList', data, type); //具体取数据的方法
    }, 100);
}

//操作回退的历史记录
// back('interaction');

$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        window.location.href = "personal.html";
        // if (isWX) {
        //     window.location.href = 'personal.html';
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