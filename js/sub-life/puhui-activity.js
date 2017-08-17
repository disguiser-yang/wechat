/**
 * Created by Lihuan on 2017/2/13.
 */
var searchKey=window.location.search;
var strs=searchKey.split("=");
var districtId=strs[1];
if(!districtId){
	districtId=0;
}
//切换排列方式
$('body').on('tap','header>div',function(){
    $('header>div').removeClass('active');
    $(this).addClass('active');
    $('header>div').find('.arrow-icon').removeClass('icon-active');
    $(this).find('.arrow-icon').addClass('icon-active');
    if($($('aside').eq($(this).index())).css('display')=='block'){
    	$('aside').css('display','none');
    	$('header>div').removeClass('active');
		$('header>div').find('.arrow-icon').removeClass('icon-active');
    }else{
    	$('aside').css('display','none');
    	$('aside').eq($(this).index()).css('display','block');
    } 
});
$('body').on('tap','aside>div',function(){
    $(this).siblings().removeClass('active')
        .children('span').css('visibility','hidden');
    $(this).addClass('active').children('span').css('visibility','visible');
    $('aside').css('display','none');
    $('header>div').removeClass('active');
	$('header>div').find('.arrow-icon').removeClass('icon-active');
});
$('body').on('tap','.mui-scroll-wrapper',function(){
    $('aside').css('display','none')
});

/*获取频道*/
$.get('/puhuihua/wechat/activity/channelList', function(data){
        if(data.success){
            $.each(data.data,function(i,val) {
                $('#channel-wrap').append('<div id="' + val.channelId + '">' + val.name + '<span></span></div>');
            })
        }
    },'json'
);

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

var toList = function(dataObj,type) {
    mui.get('/puhuihua/wechat/activity/activityIssueList', dataObj,function(data){
        if(data.success){
            $.each(data.data,function(i,val){
                val.createTime=val.createTime.substr(0,10);
            });
            if(type==1){//上拉刷新
                /*下面这句很关键！*/
                mui('#pullrefresh').pullRefresh().refresh(true);//有重新触发上拉加载的需求（比如当前类别已无更多数据，但切换到另外一个类别后，应支持继续上拉加载）
                $('#content-list').html('');
                $('#list').tmpl(data.data).appendTo('#content-list');
            }
            if(type==2){//下拉加载
                $('#list').tmpl(data.data).appendTo('#content-list');
            }
            document.querySelector('#pullrefresh').removeAttribute('data-imagelazyload');
            //懒加载图片
            mui('#pullrefresh').imageLazyload({
                placeholder: '../../images/public/default2.png'
            });
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
        } else if(data.errorCode==1){
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        } else if(data.errorCode==0){
                mui.toast('网络开小差了')
        } else {
            mui.toast('网络开小差了');
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();//结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        }
    },'json')
};
var channelTyp=0;
var timeType=0;
function pulldownRefresh() {
    setTimeout(function() {
        count = 1;//刷新并显示第一页
        data={
            pageNo:count,
            channelType:channelTyp,
            timeType:timeType,
            districtId:districtId
        };
        type=1;//代表下拉刷新
        toList(data,type);//具体取数据的方法
    }, 100);
}

function pullupRefresh() {
    setTimeout(function() {
        count++;//翻下一页
        data={
            pageNo:count,
            channelType:channelTyp,
            timeType:timeType,
            districtId:districtId
        };
        type=2;//代表上拉加载
        toList(data,type);//具体取数据的方法
    }, 100);
}

if(mui.os.plus) {
    mui.plusReady(function() {
        setTimeout(function() {
            mui('#pullrefresh').pullRefresh().pulldownLoading();
        }, 1000);
    });
} else {
    mui.ready(function() {
        mui('#pullrefresh').pullRefresh().pulldownLoading();
    });
}
////按类型排序
$('body').on('tap','.type-option>div',function(){
    $('#content-list').html('');
    //请求后台
    count = 0;
    channelTyp=$(this).attr('id');
    mui('#pullrefresh').pullRefresh().refresh(true);
    mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    mui('#pullrefresh').pullRefresh().pullupLoading();
});

//按时间方式排序
$('body').on('tap','.time-option>div',function(){
    $('#content-list').html('');
    //请求后台
    count = 0;
    timeType=$(this).attr('id');
    mui('#pullrefresh').pullRefresh().refresh(true);
    mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    mui('#pullrefresh').pullRefresh().pullupLoading();
});

/*点击列表数据进入详情页*/
mui("#pullrefresh").on('tap', ".list",function() {
	if($('.type-option').css('display')=='block'||$('.time-option').css('display')=='block'){
		$('aside').css('display','none');
		$('header>div').removeClass('active');
		$('header>div').find('.arrow-icon').removeClass('icon-active');
	}else{
	    var issueId=$(this).attr('id');
	    window.location.href='activity-detail.html?issueId='+issueId;
	}
});

//操作回退的历史记录
back('puhui-activity')