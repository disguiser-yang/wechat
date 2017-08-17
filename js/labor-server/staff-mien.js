mui.init();
//职工风获取频道
mui.get('/puhuihua/wechat/demeanour/channelList', function(data) {
    var dataJson = data.data;
    var channelId = dataJson[0].channelId;
    var windowWidth = parseInt($(window).width());
    var num = null;
    if (dataJson.length <= 4) {
        num = windowWidth / dataJson.length;
        $('#slider .mui-segmented-control.mui-scroll-wrapper .mui-scroll').css('width', 'inherit');

    } else {
        num = windowWidth / 4;
        $('#slider .mui-segmented-control.mui-scroll-wrapper .mui-scroll').css('width', 'auto');
    }
    $.each(dataJson, function(item, val) {
        if (item == 0) {
            val.classNameActive = 'mui-active';
        } else {
            val.classNameActive = ''
        }
    });
    var channelHtml = [];
    var contentHtml = [];
    $.each(dataJson, function(i, val) {
        channelHtml.push('<a class="mui-control-item ' + val.classNameActive + '" href="#item' + val.channelId + 'mobile" id="' + val.channelId + '"><input type="hidden" value="1" />' + val.name + '</a>');
        contentHtml.push(
            '<div id="item' + val.channelId + 'mobile" class="mui-slider-item mui-control-content ' + val.classNameActive + '">' +
            '<div id="scroll" class="mui-scroll-wrapper">' +
            '<div class="mui-scroll">' +
            '<ul class="mui-table-view">' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>'
        )
    });
    $('#tab-row').html(channelHtml.join(''));
    $('.mui-slider-group').html(contentHtml.join(''));
    $('.mui-segmented-control.mui-scroll-wrapper .mui-control-item').css('width', num + 'px');
    pullRefresh(mui, window, document);

    //加载touchstart事件
    mui.trigger(btn, 'touchstart');
    (function(m) {
        //阻尼系数
        var deceleration = mui.os.ios ? 0.003 : 0.0009;
        m('.mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: true, //是否显示滚动条
            deceleration: deceleration
        });
        m.ready(function() {
            //循环初始化所有下拉刷新，上拉加载。
            m.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
                m(pullRefreshEl).pullToRefresh({
                    up: {
                        callback: function() {
                            var self = this;
                            setTimeout(function() {
                                var ul = self.element.querySelector('.mui-table-view');
                                createFragment(self, ul, index, 5);
                                self.endPullUpToRefresh();
                            }, 1000);
                        }
                    }
                });
            });

            var createFragment = function(x, ul, index, count, reverse) {
                var $this = $('#tab-row').children('a').eq(index)
                var channelId = $this.attr('id');
                var pageNo = parseInt($this.find('input:hidden').val());

                /*获取列表*/
                mui.get('/puhuihua/wechat/demeanour/demeanourIssueList', {
                        pageNo: pageNo,
                        channelType: channelId
                    },
                    function(data) {
                        if (data.success) {
                            var dataJson = data.data;
                            $this.find('input:hidden').val(parseInt($this.find('input:hidden').val()) + 1)
                            $('#list').tmpl(dataJson).appendTo(ul);
                            ul.removeAttribute('data-imagelazyload');
                            //懒加载图片
                            mui('.mui-table-view').imageLazyload({
                                placeholder: '../../images/public/default2.png'
                            });
                        } else {
                            x.endPullUpToRefresh(!data.success);
                        }
                    }, 'json'
                );
            };
        });
    })(mui);
}, 'json');
/*进入列表详情*/
mui("body").on('tap', ".list", function() {
    var issueId = $(this).attr('id');
    window.location.href = 'staff-mien-detail.html?issueId=' + issueId
});

function sleep(milliSeconds) {
    var startTime = new Date().getTime(); // get the current time
    while (new Date().getTime() < startTime + milliSeconds);
}
var btn = document.body.querySelector("#sliderSegmentedControl");
var init = true;
btn.addEventListener("touchstart", function() {
    if (init == true) {
        sleep(500)
    }
    init = false;
});