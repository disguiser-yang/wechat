/**
 * Created by lihuan on 2017/1/10.
 */
//获取身份令牌
getToken(6);
if (isWX) {
    $('#modify-pwd').css('display', 'block');
    //判断是否有支付密码
    mui.post('/puhuihua/wechat/wallet/hasPayPassword', {
        token: token + '_' + terminal
    }, function(data) {
        if (data.success) {
            if (!data.data) {
                $('#set-pay-pwd').css('display', 'block')
            } else {
                $('#modify-pay-pwd,#forget-pay-pwd').css('display', 'block')
            }
        }
    }, 'json');
}

mui.post('/puhuihua/wechat/userInfo/myCenter', {
    token: token + '_' + terminal
}, function(data) {
    if (data.success) {
        var dataJson = data.data;
        if (dataJson.headImage) {
            $('.mui-input-group .input-file #headImg').css('backgroundImage', 'url("' + dataJson.headImage + '")')
        }
        $('.nickname').text(dataJson.nickname);
        $('.phone').text(dataJson.phone);
        if (dataJson.member) {
            $('#vip-infor').css('display', 'block');
            $('.name').text(dataJson.name);
            $('.gender').text(dataJson.gender);
            $('.nationality').text(dataJson.nationality);
            $('.unionName').text(dataJson.unionName);
        }
    } else if (data.errorCode == 0) {
        mui.toast('网络开小差了')
    }
}, 'json');
mui('body').on('tap', '#nick-name', function() {
    window.location.href = 'modify-nick-name.html'
});
mui('body').on('tap', '#modify-pwd', function() {
    window.location.href = 'modify-pwd.html'
});
mui('body').on('tap', '#set-pay-pwd', function() {
    sessionStorage.setItem('setPwd', 2);
    window.location.href = 'set-pay-pwd.html';
});
mui('body').on('tap', '#modify-pay-pwd', function() {
    window.location.href = 'reset-pay-pwd.html'
});
mui('body').on('tap', '#forget-pay-pwd', function() {
    window.location.href = 'forget-pay-pwd.html'
});

var myImg = null;

function getPic(file, imageDiv) {
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
                var fd = new FormData(document.getElementById("form-submit"));
                fd.append("token", token + '_' + terminal);
                //fd.append(name,blob,"文件名称")
                fd.append("headImageFile", myImg, "myImg.png");
                $('#tip').css('display', 'block');
                $.ajax({
                    url: "/puhuihua/wechat/userInfo/modifyHeadImage",
                    type: "POST",
                    data: fd,
                    processData: false, // 不处理数据
                    contentType: false, // 不设置内容类型
                    success: function(data) {
                        $('#tip').css('display', 'none');
                        if (data.success) {
                            if (data.data) {
                                $('.mui-input-group .input-file #headImg').css('backgroundImage', 'url("' + data.data + '")');
                            }
                            mui.toast('上传成功');
                        } else {
                            mui.toast('上传失败');
                        }
                    }
                });
            })
        };
        reader.readAsDataURL(file.files[0]);
    }
}
$('#file').change(function() {
    /*请求后台*/
    uploadFile($(this));
    if ($(this).val()) {
        var imageDiv = document.getElementById('headImg');
        getPic(this, imageDiv);
    }
});

//操作回退的历史记录
// back('personal-center')


$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        if (isWX) {
            window.location.href = 'personal.html';
        } else if (isAndroid) {
            window.app.nativeHandler(jsonObj);
        } else if (isiOS) {
            window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
        }
    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "");
    }

});




// mui('body').on('tap', '#simulation', function() {

//     // 模拟新用户
//     mui.confirm('是否模拟新用户？', '提示', ['取消', '模拟'], function(e) {
//         if (e.index == 1) {
//             local.setItem('simulation', 'yes')
//         } else {
//             local.setItem('simulation', 'no')

//         }

//     })
// });