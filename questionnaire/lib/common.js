(function(w, d) {
    /*!APPserver************************************************/

    w.ebase = '//114.55.178.237:9094/';
    //w.ebase = '//192.168.2.240:9094/';
    //w.ebase = '//192.168.0.161:9094/';
    w.imgbase = '//img13.360buyimg.com/n0/'
    w.uploadbase = 'http://114.55.178.237:8980/';
    w.timeout = 30000; //请求超时时长
    /*!设备**/
    if (navigator.userAgent.indexOf('Android') > -1) {
        w.nativeTYPE = 'ANDROID';
    } else if (navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPad') > -1) {
        w.nativeTYPE = 'IOS';
    } else {
        w.nativeTYPE = 'PC';
    }

    w.storeToken = function(token) {
        localStorage.setItem('hexinpassJdToken', token);
    };
    w.getToken = function() {
        return localStorage.getItem('hexinpassJdToken');
    };
    w.storePhone = function(phone) {
        localStorage.setItem('hexinpassJdPhone', phone);
    };
    w.getPhone = function() {
        var phone = localStorage.getItem('hexinpassJdPhone');
        //return '13167956586';
        // return '18608027068';
        return phone;
    };
    w.storeOpenId = function(token) {
        localStorage.setItem('hexinpassJdOpenId', token);
    };
    w.getOpenId = function() {
        return localStorage.getItem('hexinpassJdOpenId');
    };

    w.appInterfaceReady = function(callBack, timeStamp) {
        var timeInteval = timeStamp;
        if (!timeStamp) {
            timeInteval = 200;
        }
        checkAppInterfaceReady(callBack, timeInteval);
    };

    function checkAppInterfaceReady(callBack, timeStamp) {
        if (window.app && window.app.isLogin && window.app.getAppUserPhone) {
            callBack();
        } else {
            setTimeout(function() {
                checkAppInterfaceReady(callBack, timeStamp);
            }, timeStamp);
        }
    }

    w.IO = function(param) {
        jQuery.ajax({
            url: ebase + param.url + '?v=' + new Date().getTime(),
            type: "POST",
            dataType: "JSON",
            data: param.data,
            success: function(data) {
                param.success(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                param.error(jqXHR, textStatus, errorThrown);
            }
        });
    };

    /*!dom查找封装**/
    w.getId = function(id) {
        return d.getElementById(id);
    };
    w.qs = function(selecter, em) {
        return em ? em.querySelectorAll(selecter) : d.querySelectorAll(selecter);
    };
    w.q = function(selecter, em) {
        return em ? em.querySelector(selecter) : d.querySelector(selecter);
    };

    /*!page common event**/
    mui('body').on('tap', '.mui-back', function() {
        history.back();
    });
    mui('body').on('tap', '.error', function() {
        document.body.removeChild(q('.error'));
        if (w.reqError) {
            reqError();
        }
    });

    /*!dom  get fg**/
    w.getFragment = function(dom) {
        //创建一个文档碎片
        var fragment = document.createDocumentFragment();
        if (!dom) {
            return fragment;
        }
        if (typeof dom === 'object') {
            fragment.appendChild(dom);
            return fragment;
        }
        dom = parseDom(dom);
        for (var i = 0, len = dom.length; i < len; i++) {
            fragment.appendChild(dom[i]);
        }
        return fragment;

    };
    w.parseDom = function(innerHTML) {　　
        var div = document.createElement('div');　　
        div.innerHTML = innerHTML;
        var childs = div.childNodes;
        var reNodes = [];
        //清理掉空格回车造成的 空白node
        for (var i = 0, len = childs.length; i < len; i++) {
            if (childs[i].nodeName !== "#text") {
                reNodes[reNodes.length] = childs[i];
            }
        }　　
        return reNodes;
    };

    /*!json **/
    w.ts = function(jsonObj, msg) {
        if (msg) {
            return msg + ':' + JSON.stringify(jsonObj);
        } else {
            return JSON.stringify(jsonObj);
        }

    };
    w.tb = function(str) {
        return JSON.parse(str);
    };

    /*!show msg **/
    w.showMsg = function(msg) {
        msg = '网络繁忙，请稍后再试!';
        mui.toast(msg);
    };

    /*!req get **/
    w.ctx = {
        setSid: function(sid) {
            localStorage.setItem('sid', sid);
        },
        getSid: function() {
            return localStorage.getItem('sid');
        },
        getUpData: function() {
            var option = localStorage.getItem('up-data') || '{}';
            return tb(option);
        },
        setNextData: function(option) {
            if (!option) {
                option = {};
            }
            localStorage.setItem('up-data', ts(option));
        }

    };
    w.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r) return unescape(r[2]);
        return null;
    };

    w.queryString = function(uri, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = uri.split('?')[1].match(reg);
        if (r) return unescape(r[2]);
        return null;
    };

    /*!page  loading **/
    w.showWaiting = function() {
        var f = document.createDocumentFragment();
        var ld = document.createElement('div');
        ld.className = 'waiting';
        ld.innerHTML = '<div class="wrap"><span class="spinner"></span><i class="spinner-in"></i></div>';
        f.appendChild(ld);
        document.body.appendChild(f);
    };
    w.closeWaiting = function() {
        var wt = q('.waiting');
        if (wt) {
            document.body.removeChild(wt);
        }
    };

    /*!page  template **/
    w._templatePage = function(sel, temp, data, reload) {
        var fragment = getFragment(template(temp, data));
        if (reload) {
            q(sel).innerHTML = '';
        }
        q(sel).appendChild(fragment);

    };
    w._error = function() {
        document.body.appendChild(getFragment('<div id="page-error" class="error"><div class="reqError" data-tg="1"><p>网络异常,请点击重试!</p><i></i></div></div>'));
    };

})(window, document);
/*!安卓后退 **/
(function($, window) {
    if ($.os.android || $.os.ios) {
        $.back = function() {
            if (window.android && android.goBack) {
                android.goBack();
            } else if (window.$$ && $$.goBack) {
                $$.goBack();
            } else {
                history.back();
            }
        };
    }
})(mui, window);
/*!设置错误信息是否显示 code **/
(function($, window) {
    $.AJAX_CODE_LOG = true;
})(mui, window);
/*!重写 mui toast **/
(function($, window) {
    $.toast = function(message, position) {
        if ($.os.plus) { //默认显示在底部
            plus.nativeUI.toast(message, { verticalAlign: position });
        } else {
            var toast = document.createElement('div');
            toast.style.cssText = 'position:fixed;z-index:9999;height: auto;overflow: hidden;width: 80%;left: 50%;margin-left: -40%;display: -webkit-box;-webkit-box-align: center;-webkit-box-pack: center;padding:0px;bottom: 55px;';
            toast.innerHTML = '<div style="padding: 8px 15px;margin: 0px;color: #fff;background-color: #333;display: inline-block;word-break:break-all;border-radius: 15px;line-height: normal;line-height: 16px;font-size: 14px;text-align:center;">' + message + '</div>';
            document.body.appendChild(toast);
            setTimeout(function() {
                document.body.removeChild(toast);
            }, 2000);
        }
    };
})(mui, window);

