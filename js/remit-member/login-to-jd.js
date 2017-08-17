/**
 * Created by lihuan on 2017/1/5.
 */

getToken1(27);

function getToken1(page) {
    token = local.getItem('token');
    sessionStorage.setItem('page', page);
    if (!token) {
        // window.location.replace('login.html?enter=jd');
        $('#load-wrap-spinner').hide();
        $('.login-wrap').show();
        document.title = '登录';
    } else {
        $.post('/puhuihua/wechat/userInfo/validateToken', {
            token: token + '_' + terminal
        }, function(data) {
            if (!data.success) {
                // mui.toast('123')
                local.removeItem('token');
                sessionStorage.setItem('page', page);
                $('#load-wrap-spinner').hide();
                $('.login-wrap').show();
                document.title = '登录';
            } else {
                var phone = local.getItem('phone');
                window.location.replace(jdIndex + '?phone=' + phone + '&channel=2');
            }
        }, 'json');
    }
}





//公用方法
function active(val1, val2) {
    document.body.querySelector(".login-pwd-box").style.display = val1;
    document.body.querySelector(".login-row").style.display = val1;
    document.body.querySelector("#register-next").style.display = val2;
}

function changeClass(selecter, name1, name2) {
    $(selecter).removeClass(name1);
    $(selecter).addClass(name2);
}
//禁止输入汉字
$('body').on('input', '.login-phone', function() {
    isNum($(this), 11)
});
var value = 1;
//切换登录注册
mui(".login-btn-row").on('tap', '.register-btn', function() {
    document.title = '注册';
    $('input').val("");
    if (!$('input').val()) {
        $('#login-submit').removeClass('btn-success')
    }
    $('.verify').text('');
    active("none", "block");
    changeClass(".login-bg", "login", "register");
    $('.login-phone').blur();
    value = 2;
});
mui(".login-btn-row").on('tap', '.login-btn', function() {
    document.title = '登录';
    $('input').val("");
    if (!$('input').val()) {
        $('#next-btn').removeClass('btn-success')
    }
    $('.verify').text('');
    active("block", "none");
    changeClass(".login-bg", "register", "login");
    $('.login-phone').blur();
    value = 1;
});

//是否看见密码
mui(".login-pwd-box").on('tap', '.no-see', function() {
    changeClass(".see-pwd", "no-see", "can-see");
    $(".login-pwd").attr("type", "text");
});
mui(".login-pwd-box").on('tap', '.can-see', function() {
    changeClass(".see-pwd", "can-see", "no-see");
    $(".login-pwd").attr("type", "password");
});
mui(".login-pwd-box").on('tap', '.see-pwd', function() {
    $('input').blur()
});

//链接忘记密码页
mui('body').on('tap', '#forget-pwd', function() {
    mui.openWindow({
        url: 'forget-pwd.html'
    });
});

//链接用户协议页
mui('body').on('tap', '.user-agreement', function() {
    mui.openWindow({
        url: 'user-agreement.html'
    });
});

//变量
var check = [false, false];
var checkPhone = false;
$('body').on('input', '.login-content input', function() {
    if (value == 1) {
        $('.login-content input').each(function(i, val) {
            var length = $(this).val().trim();
            if (length != 0) {
                check[i] = true;
            } else {
                check[i] = false;
            }
        });
        if (check.indexOf(false) < 0) {
            $('#login-submit').addClass('btn-success')
        } else {
            $('#login-submit').removeClass('btn-success')
        }
    } else {
        if ($('.login-phone').val().trim().length != 0) {
            checkPhone = true;
        } else {
            checkPhone = false;
        }
        if (checkPhone) {
            $('#next-btn').addClass('btn-success')
        } else {
            $('#next-btn').removeClass('btn-success')
        }
    }
});
$('body').on('focus', '.login-phone', function() {
    $('.icon-clear').removeClass('icon-hidden')
})
$('body').on('blur', '.login-phone', function() {
    $('.icon-clear').addClass('icon-hidden')
})
mui("body").on('tap', '.icon-clear', function() {
    $('.login-phone').val('')
});

