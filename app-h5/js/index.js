$(function() {
    mui.init();
    getIndexData();
});


$(".tab-bar-bottom .tab-bar-items").on("click", function() {
    // console.log($(this).index());
    $(this).siblings().removeClass('actived');
    $(this).addClass('actived');
    $('.main-content').children().hide();
    $('.main-content').children().eq($(this).index()).show();
    var index = $(this).index();
    if (index == 0) {
        document.title = '拼团嗨购';
    } else if (index == 1) {
        document.title = '我的订单';
        getMyOrderList();
    } else if (index == 2) {
        document.title = '我的';
    }
});

//我的地址
mui('body').on('tap', '.mine-option-address', function() {
    window.location.href = 'addressManage.html'
});

mui('body').on('tap', '.month-selected-content-item-img', function() {
    window.location.href = 'detail.html?sku=' + $(this).attr('sku')
});





//获取首页数据
function getIndexData() {

    $.ajax({
        type: 'POST',
        url: baseUrl + '/getHome',
        headers: { "tokenxxb": token + '_app', "telephone": phone, "Content-Type": "text/plain;charset=UTF-8" },
        data: "{}",
        success: function(data, status, xhr) {
            data = JSON.parse(data);
            _templatePage('.indexListMonth', 'indexList', { list: data.results[0].list }, true);
            _templatePage('.week-wrap', 'indexListMonth', { list: data.results[1].list }, true);
        },
        error: function(xhr, type) {
            window.location.reload();
        }
    })
}


//我的订单
function getMyOrderList() {
    $.ajax({
        type: 'POST',
        url: baseUrl + '/getUserOrderList',
        headers: { "tokenxxb": token + '_app', "telephone": phone, "Content-Type": "text/plain;charset=UTF-8" },
        data: JSON.stringify({ "telephone": "18190723501", "page": 1, "pageSize": 10, "state": -1 }),
        success: function(data, status, xhr) {
            data = JSON.parse(data);
            console.log(data)
        },
        error: function(xhr, type) {
            // window.location.reload();
        }
    })
}