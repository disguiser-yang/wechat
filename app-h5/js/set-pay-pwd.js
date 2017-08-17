/**
 * Created by Lihuan on 2017/3/8.
 */

//获取身份令牌
// getToken(18);
var path = '/puhuihua/static/wechat/template/remit-member/';
//设置密码
var count = 0;
var pwd = '';
var six = 6;
var index = 0;
// mui("body").on('tap', '#keyboard .num', function() {
//     clearTimeout(timer);
//     $(this).css('background-color', '#e6e6e6');
//     var this_span = $(this);
//     var timer = setTimeout(function() {
//         this_span.css('background-color', '#fff');
//     }, 150);
//     var num = $(this).text();
//     if (count < 6) {
//         count++;
//         $('.pwd-row1 input:nth-child(' + count + ')').val(num);
//         pwd = pwd + num;

//     } else if (count >= 6 & count < 12) {
//         count++;
//         index = count - six;
//         // $('.pwd-row2 input:nth-child(' + index + ')').val(num);

//     }

// if (count >= 12) {
//     var isSame = true;
//     for (var i = 1; i < 7; i++) {
//         if ($('.pwd-row1 input:nth-child(' + i + ')').val() != $('.pwd-row2 input:nth-child(' + i + ')').val()) {
//             mui.toast('两次输入的密码不一致！请重新输入')
//             isSame = false;
//         }
//         pwd += $('.pwd-row1 input:nth-child(' + i + ')').val();
//         pwd = pwd.substr(0, 6);

//     }
//     if (isSame == true) {

//         $('.mui-button-row button').addClass('btn-success');
//     }

// }
// });
// mui("body").on('tap', '#keyboard .single-del', function() {
//     if (count < 13) {
//         $('.mui-button-row button').removeClass('btn-success');
//     }
//     if (count > 6) {
//         index = count - six;
//         $('.pwd-row2 input:nth-child(' + index + ')').val('');

//     } else {
//         $('.pwd-row1 input:nth-child(' + count + ')').val('');
//         pwd = pwd.substr(0, pwd.length - 1);
//     }
//     count--;
//     if (count < 0) {
//         count = 0;
//     }


// });
mui("body").on('tap', '#keyboard .all-del', function() {
    $('.pwd-row input').val('');
    count = 0;
    pwd = '';
    $('.mui-button-row button').removeClass('btn-success')
});
//打开键盘
mui("body").on('tap', '.pwd-row', function() {
    $('.keyboard-input').css('bottom', '0')
});
//收起键盘
mui("body").on('tap', '#switch', function() {
    $('.keyboard-input').css('bottom', '-12rem')
});
mui('body').on('tap', '.recharge-agreement', function() {
    var back = sessionStorage.getItem('back');
    if (back == 'wallet') {
        window.location.href = path + 'no-password-agreement.html?enter=wallet'

    } else {
        window.location.href = path + 'no-password-agreement.html?enter=setpaypwd'

    }
});
var che = $('#checkbox').is(':checked');
console.log(che)
mui("body").on('tap', '.btn-success', function() {
    if (pwd.length == 6) {
        $('#tip').css('display', 'block');

        // 设置免密支付
        var hasPwd = 0;
        var checked = $('#checkbox').is(':checked');
        console.log(checked);
        if (checked) {
            hasPwd = 1;
        } else {
            hasPwd = 0;
        }
        // mui.post('/puhuihua/wechat/wallet/noPass', {
        //         token: token + '_' + terminal,
        //         payPassword: pwd,
        //         noPass: hasPwd
        //     }, function(data) {


        //     })
        //设置支付密码
        $.post('/puhuihua/wechat/wallet/setPayPassword', {
            token: token + '_' + terminal,
            payPassword: pwd
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                var page = sessionStorage.getItem('setPwd');
                mui.toast('设置支付密码成功');
                mui.post('/puhuihua/wechat/wallet/noPass', {
                    token: token + '_' + terminal,
                    payPassword: pwd,
                    noPass: hasPwd
                }, function(data) {


                })
                setTimeout(function() {

                    // switch (page) {
                    //     case '1':
                    //         window.location.href = 'puhui-wallet.html';
                    //         break;
                    //     case '2':
                    //         window.location.href = 'personal-center.html';
                    //         break;
                    //     case '3':
                    //         window.location.href = 'puhui-wallet.html?enter=1';
                    //         break;
                    //     case '4':
                    //         window.location.href = 'puhui-pay.html';
                    //         break;
                    //     case '5':
                    //         window.location.href = 'balance.html';
                    //         break;
                    //     case '6':
                    //         window.location.href = '../sub-life/nearby-stroe.html';
                    //         break;
                    //     case '7':
                    //         window.location.href = '/puhuihua/static/wechat/template/public/wait10';
                    //         break;
                    //     case '8':
                    //         window.location.href = '/puhuihua/static/wechat/template/public/wait11';
                    //         break;
                    //     case '9':
                    //         window.location.href = '../sub-life/pay-fees.html';
                    //         break;
                    //     default:
                    //         var obj = {
                    //             'taskName': 'close',
                    //             'data': {
                    //                 'pageName': 'set-pay-pwd'
                    //             }
                    //         };
                    //         var jsonObj = JSON.stringify(obj);
                    //         if (isAndroid && !isWX) {
                    //             window.app.nativeHandler(jsonObj);
                    //         } else if (isiOS && !isWX) {
                    //             window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
                    //         }
                    /* window.location.href='puhui-wallet.html';*/
                    window.location.href = 'convenient-pay.html'
                        // }
                }, 1000);
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了');
            }
        }, 'json');
    }
});



// $(function() {
//     pushHistory();
//     var searchKey = window.location.search;
//     var isEnter = searchKey.split("=")[1];
//     if (isEnter == 'activity') {
//         sessionStorage.setItem('setPwd', '3');
//     }
//     console.log(isEnter)
//     if (isEnter == 'pack') {
//         localStorage.setItem('from', 'pack');
//     } else {
//         localStorage.removeItem('from');
//     }
//     window.addEventListener("popstate", function(e) {
//         pushHistory();
//         // mui.toast(isWX)
//         var searchKey = window.location.search;
//         var isEnter = searchKey.split("=")[1];
//         if (isEnter == 'activity') {
//             sessionStorage.setItem('setPwd', '3');
//         }
//         if (isEnter == 'puhuiwallet') {
//             window.location.href = 'puhui-wallet.html'
//         } else {
//             window.location.href = 'puhui-pay.html'
//         }

//         // alert("我监听到了浏览器的返回按钮事件啦"); //根据自己的需求实现自己的功能 
//     }, false);

//     function pushHistory() {
//         var state = {
//             title: "title",
//             url: " "
//         };
//         window.history.pushState(state, "title", " ");
//     }

// });