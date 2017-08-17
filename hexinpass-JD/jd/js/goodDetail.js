$(function() {
    mui.init();

    //	$('#goodDetailId').height($(window).height()-55+'px');
    //	$('#goodDetailId').css('overflow', 'auto');
    //	
    // var sku = getQueryString('sku');
    // if (sku != null) {
    //     requestData(parseInt(sku));
    // }



});

function requestData(sku) {
    appui.showHUD();
    window.IO({
        url: 'getProductDetail',
        data: ts({
            'phone': getPhone(),
            'sku': sku
        }),
        success: function(data) {
            console.log(data);
            if (data.success == 1) {
                generateUI(data.results);
            }
            appui.removeHUD();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            appui.removeHUD(2, '网络开小差咯');
        }
    });
}

function addToCart() {
    appui.showHUD();
    var sku = q('#slide').getAttribute('sku');
    window.IO({
        url: 'addShoppingCart',
        data: ts({
            'phone': getPhone(),
            'sku': parseInt(sku),
            'num': 1,
            'cover': 0
        }),
        success: function(jsonStr) {
            var data = JSON.parse(jsonStr);
            console.log(data);
            if (data.success == 1) {
                appui.removeHUD();
                $('#cartBagedId').html(parseInt($('#cartBagedId').html()) + 1);
                $('#cartId').addClass('detail-cart-scale');
                setTimeout(function() {
                    $('#cartId').removeClass('detail-cart-scale');
                }, 500);
            } else {
                appui.removeHUD(2, '加入购物车失败，请稍后再试');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            appui.removeHUD(2, '网络开小差咯');
        }
    });
}

var backTopItem = null;
var swipeUpTouchend = false;

function generateUI_2(results) {
    //	var detail = results.detail;
    //	if (!results.detail.images) {
    //		results.detail.images = [{'path':results.detail.imagePath}];
    //	}
    //	_templatePage('#goodDetailId', 'goodDetailTemplateId', {detail:detail, bannerFirst:detail.images[0], bannerLast:detail.images[detail.images.length-1], imgbase:imgbase}, true);
    //	mui('#slider').slider({});
    //
    //	var ww = $(window).width();
    //	$('#param').html(detail.param);
    //	$('#billList').html(detail.wareQD);
    //	$('#billList img').css('height', 'auto');
    //	$('#appintroduce').html(detail.appintroduce);
    //	$('#appintroduce img').each(function(index,element){
    //		this.style.transform = 'translate(0, '+(-5.5)*index+'px)' ;
    //	});
    //	$('#introduction').html(detail.introduction);
    //	$('#cartBagedId').html(results.shoppingCartNum);
    //	$('img').width($(window).width()+'px');
    //	$('#billList img').width(ww-20+'px');
    //	$('img').height('auto');
    //	var paramTable = $('table');
    //	
    //	if (paramTable) {
    //		paramTable.attr('border', '1');
    //		paramTable.css('borderColor', '#999');
    //		paramTable.css('width','96%');
    //		paramTable.css('margin','5px auto');
    //		paramTable.css('background-color', 'white');
    //		paramTable.find('th.tdTitle').width(ww*0.1+'px');
    //		paramTable.find('tbody').width(ww*0.96+'px');
    //		paramTable.find('tr').width(ww*0.96+'px');
    //		paramTable.find('td').width(ww*0.84+'px');
    //		paramTable.find('td.tdTitle').width(ww*0.12+'px');
    //		paramTable.find('td').css('word-wrap', 'break-word');
    //		paramTable.find('td').css('word-break', 'break-all');
    //		paramTable.find('div').width('100%');
    //		paramTable.find('div').height('auto');
    //		paramTable.find('div').css('position', 'relative');
    //		paramTable.find('div').css('left', '0');
    //		paramTable.find('div').css('top', '0');
    //	}
    //	
    //	mui('body').on('tap', '#backTop', function(){
    //		$('#goodDetailId').animate({scrollTop:0}, 'slow');
    //	});
    //	
    //	backTopItem = $('#backTop');
    //	$('#goodDetailId').scroll(function(){
    //		if ($(this).scrollTop() > 800) {
    //			backTopItem.show();
    //		} else {
    //			backTopItem.hide();
    //		}
    //  });	

    mui('#cart1').on('tap', '.detail-toolbar-right', cartButtonTapped);
    mui('#cart1').on('tap', '.detail-toolbar-left', cartButtonTapped);

    window.appInterfaceReady(function() {
        if (detailData.stockStateId != 33 && detailData.stockStateId != 39 && detailData.stockStateId != 40) {
            var cartButton = document.querySelector('.detail-toolbar-right');
            cartButton.style.backgroundColor = 'gray';
            cartButton.innerHTML = '该商品库存不足';
            mui('#cart1').off('tap', '.detail-toolbar-right', cartButtonTapped);
        }
    });
}

function cartButtonTapped() {

    var item = this;
    //获取身份令牌
    getToken(28);

    function getToken(page) {

        var local = window.localStorage;
        var token = local.getItem('token');
        token = local.getItem('token');
        var searchKey = window.location.search;
        var isEnter = searchKey.split("=")[1];
        if (!token) {

            window.location.replace('../../../template/remit-member/login.html?enter=detail&sku=' + isEnter);
            sessionStorage.setItem('page', page);
        } else {

            $.post('/puhuihua/wechat/userInfo/validateToken', {
                token: token + '_' + terminal
            }, function(data) {
                if (!data.success) {

                    local.removeItem('token');
                    window.location.replace('../../../template/remit-member/login.html?enter=detail&sku=' + isEnter);
                    sessionStorage.setItem('page', page);
                } else {
                    if (item.className == 'detail-toolbar-right') {
                        addToCart();
                    } else {
                        window.location.replace('shopcart.html');
                    }
                    return;
                    // tabContent.contentWindow.location.replace('shopcart.html');
                }
            }, 'json');
        }
    }


    window.appInterfaceReady(function() {
        if (window.app) {
            if (window.app.isLogin()) {
                if (item.className == 'detail-toolbar-right') {
                    addToCart();
                } else {
                    window.location.replace('shopcart.html');
                }
                return;
            }
            if (getToken() == 'null' || !getToken() || getToken() == '') {
                window.IO({
                    url: 'getOpenPlatformToken',
                    success: function(data) {
                        if (data.success == 1) {
                            storeToken(data.results);
                            // get user phone
                            getNaviteData(item);
                        }
                    }
                })
            } else {
                getNaviteData(item);
            }
        }
    });
}

function getNaviteData(item) {
    appLoginGetData(getToken(), function(data) {
        if (data.success == 1) {
            var phone = data.results.tel;
            var openId = data.results.openId;
            storePhone(phone);
            storeOpenId(openId);
            getCartNumber();
            if (item.className == 'detail-toolbar-left') {
                window.location.href = 'shopcart.html';
            } else {
                //addToCart();
                appui.showHUD();
                window.IO({
                    url: 'getProductDetail',
                    data: ts({
                        'phone': getPhone(),
                        'sku': parseInt(getQueryString('sku'))
                    }),
                    success: function(jsonStr) {
                        var data = JSON.parse(jsonStr);
                        console.log(data);
                        if (data.success == 1) {
                            var stockId = data.results.detail.stockStateId;
                            if (stockId != 33 && stockId != 39 && stockId != 40) {
                                var cartButton = document.querySelector('.detail-toolbar-right');
                                cartButton.style.backgroundColor = 'gray';
                                cartButton.innerHTML = '该商品库存不足';
                                mui('.detail-toolbar').off('tap', '.detail-toolbar-right', cartButtonTapped);
                            } else {
                                appui.removeHUD();
                                addToCart();
                            }
                        }
                        appui.removeHUD();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        appui.removeHUD(2, '网络开小差咯');
                    }
                });
            }
        } else {
            mui.alert(data.msg);
        }
    });
}

function getCartNumber() {
    window.IO({
        url: 'getUserShoppingCartNum',
        data: ts({
            'phone': getPhone(),
        }),
        success: function(jsonStr) {
            var data = JSON.parse(jsonStr);
            console.log(data);
            if (data.success == 1) {
                $('#cartBagedId').html(data.results);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });
}