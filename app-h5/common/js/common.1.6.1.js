/**window 下常用func以及参数*/
(function(w) {
	w.ebase = 'http://192.168.2.200'; //服务器接口地址

	w.getFragment = function(dom) {
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

	w.templatePage = function(sel, temp, data, reload) {
		var fragment = getFragment(template(temp, data));
		var wrap = document.querySelector(sel);
		if (reload) {
			wrap.innerHTML = '';
		}
		wrap.appendChild(fragment);
	};

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

	w.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r) return unescape(r[2]);
		return null;
	};

})(window);

/**  UI   */
var appui = (function(w) {
	var $_ = {};
	var appuiLoading=null;
	$_.openWatting = function() {
		var element = document.createElement('div');
		element.className='appui-loading';
		element.innerHTML='<div class="appui-loading-playwrap"><div class="appui-loading-play"></div></div>';
		return appuiLoading=document.body.appendChild(element);
	};
	$_.closeWatting = function() {
		if(appuiLoading){
			appuiLoading.addEventListener('webkitTransitionEnd',onLoadingHidden);
			appuiLoading.classList.add('hide');
		}
	};
	var onLoadingHidden=function(e){
		this.style.display='none';
		this.removeEventListener('webkitTransitionEnd', onLoadingHidden);
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
	return $_;

})(window);