//登录成功后链接个人中心页
var searchKey = window.location.search;
// console.log(searchKey)
var strs = searchKey.split("=");
var keyWord = strs[0].split("?");
var page = sessionStorage.getItem('page');

//登录
mui('body').on('tap', '#login-submit.btn-success', function() {
    $('input').blur();
    var phone = $('.login-phone').val().trim();
    var pwd = $('.login-pwd').val().trim();
    if (!phone.match(/^1[3|4|5|7|8][0-9]\d{8}$/)) {
        mui.toast('请输入11位手机号')
    } else if (pwd.length < 6 || pwd.length > 12) {
        mui.toast('请输入6到12位密码')
    } else {
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/userInfo/login', {
            phone: phone,
            password: pwd,
            terminal: terminal
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                var everToken = local.getItem('token');
                if (everToken) {
                    local.removeItem('token');
                }
                var token = data.data.token;
                local.setItem('token', token);
                local.setItem('phone', phone);
                local.setItem('hexinpassJdPhone', phone);
                local.setItem('isNewUser', data.data.isNewUser);
                // //向活动页面发数据
                var dataJson = JSON.stringify({　　　　
                    token: token + '_wechat',
                    phone: phone
                });
                //设置cookie
                // var exp = new Date();
                // exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
                // document.cookie = 'userInfo=' + dataJson + ";expires=" + exp.toGMTString();

                setCookie('userInfo', dataJson);
                // document.domain = '/'
                // window.frames[0].postMessage(dataJson, '*');

                var obj = {
                    "taskName": "userinfo",
                    "data": {
                        "token": token,
                        "phone": phone
                    }
                };
                console.log(page);
                var jsonObj = JSON.stringify(obj);
                // if (isAndroid && !isWX) {
                //     window.app.nativeHandler(jsonObj);
                // } else if (isiOS && !isWX) {
                //     window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
                // }
                if (keyWord[1] == 'url') {
                    var url = decodeURIComponent(strs[1]);
                    window.location.href = url + '?token=' + token;
                } else {
                    var searchKey = window.location.search;
                    var isEnter = searchKey.split("=")[1];
                    var sku = searchKey.split("=")[2];
                    if (isEnter == 'activity') {
                        window.location.replace(activityPage); //跳转至活动页面
                    } else if (isEnter == 'coupon') {
                        window.location.replace(coupon); //跳转至我的奖品页面
                    } else if (isEnter == 'detail&sku') {
                        window.location.replace('../../hexinpass-JD/jd/resource/detail.html?sku=' + sku); //跳转到商品详情页面
                    } else if (isEnter == 'shopcart') {
                        local.setItem('loginFrom', 'shopcart');
                        window.location.replace('../../hexinpass-JD/jd/resource/index.html'); //跳转到购物车页面
                    } else if (isEnter == 'jd') {
                        local.setItem('loginFrom', 'jd');
                        window.location.replace(jdIndex + '?phone=' + phone + '&channel=2'); //跳转到京东
                    } else {
                        switch (page) {
                            case '0':
                                window.location.href = 'interaction.html';
                                break;
                            case '1':
                                window.location.href = 'interaction-leave-words.html';
                                break;
                            case '2':
                                window.location.href = 'puhui-wallet.html';
                                break;
                            case '3':
                                window.location.href = 'balance.html';
                                break;
                            case '4':
                                window.location.href = 'puhui-pay.html?enter=1';
                                break;
                            case '5':
                                window.location.href = 'recharge.html';
                                break;
                            case '6':
                                // window.location.href = 'personal-center.html';
                                window.location.href = 'personal.html';
                                break;
                            case '7':
                                window.location.href = '../sub-life/puhui-activity.html';
                                break;
                            case '8':
                                window.location.href = '../sub-life/phone-recharge.html';
                                break;
                            case '9':
                                window.location.href = 'enter-apply-agreement.html';
                                break;
                            case '10':
                                window.location.href = 'my-apply.html';
                                break;
                            case '11':
                                window.location.href = 'bind-vip.html';
                                break;
                            case '12':
                                window.location.href = '../labor-server/quality-promotion.html';
                                break;
                            case '13':
                                window.location.href = '../sub-life/bind-electricty-card.html';
                                break;
                            case '14':
                                window.location.href = '../sub-life/bind-gas-card.html';
                                break;
                            case '15':
                                window.location.href = '../sub-life/bind-water-card.html';
                                break;
                            case '16':
                                window.location.href = 'forget-pay-pwd.html';
                                break;
                            case '17':
                                window.location.href = 'reset-pay-pwd.html';
                                break;
                            case '18':
                                window.location.href = 'set-pay-pwd.html';
                                break;
                            case '19':
                                window.location.href = '../sub-life/puhui-stroe.html';
                                break;
                            case '20':
                                window.location.href = 'modify-pwd.html';
                                break;
                            case '21':
                                window.location.href = 'bind-bankCard.html';
                                break;
                            case '22':
                                window.location.href = 'bank-card.html';
                                break;
                            case '23':
                                window.location.href = 'modify-bankCard.html';
                                break;
                            case '24':
                                window.location.href = '../labor-server/consult-detail.html';
                                break;
                            case '25':
                                window.location.href = 'puhui-pay-scan.html';
                                break;
                            case '26':
                                window.location.replace(activityPage + '?phone=' + phone + '&token=' + token + '_wechat'); //跳转至活动页面
                                break;
                            case '27':
                                window.location.replace(jdIndex + '?phone=' + phone + '&channel=2'); //跳转到京东
                                break;
                            default:
                                // window.location.href='personal-center.html';
                                window.location.href = 'personal.html';
                        }

                    }
                }
            } else if (data.errorCode == 7) {
                mui.toast('该手机号未注册')
            } else if (data.errorCode == 5) {
                mui.toast('手机号或密码错误')
            } else if (data.errorCode == 34) {
                mui.confirm('密码尝试次数过多，账号已锁定', '提示', ['取消', '重置密码'], function(e) {
                    if (e.index == 1) {
                        window.location.href = 'forget-pwd.html'
                    }
                });
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            }
        }, 'json');
    }
});

