/**
 * Created by Lihuan on 2017/2/20.
 */
var searchKey = window.location.search;
var strs = searchKey.split("=");
var hrefLink = null;
var geolocation = new BMap.Geolocation();
geolocation.getCurrentPosition(function(r) {
    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        var currentLat = r.point.lat;
        var currentLon = r.point.lng;
        $.post('/puhuihua/wechat/mall/getByMerchantId', {
            lng: currentLon,
            lat: currentLat,
            merchantId: strs[1]
        }, function(data) {
            $('#load').css('display', 'none')
            var dataJson = data.data.data.merchantList;
            var shoppingAreas = "";
            $.each(dataJson, function(i, val) {
                if (val.shoppingAreas.indexOf(',') != -1 || val.shoppingAreas.indexOf('/') != -1) {
                    var areasArry = val.shoppingAreas.split(/[,/]/);
                    shoppingAreas = areasArry[0] + '/' + areasArry[1]
                } else {
                    shoppingAreas = val.shoppingAreas;
                }
                document.title = val.merchantName;
                $('.line-box').append(' <div class="mui-row">' +
                    '<div class="mui-col-xs-4 pic">' +
                    '<img class="mui-media-object mui-pull-left" src="' + data.data.imagePrefix + val.img + '" />' +
                    '</div>' +
                    '<div class="mui-col-xs-8 infor">' +
                    '<div class="mui-ellipsis">' + val.merchantName + '</div>' +
                    '<p>' +
                    '<span  class="mr-1">' + val.typeName + '</span><span  class="mr-1">' + shoppingAreas + '</span><span>' + val.distance + 'm</span>' +
                    '</p>' +
                    '</div>' +
                    '</div>');
                if (val.address) {
                    $('.detail-address').text(val.address);
                    hrefLink = 'http://api.map.baidu.com/marker?location=' + val.latitude + ',' + val.longitude + '&title=' + val.merchantName + '&content=' + val.address + '&output=html';
                } else {
                    $('#address').css('display', 'none')
                }
                if (val.telephone) {
                    $('.tel-phone').attr('href', 'tel:' + val.telephone);
                    $('.tel-phone').text(val.telephone);
                } else {
                    $('.tel-phone').css('display', 'none')
                }
            });
        }, 'json');
    } else {
        mui.toast('定位失败');
    }
}, { enableHighAccuracy: true });

mui("body").on('tap', ".pay-btn", function() {
    hasPayPassword('../remit-member/puhui-pay.html', 4, '../remit-member/set-pay-pwd')
});
mui("body").on('tap', "#address", function() {
    if (hrefLink) {
        window.location.href = hrefLink;
    }
});