/**
 * Created by Lihuan on 2017/1/10.
 */
var searchKey=window.location.search;
var strs=searchKey.split("=");
var districtId=strs[1];
if(!districtId){
	districtId=0;
}
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        down: {//下拉刷新
            auto:true,//可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        up: {//上拉加载
            //auto:true,//可选,默认false.自动上拉加载一次
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
            districtId:districtId
        };
        type=1;//代表下拉刷新
        toList('/puhuihua/wechat/dynamic/dynamicIssueList',data,type);//具体取数据的方法
    }, 100);
}

function pullupRefresh() {
    setTimeout(function() {
        count++;//翻下一页
        data={
            pageNo:count,
            districtId:districtId
        };
        type=2;//代表上拉加载
        toList('/puhuihua/wechat/dynamic/dynamicIssueList',data,type);//具体取数据的方法
    }, 100);
}
/*点击列表数据进入详情页*/
mui("#pullrefresh").on('tap', ".list",function() {
    var issueId=$(this).attr('id');
    window.location.href='dynamic-issue-detail.html?issueId='+issueId
});