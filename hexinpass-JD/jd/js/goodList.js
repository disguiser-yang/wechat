$(function(){
	mui.init();
	
	// get key word
	if (location.href.split('?').length > 1) {
    		var keyWords = queryString(decodeURI(location.href), 'keyword');		
    		$('#keyWord').val(keyWords);
    		
    		var cateId = getQueryString('catid');
    		$('#catId').val(cateId);
    		
    		var brands = queryString(decodeURI(location.href), 'brands');	
    		$('#brands').val(brands);
	}
	
	mui('#searchbox').on('tap', '#keyWord', function(){
		if (this.value.length > 0) {
			this.value = null;
		} 
	});

    // ajust screen size
	var listHeight = $(window).height()-99+'px';
	$('#goodBrandListBg').height(listHeight);
	
	mui('body').on('tap', '#hotSelectId', function(){
		$(this).parent().find('.good-select-box-type').removeClass('box-selected');
		$(this).addClass('box-selected');
		$('#order').val(4); 
		resetSortItem(q('#priceSelectId'));
		resetSortItem(q('#saleSelectId'));
		resetPageIndexRequest();
	});
	 
	mui('body').on('tap', '#priceSelectId', function(){
		sortItemTapped(this);
	});
	
//	mui('body').on('tap', '#markSelectId', function(){
//		sortItemTapped(this);
//	});
	
	mui('body').on('tap', '#saleSelectId', function(){
		sortItemTapped(this);
	});
	
	mui('body').on('tap', '#brandSelectId', function(){
		$(this).parent().find('.good-select-box-type').removeClass('box-selected');
		$(this).addClass('box-selected');
		var show = this.getAttribute('show');
		if (show == '0') {
			showBrandsBox();
		} else {
			hideBrandsBox();
		}
	}); 
	
	mui('#goodListId').on('tap', '.good-list-item', function(){
		var sku = this.getAttribute('sku');
		goto('detail.html?sku='+sku);
	});
	
	mui('body').on('tap', '#backTop', function(){
		listScroll('down');
        $('html, body').animate({scrollTop:0}, 'fast');
	});
	
	// brand background tapped
	mui('body').on('tap', '#goodBrandListBg', function(e){
		if (e.detail.center.y > 350) {
			$(this).hide();
			q('#brandSelectId').setAttribute('show', 0);
		}		
	});
	
	// brand reset tapped
	mui('#goodBrandListBg').on('tap', '.good-brand-toolbar-reset', function(){
		$('#goodBrandListId .good-brand-list-item').removeClass('brand-active');
	});
	
	// brand sure tapped
	mui('#goodBrandListBg').on('tap', '.good-brand-toolbar-sure', function(){
		var brandStr = '';
		$('#goodBrandListId .good-brand-list-item').each(function(index, ele){
			if ($(ele).hasClass('brand-active')) {
				brandStr += $(ele).html()+',';
			}
		});
		$('#brands').val(brandStr.substr(0, brandStr.length - 1));
		resetSortItem(q('#priceSelectId'));
		resetSortItem(q('#saleSelectId'));
		resetPageIndexRequest();
	});
	
	initScrollEvent();
    
	mui('#searchbox').on('submit', '#searchForm', function(){
		$('#hotSelectId').parent().find('.good-select-box-type').removeClass('box-selected');
		$('#hotSelectId').addClass('box-selected');
		resetSortItem(q('#priceSelectId'));
		resetSortItem(q('#saleSelectId'));
		isBrandListGenerated = false;
		resetAllExceptKeywordRequest();
	});
	
	$('#pageIndex').val(1);
    requestGoodList();
    addTouchEvents();
});

var lastY = 0;
function addTouchEvents() {
	mui('body').on('touchstart', '#goodListId', function(e){
		if (document.querySelector('#brandSelectId').getAttribute('show') == '1') {
			return;
		}
		lastY = e.touches[0].clientY;
	});
	mui('body').on('touchmove', '#goodListId', function(e){
		if (document.querySelector('#brandSelectId').getAttribute('show') == '1') {
			return;
		}
		var currentY = e.touches[0].clientY;
		if (currentY > lastY) {
			listScroll('down');
		} else {
			listScroll('up');
		}
		lastY = currentY;
	});
}

