$(function(){
	mui.init();
	
	$('#orderId').height($(window).height()-55+'px');
	
	mui('#orderId').on('tap', '.order-address', function(){
		var addressId = this.getAttribute('addressid');
		if (addressId != null && addressId != '' && addressId != 0 && addressId != '0' && typeof(addressId) != 'undefined') {
			location.href = 'addressManage.html?sku='+getQueryString('sku');
		} else {
			location.href = 'addressEdit.html?sku='+getQueryString('sku')+'&straight=1';
		}
	});
	
	mui('body').on('tap', '#submitBtn', function(){
		var addressId = parseInt(q('#addressId').getAttribute('addressid'));
		if (addressId == 0) {
			appui.toast('请先添加收货地址');
			return;
		} 
		
		var stockedSku = new Array();
		$('.order-list-item').each(function(){
			var stockId = this.getAttribute('stockid');
			if (stockId == '33' || stockId == '39' || stockId == '40') {
				stockedSku.push(parseInt(this.getAttribute('sku')));
			}
		});
		if (stockedSku.length == 0) {
			mui.alert('您选购的商品全部无货或不支持您当前收货地区的配送', '', '返回购物车', function(){
				location.replace('shopcart.html');
			});
		} else {
			if (stockedSku.length < $('.order-list-item').length) {
				mui.confirm('您选购的商品部分无货，是否继续购买有货商品？', '提示', ['返回购物车', '继续购买'], function(result){
					if (result.index == 0) {
						location.replace('shopcart.html');
					} else {
						requestOrder(stockedSku, addressId);
					}
				});
			} else {
				generateOrder(stockedSku);
			}
		}
	});
	
	var sku = getQueryString('sku');
	if (sku != null) {
		var addressId = getQueryString('addressid');
		var skuArr = sku.split(',');
		var skuJson = new Array();
		for (var index in skuArr) {
			skuJson.push(parseInt(skuArr[index]));
		}
		addressId = parseInt(addressId);
		if (isNaN(addressId)) addressId = 0;
		requestOrder(skuJson, addressId);
	}
});

function requestOrder(sku, addressId) {
	appui.showHUD();
	window.IO({ 
		url:'checkOrderSku', 
		data:ts({
			'phone':getPhone(),
			'logisticsId':addressId,
			'sku':sku
		}),
		success: function(data){
			console.log(data);
			if (data.success == 1) {
				generateUI(data.results);
				appui.removeHUD();
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
	_templatePage('#orderId', 'orderTemplateId', {data:data, imgbase:imgbase}, true);
	$('#totalPrice').html('¥'+data.sumAmount);
	$('.order-address-imgbg').height($('.order-address-bg').height());
}

function generateOrder(stockedSku) {
	appui.showHUD();
	window.IO({ 
		url:'applyOrder',
		data:ts({
			'phone':getPhone(),
			'logisticsId':parseInt(q('#addressId').getAttribute('addressid')),
			'sku':stockedSku,
			'openId':getOpenId()
		}),
		success: function(data){
			console.log(data);
			if (data.success == 1) {
				appui.removeHUD();
				var obj = data.results;
				location.href = 'payOrder.html?order='+obj.orderId+'&time='+obj.createTime+'&money='+obj.amount;
			} else {
				if (data.code == 60003) {
					appui.removeHUD();
					mui.confirm(data.msg, '提示', ['取消','确定'], function(result){
						if (result.index == 1) {
							generateOrder(stockedSku);
						}
					});
				} else {
					appui.removeHUD(2, data.code+':'+data.msg);
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
}
