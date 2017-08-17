mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        //下拉刷新
        down: {
            auto: true, //可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        //上拉加载
        // up: {
        //     contentrefresh: '正在加载...',
        //     contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
        //     callback: pullupRefresh
        // }
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
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        // pullRefresh('/puhuihua/wechat/userInfo/wordsList', data, type); //具体取数据的方法
    }, 1000);
}