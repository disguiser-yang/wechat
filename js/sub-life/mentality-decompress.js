/**
 * Created by Administrator on 2017/2/10.
 */

/*获取轮播图*/
carouseList('/puhuihua/wechat/psychology/carouselList');

/*初始化返回给后台的值*/
var pageNo=0;
function objPrama(){
    var obj={
        'pageNo':++pageNo
    };
    return obj
}

/*初始化获取列表*/
pullupRefresh('/puhuihua/wechat/psychology/psychologyIssueList',objPrama());
/*初始化上拉加载*/
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentrefresh: '正在加载...',
            callback: function(){
                pullupRefresh('/puhuihua/wechat/psychology/psychologyIssueList',objPrama())
            }

        }
    }
});

//链接心理测试列表
mui("#mui-content").on('tap', ".mentality-test",function() {
    window.location.href='mentality-test-list.html'
});
//链接心理咨询
mui("#mui-content").on('tap', ".mentality-consult",function() {
    window.location.href='mentality-consult.html'
});

//心理热线
mui("#mui-content").on('tap', ".mentality-hotline",function() {
    mui.get('/puhuihua/wechat/psychology/psychologyHotline',
        function(data){
            if(data.success){
            	window.location.href='tel:'+data.data;
            }else if(data.errorCode==30){
                mui.toast('服务暂未开通')
            }else if(data.errorCode==0){
                mui.toast('网络开小差了')
            }
        },'json'
    );
});

//轮播图链接
mui('body').on('tap','.mui-slider-item',function(){
    var linkHref=$(this).children().attr('href');
    window.location.href=linkHref;
});

/*跳到详情页*/
tabList('mentality-test-detail');