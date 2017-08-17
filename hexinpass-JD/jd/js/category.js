
$(function(){
	
	mui.init();
	if (window.parent.setActive) {
		window.parent.setActive(1);
	}

	requestCategory();
});


// request category list from server
function requestCategory() {
	appui.showHUD();
	window.IO({ 
		url:'getCategory',
		success: function(data){
			//var data = JSON.parse(dataStr);
			console.log(data);
			if (data.success == 1) {
				appui.removeHUD();
				var selectidStr = getQueryString('selectid');
				var selectId = selectidStr == null ? 0 : parseInt(selectidStr);
				_templatePage('#category', 'categoryDetail', {list:data.results, selectid:selectId}, true);
				bindTapEvents();
				initTapEvents(selectId);
				//initScrollEvents();
			} else {
				appui.removeHUD(2, '请求失败，请稍后再试');
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			appui.removeHUD(2, '网络开小差咯');
		}
	});
}

// bind tap events
function bindTapEvents() {
	mui('#segmentedControlContents').on('tap', '.category-cell-item', function(){
		var cateId = this.getAttribute('catid');
		goto_1('goodList.html?catid='+cateId);
	});
}

// parent window relocate
function goto_1(url) {
	if (window.parent.goto) {
		window.parent.goto(url);	
	} else {
		goto_2(url);
	}
}

function goto_2(url) {
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

function initTapEvents(selectId) {
	//默认选中第一个	
	if (selectId == 0 && !$('.mui-control-item').hasClass('mui-active')) {
		$('.mui-control-item').first().addClass('mui-active');
		$('.mui-control-content').hide();
		var content0 = document.querySelector('#content0');
		$(content0).show();
		content0.setAttribute('imgload', '1');
		$(content0).find('img.category-cell-item-img').each(function(){
			var imgSrc = this.getAttribute('imgsrc');
			this.src = imgSrc; 
		});
	}
	mui('#segmentedControls').on('tap', '.mui-control-item', function(){
	    var contentId = this.getAttribute('href');
	    $('.mui-control-content').hide();
	    var currentContent = document.querySelector(contentId);
	    $(currentContent).show();
	    if (currentContent.getAttribute('imgload') == '0') {
	    		currentContent.setAttribute('imgload', '1');
	    		$(currentContent).find('img.category-cell-item-img').each(function(){
				var imgSrc = this.getAttribute('imgsrc');
				this.src = imgSrc; 
			});
	    }
	});
}

// init scroll listener and events
function initScrollEvents() {
	var controlsElem = document.getElementById("segmentedControls");
	var contentsElem = document.getElementById("segmentedControlContents");
	var controlListElem = controlsElem.querySelectorAll('.mui-control-item');
	var contentListElem = contentsElem.querySelectorAll('.mui-control-content');
	var controlWrapperElem = controlsElem.parentNode;
	var controlWrapperHeight = controlWrapperElem.offsetHeight;
	var controlMaxScroll = controlWrapperElem.scrollHeight - controlWrapperHeight;//left content maximum scrolling height
	var maxScroll = contentsElem.scrollHeight - contentsElem.offsetHeight;//right content maximum scrolling height
	var controlHeight = controlListElem[0].offsetHeight;//single height of left content
	var controlTops = []; //store values of scrollTop of controls
	var contentTops = [0]; //store values of scrollTop of contents
	var length = contentListElem.length;
	for (var i = 0; i < length; i++) {
		controlTops.push(controlListElem[i].offsetTop + controlHeight);
	}
	for (var i = 1; i < length; i++) {
		var offsetTop = contentListElem[i].offsetTop;
		if (offsetTop + 100 >= maxScroll) {
			var height = Math.max(offsetTop + 100 - maxScroll, 100);
			var totalHeight = 0;
			var heights = [];
			for (var j = i; j < length; j++) {
				var offsetHeight = contentListElem[j].offsetHeight;
				totalHeight += offsetHeight;
				heights.push(totalHeight);
			}
			for (var m = 0, len = heights.length; m < len; m++) {
				contentTops.push(parseInt(maxScroll - (height - heights[m] / totalHeight * height)));
			}
			break;
		} else {
			contentTops.push(parseInt(offsetTop));
		}
	}
	contentsElem.addEventListener('scroll', function() {
		var scrollTop = contentsElem.scrollTop;
		for (var i = 0; i < length; i++) {
			var offsetTop = contentTops[i];
			var offset = Math.abs(offsetTop - scrollTop);

			if (scrollTop < offsetTop) {
				if (scrollTop >= maxScroll) {
					onScroll(length - 1);
				} else {
					onScroll(i - 1);
				}
				break;
			} else if (offset < 20) {
				onScroll(i);
				break;
			}else if(scrollTop >= maxScroll){
				onScroll(length - 1);
				break;
			}
		}
	});
	var lastIndex = 0;
	//listen the scrolling of right contents
	var onScroll = function(index) {
		if (lastIndex !== index) {
			lastIndex = index;
			var lastActiveElem = controlsElem.querySelector('.mui-active');
			lastActiveElem && (lastActiveElem.classList.remove('mui-active'));
			var currentElem = controlsElem.querySelector('.mui-control-item:nth-child(' + (index + 1) + ')');
			currentElem.classList.add('mui-active');
			//simply deal with left scrolling, scrolling either to the bottom or to the top
			var controlScrollTop = controlWrapperElem.scrollTop;
			if (controlScrollTop + controlWrapperHeight < controlTops[index]) {
				controlWrapperElem.scrollTop = controlMaxScroll;
			} else if (controlScrollTop > controlTops[index] - controlHeight) {
				controlWrapperElem.scrollTop = 0;
			}
		}
	};
	//scrolling to specified content
	var scrollTo = function(index) {
		contentsElem.scrollTop = contentTops[index];
	};
	mui(controlsElem).on('tap', '.mui-control-item', function(e) {
		scrollTo(this.getAttribute('data-index'));
		return false;
	});
}
