$(function(){
	if (window.parent.setActive) {
		window.parent.setActive(3);
	}
	mui.init({
		swipeBack: false
	});
	mui('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	$('.mui-slider-group').height($(window).height()-40+'px');
	
	q('#slider').addEventListener('slide', function(e){
		var tabItem = $(this).find('a.mui-control-item').get(e.detail.slideNumber);
		if (tabItem.getAttribute('index') == '1') {
			requestOrderList(tabItem);
		}
	});
	
	mui('body').on('tap', '.order-list-item', orderTapped);
	
	$('.order-list').scroll(function(){
		var offSet = this.scrollHeight - $(this).scrollTop() - $(this).height();
        if (offSet <= 64){
        		var type = parseInt(this.querySelector('.order-list').getAttribute('type'));
        		if (loadingArr[type].state != 1 && loadingArr[type].state != 2) {
        			var tabItem = $('#sliderSegmentedControl').find('a.mui-control-item').get(type);
        			requestOrderList(tabItem);
        		}
        }
    });	 
    
    addAfaddTouchEvents();
    mui('body').on('tap', '#appAfAddress', function(){ 
    		gotoUrl('addressManage.html?norder=1');
    });
    mui('body').on('tap', '#appAfService', function(){ 
    		gotoUrl('afServiceList.html');
    });
	
	requestOrderList(q('#orderAll'));
})

var addTouched = false;
function addAfaddTouchEvents() {
	mui('body').on('touchstart', '#appAfAddBg', function(e){ 
		addTouched = true;
		lastTime = e.timeStamp;
    });
    	
	mui('body').on('touchmove', '#appAfAddBg', function(e){ 
		if (addTouched) {
			e.stopPropagation();
		}
		if (e.touches[0].clientY < 40) return;
		var x = e.touches[0].clientX-20-10;
		var y = e.touches[0].clientY-$(window).height()+35+10;
		var translate = 'translate('+x+'px, '+y+'px)';
		this.style.transform = translate;
		this.style.WebkitTransform = translate;
		var scaleTranslate = translate+' scale(0.01)';
		q('#appAfAddress').style.transform = scaleTranslate;
		q('#appAfAddress').style.WebkitTransform = scaleTranslate;
		q('#appAfService').style.transform = scaleTranslate;
		q('#appAfService').style.WebkitTransform = scaleTranslate;
    });
    var lastTime = 0;
    mui('body').on('touchend', '#appAfAddBg', function(e){ 
    		addTouched = false;
    		if (e.timeStamp - lastTime < 200) return;
    		var ww = $(window).width();
    		var wh = $(window).height();
    		var xp = e.changedTouches[0].clientX;
    		var yp = e.changedTouches[0].clientY;
    		var x = getX(xp,ww);
    		var y = getY(yp, wh);
    		var translate = 'translate('+x+'px, '+y+'px)';
		this.style.transform = translate;
		this.style.WebkitTransform = translate;
		var scaleTranslate = translate+' scale(0.01)';
		q('#appAfAddress').style.transform = scaleTranslate;
		q('#appAfAddress').style.WebkitTransform = scaleTranslate;
		q('#appAfService').style.transform = scaleTranslate;
		q('#appAfService').style.WebkitTransform = scaleTranslate;
		if ($('#appAfAdd').hasClass('af-add-transform')) {
    			$('#appAfAdd').removeClass('af-add-transform');
    		}
    });
    
    function getX(xp, ww) {
    		if (xp < ww/2) {
    			direction = 'left';
    			return 0;
    		} else {
    			direction = 'right';
    			return ww-20-20-40;
    		}
    }
    function getY(yp, wh){
    		if (yp <100) {
    			return 35+20+20+40+70-wh;
    		} else if (yp > wh-35) {
    			return 0;
    		} else  {
    			return yp-wh+35+10;
    		}
    }
    var direction = 'left';
    mui('body').on('tap', '#appAfAdd', function(e){ 
    		var ww = $(window).width();
    		var wh = $(window).height();
    		var xp = e.detail.center.x;
    		var yp = e.detail.center.y;
    		var translateAddress = '';
    		var translateService = '';
    		var xAddress, yAddress, xService, yService;
    		if ($(this).hasClass('af-add-transform')) {
    			$(this).removeClass('af-add-transform');
	    		xAddress = getX(xp,ww);
	    		yAddress = getY(yp,wh);
			xService = xAddress;
			yService = yAddress; 
			translateAddress = 'translate('+xAddress+'px, '+yAddress+'px) scale(0.01)';
	    		translateService = 'translate('+xService+'px, '+yService+'px) scale(0.01)';
    		} else {
    			$(this).addClass('af-add-transform');
    			if (direction == 'left') {
		    		xAddress = getX(xp,ww);
		    		yAddress = getY(yp,wh)-60;
				xService = xAddress + 60;
				yService = yAddress + 60;
	    		} else {
	    			xAddress = getX(xp,ww);
	    			yAddress = getY(yp,wh)-60;
	    			xService = xAddress - 60;
	    			yService = yAddress + 60;
	    		}
	    		translateAddress = 'translate('+xAddress+'px, '+yAddress+'px) scale(1)';
	    		translateService = 'translate('+xService+'px, '+yService+'px) scale(1)';
    		}
		q('#appAfAddress').style.transform = translateAddress;
		q('#appAfAddress').style.WebkitTransform = translateAddress;
		q('#appAfService').style.transform = translateService;
		q('#appAfService').style.WebkitTransform = translateService;
    });
}

function gotoUrl(url) {
	if (window.parent.goto) {
		window.parent.goto(url);		 	
	} else {
		window.parent.location.href = url;
	}
}

var loadingArr = [new loadingComponent(1),new loadingComponent(1),new loadingComponent(1),new loadingComponent(1)];
function requestOrderList(tabItem) {
	var pageIndex = parseInt(tabItem.getAttribute('index'));
	var type = parseInt(tabItem.getAttribute('type'));
	loadingArr[type].setState(1).appendToParent('#orderList'+type);
	
	window.IO({ 
		url:'getUserOrderList',
		data:ts({
			'phone': getPhone(),
			'type':type,
			'pageIndex': pageIndex,
			'pageSize': 10
		}),
		success: function(data){
			console.log(data); 
			if (data.success == 1) {
				tabItem.setAttribute('index', pageIndex+1);
				_templatePage('#orderList'+type, 'templateId'+type, {list:data.results, imgbase:imgbase}, false);
				loadingArr[type].setState(0).removeDeriveParent('#orderList'+type);
				if (data.results == null) {
					loadingArr[type].setState(2).appendToParent('#orderList'+type);
				} else {
					loadingArr[type].setState(0).appendToParent('#orderList'+type);
				}
			} else { 
				appui.toast('请求失败，请稍后再试');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.toast('网络开小差咯');
		}
	});
}

function orderTapped(e) {
	var className = e.target.className;
	var orderId = this.getAttribute('order');
	switch(className) {
		case 'order-list-item-operate-pay':    // waiting for pay
			var orderId = this.getAttribute('order');
			var money = this.getAttribute('money');
			var time = this.getAttribute('time');
			var goUrl = 'payOrder.html?order='+orderId+'&time='+time+'&money='+money;
			gotoUrl(goUrl);
			break;
		
		case 'order-list-item-operate-cancel':   // cancel order
			cancelOrder(orderId);
			break;
		
		case 'order-list-item-operate-express':   // check express state
			var goUrl = 'orderTrack.html?order='+this.getAttribute('jdorder')+'&time='+this.getAttribute('time');
			gotoUrl(goUrl);
			break;
		
		case 'order-list-item-operate-signed':    //  sign express
			break;
		
		case 'order-list-item-operate-asservice':    // after sale service
			var goUrl = 'afterSaleService.html';
			gotoUrl(goUrl);
			break;
		
		case 'order-list-item-operate-delete':   // delete order
			deleteOrder(orderId);
			break;
		
		case 'order-list-item-operate-service':   // customer service line
			location.href = 'tel:4008331133';
			break;
		default:
			var goUrl = 'orderDetail.html?order='+orderId+'&jdorder='+this.getAttribute('jdorder')+'&split='+this.getAttribute('split');
			gotoUrl(goUrl);
	}
}

function deleteOrder(orderId) {
	mui.confirm('确定删除该订单？', '提示', ['取消', '确定'], function(ret){
		if (ret.index == 1) {
			appui.showHUD();
			window.IO({ 
				url:'delOrder',
				data:ts({
					'phone': getPhone(),
					'orderId':orderId
				}),
				success: function(data){
					console.log(data); 
					if (data.success == 1) {
						appui.removeHUD(1, '删除成功');
						location.reload();
					} else { 
						appui.removeHUD(2, '删除失败，请稍后再试');
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					appui.removeHUD(2, '网络开小差咯');
				}
			});
		}
	});
}

function cancelOrder(orderId) {
	mui.confirm('确定取消该订单？', '提示', ['取消', '确定'], function(ret){
		if (ret.index == 1) {
			appui.showHUD();
			window.IO({ 
				url:'cancelOrder',
				data:ts({
					'phone': getPhone(),
					'orderId':orderId
				}),
				success: function(data){
					console.log(data); 
					if (data.success == 1) {
						appui.removeHUD(1, '取消成功');
						location.reload();
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
