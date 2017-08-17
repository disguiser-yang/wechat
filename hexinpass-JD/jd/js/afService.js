$(function(){
	mui('body').on('tap', '.af-photo-box-add', function(){
		if (window.app) {
			window.app.camera();
		} else {
			q('#uploadPhotoId').click();
		}
	});	
	mui('body').on('tap', '.af-nextstep', nextStep);
//	PhotoViewer.init({
//		sel:'.af-photo-box-item',
//		width:60,
//		height:60
//	});
	
	PhotoViewer.init({
		sel:'.af-photo-box-item',
		triggerEvent:'tap',
		cancelEvent:'tap',
		background:true,
		width:60, 
		height:60      
	});  
	
	//_templatePage('#content', 'contentTemplateId', {item:{}, imgbase:imgbase, num:1, price:2}, true);

	
	var orderId = getQueryString('order');
	var jdOrderId = getQueryString('jdorder');
	var sku = getQueryString('sku');
	var num = getQueryString('num');
	var price = getQueryString('price');
	if (orderId != null && jdOrderId != null && sku != null) {
		requestData(orderId, jdOrderId, sku, num, price);
	}	
});

function requestData(orderId, jdOrderId, sku, num, price) {
	appui.showHUD();
	window.IO({ 
		url:'commitServiceFront',
		data:ts({
			'phone': getPhone(),
			'orderId': orderId,
			'jdOrderId': parseInt(jdOrderId),
			'sku': parseInt(sku)
		}),
		success: function(data){
			console.log(data); 
			if (data.success == 1) {
				appui.removeHUD();
				generateUI(data.results, num, price);
			} else { 
				appui.removeHUD(2, '请求失败，请稍后再试');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
}

function generateUI(data, num, price) {
	_templatePage('#content', 'contentTemplateId', {item:data, imgbase:imgbase, num:num, price:price}, true);
	mui('.af-service-type').on('tap', '.af-service-type-item', function(){
		$(this).parent().children().removeClass('af-service-type-select');
		$(this).addClass('af-service-type-select');
	});
	mui('#applyNumOperate').on('tap', '.af-applynum-operate-plus', function() {
		var numNode = $(this).parent().find('.af-applynum-operate-num');
		var existNum = parseInt(numNode.html());
		if (existNum < parseInt(num)) {
			numNode.html(existNum+1);
		}
	});
	mui('#applyNumOperate').on('tap', '.af-applynum-operate-minus', function() {
		var numNode = $(this).parent().find('.af-applynum-operate-num');
		var existNum = parseInt(numNode.html());
		if (existNum > 1) {
			numNode.html(existNum-1);
		}
	});
	mui('body').on('tap', '.af-check', function() {
		$(this).parent().find('.appui-icon-hud-select').addClass('appui-icon-hud-unselect');
		$(this).removeClass('appui-icon-hud-unselect');
		$(this).addClass('appui-icon-hud-select');
	});
	mui('body').on('tap', '.af-submit', submitService);
	
	q('#tabProvince').setAttribute('code', data.province);
	q('#tabCity').setAttribute('code', data.city);
	q('#tabCounty').setAttribute('code', data.county);
	q('#tabTown').setAttribute('code', data.town);
}

function img_data(data, isOrigin) {
	var imgbg = document.createElement('div');
	imgbg.className = 'af-photo-box-item';
	
	var img = document.createElement('img');
	img.style.cssText = 'width: 100%;height: 100%;';
	if (!isOrigin) {
		img.src = 'data:image/png;base64,'+data;
	} else {
		img.src = data;
	}
	
	var close = document.createElement('div');
	close.className = 'mui-icon mui-icon-close-filled af-photo-box-item-close';
	close.addEventListener('tap', function(){
		$('.af-photo-box-add').show();
		$(imgbg).remove();
	});
	
	imgbg.appendChild(img);	
	imgbg.appendChild(close);
	$('.af-photo-box').prepend(imgbg);
	
	if ($('.af-photo-box-item').length >= 5) {
		$('.af-photo-box-add').hide();
	}
	$(img).load(function(){
		if (this.naturalWidth > this.naturalHeight) {
			this.style.cssText = 'width: 100%;height:auto;';
		} else {
			this.style.cssText = 'width: auto;height:100%;';
		}
	});
	img.addEventListener('tap', displayImage);
}

function getPhonePhoto(obj) {
	if (typeof FileReader === 'undefined') {
		appui.toast('您的手机不支持上传图片');
		return;
	}
	if (!obj.value.match(/.jpg|.bmp|.png|.JPG|.BMP|.PNG/)) {
		appui.toast('图片格式不正确，请重新选择');
		return;
	}
	
	var reader = new FileReader();
	reader.readAsDataURL(obj.files[0]);
	reader.onload = function(e) {
		img_data(this.result, true);
	}
}

function postImg(items) {
	appui.showHUD();
	var data = [];
	items.each(function(){
		data.push(this.src);
	});
	jQuery.ajax({ 
		url: uploadbase+'upload/base',
		type:"POST",
		dataType:"JSON",
		data:ts({
			'file': data,
		}),
		success: function(data){
			console.log(data); 
			if (data.err == 0) {
				appui.removeHUD();
				uploadImgArr = data.src;
				$('#afBaseInfo').hide();
				$('#afAddress').show();
			} else {
				appui.removeHUD(2, '图片上传失败，请稍后再试');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
}

var uploadImgArr = null;
var serviceTypeCode = 0;
var hasTestReport = false;
var hasPackage = false;
var packageCode = 0;
var questionDesc = null;
var returnTypeCode = 0;
function nextStep() {
	var serviceType = $('.af-service-type').find('.af-service-type-select');
	if (serviceType.length <= 0) {
		appui.toast('请选择服务类型');
		return;
	} else {
		serviceTypeCode = parseInt(serviceType.get(0).getAttribute('code'));
	}
	
	var report = $('.af-report').find('.appui-icon-hud-select');
	if (report.length <= 0) {
		appui.toast('请选择是否有检测报告');
		return;
	} else {
		hasTestReport = report.get(0).getAttribute('code') == '1' ? true : false;
	}
	
	var afpackage = $('.af-package').find('.appui-icon-hud-select');
	if (afpackage.length <= 0) {
		appui.toast('请选择有无包装');
		return;
	} else {
		packageCode = parseInt(afpackage.get(0).getAttribute('code'));
		hasPackage = packageCode == 0 ? false : true;
	}
	
	var problemDesc = $('.af-problem').find('.af-problem-desc');
	if (problemDesc.val() == null || problemDesc.val().replace(/\ /g, '').length <= 0) {
		appui.toast('请输入问题描述');
		return;
	} else {
		questionDesc = problemDesc.val();
	}
	
	var imgs = $('.af-photo').find('.af-photo-box-item img');
	if (imgs.length > 0) {
		postImg(imgs);
		return;
	}
	
	$('#afBaseInfo').hide();
	$('#afAddress').show();
}

function submitService(){
	var returnType = $('.af-return').find('.af-service-type-select');
	if (returnType.length <= 0) {
		appui.toast('请选择商品退回方式');
		return;
	} else {
		returnTypeCode = parseInt(returnType.get(0).getAttribute('code'));
	}
	
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
	
	$('#areaName').blur();
	$('#areaPhone').blur();
	$('#areaSelectBtn').blur();
	$('#areaDetail').blur();
	
	var picStr = '';
	if (uploadImgArr != null && uploadImgArr.length > 0) {
		for (var i = 0; i < uploadImgArr.length; i++) {
			if (i == uploadImgArr.length - 1) {
				picStr += uploadbase + uploadImgArr[i];
			} else {
				picStr += uploadbase + uploadImgArr[i]+',';
			}
		}
	}
	
	var returnwareData = {};
	//if (serviceTypeCode != 10) {
		returnwareData = {
			'returnwareType':10,
			'returnwareProvince':parseInt(q('#tabProvince').getAttribute('code')),
			'returnwareCity':parseInt(q('#tabCity').getAttribute('code')),
			'returnwareCounty':parseInt(q('#tabCounty').getAttribute('code')),
			'returnwareVillage':parseInt(q('#tabTown').getAttribute('code')),
			'returnwareAddress':areaDetail
		};
	//}
	
	var postData = {
		'phone':getPhone(),
		'commitInfo':{
			'jdOrderId':parseInt(getQueryString('jdorder')),
			'customerExpect':serviceTypeCode,
			'questionDesc':questionDesc,
			'isNeedDetectionReport':hasTestReport,
			'questionPic':picStr,
			'isHasPackage':hasPackage,
			'packageDesc':packageCode,
			'asCustomerDto':{
				'customerContactName':areaName,
				'customerTel':areaPhone,
				'customerMobilePhone':areaPhone,
				'customerEmail':'admin@hexinpass.com',
				'customerPostcode':'066004'
			},
			'asPickwareDto': {
				'pickwareType':returnTypeCode,
				'pickwareProvince':parseInt(q('#tabProvince').getAttribute('code')),
				'pickwareCity':parseInt(q('#tabCity').getAttribute('code')),
				'pickwareCounty':parseInt(q('#tabCounty').getAttribute('code')),
				'pickwareVillage':parseInt(q('#tabTown').getAttribute('code')),
				'pickwareAddress':areaDetail
			},
			'asReturnwareDto': returnwareData,
			'asDetailDto': {
				'skuId':parseInt(getQueryString('sku')),
				'skuNum':parseInt($('.af-applynum-operate-num').html())
			}
		}
	};
	
	appui.showHUD();
	window.IO({ 
		url:'applyCustomerService',
		data:ts(postData),
		success: function(data){
			if (data.success == 1) {
				appui.removeHUD(1, '提交成功');
				setTimeout(function(){
					history.back();
				}, 2000);
			} else {
				appui.removeHUD(2, '提交失败：'+data.code+':'+data.msg);
			}
			
			console.log(data); 
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
}

function displayImage(e) {
	
//	console.log(e);
//	console.log(getAbsPosition(this.parentNode));
	//$(this).addClass('af-photo-scale');
}

function dealImage(path, obj, callback){
	 var img = new Image();
	 img.src = path;
	 img.onload = function(){
	  var that = this;
	  // 默认按比例压缩
	  var w = that.width,
	   h = that.height,
	   scale = w / h;
	   w = obj.width || w;
	   h = obj.height || (w / scale);
	  var quality = 0.7;  // 默认图片质量为0.7
	  //生成canvas
	  var canvas = document.createElement('canvas');
	  var ctx = canvas.getContext('2d');
	  // 创建属性节点
	  var anw = document.createAttribute("width");
	  anw.nodeValue = w;
	  var anh = document.createAttribute("height");
	  anh.nodeValue = h;
	  canvas.setAttributeNode(anw);
	  canvas.setAttributeNode(anh); 
	  ctx.drawImage(that, 0, 0, w, h);
	  // 图像质量
	  if(obj.quality && obj.quality <= 1 && obj.quality > 0){
	   quality = obj.quality;
	  }
	  // quality值越小，所绘制出的图像越模糊
	  var base64 = canvas.toDataURL('image/jpeg', quality );
	  // 回调函数返回base64的值
	  callback(base64);
	 }
}