var headerShow = true;
function listScroll(direction) {
	if (direction == 'down') {
		if (headerShow) return;
		
		headerShow = true;
		var goodList = $('#goodListId');
		$('#searchbox').removeClass('trans_55');
		$('#goodSelectBox').removeClass('trans_55');
		$('#goodBrandListId').removeClass('trans_55');
		$('#goodBrandToolBar').removeClass('trans_55');
	} else {
		if (!headerShow) return;
		if ($(window).scrollTop() < 300) return;  
		
		headerShow = false;	
		var goodList = $('#goodListId');
		$('#searchbox').addClass('trans_55');
		$('#goodSelectBox').addClass('trans_55');
		$('#goodBrandListId').addClass('trans_55');
		$('#goodBrandToolBar').addClass('trans_55');
	}
}

function initScrollEvent() {
	var backTopItem = $('#backTop');
	var backTopItemShow = false;
	var shouldHandleScrollEvent = true;
	//var goodList = $('#goodListId');
	var goodList = $(window);
	var searchBox = $('#searchbox');
	goodList.scroll(function(){
		//var scrollHeight = this.scrollHeight;
		var scrollHeight = Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
		var offSet = scrollHeight - $(this).scrollTop() - $(this).height();
        if (offSet <= 64){
        		if (loading.state != 1 && loading.state != 2) {
        			var pageIndex = parseInt($('#pageIndex').val());
        			$('#pageIndex').val(pageIndex+1);
        			requestGoodList();
        		}
        }
       
        if ($(this).scrollTop() > 600) {
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
}

function goto(url) {
	if (window.app && app.openView) {
		window.app.openView(ts({
			opt:{
				title:''
			},
			url:getRealPath()+url
		}));
	} else {
		window.location.href = url;
	}
}

 function getRealPath(){
     var localObj = window.location;
     var filePaths = localObj.pathname.split("/");
     var basePath = localObj.origin+'/';
     for (var i=0;i<filePaths.length-1;i++) {
     	var subPath = filePaths[i];
     	if (subPath && subPath != '') {
     		basePath += subPath + '/';
     	}
     }
     
     return basePath ;
}

var lastSortItem = null;
function sortItemTapped(obj) {
	$(obj).parent().find('.good-select-box-type').removeClass('box-selected');
	$(obj).addClass('box-selected');
	var type = obj.getAttribute('type');
	isSort = true;
	switch (type) {
		case 'all':
			$(obj).find('.good-select-box-type-order-up').removeClass('order-up-gray');
			$(obj).find('.good-select-box-type-order-up').addClass('order-up-red');
			obj.setAttribute('type', 'up');
			obj.id == 'priceSelectId' ? $('#order').val(1) : $('#order').val(6);
			resetPageIndexRequest();
			break;
		case 'up':
			$(obj).find('.good-select-box-type-order-up').removeClass('order-up-red');
			$(obj).find('.good-select-box-type-order-up').addClass('order-up-gray');
			$(obj).find('.good-select-box-type-order-down').removeClass('order-down-gray');
			$(obj).find('.good-select-box-type-order-down').addClass('order-down-red');
			obj.setAttribute('type', 'down');
			obj.id == 'priceSelectId' ? $('#order').val(2) : $('#order').val(5);
			resetPageIndexRequest();
			break;
		case 'down':
			$(obj).find('.good-select-box-type-order-down').removeClass('order-down-red');
			$(obj).find('.good-select-box-type-order-down').addClass('order-down-gray');
			$(obj).find('.good-select-box-type-order-up').removeClass('order-up-gray');
			$(obj).find('.good-select-box-type-order-up').addClass('order-up-red');
			obj.setAttribute('type', 'up');
			obj.id == 'priceSelectId' ? $('#order').val(1) : $('#order').val(6);
			resetPageIndexRequest();
			break;
	}
	if (lastSortItem && lastSortItem.id != obj.id) {
		resetSortItem(lastSortItem);
	}
	lastSortItem = obj;
}

function resetSortItem(obj) {
	if ($(obj).find('.good-select-box-type-order-up').hasClass('order-up-red')) {
		$(obj).find('.good-select-box-type-order-up').removeClass('order-up-red');
		$(obj).find('.good-select-box-type-order-up').addClass('order-up-gray');
	}
	if ($(obj).find('.good-select-box-type-order-down').hasClass('order-down-red')) {
		$(obj).find('.good-select-box-type-order-down').removeClass('order-down-red');
		$(obj).find('.good-select-box-type-order-down').addClass('order-down-gray');
	}
	obj.setAttribute('type', 'all');
}

// reset pageIndex condition
function resetPageIndexRequest() {
	$('#pageIndex').val(1);
	$('input').blur();
	hideBrandsBox();
	appui.showHUD('正在加载');
	requestGoodList();
}

// reset all conditions except keyword
function resetAllExceptKeywordRequest() {
	$('#catId').val(0);
	$('#order').val(4);
	$('#brands').val('');
	$('#pageIndex').val(1);
	$('#keyWord').blur();
	hideBrandsBox();
	appui.showHUD('正在加载');
	requestGoodList();
}

var loading = new loadingComponent(1);
var pageSize = 10;
function requestGoodList() {
	loading.setState(1).appendToParent('#goodListId');
	var pageIndex = parseInt($('#pageIndex').val());
	window.IO({ 
		url:'search',
		data:ts({
			'keyword':$('#keyWord').val(),
			'catId':parseInt($('#catId').val()),
			'brands':$('#brands').val(),
			'pageIndex':pageIndex,
			'pageSize':pageSize,
			'order':parseInt($('#order').val()),
			'isBrand':isBrandListGenerated?0:1
		}),
		success: function(data){
			console.log(data);
			if (data.success == 1) {
				generateList(data.results.productList);
				if (!isBrandListGenerated) {
					generateBrandList(data.results.brandList);
				}
				appui.removeHUD();
			} else {
				appui.removeHUD(2, '加载失败，请稍后重试');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
}

var lazyLoad = null;
var isSort = false;
function generateList(data) {
	loading.removeDeriveParent('#goodListId');
	var isFirstPage = parseInt($('#pageIndex').val())==1;
	if (data == null || data.length == 0) {
		if (isFirstPage) {
			_templatePage('#goodListId', 'goodListTemplateId', {list:data, imgbase:imgbase}, true);
		}
		loading.setState(2).appendToParent('#goodListId');
	} else {
		_templatePage('#goodListId', 'goodListTemplateId', {list:data, imgbase:imgbase}, isFirstPage);
		
		if (isFirstPage && !isSort) {
			q('#priceSelectId').setAttribute('type', 'all');
			$('#priceSelectId').find('.good-select-box-type-order-up').show();
			$('#priceSelectId').find('.good-select-box-type-order-down').show();
//			q('#markSelectId').setAttribute('type', 'all');
//			$('#markSelectId').find('.good-select-box-type-order-up').show();
//			$('#markSelectId').find('.good-select-box-type-order-down').show();
			q('#saleSelectId').setAttribute('type', 'all');
			$('#saleSelectId').find('.good-select-box-type-order-up').show();
			$('#saleSelectId').find('.good-select-box-type-order-down').show();
		}		
		loading.removeDeriveParent('#goodListId');
		loading.setState(10).appendToParent('#goodListId');
		if (data.length < pageSize) {
			loading.setState(2);
		} 
	}
	
	if (lazyLoad == null) {
		// lazy load
		lazyLoad = mui(document).imageLazyload({
			autoDestroy: false,
			diff:$(window).height()
		});
	} else {
		document.body.removeAttribute('data-imagelazyload');
		lazyLoad.refresh(true);
	}
}

var isBrandListGenerated = false;
function generateBrandList(data) {
	_templatePage('#goodBrandListId', 'goodBrandTemplateId', {list: data}, true);
	isBrandListGenerated = true;
	mui('#goodBrandListId').off('tap', '.good-brand-list-item', brandTapped);	
	mui('#goodBrandListId').on('tap', '.good-brand-list-item', brandTapped);
}

function brandTapped() {
	if ($(this).hasClass('brand-active')) {
		$(this).removeClass('brand-active');
	} else {
		$(this).addClass('brand-active');
	}
}

function showBrandsBox() {
	q('#brandSelectId').setAttribute('show', '1');
	$('#goodBrandListBg').show();
}

function hideBrandsBox() {
	q('#brandSelectId').setAttribute('show', '0');
	$('#goodBrandListBg').hide();
}
