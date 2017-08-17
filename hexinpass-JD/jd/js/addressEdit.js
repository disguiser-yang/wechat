
$(function(){
	mui.init();
	
	mui('body').on('tap', '#setDefaultCell', function(){
		var obj = this.querySelector('#setDefault');
		if ($(obj).hasClass('appui-icon-hud-select')) {
			$(obj).removeClass('appui-icon-hud-select');
			$(obj).addClass('appui-icon-hud-unselect');
		} else {
			$(obj).removeClass('appui-icon-hud-unselect');
			$(obj).addClass('appui-icon-hud-select');
		}
	});
	mui('body').on('tap', '#areaSelectBtn', function(){
		inputBlur();
		if (provinceData == null) {
			requestArea(1);
		}
		$('#maskLayer').show();
		$('#addressSelector').addClass('address-selector-trans');
	});
	mui('body').on('tap', '#areaSaveBtn', function() {
	    saveArea();
	});
	mui('body').on('tap', '#maskLayer', function(e){
		if (e.detail.center.y < $(window).height()-343 || e.target.id == 'areaClose') {
			hideAddressSelector();
		}
	});	
	mui('#addressSelector').on('tap', '.address-selector-selectitem-item', function(){
		selectItemTapped(this);
	});
	
	mui('#tableProvince').on('tap', '.address-selector-list-table-cell', cellTapped);
	mui('#tableCity').on('tap', '.address-selector-list-table-cell', cellTapped);
	mui('#tableCounty').on('tap', '.address-selector-list-table-cell', cellTapped);
	mui('#tableTown').on('tap', '.address-selector-list-table-cell', cellTapped);
	
	var id = getQueryString('id');
	if (id != null && id != 'undefined' && id != '') {
		addressId = parseInt(id);
		requestAddress(addressId); 
	}
});

function selectItemTapped(selectItem) {
	if ($(selectItem).hasClass('address-active')) {
		return;
	}
	var itemWidth = 80;
	var allSelectItems = $('#addressSelector').find('.address-selector-selectitem-item');
	
	var lastItem =  $('#addressSelector').find('.address-active');
	var lastIndex = allSelectItems.index(lastItem);
	var currentIndex = allSelectItems.index($(selectItem));
	// progressBar
	document.querySelector('#addressProgressBar').style.transform = 'translate('+currentIndex*itemWidth+'px, 0)';
	// selected color
	lastItem.removeClass('address-active');
	$(selectItem).addClass('address-active');
	
	// operate content		
	var winWidth = $(window).width();
	var currentContentId = selectItem.getAttribute('content');
	var currentContent = document.querySelector(currentContentId);
	var lastContentId = lastItem.get(0).getAttribute('content');
	var lastContent = document.querySelector(lastContentId);
	if (currentIndex > lastIndex) {
		translateObj(currentContent, 'translate('+winWidth+'px, 0)', false);
		translateObj(lastContent, 'translate(-'+winWidth+'px, 0)', true);
		translateObj(currentContent, 'translate(0, 0)', true);
	} else {
		translateObj(currentContent, 'translate(-'+winWidth+'px, 0)', false);
		translateObj(lastContent, 'translate('+winWidth+'px, 0)', true);
		translateObj(currentContent, 'translate(0, 0)', true);
	}
}

function translateObj(obj, translate, show) {
	if (!show) {
		obj.style.transitionDuration = '0';
		obj.style.webkitTransitionDuration = '0';
		$(obj).hide();
	}
	obj.style.transform = translate;
	obj.style.webkitTransform = translate;
	if (!show) {
		obj.style.transitionDuration = '300ms';
		obj.style.webkitTransitionDuration = '300ms';
		$(obj).show();
	}
}

function hideAddressSelector() {
	$('#addressSelector').removeClass('address-selector-trans');
	setTimeout(function(){
		$('#maskLayer').hide();
	}, 300);
}

