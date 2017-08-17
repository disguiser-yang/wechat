/**
 * Created by Lihuan on 2017/3/28.
 */
var errorArr = [];
//获取身份令牌
getToken(21);
var i = 1;
mui('body').on('tap', '.bank-tip-wrap i', function() {
    if (i % 2) {
        $(this).css('transform', 'rotate(-180deg)');
        $('.bank-tip-detail').removeClass('display-none')
    } else {
        $(this).css('transform', 'rotate(0)');
        $('.bank-tip-detail').addClass('display-none')
    }
    i++;
});
// //获取银行
// $.get('../../js/public/banks.json', function(data) {
//     $.each(data, function(i, val) {
//         if (i == 'a') {
//             $('.content-list').append('<li class="index first"><a name="' + i + '" id="a">' + i.toUpperCase() + '</a></li>');
//         } else {
//             $('.content-list').append('<li class="index"><a name="' + i + '" id="a">' + i.toUpperCase() + '</a></li>');
//         }
//         $.each(val, function(j, val) {
//             $('.content-list').append('<li class="card-type" data-src="' + val.bankUrl + '">' + val.bankName + '</li>')
//         })
//     });
// });
//初始化获取银行
function initBankInfo() {

    $.get('../../js/public/banks.json', function(data) {
        $('.content-list li').not('.header').remove();
        $.each(data, function(i, val) {
            console.log('9999')
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
        console.log(data)

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


function search(val) {
    var str = val
    getBankInfo(str);
}
//选择银行卡
mui('body').on('tap', '.select-card', function() {
    $('#bank-index-list').css('right', 0)
});
mui('body').on('tap', '.content-list .card-type', function() {
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
// mui('body').on('tap', '.link-e-account', function() {
//     window.location.href = 'e-account.html'
// });
/*用户服务协议*/
// mui('body').on('tap', '.user-agreement', function() {
//     window.location.href = 'user-agreement-bank.html'
// });
mui('body').on('tap', '.user-agreement', function() {
    $('.mask-pop').css('display', 'block')

});

mui('body').on('tap', '.mask-pop-close-btn', function() {
    $('.mask-pop').css('display', 'none')

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
    var phoneNum = $('#phone').val().trim();
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

var frontImg = null,
    backImg = null;
$(document).on('change', '.frontImage', function() {
    uploadFile($(this))
    var prevDiv = document.getElementById('frontImage');
    getPic(this, prevDiv, "front")
});
$(document).on('change', '.backImage', function() {
    uploadFile($(this))
    var prevDiv = document.getElementById('backImage');
    getPic(this, prevDiv, 'back')
});
//压缩图片(上传身份证)
function getPic(file, imageDiv, blob) {
    if (file.files && file.files[0]) {
        var reader = new FileReader();
        reader.onload = function(evt) {
            // 调用函数处理图片 　　　　　　　　　　　　　　　　
            dealImage(evt.target.result, {
                // 注意：在pc端可以用绝对路径或相对路径，移动端最好用绝对路径）
                width: 350
            }, function(base) {
                //直接将获取到的base64的字符串，放到一个image标签中就可看到测试后的压缩之后的样式图了
                imageDiv.innerHTML = '<img src="' + base + '" />';
                if (blob == 'front') {
                    frontImg = dataURLtoBlob(base);
                } else {
                    backImg = dataURLtoBlob(base);
                }
                // console.log("压缩后：" + base.length / 1024 + " " + base);
            })
        };
        reader.readAsDataURL(file.files[0]);
        imageDiv.style.borderColor = '#fff';
    }
    return blob;
}
// 在键盘按下并释放及提交后验证提交表单
$("#form-submit").validate({
    onsubmit: true,
    onfocusout: false,
    onkeyup: false,
    onclick: false,
    rules: {
        custName: {
            required: true,
            isNullStr: true
        },
        idNo: {
            required: true,
            isIdCardNo: true,
            isNullStr: true
        },
        frontImg: "required",
        backImg: "required",
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
        custName: {
            required: "请输入姓名",
            isNullStr: "请输入姓名"
        },
        idNo: {
            required: "请输入18位身份证号",
            isIdCardNo: "请输入18位正确的身份证号",
            isNullStr: "请输入18位身份证号"
        },
        frontImg: "请上传身份证正面照",
        backImg: "请上传身份证背面照",
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
// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
    var idCard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
    var i = 0;
    var check = false;
    var arr = [];
    for (i; i < value.length; i++) {
        var num = value.substr(i, 1);
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
        check = true;
    }
    return this.optional(element) || (idCard.test(value) && check);
}, "请输入正确的身份证号码。");
//手机号码验证
jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    return this.optional(element) || (length == 11 && /^1[3|4|5|7|8][0-9]\d{8}$/.test(value));
}, "请正确填写您的手机号码。");

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
//银行卡号禁止输入汉字
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
//表单-个人身份信息 输入完整时变红
var checkInfor = [false, false];
var checkFile = [false, false];
$('body').on('input', '.add-infor-wrap .inputInform', function() {
    $('.add-infor-wrap .inputInform').each(function(i, val) {
        var length = $(this).val().trim();
        if (length != 0) {
            checkInfor[i] = true;
        } else {
            checkInfor[i] = false;
        }
    });
    if (checkInfor.indexOf(false) < 0 && checkFile.indexOf(false) < 0) {
        $('.next').addClass('btn-success');
    } else {
        $('.next').removeClass('btn-success')
    }
});
$('body').on('change', '.add-infor-wrap input[type=file]', function() {
    $('.add-infor-wrap input[type=file]').each(function(i, val) {
        if (checkFile.indexOf(false) > -1) {
            var length = $(this).val().length;
            if (length != 0) {
                checkFile[i] = true;
            } else {
                checkFile[i] = false;
            }
        }
    });
    if (checkInfor.indexOf(false) < 0 && checkFile.indexOf(false) < 0) {
        $('.next').addClass('btn-success');
    } else {
        $('.next').removeClass('btn-success')
    }
});
//下一步
mui('body').on('tap', '.next.btn-success', function() {


    errorArr = [];
    if ($("#form-submit").valid()) {
        $('.IdImg').removeAttr('name');
        $('.bankName').attr('name', 'bankName');
        $('.cardNo').attr('name', 'cardNo');
        $('.reservedPhone').attr('name', 'reservedPhone');
        $('.securityCode').attr('name', 'securityCode');
        $('.add-infor-wrap').css('visibility', 'hidden');

        setTimeout(function() {
            $('.bind-bank-wrap').css('visibility', 'visible');
            $('.nation-notice').css('display', 'none');
            $('.bank-tip-wrap').css('display', 'none');
        }, 300)

    } else {
        $.each(errorArr, function(i, val) {
            if (i == 0) {
                mui.toast(errorArr[0])
            }
        });
    }
});
//是否同意用户服务协议
var checked = true;
$('input:checkbox').click(function() {
    if ($('input:checkbox').is(':checked')) {
        if (checkBank.indexOf(false) < 0) {
            $('.submit').addClass('btn-success');
        }
        checked = true;
    } else {
        $('.submit').removeClass('btn-success');
        checked = false;
    }
});
//表单-银行卡 输入完整时变红
var checkBank = [false, false, false, false];
$('body').on('input', '.bind-bank-wrap input[type=text]', function() {
    $('.bind-bank-wrap input[type=text]').each(function(i, val) {
        var length = $(this).val().trim();
        if (length != 0) {
            checkBank[i] = true;
        } else {
            checkBank[i] = false;
        }
    });
    if (checkBank.indexOf(false) < 0 && checked) {
        $('.submit').addClass('btn-success');
    } else {
        $('.submit').removeClass('btn-success')
    }
});
//上一步
mui('body').on('tap', '.up.btn-success', function() {
    $('.frontImage').attr('name', 'frontImg');
    $('.backImage').attr('name', 'backImg');
    $('.bankName').removeAttr('name');
    $('.cardNo').removeAttr('name');
    $('.reservedPhone').removeAttr('name');
    $('.securityCode').removeAttr('name');
    $('.bind-bank-wrap').css('visibility', 'hidden');
    setTimeout(function() {
        $('.nation-notice').css('display', 'block');
        $('.bank-tip-wrap').css('display', 'block');
        $('.add-infor-wrap').css('visibility', 'visible');
    }, 300)
});
//提交表单
mui('body').on('tap', '.submit.btn-success', function() {
    $('input').blur();
    errorArr = [];
    if ($("#form-submit").valid() && checked) {
        if ($('.securityCode').val().trim().length == 6) {
            var fd = new FormData(document.getElementById("form-submit"));
            fd.append("token", token + '_' + terminal);
            fd.append("bankLogo", $('#bankName').val());
            //fd.append(name,blob,"文件名称")
            fd.append("frontImage", frontImg, "frontImage.png");
            fd.append("backImage", backImg, "backImage.png");
            $('#tip').css('display', 'block');
            $.ajax({
                url: "/puhuihua/wechat/wallet/bindCard",
                type: "POST",
                data: fd,
                processData: false, // 不处理数据
                contentType: false, // 不设置内容类型
                success: function(data) {
                    $('#tip').css('display', 'none');
                    if (data.success) {
                        if (!!data.data) {
                            if (!!data.data.randomAmount) {
                                window.location.href = 'bind-bankCard-success.html?randomAmount=' + data.data.randomAmount;
                            } else {
                                window.location.href = 'bind-bankCard-success.html'
                            }
                        } else {
                            window.location.href = 'bind-bankCard-success.html'
                        }
                    } else {
                        if (data.errorCode == 3) {
                            mui.toast('验证码错误');
                        } else if (data.errorCode == 39) {
                            mui.toast('您已绑定银行卡');
                        } else if (data.errorCode == 37) {
                            mui.toast('银行卡绑定失败');
                        } else if (data.errorCode == 50) {
                            mui.toast(data.error);
                        } else if (data.errorCode == 0) {
                            mui.toast('网络开小差了');
                        }
                    }
                },
                error: function() {
                    $('#tip').css('display', 'none');
                    mui.toast('网络开小差了');
                }
            });
        } else {
            mui.toast('请输入6位验证码')
        }
    } else {
        $.each(errorArr, function(i, val) {
            if (i == 0) {
                mui.toast(errorArr[0])
            }
        });
    }
});

// back2('bind-bankCard.html');


$(function() {
    pushHistory();
    isEnter = window.sessionStorage.getItem('entry');
    // mui.toast(isEnter);
    var searchKey = window.location.search;
    var Enter = searchKey.split("=")[1];
    if (Enter == 'pack') {
        localStorage.setItem('from', 'pack');
    }
    window.addEventListener("popstate", function(e) {
        pushHistory();
        // mui.toast(isWX)
        if ($('.add-infor-wrap').css('visibility') == 'hidden') {
            $('.frontImage').attr('name', 'frontImg');
            $('.backImage').attr('name', 'backImg');
            $('.bankName').removeAttr('name');
            $('.cardNo').removeAttr('name');
            $('.reservedPhone').removeAttr('name');
            $('.securityCode').removeAttr('name');
            $('.bind-bank-wrap').css('visibility', 'hidden');
            setTimeout(function() {
                $('.nation-notice').css('display', 'block');
                $('.bank-tip-wrap').css('display', 'block');
                $('.add-infor-wrap').css('visibility', 'visible');
            }, 300)
        } else if (isEnter == 'convenient') {
            window.location.href = 'convenient-pay.html'
        } else if (Enter == 'puhuipay') {
            window.location.href = 'puhui-pay.html'
        } else {
            window.location.href = 'puhui-wallet.html'

        }
        // alert("我监听到了浏览器的返回按钮事件啦"); //根据自己的需求实现自己的功能 
    }, false);

    function pushHistory() {
        var state = {
            title: "title",
            url: " "
        };
        window.history.pushState(state, "title", " ");
    }

});