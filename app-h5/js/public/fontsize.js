/**
 * Created by lihuan on 2017/1/3.
 */
window.onload = function() {
    document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 16 + 'px';
};
window.onresize = function() {
    document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 16 + 'px';
};
//当页面加载状态改变的时候执行这个方法.
document.onreadystatechange = loadingChange;

function loadingChange() {
    //console.log(document.readyState);
    //当页面加载状态为完全结束时进入
    if (document.readyState == "complete") {
        //当页面加载完成后将loading页隐藏
        var load = document.getElementById('load-wrap');
        var wrap = document.getElementById('wrap');
        if (load) {
            load.style.display = 'none';
        } else if (wrap) {
            wrap.style.display = 'block';
        }
    }
}
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var isWX = u.indexOf('MicroMessenger') > -1; //微信
var terminal = '';
if (isWX) {
    terminal = 'wechat';
} else {
    terminal = 'app';
}
//token处理
var local = window.localStorage;
if (isAndroid && !isWX) {
    local = window.android;
}
var token = local.getItem('token');
//获取身份令牌
function getToken(page) {
    token = local.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        sessionStorage.setItem('page', page);
    } else {
        $.post('/puhuihua/wechat/userInfo/validateToken', {
            token: token + '_' + terminal
        }, function(data) {
            if (!data.success) {
                local.removeItem('token');
                window.location.href = 'login.html';
                sessionStorage.setItem('page', page);
            }
        }, 'json');
    }
}
//判断是否有支付密码的方法
function hasPayPassword(page, pageId, setPwdPage, startPage) {
    mui.post('/puhuihua/wechat/wallet/hasPayPassword', {
        token: token + '_' + terminal
    }, function(data) {
        if (data.success) {
            if (!data.data) {
                mui.confirm('请先设置支付密码', '提示', ['取消', '确认'], function(e) {
                    if (e.index == 1) {
                        window.location.href = setPwdPage + '.html';
                        sessionStorage.setItem('setPwd', pageId)
                    }
                })
            } else {
                window.location.href = page;
            }
        } else if (data.errorCode == 8) {
            mui.confirm('身份验证出错' + '<br/>' + '前去登录', '提示', ['取消', '确认'], function(e) {
                if (e.index == 1) {
                    window.location.href = '../remit-member/login.html';
                    sessionStorage.setItem('page', startPage);
                }
            });
        } else if (data.errorCode == 0) {
            mui.toast('网络开小差了')
        }
    }, 'json');
}

//只允许输入数字并且可以控制数字长度的方法
function isNum(obj, num) {
    var $this = obj;
    if (isNaN($this.val().trim())) {
        if (!isNaN(parseInt($this.val()))) {
            $this.val(parseInt($this.val()))
        } else {
            $this.val('')
        }
    }
    if ($this.val().length > num) {
        $this.val(("" + $this.val()).substring(0, num));
    }
}

function back(url) {
    pushHistory();
    if (window.__wxjs_is_wkwebview || isiOS) {
        window.addEventListener('pageshow', function(e) {
            var ifBack = 0;
            if (e.persisted) {
                ifBack = 1;
            } else {
                ifBack = 0;
            }

            window.onpopstate = function(e) {
                if (ifBack != 1) {
                    ifBack = 0;
                    // 监听到了浏览器的返回按钮事件
                    var obj = {
                        'taskName': 'close',
                        'data': {
                            'pageName': url
                        }
                    };
                    var jsonObj = JSON.stringify(obj);
                    if (isWX) {
                        WeixinJSBridge.call('closeWindow');
                    } else if (isiOS) {
                        window.webkit.messageHandlers.nativeHandler.postMessage(jsonObj);
                    }
                } else {
                    //屏蔽上一个页面返回时触发
                    ifBack++;

                }
            }
        })
    } else {
        window.onpopstate = function(e) {
            //监听到了浏览器的返回按钮事件
            var obj = {
                'taskName': 'close',
                'data': {
                    'pageName': url
                }
            };
            var jsonObj = JSON.stringify(obj);
            if (isWX) {
                WeixinJSBridge.call('closeWindow');
            } else if (isAndroid) {
                window.app.nativeHandler(jsonObj);
            }
        };
    }

    function pushHistory() {
        window.history.pushState('', "title", "");
    }
}

function back2(html) {
    window.onpageshow = function(e) {
        //alert('pageshow bind-bankCard'+e.persisted );
        pushHistory();
    };
    window.addEventListener("popstate", function(e) {
        //监听到了浏览器的返回按钮事件
        if ((isiOS && !window.__wxjs_is_wkwebview)) {
            window.location.href = html;
        } else {
            window.location.href = '/puhuihua/static/wechat/template/remit-member/puhui-wallet.html';
        }
    }, false);

    function pushHistory() {
        if (isiOS && !window.__wxjs_is_wkwebview) {
            window.history.replaceState({}, "", "");
        } else {
            window.history.pushState({}, "", "");
        }
    }
}



// //JS操作cookies方法!
// //写cookies
// function setCookie(name, value) {
//     var Days = 30;
//     var exp = new Date();
//     exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
//     document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=.scshangtong.com";
// }

// //读取cookies
// function getCookie(name) {
//     var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//     if (arr = document.cookie.match(reg))
//         return unescape(arr[2]);
//     else
//         return null;
// }

// //删除cookies
// function delCookie(name) {
//     var exp = new Date();
//     exp.setTime(exp.getTime() - 1);
//     var cval = getCookie(name);
//     if (cval != null)
//         document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;domain=.scshangtong.com";
// }