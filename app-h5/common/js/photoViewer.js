
function PhotoViewer(){
}
PhotoViewer.init=function(param) {
	$(param.sel).live(param.triggerEvent, function(e){
		if (e.target.tagName != 'img' && e.target.tagName != 'IMG') {
			return false;
		}
		displayPhoto(this, param);
	});
};
//
//PhotoViewer.init({
//	sel:'.good-list-item-imghd',
//	events:'hover',
//	background:true,
//	scale:2,
//	width:$(window).width()/2-10.5, 
//	height:$(window).width()/2-10.5     
//}); 

function displayPhoto(obj, param) {
	var sw = $(window).width();
	var sh = $(window).height();
	var st = document.body.scrollTop;
	var scrollHeigth = sh+st;
	var maskLayer = document.createElement('div');
	maskLayer.style.cssText = 'position: absolute;left: 0;right: 0;top: 0;bottom: 0;background-color: rgba(0,0,0,.5);height: '+scrollHeigth+'px;';
	
	var imgElement = obj;
	if (obj.tagName != 'IMG' && obj.tagName != 'img') {
		imgElement = obj.querySelector('img');
	}
	var ratio = imgElement.naturalWidth / sw;
	var ratioWidth = sw;
	var ratioHeight = imgElement.naturalHeight / ratio;
	if (ratioHeight > sh) {
		ratioHeight = sh;
		ratio = imgElement.naturalHeight / sh;
		ratioWidth = imgElement.naturalWidth / ratio;
	}
	var scale = ratioWidth / imgElement.width;
	if (param.scale != undefined) scale = param.scale; 
	var abp = getAbsPosition(obj);
	var moveXPoint = 0; 
	var moveYPoint = 0;

	var copyImg = imgElement.cloneNode(true);
	copyImg.style.position = 'absolute';
	if (ratioWidth > ratioHeight) {
		copyImg.style.width = param.width + 'px';
		copyImg.style.height = 'auto';
		copyImg.style.left = abp.x+'px';
		copyImg.style.top = abp.y + st + (param.height - imgElement.height)/2 + 'px';
		moveXPoint = (sw - ratioWidth) / 2 - abp.x;
		moveYPoint = (sh - ratioHeight) / 2 - abp.y - (param.height - imgElement.height)/2;
	} else {
		copyImg.style.width = 'auto';
		copyImg.style.height = param.height + 'px';
		copyImg.style.left = abp.x + (param.width - imgElement.width)/2 + 'px';
		copyImg.style.top = abp.y + st + 'px';
		moveXPoint = (sw - ratioWidth) / 2 - abp.x - (param.width - imgElement.width)/2;
		moveYPoint = (sh - ratioHeight) / 2 - abp.y;
	}
	
	if (!param.background) {
		maskLayer.style.backgroundColor = 'rgba(1,1,1,0)';
	} 
	document.body.appendChild(maskLayer); 
	maskLayer.appendChild(copyImg);
	
	copyImg.style.transition = 'all 300ms ease-in-out';
	copyImg.style.transformOrigin = '0 0';
	copyImg.style.transform = 'translate('+ moveXPoint +'px,'+ moveYPoint +'px) scale(' + scale + ')';
	copyImg.addEventListener(param.cancelEvent, function(){
		copyImg.style.transform = 'none';
		setTimeout(function(){
			document.body.removeChild(maskLayer);
		}, 300);
	});  
}

function getAbsPosition(element) {  
    var abs={x:0,y:0}  
    //if is compatible for current browser
    if (document.documentElement.getBoundingClientRect) {               
        //getBoundingClientRect() belongs to jQuery object
        abs.x = element.getBoundingClientRect().left;           
        abs.y = element.getBoundingClientRect().top;  
        abs.x += window.screenLeft + document.documentElement.scrollLeft - document.documentElement.clientLeft;  
        abs.y += window.screenTop + document.documentElement.scrollTop - document.documentElement.clientTop;  
    } else {   //if is not compatible for current browser  
        while(element!=document.body) {  
            abs.x+=element.offsetLeft;  
            abs.y+=element.offsetTop;  
            element=element.offsetParent;  
        }  
	    //caculate relative coordinates
	    abs.x += window.screenLeft + document.body.clientLeft - document.body.scrollLeft;  
	    abs.y += window.screenTop +  document.body.clientTop - document.body.scrollTop;  
    }  
    return abs;  
}  