//注册
mui('body').on('tap', '#next-btn.btn-success', function() {
    $('input').blur();
    var phoneNum = $('.login-phone').val().trim();
    if (!phoneNum.match(/^1[3|4|5|7|8][0-9]\d{8}$/)) {
        mui.toast('请输入11位手机号');
    } else {
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/userInfo/phoneOnly', {
            phone: phoneNum
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                window.location.href = 'phone-verify.html?phone=' + phoneNum;
            } else if (data.errorCode == 4) {
                mui.toast('该手机号已注册');
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            }
        }, 'json');
    }
});

// document.getElementById('iframe').src = transmitTokenPage;
// $(function() {
//     pushHistory();
//     window.addEventListener("popstate", function(e) {
//         var searchKey = window.location.search;
//         var isEnter = searchKey.split("=")[1];
//         if (isEnter == 'activity') {
//             WeixinJSBridge.invoke('closeWindow', {}, function(res) {})
//         } else if (isEnter == 'shopcart') {
//             window.location.replace('../../hexinpass-JD/jd/resource/index.html');
//         } else if (sessionStorage.getItem('page') == 11) {
//             window.location.href = '../labor-server/labor-server.html'
//         } else if (sessionStorage.getItem('closeWindow') == 'yes') {
//             WeixinJSBridge.invoke('closeWindow', {}, function(res) {})
//         }

//     }, false);

//     function pushHistory() {
//         var state = {
//             title: "title",
//             url: " "
//         };
//         window.history.pushState(state, "title", " ");
//     }

// });


//写cookies
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain;
}