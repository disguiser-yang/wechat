/**
 * Created by Lihuan on 2017/2/17.
 */
$(function() {
    /*获取轮播图*/
    carouseList('/puhuihua/wechat/mall/carouselList');
    /*获取频道*/
    mui.get('/puhuihua/wechat/mall/mallIssueList', function(data) {
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
                    $('#channel-wrap' + num).append('<div class="mui-col-xs-4 channel" title="' + val.title + '" data-href="' + val.targetUrl + '">' +
                        '<div class="mui-table-view-cell">' +
                        '<a class="text-c a-box">' +
                        '<span class="icon-title">' +
                        '<img src="' + val.cover + '" class="img" />' +
                        '</span>' +
                        '<span>' + val.title + '</span>' +
                        '</a>' +
                        '</div>' +
                        '</div>')
                } else {
                    $('#channel-wrap').append('<div class="mui-col-xs-4 channel" title="' + val.title + '" data-href="' + val.targetUrl + '">' +
                        '<div class="mui-table-view-cell">' +
                        '<a class="text-c a-box">' +
                        '<span class="icon-title">' +
                        '<img src="' + val.cover + '" class="img" />' +
                        '</span>' +
                        '<span>' + val.title + '</span>' +
                        '</a>' +
                        '</div>' +
                        '</div>')
                }

            });
            var imgWidth = $('.a-box .icon-title>img').width();
            $('.a-box .icon-title>img').height(imgWidth);
        }
    }, 'json');

    var pageNo = 0;
    var currentLat, currentLon;
    var geolocation = new BMap.Geolocation();

    function pullupRefresh() {
        //定位
        geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                currentLat = r.point.lat;
                currentLon = r.point.lng;
                /*获取列表*/
                mui.post('/puhuihua/wechat/mall/nearbyPreferential', {
                        lng: currentLon,
                        lat: currentLat,
                        page: ++pageNo
                    },
                    function(data) {
                        $('#load').css('display', 'none');
                        if (data.success) {
                            $.each(data.data.data.merchantList, function(i, val) {
                                $('#content-list').append('<li class="mui-table-view-cell mui-media" id="' + val.merchantId + '" >' +
                                    '<a href="javascript:;">' +
                                    '<img class="mui-media-object mui-pull-left" data-lazyload="' + data.data.imagePrefix + val.img + '" />' +
                                    '<div class="mui-media-body">' +
                                    '<p class="mui-ellipsis">' + val.merchantName + '</p>' +
                                    '<span class="c-999">' + val.address + '</span>' +
                                    '</div>' +
                                    '</a>' +
                                    '</li>');
                            });
                            //懒加载图片
                            mui('#pullrefresh').imageLazyload({
                                placeholder: '../../images/public/default2.png'
                            });
                        } else if (data.errorCode == 0) {
                            mui.toast('网络开小差了')
                        } else if (data.errorCode == 19) {
                            mui.toast('网络开小差了')
                        }
                        // mui('#pullrefresh').pullRefresh().endPullupToRefresh(!data.success);
                    }, 'json'
                );
            } else {
                mui.toast('定位失败')
            }
        }, { enableHighAccuracy: true });
    }


    /*初始化获取列表*/
    pullupRefresh();
    /*初始化上拉加载*/
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            up: {
                contentrefresh: '正在加载...',
                callback: pullupRefresh

            }
        }
    });

    mui("#pullrefresh").on('tap', "#content-list li", function() {
        var merchantId = $(this).attr('id');
        window.location.href = 'nearby-stroe-detail.html?merchantId=' + merchantId
    });

    //链接到频道页面
    mui('body').on('tap', '.channel', function() {
        var linkHref = $(this).attr('data-href');
        var operator = $(this).attr('title');
        //var dataId=$(this).attr('data-id');
        var tabNum = local.getItem(operator);
        if (!tabNum) {
            mui.alert(operator + '由第三方服务提供', '提示', '是', function(e) {
                window.location.href = linkHref;
            });
        } else {
            window.location.href = linkHref;
        }
        local.setItem(operator, 1);
    });

    //轮播图链接
    mui('body').on('tap', '.mui-slider-item', function() {
        var linkHref = $(this).children().attr('href');
        window.location.href = linkHref;
    });
});