// mui("body").on('tap', '#hhh', function() {

//     alert('123')
// });

// $(".tab-bar-bottom .tab-bar-items").on("click", function() {
//     console.log($(this).index());
//     $(this).siblings().removeClass('actived');
//     $(this).addClass('actived');
//     $('.main-content').children().hide();
//     $('.main-content').children().eq($(this).index()).show();
//     var index = $(this).index();
//     if (index == 0) {
//         document.title = '拼团嗨购';
//     } else if (index == 1) {
//         document.title = '我的订单';
//     } else if (index == 2) {
//         document.title = '我的';
//     }
// });

// appui.showHUD();
mui('body').on('tap', '.address-items-edit', function() {
    // mui.toast('莫乱点击')
    window.location.href = 'addressEdit.html'
});

mui('body').on('tap', '.add-address-btn', function() {
    // mui.toast('莫乱点击')
    window.location.href = 'addressEdit.html'
});