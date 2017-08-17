$(function() {
    mui.init();

    lastSelectItem = $('.mui-tab-item').get(0);
    mui('body').on('tap', '.mui-tab-item', function() {
        tabItemTapped(this, document.querySelector('#tabContent'));
    });
    document.querySelector('#tabContent').contentWindow.location.replace('home.html?v=' + new Date().getTime());

    // requestToken();
    // appui.showHUD();
    // var local = window.localStorage;
    // localStorage.setItem('loginFrom', 'order');
    // console.log('456')
    // var loginFrom = local.getItem('loginFrom');
    // if (loginFrom == 'shopcart') {

    tabContent.contentWindow.location.replace('shopcart.html');
    // } else if (loginFrom == 'order') {
    //     tabContent.contentWindow.location.replace('order.html');
    // }
    // local.removeItem('loginFrom');
});

var lastSelectItem = null;

function tabItemTapped(tapItem, tabContent) {
    var index = parseInt(tapItem.getAttribute('index'));
    switch (index) {
        case 0: // home page tab
            $(lastSelectItem).removeClass('mui-active');
            $(tapItem).addClass('mui-active');
            lastSelectItem = tapItem;
            tabContent.contentWindow.location.replace('home.html');
            setIndex(0);
            break;
        case 1: // category tab
            $(lastSelectItem).removeClass('mui-active');
            $(tapItem).addClass('mui-active');
            lastSelectItem = tapItem;
            tabContent.contentWindow.location.replace('category.html');
            setIndex(1);
            break;
        case 2: // shopping cart tab
            // getToken(27, tabContent.contentWindow.location)
            tabContent.contentWindow.location.replace('../../../template/remit-member/login.html');
            break;
        case 3: // my order tab
            // handleNeedsLoginTapped(index, tabContent, tapItem);
            getToken(28, tabContent.contentWindow.location)
            break;
        default:
            break;
    }
}

function goto(url) {
    if (window.app && app.openView) {
        window.app.openView(ts({
            opt: {
                title: ''
            },
            url: getRealPath() + url
        }));
    } else {
        window.location.href = url;
    }
}

function getRealPath() {
    var localObj = window.location;
    var filePaths = localObj.pathname.split("/");
    var basePath = localObj.origin + '/';
    for (var i = 0; i < filePaths.length - 1; i++) {
        var subPath = filePaths[i];
        if (subPath && subPath != '') {
            basePath += subPath + '/';
        }
    }

    return basePath;
}


function getIndex() {
    var index = localStorage.getItem('hexinpassJdIndex');
    if (index == null || index == '') {
        index = 0;
    }
    if (index == 3 || index == 2) {
        if (window.app && !window.app.isLogin()) {
            index = 0
        }
    }
    return index;
}

function setIndex(index) {
    localStorage.setItem('hexinpassJdIndex', index);
}

function setActive(index) {
    $('.mui-tab-item').removeClass('mui-active');
    $('.mui-tab-item').get(index).classList.add('mui-active');
}

function setCartBagedNumber(number) {
    var obj = $('#cartBagedId');
    if (number > 0) {
        obj.show();
        obj.html(number);
    } else {
        obj.hide();
    }
}

function nativeLoginGetData(item) {
    appLoginGetData(getToken(), function(data) {
        if (data.success == 1) {
            var phone = data.results.tel;
            var openId = data.results.openId;
            storePhone(phone);
            storeOpenId(openId);
            if (item) {
                mui.trigger(item, 'tap');
                var index = $('.mui-tab-item').index($(item));
                setIndex(index);
                setActive(index);
            }
            requestShopCartNumber();
        }
    });
}

function handleNeedsLoginTapped(index, tabContent, item) {
    window.appInterfaceReady(function() {
        if (window.app && !window.app.isLogin()) {
            if (lastSelectItem) {
                setTimeout(function() {
                    var index = $('.mui-tab-item').index($(lastSelectItem));
                    setIndex(index);
                    setActive(index);
                }, 200);
            }
            nativeLoginGetData(item);
        } else {
            $(lastSelectItem).removeClass('mui-active');
            $(item).addClass('mui-active');
            lastSelectItem = item;
            var urlStr = index == 2 ? 'shopcart.html' : 'order.html';
            tabContent.contentWindow.location.replace(urlStr);
            setIndex(index);
        }
    })
}

function requestToken() {
    window.IO({
        url: 'getOpenPlatformToken',
        success: function(data) {
            if (data.success == 1) {
                storeToken(data.results);
                // get user phone
                window.appInterfaceReady(function() {
                    if (window.app.isLogin()) {
                        nativeLoginGetData(null);
                    } else {
                        storePhone(null);
                    }
                });
            }
        }
    })
}

function requestShopCartNumber() {
    window.IO({
        url: 'getUserShoppingCartNum',
        data: ts({
            'phone': getPhone()
        }),
        success: function(data) {
            if (data.success == 1) {
                setCartBagedNumber(data.results);
            }
        }
    })
}





//获取身份令牌
// function getToken(page, locationContent) {

//     var local = window.localStorage;
//     var token = local.getItem('token');
//     token = local.getItem('token');
//     if (!token) {
//         if (page == '27') {
//             window.location.href = '../../../template/remit-member/login.html?enter=shopcart'
//         } else if (page == '28') {
//             window.location.href = '../../../template/remit-member/login.html?enter=order'
//         }
//         sessionStorage.setItem('page', page);
//     } else {
//         $.post('/puhuihua/wechat/userInfo/validateToken', {
//             token: token + '_' + terminal
//         }, function(data) {
//             if (!data.success) {
//                 local.removeItem('token');
//                 if (page == '27') {
//                     window.location.href = '../../../template/remit-member/login.html?enter=shopcart'
//                 } else if (page == '28') {
//                     window.location.href = '../../../template/remit-member/login.html?enter=order'
//                 }
//                 sessionStorage.setItem('page', page);
//             } else {
//                 if (page == '27') {
//                     locationContent.replace('shopcart.html');
//                 } else if (page == '28') {
//                     locationContent.replace('order.html');
//                 }
//             }
//         }, 'json');
//     }
// }

// window.addEventListener('message', function(e) {
//     // var data = JSON.parse(e.data);
//     localStorage.setItem('fromLogin', e.data);
// }, false);

// $(function() {

//     pushHistory();
//     window.addEventListener("popstate", function(e) {
//         mui.toast('444444444444444456')
//             // WeixinJSBridge.invoke('closeWindow', {}, function(res) {})
//             // alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能  

//     }, false);

//     function pushHistory() {
//         var state = {
//             title: "title",
//             url: " "
//         };
//         window.history.pushState(state, "title", " ");
//     }

// });