/* loading component */
function loadingComponent(s) {
    var component = new Object();

    var ele = document.createElement('div');
    ele.id = 'hexinpassLoadingComponent';
    ele.style.cssText = "width: 100%;height: 44px;line-height:44px;text-align: center;display: -webkit-box;-webkit-box-pack:center;-webkit-box-align:center;-webkit-box-orient: vertical;";

    var holder = document.createElement('div');
    ele.appendChild(holder);

    var spinnerTxt = document.createElement('div');
    spinnerTxt.style.cssText = 'display: -webkit-box;-webkit-box-pack:center;-webkit-box-align:center;-webkit-box-orient: horizontal;text-align: center;width: 100%;height: 24px;line-height: 24px;'
    holder.appendChild(spinnerTxt);

    var spinnerBg = document.createElement('div');
    spinnerBg.style.cssText = "width: 24px;height: 24px;"
    spinnerTxt.appendChild(spinnerBg);

    var img = document.createElement('div');
    img.className = 'mui-spinner';
    spinnerBg.appendChild(img);

    var desc = document.createElement('div');
    desc.style.cssText = "color: darkgray;font-size: 15px;padding-left: 10px;"
    desc.innerHTML = '正在加载，请稍候...';
    spinnerTxt.appendChild(desc);

    var noMoreDesc = document.createElement('div');
    noMoreDesc.style.cssText = "color: darkgray;font-size: 15px;text-align: center;width: 100%;display: none;";
    noMoreDesc.innerHTML = '亲爱的，已经到底了哟！';
    ele.appendChild(noMoreDesc);

    component.state = 0;

    component.setState = function(state) {
        component.state = state;
        if (state == 0) {
            holder.style.display = 'none';
            noMoreDesc.style.display = 'none';
        } else if (state == 1) {
            holder.style.display = 'block';
            noMoreDesc.style.display = 'none';
        } else if (state == 2) {
            holder.style.display = 'none';
            noMoreDesc.style.display = 'block';
        } else if (state == 10) {
            holder.style.display = 'block';
            noMoreDesc.style.display = 'none';
        }
        return component;
    }

    component.appendToParent = function(sel) {
        var parent = document.querySelector(sel);
        if (!parent.querySelector('#hexinpassLoadingComponent')) {
            parent.appendChild(ele);
        }
        return component;
    };

    component.removeDeriveParent = function(sel) {
        component.state = 0;
        var parent = document.querySelector(sel);
        if (parent.querySelector('#hexinpassLoadingComponent')) {
            parent.removeChild(ele);
        }
        return component;
    }

    return component.setState(s);
}

