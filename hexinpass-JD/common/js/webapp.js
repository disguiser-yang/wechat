/*! webapp appui需引入appui.css */
;!function() {
	window.getFragment = function(dom) {
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
	window.parseDom = function(innerHTML) {　　
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
	window.templatePage = function(sel, temp, data, reload) {
		var fragment = getFragment(template(temp, data));
		var wrap = document.querySelector(sel);
		if (reload) {
			wrap.innerHTML = '';
		}
		wrap.appendChild(fragment);
	};
	window.ts = function(jsonObj, msg) {
		if (msg) {
			return msg + ':' + JSON.stringify(jsonObj);
		} else {
			return JSON.stringify(jsonObj);
		}
	};
	window.tb = function(str) {
		return JSON.parse(str);
	};
	window.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r) return unescape(r[2]);
		return null;
	};
	window.openView = function(url, title) {
		if (window.app && app.openView) {
			app.openView(ts({
				"url": url,
				"opt": {
					"goback": true,
					"title": title
				}
			}));
		}else{
			location.href=url;
		}
	};
	
}();
/!*  ui  */
var appui = (function() {
	var $_ = {};
	var appuiLoading=null;
	var confirm_=null;
	$_.openWatting = function() {
		var element = document.createElement('div');
		element.className='appui-loading';
		element.innerHTML='<div class="appui-loading-playwrap"><div class="appui-loading-play"></div></div>';
		return appuiLoading=document.body.appendChild(element);
	};
	$_.closeWatting = function() {
		if(appuiLoading){
			appuiLoading.addEventListener('webkitAnimationEnd',onLoadingHidden);
			appuiLoading.classList.add('hide');
		}
	};
	var onLoadingHidden=function(e){
		this.style.display='none';
		this.removeEventListener('webkitAnimationEnd', onLoadingHidden);
	};
	$_.showNullData=function(){
		var element = document.createElement('div');
		element.className='appui-nullBox';
		document.body.appendChild(element);
	};
	//toast 
	$_.toast=function(msg){
		if(!msg){
			msg='';
		}
		var element = document.createElement('div');
		element.className='appui-toast';
		element.innerHTML='<div class="appui-toast-text">'+msg+'</div>';
		document.body.appendChild(element);
		setTimeout(function(){
			element.addEventListener('webkitAnimationEnd',onToastRemove);
			element.classList.add('bounceOut');
		},2500);
	};
    var onToastRemove=function(e){
    		this.style.display='none';
		this.removeEventListener('webkitAnimationEnd', onToastRemove);
		document.body.removeChild(this);
    };
    //confirm
    $_.confirm=function(msg,subText,callback,ask){
    		if(document.querySelector('.appui-confirm')){
    			return false;
    		}
    		document.body.addEventListener('touchmove',mui.preventDefault);
    		if(!msg){
			msg='';
		}
    		if(!subText){
    			subText='确定';
    		}
    		var element = document.createElement('div');
		element.className='appui-confirm';
		element.innerHTML='';
		var inner='<div class="appui-confirm-wrap">'+
						'<div class="appui-confirm-msg">'+msg+'</div>'+
						'<div class="appui-confirm-btn">';
		 if(!ask){
		 	inner+='<span class="appui-confirm-btn-cancel">取消</span>';
		 }
		inner+='<span class="appui-confirm-btn-sub">'+subText+'</span>'+
						'</div>'+
					'</div>';
		element.innerHTML=inner;			
		document.body.appendChild(element);
		confirm_={};
		confirm_.callback=callback;
		confirm_.ele=element;
		element.addEventListener('tap',confirmClick);
    }
    //confirm 点击
    var confirmClick=function(e){
    		document.body.removeEventListener('touchmove',mui.preventDefault);
    		var clickObj=e.target;
    		if(clickObj.classList.contains('appui-confirm-btn-sub')){
	    		if(confirm_&&confirm_.ele){
	    			confirm_.ele.removeEventListener('tap',confirmClick);
	    			document.body.removeChild(confirm_.ele);
	    		}
    			if(confirm_&&confirm_.callback){
    				confirm_.callback();
    			}
    		}else if(clickObj.classList.contains('appui-confirm-btn-cancel')){
    			if(confirm_&&confirm_.ele){
	    			confirm_.ele.removeEventListener('tap',confirmClick);
	    			document.body.removeChild(confirm_.ele);
	    		}
    		}
    };
	return $_;

})();
/!*  uitl  */
!function(){
	/**
	对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
	可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
	Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
	(new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
	(new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
	(new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
	(new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	**/
	Date.prototype.pattern=function(fmt) {         
	    var o = {         
	    "M+" : this.getMonth()+1, //月份         
	    "d+" : this.getDate(), //日         
	    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
	    "H+" : this.getHours(), //小时         
	    "m+" : this.getMinutes(), //分         
	    "s+" : this.getSeconds(), //秒         
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
	    "S" : this.getMilliseconds() //毫秒         
	    };         
	    var week = {         
	    "0" : "/u65e5",         
	    "1" : "/u4e00",         
	    "2" : "/u4e8c",         
	    "3" : "/u4e09",         
	    "4" : "/u56db",         
	    "5" : "/u4e94",         
	    "6" : "/u516d"        
	    };         
	    if(/(y+)/.test(fmt)){         
	        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
	    }         
	    if(/(E+)/.test(fmt)){         
	        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
	    }         
	    for(var k in o){         
	        if(new RegExp("("+ k +")").test(fmt)){         
	            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
	        }         
	    }         
	    return fmt;         
	}     
}();
//图片加载成功后显示
! function() {
	
	
	window.imgLoad = function(elements,placeholder) {
		if (elements && elements.length > 0) {
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				var uri = element.getAttribute('data-imgload');
				set(element, uri,placeholder);
			}
		}
	};

	function set(element, uri,placeholder) {
		var img = new Image();
		img.onload = function() {
			element.src = uri;
			element.classList.add('m-img-load');
		};
		img.onerror = function() {
			if(placeholder){
				element.src = placeholder;
			}
		};
		img.src = uri;
		element.removeAttribute('data-imgload');
	}
}();
//设备标识
! function() {
	if (window.mui) {
		if (mui.os.ios) {
			document.documentElement.classList.add('m-ios');
		} else if (mui.os.android) {
			document.documentElement.classList.add('m-android');
		}
	}
}();
! function($) {
	$.m$d5KC=function(a,b){
		return $.md5(b+a);
	}
	$.md={};
	$.md.fullNull=function(){
		var element = document.createElement('div');
		element.className='m-fullNull';
		element.innerHTML='<i></i><label>暂时没有东东哟</label>';
		return document.body.appendChild(element);
	};
	/**修改title*/
	$.md.setTitle=function(title) {
		if(window.app&&app.setHtmlTitle){//调用原生修改title
			app.setHtmlTitle(title);
		}else{
			document.title = title;
			var _iframe = Zepto('<iframe style="display: none;" src="/favicon.ico"></iframe>').on('load', function() {
				setTimeout(function(){
					_iframe.off('load').remove();
				}, 0)
			}).appendTo(Zepto(document.body));
		}
	};
	/**转码*/
	$.md.htmlDecode=function(text) {
		var temp = document.createElement("div");
		temp.innerHTML = text;
		var output = temp.innerText || temp.textContent;
		temp = null;
		return output;
	};
	/**获取sid*/
	$.getSid=function(){
		var sid=sessionStorage.getItem('_st');
		if(sid) return sid;
		if(window.app&&app.getSid){
			sid=app.getSid();
		}else{
			sid=getQueryString('sid');
		}
		if(sid)sessionStorage.setItem('_st',sid);
		return sid?sid:'-1';
	};
	/**设置sid*/
	$.setSid=function(sid){
		sessionStorage.setItem('_st',sid);
		if(window.app&&app.setSid){
			app.setSid(ts({
				sid:sid
			}));//设置sid
		}
		return sid;
	};
	/**获取keyCode*/
	$.getKeyCode=function(){
		if(window.app&&app.getKeyCode){
			return app.getKeyCode();//返回keyCode
		}else{
			return '-1';
		}
	};
	/****获取登录---原生*****/
	$.login = function(){
		if(window.app && app.login){
			return app.login();
		}else{
			return '-1';
		}
	};
	$.timeStamp=function(){
		return new Date().getTime();
	};
	$.appVersion=function(){
		return 'web-h5';
	};
	$.channel=function(){
		return '010';
	};
	$.errorMsg=function(){
		return '网络开小差咯';
	};
	$.loadComplete=function(){
		return '亲爱滴，已经到底咯！';
	};
	$.loading=function(){
		return '加载中...';
	};
}(mui);
/**数据格式化*/
! function($) {
	
	$.format = {};
	//格式化卡号
	$.format.hexCard = function(hexCardNumber){
		var _hexCardNumber=hexCardNumber||'';
		return _hexCardNumber.replace(/(\d{5})/g,'$1 ').replace(/\s*$/,'');
	};
	//格式化人民币
	$.format.price = function(hexPrice,hexUnit){
		var _hexUnit=hexUnit||'元';
		var _hexPrice=hexPrice||0;
		if(typeof(_hexPrice)=="string"){
			_hexPrice=parseFloat(_hexPrice);
		}
		switch (hexUnit){
			case '角':
				_hexPrice=_hexPrice/10;
				break;
			case '分':
				_hexPrice=_hexPrice/100;
				break;
			default:
				break;
		}
		return _hexPrice.toFixed(2);
	};
	
}(mui);
//重写ready
! function($) {
	var appIsReady=false;
	$.pageReady = function(callback) {
		if (/complete|loaded|interactive/.test(document.readyState)) {
			$.appReady(callback);
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				$.appReady(callback);
			}, false);
		}
		return this;
	};
	$.appReady = function(callback) {
		if (window.app) {
			appIsReady=true;
			setTimeout(function() { //解决callback与plusready事件的执行时机问题
				$.getSid();
				callback($);
			}, 0);
		} else {
			document.addEventListener("appReady", function(e) {
				appIsReady=true;
				$.getSid();
				//callback($);
			}, false);
			$.checkAppIsReady(30,callback);
		}
		return this;
	};
	//为了兼容老版本 循环检测app接口是否注入完毕
	$.checkAppIsReady=function(i,callback){
		setTimeout(function() {
			if (appIsReady || window.app) {
				$.getSid();
				callback($);
			} else {
				if (i && i > 0) {
					i--;
					arguments.callee(i,callback);
				} else {
					appIsReady=true;
					$.getSid();
					callback($);
				}
			}
		}, 100);
	};
}(mui);