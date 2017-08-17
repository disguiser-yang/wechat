$(function(){
	if (window.parent.setActive) {
		window.parent.setActive(2);
	}
	$('#cartListId').height($(window).height()-55+'px');
	 
	requestCartList();
});


function requestCartList() {
	appui.showHUD();
	window.IO({ 
		url:'getShoppingCartList',
		data:ts({'phone': getPhone()}), 
		success: function(data){
			console.log(data); 
			if (data.success == 1) {
				generateUI(data.results);
				appui.removeHUD();
			} else { 
				appui.removeHUD(2, '请求失败，请稍后再试');
			}
			
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
}

function generateUI(data) {
	if (data == null || data.length == undefined || data.length <= 0) {
		$('#cartEmpty').show();
		return;
	}
	_templatePage('#cartListId', 'cartTemplateId', {list:data, imgbase:imgbase}, true);
	
	var w = $(window).width();
	if (w <= 320) {
		$('.cart-list-item img').height('93px');
		$('.cart-list-item img').width('93px');
	}	
	
	mui('#cartListId').on('tap', '.cart-list-item-operate-plus', function(){
		var stockId = this.parentElement.getAttribute('stock');
		if (stockId != '33' && stockId != '39' && stockId != '40') {
			appui.toast('该商品库存不足！');
			return;
		}
		var newNum = parseInt($(this).parent().find('.cart-list-item-operate-number').html()) + 1;
		$(this).parent().find('.cart-list-item-operate-number').html(newNum);
		operateCart(newNum, this, 1);
	});
	mui('#cartListId').on('tap', '.cart-list-item-operate-minus', function(){
		var newNum = parseInt($(this).parent().find('.cart-list-item-operate-number').html()) - 1;
		if (newNum <= 0) {
			var thisObj = this;
			mui.confirm('确定将该商品移出购物车？', '', ['取消','确定'], function(result){
				if (result.index == 1) {
					$(thisObj).parent().find('.cart-list-item-operate-number').html(newNum);
					operateCart(newNum, thisObj, 0);
				}
			});
		} else {
			$(this).parent().find('.cart-list-item-operate-number').html(newNum);
			operateCart(newNum, this, 0);
		}
	});
	
	mui('#cartListId').on('tap', '.cart-list-item-check', function(){
		if ($(this).hasClass('appui-icon-hud-unselect')) {
			$(this).removeClass('appui-icon-hud-unselect');
			$(this).addClass('appui-icon-hud-select');
		} else {
			$(this).removeClass('appui-icon-hud-select');
			$(this).addClass('appui-icon-hud-unselect');
		}
		
		caculateTotalPrice(); 
	});
	
	mui('body').on('tap', '#caculateBtn', function(){
		if (this.getAttribute('active') != 1) return;
		var skuStr = '';
		$('#cartListId').find('.cart-list-item-check').each(function(){
			if ($(this).hasClass('appui-icon-hud-select')) {
				skuStr += this.parentNode.parentNode.getAttribute('sku') + ',';
			}
		});
		if (skuStr == '') {
			appui.toast('请先勾选商品');
			return;
		}
		skuStr = skuStr.substr(0, skuStr.length-1);
		window.parent.location.href = 'submitOrder.html?sku='+skuStr;
	});
	
	mui('body').on('tap', '#toolBarLeft', function(){
		var check = $(this).find('#toolbarSelectAll');
		if (check.hasClass('appui-icon-hud-unselect')) {
			$('.cart-list-item-check').removeClass('appui-icon-hud-unselect');
			$('.cart-list-item-check').addClass('appui-icon-hud-select');
		} else {
			$('.cart-list-item-check').removeClass('appui-icon-hud-select');
			$('.cart-list-item-check').addClass('appui-icon-hud-unselect');
		}
		
		caculateTotalPrice();
	});
	
	mui('#cartListId').on('tap', '.cart-list-item', function(e){
		var className = e.target.className;
		if (className == 'cart-list-item-title'
		 || className == 'cart-list-item-desc') {
			var sku = this.getAttribute('sku');  
			if (window.parent.goto) {
				window.parent.goto('detail.html?sku='+sku);		 	
			} else {
				window.parent.location.href = 'detail.html?sku='+sku;		 	
			}
		 } else if (className == 'cart-list-item-img') {
		 	var check = $(this).parent().find('.cart-list-item-check').get(0);
		 	mui.trigger(check, 'tap');
		 }
	});
	mui('#cartListId').on('tap', '.cart-list-item-delete', function(){
		var thisObj = this;
		mui.confirm('确定将该商品移出购物车？', '', ['取消','确定'], function(result){
			if (result.index == 1) {
				operateCart(0, thisObj.parentNode.querySelector('.cart-list-item-operate-minus'), 0);
			}
		});
	});
	
	var w = 88;
	var lastX = 0;
	mui('#cartListId').on('touchstart', '.cart-list-item', function(e){
		lastX = e.touches[0].clientX;
		var list = $('.cart-list-item');
		for (var i=0; i<list.length;i++) {
			var thisObj = list.get(i);
			if (thisObj.getAttribute('left') == '1') {
				e.preventDefault();
				var delItem = thisObj.parentNode.querySelector('.cart-list-item-delete');
				thisObj.style.transform = 'translate(0,0)';
				thisObj.style.webkitTransform = 'translate(0,0)';
				delItem.style.transform = 'translate('+w+'px,0)';
				delItem.style.webkitTransform = 'translate('+w+'px,0)';
				thisObj.setAttribute('left', 0);
				break;
			}
		}
	});
	mui('#cartListId').on('touchmove', '.cart-list-item', function(e){		
		var delItem = this.parentNode.querySelector('.cart-list-item-delete');
		var currentX = e.touches[0].clientX;
		
		if (currentX < lastX) {
			if (this.getAttribute('left') == '1') return;
			
			var transX = currentX - lastX;
			if (transX < -w) transX = -w;
			var delTransX = w+transX;
			this.style.transform = 'translate('+transX+'px,0)';
			this.style.webkitTransform = 'translate('+transX+'px,0)';
			delItem.style.transform = 'translate('+delTransX+'px,0)';
			delItem.style.webkitTransform = 'translate('+delTransX+'px,0)';
		} else {
			if (this.getAttribute('left') == '0') return;
		
			var transX = lastX - currentX;
			if (transX < 0) transX = 0;	
			var delTransX = w+transX;
			this.style.transform = 'translate('+transX+'px,0)';
			this.style.webkitTransform = 'translate('+transX+'px,0)';
			delItem.style.transform = 'translate('+delTransX+'px,0)';
			delItem.style.webkitTransform = 'translate('+delTransX+'px,0)';
		}
	});
	mui('#cartListId').on('touchend', '.cart-list-item', function(e){
		var delItem = this.parentNode.querySelector('.cart-list-item-delete');
		var currentX = e.changedTouches[0].clientX;
		if (currentX < lastX) {
			var transX = currentX - lastX;
			if (transX < -w/2) {
				this.style.transform = 'translate('+-w+'px,0)';
				this.style.webkitTransform = 'translate('+-w+'px,0)';
				delItem.style.transform = 'translate(0,0)';
				delItem.style.webkitTransform = 'translate(0,0)';
				this.setAttribute('left', 1);
			} else {
				this.style.transform = 'translate(0,0)';
				this.style.webkitTransform = 'translate(0,0)';
				delItem.style.transform = 'translate('+w+'px,0)';
				delItem.style.webkitTransform = 'translate('+w+'px,0)';
				this.setAttribute('left', 0);
			}
		} else {
			this.style.transform = 'translate(0,0)';
			this.style.webkitTransform = 'translate(0,0)';
			delItem.style.transform = 'translate('+w+'px,0)';
			delItem.style.webkitTransform = 'translate('+w+'px,0)';
			this.setAttribute('left', 0);
		}
	});
}
 
function caculateTotalPrice() {
	var totalPrice = 0;
	var productCount = 0;
	$('#cartListId').find('.cart-list-item').each(function(){
		if ($(this).find('.cart-list-item-check').hasClass('appui-icon-hud-select')) {
			var count = parseInt($(this).find('.cart-list-item-operate-number').html());
			totalPrice += parseFloat(this.getAttribute('price')) * count;
			productCount += count;
		}
	});
	$('#totalPrice').html(Math.round(totalPrice*100)/100); 
	var caculateBtn = q('#caculateBtn');
	if (productCount > 0) {
		caculateBtn.style.backgroundColor = '#FD555A';
		caculateBtn.setAttribute('active', 1);
	} else {
		caculateBtn.style.backgroundColor = 'darkgray';
		caculateBtn.setAttribute('active', 0);
	}
}

function resetCartTotalNumber() {
	if (window.parent.setCartBagedNumber) {
		var totalNum = 0;
		$('#cartListId').find('.cart-list-item').each(function(){
			var num = $(this).find('.cart-list-item-operate-number').html();
			totalNum += parseInt(num);
		});
		window.parent.setCartBagedNumber(totalNum);
	}
}


function operateCart(num, obj, type) {
	appui.showHUD();
	var sku = parseInt(obj.parentNode.getAttribute('sku'));
	window.IO({ 
		url:'addShoppingCart',
		data:ts({
			 'phone':getPhone(),
			 'sku':sku,
			 'num':num,
			 'cover':1
		}),
		success: function(data){
			console.log(data);
			if (data.success == 1) {
				appui.removeHUD();
				if (num == 0) {
					$(obj).parent().parent().parent().parent().remove(); 
				}
			} else {
				appui.removeHUD(2, '操作失败，请稍后再试');	 
				if (type == 1) {  //rollback add
					$(obj).parent().find('.cart-list-item-operate-number').html(num-1);
				} else { // rollback minus
					$(obj).parent().find('.cart-list-item-operate-number').html(num+1);
				}
			}
			caculateTotalPrice();
			resetCartTotalNumber();
		},
		error: function(jqXHR, textStatus, errorThrown){  
			appui.removeHUD(2, '网络开小差咯');  
		}
	});
}