// save user address
var addressId = 0;
function saveArea() {	
	var areaName = $('#areaName').val();
	if (areaName == null || areaName == '') {
		appui.toast('请输入姓名');
		return;
	}
	
	var areaPhone = $('#areaPhone').val();
	if (areaPhone == null || areaPhone == '') {
		appui.toast('请输入手机号码');
		return;
	}
	
	var areaSelect = $('#areaSelectBtn').val();
	if (areaSelect == null || areaSelect == '') {
		appui.toast('请选择区域');
		return;
	}
	
	var areaDetail = $('#areaDetail').val();
	if (areaDetail == null || areaDetail == '') {
		appui.toast('请输入详细地址');
		return;
	}
	
	inputBlur();
	
	var postData = ts({
		'typeId':addressId == 0 ? 1 : 2,
		'userAddressInfo':{
			'id':addressId,
			'phone':getPhone(),
			'name':areaName,
			'address':areaDetail,
			'province':province,
			'provinceName':provinceName,
			'city':city,
			'cityName':cityName,
			'county':county,
			'countyName':countyName, 
			'town':town,
			'townName':townName,
			'mobile':areaPhone,
			'main':$('#setDefault').hasClass('appui-icon-hud-select') ? 1 : 0
		}
	});
	
	appui.showHUD('正在保存');
	window.IO({
		url:'logistics',
		data:postData,
		success:function(data) {
			console.log(data);
			if (data.success == 1) {
				appui.removeHUD(1, '保存成功');
				setTimeout(function() {
					if (getQueryString('straight') == '1') {
						location.replace('submitOrder.html?sku='+getQueryString('sku'));
					} else {
						location.replace('addressManage.html?sku='+getQueryString('sku')+'&norder='+getQueryString('norder'));
					}
				}, 2000);
			} else {
				appui.removeHUD(2, '保存失败，请稍后重试');
			}
		},
		error:function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
}

function requestAddress(id) {
	appui.showHUD('正在加载...');
	window.IO({
		url:'getUserAddressById',
		data:ts({'id':id}),
		success: function(data){
			console.log(data);
			if (data.success == 1) {
				appui.removeHUD();
				generateUIWithData(data.results);
			} else {
				appui.removeHUD(2, '请求失败，请稍后重试');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	})
}

// network request and relevant UI generation
var provinceData = null;
function requestArea(type, idStr) {
	window.IO({ 
		url: 'getArea',
		data:ts({
			"type":type,
			"id":idStr
		}),
		success: function(data){
			console.log(data);
			if (data.success == 1) {
				if (type == 1) {
					generateProvince(data.results);
				} else if (type == 2) {
					generateCity(data.results);
				} else if (type == 3) {
					generateCounty(data.results);
				} else if (type == 4) {
					generateTown(data.results);
				}
			} else if (data.success == 0 && data.code == 3405) {
				$('#tabTownId').html('');
				_templatePage('#tableTown', 'templateTown', {list: null}, true);
				town = 0;
				townName = '';
				q('#tabTown').setAttribute('code', 0);
				areaSelectionFinished();
			} else {
				appui.toast('网络开小差咯');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.toast('网络开小差咯');
		}
	});
}

function areaSelectionFinished() {
	hideAddressSelector();
	$('#areaSelectBtn').val(provinceName+' '+cityName+' '+countyName+' '+townName);
}

function inputBlur() {
	$('#areaName').blur();
	$('#areaPhone').blur();
	$('#areaSelectBtn').blur();
	$('#areaDetail').blur();
}

function generateUIWithData(data) {
	province = data.province;
	provinceName = data.provinceName;
	city = data.city;
	cityName = data.cityName;
	county = data.county;
	countyName = data.countyName;
	town = data.town;
	townName = data.townName;
	$('#areaName').val(data.name);
	$('#areaPhone').val(data.mobile);
	$('#areaSelectBtn').val(provinceName+' '+cityName+' '+countyName+' '+townName);
	$('#areaDetail').val(data.address);
	if (data.main ==1) {
		$('#setDefault').removeClass('appui-icon-hud-unselect');
		$('#setDefault').addClass('appui-icon-hud-select');
	}
}

/* address selector generation and tap events */
var province, provinceName, city, cityName, county, countyName, town, townName;
function generateProvince(data) {
	provinceData = data;
	_templatePage('#tableProvince', 'templateProvince', {list: data}, true);	
}

function generateCity(data) {
	_templatePage('#tableCity', 'templateCity', {list: data}, true);
}

function generateCounty(data) {
	_templatePage('#tableCounty', 'templateCounty', {list: data}, true);
}

function generateTown(data) {
	$('#tabTown').show();
	selectItemTapped(document.querySelector('#tabTown'));
	_templatePage('#tableTown', 'templateTown', {list: data}, true);
}

function cellTapped() {
	var type = parseInt(this.getAttribute('type'));
	var id = parseInt(this.getAttribute('index'));
	$(this).parent().find('.address-selector-list-table-cell').css('color', '#333');
	$(this).css('color', '#FD555A');
	if (type == 1) {
		province = id;
		provinceName = this.innerHTML;
		$('#tabProvince').html(provinceName);
		q('#tabProvince').setAttribute('code', id);
		$('#tabCity').show();
		selectItemTapped(document.querySelector('#tabCity'));
	} else if (type == 2) {
		city = id;
		cityName = this.innerHTML;
		$('#tabCounty').show();
		$('#tabCity').html(cityName);
		q('#tabCity').setAttribute('code', id);
		selectItemTapped(document.querySelector('#tabCounty'));
	} else if (type == 3) {
		county = id;
		countyName = this.innerHTML;
		$('#tabCounty').html(countyName);
		q('#tabCounty').setAttribute('code', id);
	} else if (type == 4) {
		town = id;
		townName = this.innerHTML;
		$('#tabTown').html(townName);
		q('#tabTown').setAttribute('code', id);
		areaSelectionFinished();
	}
	
	if (type != 4) {
		requestArea(type+1, id+'');
	}
}