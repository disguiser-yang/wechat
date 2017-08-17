var mySwiper = new Swiper('.swiper-container', {
    autoplay: 2000,
    pagination: '.swiper-pagination',
    // paginationElement: 'li',

})

$(function() {
    mui.init();

    getDetailBySku(parseInt(getQueryString('sku')))
});


mui('body').on('tap', '.buy-option-bg-mask', function() {
    // mui.toast('莫乱点击')
    $('.buy-option-bg-mask').hide();
    $('.buy-option-wrap').addClass('slow-down');
});

mui('body').on('tap', '.close-icon', function() {
    $('.buy-option-bg-mask').hide();
    $('.buy-option-wrap').addClass('slow-down');
});


//立即购买
mui('body').on('tap', '.buy-btn', function() {
    $('.buy-option-bg-mask').show();
    $('.buy-option-wrap').addClass('slow-up');
    $('.buy-option-wrap').removeClass('slow-down');
});

mui('body').on('tap', '.options-wrap .options-wrap-item', function() {
    // mui.toast($(this))
    $(this).siblings().removeClass('selected-item');
    $(this).addClass('selected-item');
    console.log($(this).text())
});





var numberValue = 1;
//数量减
mui('body').on('tap', '.change-min', function() {
    var num = parseInt($('#number-value').val()) - 1;
    $('#number-value').val(num);
    if ($('#number-value').val() < 1) {
        $('#number-value').val(1);
    }

});



//数量加
mui('body').on('tap', '.change-plus', function() {
    var num = parseInt($('#number-value').val()) + 1;
    $('#number-value').val(num);
    // mui.toast('莫乱点击')
});

//输入数字框失去焦点
$("#number-value").blur(function() {
    // $("input").css("background-color", "#D6D6FF");
    mui.toast('失去焦点')
});



//提交订单
mui('body').on('tap', '.comfirm-btn', function() {
    window.location.href = 'submitOrder.html';
});



function getDetailBySku(sku) {

    $.ajax({
        type: 'POST',
        url: baseUrl + '/proDetail',
        headers: { "tokenxxb": token + '_app', "telephone": phone, "Content-Type": "text/plain;charset=UTF-8" },
        data: JSON.stringify({ "sku": sku }),
        success: function(data, status, xhr) {
            data = JSON.parse(data);
            console.log(data.results)
            _templatePage('.swiper-wrapper', 'swiperList', { list: data.results.imgList }, true);
            // _templatePage('.week-wrap', 'indexListMonth', { list: data.results[1].list }, true);





        },
        error: function(xhr, type) {
            window.location.reload();
        }
    })
}