$(function(){
	mui.init();
	if (window.parent.setActive) {
		window.parent.setActive(0);
	}
				
	mui('#searchbox').on('tap', '#homeSearchBox', function(){
		if (this.value.length > 0) {
			this.value = null;
		} 
	});

	mui('#searchbox').on('submit', '#searchForm', function(){
		$('#homeSearchBox').blur();
		var keyword = $('#homeSearchBox').val();
		goto(encodeURI('goodList.html?keyword='+keyword));
	});
	
	$('#homePageId').scroll(function(){
		var offSet = this.scrollHeight - $(this).scrollTop() - $(this).height();
        if (offSet <= 64){
        		if (loading.state != 1 && loading.state != 2) {
        			requestRecommendData();
        		}
        }
   });	
    
    // bind tap events
	mui('#banner').on('tap', '.mui-slider-item a', adTapHandler);
	mui('#navigation').on('tap', '.home-navigation-item-a', adTapHandler);
	mui('#hotRecommendId').on('tap', '.home-recommend-table-item', function(){
		var sku = this.getAttribute('sku');
		window.parent.goto('detail.html?sku='+sku);
	});
	
	mui('body').on('tap', '#backTop', function(){
		$('#homePageId').animate({scrollTop:0}, 'fast');
	});
	
	var backTopItem = $('#backTop');
	var backTopItemShow = false;
	$('#homePageId').scroll(function(){
        if ($(this).scrollTop() > 1000) {
			if (!backTopItemShow) {
				backTopItem.show();
				backTopItemShow = true;
			}
		} else {
			if (backTopItemShow) {
				backTopItem.hide();
				backTopItemShow = false;
			}
		}
    });	
	
	requestData();
});

// parent window relocate
function goto(url) {
	window.parent.location.href = url;
}

// request data
var homeData = null;
function requestData() {
	loading.appendToParent('#homePageId');
	window.IO({ 
		url:'getHomeData',
		data:ts({
			'phone': getPhone(),
			'pageSize':20
		}),
		success: function(data){
			console.log(data);
			loading.setState(0).removeDeriveParent('#homePageId');
			if (data.success == 1) {
				homeData = data.results;
				generateUI(data.results);
			} else {
				appui.toast('请求失败：'+data.msg);
			}
			window.parent.appui.removeHUD();
		},
		error: function(jqXHR, textStatus, errorThrown){
			loading.setState(0).removeDeriveParent('#homePageId');
			window.parent.appui.removeHUD('网络开小差咯');
		}
	});
}

var loading = new loadingComponent(1);
var pageIndex = 2;
function requestRecommendData() {
	loading.setState(1).appendToParent('#hotRecommendId');
	window.IO({ 
		url:'getHotProduct',
		data:ts({
			'phone': getPhone(),
			'pageSize':20,
			'pageIndex':pageIndex++
		}),
		success: function(data){
			console.log(data);
			if (data.success == 1) {
				_templatePage('#hotRecommendId', 'hotRecommendTemplateId', {data: data.results, imgbase:imgbase}, false);
				loading.removeDeriveParent('#hotRecommendId');
				if (data.results == null || data.results.length < 20) {
					loading.setState(2).appendToParent('#hotRecommendId');
				} else {
					loading.setState(10).appendToParent('#hotRecommendId');
				}
				
				document.body.removeAttribute('data-imagelazyload');
				lazyLoad.refresh(true);
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.toast('网络开小差咯');
		}
	});
}

var lazyLoad = null;
function generateUI(data) {
	if (data.ad != null && data.ad.length > 0) 
		_templatePage('#banner', 'homePageTemplate', {ad:data.ad, bannerFirst:data.ad[0], bannerLast:data.ad[data.ad.length-1]}, true);
	if (data.button != null && data.button.length > 0)
		_templatePage('#navigation', 'navigationTemplateId', {btn:data.button}, true);
	if (data.hotProduct != null && data.hotProduct.length > 0) {
		$('#homeRecommendTitle').show();
		_templatePage('#hotRecommendId', 'hotRecommendTemplateId', {data: data.hotProduct, imgbase:imgbase}, false);
	}
	if (window.parent.setCartBagedNumber) {
		window.parent.setCartBagedNumber(data.shoppingCartNum);
	}
	// loading component
	if (data.hotProduct != null && data.hotProduct.length < 20) {
		loading.setState(2).appendToParent('#hotRecommendId');
	} else {
		loading.setState(10).appendToParent('#hotRecommendId');
	}	

	// banner init
    if (data.ad != null && data.ad.length > 1) {
	    	mui('#slider').slider({ interval:5000 }); 
    } else {
    		mui('#slider').slider({});
    }	
	
	// lazy load
	lazyLoad = mui(document).imageLazyload({
		autoDestroy: false,
		diff:$(window).height()
	});
}

function adTapHandler() {	
	var adId = this.getAttribute('adid');
	window.IO({ 
		url:'addClickNumAdvertisement',
		data:ts({
			'id':parseInt(adId)
		}),
		success: function(data){
			console.log(data);
		},
		error: function(jqXHR, textStatus, errorThrown){
			
		}
	});
	
	var goType = this.getAttribute('gotype');
	switch(goType) {
		case '0':
			break;
		case '1':
			goto('adContent.html?id='+adId);
			break;
		case '2':
			var type = this.getAttribute('type');
			var index = this.getAttribute('index');
			var urlStr = null;
			if (type == "1") {
				urlStr = homeData.ad[index].content;
			} else if (type == "2") {
				urlStr = homeData.button[index].content;
			}
			goto(urlStr);
			
			break;
		default:
			break;
	}
}
