/**
 * Created by Lihaun on 2017/2/14.
 */

/*获取轮播图*/
carouseList('/puhuihua/wechat/promotion/carouselList');

/*获取频道*/
mui.get('/puhuihua/wechat/promotion/channelList', function(data) {
    if (data.success) {
        var dataJson = data.data;
        $.each(dataJson, function(i, val) {
            var num = parseInt(i / 3);
            if (!(i % 3)) {
                if (num) {
                    $('#channel-total-wrap').append('<div id="channel-wrap' + num + '" class="mui-row"></div>');
                }
            }
            if (num) {
                $('#channel-wrap' + num).append('<div class="mui-col-xs-4 channel" id="' + val.channelId + '" title="' + val.name + '">' +
                    '<div class="mui-table-view-cell">' +
                    '<a class="text-c a-box">' +
                    '<span class="icon-title">' +
                    '<img src="' + val.cover + '" class="img" />' +
                    '</span>' +
                    '<span>' + val.name + '</span>' +
                    '</a>' +
                    '</div>' +
                    '</div>')
            } else {
                $('#channel-wrap').append('<div class="mui-col-xs-4 channel" id="' + val.channelId + '" title="' + val.name + '">' +
                    '<div class="mui-table-view-cell">' +
                    '<a class="text-c a-box">' +
                    '<span class="icon-title">' +
                    '<img src="' + val.cover + '" class="img" />' +
                    '</span>' +
                    '<span>' + val.name + '</span>' +
                    '</a>' +
                    '</div>' +
                    '</div>')
            }

        });
        var imgWidth = $('.a-box .icon-title>img').width();
        $('.a-box .icon-title>img').height(imgWidth);
    }
}, 'json');
mui("body").on('tap', ".channel", function() {
    var channelType = $(this).attr('id');
    var title = $(this).attr('title');
    window.location.href = 'quality-promotion-list.html?channelType=' + channelType + '&title=' + title
});

/*初始化返回给后台的值*/
var pageNo = 0;

function objPrama() {
    var obj = {
        'pageNo': ++pageNo
    };
    return obj;
}


/*初始化获取列表*/
pullupRefresh('/puhuihua/wechat/promotion/promotionIssueList', objPrama());
/*初始化上拉加载*/
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentrefresh: '正在加载...',
            callback: function() {
                pullupRefresh('/puhuihua/wechat/promotion/promotionIssueList', objPrama())
            }
        }
    }
});

//轮播图链接
mui('body').on('tap', '.mui-slider-item', function() {
    var linkHref = $(this).children().attr('href');
    window.location.href = linkHref;
});

/*点击列表数据进入详情页*/
tabList('quality-promotion-list-detail');



$(function() {
    pushHistory();
    window.addEventListener("popstate", function() {

        window.location.replace('../labor-server/labor-server.html');
    }, false);

    function pushHistory() {
        var state = {
            title: "title",
            url: " "
        };
        window.history.pushState(state, "title", " ");
    }

});