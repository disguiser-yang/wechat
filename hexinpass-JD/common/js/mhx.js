;!function(){
	
	window.mhx = {};
	
	mhx.mhxReady = function (callback){
		
		if (/complete|loaded|interactive/.test(document.readyState)) {
			
			mhx.appReady(callback);
			
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				
				mhx.appReady(callback);
				
			}, false);
		}
		
		return this;
	};
	
	var appIsReady=false;
	
	mhx.appReady = function(callback) {
		
		if (window.app) {
			
			appIsReady=true;
			setTimeout(function() {
				callback(mhx);
			}, 0);
		} else {
			
			document.addEventListener("appReady", function(e) {
				
				appIsReady=true;
//				callback(mhx); //此处为正确触发方式
			}, false);
			
			mhx.checkAppIsReady(20,callback);//临时采用轮询监听触发
		}
		return this;
	};
	
	mhx.checkAppIsReady=function(i,callback){
		
		setTimeout(function() {
			
			if (appIsReady || window.app) {
				
				callback(mhx);
			} else {
				if (i && i > 0) {
					i--;
					arguments.callee(i,callback);
				} else {
					appIsReady=true;
					callback(mhx);
				}
			}
		}, 100);
	};
	
}();
