/**
 * Created by Administrator on 2017/4/1.
 */
//获取身份令牌
getToken(9);
/*
 * 第一步，获取是否为会员
 * */

//身份证号禁止输入汉字
$('body').on('input', '.idNo', function() {
    var $this = $(this).val();
    if (isNaN($this) && !(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|[Xx])$/.test($this))) {
        if (!isNaN(parseInt($(this).val()))) {
            $(this).val(parseInt($(this).val()))
        } else {
            $(this).val('')
        }
    }
    if ($this.length > 18) {
        $(this).val(("" + $this).substring(0, 18));
    }
});
//表单输入完整时变红
var check = [false, false];

function checkInput(obj, btn) {
    $(obj).each(function(i, val) {
        var length = $(this).val().trim();
        if (length != 0) {
            check[i] = true;
        } else {
            check[i] = false;
        }
    });
    if (check.indexOf(false) < 0) {
        $(btn).addClass('btn-success')
    } else {
        $(btn).removeClass('btn-success')
    }
}
$('body').on('input', '#step1 input', function() {
    checkInput('#step1 input', '#step1 .my-btn');
});
var phoneNum = null;
//获取是否为会员
mui('body').on('tap', '#step1 .btn-success', function() {
    $('input').blur();
    var IDcard = $('.idNo').val().trim();
    var name = $('.custName').val().trim();
    var idNo = $('.idNo').val().trim();
    var i = 0,
        arr = [];
    var checkNum = false;
    for (i; i < idNo.length; i++) {
        var num = idNo.substr(i, 1);
        if (num == 'x' || num == 'X') {
            num = 10;
        }
        arr.push(parseInt(num));
    }
    var coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var contrast = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    var total = 0;
    for (var j = 0; j < arr.length - 1; j++) {
        total = total + arr[j] * coefficient[j]
    }
    var remainder = total % 11;
    if (contrast[remainder] == arr[17]) {
        checkNum = true;
    }
    if (checkNum) {
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/userInfo/memberQuery', {
            token: token + '_' + terminal,
            IDcard: IDcard,
            name: name
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                var dataJson = data.data;
                $('.name').text(dataJson.name);
                if (dataJson.sex) {
                    $('input[name=sex]').eq(0).attr('checked', true)
                } else {
                    $('input[name=sex]').eq(1).attr('checked', true)
                }
                $('.nationality').text(dataJson.nationality);
                $('.idcard').text(dataJson.idcard);
                $('.mobile').text(dataJson.mobile);
                $('.department').text(dataJson.department);
                if (dataJson.village) {
                    $('input[name=village]').eq(0).attr('checked', true)
                } else {
                    $('input[name=village]').eq(1).attr('checked', true)
                }
                $('.politics').text(dataJson.politics);
                if (dataJson.tradeUnionVo.one) {
                    $('.first-union').text(dataJson.tradeUnionVo.one.name);
                } else {
                    $('.first-union').text('无');
                }
                if (dataJson.tradeUnionVo.two) {
                    $('.second-union').text(dataJson.tradeUnionVo.two.name);
                } else {
                    $('.second-union').text('无');
                }
                $('.address').text(dataJson.address);
                var phoneNumPrev = dataJson.mobile.substring(0, 3);
                var phoneNumAfter = dataJson.mobile.substring(7, 11);
                phoneNum = dataJson.mobile;
                $('.phone').text(phoneNumPrev + '****' + phoneNumAfter);
                $('#id').val(dataJson.id);
                $('#step1').addClass('display-none');
                $('#step2').removeClass('display-none')

            } else if (data.errorCode == 8) {
                mui.toast('身份验证出错')
            } else if (data.errorCode == 41) {
                window.location.href = 'enter-union-apply.html'
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            }
        }, 'json');
    } else {
        mui.toast('请输入18位正确的身份证号')
    }
});

/*
 * 第二步，获取验证码验证身份
 * */
$('body').on('input', '.securityCode', function() {
    if ($(this).val().trim()) {
        $('#step2 .my-btn').addClass('btn-success')
    } else {
        $('#step2 .my-btn').removeClass('btn-success')
    }
});
//验证码倒计时
var countdown = 60;

function settime(obj) {
    if (countdown == 0) {
        obj.innerText = "发送验证码";
        countdown = 60;
        return;
    } else {
        obj.innerText = "重新发送(" + countdown + "s)";
        countdown--;
    }
    setTimeout(function() {
        settime(obj)
    }, 1000)
}
//发送验证码
mui('body').on('tap', '.yzm span', function() {
    $('input').blur();
    if (phoneNum.length == 11) {
        if (countdown == 60) {
            settime(this);
            $('.securityCode').val('');
            mui.post('/puhuihua/wechat/userInfo/sendSecurityCode', {
                phone: phoneNum
            }, function(data) {
                if (data) {
                    if (data.success) {

                    } else {
                        mui.toast(data.error);
                    }
                }
            }, 'json');
        }
    } else {
        mui.toast('请输入11位手机号')
    }
});
mui('body').on('tap', '#step2 .btn-success', function() {
    $('input').blur();
    var yzm = $('.securityCode').val().trim();
    var id = $('#id').val();
    if (yzm) {
        $('#tip').css('display', 'block');
        mui.post('/puhuihua/wechat/userInfo/memberBind', {
            token: token + '_' + terminal,
            securityCode: yzm,
            mobile: phoneNum,
            id: id
        }, function(data) {
            $('#tip').css('display', 'none');
            if (data.success) {
                $('#step2').addClass('display-none');
                $('#step3').removeClass('display-none');
            } else if (data.errorCode == 8) {
                mui.toast('身份验证出错')
            } else if (data.errorCode == 3) {
                mui.toast('验证码错误')
            } else if (data.errorCode == 25) {
                mui.toast('入会申请失败')
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了')
            }
        }, 'json');
    } else {
        mui.toast('请输入验证码')
    }

});
/*
 * 第三步，下一步入会申请成功
 * */
mui('body').on('tap', '#step3 .btn-success', function() {
    window.location.href = 'enter-union-success.html?unionPage=1'
});
//19位会员号禁止输入汉字
$('body').on('input', '.cardNo', function() {
    var $this = $(this).val();
    if (isNaN($this)) {
        if (!isNaN(parseInt($(this).val()))) {
            $(this).val(parseInt($(this).val()))
        } else {
            $(this).val('')
        }
    }
    if ($this.length > 19) {
        $(this).val(("" + $this).substring(0, 19));
    }
});
//六位密码禁止输入汉字
$('body').on('input', '.password', function() {
    var $this = $(this).val();
    if (isNaN($this)) {
        if (!isNaN(parseInt($(this).val()))) {
            $(this).val(parseInt($(this).val()))
        } else {
            $(this).val('')
        }
    }
    if ($this.length > 6) {
        $(this).val(("" + $this).substring(0, 6));
    }
});


//操作回退的历史记录
// back('enter-union-applied')



$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        var searchKey = window.location.search;
        var isEnter = searchKey.split("=")[1];
        // mui.toast(isEnter)
        if (isEnter == 'bindVip') {
            window.location.href = '../labor-server/labor-server.html'
        }
        // if (mui.toast(sessionStorage.getItem('page')) == 11) {
        //     window.location.href = '../labor-server/labor-server.html'

        // }
        // alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能  

    }, false);

    function pushHistory() {
        var state = {
            title: "title",
            url: ""
        };
        window.history.pushState(state, "title", "");
    }

});