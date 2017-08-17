/**
 * Created by Lihuan on 2017/1/10.
 */
var checked = false;
//获取身份令牌
getToken(1);

//让留言域如果没有内容时失去焦点时显示提示字符
$(document).on('input', '.words-textarea', function() {
    $('.residue-word').text($(this).val().trim().length);
    if ($(this).val().trim() == '') {
        $('.my-btn-cancel').css({
            'border-color': "#ccc",
            'background-color': '#ccc'
        });
        checked = false;
    } else {
        $('.my-btn-cancel').css({
            'border-color': "#EC2719",
            'background-color': '#EC2719'
        });
        if ($(this).val().trim().length >= 300) {
            var wordsSubstr = $(this).val().trim().substring(0, 300);
            $(this).val(wordsSubstr);
            $('.residue-word').text(wordsSubstr.length);
        }
        checked = true;
    }
});

//提交留言
$(document).on('click', '.my-btn-cancel', function() {
    if (checked) {
        var content = $('.words-textarea').val().trim();
        if (content.length <= 300) {
            $('#tip').css('display', 'block');
            $.post('/puhuihua/wechat/userInfo/leaveWords', {
                content: content,
                token: token + '_' + terminal
            }, function(data) {
                $('#tip').css('display', 'none');
                if (data.success) {
                    window.location.href = 'interaction-leave-success.html';
                } else if (data.errorCode == 8) {
                    mui.alert('身份验证出错' + '<br/>' + '前去登录', '提示', '是', function(e) {
                        window.location.href = 'login.html';
                        sessionStorage.setItem('page', 1);
                    })
                } else if (data.errorCode == 0) {
                    mui.toast('网络开小差了')
                } else {
                    window.location.href = 'interaction-leave-fail.html';
                }
            }, 'json');
        }
    }
});



$(function() {
    pushHistory();
    window.addEventListener("popstate", function(e) {
        //alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
        window.location.href = 'interaction.html'
    }, false);

    function pushHistory() {
        window.history.pushState('', "title", "#");
    }

});