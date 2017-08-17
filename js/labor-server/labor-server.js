/**
 * Created by lihuan on 2017/1/5.
 */

/*获取轮播图*/
carouseList('/puhuihua/wechat/mutual/carouselList');

/*初始化返回给后台的值*/
var pageNo = 0;

function objPrama() {
    var obj = {
        'pageNo': 1
    };
    return obj;
}
/*初始化获取列表*/
initGetHotIssue('/puhuihua/wechat/hot/hotIssueList', objPrama(), 2);
initGetStaffMien('/puhuihua/wechat/demeanour/demeanourIssueList', { pageNo: 1, channelType: 1 });
initGetStaffMien('/puhuihua/wechat/demeanour/demeanourIssueList', { pageNo: 1, channelType: 2 });
initGetStaffMien('/puhuihua/wechat/demeanour/demeanourIssueList', { pageNo: 1, channelType: 3 });
initGetStaffMien('/puhuihua/wechat/demeanour/demeanourIssueList', { pageNo: 1, channelType: 9 });

/*获取热点资讯列表前lenght条*/
function initGetHotIssue(url, prama, length) {
    mui.get(url, prama,
        function(data) {
            //$('#load').css('display','none');
            if (data.success) {
                var dataJsonOld = data.data;

                var dataJson = [];
                for (i = 0; i < length; i++) {
                    dataJson.push(dataJsonOld[i])
                }
                $.each(dataJson, function(i, val) {
                    val.createTime = val.createTime.substr(0, 10);
                });
                $('#list-hot').tmpl(dataJson).appendTo('#content-list');
                //懒加载图片
                // mui('#pullrefresh').imageLazyload({
                //     placeholder: '../../images/public/default2.png'
                // });
            }
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
        }, 'json'
    );
}

/*获取职工风采每个类目列表前一条*/
function initGetStaffMien(url, prama) {

    mui.get(url, prama,
        function(data) {
            //$('#load').css('display','none');

            if (data.success) {
                var dataJsonOld = data.data;

                // 截取前一条
                var dataJson = [];
                dataJson.push(dataJsonOld[0])
                $.each(dataJson, function(i, val) {
                    val.createTime = val.createTime.substr(0, 10);
                });
                $('#list-staff').tmpl(dataJson).appendTo('#content-list-staff');
                //懒加载图片
                // mui('#pullrefresh').imageLazyload({
                //     placeholder: '../../images/public/default2.png'
                // });
            }
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
        }, 'json'
    );
}


//链接我要入会页
mui('body').on('tap', '#enter-apply-agreement', function() {
    window.location.href = '../remit-member/enter-apply-agreement.html'
});
//链接绑定会员卡页
mui('body').on('tap', '#bank-card', function() {
    window.location.href = '../remit-member/bind-vip.html'
});
//链接互助保障页
mui('body').on('tap', '#assistance-safeguard', function() {
    window.location.href = 'assistance-safeguard.html'
});
//链接素质提升页
mui('body').on('tap', '#quality-promotion', function() {
    window.location.href = 'quality-promotion.html'
});
//链接法律服务页
mui('body').on('tap', '#law-consult', function() {
    window.location.href = 'law-server.html'
});
//链接心理减压页
mui('body').on('tap', '#mentality-decompress', function() {
    window.location.href = '../sub-life/mentality-decompress.html'
});

//链接热点资讯更多页
mui('body').on('tap', '#hot-issue-title-more', function() {
    window.location.href = '../sub-life/hot-issue.html'
});

//链接职工风采更多页
mui('body').on('tap', '#staff-mien-title-more', function() {
    window.location.href = '../labor-server/staff-mien.html'
});

//轮播图链接
mui('body').on('tap', '.mui-slider-item', function() {
    var linkHref = $(this).children().attr('href');
    window.location.href = linkHref;
});

/*点击列表数据进入热门资讯详情页*/
// tabList('../sub-life/hot-issue-detail');

mui("#pullrefresh").on('tap', ".list-hot", function() {
    var issueId = $(this).attr('id');
    var issueType = $(this).attr('data-issueType');
    window.location.href = '../sub-life/hot-issue-detail.html?issueId=' + issueId + '&&issueType=' + issueType
});

/*点击列表数据进入员工风采详情*/
mui("body").on('tap', ".list-staff", function() {
    var issueId = $(this).attr('id');
    window.location.href = 'staff-mien-detail.html?issueId=' + issueId
});
back('labor-server')