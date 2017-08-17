/**
 * Created by Lihuan on 2017/3/29.
 */
var errorArr = [];
//获取身份令牌
getToken(23);
mui.post('/puhuihua/wechat/wallet/getCardInfo', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        var dataJson = data.data;
        $('.custName').val(dataJson.custName);
    } else if (data.errorCode == 38) {
        mui.toast('您暂未绑定银行卡');
        setTimeout(function() {
            window.location.href = 'bind-bankCard.html'
        }, 10000)
    }
}, 'json');


//初始化获取银行
function initBankInfo() {
    $.get('../../js/public/banks.json', function(data) {
        $('.content-list li').not('.header').remove();
        $.each(data, function(i, val) {
            if (i == 'a') {
                $('.content-list').append('<li class="index first"><a name="' + i + '" id="a">' + i.toUpperCase() + '</a></li>');
            } else {
                $('.content-list').append('<li class="index"><a name="' + i + '" id="a">' + i.toUpperCase() + '</a></li>');
            }
            $.each(val, function(j, val) {
                $('.content-list').append('<li class="card-type" data-src="' + val.bankUrl + '">' + val.bankName + '</li>')
            })
        });
    });

}
initBankInfo();
//失去焦点获取银行信息
function reGetBankInfo() {
    if (!$('#searchBank').val()) {
        initBankInfo();
    }
}

//搜索栏输入关键字过滤银行
function getBankInfo(str) {
    $.get('../../js/public/banks.json', function(data) {

        var json = {}
        $.each(data, function(i, val) {
            $.each(data[i], function(j, val) {
                if (this.bankName.indexOf(str) >= 0) {
                    if (!!json[i]) {
                        json[i][json[i].length] = this
                    } else {
                        json[i] = [];
                        json[i][json[i].length] = this
                    }
                }

            });

        });
        $('.content-list li').not('.header').remove();
        $.each(json, function(i, val) {
            if (i == 'a') {
                $('.content-list').append('<li class="index first"><a name="' + i + '" id="a">' + i.toUpperCase() + '</a></li>');
            } else {
                $('.content-list').append('<li class="index"><a name="' + i + '" id="a">' + i.toUpperCase() + '</a></li>');
            }
            $.each(val, function(j, val) {
                $('.content-list').append('<li class="card-type" data-src="' + val.bankUrl + '">' + val.bankName + '</li>')
            })
        });
    });

}
mui('body').on('tap', '.select-card', function() {
    $('#bank-index-list').css('right', 0)
});
mui('body').on('tap', '.content-list .card-type', function() {

    $("#searchBank").val("");
    $("#searchBank").blur();
    var card = $(this).text();
    $('.bankName').val(card);
    $('#bankName').val($(this).attr('data-src'));
    $('#bank-index-list').css('right', '-18rem')
});
mui('body').on('tap', '.cancel-icon', function() {
    $("#searchBank").val("");
    $("#searchBank").blur();
    $('#bank-index-list').css('right', '-18rem')
});
mui('body').on('tap', '.index-list li', function() {
    var index = $(this).index();
    $('.index').eq(index);
});

function search(val) {
    var str = val
    getBankInfo(str);
}
// 在键盘按下并释放及提交后验证提交表单
$("#form-submit").validate({
    onsubmit: true,
    onfocusout: false,
    onkeyup: false,
    onclick: false,
    rules: {
        bankName: "required",
        cardNo: {
            required: true,
            isNullStr: true
        },
        reservedPhone: {
            required: true,
            isMobile: true,
            isNullStr: true
        },
        securityCode: {
            required: true,
            isNullStr: true
        }
    },
    messages: {
        bankName: "请选择所属银行",
        cardNo: {
            required: "请输入20位银行卡号",
            isNullStr: "请输入20位银行卡号"
        },
        reservedPhone: {
            required: "请输入11位手机号",
            isMobile: "请输入11位正确的手机号",
            isNullStr: "请输入11位手机号"
        },
        securityCode: {
            required: "请输入正确验证码",
            isNullStr: "请输入正确验证码"
        }
    },
    errorPlacement: function(error, element) {
        errorArr.push(error.text());
    }
});
//空格
jQuery.validator.addMethod("isNullStr", function(value, element) {
    var length = value.replace(/\s/g, "").length;
    return this.optional(element) || (length != 0);
}, "请输入有效字符。");
//手机号码验证
jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    return this.optional(element) || (length == 11 && /^1[3|4|5|7|8][0-9]\d{8}$/.test(value));
}, "请正确填写您的手机号码。");
//银行卡号禁止输入汉字
$('body').on('input', '.cardNo', function() {
    var $this = $(this).val();
    if (isNaN($this) && !(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|[Xx])$/.test($this))) {
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
//手机号禁止输入汉字
$('body').on('input', '.reservedPhone', function() {
    var $this = $(this).val();
    if (isNaN($this)) {
        if (!isNaN(parseInt($(this).val()))) {
            $(this).val(parseInt($(this).val()))
        } else {
            $(this).val('')
        }
    }
    if ($this.length > 11) {
        $(this).val(("" + $this).substring(0, 11));
    }
});
//验证码禁止输入汉字
$('body').on('input', '.securityCode', function() {
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
//表单-银行卡 输入完整时变红
var checkBank = [false, false, false, false];
$('body').on('input', '.inputInform', function() {
    $('.inputInform').each(function(i, val) {
        var length = $(this).val().trim();
        if (length != 0) {
            checkBank[i] = true;
        } else {
            checkBank[i] = false;
        }
    });
    if (checkBank.indexOf(false) < 0) {
        $('.my-btn').addClass('btn-success');
    } else {
        $('.my-btn').removeClass('btn-success')
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
    var phoneNum = $('.reservedPhone').val().trim();
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
mui('body').on('tap', '.btn-success', function() {
    $('input').blur();
    var ajaxFormOption = {
        type: "post", //提交方式
        data: {
            token: token + '_' + terminal,
            bankLogo: $('#bankName').val()
        },
        dataType: "json",
        url: "/puhuihua/wechat/wallet/bindCardChange", //请求url
        success: function(data) { //提交成功的回调函数
            $('#tip').css('display', 'none');
            if (data.success) {
                window.location.href = 'bind-bankCard-success.html'
            } else if (data.errorCode == 3) {
                mui.toast('验证码错误');
            } else if (data.errorCode == 38) {
                mui.toast('未绑定银行卡');
            } else if (data.errorCode == 40) {
                mui.toast('银行卡信息变更失败');
            } else if (data.errorCode == 51) {
                mui.toast(data.error);
            } else if (data.errorCode == 0) {
                mui.toast('网络开小差了');
            }
        }
    };
    errorArr = [];
    if ($("#form-submit").valid()) {
        if ($('.securityCode').val().trim().length == 6) {
            $('#tip').css('display', 'block');
            $("form").ajaxSubmit(ajaxFormOption);
        } else {
            mui.toast('验证码错误');
        }
    } else {
        $.each(errorArr, function(i, val) {
            if (i == 0) {
                mui.toast(errorArr[0])
            }
        });
    }
});