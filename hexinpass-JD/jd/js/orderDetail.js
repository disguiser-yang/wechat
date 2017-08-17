$(function(){
	mui.init();
	
	var orderId = getQueryString('order');
	var jdOrderId = getQueryString('jdorder');
	var split = getQueryString('split');
	if (orderId != null && jdOrderId != null && split != null) {
		var data = null;
		if (split == '0') {
			data = {'phone':getPhone(), 'orderId':orderId};
		} else {
			data = {'phone':getPhone(), 'orderId':orderId, 'jdOrderId': jdOrderId};
		}
		requestOrder(data);
	}
});

function requestOrder(postData) {
	appui.showHUD();
	window.IO({ 
		url:'getUserOrderDetailById', 
		data:ts(postData),
		success: function(data){
			console.log(data);
			if (data.success == 1) {
				appui.removeHUD();
				generateUI(data);
			} else {
				appui.removeHUD(2, '加载失败，请稍后再试');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
}

function generateUI(data) {
	var dateStr = new Date(parseInt(data.results.createTime)*1000).pattern("yyyy-MM-dd HH:mm:ss");
	var encryptPhone = data.results.logisticsPhone;
	if (encryptPhone.length == 11) {
		encryptPhone = encryptPhone.substr(0, 3)+'****'+encryptPhone.substr(7, 11);
	}
	_templatePage('#content', 'contentTemplateId', {item: data.results, time:dateStr, encryptPhone: encryptPhone, imgbase:imgbase}, true)
	startCounter(data);
				
	mui('#state1Operator').on('tap', '.order-operate-pay', function(){
		location.href = 'payOrder.html?order='+getQueryString('order')+'&time='+this.getAttribute('time')+'&money='+this.getAttribute('money');
	});
	mui('#state1Operator').on('tap', '.order-operate-cancel', function(){
		cancelOrder();
	});
	mui('body').on('tap', '.order-goodlist-item-service', function(){
		location.href = 'afterSaleService.html?order='+this.getAttribute('order')+'&jdorder='+this.getAttribute('jdorder')+'&sku='+this.getAttribute('sku')+'&num='+this.getAttribute('num')+'&price='+this.getAttribute('price');
	});
	mui('body').on('tap', '.order-goodlist-item', function(){
		location.href = 'detail.html?sku='+this.getAttribute('sku');
	});
}

function cancelOrder() {
	mui.confirm('确定取消该订单？', '提示', ['取消', '确定'], function(ret){
		if (ret.index == 1) {
			appui.showHUD();
			window.IO({ 
				url:'cancelOrder',
				data:ts({
					'phone': getPhone(),
					'orderId':getQueryString('order')
				}),
				success: function(data){
					console.log(data); 
					if (data.success == 1) {
						appui.removeHUD(1, '取消成功');
						setTimeout(function(){
							location.href = 'order.html';
						}, 2000);
					} else { 
						appui.removeHUD(2, '取消失败，请稍后再试');
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					appui.removeHUD(2, '网络开小差咯');
				}
			});
		}
	});
}

var timeOut = 0;
function startCounter(data) {
	if (data.results.state == 1 && data.results.timeOut != -1) {
		timeOut = data.results.timeOut;
		count();
	}
}

function count() {
	timeOut--;
	var timeDiv = q('#timeCounter');
	if (timeOut <= 0) {
		if (timeDiv) {
			timeDiv.innerHTML = '该订单已过期';
			$('#state1Operator').hide();
		}
		return;
	}
	var hour = parseInt(timeOut/3600);
	var	minute = parseInt((timeOut%3600)/60);
	var	second = timeOut%60;
	if (hour == 0) {
		if (minute == 0) {
			timeDiv.innerHTML = second+'秒';
		} else {
			timeDiv.innerHTML = minute+'分钟'+second+'秒';
		}
	} else {
		timeDiv.innerHTML = hour+'小时'+minute+'分钟'+second+'秒';
	}
	setTimeout(count, 1000);
}
