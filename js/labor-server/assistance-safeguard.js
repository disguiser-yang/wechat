/**
 * Created by lihuan on 2017/1/5.
 */

/*获取轮播图*/
carouseList('/puhuihua/wechat/mutual/carouselList');

/*初始化返回给后台的值*/
var pageNo=0;
function objPrama(){
    var obj={
        'pageNo':++pageNo
    };
    return obj;
}

/*初始化获取列表*/
pullupRefresh('/puhuihua/wechat/mutual/mutualIssueList',objPrama());
/*初始化上拉加载*/
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentrefresh: '正在加载...',
            callback: function(){
                pullupRefresh('/puhuihua/wechat/mutual/mutualIssueList',objPrama())
            }
        }
    }
});

//链接工作动态态页
mui('body').on('tap','#working-dynamic',function(){
    window.location.href='assistance-safeguard-list.html?issueType=1'
});
//链接政策宣传页
mui('body').on('tap','#policy-publicity',function(){
    window.location.href='assistance-safeguard-list.html?issueType=2'
});
//链接参保查询页
mui('body').on('tap','#insured-query',function(){
    window.location.href='insurance-inquire.html'
});

//轮播图链接
mui('body').on('tap','.mui-slider-item',function(){
    var linkHref=$(this).children().attr('href');
    window.location.href=linkHref;
});

/*点击列表数据进入详情页*/
tabList('assistance-safeguard-list-detail');