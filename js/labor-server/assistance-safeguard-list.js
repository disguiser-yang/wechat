/**
 * Created by lihuan on 2017/1/5.
 */

/*获取连接传来的值*/
var searchKey=window.location.search;
var strs=searchKey.split("=");
var issueId=strs[1];
if(issueId==1){
    document.title='工作动态'
}
else if(issueId==2){
    document.title='政策宣传'
}

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        //下拉刷新
        down: {
            auto:true,//可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        //上拉加载
        up: {
            contentrefresh: '正在加载...',
            contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: pullupRefresh
        }
    }
});

function pulldownRefresh() {
    setTimeout(function() {
        count = 1;//刷新并显示第一页
        data={
            pageNo:count,
            issueType:strs[1]
        };
        type=1;//代表下拉刷新
        toList('/puhuihua/wechat/mutual/mutualIssueList',data,type);//具体取数据的方法
    }, 100);
}

function pullupRefresh() {
    setTimeout(function() {
        count++;//翻下一页
        data={
            pageNo:count,
            issueType:strs[1]
        };
        type=2;//代表上拉加载
        toList('/puhuihua/wechat/mutual/mutualIssueList',data,type);//具体取数据的方法
    }, 100);
}

/*点击列表数据进入详情页*/
tabList('assistance-safeguard-list-detail');