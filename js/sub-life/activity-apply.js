/**
 * Created by Administrator on 2017/2/22.
 */
//获取身份令牌
var token = local.getItem('token');
if (!token) {
    window.location.href = '../remit-member/login.html';
    sessionStorage.setItem('page', 7);
} else {
    $.post('/puhuihua/wechat/userInfo/validateToken', {
        token: token + '_' + terminal
    }, function(data) {
        if (!data.success) {
            local.removeItem('token');
            window.location.href = '../remit-member/login.html';
            sessionStorage.setItem('page', 7);
        }
    }, 'json');
}
var check = true;
var searchKey = window.location.search;
var strs = searchKey.split("=");
var issueId = strs[1].split("&")[0];
var infor = decodeURI(strs[2]).split(',');
//获取配置内容
$.each(infor.reverse(), function(i, val) {
    $('form').prepend(' <div class="mui-input-row">' +
        '<div class="border-btm">' +
        '<label>' + val + '</label>' +
        '<input type="text" class="input" value="" placeholder="请输入' + val + '" />' +
        '</div>' +
        '</div>');
});

var myImg = null;

function getPic(file) {
    if (file.files && file.files[0]) {
        var reader = new FileReader();
        reader.onload = function(evt) {
            // 调用函数处理图片 　　　　　　　　　　　　　　　　
            dealImage(evt.target.result, {
                // 注意：在pc端可以用绝对路径或相对路径，移动端最好用绝对路径）
                width: 200
            }, function(base) {
                //直接将获取到的base64的字符串，放到一个image标签中就可看到测试后的压缩之后的样式图了
                myImg = dataURLtoBlob(base);
                console.log(myImg);
                // console.log("压缩后：" + base.length / 1024 + " " + base);
            })
        };
        reader.readAsDataURL(file.files[0]);
    }
}
$('#imageFile').change(function() {
    /*请求后台*/
    var file = $(this).val();
    var AllImgExt = ".jpg|.jpeg|.gif|.bmp|.png|";
    var extName = file.substring(file.lastIndexOf(".")).toLowerCase(); //（把路径中的所有字母全部转换为小写）
    if (AllImgExt.indexOf(extName + "|") < 0 && file.indexOf('image') < 0) {
        $('.input-file').val('');
        mui.toast('请上传报名所需图片资料');
        myImg = null;
    } else {
        $('.input-file').val($(this).val())
    }
    if ($(this).val()) {
        getPic(this);
    }
});

//普惠活动报名信息提交
mui('body').on('tap', '.apply-btn', function() {
    check = true;
    $('input').blur();
    var details = '';
    $('.input').each(function(i, val) {
        $(this).val();
        if (i == 0) {
            details = $(this).prev().text() + ':' + $(this).val();
        } else {
            details = details + ';' + $(this).prev().text() + ':' + $(this).val();
        }
    });
    $('.input').each(function() {
        if ($(this).val() == '') {
            check = false;
        }
        if ($.trim($(this).val()).length == 0) {
            check = false;
        }
    });
    if (check) {
        // $('#tip').css('display', 'block');
        var fd = new FormData(document.getElementById("form-submit"));
        fd.append("token", token + '_' + terminal);
        fd.append("issueId", issueId);
        fd.append("details", details);
        //fd.append(name,blob,"文件名称")
        try {
            fd.append("imageFile", myImg, "myImg.png");
        } catch (e) {
            // mui.toast(e);
        }
        $('#tip').css('display', 'block');

        $.ajax({
            url: "/puhuihua/wechat/activity/activityApply",
            type: "POST",
            data: fd,
            processData: false, // 不处理数据
            contentType: false, // 不设置内容类型
            success: function(data) {
                $('#tip').css('display', 'none');
                if (data.success) {
                    sessionStorage.setItem("activityPageId", 1)
                    window.location.href = 'apply-success.html';
                } else if (data.errorCode == 8) {
                    mui.alert('身份验证出错' + '<br/>' + '前去登录', '提示', '是', function(e) {
                        window.location.href = '../remit-member/login.html';
                        sessionStorage.setItem('page', 7);
                    });
                } else if (data.errorCode == 15) {
                    setTimeout(function() {
                        mui.toast('您已报名');
                    }, 200)
                } else if (data.errorCode == 0) {
                    setTimeout(function() {
                        mui.toast('网络开小差了');
                    }, 200)
                } else if (data.errorCode == 28) {
                    setTimeout(function() {
                        mui.toast('报名人数已满')
                    }, 200)
                } else {
                    window.location.href = 'apply-fail.html';
                }
            }
        });
    } else {
        setTimeout(function() {
            mui.toast('请完成报名资料的填写');
        }, 200)
    }
});