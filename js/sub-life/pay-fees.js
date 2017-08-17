/**
 * Created by lihuan on 2017/2/17.
 */

mui.get('/puhuihua/wechat/mall/forPayment', function(data) {
    if (data.success) {
        var dataJson = data.data;
        $('.mui-col-xs-4').each(function(i, val) {
            switch (i) {
                case 0:
                    $('.mui-col-xs-4').eq(i).attr('data-switch', dataJson.PHONE_PAYMENT);
                    break;
                case 1:
                    $('.mui-col-xs-4').eq(i).attr('data-switch', dataJson.ELECTRICITY_PAYMENT);
                    break;
                case 2:
                    $('.mui-col-xs-4').eq(i).attr('data-switch', dataJson.WATER_PAYMENT);
                    break;
                case 3:
                    $('.mui-col-xs-4').eq(i).attr('data-switch', dataJson.GAS_PAYMENT);
                    break;
            }
        });
    }
}, 'json');

//链接手机充值
mui('body').on('tap', '#phone-recharge', function() {
    var PHONE_PAYMENT = $(this).attr('data-switch');
    if (PHONE_PAYMENT == 'on') {
        window.location.href = 'phone-recharge.html'
    } else {
        mui.toast('服务维护中')
    }
});
//链接燃气费
mui('body').on('tap', '#gas-recharge', function() {
    var ELECTRICITY_PAYMENT = $(this).attr('data-switch');
    if (ELECTRICITY_PAYMENT == 'on') {
        window.location.href = 'gas-account.html'
    } else {
        mui.toast('服务维护中')
    }
});
//链接电费
mui('body').on('tap', '#electricty-recharge', function() {
    var WATER_PAYMENT = $(this).attr('data-switch');
    if (WATER_PAYMENT == 'on') {
        window.location.href = 'electricty-account.html'
    } else {
        mui.toast('服务维护中')
    }
});
//链接水费
mui('body').on('tap', '#water-recharge', function() {
    var GAS_PAYMENT = $(this).attr('data-switch');
    if (GAS_PAYMENT == 'on') {
        window.location.href = 'water-account.html'
    } else {
        mui.toast('服务维护中')
    }
});