/*!ajax error jAjaxError-请求错误 sAjaxError-服务器错误**/
(function($, window) {
    $.jAjaxError = function(message, status) {
        if (!message) {
            messages = '服务器繁忙，请稍后再试';
        }
        if (status == 'abort') {
            return false;
        }
        switch (status) {
            case 'timeout':
                if ($.AJAX_CODE_LOG) {
                    message += '(E01)';
                }
                break;
            case 'error':
                if ($.AJAX_CODE_LOG) {
                    message += '(E02)';
                }
                break;
            default:
                break;
        }
        $.toast(message);
        console.log('错误代码：' + status);
    };
    $.sAjaxError = function(message, status) {
        if (!message) {
            messages = '服务器繁忙，请稍后再试';
        }
        if ($.AJAX_CODE_LOG) {
            message += '(S' + status + ')';
        }
        $.toast(message);
        console.log('错误代码：' + status);
    };
})(mui, window);
/*!ssessionStorage 存取 做时间戳判断处理**/
(function($, window) {
    $.saveSessionStorage = function(_key, _jsonstr) {
        if (window.sessionStorage) {
            sessionStorage.setItem(_key, ts({
                timestamp: new Date().getTime(),
                datasrc: _jsonstr
            }));
        }
    };
    $.getSessionStorage = function(_key, _timeout) {
        var re = null;
        if (window.sessionStorage) {
            var sessionData = sessionStorage.getItem(_key);
            if (sessionData) {
                sessionData = tb(sessionData);
                var timestamp = sessionData.timestamp;
                var datasrc = sessionData.datasrc;
                if (_timeout) {
                    var diff = (new Date().getTime() - timestamp) / 1000;
                    //此处可做过期缓存清除处理
                    if (diff <= _timeout) {
                        re = datasrc;
                    }
                } else {
                    re = datasrc;
                }
            }
        }
        return re;
    };
})(mui, window);
/*!判断 当前时间是否在某个时间段内**/
(function($, window) {
    $.timeRange = function(beginTime, endTime) {
        var strb = beginTime.split(":");
        if (strb.length != 2) {
            return false;
        }
        var stre = endTime.split(":");
        if (stre.length != 2) {
            return false;
        }
        var b = new Date();
        var e = new Date();
        var n = new Date();
        b.setHours(strb[0]);
        b.setMinutes(strb[1]);
        e.setHours(stre[0]);
        e.setMinutes(stre[1]);
        if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
            return true;
        } else {
            return false;
        }
    };
})(mui, window);
/*!jq ajax 包装至 mui下**/
(function($, window) {
    $.jQajax = function(ajaxSetting) {
        if (!ajaxSetting.dataType) {
            ajaxSetting.dataType = 'json';
        }
        if (!ajaxSetting.type) {
            ajaxSetting.type = 'post';
        }
        if (!ajaxSetting.timeout) {
            ajaxSetting.timeout = window.timeout;
        }
        if (ajaxSetting.data) {
            ajaxSetting.data.date = new Date().getTime();
            ajaxSetting.data.keycode = '740b48b5c6836491ccb4bfc902b5d668';
            ajaxSetting.data = ts(ajaxSetting.data);
        }
        jQuery.ajax(ajaxSetting);
    };
})(mui, window);



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