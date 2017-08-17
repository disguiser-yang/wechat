/**
 * Created by Administrator on 2017/2/10.
 */

/*获取轮播图*/
carouseList('/puhuihua/wechat/legal/carouselList');

/*初始化返回给后台的值*/
var pageNo=0;
function objPrama(){
    var obj={
        'pageNo':++pageNo
    };
    return obj
}

/*初始化获取列表*/
pullupRefresh('/puhuihua/wechat/legal/legalIssueList',objPrama());
/*初始化上拉加载*/
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentrefresh: '正在加载...',
            callback: function(){
                pullupRefresh('/puhuihua/wechat/legal/legalIssueList',objPrama())
            }
        }
    }
});

//链接普法宣传页
mui('body').on('tap','#law-publicity',function(){
    window.location.href='law-publicity-list.html'
});
//链接法律咨询页
mui('body').on('tap','#law-consult',function(){
    window.location.href='law-consult.html'
});
//链接援助申请页
mui('body').on('tap','#law-aid',function(){
    window.location.href='aid-apply.html'
});

//轮播图链接
mui('body').on('tap','.mui-slider-item',function(){
    var linkHref=$(this).children().attr('href');
    window.location.href=linkHref;
});

/*点击列表数据进入详情页*/
tabList('law-publicity-detail');