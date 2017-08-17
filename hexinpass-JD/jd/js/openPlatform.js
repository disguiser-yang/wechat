
/* native app login and callback with phone */
function appLoginGetData(token, callback) {
	if (!window.app) {
		callback({
			'success':0, 
			'code':10000,
			'msg':'请使用APP打开',
			'results':null
		});
		return;
	}
	
	appLoginCallback = callback;
	appLoginToken = token;
	if (window.app.isLogin()) {
		window.app.getAppUserPhone(token);
	} else {
		window.app.login();
	}
} 

var appLoginCallback = null;
var appLoginToken = null;
var mhx = new Object();
mhx.getAppUserPhoneCallback = function(data) {
	//mui.alert(JSON.stringify(data));
	if (data.success == 1) {
		appLoginCallback({
			'success':1,
			'code':0,
			'msg':'获取用户手机号成功',
			'results':data.results
		});
	} else {
		appLoginCallback({
			'success':0,
			'code':10001,
			'msg':'获取用户手机号失败：'+data.msg,
			'results':null
		});
	}
};

mhx.loginCallback = function() {
	window.app.getAppUserPhone(appLoginToken);
}

